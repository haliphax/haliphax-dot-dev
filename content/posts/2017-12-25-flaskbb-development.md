---
title: "FlaskBB development"
tags: ['post', 'my-software', 'python', 'flaskbb', 'plugin']
layout: post
---

Lately, I've been getting involved with some Python-based forum software,
[FlaskBB](https://github.com/flaskbb/flaskbb). I had been running phpBB for one
of my web games' forums, and it became overrun with bots. Given my attraction
to Python over the last few years, I began searching for a new solution written
in Python. FlaskBB seemed like a good fit, and it came with reCAPTCHA support
out of the box. In addition to being fairly full-featured, it has a relatively
straightforward plugin architecture.

I decided to containerize it (using Docker) and tweak a few things with my own
custom plugins. First of all, since it will be running in a container and
sitting behind an nginx proxy, I needed for it to use the Werkzeug ProxyFix
middleware. On top of that, I wanted the memberlist, user profiles, and search
functionality to be restricted to logged-in users on one of my forum installs.
As such, I wrote some plugins to accomplish that.

* [Dockerfile](https://github.com/haliphax/flaskbb-dockerfile/)
* [Docker image](https://hub.docker.com/r/haliphax/flaskbb/)
* [ProxyFix plugin](https://github.com/haliphax/flaskbb-plugin-proxyfix/)
* [Private memberlist plugin](https://github.com/haliphax/flaskbb-plugin-private-memberlist/)

If they sound useful then please give them a whirl. Enjoy!
