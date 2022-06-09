---
title: "LDAP authentication with VB.NET"
tags: ['post', 'aspx', 'dot net', 'encryption', 'ldap', 'security', 'vbnet']
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

*~~**Update:** As this continues to be the most searched-for article on
my site, I will be posting a C# version in the near future. Stay
tuned!~~ The article is live! For an example in C#, see the other post:
[LDAP authentication with
C#](/2013/04/ldap-authentication-with-c-sharp/)*

Using VB.NET, you can easily implement LDAP queries and authentication
in your applications and websites. In this example, I will be creating a
simple web application that verifies a user's password--effectively
"logging them in" to the system:

**ASP.NET 2.0 Code:**

    #!xml
    <%@ Page Language="VB" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="ldapLogin"  %>

    <!DOCTYPE html PUBLIC  "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title>LDAP Login</title>
    </head>
    <body>
        <form id="form1" runat="server">
            <div id="loginForm" runat="server" visible="false">
                Username:
                <br />
                <asp:TextBox ID="txtUsername" runat="server" />
                <p />
                Password:
                <br />
                <asp:TextBox TextMode="Password" ID="txtPassword" runat="server" />
                <p />
                <asp:Button ID="btnLogin" runat="server" Text="Login" />
            </div>
        </form>
    </body>
    </html>

The code-behind file for this page attempts to connect to the Active
Directory server using the supplied user credentials, and responds with
a respective message:

**VB.NET 3.5 Code:**

    #!vbnet
    Imports System.DirectoryServices

    Partial Class ldapLogin
        Inherits System.Web.UI.Page

        ' "login" button clicked
        Protected Sub btnLogin_Click( _
        ByVal sender As Object, _
        ByVal e As System.EventArgs) _
        Handles btnLogin.Click
            ' build UID string
            Dim uid As String = "uid=" & txtUsername.Text & ",ou=people,dc=example,dc=com"
            ' assign password
            Dim password As String = txtPassword.Text
            ' define LDAP connection
            Dim root As DirectoryEntry = New DirectoryEntry( _
                "LDAP://directory.example.com", uid, password, _
                AuthenticationTypes.None)

            Try
                ' attempt to use LDAP connection
                Dim connected As Object = root.NativeObject
                ' no exception, login successful
                Response.Write( "<span style=""color:green;"">Login successful.</span>")
            Catch ex As Exception
                ' exception thrown, login failed
                Response.Write( "<span style=""color:red;"">Login failed.</span>")
            End Try

            Response.Write("<p />")
        End Sub

        ' page load event
        Protected Sub Page_Load( _
        ByVal sender As Object, _
        ByVal e As System.EventArgs) _
        Handles Me.Load
            If Page.IsPostBack Then
                ' form submitted, hide login form
                loginForm.Visible = False
            Else
                ' first page load, show login form
                loginForm.Visible = True
            End If
        End Sub
    End Class

The code makes a connection to the LDAP server using the supplied user
credentials and domain information. The actual test for authentication
happens on line 26, where the *NativeObject* member of the *DirectoryEntry*
object is assigned to *connected*. If this assignment
fails, the login was not authenticated, and the program will react
accordingly.

Obviously, the *uid* and connection strings will have to be custom-tailored to
your particular LDAP server. Also, the *AuthenticationType* property may need
to be assigned a different value, depending on... can you guess? That's
right; the authentication method used by your LDAP server.
