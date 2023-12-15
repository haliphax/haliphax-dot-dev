---
title: "Aethersprite: a Discord bot framework"
tags: ["post", "python", "bot", "my-software"]
layout: post
---

For some months, I had been tinkering with the [discord.py] library and slowly
building up a bot for use in [Nexus Clash] faction servers. The more I added to
it, the more I began to realize that what I was really building was a bot
_framework_, and that framework just so happened to have some commands layered
on top of it that served a niche. At that point, I split the project into an
extensible bot framework and an "extension pack" of commands and settings
particular to the web game I was initially targeting.

Behold: [Aethersprite] is born! There are far more details in the
[Aethersprite documentation] than I'm going to provide in this blog post, but
here's a quick run-down:

- A settings subsystem with server and channel granularity
- The ability to filter the input and output of settings, with out-of-the-box
  functionality for parsing roles and channels
- An authorization subsystem capable of guarding commands based on settings
- The ability to disable commands with server and channel granularity
- Command aliases for tailoring the bot to each server
- A customizable greeting message for new members that join each server
- Roles membership self-service for a configurable list of roles
- Convenient decorators for hooking into Discord client events
- Extensibility in the form of configurable "extension packs" that provide the
  bot with additional commands, settings, and behaviors
- Simple TOML configuration for immutable settings
- ... and more!

The [Nexus Clash]-specific commands have been moved to their own project,
[ncfacbot], in the form of an "extension pack" that can be `pip install`ed
like any other python module. Extension packs are toggled in the TOML
configuration for the bot by adding or removing their module names.

There's a lot of work left yet to do, but I feel like it's a pretty competent
bot and a pretty flexible, easy framework thus far. I really like the way some
bots out there like [sesh] use post reactions as input, so I'll probably be
experimenting with something like that. I'm looking forward to it!

[Aethersprite documentation]: https://haliphax.github.io/aethersprite/
[Aethersprite]: https://github.com/haliphax/aethersprite
[discord.py]: https://discordpy.readthedocs.io/en/stable/
[ncfacbot]: https://github.com/haliphax/ncfacbot
[Nexus Clash]: https://www.nexusclash.com
[sesh]: https://sesh.fyi
