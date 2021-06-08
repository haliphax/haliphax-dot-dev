---
title: "Selective backup/copy script for moving files into production"
tags: ['post', 'my software', 'php', 'tool']
layout: post
---

Whenever our web site needs to undergo re-branding, there is always the
hassle of creating both the selective package of files to move into
production from development and the selective back-up of the necessary
files already on the production server. While this is not a
soul-crushingly elaborate and tedious task, it still takes time that
could be better spent elsewhere in the project. With this in mind, I
created a simple PHP script that will mirror the directory structure and
only those files that will be changed in the process as it copies the
files from development into production.<!--more-->

**PHP Code:**

    #!php
    <?php
    /*
    * Program: Recursive Folder Backup
    * Author: haliphax
    * Created: 2011/10/3
    *
    * This script is used to selectively replace folders and files in a directory
    * structure, backing up the affected files and folders as it goes along. Say
    * you have a development copy of your web site's structure and a live copy of
    * the structure; this script can be used to push the development copy over
    * the live one and back up only those files that would be replaced in the
    * process.
    *
    ***/

    error_reporting(E_ERROR);

    // log stuff *and* send it to the console
    function logthis($text)
    {
        global $log;
        echo $text;
        fwrite($log, $text);
    }

    // recursive traversal function
    function process_directory($dir)
    {
        global $basedir, $repdir, $bakdir;
        logthis("Processing $dir\n");

        if(is_dir($dir))
        {
            if($dh = opendir($dir))
            {
                while(($file = readdir($dh)) !== false)
                {
                    // ignore "." and ".." pseudo-directories
                    if($file == '.' || $file == '..')
                        continue;
                    // get the full pathname for the file
                    $filename = $dir . DIRECTORY_SEPARATOR . $file;
                    $original = str_replace($basedir, $repdir, $filename);
                    $backup = str_replace($basedir, $bakdir, $filename);

                    // if it's a directory, create a mirror and recurse
                    if(is_dir($filename))
                    {
                        logthis("Mirroring: $original ==> $backup\n");

                        if(! mkdir($backup, 0777, true))
                        {
                            logthis("[ERROR] Unable to make mirror directory $backup\n");
                            exit();
                        }

                        process_directory($filename);
                    }
                    // otherwise, back up the file
                    else
                    {
                        logthis("Backing up: $original ==> $backup\n");

                        // check to see if it exists in the original before backing it up
                        if(! file_exists($original))
                            logthis("[NOTICE] File not present in old directory\n");
                        // back it up, die on error
                        else if(! copy($original, $bakdir . DIRECTORY_SEPARATOR . $file))
                        {
                            logthis("[ERROR] Unable to backup file\n");
                            exit();
                        }
                    }
                }

                closedir($dh);
            }
            else
            {
                logthis("[ERROR] Unable to open directory: $dir\n");
                exit();
            }
        }
        else
        {
            logthis("[ERROR] Not a directory: $dir\n");
            exit();
        }
    }

    // check for invocation errors
    if($argc < 3)
    die("\nSyntax: {$argv[0]} <new directory> <old directory> <backup directory>\n");
    // pull parameters
    $basedir = $argv[1];
    $repdir = $argv[2];
    $bakdir = $argv[3];
    $log = fopen("{$argv[0]}.log", "a");
    echo "\n";
    // ready, set, go!
    process_directory($basedir);
    fclose($log);

While it's certainly not perfect—the `str_replace` calls are not
sensitive to the folder name's location in the string, for example—it
gets the job done in most imaginable circumstances. To use it, call it
like so:

    php backupscan.php c:\path\to\production c:\path\to\development c:\path\to\backup
