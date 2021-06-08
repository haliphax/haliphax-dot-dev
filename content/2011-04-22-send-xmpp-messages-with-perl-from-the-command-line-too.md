---
title: "Send XMPP messages with Perl (from the command line, too!)"
tags: ['post', 'my software', 'perl', 'shell', 'tool', 'xmpp']
layout: post
---

I had been looking for a small, simple utility for Windows that could
send XMPP messages from the command line for use in various automated
tasks and notification processes. I came across *sendxmpp* as part of
the [CygWin](http://cygwin.com) installation, but could not successfully
install its dependencies with CygWin's CPAN port. I've been playing
around with the `Net::XMPP` Perl library, and in spite of its poor
documentation, I decided that I was going to hack away with it until I
got something usable. I'm a programmer, after all—if a utility I need
doesn't exist, why not make it myself?<!--more-->

The following Perl script has been tested with ActiveState Perl on
Windows 7, Vista, and XP, as well as the standard *apt*-installed Perl 5
distribution for Debian Linux.

**Perl code:**  

    #!/usr/bin/perl  
    use strict;  
    use Net::XMPP;

    my ($recip, $msg) = @ARGV;

    if(! $recip || ! $msg) {  
        print 'Syntax: $0 <recipient> <message>\n';  
        exit;  
    }

    my $con = new Net::XMPP::Client();  
    my $status = $con->Connect(  
        hostname => 'jabber.org',  
        connectiontype => 'tcpip',  
        tls => 0);  
    die('ERROR: XMPP connection failed') if ! defined($status);  
    my @result = $con->AuthSend(  
        hostname => 'jabber.org',  
        username => 'username',  
        password => 'password');  
    die('ERROR: XMPP authentication failed') if $result[0] ne 'ok';  
    die('ERROR: XMPP message failed') if ($con->MessageSend(to => $recip, body => $msg) != 0);  
    print 'Success!\n';

You will want to modify the script to use your own account's
credentials, of course. Additionally, the script can easily be modified
to work with XMPP providers other than
[jabber.org](http://www.jabber.org) (i.e., Google Talk or even your own
Jabber/XMPP server).

To use it, simply call it like so:  

	perl xmpp.pl recipient@hostname "Hello!"

**Note:** Before getting started, make sure you've installed the
`Net::XMPP` library from CPAN. Also, you will want to change the `tls`
option in the connection string from 0 to 1 if you plan on using TLS for
secure transmissions.
