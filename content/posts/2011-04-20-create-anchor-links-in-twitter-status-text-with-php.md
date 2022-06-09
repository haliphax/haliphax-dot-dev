---
title: "Create anchor links in Twitter status text with PHP"
layout: post
tags: ['post', 'php', 'my-software']
---

In a previous blog post, I outlined how to [convert Twitter @mentions,
#hashtags, and
URLs](/2011/03/create-anchor-links-in-twitter-status-text-with-javascript/)
(with or without protocol prefixes) into anchor links using JavaScript.
Here is that same process wrapped up in a PHP function instead for your
server-side needs.<!--more-->

```php
// convert @mentions, #hashtags, and URLs (w/ or w/o protocol) into links
function twitter_links($text)
{
	// convert URLs into links
	$text = preg_replace(
		"#(https?://([-a-z0-9]+\.)+[a-z]{2,5}([/?][-a-z0-9!\#()/?&+]\*)?)#i",
		"<a href='$1' target='_blank'>$1</a>",
		$text);
	// convert protocol-less URLs into links
	$text = preg_replace(
		"#(?!https?://|<a[\^>]+>)(\^|\s)(([-a-z0-9]+\.)+[a-z]{2,5}([/?][-a-z0-9!\#()/?&+.]\*)?)\b#i",
		"$1<a href='http://$2'>$2</a>",
		$text);
	// convert @mentions into follow links
	$text = preg_replace(
		"#(?!https?://|<a[\^>]+>)(\^|\s)(@([_a-z0-9\-]+))#i",
		"$1<a href=\"http://twitter.com/$3\" title=\"Follow $3\"
		target=\"_blank\">@$3</a>",
		$text);
	// convert #hashtags into tag search links
	$text = preg_replace(
		"#(?!https?://|<a[\^>]+>)(\^|\s)(\#([_a-z0-9\-]+))#i",
		"$1<a href='http://twitter.com/search?q=%23$3' title='Search tag:
		$3' target='_blank'>#$3</a>",
		$text);
	return $text;
}
```
