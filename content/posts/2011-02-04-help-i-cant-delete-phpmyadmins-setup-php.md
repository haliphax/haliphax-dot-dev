---
title: "Help! I can't delete phpMyAdmin's setup.php"
tags: ["post", "linux", "php", "shell"]
layout: post
---

I've got a VPS server running Debian 5 "lenny" and recently attempted to
perform several software upgrades to bring it up to speed (it had been
longer than I care to admit). However, the upgrade for the phpMyAdmin
package continually failed, stating that it was unable to remove
`/usr/share/phpmyadmin/scripts/setup.php`. The file had apparently been
given the file permissions mask of "000", which essentially denies any
sort of action being taken against the file. "No problem," I thought,
"I'll just chmod it to allow deletion and be on my merry way!" Well...
it _was_ a problem.<!--more-->

I was unable to change any of the file permissions or its
owner/group—even with superuser privileges (and even under the `root`
account itself)! After doing some fairly extensive research about \*nix
file permissions (and being lead down several dead-end roads claiming
that changing the file permissions via an FTP connection or modifying my
`/etc/fstab` file to set the default mask for files to 777 would resolve
the issue), I discovered my savior: the `chattr` command.

The file had somehow been flagged as "immutable", "undeletable", or a
combination thereof. In the end, I wound up changing the attributes list
to "compressed" and stripped away all other attributes (since this
seemed like the least dangerous way to go about messing with the
attributes). After that, I was able to successfully change the file's
permission mask, delete it, and move on with my phpMyAdmin upgrade.

**Shell command:**

    chattr -c /usr/share/phpmyadmin/scripts/setup.php

I hope this helps at least one of you out there, as it had me tearing my
hair out for quite some time.
