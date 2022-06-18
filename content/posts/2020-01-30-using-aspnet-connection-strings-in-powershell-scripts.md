---
title: "Using ASP.NET connection strings in PowerShell scripts"
tags: ['post', 'powershell', 'aspx', 'dot net']
layout: post
---

I found a trick for loading ASP.NET `connectionString` elements from
configuration files for use in PowerShell scripts, and I figured I would share
it with the class. They are, as should have been obvious to me much sooner,
simply XML nodes in an XML document. This comes in pretty handy when you have
scripts that you run against one or more databases that you want to use in a
development environment (you must keep in mind that this method will not work
with
[encrypted configuration files](https://docs.microsoft.com/en-us/previous-versions/aspnet/dtkwfdky%28v=vs.100%29)).

```powershell
$conf = [XML](Get-Content 'App_Config/ConnectionStrings.config')
$constr = $conf.SelectSingleNode('connectionStrings/add[@name="MyConnectionString"]').connectionString
$con = New-Object System.Data.SqlClient.SqlConnection($constr)
# etc.
```
