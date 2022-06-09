---
title: "Create anchor links in Twitter status text with JavaScript"
tags: ['post', 'javascript', 'my-software', 'regex', 'twitter']
layout: post
---

*Note: This also applies to any service using a
[Twitter](https://twitter.com)-compatible API, such as
[StatusNet](https://status.net) (see: [identi.ca](https://identi.ca))
with some minor configuration changes.*

As a side project, I have been working on a StatusNet (specifically,
identi.ca) status feed widget for the
[WordPress](https://www.wordpress.com) PHP platform. I had spent a fair
amount of my time trying to convert the various tokens (such as
@mentions, #hashtags, and URLs—both with and without a protocol prefix)
into clickable links when I realized that StatusNet, being the cool
folks that they are, provide HTML-rendered versions of status posts
through their API. However, my work hasn't been for naught! Twitter uses
an *incredibly* similar API—or rather, StatusNet's API is similar
to/based off of Twitter's API—but does *not* provide HTML-rendered
versions of the status posts (to my knowledge). With this in mind, I've
re-engineered the code to accept options for pointing the various token
URLs to the particular service—whatever it may be.<!--more-->

Originally, this began as a PHP project to leverage the power of
WordPress widgets. That project is still in the works (sort of), but I
figured a JavaScript implementation might be a more friendly,
broadly-distributable incarnation of the process. I ran into a bit of a
snag, however, as JavaScript does not (universally) support negative
look-behind constructs in its regular expressions engine. Based on some
[suggestions for emulating negative look-behind functionality in
JavaScript](https://blog.stevenlevithan.com/archives/mimic-lookbehind-javascript)
I found online, I was able to take my `preg_replace_all` calls in PHP
and convert them into JavaScript-compatible regular expression patterns
for use with `String.replace` (with some callback magic peppered in).

Next to the configuration values at the top of the function block are
suggested values for integrating with identi.ca (rather than Twitter).

**JavaScript code:**

```js
// Convert URLs (w/ or w/o protocol), @mentions, and #hashtags into anchor links
function twitterLinks(text)
{
	var base_url = 'http://twitter.com/'; // identica: 'http://identi.ca/'
	var hashtag_part = 'search?q=#'; // identica: 'tag/'
	// convert URLs into links
	text = text.replace(
		/(>|<a[^<>]+href=['"])?(https?:\/\/([-a-z0-9]+\.)+[a-z]{2,5}(\/[-a-z0-9!#()\/?&.,]*[^ !#?().,])?)/gi,
		function($0, $1, $2) {
			return ($1 ? $0 : '<a href="' + $2 + '" target="_blank">' + $2
				+ '</a>');
		});
	// convert protocol-less URLs into links
	text = text.replace(
		/(:\/\/|>)?\b(([-a-z0-9]+\.)+[a-z]{2,5}(\/[-a-z0-9!#()\/?&.]*[^ !#?().,])?)/gi,
		function($0, $1, $2) {
			return ($1 ? $0 : '<a href="http://' + $2 + '">' + $2
				+ '</a>');
		});
	// convert @mentions into follow links
	text = text.replace(
		/(:\/\/|>)?(@([_a-z0-9-]+))/gi,
		function($0, $1, $2, $3) {
			return ($1 ? $0 : '<a href="' + base_url + $3
				+ '" title="Follow ' + $3 + '" target="_blank">@' + $3
				+ '</a>');
		});
	// convert #hashtags into tag search links
	text = text.replace(
		/(:\/\/[^ <]*|>)?(\#([_a-z0-9-]+))/gi,
		function($0, $1, $2, $3) {
			return ($1 ? $0 : '<a href="' + base_url + hashtag_part + $3
				+ '" title="Search tag: ' + $3 + '" target="_blank">#' + $3
				+ '</a>');
		});

	return text;
}
```

Please forgive the lack of syntax highlighting in the pasted code;
SyntaxHighlighter does not deal well with inline regular expression
strings (such as those used in the `.replace` function calls). Since the
syntax highlighting it was capable of in this scenario actually made it
*more* difficult to read, I opted for no highlighting at all.

As for the function itself… well, you can't argue with results! The
replacement pattern is smart enough that it won't include trailing
punctuation in the URL. "Try something.com. It's great." will only match
"something.com", and not "something.com."—the period as punctuation is
separated from the URL. The same goes for commas, exclamation points,
etc., and the logic applies congruently to URLs with a protocol prefix
and those without (i.e., `https://something.com` versus `something.com`).
Additionally, the pattern will leave previously-converted links
untouched (i.e., the pattern will not see `#anchor` as a hashtag in
`https://something.com/index.php#anchor`).

Once I finish up with the WordPress status feed widget, I will post a
PHP equivalent for this function. This JavaScript code, however, will
likely become the "client-side only" implementation if server-side vs.
client-side rendering is offered as a configuration option.

---

**Update:** The [PHP
version](/2011/04/create-anchor-links-in-twitter-status-text-with-php/)
is finished.
