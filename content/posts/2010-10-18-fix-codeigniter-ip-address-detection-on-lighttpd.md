---
title: "Fix CodeIgniter IP address detection on lighttpd"
tags: ["post", "codeigniter", "lighttpd", "php"]
layout: post
---

If the results of a call to _$this->input->ip_address()_ gives
you "0.0.0.0" (the "invalid address" response) and you're running
**lighttpd** as your web server, you may be able to fix it <s>with a
minor tweak to</s> by extending one of the base **CodeIgniter** libraries.
An IPv6-style header is being appended to the IPv4 address, most likely,
and stripping it out before CodeIgniter considers the validity of your
address should restore functionality without circumventing any of the
logic.<!--more-->

<s>Crack open the _system/libraries/Input.php_ file and find the
following code:</s>

**PHP code:**

```php
if (!$this->valid_ip($this->ip_address))]
```

<s>...and replace it with this:</s>

**PHP code:**

```php
$this->ip_address = preg_replace("#^[:a-z0-9]+:#i", "", $this->ip_address);

if (!$this->valid_ip($this->ip_address))
```

## Update

**As mentioned in Anthony's comment below, this edit requires that you
modify a core CodeIgniter library. In order to avoid this, you can
create a class definition in _system/application/libraries/Input.php_
that extends the functionality of the _valid_ip()_ function (which is
used internally by _$this->input->ip_address()_). He has been so
kind as to provide a class-encapsulated version of my snippet <s>on
github</s> which does just that. Thanks, Anthony!**

Here is the updated code:

**PHP code:**

```php
<?php if (! defined('BASEPATH')) exit('No direct script access allowed');

require_once(BASEPATH.'/libraries/Input.php');

/**
* Input Class Override
*
* Pre-processes global input data for security
*
* @package CodeIgniter
* @subpackage Libraries
* @category Input
* @author haliphax / ExpressionEngine Dev Team
* @link https://codeigniter.com/user_guide/libraries/input.html
*/
class Input extends CI_Input
{
	function Input()
	{
		parent::CI_Input();
	}

	/**
	* Validate IP Address
	*
	* Updated version suggested by Geert De Deckere
	*
	* @access public
	* @param string
	* @return string
	* @see https://haliphax.dev/2010/10/fix-codeigniter-ip-address-detection-on-lighttpd/
	*/
	function valid_ip($ip)
	{
		$ip = preg_replace("/^[:a-z0-9]+:/i", "", $ip); // See the link in the @see declaration above for more info

		$ip_segments = explode('.', $ip);

		// Always 4 segments needed
		if (count($ip_segments) != 4)
		{
			return FALSE;
		}

		// IP can not start with 0
		if ($ip_segments[0][0] == '0')
		{
			return FALSE;
		}

		// Check each segment
		foreach ($ip_segments as $segment)
		{
			// IP segments must be digits and can not be
			// longer than 3 digits or greater then 255
			if ($segment == '' || preg_match("/[^0-9]/", $segment) ||
				$segment > 255 || strlen($segment) > 3)
			{
				return FALSE;
			}
		}

		return TRUE;
	}
}
```

If having "::ffff:" in front of your addresses was causing the problem,
this snippet should have you back on your way juggling IP addresses in
no time.
