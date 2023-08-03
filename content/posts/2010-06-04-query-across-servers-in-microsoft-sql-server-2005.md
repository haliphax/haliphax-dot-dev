---
title: "Query across servers in Microsoft SQL Server 2005"
tags: ["post", "sql"]
layout: post
---

If your organization/project has data repositories spread across more
than one database server, chances are that you will eventually want to
pull data from more than one server instance in a single query. If you
want to perform these cross-server queries without setting up a
persistent _Linked Server_ configuration, a particular configuration
option is required.<!--more-->

With regard to your SQL server configuration, this option is known as
_Ad-Hoc Distributed Queries_. In Microsoft SQL Server 2000, the option
was enabled by default. This is not the case with Microsoft SQL Server 2005. In order to enable this configuration option, the _spgconfigure_
built-in stored procedure can be utilized like so:

```sql
spgconfigure 'Ad-Hoc Distributed Queries', 1
reconfigure
```

To check that the option has indeed been enabled (and to view your other
configuration settings), execute the following statement and verify that
the run configuration for _Ad-Hoc Distributed Queries_ shows a value of
_1_.

```sql
spgconfigure
```

Now that you've enabled _Ad-Hoc Distributed Queries_, you may use either
the _OpenRowSet_ or _OpenDataSource_ built-in functions. In the example
below, _OpenDataSource_ is used:

```sql
select * from OpenDataSource('SQLOLEDB', 'DataSource=servername;User ID=user;Password=password').databasename.schema.tablename
```

The first parameter passed to _OpenDataSource_ is the OLE driver to be
used when making the connection. Here, _SQLOLEDB_ is used for MSSQL
Server access; however, you could just as easily pull from an MS Access
database (or other data sources for which you have an OLE driver).

The second parameter passed to _OpenDataSource_ is the standard
connection string for your database server instance. A fantastic list of
these is available from
[ConnectionStrings.com](https://www.connectionstrings.com) if you are
having trouble building one for your particular data source type.

Once _OpenDataSource_ has been executed, you chain off of it as if you
are building a standard query across databases which exist on the same
server. If we were querying a table of schema _dbo_, table name _cars_
from the database _automotive_ on server _secondserver_ with username
_tester_ and password _testpass_, your query would look like this:

```sql
select * from OpenDataSource('SQLOLEDB', 'DataSource=secondserver;User ID=tester;Password=testpass').automotive.dbo.cars
```

...and there you have it: An ad-hoc, cross-server query. Should you wish
to use this convention on a more permanent basis, you may consider adding a
[Linked Server](https://docs.microsoft.com/en-us/sql/relational-databases/linked-servers/linked-servers-database-engine),
instead.

One benefit to the _Linked Server_ approach: You can tweak the
cross-server connection credentials on a per-login basis. If, for
instance, you have three power users who require their own,
custom-tailored credentials, you can setup default credentials for
everyone else's login that does not appear in your pre-configured list
(or map unconfigured logins to the distant server using the local
server's current login).
