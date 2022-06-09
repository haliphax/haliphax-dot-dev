---
title: "WordPress plugin minify Makefile"
tags: ['post', 'javascript', 'linux', 'my-software', 'php', 'regex', 'shell', 'tool', 'wordpress']
layout: post
---

While working on my first commercial [WordPress](https://wordpress.org/)
plugin, the need for build automation finally struck me. The
environments in which I do my most development are all driven by Linux,
and so I wanted to use a tried, true, and ubiquitous build automation
mechanism to fulfill my need. As such, I wound up going with a
`Makefile`, to be parsed and executed by the [GNU
make](https://www.gnu.org/software/make/) application. The result is an
incredibly convenient automated build that minifies my Javascript/CSS
(thanks to reducisaurus), and creates a version-appropriate archive of
my plugin.<!--more-->

I've tried to make the procedure as universal as possible, but it still
makes a handful of assumptions:

1.  Your Javascript files are all stored in the `js/` folder, and there
    are no sub-folders of `js/`
2.  Your CSS files are all stored in the `css/` folder, and there are no
    sub-folders of `css/`
3.  Your plugin's main file's file name matches the directory you're
    working in (i.e., `myplugin/myplugin.php`)
4.  The `Version:` directive in your plugin's WordPress-required comment
    block is at the very beginning of the line—this can be easily
    adjusted, however
5.  The `curl` command-line application is installed on your system
    (which, if it isn't, you should seriously consider installing for
    many other reasons)
6.  The `php-cli` package is installed on your system (though you could
    probably replace the `urlencode` call with some other language, such
    as perl)

The `Makefile` has several targets:

-   **css** - Minifies `*.css` files
-   **js** - Minfies `*.js` files
-   **minify** - Fires both the **css** and **js** targets
-   **zip** - Builds a version-appropriate `*.zip` archive
-   **all** - Fires the **minify** and **zip** targets
-   **clean** - Removes all minified scripts/stylesheets and archives
-   **help** - Displays list of targets

It can no doubt be made even more universal—perhaps to work with
WordPress themes, [CodeIgniter](https://codeigniter.com/) apps, and
more—so tinker away!

<script src="https://gist.github.com/haliphax/3315112.js"></script>
<noscript><https://gist.github.com/haliphax/3315112></noscript>

**Note:** You will need to make adjustments if you are using `*.mo` and
`*.po` language files—I'm not that far along in my own project, so the
script does not yet incorporate them.
