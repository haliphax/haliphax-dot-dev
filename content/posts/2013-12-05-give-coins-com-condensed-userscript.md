---
title: "Give-Me-Coins.com Condensed UserScript"
tags: ["post", "encryption", "javascript", "my-software", "userscript"]
layout: post
---

Lately, my interest has been piqued by cryptocurrency. After discovering that
my ATI card could produce a decent hash rate without seriously spiking my
electricity bill, I got specifically interested in Litecoin. Long story short,
I joined a Litecoin mining pool
([Give-Me-Coins.com](https://give-me-coins.com)) and decided that I could do
without a few of the widgets on their dashboard page. Bing-bang-boom, I wrote a
UserScript to rearrange things a little bit. Here it is for your
consumption.<!--more-->

You can take advantage of this with
[GreaseMonkey](https://www.greasespot.net/) in Firefox or by dragging it into
chrome://extensions on Chrome. I haven't tested it in Safari, but go
ahead and give it a shot. What have you got to lose, bub?

- [Give-Me-Coins.com Condensed](https://greasyfork.org/en/scripts/4655-give-me-coins-condensed)

Since you can pick it apart whether I want you to or not, here's the
source. Happy holidays!

**Javascript:**

```js
// ==UserScript==
// @name Give Me Coins Condensed
// @namespace http://roadha.us
// @version 1.0
// @description Condenses the layout of the give-me-coins.com dashboard
// @include https://give-me-coins.com/pool/dashboard
// @match https://give-me-coins.com/pool/dashboard
// @run-at document-end
// ==/UserScript==

setTimeout(function () {
	var container = document.querySelectorAll(".main .container")[1];
	var rows = container.querySelectorAll(".row");
	rows[0].parentNode.removeChild(rows[0]);
	var els = rows[1].querySelectorAll(".widget");

	for (var i = 0; i < els.length; i++) {
		if (!els.hasOwnProperty(i)) continue;

		var widget = els[i].parentNode;
		var header = widget
			.querySelector("h3")
			.innerHTML.replace(/\^(\s|\n|\r)|(\s|\n|\r)$/g, "");

		switch (header) {
			case "Workers Stats":
				widget.parentNode.removeChild(widget);
				break;
			case "My Hash Rate":
				widget.setAttribute("class", "span8");
				break;
			default:
				break;
		}
	}

	var prog = document.querySelector(".progress.active");
	prog.setAttribute(
		"class",
		prog.getAttribute("class").replace(/\bactive\b/i, ""),
	);
}, 0);
```
