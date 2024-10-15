---
title: "Programmatically compile Audiences in SharePoint 2010"
tags:
  ["post", "aspx", "c-sharp", "powershell", "sharepoint", "tool", "archived"]
layout: post
---

According to the documentation for the SharePoint 2010 SDK, you cannot
trigger Audience compilation programmatically. Well—that's not true. It
isn't documented, but it _is_ possible. The painful thing about it is
that you must know the `ApplicationId` of the `UserProfileService`
application. This is where reflection comes in _extremely_
handy!<!--more-->

Below, you will find two incredibly similar snippets of code: one C#
example and one PowerShell example. They both focus on reflecting to
grab the `ApplicationId` and then using the `RunAudienceJob` method to
queue the compilation. I found many examples online that explain the
method call, and many that showed how to use reflection to pull out the
`ApplicationId`, but none of the articles I found showed the whole
picture from start to finish. Here you go.

**C# server-side code:**

```cs
SPSecurity.RunWithElevatedPrivileges(delegate()
{
	// get the assembly which hosts the UserProfile class
	Assembly userProfilesAssembly = typeof(UserProfile).Assembly;
	// get the type of the UserProfileApplicationProxy
	Type userProfileApplicationProxyType =
		userProfilesAssembly.GetType("Microsoft.Office.Server.Administration.UserProfileApplicationProxy");
	// get the proxy object
	object proxy =
		SPServiceContext.Current.GetDefaultProxy(userProfileApplicationProxyType);
	// get the UserProfileApplication property which holds the actual application
	object profile = proxy.GetType().GetProperty("UserProfileApplication",
		BindingFlags.NonPublic | BindingFlags.Instance).GetValue(proxy, null);
	// get the Id of the application
	Guid applicationId =
		((Microsoft.SharePoint.Administration.SPPersistedObject)profile).Id;

	string[] args = new string[4];
	// application ID of UserProfileApplication
	args[0] = applicationId.ToString();
	// 1 = start, 0 = stop
	args[1] = "1";
	// 1 = full, 0 = incremental
	args[2] = "0";
	// audience name
	args[3] = "Audience Name";

	// compile the audience
	int result = Microsoft.Office.Server.Audience.AudienceJob.RunAudienceJob(args);
	AudienceJobReturnCode returnCode =
		(AudienceJobReturnCode)Enum.Parse(typeof(AudienceJobReturnCode),
			result.ToString());
});
```

_Note: You must run the PowerShell script as a Farm Administrator user,
or you will be unsuccessful!_

**PowerShell command-line code:**

```powershell
if((Get-PSSnapin "Microsoft.SharePoint.PowerShell" -ErrorAction SilentlyContinue) -eq $null) {
	Add-PSSnapin "Microsoft.SharePoint.PowerShell"
}

$site = Get-SPSite "http://location.of.site"
$audience = "Audience Name"
$context = Get-SPServiceContext $site
$proxy = $context.GetDefaultProxy([Microsoft.Office.Server.Audience.AudienceJob].Assembly.GetType("Microsoft.Office.Server.Administration.UserProfileApplicationProxy"))
$applicationId = $proxy.GetType().GetProperty("UserProfileApplication", [System.Reflection.BindingFlags]"NonPublic, Instance").GetValue($proxy, $null).Id.Guid
[Array]$args = $applicationId, "1", "0", $audience
[int]$runjob = [Microsoft.Office.Server.Audience.AudienceJob]::RunAudienceJob($args)
$site.Dispose()
```

(For an explanation of `$args` in that PowerShell snippet, see the C#
example.)
