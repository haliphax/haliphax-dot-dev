---
title: "bulkRename v1.1"
tags: ['post', 'dot net', 'my-software', 'regex', 'tool', 'vbnet']
layout: post
---

A while back (in 2008), I wrote a simple system utility with VB.NET
which leverages the power of [regular
expressions](https://www.regular-expressions.info) to rename files in
bulk according to a pattern. I've had to use it several times recently
after placing it on a metaphorical shelf to gather dust, and it got me
thinking: Maybe other people can benefit from this utility. That's what
software is supposed to be all about, right?<!--more-->

The syntax is simple: You specify the root folder to traverse, the
current naming convention, and the *re-*naming convention. There's even
a flag for testing your expressions with a "dry run", which won't
actually rename anything, but instead just shows you what *would*
happen. (The flag is "**-t**".)

    bulkRename.exe <root folder> -c <current convention> -r <renaming convention>]

**NOTE:** If you wish to avoid the use of regular expressions, keep in
mind that you should "escape" any reserved characters (such as the
"dot") by preceding them with a backslash. For the same reason, literal
backslashes must also be preceded by a backslash.

<s>Download a copy of bulkRename
v1.1 for yourself.</s> *See [v2.0](/2011/11/bulkrename-v2-0-released/), instead!*

To show my support for open source software, I am also releasing the
code for this nifty little tool. See below.

**VB.NET code:**

```vb
'===============================================================================
' Title: bulkRename
' Author: haliphax
' Version: 1.1
' Date: 9/17/2008
' Description: Rename files in bulk given a root folder, a regex to compare
' against for filename matches, and a new naming convention which
' can use group references from the filename regex.
'===============================================================================

Imports System.Text.RegularExpressions

Module bulkRename
	Sub Main()
		Console.WriteLine("bulkRename.exe v1.1 by haliphax - 9/17/08")
		Console.WriteLine("==========================================")

		' boolean for test mode - no actual file renaming takes place
		Dim testOnly As Boolean = False
		If Regex.Match(Command, "(^| )-t($| )").Success Then
			testOnly = True
			Console.WriteLine("*** TEST ONLY, WILL NOT RENAME ***")
		End If

		' root folder
		Dim root As String = Regex.Match(LTrim(Command), "^[^ ]+").Value
		' regex for current file naming convention
		Dim curRgx As String = Regex.Match(Command, "-c ([^ ]+)").Groups(1).Value
		' format for new file naming convention
		Dim renFmt As String = Regex.Match(Command, "-r ([^ ]+)").Groups(1).Value

		' validate parameters
		If root = "" Or curRgx = "" Or renFmt = "" Then
			Console.WriteLine("Syntax:")
			Console.WriteLine("bulkRename.exe [<folder>] -c <regex pattern>" & _
				" -r <rename pattern>")
			Exit Sub
		End If

		' test regex for flaws
		Try
			Regex.Match("", curRgx)
		Catch ex As Exception
			Console.WriteLine("Error: " & ex.Message)
			Exit Sub
		End Try

		' trim root if it has a trailing backslash
		If Right(root, 1) = "\\" Then root = Left(root, root.Length - 1)

		' load files in root folder
		Dim files = Nothing

		Try
			files = My.Computer.FileSystem.GetFiles(root)
		Catch ex As Exception
			Console.WriteLine("Error: " & ex.Message)
			Exit Sub
		End Try

		Dim counter As Integer = 0
		Console.WriteLine("* Root Folder: " & root)

		' iterate through file list and check for matches
		For Each fileName As String In files
			' file matches regex for current convention
			If Regex.Match(fileName, curRgx).Success Then
				counter += 1
				' build new file name and output renaming action
				Dim newFileName As String = Regex.Replace(fileName, curRgx, _
					renFmt)
				newFileName = Right(newFileName, _
					newFileName.Length - root.Length - 1)
				Dim displayName As String = Right(fileName, _
					fileName.Length - root.Length - 1)
				Console.WriteLine(displayName & " ==> " & newFileName)

				' actually rename if not in test mode
				If Not testOnly Then
					Try
						My.Computer.FileSystem.RenameFile(fileName, newFileName)
					Catch ex As Exception
						Console.WriteLine("Error: " & ex.Message)
					End Try
				End If
			End If
		Next

		Console.WriteLine("* Files renamed: " & counter)
	End Sub
End Module
