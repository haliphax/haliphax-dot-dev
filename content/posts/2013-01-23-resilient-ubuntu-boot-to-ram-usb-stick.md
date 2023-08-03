---
title: "Resilient Ubuntu boot-to-RAM USB stick"
tags: ["post", "admin", "linux", "shell", "tutorial", "ubuntu", "vm"]
layout: post
---

_(Ubun2RAM) - Updated for 13.10_

I love my little-engine-that-could media server machine. It runs
incredibly well on hardware from at least two generations ago; it is
completely headless; the entire system loads itself into RAM in the form
of a compressed file system; it all fits onto a bootable USB stick; and
I can back it up and rebuild it with ease, thanks to the virtualization
capability of Oracle's [VirtualBox](https://www.virtualbox.org) software.
This is my recipe (of sorts) for building your very own.<!--more-->

**Originally written for Ubuntu 12.04 LTS (_precise_), this walkthrough
has been updated and tested for Ubuntu 12.10 (_quantal_), 13.04
(_raring_), and 13.10 (_saucy_).**

This setup uses Ubuntu's (actually, Debian's) `live-boot` initramfs
scripts, the `squashfs` file system, the `aufs` file system, and
VirtualBox to provide several advantageous features:

- The flash drive is only read at boot, while the live environment
  runs entirely from RAM thanks to `aufs`—sparing your USB stick from
  the I/O onslaught of a running system
- VirtualBox's _snapshot_ feature makes for a fantastic method of
  version control for the squashed system image
- A system much larger than would ordinarily fit on the removable
  media (and that would fit in RAM) can be built thanks to the
  compression of `squashfs`

On with the show...

_(Also—in the interest of disclosure, this post will probably see some
tweaking here and there as I refine my process.)_

**Materials:**

- VM host machine (w/ Oracle VirtualBox)
  - VM #1: 15GB+ HDD ("Build Box")
  - VM #2: 8GB+ HDD ("Thumb Box")
- Physical machine ("Target")
- 2GB+ USB stick
- Ubuntu 13.10 Server ISO

**Overview:**

1.  Pave your two VMs (Build Box & Thumb Box) and your destination
    machine (Target)
2.  Build a customized kernel with built-in AUFS and SquashFS support
3.  Install the kernel to Thumb Box and Target
4.  Add live-boot initrd images to Thumb Box and Target
5.  Install/update software on Thumb Box as needed
6.  Trim and squash the file system from Thumb Box into a squashfs image
7.  Push the image down to Target
8.  Reboot your destination machine into the updated image
9.  Repeat steps 5-8 to modify the squashed Ubun2RAM file system
    (configuration changes, update/add/remove software, etc.)

**Notes:**

- To make room for building the squashed file system prior to transfer
  (and to take advantage of the space that squashfs will save), the
  Target VM's file system should be 3-4 times the size of the USB
  stick it will be pushed to.
- Pave all machines with the _Install minimal system_ option from the
  _Modes_ (F4) menu in the Ubuntu ISO launch screen.
- The _Thumb Box_ and _Target_ installations do not require a
  swap partition. The singular partition on each should be set up with
  an `ext3` file system. You may choose to use a swap partition on
  separate media, however, if you wish.
- Tip: When paving the Target machine, _you can install Ubuntu to the
  USB stick!_ You do not need a hard drive on this machine—you can
  boot from portable media into RAM. You can certainly take advantage
  of attached storage on that machine from within your Ubun2RAM
  system, but the base system itself can live entirely on the
  USB stick.
