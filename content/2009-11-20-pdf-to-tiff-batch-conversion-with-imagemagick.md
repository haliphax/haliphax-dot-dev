---
title: "PDF to TIFF batch conversion with ImageMagick"
tags: ['post', 'image editing', 'my software', 'vbscript']
layout: post
---

I have recently been tasked at work to create a script that will convert
PDF files to TIFF files to be used for annotation within our document
imaging service. The script is responsible for the following process:

-   Create back-up copies of each PDF
-   Time-stamp those back-up copies
-   Convert each PDF to a LZW-compressed TIFF image

<!--more-->  
For posterity's sake, I figured I would go ahead and post an example
version of the script here, in case it might be useful to anyone else.

**VBScript code:**

    '===============================================================================  
    ' Program: Singularity PDF to TIFF conversion script  
    ' Author: haliphax  
    ' Date: 2009/11/19  
    ' Modified: Never  
    ' Description:  
    '  
    ' The script converts all PDF files to TIFF files in a given directory,  
    ' appending the current date and time to backed-up copies of the PDF
    files.  
    '===============================================================================

    ' options  
    sFolder = "c:\temp" ' folder to search for PDF files  
    historyFolder = "c:\temp\history" ' folder to send back-up copies of PDF files  
    convertCmd = "c:\program files\imagemagick\convert.exe" ' ImageMagick command

    ' objects  
    set shell = createObject("WScript.Shell")  
    set fso = createObject("Scripting.FileSystemObject")  
    set folder = fso.getFolder(sFolder)  
    set files = folder.files  
    wscript.echo("*** Batch start: " & Time())

    ' iteratively walk the directory's file list  
    for each fileIdx in files  
        if lCase(right(fileIdx.name, 3)) = "pdf" then  
            ' data for time stamp  
            d = date()  
            t = time()  
            s = second(t)  
            ' grab just the file name (no extension)  
            fileName = left(fileIdx.name, len(fileIdx.name) - 4)  
            ' zero-fill seconds  
            if len(s) < 2 then s = "0" & s  
            ' time stamp to append to the filename  
            append = "_" & replace(formatDateTime(d, 2), "/", "-") & "_" _  
                & replace(formatDateTime(t, 4), ":", "") & s

            ' make a backup of the file if possible  
            if fso.copyFile(sFolder & "\" & fileIdx.name, historyFolder & "\" _  
                & fileName & append & ".pdf") <> 0 _  
            then  
                ' detect error  
                wscript.echo("--- Error copying " & fileIdx.name)  
            else  
                ' successfully backed-up, go ahead and convert w/ ImageMagick  
                ' syntax: convert.exe -compress LZW "{pdfname}" "{tiffname}"  
                r = shell.run("""" & convertCmd & """ -compress LZW """ _  
                    & fileIdx.name & """ """ & fileName & ".tif""", 0, True)

                ' detect error  
                if r <> 0 then  
                    wscript.echo("--- Error converting " & fileIdx.name)  
                else  
                    wscript.echo("+++ Converted: " & fileIdx.name)  
                end if  
            end if  
        end if  
    next

    wscript.echo("*** Batch end: " & Time())  
    ' clean-up  
    set files = nothing  
    set folder = nothing  
    set fso = nothing  
    set shell = nothing
