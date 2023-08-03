---
title: "Prepared SQL statements in VB.NET"
tags: ["post", "dot net", "security", "sql", "vbnet"]
layout: post
---

Thousands of websites have been hit lately by the rash of SQL injections
being perpetrated en-masse. Most languages (current versions, at least)
have a procedure for separating parameters from the query they augment
in an effort to prevent SQL injection, and VB.NET is no
different.<!--more-->

Assuming you have stored the connection string for your _SqlConnection_
object in a [_ConnectionString_
key](/2008/07/using-the-connectionstrings-element-in-asp-net-web-config/)
called _databaseReader_, the following code will build and execute a
prepared statement that will resist SQL injection techniques:

**VB.NET 3.5 code:**

```vb
Dim conn As SqlConnection ' Connection to SQL database server
Dim cmd As SqlCommand ' Command object to build + execute prepared statement
Dim dr As SqlDataReader ' Data reader object to retrieve query results

Try
	' Connect to database using ConnectionStrings key
	conn = New SqlConnection(ConfigurationManager.ConnectionStrings("databaseReader").ConnectionString)
	' Construct command object with parameterized query string
	cmd = New SqlCommand("select Name from Locations where Code = @code and Active = 1", conn)
	' Add parameter and associated value to the command object
	cmd.Parameters.AddWithValue("@code", Request.QueryString("code"))
	' Open the database connection and execute the command object's prepared statement
	conn.Open()
	' The result set is aggregated into the DataReader object
	dr = cmd.ExecuteReader()

	' Read the first result and display the value
	If (dr.Read()) Then
		Response.Write(dr("Name") + "<br />")
	Else
		Response.Write("Query returned empty result set.<br />")
	End If
Catch ex As Exception
	' Handle exceptions that have been raised during query instantiation/execution
	Response.Write("An error has occurred.<br />")
End Try
```

The _Request.QueryString("code")_
variable can contain SQL injection attempts, but the prepared statement
does not consider the parameter _@code_ to be a part of the
query--rather, it is considered just what it should be: a parameter. If
_@code_ was assigned the value _"1 OR 1=1; --"_, the query would not
return the first value from the database table being queried as it would
under the deprecated, old-fashioned methodology of including the text
directly in a query string. Instead, it will try to search for a record
that literally matches _"1 OR 1=1; --"_, which it won't find (unless, of
course, there **is** a column with this value for some strange reason).

<u>P.S.</u> - If you're going
to be doing a lot of code beyond this point that does not require the
SqlConnection object, you should _.Close()_ it.

<u>P.P.S.</u> - For those of
you who are confused, _"1 OR 1=1; --"_, when supplanted into the query
statement, would render the query thus: _"select Name from Locations
where Code = 1 OR 1=1; -- and Active = 1"_. Since 1 is always equal to
1, and the _"and Active = 1"_ portion of the query has been removed
using SQL commenting syntax (--), the query will select the _Name_
column from every row in the database table that is being queried. Not
good. Not necessarily malicious, either, but it is a rather timid
example of SQL injection techniques. Trust me, they get much, much
worse.