- All 3 of the machines can be paved from within VirtualBox; you just
  need to [make a VMDK proxy for your USB
  stick](https://www.sysprobs.com/access-physical-disk-virtualbox-desktop-virtualization-software)
  so that you can boot from it on a bare VM in order to pave it. (I
  have a machine setup with no storage of its own—just the
  VMDK proxy.)
- I found that the `bc` package is now needed for building the
  _saucy_ kernels.

_In the shell command listings below, if there is a comment with no
commands on the following line, that signifies that there is something
you need to do at that point. Reading the comment should provide enough
explanation as to what you need to do (i.e., transfer files from one
server to another, create the grub boot script, etc.)._

**Build Box:**

```shell
# get build tools
sudo apt-get install fakeroot build-essential crash kexec-tools makedumpfile kernel-wedge kernel-package git-core libncurses5 libncurses5-dev libelf-dev asciidoc binutils-dev bc -y
# get dependencies
sudo apt-get build-dep linux -y
# clone the kernel repo (and go have some coffee)
git clone git://kernel.ubuntu.com/ubuntu/ubuntu-saucy.git saucy
cd saucy
# get a list of kernels
git tag -l

# choose which kernel you wish to build, then use it in the checkout command below

# checkout a kernel branch into a working branch
git checkout -b work Ubuntu-3.11.0-12.19
# build the necessary control scripts, as Ubuntu git kernels do not include them by default
fakeroot debian/rules clean
# configure your kernel
make menuconfig

# set AUFS (Ubuntu 3rd party drivers) and SquashFS (File systems -> Miscellaneous) as built-in

# set processor governor to 'ondemand' (Power management and ACPI options -> CPU Frequency scaling)

# parallel build; change this to 1+(number of processors) based on your machine specs
export CONCURRENCY_LEVEL=3
# build your kernel
fakeroot make-kpkg --initrd --append-to-version=-saucy-custom kernel-headers kernel-image
```

**Target:**

    ```shell

# get live-boot and squashfs stuff

sudo apt-get install live-boot live-boot-initramfs-tools squashfs-tools -y

# pull down your kernel and headers packages from Build Box

# install them

sudo dpkg -i linux-image-_.deb
sudo dpkg -i linux-headers-_.deb

# reboot into your new kernel so that it is used when we update-grub below!

# create /etc/grub.d/50_ramsession

# make it executable

sudo chmod +x /etc/grub.d/50_ramsession

# set GRUB_DEFAULT='Ubun2RAM' in /etc/default/grub

# rebuild the grub bootloader menu to include Ubun2RAM

sudo update-grub

````

**/etc/grub.d/50_ramsession (Target):**

	```shell
#!/usr/bin/env bash
cat <<EOF
# ram session; disable apparmor and boot read/write squashfs/aufs combo from /live/filesystem.squashfs
menuentry 'Ubun2RAM' --class ubuntu --class gnu-linux --class gnu --class os {
		linux /boot/vmlinuz-$(uname -r) BOOT=LIVE boot=live toram=filesystem.squashfs rw quiet splash nonetworking apparmor=0 security="" $vt_handoff
		initrd /boot/initrd.img-$(uname -r)
}
EOF
````

**Thumb Box:**

```shell
# get squashfs tools
sudo apt-get install squashfs-tools -y

# pull down your kernel and headers packages from Build Box

# install them
sudo dpkg -i linux-image-*.deb
sudo dpkg -i linux-headers-*.deb

# install/update whatever software you want at this point (start here if you already have a working Ubun2RAM and you're just updating it)

# next, we make the file system image (do this each time you update or install software)
sh makeimage.sh
# push your squashed file system image to the USB stick when you're done installing stuff
sh pushimage.sh
```

**makeimage.sh (Thumb Box):**

```shell
#!/usr/bin/env bash

# usage: makeimage.sh [staging folder] [device]

# default value for staging folder
STAGING=/var/squashfs
# pull staging folder from command line arguments if any
if [ $1 ]; then
		STAGING=$1
		shift
fi

# make the staging folder if it doesn't exist
[ !-d ${STAGING} ] && sudo mkdir -p ${STAGING}
# if staging folder is on a device, mount it
[ $1 ] && sudo mount $1 ${STAGING}
# copy the system into the staging folder, excluding unnecessary parts
sudo rsync -avxW --delete / ${STAGING} \
		--exclude=/proc/* --exclude=/tmp/* --exclude=/dev/* --exclude=/sys/* \
		--exclude=/boot/* --exclude=/etc/mtab --exclude=/live \
		--exclude=/var/cache/apt/archives/*.deb --exclude=/var/run \
		--exclude=/var/mail --exclude=/var/lock --exclude=/var/backups \
		--exclude=/var/tmp \
		--exclude=${STAGING}
# remove the root mount from the squashed /etc/fstab
sudo sed -i '/\^[\^ ]+ \/ /d' ${STAGING}/etc/fstab
# increase the device number of the NIC in squashed /etc/network/interfaces
sudo sed -i 's/eth1/eth2/' ${STAGING}/etc/network/interfaces
# trim logs from staging folder
[ -n "$STAGING" ] && sudo find ${STAGING}/var/log -type f -iregex '.*\.[0-9].*' -exec rm -v {} \;
[ -n "$STAGING" ] && sudo find ${STAGING}/var/log -type f -iname '*.gz' -exec rm -v {} \;
[ -n "$STAGING" ] && sudo find ${STAGING}/var/log -type f | while read file; do echo -n '' | sudo tee $file; done
# make the squashfs file from the staging folder contents
sudo mksquashfs ${STAGING} filesystem.squashfs -noappend -always-use-fragments
# if we mounted a device for staging, unmount it
[ $1 ] && sudo umount $1
```

**pushimage.sh (Thumb Box):**

```shell
#!/usr/bin/env bash

# usage: pushimage.sh [destination device] [mount point]

# default values
DEST=/dev/sdb1
WHERE=/mnt

# pull destination device from command line arguments if any
if [ $1 ]; then
		DEST=$1
		shift
fi

# pull mount point from command line arguments if any
[ $1 ] && WHERE=$1
# mount the device
sudo mount ${DEST} ${WHERE}
# send the squashed file system to the device
sudo rsync -rvW --progress filesystem.squashfs ${WHERE}/live/
# unmount the device
sudo umount ${DEST}
```

**More information:**

- [Pulling specific kernel versions from the Ubuntu kernel git
  repositories](https://wiki.ubuntu.com/Kernel/Dev/KernelGitGuide)
- [Compiling your own Ubuntu
  kernel](https://help.ubuntu.com/community/Kernel/Compile)<a>
