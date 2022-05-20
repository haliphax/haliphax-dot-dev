---
title: "ascii.js: A font-based rendering engine for ASCII artwork"
tags: ['post', 'css', 'javascript', 'my-software']
layout: post
---

A long-standing and thoroughly-enjoyed hobby of mine is creating and
consuming [ASCII artwork](https://en.wikipedia.org/wiki/ASCII_art)
(though not the kind of watered-down crap you would see in, say, an
e-mail signature or a chain letter). I recently went on a wild tear
after stumbling across a faithful recreation of the Amiga's Topaz 500
and the IBM's VGA cp437 fonts, and built a single-page application (or
SPA, if you want to be a dick about it) that takes advantage of
web-ified versions of these fonts—with some help from the `@font-face`
CSS directive—to display that artwork in its intended form without
resorting to a text-to-image conversion process.

Confused yet? Check out [my ASCII gallery](https://oddnetwork.org/ascii).
If you want to run your own, or just see how it works, I've also put the
[ascii.js source on GitHub](https://github.com/haliphax/ascii.js).
