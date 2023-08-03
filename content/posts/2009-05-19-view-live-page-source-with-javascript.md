---
title: "View live page source with Javascript"
tags: ["post", "bookmarklets", "javascript", "my-software", "tool"]
layout: post
---

Have you ever been working on an AJAX-enabled webpage, or a page with
complex redirects and permissions, and tried to view its source? What
you wind up getting generally looks nothing like the current state of
the page in question. You are viewing its **initial** state, since the
browser loads a fresh copy for the source view. That's just fine if
everything you need to check was all set up and ready to go when the
page was initially loaded; but that is rarely the case with
AJAX.<!--more-->

Well, fret no more! Using this simple Javascript bookmarklet creates a
new window in your browser and then shoves the page's **current** state
(as HTML source) into the new window. (The bookmarklet does not grab
_<!DOCTYPE ... />_ or _<html ... />_ elements, however.)
Give it a shot the next time you're manipulating AJAX-enabled web
applications and see if it doesn't make your life a whole lot easier:

<a href="(javascript:w=window.open();void(w.document.write('%3Cpre%3E'+document.body.parentNode.innerHTML.replace(/%3C/g,'<')+'%3C/pre%3E'));)">Live source</a>

**Javascript bookmarklet:**

```js
javascript: w = window.open();
void w.document.write(
  "<pre>" + document.body.parentNode.innerHTML.replace(/</g, "<") + "</pre>",
);
```

That's all there is to it! Here's the procedure in a nutshell:

1.  Create a new window object
2.  Write _body_'s parent node (_<head>_) to the new document
    1.  Replace all < with &lt;
    2.  Wrap the text in a `<pre>` element to preserve formatting
    3.  Do it all inside a `void()` to avoid touching the current window

One caveat you should keep in mind—**the "live" source will be different
than what the "true" source looks like, since one is hard-coded text and
the other is the result of your browser's DOM hierarchy.** I use this
for things like determining AJAX-ified `<div />` contents and
such—**not** for determining sequential dependence in the HTML.

_Update: FYI, this is now a pretty standard feature in modern web
browsers' own development tools._
