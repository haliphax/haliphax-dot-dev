---
title: "Add threaded discussions to cgit with disqus"
tags: ["post", "git", "javascript"]
layout: post
---

While it provides an efficient, organized web front-end for your
personal git repositories, the [cgit](https://github.com/kevclark/cgit)
application is missing a few of the more sparkling features found at
[github](https://github.com)--notably, a comments/discussion system.
Enter: [disqus](https://disqus.com).<!--more-->

Disqus is a Javascript-injected, centralized discussion system that is
gaining traction with blogs and other CMS-based sites as of late. One of
its chief benefits is the centralization; one account links you to all
of the discussions you have participated in within various venues.
Another benefit of the system is that *it is entirely client-side.* What
this means for cgit integration is that we won't need to go mucking
about in the cgit source code--we can simply use one of its inherent
features, the inclusion of a header HTML file, to tie disqus to it.

First, build an HTML file to fire off a document URL comparison that
decides whether or not the current page warrants the injection of the
disqus platform (be sure to replace
**REPLACE-WITH-YOUR-DISQUS-SHORTNAME** in the code below):

```html
<script type="text/javascript">
	window.onload = function () {
		if (
			(window.location.href.match(/\/tree\/.*[?&]id=/) &&
				document.querySelector("table.blob")) ||
			window.location.href.match(/\/commit\/.*[?&]id=(?!.+&ss=1\$)/)
		) {
			var d = document.createElement("div");
			d.id = "disqus_thread";
			document.querySelector("div.content").appendChild(d);
			var disqus_shortname = "REPLACE-WITH-YOUR-DISQUS-SHORTNAME";
			var dsq = document.createElement("script");
			dsq.type = "text/javascript";
			dsq.async = true;
			dsq.src = "https://" + disqus_shortname + ".disqus.com/embed.js";
			document.body.appendChild(dsq);
		}
	};
</script>
```

The code above will only inject the disqus platform on
*version-specific* commit summaries and individual file views. (Without
the version specificity, there would be no "hard" context to tie the
discussion thread to.) It also prevents the platform from being injected
on side-by-side diffs, since this would lead to two different contexts
for discussions about the same file version/commit.

To include this newly-fashioned header in your cgit system, add the
following line to your `cgitrc` file (with the appropriate path, of
course):

```
header=/path/to/your.html
```

That's it! The next time you visit a version-specific commit or file in
your cgit system, the disqus comment thread should be injected at the
bottom of the page.

_~~Caveat: Currently, disqus has problems serving its script over HTTPS.
If you're serving cgit over HTTPS (and I am), you will unfortunately be
plagued by content security mismatches. They claim that they have
already fixed disqus to work over HTTPS, but I have experienced the
opposite.~~_

**Update (2012/6/6):** It looks like they've fixed the HTTPS problem.

**Update (2012/7/24):** You must disable the new _Disqus 2012 features_
option if you're forcing SSL, since it includes resources which are not
served over an HTTPS connection.
