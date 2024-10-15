---
title: "Simple MD5 hashes in VB.NET"
tags: ["post", "dot-net", "encryption", "vbnet"]
layout: post
---

MD5 (Message Digest) hashes are a simple, efficient way to
encode/encrypt information to be passed around. Rather than containing
the data itself, an MD5 hash is merely a fingerprint of the information.
The hash cannot be decrypted, but is instead compared to other hashed
values for verification. This can be a handy tool when authenticating a
user's entered password as one simple example.

Here is a very efficient, simple function that can be used to generate
an MD5 hash for a given string...<!--more-->

**VB.NET 3.5 Code:**

```vb
Public Function hashGen( _
ByVal sourceText As String) _
As String
	' retrieve byte array based on source text, then
	' compute hash and convert to string
	Return Convert.ToBase64String(New MD5CryptoServiceProvider(). _
		ComputeHash(New UnicodeEncoding().GetBytes(sourceText)))
End Function
```

In order to effectively use this hash value for verification, you will
need a function that compares two hash values...

**VB.NET 3.5 Code:**

```vb
Public Function hashCompare( _
ByVal firstHash As String, _
ByVal compareText As String) _
As Boolean
	' generate hash for compareText
	Dim compareHash = hashGen(compareText)

	' if lengths are different, fail
	If firstHash.Length <> compareHash.Length Then
		Return False
	Else
		' otherwise, compare value of each character
		Dim intCount As Integer = 0

		For intCount = 0 To firstHash.Length - 1
			' fail if different
			If firstHash(intCount) <> compareHash(intCount) Then
				Return False
			End If
		Next

		Return True
	End If
End Function
```

These functions' place in an authentication procedure would involve
hashing a user's entered password, for instance, and then comparing it
to the hash generated from their LDAP password (or other password
repository of sorts). Other examples of where MD5 may prove useful
include checking sensitive user data, such as credit card numbers, home
addresses, phone numbers... you name it.

Note: You may want to use the `UTF8Encoding` object (or some other
encoder) instead of `UnicodeEncoding`, depending on the
format of the data you will be comparing.
