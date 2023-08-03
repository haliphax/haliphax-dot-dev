---
title: "Backup automation and emailing attachments in Linux"
tags: ["post", "linux", "shell", "sql", "tool"]
layout: post
---

Any programmer who's ever been burned by data loss can tell you—you've
**got** to have backups of your work. If it's code, perhaps they use a
version control system such as Subversion. If it's something a little
less-readily available, such as a weekly database text file dump, it
might take a bit more work.<!--more-->

I've recently been developing a persistent browser-based game in PHP
(CodeIgniter framework), Javascript (jQuery framework), and SQL (MySQL
RDBMS back-end). So far, the code is pretty solid, and I'm quite happy
with my progress. However, my hosting solution is less than reliable,
and lately, I've felt an increasingly urgent need for backing certain
things up in my GMail inbox rather than trust their backup system.

Here's the scenario: I am using an external (and reliable) Subversion
host for my code, and so I breathe easy for the most part knowing that
it's not under the umbrella of my shaky hosting provider. The MySQL
databases involved in the project, however, live on the unstable system
in question. Since switching providers is not presently feasible (which
I will explain later), I decided I would take advantage of Linux's
powerful command-line scripting options and create a cronjob that would
e-mail me a compressed tarball of the weekly mysqldump output. Simple
enough, yeah?

Well... almost. I'll get to that in a minute. Let's start with the first
piece of the finished product: the _mysqldump_ command.

    mysqldump -u<username> -p<password> --ignore-table=first_db.some_table --databases first_db second_db > backup.sql

Now, let's break that command down piece by piece:

- **mysqldump** - This command is used to dump the structure and/or
  contents of one or more MySQL databases to the console (or, as we
  will be doing, through a command pipeline to a text file).
- **-u<username>** - This option designates the username to
  connect to the MySQL server with. In this case, I am using a
  meaningless placeholder. Replace it with your desired username.
- **-p<password>** - This option designates the password to
  connect to the MySQL server with. Keep in mind that this parameter
  will show up in _proc_ for a short time, and other users on your
  system will be able to view it. You might consider an alternative
  method (or leverage a MySQL account with restricted privileges).
- **--ignore-table=first_db.some_table** - This option specifies a
  table that I would not like to include in the _mysqldump_ results.
  Maybe it's full of cruft, maybe it's expendable—the point is, we
  don't want it in there. To specify multiple tables to ignore, simply
  reuse the directive. "first_db" and "some_table" are just used as
  an example, but note that table names must be prefixed with their
  database name.
- **--databases first_db second_db** - This option specifies
  which database(s) we will be dumping the structure and/or
  contents of. The option flag is unnecessary if there is only one
  database and it is the last token in the command line. In this case,
  "first_db" and "second_db" are used as example database names.

The last bit of the command line uses the shell's output redirection
token (the greater-than symbol) to write the results of the _mysqldump_
command to a file ("backup.sql" in the example).

Now that we've got our database dump in a text file, let's compress it
and e-mail it to ourselves, right?

Well... almost. Here's where I ran into a tad bit of a snag. You see,
compressed files—at least the one we're about to create—are full of
binary data (rather than textual data), and as such, tend to be
mercilessly flogged during transfer through SMTP and the like. How can
we represent the binary file as textual data in order to send it via
email, you ask? The answer, my friends, is _uuencode!_ First, though,
let's look at the snippet for compressing the _mysqldump_ output.

    tar cjf backup.tar.bz2 backup.sql otherfile.txt]

So, what are we doing there?

- **tar cjf** - The _tar_ command, or <span
  style="text-decoration: underline;">t</span>ape <span
  style="text-decoration: underline;">ar</span>chive, is used to
  gather a list of files into one "tarball"—basically, an
  uncompressed archive. The "cjf" options we're passing to the _tar_
  command signify three things:
  - **c** - Create a new tarball with the file(s) specified.
  - **j** - Compress the tarball using the _bzip2_ program.
  - **f** - Specify which file(s) to roll together in the tarball.
- **backup.tar.bz2** - This is our desired created archive name. This
  is what we will be emailing to ourselves in a moment.
- **backup.sql otherfile.txt** - These are the files used in our
  example which will be added to the "backup.tar.bz2" archive. I have
  included more than just the _mysqldump_ output in order to
  illustrate the usefulness of _tar_ in archiving multiple files for
  _bzip2_ to compress.

Now that we've created a (binary) compressed archive of the files we
want to email, we'll need to encode them as textual data by using the
_uuencode_ command. In this next snippet, we'll be encoding the archive
we just made and routing it through the _mail_ command to email it to
ourselves.

    uuencode backup.tar.bz2 backup.tar.bz2 | mail me@mydomain.com -s "weekly backup"]

The reason for duplicating the archive name when invoking the _uuencode_
command is that the first represents the local file name and the second
represents the destination filename (for when the data is decoded on the
receiving end). When we pipe the output of our _uuencode_ operation
through _mail_, most email clients will immediately recognize the
encoded text as a file attachment and handle it appropriately.

We pass the _mail_ command our destination address first, and then,
using the **-s** flag, we provide the subject for the email message. If
you like, you can even use a bit of fancy footwork to send through a
message body separate from the attachment—but that's for another post
entirely.

So, we've stepped through each of the necessary processes in dumping,
collecting, compressing, encoding, and emailing our database backup.
When we string them all together into one text file like so, we have a
quaint little package that can be tied into _crontab_ for scheduling:

    rm backup.tar.bz2
    mysqldump -u<username> -p<password> \
        --ignore-table=first_db.some_table \
        --databases first_db second_db > backup.sql
    tar cfj backup.tar.bz2 backup.sql otherfile.txt
    rm backup.sql
    uuencode backup.tar.bz2 backup.tar.bz2 | mail me@mydomain.com -s "weekly backup"

I've set up a very similar script to send me the database dump of my
project (and its accompanying wiki) every Monday morning, and it's
working like a dream. Hopefully, you will be able to leverage this
collection of simple command-line utilities to similarly-beneficial
ends! (Note: The "rm" commands were added to clean up copies of the
files from previous script runs. By default, _bzip2_ will not create the
archive if the filename specified already exists.)
