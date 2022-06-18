---
title: "More FlaskBB development"
tags: ['post', 'my-software', 'python', 'flaskbb', 'plugin']
layout: post
---

The train keeps rolling. I've been busying myself with more
[FlaskBB](https://github.com/flaskbb/flaskbb) development lately. I took the
Docker image and expanded it into a `docker-compose` example. I've also
built a plugin for managing email and RSS notifications and another for
adding a dice-rolling macro to the forum. The `dicebot` plugin is _incredibly_
barebones at this point, but I hope to expand it at some point to include a
custom UI with many different options for a pleasant and configurable
tool to accompany play-by-post RPG sessions. Hopefully, someone finds these
useful. At the very least, the `subby` plugin provides a feature often seen
in more mature forum software, so it should get some decent mileage.

Both of the plugins required the addition of a new hook for Flaskbb, so
I can rest comfortably knowing that the development effort opened the door for
more customization and extensibility.

- [docker-compose example](https://github.com/haliphax/flaskbb-docker-compose-example)
- [flaskbb-plugin-subby](https://github.com/haliphax/flaskbb-plugin-subby)
- [flaskbb-plugin-dicebot](https://github.com/haliphax/flaskbb-plugin-dicebot)
