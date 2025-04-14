---
title: "Mozilla's TogetherJS in a bookmarklet"
tags: ["post", "bookmarklet", "javascript", "tool"]
layout: post
---

Mozilla recently introduced
[TogetherJS](https://hacks.mozilla.org/2013/10/introducing-togetherjs/),
a succession of their TowTruck service. Being that it is so similar to
TowTruck, I went ahead and made a bookmarklet for it.<!--more-->

Drag the bookmarklet below onto your bookmarks bar, and tell your
collaborators to do the same. When you're on a page you want to
collaborate on, both of you just need to fire off the bookmarklet to get
started.

- <a href="javascript:(function(d,s)%7Bs=d.createElement('script');s.setAttribute('src',%20'https://togetherjs.com/togetherjs.js');d.body.appendChild(s);s.onload=function()%7BTogetherJS();%7D;%7D(document))">TogetherJS</a>
