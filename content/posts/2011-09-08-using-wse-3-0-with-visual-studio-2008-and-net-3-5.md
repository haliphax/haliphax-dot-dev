---
title: "Using WSE 3.0 with Visual Studio 2008 and .NET 3.5"
tags: ['post', 'dot net', 'fix', 'tool', 'tutorial']
layout: post
---

While I'm sure many of you have "moved on" to Visual Studio 2010, there
are a large number of us still using 2008. Recently, my shop needed to
write some code for interfacing with a vendor's web services. No
problem, right? Well… not quite. It was quite an undertaking to get a
functional wrapper class for our vendor's web service shoehorned into
Visual Studio 2008 and the .NET 3.5 platform.<!--more-->

**Enabling the WSE Settings GUI tool in VS2008**

1. First, download and install the *WSE 3.0 for Microsoft .NET* package
  from the following url:
  <https://www.microsoft.com/en-us/download/details.aspx?displaylang=en&id=14089>
2. Now, change each instance of *8.0* to *9.0* in the
  *WSESettingsVS3.Addin* file, which should be located here:
  `C:\Documents and Settings\All Users\Application Data\Microsoft\MSEnvShared\Addins\WSESettingsVS3.Addin`
3. In Visual Studio, open the *Tools » Options* dialog.
4. Be sure that the *Show all settings* checkbox is checked.
5. In the *Options* dialog, select *Environment » Add-in/Macros
  Security* and add the following path to the *Add-in File Paths*
  list:
  `C:\Documents and Settings\All Users\Application Data\Microsoft\MSEnvShared\Addins`
6. From the main Visual Studio interface, open the *Tools » Add-in
  Manager* dialog.
7. Enable the *WSE Settings* Add-in.
8. Restart Visual Studio.
9. In your project, right-click the top-most node in the *Solution
  Explorer* window and select *WSE Settings 3.0*.
10. Configure the WSE settings for your project—this will add the
  necessary references and `Web.config` directives.
11. **[OPTIONAL]** If you will be using an authentication mechanism
  which relies on a *UsernameToken*, be sure to set up a
  *UsernameToken Provider</i.>Security Tokens Managers* section of the
  *Security* tab of the WSE settings.

**Generating a WSE proxy class from a WSDL list**

1. Download and install the *.NET Framework 2.0 SDK (x86)*—which is
  necessary for creating the *WebClient*-type proxy/wrapper class—from
  the following url:
  <https://www.microsoft.com/en-us/download/details.aspx?displaylang=en&id=19988>
2. Use the `WseWsdl3.exe` tool with the `/type:webClient` switch to
  generate a *WebClient*-based proxy class for your web service:
  `"c:\Program Files\Microsoft WSE\v3.0\Tools\WseWsdl3.exe" /nologo /type:webClient /out:c:\ProjectFolder\MyWebService.cs http://addres.of/my/webservice?wsdl`
3. Add the generated `*.cs` file to your project's
  `App_Code` directory.

**Note:** You may use `WseWsdl3.exe` without the .NET 2.0 SDK, but it
will only be able to generate *SoapClient*-based proxy classes (which
are difficult to integrate with a *UsernameToken* authentication
header). In this case, you may omit the `/type:` flag altogether, as
*SoapClient* is the default proxy class type.
