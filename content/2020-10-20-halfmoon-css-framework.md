---
title: "Halfmoon CSS framework"
tags: ['post', 'css']
layout: post
---

I've been using a CSS microframework, [Shoelace], for a little while now in one
of my hobby projects. Recently, they began releasing beta versions of their new
version and I discovered that they are moving from a CSS microframework to a
full-blown web component library. I wish them luck, but it's not what I was in
the market for... so I began my search for a new framework.

One of the things I liked most about Shoelace was its similarity to Bootstrap
in how classes were named and the manner in which they functioned. I also
rather liked that it was much, much smaller than Bootstrap and had a pretty
shallow learning curve when it came to customization. It used [cssnext] to
convert future CSS specifications into modern CSS implementations, which I just
felt all warm and fuzzy about--no SASS, LESS, or any other derivative
quasi-CSS languages.

The framework I have been excited about, after many hours of searching and
testing, is not small. In fact, it's larger than Bootstrap, as far as I can
tell. It's also not using anything like cssnext (though it _is_ driven entirely
by CSS3 variables, which is neat). [Halfmoon] does imitate Bootstrap's naming
conventions, though. It also has a *dark mode* (!!) and doesn't rely on jQuery
(or even Javascript, if you don't want it to) for its base functionality.

I've been playing with it for (too many) hours tonight (if it still qualifies
as "night" right now...), and I've decided that I'm likely going to make the
decision tomorrow to scrub my codebase of Shoelace and implement the project's
front end using Halfmoon. I'll try to post again with any experiences I've had
that are worth sharing--both good and bad--after I've had some more time to get
my hands dirty with it.

- [Halfmoon CSS framework][Halfmoon]


[cssnext]: https://cssnext.github.io/
[Halfmoon]: http://gethalfmoon.com
[Shoelace]: https://shoelace.style
