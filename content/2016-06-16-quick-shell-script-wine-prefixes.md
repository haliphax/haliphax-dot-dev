---
title: "A quick shell script for wine prefixes"
tags: ['post', 'linux', 'my-software', 'shell', 'tool']
layout: post
---

Wine, the Windows emulator-that's-not-an-emulator for Linux
distributions, has a way of maintaining separate Windows systems using
the `WINEPREFIX` and `WINEARCH` environment variables. While it's a
powerful mechanism, it's not so handy to type it all in on the command
line over and over. To that end, I have whipped up a simple shell script
that handles most of that nasty business for you.<!--more-->

<p>
<script src="https://gist.github.com/haliphax/378652c55732c659908616a608e02dd2.js"></script>
</p>

