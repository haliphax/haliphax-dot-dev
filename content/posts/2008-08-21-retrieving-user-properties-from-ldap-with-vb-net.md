---
title: "Retrieving user properties from LDAP with VB.NET"
tags: ["post", "dot net", "ldap", "vbnet"]
layout: post
---

As discussed in [an earlier
post](/2008/08/ldap-authentication-with-vb-net/), LDAP
can be a wonderful tool for centrally storing user information and
credentials. I've written about how to authenticate against the LDAP
repository... but what if you're just looking for
information?<!--more-->

The following code will contact the LDAP server and retrieve all
properties for a specific user record, designated by the uid supplied on
the command line:

**VB.NET 3.5 Code:**

```vb
Imports System.DirectoryServices

Module ldapTest
	Sub Main()
		' pull uid to search for from command line
		Dim uidToSearch As String = Command()
		' uid with sufficient access to "browse" directory
		Dim uid As String = "uid=some_admin,ou=ExternalAdmins,dc=example,dc=com"
		' password for browser
		Dim password As String = "AdminPasswordGoesHere"
		' build directory entry with browser's credentials
		Dim root As DirectoryEntry = New DirectoryEntry( _
			"LDAP://directory.example.com/ou=people,dc=example,dc=com", uid, _
			password, AuthenticationTypes.None)
		' build directory searcher for root entry
		Dim searcher As DirectorySearcher = New DirectorySearcher(root)
		' filter down to requested uid
		searcher.Filter = "(uid=" & uidToSearch & ")"

		' iterate through found record's properties
		For Each prop As DictionaryEntry In searcher.FindOne().Properties
			Console.Write(prop.Key.ToString & " = ")

			' iterate through property's values
			For Each propVal In prop.Value
				If TypeOf propVal Is Byte() Then
					' convert byte arrays to strings (password hashes, etc.)
					Console.WriteLine(Convert.ToBase64String(propVal))
				Else
					Console.WriteLine(propVal)
				End If
			Next
		Next
	End Sub
End Module
```

With a little bit of work, this could easily be adapted to glean
information about other Active Directory objects. The source may also
prove useful in conjunction with the login script (linked-to above) for
more comprehensive/interactive lookup scripts, etc.
