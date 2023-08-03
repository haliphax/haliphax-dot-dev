---
title: "Photobucket thumbnail bookmarklet"
tags: ["post", "bookmarklets", "javascript", "my-software", "tool"]
layout: post
---

I've built a pretty simple little utility for turning the URL of an
image hosted on Photobucket into a thumbnail which links to the
full-sized image. I've designed one version for building bbCode (forum)
mark-up, and one for building a basic HTML thumbnail link. Save the
links below to use them:

<a href="javascript:i=prompt('Photobucket%20URL');void(prompt('Copy%20and%20paste%20this','%5Burl='+i+'%5D%5Bimg%5D'+i.replace(/\/(%5B%5E./%5D+?\.%5B%5E./%5D+?)$/,'/th_$1')+'%5B/img%5D%5B/url%5D'));">bbCode Thumbnailer</a>

<a href="javascript:i=prompt('Photobucket%20URL');void(prompt('Copy%20and%20paste%20this','%3Ca%20href=\''+i+'\'%3E%3Cimg%20src=\''+i.replace(/\/(%5B%5E./%5D+?\.%5B%5E./%5D+?)$/,'/th_$1')+'\'%20\/%3E%3C\/a%3E'));">HTML Thumbnailer</a>

Have a look at the code yourself:<!--more-->

**bbCode Thumbnailer:**

```js
javascript:i=prompt('Photobucket URL');void(prompt('Copy and paste this','[url='+i+'][img]'+i.replace(/\/([\^./]+?\.[\^./]+?)$/,'/th_$1')+'[/img][/url]'));[/js]
```

**HTML Thumbnailer:**

```js
javascript: i = prompt("Photobucket URL");
void prompt(
  "Copy and paste this",
  "<a href='" +
    i +
    "'><img src='" +
    i.replace(/\/([\^./]+?\.[\^./]+?)$/, "/th_$1") +
    "' /></a>",
);
```
