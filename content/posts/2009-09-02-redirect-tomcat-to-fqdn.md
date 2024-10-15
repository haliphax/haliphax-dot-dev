---
title: "Redirect Tomcat to FQDN"
tags: ["post", "security", "tomcat", "archived"]
layout: post
---

Recently, I have been trying to configure several Tomcat servers
(versions 5.0, 5.5, and 6.0) to restrict all traffic to SSL and ensure
that all requests are served through the FQDN (fully-qualified domain
name) of the server involved.

Well, the first half of that adventure was relatively easy to [figure
out](https://marc.info/?l=tomcat-user&m=104951559722619&w=2) (thanks to
Google and some newsgroups). However, the second half of it all—the FQDN
redirection—has been boggling my mind (and my search results) for a
little while... that is, until now.<!--more-->

Rather than leave my coding comrades in arms out in the cold night, I
figured I would post what I've found here. It's not terribly
well-documented for the purpose I have chosen to leverage the feature,
but it works like a charm. What is it, you ask? **The _proxyName_
attribute.**

Set the _proxyName_ attribute of your _Connector_ elements to the FQDN
for your server. Once you've done that, add an _alias_ element to your
_Host_ elements, and you're good to go! No messy Java, no page editing,
no fuss. Now that you can safely assume that users will not be accessing
your site using any shortcut host names, you can install your SSL
certificates with confidence.

**Example server.xml file:**

```xml
<?xml version='1.0' encoding='utf-8'?>
<Server port="8005" shutdown="SHUTDOWN">
	<Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on" />
	<Listener className="org.apache.catalina.core.JasperListener" />
	<Listener className="org.apache.catalina.mbeans.ServerLifecycleListener" />
	<Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" />
	<GlobalNamingResources>
		<Resource name="UserDatabase" auth="Container"
			type="org.apache.catalina.UserDatabase"
			description="User database that can be updated and saved"
			factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
			pathname="conf/tomcat-users.xml" />
	</GlobalNamingResources>
	<Service name="Catalina">
		<Connector port="80" protocol="HTTP/1.1"
			proxyName="myfqdn.server.com"
			connectionTimeout="20000"
			redirectPort="443" />
		<Connector port="443" minSpareThreads="5" maxSpareThreads="75"
			proxyName="myfqdn.server.com"
			enableLookups="true" disableUploadTimeout="true"
			acceptCount="100" maxThreads="200"
			scheme="https" secure="true" SSLEnabled="true"
			SSLCertificateFile="somecert.crt"
			SSLCertificateKeyFile="somekey.key"
			clientAuth="false" sslProtocol="all" />
		<Connector port="8009" protocol="AJP/1.3" redirectPort="443" />
		<Engine name="Catalina" defaultHost="localhost">
			<Realm className="org.apache.catalina.realm.UserDatabaseRealm"
				resourceName="UserDatabase"/>
			<Host name="localhost" appBase="webapps"
				unpackWARs="true" autoDeploy="true"
				xmlValidation="false" xmlNamespaceAware="false">
				<alias>myfqdn.server.com</alias>
			</Host>
		</Engine>
	</Service>
</Server>
```
