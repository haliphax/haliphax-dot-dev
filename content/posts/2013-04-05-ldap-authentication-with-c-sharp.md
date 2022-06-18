---
title: "LDAP authentication with C#"
tags: ['post', 'aspx', 'c-sharp', 'dot net', 'encryption', 'ldap', 'security']
layout: post
---

LDAP, or Lightweight Directory Access Protocol, is a convenient, central
repository for a system's personnel information. LDAP (and other Active
Directory services) are widely-used by organizations big and small to
consolidate user credentials and identification data. For instance: a
reporting services application, a webmail client, and a database
administration suite can all read from the same Directory, with no need
for replicating user information. John Doe only has to remember one
password for all systems. When he changes it, those changes cascade
across the board.<!--more-->

*Note: This is a translation of my original post, [LDAP
authentication with VB.NET](/2008/08/ldap-authentication-with-vb-net/),
into the C# language.*

Using C#, you can easily implement LDAP queries and authentication in
your applications and websites. In this example, I will be creating a
simple web application that verifies a user's password—effectively
"logging them in" to the system:

**ASP.NET 2.0 Code:**

```xml
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="ldapLogin" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title>LDAP Login</title>
</head>
<body>
	<form id="form1" runat="server">
		<div id="loginForm" runat="server" visible="false">
	<asp:Label AssociatedControlID="txtUsername" Text="Username:" runat="server" />
			<asp:TextBox ID="txtUsername" runat="server" />
			<asp:Label AssociatedControlID="txtPassword" Text="Password:" runat="server" />
			<asp:TextBox TextMode="Password" ID="txtPassword" runat="server" />
			<asp:Button ID="btnLogin" runat="server" Text="Login" />
		</div>
	</form>
</body>
</html>
```

The code-behind file for this page attempts to connect to the Active
Directory server using the supplied user credentials, and responds with
a respective message:

**C# 3.5 Code:**

```cs
using System.DirectoryServices;

partial class ldapLogin : System.Web.UI.Page
{
	// "login" button clicked
	protected void btnLogin_Click(object sender, EventArgs e)
	{
		// build UID string
		String uid = "uid=" + txtUsername.Text + ",ou=people,dc=example,dc=com";
		// assign password
		String password = txtPassword.Text;
		// define LDAP connection
		DirectoryEntry root = new DirectoryEntry("LDAP://directory.example.com", uid, password, AuthenticationTypes.None);

		try {
			// attempt to use LDAP connection
			object connected = root.Nativeobject;
			// no exception, login successful
			Response.Redirect("/homepage", true);
		} catch (Exception ex) {
			// exception thrown, login failed
			Response.Write("<p style=""color:red;"">Login failed.</p>");
		}
	}

	// page load event
	protected void Page_Load(object Sender, EventArgs e)
	{
		if (IsPostBack) {
			// form submitted, hide login form
			loginForm.Visible = false;
		} else {
			// first page load, show login form
			loginForm.Visible = true;
		}
	}
}
```

The code makes a connection to the LDAP server using the supplied user
credentials and domain information. The actual test for authentication
happens on line 19, where the *NativeObject* member of the *DirectoryEntry*
object is assigned to *connected*. If this assignment
fails, the login was not authenticated, and the program will react
accordingly.

Obviously, the *uid* and connection strings will have to be custom-tailored to
your particular LDAP server. Also, the *AuthenticationType* property may need
to be assigned a different value, depending on... can you guess? That's
right; the authentication method used by your LDAP server.
