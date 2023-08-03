---
title: 'Add "desktop version" and "mark all as read" links to Tiny Tiny RSS mobile plugin'
tags: ["post", "php", "plugin", "tool"]
layout: post
---

I installed Tiny Tiny RSS on a server of mine, and after tinkering
around with it for a little while, I turned on the built-in _mobile_
plugin. It's a wonderful little thing; it uses the iUI library to
present a slick, single page application; it strips images out of the
article bodies; and it automatically forwards you to the mobile version
when you view TTRSS on your phone. I have just one problem with it—there
is no way to mark articles as read in bulk from the interface… so I
added some tweaks.<!--more-->

I started just by putting in a link to the "desktop version" of TTRSS
from the _preferences_ menu in the mobile interface, since the desktop
version has a "mark all as read" button (and I was looking for a quick
'n dirty solution). Now that I've had more time to investigate the guts
of the TTRSS architecture (and the mobile plugin architecture, for that
matter), I've managed to get a "mark all as read" function plastered
directly into the mobile UI.

For the time being, implementing this yourself will take small, manual
edits to two files:

- plugins/mobile/backend.php
- plugins/mobile/prefs.php

The `backend.php` file is an AJAX controller that receives calls from
the interface and acts on its behalf. The `prefs.php` file is the
_preferences_ menu for the mobile interface. I decided to put both of
the links here, but it should be simple enough to move them elsewhere;
their functionality is self-contained.

**plugins/mobile/backend.php, line 59**

```php
case "markAllRead":
	catchup_feed($link, -4, false);
	break;
```

**plugins/mobile/prefs.php, line 64**

```php
<div class="row"><label><a href="javascript:(function(){if(!confirm('Are you sure?'))return;new Ajax.Request('backend.php',{parameters:'op=markAllRead',onComplete:function(){alert('Done');}});}())">Mark All as Read</a></label></div>
<div class="row"><label><a href="javascript:window.location='../../index.php?mobile=false';">Full Version</a></label></div>
```

Voila! You now have an easy shortcut to the desktop version if you need
it (though it is also available from the logon/logoff screen), and the
added functionality of being able to mark all articles as read from the
mobile interface. Cheers.
