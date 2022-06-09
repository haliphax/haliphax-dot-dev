---
title: "Simple file access concurrency in C#"
tags: ['post', 'aspx', 'c-sharp', 'my-software', 'xml']
layout: post
---

When working without the safety net of a RDBMS in a multi-user
environment, file concurrency may become an issue. In a project I've
been working on recently, XML files are being used as the custom data
store. This is all fine and dandy for now—with a user base of 1
(myself)—but when the app is released "into the wild", concurrency may
become a serious problem.

To remedy this problem (in a simple, no-nonsense fashion), I have been
relying on a mutex file to exclude concurrent writes to the XML data
store; it has been holding up just fine in my simulated scenarios. The
mutex allows for one web request to read in the XML, modify it, and
write back to it without being usurped by concurrent requests. There is
a fail-safe mechanism which will wait for up to 3 seconds (30 attempts
to lock the file) before failing outright.<!--more-->

```cs
System.IO.FileStream s = null;

try
{
	bool failed = true;
	int failedCount = 0;

	while(failed && failedCount &lt; 30)
	try
	{
	s = System.IO.File.Create(YourMutexFileName, 1,
		System.IO.FileOptions.DeleteOnClose);
	s.Lock(0, s.Length);
	failed = false;
	}
	catch(Exception ex)
	{
	if(ex is System.IO.IOException)
		failedCount++;
	else
		throw;

	System.Threading.Thread.Sleep(100);
	}

	if(failed)
	throw new Exception("Failed too many times to obtain mutex");

	// ... do something with your resources here ...
}
finally
{
	if(s != null)
	{
		s.Unlock(0, s.Length);
		s.Close();
	}
}
```

*Update: I've wrapped the entire thing in a `try-finally` block so that,
should an unexpected `Exception` occur, the mutex will still be
released. The lack of a `catch` block ensures that the `Exception` will
be propagated up the stack instead of handled, so that it can be dealt
with elsewhere.*
