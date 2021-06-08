---
title: "bulkRename v2.0 released"
tags: ['post', 'c-sharp', 'my software', 'tool']
layout: post
---

I've converted my bulk file renaming utility from VB.NET to C\# and made
use of a [command line arguments parsing
library](http://www.codeproject.com/KB/recipes/command_line.aspx) so
that it will accept folders and regex patterns with spaces in them. It
behaves a bit weird if you don't encapsulate your arguments in quotation
marks (") or if you forgo the use of an equals sign (=) between the
parameter flag and its argument, but those are small concessions to
make.

You can [download
v2.0](https://oddnetwork.org/hx/bulkRename-2.0.zip) to use
yourself.<!--more--> The source is below:

    #!csharp
    /***
    * Title: bulkRename
    * Author: haliphax
    * Version: 2.0
    * Date: 2011/11/29
    * Description:
    * Rename files in bulk given a root folder, a regex to compare
    * against for filename matches, and a new naming convention which
    * can use group references from the filename regex.
    ***/

    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Text.RegularExpressions;
    using CommandLine.Utility;

    namespace bulkRename
    {
        class Program
        {
            static void Main(string[] args)
            {
                // parse command line arguments
                Arguments cmd = new Arguments(args);
                // "letterhead"
                Console.Out.WriteLine("\nbulkRename v2.0 by haliphax - 2011/11/29");
                Console.Out.WriteLine("=========================================");
                // grab root dir
                String root = Environment.CurrentDirectory;
                if(cmd["r"] != null)
                    root = cmd["r"];

                // validate parameters
                if(root == null || cmd["c"] == null || cmd["n"] == null)
                {
                    // get my filename
                    string cmdFileName = System.Diagnostics.Process.GetCurrentProcess().MainModule.FileName;
                    cmdFileName = cmdFileName.Substring(cmdFileName.LastIndexOf('\\') + 1);
                    // show syntax
                    Console.Out.WriteLine("Syntax: " + cmdFileName + " [-r=\"\"] [-t] -c=\"\" -n=\"\"");
                    Console.Out.WriteLine("Options:");
                    Console.Out.WriteLine(" -r ==> Folder to search [OPTIONAL]");
                    Console.Out.WriteLine(" -t ==> Test only (do not rename) [OPTIONAL]");
                    Console.Out.WriteLine(" -c ==> Current naming convention (regex pattern)");
                    Console.Out.WriteLine(" -n ==> New naming convention (regex pattern)");
                    Console.Out.WriteLine("NOTE: The quotation marks are important!");
                    return;
                }

                // test regex for flaws
                try
                {
                    Regex.Match("", cmd["c"]);
                }
                catch(Exception ex)
                {
                    Console.Out.WriteLine("Error: " + ex.Message);
                    return;
                }

                // trim root if it has a trailing backslash
                if(root.EndsWith("\\"))
                    root = root.Substring(0, root.Length - 1);

                // load files in root folder
                string[] files = null;

                // attempt to grab list of files
                try
                {
                    files = System.IO.Directory.GetFiles(root);
                }
                catch(Exception ex)
                {
                    Console.Out.WriteLine("Error: " + ex.Message);
                    return;
                }

                if(cmd["t"] != null)
                    Console.Out.WriteLine("*** TEST ONLY, WILL NOT RENAME ***");
                int counter = 0;
                Boolean errors = false;
                Console.Out.WriteLine("* Root Folder: " + root);

                // iterate through file list and check for matches
                foreach(String fileName in files)
                {
                    // file matches regex for current convention
                    if(! Regex.Match(fileName, cmd["c"]).Success)
                        continue;
                    // build new file name and output renaming action
                    String newFileName = Regex.Replace(fileName, cmd["c"], cmd["n"],
                    RegexOptions.Singleline);
                    String displayName = fileName.Substring(root.Length + 1);
                    String newDisplayName = newFileName.Substring(root.Length + 1);
                    Console.Out.WriteLine(displayName + " ==> " + newDisplayName);

                    // actually rename if not in test mode
                    if(cmd["t"] == null)
                    {
                        try
                        {
                            System.IO.File.Move(fileName, newFileName);
                            counter++;
                        }
                        catch(Exception ex)
                        {
                            Console.Out.WriteLine("Error: " + ex.Message);
                            errors = true;
                        }
                    }
                }

                // summary
                if(cmd["t"] == null)
                    Console.Out.WriteLine("* Files renamed: " + counter);
                if(errors)
                    Console.Out.WriteLine("NOTE: There were errors encountered while processing the batch");
            }
        }
    }
