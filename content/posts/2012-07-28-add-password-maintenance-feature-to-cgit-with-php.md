---
title: "Add password maintenance feature to cgit with PHP"
tags: ['post', 'git', 'javascript', 'php', 'security']
layout: post
---

Have you ever wanted to have a nifty, browser-driven password
maintenance feature in your *htpasswd*-secured **cgit** site? I've been
meaning to build this for a while—and I finally did it.<!--more-->
Granted, this was not a difficult task, and I'm not expecting to bask in
any glory for completing it, but hopefully, this will prove useful to
someone else out there.

_First things first:_ I
secure my cgit instances with htpasswd-driven basic authentication over
an SSL-encrypted connection. If your setup is different than this, you
may want to poke around in PHP's `$_SERVER` array to figure out what you
need to key off of for the current user's credentials. (You may also
want to remove the check for the current password entirely—it's up to
you, after all.) This method expects you to have PHP support for the
secured directory, as well. You could use perl, or compile this into a
CGI application, or what have you… the principal is the same.

Throw this PHP file into whatever folder is housing your `cgit.cgi`
file:

**passwd.php**

    #!php
    <!doctype html>  
    <html lang="en-US">  
    <head>  
        <meta name="charset" content="utf-8" />  
        <title>Change your cgit password</title>  
    </head>  
    <body>  
        <h2>passwd</h2>  
        <a href="cgit.cgi">Back to cgit</a>  
        <?php

        // fire up our function  
        init();

        /* encapsulate everything within a function so we can return early  
         * but still output a valid HTML document */  
        function init()  
        {  
            // re-usable meta refresh string  
            $refresh = "<meta http-equiv=\"refresh\" content=\"5\" />";

            // if we're not receiving a POST, show the password change form  
            if ( $_SERVER[ "REQUEST_METHOD" ] != "POST" )  
            {  
                ?>  
                <form method="POST">  
                    <p>  
                        <label for="old_password">Old password:</label>  
                        <br />  
                        <input type="password" id="old_password" name="old_password" />  
                    </p>  
                    <p>  
                        <label for="new_password">New password:</label>  
                        <br />  
                        <input type="password" id="new_password" name="new_password[]" />  
                        <input type="password" id="new_password_rpt" name="new_password[]" />  
                    </p>  
                    <p>  
                        <button type="submit">Change</button>  
                    </p>  
                </form>  
                <?php  
            }  
            // we're receiving a post - handle it  
            else  
            {  
                // bad password  
                if ( $_POST[ "old_password" ] != $_SERVER[ "PHP_AUTH_PW" ] )  
                {  
                    ?>  
                    <p>Your password was entered incorrectly.</p>  
                    <?php  
                    echo $refresh;  
                    return;  
                }

                // no new password  
                if ( $_POST[ "new_password" ][ 0 ] == "" )  
                {  
                    ?>  
                    <p>No new password given.</p>  
                    <?php  
                    echo $refresh;  
                    return;  
                }

                // new password doesn't match  
                if ( $_POST[ "new_password" ][ 0 ] != $_POST[ "new_password" ][ 1 ] )  
                {  
                    ?>  
                    <p>Passwords do not match.</p>  
                    <?php  
                    echo $refresh;  
                    return;  
                }

                // escape double-quotes for passing to command line  
                $passwd = str_replace( "\"", "\\\"", $_POST[ "new_password" ][ 0 ] );  
                // fire up htpasswd  
                exec( "/usr/bin/htpasswd -bd /path/to/passwords {$_SERVER[ "PHP_AUTH_USER" ]} \"{$passwd}\"" );  
                // your uncle is Robert  
                ?>  
                <p>Password changed.</p>  
                <?php  
                return;  
            }  
        }  
        ?>  
    </body>  
    </html>  

If you want to add a tab link for navigating to this password
maintenance page that will sit alongside cgit's "index" link, you'll
need to add a javascript snippet to cgit's header file:

**include.html**

    #!html
    <script type="text/javascript">  
        window.onload = function() {  
            var p = document.createElement('a');  
            p.href = '/git/passwd.php';  
            p.innerHTML = 'passwd';  
            document.querySelector('table.tabs td:first-child').appendChild(p);  
        };  
    </script>  

The file is included by cgit in its HTML output if you set it up to do
so in your configuration:

**cgitrc**

    header=/var/www/git/include.html  

Presto, change-o! A butt-ugly (but functional) password maintenance page
for a secure cgit instance. No more need to SSH into the server to
change your *htpasswd* credentials!
