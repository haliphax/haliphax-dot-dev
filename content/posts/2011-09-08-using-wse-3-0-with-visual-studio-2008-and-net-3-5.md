---
title: "Using WSE 3.0 with Visual Studio 2008 and .NET 3.5"
tags: ["post", "dot net", "fix", "tool", "tutorial"]
layout: post
---

While I'm sure many of you have "moved on" to Visual Studio 2010, there
are a large number of us still using 2008. Recently, my shop needed to
write some code for interfacing with a vendor's web services. No
problem, right? Well… not quite. It was quite an undertaking to get a
functional wrapper class for our vendor's web service shoehorned into
Visual Studio 2008 and the .NET 3.5 platform.<!--more-->

**Enabling the WSE Settings GUI tool in VS2008**

1. First, download and install the _WSE 3.0 for Microsoft .NET_ package
2. Now, change each instance of _8.0_ to _9.0_ in the
   _WSESettingsVS3.Addin_ file, which should be located here:
   `C:\Documents and Settings\All Users\Application Data\Microsoft\MSEnvShared\Addins\WSESettingsVS3.Addin`
3. In Visual Studio, open the _Tools » Options_ dialog.
4. Be sure that the _Show all settings_ checkbox is checked.
5. In the _Options_ dialog, select _Environment » Add-in/Macros
   Security_ and add the following path to the _Add-in File Paths_
   list:
   `C:\Documents and Settings\All Users\Application Data\Microsoft\MSEnvShared\Addins`
6. From the main Visual Studio interface, open the _Tools » Add-in
   Manager_ dialog.
7. Enable the _WSE Settings_ Add-in.
8. Restart Visual Studio.
9. In your project, right-click the top-most node in the _Solution
   Explorer_ window and select _WSE Settings 3.0_.
10. Configure the WSE settings for your project—this will add the
    necessary references and `Web.config` directives.
11. **[OPTIONAL]** If you will be using an authentication mechanism
    which relies on a _UsernameToken_, be sure to set up a
    _UsernameToken Provider</i.>Security Tokens Managers_ section of the
    _Security_ tab of the WSE settings.

**Generating a WSE proxy class from a WSDL list**

1. Download and install the _.NET Framework 2.0 SDK (x86)_, which is
   necessary for creating the _WebClient_-type proxy/wrapper class
2. Use the `WseWsdl3.exe` tool with the `/type:webClient` switch to
   generate a _WebClient_-based proxy class for your web service:
   `"c:\Program Files\Microsoft WSE\v3.0\Tools\WseWsdl3.exe" /nologo /type:webClient /out:c:\ProjectFolder\MyWebService.cs http://addres.of/my/webservice?wsdl`
3. Add the generated `*.cs` file to your project's
   `App_Code` directory.

**Note:** You may use `WseWsdl3.exe` without the .NET 2.0 SDK, but it
will only be able to generate _SoapClient_-based proxy classes (which
are difficult to integrate with a _UsernameToken_ authentication
header). In this case, you may omit the `/type:` flag altogether, as
_SoapClient_ is the default proxy class type.
