---
title: "Circumvent Get-ADGroupMember limit in PowerShell"
tags: ['post', 'active-directory', 'fix', 'powershell']
layout: post
---

If you've ever tried to pull the `members` list of a large AD group with
the `Get-ADGroupMember` PowerShell cmdlet, you will undoubtedly have run
up against an error message telling you that the limit has been
exceeded. There is, however, a way to work around this limitation: Using
`Get-ADGroup` and some creativity.<!--more-->

`Get-ADGroup` can be used to pull the DN of each member in the group if
you add the `-Properties Members` flag. Then, using `Get-ADUser` and
passing the DN as a parameter, you can get a user object for each member
and then handle them as you wish:

```powershell
Import-Module ActiveDirectory -ErrorAction SilentlyContinue

$group = Get-ADGroup "group name goes here" -Properties Members

$group.Members | % {
	$user = Get-ADUser $_
	# Do something with the $user object here
}
```

It's that simple!
