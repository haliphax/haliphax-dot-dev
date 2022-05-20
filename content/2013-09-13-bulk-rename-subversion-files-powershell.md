---
title: "Bulk rename Subversion files with PowerShell"
tags: ['post', 'fix', 'powershell', 'regex', 'svn', 'tool', 'webfocus']
layout: post
---

Scenario: We're upgrading our reporting software at work, and the way
that it used to integrate with SVN (through a terrible SCC bridge)
involved arbitrarily placing "app_" at the head of the file names. Of
course, in the new version, they no longer do this, and so all of our
SVN references are out of whack. While renaming all of them to remove
the "app_" at the beginning isn't the entire solution, it's one step I
had to follow that I believe will be of benefit to others.<!--more-->

I used the following PowerShell script to pull it off:

```powershell
	Get-ChildItem -recurse |
		Where-Object {
			-not $_.PsIsContainer -and $_.Name -match "^app_"
		} |
		ForEach {
			$fullname = $_.FullName
			$newname = $fullname -replace '\\app_', '\' iex "svn rename '$fullname' '$newname'"
		}
```

**Note:** You will need a command-line SVN client to do this. I used
[CollabNet's SVN client](https://www.collab.net/downloads/subversion),
but there are others out there.
