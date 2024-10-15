---
title: "Using the ConnectionStrings element in ASP.NET web.config"
tags: ["post", "aspx", "dot-net", "sql"]
layout: post
---

If you are building a series of web applications that
may rely on duplicate data (such as connection strings for pages that
query databases), or you want to separate certain constants from your
other code, you need a centralized method for storing and referencing
that data. In this case, the `ConnectionStrings` element in the
_web.config_ file of either your
application's root directory, parent directory, or the web server root
directory--depending on your application's inheritance--can prove
incredibly useful.<!--more-->

Keys can be created within the element and given values. These values
can then be recalled by any web applications which inherit the settings
from the particular _web.config_
file. This can be a particularly advantageous tool for recycling
database connection strings in web application suites and web service
frameworks.

**ASP.NET 2.0 (.NET Framework 3.5) web.config:**

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
	<connectionStrings>
		<add name="databaseReader" connectionString="server=sqlserver.myhost.com;database=myDatabase;uid=username;pwd=password;" />
	</connectionStrings>
	<system.web>
		<!-- insert web-specific contents, et al -->
	</system.web>
</configuration>
```

The example given above is a stripped-down implementation of _web.config_, and particular to
database-driven web applications.

Now that you've got your data tucked away in the _web.config_ file, it's time to use it
in your web application. We will make use of the `ConfigurationManager.ConnectionStrings`
method in order to accomplish this:

**VB.NET 3.5 code:**

```vb
' Grab the connection string from web.config's ConnectionStrings element
Dim connStr as String = ConfigurationManager.ConnectionStrings("databaseReader").ConnectionString
' Connect to the database using the retrieved connection string
Dim conn as SqlConnection = new SqlConnection(connStr)

' Output the database server's connection status
Try
	conn.Open()
	Response.Write("Database connection was successful.<br />")
Catch ex as Exception
	Response.Write("Could not connect to the database.<br />")
End Try
```

Use this method in conjunction with the before-mentioned [prepared
statements](/2008/07/prepared-sql-statements-in-vb-net/),
and you've got yourself a nifty little RDBMS connection that is
(somewhat) secure... and, more importantly, replicated even in the event
of a change to the `ConnectionStrings` key's value.
