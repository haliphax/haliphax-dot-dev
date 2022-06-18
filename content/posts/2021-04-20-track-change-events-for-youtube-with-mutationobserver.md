---
title: "Track change events for YouTube with MutationObserver"
tags: ['post', 'my-software', 'javascript', 'userscript']
layout: post
---

Have you ever wanted to react to events taking place on a web page, but they
aren't capital-e [Events] that you can catch and handle? I was in this
situation recently, where I wanted to grab the current video and chapter titles
to display on [my Twitch stream]. YouTube isn't going to provide you with any
convenient events to handle, but you _can_ use the magical [MutationObserver]
in order to listen for changes on particular elements! As it turns out, this
was just what I needed.

I used the DOM inspector in Chrome's developer tools in order to drill through
the document and find the elements I needed to focus on. (In a page like
YouTube, this can be a bit difficult to manage, but have patience.) Setting up
two MutationObservers--one for the video title and one for the chapter title--I
was able to effectively generate my _own_ events. This allowed me to catch the
track change as it happens without using any yucky polling mechanisms or other
less-than-elegant solutions.

The project I'm using this in is [yt-siren]; the companion [UserScript] has the
logic mentioned above, and it's been working wonderfully thus far. Maybe you
will be able to build something neat using the same pattern. Good luck!


[Events]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events
[my Twitch stream]: https://www.twitch.tv/haliphax
[MutationObserver]: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
[UserScript]: https://en.wikipedia.org/wiki/Userscript
[yt-siren]: https://github.com/haliphax/yt-siren
