---
title: "Kill all shared memory segments in Linux"
tags: ["post", "linux", "my-software", "regex", "shell", "tool"]
layout: post
---

_[See update below.](#update)_

I recently whipped up a shell script to kill all (IPC) shared memory
segments in Linux for a client on oDesk. He wound up going with another
contractor's offer, and so I figured I would post my script here for the
benefit of all.<!--more-->

```bash
ipcs -m | cut -d' ' -f2 | grep '^[0-9]' | while read $x; do ipcrm -m $x; done
```

Here's what the individual pieces do:

1. **ipcs -m** - This command lists all current shared memory segments.
   (Using -s would list semaphores, etc.)
2. **cut -d' ' -f2** - This command _cuts_ 2nd column from the _ipcs_
   output, using spaces as its delineating mark.
3. **grep '^[0-9]'** - This command only allows results which begin
   with a number to pass through. (We don't want the header output from
   _ipcs_ to mess with our process.)
4. **while read $x...** - This command iterates over the output from
   the previous commands—which, by this point, will be the identifying
   number belonging to each shared memory segment—and runs the _ipcrm_
   IPC removal command against that output.

If you've got an unruly list of shared memory segments on your Linux
machine and you just want them all to go away, fret no longer!

---

<a name="update"></a>
**Update 2020-02-17**

This, for some reason, is one of my most popular blog posts. As such, I feel
like it deserves an update now that I've leveled up a bit in my Linux usage.
Here is a more succinct method that should be easier to understand and more
universal:

```bash
for x in $(ipcs -m | awk 'NR>1 {print $2}'); do ipcrm -m $x; done
```

The differences are:

1. **awk 'NR>1 {print $2}'** - This uses `awk` to print the 2nd column of each
   line of output, but only when the line number is greater than 1. This
   skips the first line of output containing the headers from `ipcs`. Now
   we no longer need `cut` nor `grep`.
2. Instead of piping output to a _while_ loop, the `$()` syntax is used inline
   as the argument of a _for_ loop. Now we no longer need `read`.

Cheers!
