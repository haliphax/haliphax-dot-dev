---
title: Bookmarklet to adjust video playback speed
tags: ["post", "bookmarklets", "javascript", "video"]
layout: post
---

If you're like me, you tend to listen to audio (e.g. podcasts) and watch videos
faster than their default playback speed. However, sites like YouTube only
provide you with a predetermined list of speeds to choose from, and you may
find that they don't go fast enough (or slow enough, for that matter).

To get around this limitation, I have crafted a [bookmarklet][] that will set
the playback rate of any video elements on the page to whatever value you like.
Want to watch at 3x? No problem! Want to slow down to 0.1x? Have at it! Just
drag the link below onto your bookmarks bar and give it a click.

<a href="javascript:((r)=>document.querySelectorAll('video').forEach((v)=>(v.playbackRate=r)))(prompt('Playback rate',3.0))">Adjust playback rate</a>

# Source code

_Note: The function must be prefaced with `javascript:` for your browser to
execute it as expected. This is already taken care of in the link above, but
is excluded from the source code below for formatting reasons._

```javascript
((r) => {
  document.querySelectorAll("video").forEach((v) => (v.playbackRate = r));
})(prompt("Playback rate", 3.0));
```

[bookmarklet]: https://en.wikipedia.org/wiki/Bookmarklet
