---
title: "Batch convert audio files to MP3 with PowerShell and VLC Player"
tags: ['post', 'audio', 'my-software', 'powershell', 'tool', 'vlc']
layout: post
---

I adapted [a PowerShell script by Tim Van
Wassenhove](https://www.timvw.be/2010/11/20/convert-aacm4a-files-to-mp3-with-vlc-and-powershell/)
that recurses through a given directory, searching for various types of
audio files. These files are then converted to MP3 using VLC Player's
command-line interface. My adjustments to Tim's original script include
some string handling bits that ensure filenames with potentially
dangerous characters (apostrophes in the case of the VLC command line,
and square brackets in the case of the `Remove-Item` call) are taken
care of.<!--more-->

**mp3convert.ps1:**

```powershell
function ConvertToMp3([switch] $inputObject, [string] $vlc = 'C:\Program Files (x86)\VLC\vlc.exe') {
	process {
		Write-Host $_
		$codec = 'mp3'
		$newFile = $_.FullName.Replace("'", "\'").Replace($_.Extension, ".$codec")
		&"$vlc" -I dummy "$_" ":sout=#transcode{acodec=$codec,vcodec=dummy}:standard{access=file,mux=raw,dst=`'$newFile`'}" vlc://quit | out-null
		# Uncomment the next line when you're sure everything is working right
		#Remove-Item $_.FullName.Replace('[', '`[').Replace(']', '`]')
	}
}

function ConvertAllToMp3([string] $sourcePath) {
	Get-ChildItem "$sourcePath\*" -recurse -include *.wma,*.aac,*.ogg,*.m4a | ConvertToMp3
}
```

To use:

```powershell
. C:\mp3convert.ps1
ConvertAllToMp3 C:\Music
```

*Note: If you're going to kill the process, **make sure you kill it from
the PowerShell environment, and not from the VLC environment!** If you
kill it from the VLC environment and you've enabled the `Remove-Item`
line, the file it's currently working on will be deleted!*

If you want to take this process a step further and copy ID3 tags, check
out [Andrew Connell's blog
post](https://www.andrewconnell.com/blog/archive/2012/05/16/converting-all-your-non-mp3-files-to-mp3rsquos-with-vlc.aspx).
