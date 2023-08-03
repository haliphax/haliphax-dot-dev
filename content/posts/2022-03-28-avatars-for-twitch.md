---
title: Avatars for Twitch
tags: ["post", "twitch", "my-software"]
layout: post
---

I've been [experimenting] recently with front-end-only [Twitch] overlays that
use static files, the [TMI] JavaScript library, and localStorage. I feel
comfortable enough with the pattern now and have enough faith in it that I have
excised the "avatars" subsystem from my bot into its own, standalone overlay.

The overlay has feature parity with the previous avatars system and uses a
game development engine, [PhaserJS], at its core. This allows for easy, plug-in
physics as well as the potential for extending the system at a later time to
include various minigames! This is the direction I always wanted to take the
original avatars system, and I'm excited at the prospect.

You can use the overlay yourself without hosting anything, as I've set it up in
such a way that it can be easily hosted on GitHub Pages. It's currently
hard-coded to 1920x1080 and expects to be rendered full-screen. There is also a
"demo mode" available if you want to see how it looks/operates before going
through the OAuth flow to get an authentication token.

[hxavatars GitHub repository]

[experimenting]: /2021/09/a-chat-bot-in-your-browser/
[Twitch]: https://www.twitch.tv
[TMI]: https://github.com/tmijs/tmi.js
[PhaserJS]: https://phaser.io
[hxavatars github repository]: https://github.com/haliphax/hxavatars/
