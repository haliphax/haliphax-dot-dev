---
title: "Easy SSL redirection for select folders in nginx"
tags: ['post', 'nginx', 'regex', 'security']
layout: post
---

I have many various web applications installed on my server; some of
them need to be wrapped in a secure connection, while it is less
important (or meaningless) for others. For those applications whose
security I am concerned about, I've developed an easy way to force nginx
to serve the application over an SSL connection. The method involves
creating empty `foldername.ssl` files in a specific location, and then
comparing the base folder name of an HTTP request against these file
names. If there is a match, the connection is redirected to an
`https://` URL.<!--more-->

The following nginx `location` configuration directive will provide this
behavior:

    #!text
    location / {
        # force ssl
        location \~ ^/([^/]+)(/.*)? {
            if (-f /var/www/$1.ssl) {
                rewrite ^(.*)$ https://myserver.com$1 permanent;
                break;
            }
        }
    }

Consider this scenario: You have *phpMyAdmin* installed under
`/var/www/phpmyadmin`, and you keep your `*.ssl` files in `/var/www`
(though you could just as easily place them elsewhere, perhaps outside
of the document root). You would just create the `phpmyadmin.ssl` file:

    $ touch /var/www/phpmyadmin.ssl

nginx's `location` directive listed above will match `/phpmyadmin` from
the URL to `/var/www/phpmyadmin.ssl`. Since that file does exist, nginx
will redirect the request to an HTTPS version.

This may seem like a fairly benign feature to add--and for the most
part, it is--but if you've got a ton of web applications running under
one domain name (i.e., in order to save money on SSL certificates), it
can be a godsend.
