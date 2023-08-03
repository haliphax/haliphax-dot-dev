---
title: "Truck It!: Mozilla TowTruck in a bookmarklet"
tags: ["post", "bookmarklets", "javascript", "tool"]
layout: post
---

[Mozilla Labs](https://www.mozillalabs.com/) has this really nifty,
Javascript-based collaboration utility, ~~TowTruck~~, which allows
real-time web editing collaboration in the browser. It's got a lot of
nifty features I won't get into in this post; sufficed to say, it's
pretty frickin' sweet. What I did not find to be as frickin' sweet,
however, is the fact that the TowTruck Javascript file must be included
in the source of your page in order to use it.<!--more-->

Well, dear reader--not any more! Just use this nifty little bookmarklet
to kick it off, have your co-conspirators fire up the same bookmarklet
when they land on the page in question, and you're off to the races.
It's just that simple. Drag the link below onto your bookmarks bar to
start your adventure.

- <a href="javascript:(function(d,s)%7Bs=d.createElement('script');s.setAttribute('src',%20'https://towtruck.mozillalabs.com/towtruck.js');d.body.appendChild(s);s.onload=function()%7BTowTruck();%7D;%7D(document))">Truck It!</a>
  <small>← drag this onto your bookmarks bar, brah</small>

**Update 2016-08-23:** TowTruck has been discontinued.
