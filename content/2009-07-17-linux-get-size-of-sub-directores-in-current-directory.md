---
title: "Linux: Get size of sub-directores in current directory"
tags: ['post', 'linux', 'shell', 'tool']
layout: post
---

**Edit:** Now that I'm more familiar with the Linux command line, I
realize that I was trying to reinvent the wheel. I don't know if I
missed this part of the `du` manpage or what, but the functionality I
was looking for is baked in:

    du -hd 1

The **h** flag is for "human-readable format", and **d 1** tells the
program to go "no deeper than 1 level from the given folder". (With no
folder specified, the current directory is used.)

---

<s>The following string of commands can be used to not only list the
immediate sub-directories of the current directory, but also print their
size in human-readable format (kilobytes):</s>

    du -sh `ls -l | grep '^d' | awk '{print $9}'`

<s>Here's how it works:</s><!--more-->

-   <s>**du** is the main command, which is used to list the size of the
    current directory tree. The **-sh** flags state that only the
    current-level sub-directories are to be listed, and that they should
    be listed in kilobytes (K).</s>
-   <s>The "back-ticks" (`) execute commands inline, within the context
    of the current command. This means that everything inside these
    back-ticks will be used on the command-line parameters for **du**.</s>
-   <s>**ls -l** lists files and directories with additional information
    (security flags, size, owner, group, etc.). This is the main command
    of the inline command string delineated by the back-ticks.</s>
-   <s>**grep** is a command-line utility for parsing text using
    regular expressions. The **'^d'** parameter passed to it is a
    regular expression pattern that only matches lines beginning with
    "d" (which are directories, given the output of **ls -l**).</s>
-   <s>**awk** is a different sort of parsing/formatting tool. **'{print
    $9}'** sends it a command to print the 9th column of output it
    receives (from **grep**).</s>

<s>Put them all together, and they work like a well-oiled machine to
produce a new, specific utility. The utility can become a part of your
regular Linux command-line arsenal by creating a text file out of it and
flagging it as executable.</s>

---

<s>**Update:** [EspadaV8](http://espadav8.co.uk/) posted a wonderful
suggestion for trimming the fat from this command by avoiding the use of
`awk` and piping altogether. Give it a try yourself:</s>

    du -sh `ls -d */`
