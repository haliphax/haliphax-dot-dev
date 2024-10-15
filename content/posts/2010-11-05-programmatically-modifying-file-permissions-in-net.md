---
title: "Programmatically modifying file permissions in .NET"
tags: ["post", "c-sharp", "dot-net", "security"]
layout: post
---

For one reason or another, somewhere down the line, you're probably
going to want to modify a file's access permissions from your code.
Maybe your users have a nasty habit of overwriting them, or you want to
ensure that newly-created files are given a specific permission mask.
Whatever the reason, the following **C#** code example shows how to
modify a file's access permissions using the `System.Security.Principal`
and `System.Security.AccessControl` namespaces.<!--more-->

**C# code:**

```cs
using System.Security.Principal;
using System.Security.AccessControl;

// ...

// deny WRITE permission to DOMAIN\user
string fileLocation = "c:\\temp.txt";
NTAccount acct = new NTAccount("DOMAIN", "user");
FileSecurity sec = System.IO.File.GetAccessControl(fileLocation);
sec.AddAccessRule(new FileSystemAccessRule(acct, FileSystemRights.Write, AccessControlType.Deny));
System.IO.File.SetAccessControl(fileLocation, sec);
```

In the example, the `Write` permission is being denied to the
`DOMAIN\user`. Different combinations of the `FileSystemRights` and
`AccessControlType` options available could be leveraged for different
results (i.e., _allowing_ `Read` access).
