---
title: "SVG polyfill in pure Javascript"
tags: ["post", "javascript", "my-software", "polyfill", "svg"]
layout: post
---

A designer at work pointed out [this SVG
polyfill](https://github.com/aw2basc/svg-img-polyfill) as a candidate
for our new production site. While I like the elegance of it, I was a
bit disappointed that the author felt the need to include jQuery as a
dependency simply to use its selector engine and `each` function. So, I
rewrote it in pure Javascript.<!--more-->

**Javascript:**

```js
if (
	!(
		!!document.createElementNS &&
		!!document.createElementNS("http://www.w3.org/2000/svg", "svg")
			.createSVGRect
	)
) {
	var imgs = document.getElementsByTagName("img");

	for (var i = 0; i < imgs.length; i++) {
		imgs[i].setAttribute(
			"src",
			imgs[i].getAttribute("src").replace(/\.svg/, ".png"),
		);
	}
}
```
