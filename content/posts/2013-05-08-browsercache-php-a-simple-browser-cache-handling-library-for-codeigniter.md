---
title: "Browsercache.php: A simple browser-cache-handling library for CodeIgniter"
tags: ["post", "codeigniter", "my-software", "php"]
layout: post
---

While [CodeIgniter](https://codeigniter.com) provides a disk caching
mechanism, it lacks a _browser_ caching mechanism. Without a lengthy
introduction, here's one.<!--more-->

**Browsercache.php**

```php
<?php if(! defined('BASEPATH')) exit();

class Browsercache
{
	private $ci;

	function __construct()
	{
		$this->ci =& get_instance();
	}

	public function cacheFor($minutes)
	{
		$this->ci->output->cache($minutes);
		$this->ci->output->set_header(sprintf('Expires: %s GMT', gmdate('D, d M Y H:i:s', time() + ($minutes \* 60))));
	}

	public function dontCache()
	{
		$this->ci->output->set_header('Cache-Control: no-store, no-cache, must-revalidate');
		$this->ci->output->set_header('Cache-Control: post-check=0, pre-check=0', false);
		$this->ci->output->set_header('Pragma: no-cache');
	}
}
```

Throw that in your `application/libraries` folder, and use it like so:

- Cache a page for 30 minutes: `$this->browsercache->cacheFor(30);`
- Prevent a page from being cached: `$this->browsercache->dontCache();`

Yup. That's it. Use it wherever you want to.

I've also created [a gist for it on
GitHub](https://gist.github.com/haliphax/5545491).
