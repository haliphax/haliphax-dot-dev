---
title: "Tail for browser windows"
tags: ["post", "bookmarklet", "javascript", "tool"]
layout: post
---

Have you ever been watching log output via a web application, and you just want
your browser window to jump to the bottom of the document whenever new output
shows up? Well, stranger, let me tell you, I certainly have. That's why I wrote
a [bookmarklet] that does just that.

The first time you invoke it, it sets a variable in the window that it uses to
jump on an interval (1 second) and does its thing. If you invoke it again on a
page where it is already active, it will cancel the interval and delete the
variable, ending the scrolling behavior.

Here's the raw `javascript:` URL if you want to paste it into your browser
manually:

```text
javascript:(function(d){if(window.hasOwnProperty('hx_tail')){clearInterval(hx_tail);delete hx_tail;alert('Disabled')}else{window.hx_tail=setInterval(function(){d.scrollTop=d.scrollTopMax},1000)}})(document.scrollingElement)
```

You may also drag 'n drop the following link to your bookmarks toolbar:

<a href="javascript:(function(d){if(window.hasOwnProperty('hx_tail')){clearInterval(hx_tail);delete hx_tail;alert('Disabled')}else{window.hx_tail=setInterval(function(){d.scrollTop=d.scrollTopMax},1000)}})(document.scrollingElement)">Tail</a>

[bookmarklet]: https://en.wikipedia.org/wiki/Bookmarklet
