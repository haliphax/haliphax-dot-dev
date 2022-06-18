---
title: "Using cURL for parallel PHP without pcntl_fork"
tags: ['post', 'curl', 'linux', 'parallel', 'php', 'shell']
layout: post
---

So, you want to do some parallel processing in PHP (alliteration FTW!),
but your service provider does not grant you access to the
[pcntl](https://www.php.net/manual/en/ref.pcntl.php) family of
functions[*](#footnote-1). What do you do? If you're in a *nix
environment with access to the [curl](https://linux.die.net/man/1/curl)
command line application, then you get creative.<!--more-->

First, the caveats:

-   This method spins up background `curl` instances through an `exec()`
    call
-   This uses the web server as the path through which processes are
    "forked"
-   Since this is not a true process forking mechanism, the parent
    process' state is not copied into the new process
-   The labor division mechanism used here is by no means a good method
    for even distribution, but will serve well enough for demonstrative
    purposes
-   The *nonce*-generating mechanism used here is by no means a
    fully-secure solution, but will serve well enough for blah blah

Now, on to the good stuff. Here's how it's going to work:

1.  Reusable values are stored in a configuration file (duh)
2.  The "parent" script divides up the workload by using a unique
    identifier attached to the objects being acted upon
3.  The "child" script ensures that requests are valid (coming from the
    "parent" script and not some random jackhole)
4.  The "child" script loops through its assigned objects
5.  Bob's your uncle

Let's get to it! We begin with a simple configuration file to house
values that we want to use in both the "parent" and "child" scripts.

```php
<?php /* config.inc.php */

$config = array(
	'salt' => 'SOME_SALT_VALUE',
	'max_threads' => 8
);
```

-   The `salt` value is a security measure used to further obfuscate the
    text being encrypted for the *nonce* (the token that signals the
    "child" script to trust the incoming request). [Read more about
    using a `salt` value in your encryption
    processes](https://en.wikipedia.org/wiki/Salt_(cryptography)), if you
    wish—it is beyond the scope of this post.
-   The `max_threads` value should be ratcheted down to a reasonable
    value for your script's environment.

Next, we build a "parent" script that will evenly (and in the case of
this demo script, I use the term loosely) divide up the workload among a
number of worker threads not to exceed the value of `max_threads` in the
`$config` array above.

```php
<?php /* script.php */

require('config.inc.php');

// generate a new nonce
function get_nonce()
{
	$now = time();
	return md5($config['salt'] . $now) . "-{$now}";
}

// initialize the arrays for our workload
$threads = array();
for($a = 0; $a &< $config['max_threads']; $threads[$a++] = array());

// give each thread a (roughly) even portion of objects to work with
$a = 0;
foreach($objects as $object)
	$threads[($a++ % $config['max_threads'])][] = $object->id;

// nonce for "hiding" the thread script from ordinary web access
$nonce = get_nonce();

// fire up the threads
foreach($threads as $k => $t)
{
	// send their workload through a POST request
	$data = implode(',', $t);
	exec("curl -d \"data={$d}\" -d \"thread={$k}\" -d \"nonce={$nonce}\" http://mysite.com/thread.php >/dev/null 2>&1 &");
}
```

Finally, we build the "child" script. Several of these will run
concurrently, acting upon the objects assigned to them by the "parent"
script through tailored `curl` POST requests.

```php
<?php /* thread.php */

require('config.inc.php');

// validate a given nonce
function valid_nonce($nonce)
{
	$parts = explode('-', $nonce);

	if(count($parts) != 2
		|| $parts[0] != md5($config['salt'] . $parts[1]))
	{
		return false;
	}

	return true;
}

// validate nonce
if(! array_key_exists('nonce', $_POST))
	die('No nonce');

$nonce = $_POST['nonce'];

if(! valid_nonce($nonce))
	die('Invalid nonce');

// get thread ID
if(! array_key_exists('thread', $_POST))
	die('No thread');

$thread = $_POST['thread'];
if(! is_int($thread) || $thread &< 0 || $thread >= $config['max_threads'])
	die('Invalid thread');

// parse workload
if(! array_key_exists('data', $_POST))
	die('No workload');

$object_IDs = explode(',', $_POST['data']);

if(! is_array($object_IDs))
	die('Invalid workload');

// loop through object IDs in the workload and so stuff with them
foreach($object_IDs as $id)
	do_something($id);
```

It is a roughly-hewn example, to be sure, but this should provide a
solid basis for circumnavigating hosting service restrictions often
placed on PHP scripts. While you lose out on what some consider to be
features of true forking (i.e., maintaining the state of the parent
process in the child processes), it just takes a different approach to
the problem to come up with a parallel solution using the `curl` method
illustrated in this post.

If you're working with an entirely CLI-based PHP application and the
requisite web server for this method is a show stopper, consider passing
your workload through shared memory, a database, or the file system;
then make `exec()` calls directly against the `php` CLI interpreter
instead of funneling through `curl`. (In fact, this may be the way to
go, regardless of `parent.php` being web-driven, if your `child.php`
script can function from the command line.)

*You could also try using one of various PHP third-party parallel
libraries/extensions, but you may run into troubles due to a restricted
hosting environment in those circumstances, as well.*
