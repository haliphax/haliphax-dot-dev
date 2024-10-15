---
title: "Help! KB932091 broke my SharePoint installation!"
tags: ["post", "sharepoint", "archived"]
layout: post
---

Well, it broke ours, too. Our root site collection was completely
inaccessible, and the main SharePoint site was returning an HTTP status
code of 500. After 12 solid hours of wild goose chases tracking down
erroneous error messages, we installed KB936867. The installation failed
on both steps 8 and 9, claiming that it could not start the associated
SharePoint services... but upon reboot and manually starting the
before-mentioned services ourselves, everything was back to normal.

I pray that I have saved at least one person the migraines that my department
has been going through for the last few days.
