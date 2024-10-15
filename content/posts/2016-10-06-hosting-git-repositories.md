---
title: "Hosting my own git repositories"
tags: ["post", "git", "my-software", "archived"]
layout: post
---

I've run my own personal git service for several years now. Previously,
it was with [cgit](https://git.zx2c4.com/cgit/about/) on nginx and
gitolite. I then [modded cgit with some password maintenance
features](/2012/07/add-password-maintenance-feature-to-cgit-with-php/).
After a while, I tried using several more "modern" git repo hosting
solutions, and I've finally settled on
[gogs](https://github.com/gogs/gogs), the **Go** **G**it
**S**ervice.<!--more-->

The reasons I've landed on gogs include:

- It's compact and simple - installs and upgrades are a breeze thanks to Go
- It includes SSH git-pack-receive support out-of-the-box
- It has GitHub-like features such as issues, comments, pull requests, and more

I've taken the liberty of pushing copies of all of the repos I care
about on GitHub over to my gogs instance. Any of those that I still
update will be pushed to GitHub as well, but I'm trying to make gogs my
primary repo source from here on out.
