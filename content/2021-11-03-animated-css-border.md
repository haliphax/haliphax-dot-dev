---
title: Animated CSS "border"
tags: ['post', 'my-software', 'css']
layout: post
---

I had an idea for an animated "border" of sorts, and the urge to implement it
in pure CSS (as much as my feeble skills are capable) stuck with me all day. I
decided to take a crack at it on-stream last night. I managed to do a halfway
decent job, if I do say so myself, though it requires two wrapper elements in
order to perform its function. [Check out the CodePen] and see for yourself!

It basically divides the first wrapper element into a row with 3 segments. The
"bookend" segments represent the faux vertical borders of the object. The
second wrapper is divided into a column with 3 segments; its bookends
representing the faux horizontal borders of the object. A `linear-gradient()`
CSS function is used to generate a half-magenta, half-transparent background
image for each border, and animations are triggered on hover that kick off in
a delayed series. The overall effect is that the border "crawls" along the
outside of the object before being entirely visible.

It was fun to do, as I don't stretch my CSS muscles very often. Next time,
maybe I'll see if I can implement the same effect using the Grid layout model!


[Check out the CodePen]: https://codepen.io/haliphax/pen/bGradKo
