---
title: "Forward Gawker sites to their UK counterparts for a better layout"
tags: ["post", "javascript", "lifehacker", "my-software", "tool", "userscript"]
layout: post
---

I wrote a (_really_) simple [userscript](https://greasyfork.org) today
that reloads Lifehacker pages under uk.lifehacker.com. Why did I do this?
Because the Lifehacker UK site doesn't have the trendy new (horrendous)
AJAXified layout. Maybe using a `hosts` redirect instead of a userscript
is a better way to handle it (since you're still going to see a flash of
the [lifehacker.com](https://lifehacker.com) site before being redirected
with the userscript), but this method is far less intrusive—and less
likely to break any pages on the UK site which may rely on resources
from the naked domain.<!--more-->

_(Edit: I have since modified the script to work with the entire bevy of
Gawker media sites—Lifehacker, Gizmodo, Gawker, Kotaku, io9, Jalopnik,
Deadspin, and Jezebel.)_

~~Install the script from userscripts.org</a> for Firefox (via the
[GreaseMonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
extension), Opera, Chrome, or any other browser that supports
userscripts.~~

In the interest of transparency, here is the full source code for the
script:

**Javascript code:**

```js
// ==UserScript==
// @name Lifehacker UK Layout
// @version 1.0
// @namespace http://userscripts.org/users/72447
// @description Forwards Gawker sites to their UK counterparts (which don't have the horrendous AJAX layout).
// @include http://lifehacker.com/*
// @include http://gizmodo.com/*
// @include http://gawker.com/*
// @include http://kotaku.com/*
// @include http://io9.com/*
// @include http://jalopnik.com/*
// @include http://deadspin.com/*
// @inlcude http://jezebel.com/*
// ==/UserScript==

(function () {
	var loc =
		/^(https?:\/\/)(deadspin|gizmodo|gawker|kotaku|lifehacker|jezebel|io9|jalopnik)\.com(.+)$/i;
	var match = loc.exec(window.location);

	if (match) {
		try {
			window.stop();
		} catch (ex) {
			document.execCommand("Stop");
		}

		window.location.href = match[1] + "uk." + match[2] + ".com" + match[3];
	}
})();
```
