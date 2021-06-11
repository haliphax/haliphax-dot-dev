---
title: "URL rewriting template engine"
tags: ['post', 'apache', 'lighttpd', 'my-software', 'php', 'regex', 'tool']
layout: post
---

My employer is currently in the process of standing-up a content
management system (CMS). In the process of migrating links on our
existing site to the new CMS site, there are going to be—at least, at
first—a metric tonne of possible URL redirects necessary. Since the
majority of these will fall into a handful of categories, I began
creating IIRF ([Ionic ISAPI Rewrite
Filter](http://www.codeplex.com/IIRF)) URL rewriting rules that would,
for instance, move a particular list of "Offices" from
*/offices/officename* to *http://newserver/offices/officename*. **(Note:
These directives should be compatible with Apache's mod_rewrite, and
even lighttpd's url.rewrite, as well.)**<!--more-->

There is a specific list of sites that exist on our old server and a
specific list of those that exist on the new server (or at least, there
is until the migration is complete). Once I started plugging in a
[regular expression](http://www.regular-expressions.info) "selection
structure" (i.e., *(one|two|three)* meaning "one or two or three"), it
became painfully obvious that this format would quickly spiral into a
maintenance nightmare. As such, I have created a small script for
building IIRF "templates" that can use placeholders for these mammoth
lists of "Offices".

Here's the gist: You create a template file identical to your IIRF INI
file, except that you replace those cumbersome regex selection
structures with placeholders (i.e., *{MY_PLACEHOLDER}*). Then, for each
placeholder you've used in your template, you create a map file. This
map file contains a list of all the possibilities to be included in the
selection structure, each on a new line of the file. The first line of
the file, of course, contains the placeholder value to match this
selection structure up to the template.

**Example template:**

    RewriteCond %{HTTP_URL} ^/offices/{MY_PLACEHOLDER}.* [I]
    RedirectRule ^/offices/(.+) http://newserver/offices/$1

**Example map:**

    MY_PLACEHOLDER
    one
    two
    three

Running the script against the template (understanding that your map
file is in the same directory), the outputted INI file will look like
this:

**Final output:**

    RewriteCond %{HTTP_URL} ^/offices/(one|two|three).* [I]
    RedirectRule ^/offices/(.+) http://newserver/offices/$1

With that in place, *http://oldserver/offices/one/anypage* will redirect
to *http://newserver/offices/one/anypage* (and so on), while
*http://oldserver/offices/four/anypage* will not be redirected at all.

Without further adieu, here's the logic:

**PHP code:**

    #!php
    <?php
    /*******************************************************************************
    Program: IIRF Templating Engine
    Author: haliphax
    Created: 12/10/2009
    Changed: Never
    Description:

    This script will load any number of *.map files of the following
    format:

    PLACEHOLDER_NAME
    map node
    map node
    ...

    Any instance of the placeholder's name found in the template file will be
    replaced by its node values for use in regular expressions. Map nodes are
    concatenated into a regex selection structure, such as "(one|two|three)".
    When searching the template file for a placeholder name, the placeholder name
    must be surrounded by curly braces, such as "{MY_PLACEHOLDER}". This script can
    be used to build and maintain lists of values to be used in IIRF rewrite rules
    independently of IIRF's configuration files.
    *******************************************************************************/

    # check args
    if($argc < 3) die("Synax: iirfMap.php <template filename> <ini filename>\\n");
    # check template
    if(! file_exists($argv[1])) die("Template file does not exist.\\n");
    # load template
    $iirf = file_get_contents($argv[1]);
    $maps = array();

    # load placeholder maps
    foreach(glob('*.map') as $f)
    {
        $map = fopen($f, 'r');
        # get placeholder name
        $ph = trim(fgets($map));
        $a = 0;
        $maps[$ph] = '(';

        # build selection structure from node values
        while(! feof($map))
        {
            $in = trim(fgets($map));

            if(strlen($in) > 0)
                $maps[$ph] .= ($a++ > 0 ? '|' : '') . $in;
        }

        $maps[$ph] .= ')';
        fclose($map);
    }

    # replace placeholder values with mapped regex structures
    foreach($maps as $p => $m)
        $iirf = str_replace('{' . $p . '}', $m, $iirf);

    # create INI file from template
    file_put_contents($argv[2], $iirf);
