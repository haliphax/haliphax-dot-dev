---
title: A chat bot in your browser
tags: ["post", "my-software", "twitch", "bot", "javascript"]
layout: post
---

I've been tinkering with [tmi.js] (Twitch's messaging interface) in node as of
late, and it occurred to me: the library works in the browser, as well! With
this in my back pocket, I went off and built a tiny little chat bot as an
experiment.

The bot responds with a random "thank you" emote whenever it sees the
[Stream Raiders] bot, `StreamCaptainBot`, post about an epic or legendary unit
being placed on the battlefield in the game. It accepts a username to assume,
a channel to join, and an OAuth token to use as query string parameters to the
single HTML page it lives on. You can load it up in a standard browser tab and
leave it open while you stream, or you can add it as a hidden source in your
streaming software of choice (e.g. [OBS Studio]).

It is my pleasure to present: the [Stream Raiders thank-you bot]! I've already
tested it myself, and it works surprisingly well for ~30 lines of actual logic.

This is admittedly a small and inconsequential thing that I've built... but it
is a proof of concept that has some very powerful suggestions as to what could
be built next. Until then!

[tmi.js]: https://tmijs.com
[Stream Raiders]: https://streamraiders.com
[OBS Studio]: https://objsproject.com
[Stream Raiders thank-you bot]: https://github.com/haliphax/stream-raiders-thanks
