---
title: "Dynamic GridView rows in ASP.NET"
tags: ["post", "ajax", "aspx", "c-sharp", "dot net", "forms"]
layout: post
---

Here's a simple proof-of-concept for dynamically adding and removing
rows in an ASP.NET `GridView` control while maintaining the existing
data.<!--more--> The `ViewState` is used to maintain the information
between postbacks. The `rehydrate_table` function takes advantage of
this to rebuild the table anew whenever an event takes place.

**Default.aspx**

```xml
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf=8" />
	<title>Dynamic GridView</title>
</head>
<body>
	<form id="form1" runat="server">
		<div>
			<p>
			<asp:Button ID="btnAddRow" runat="server" OnClick="btnAddRow_Click" Text="Add Row" CausesValidation="false" />
			</p>
			<asp:GridView ID="gvTable" runat="server" AutoGenerateColumns="false" OnRowDeleting="gvTable_RowDeleting">
				<Columns>
					<asp:TemplateField HeaderText="Name">
						<ItemTemplate>
							<asp:TextBox ID="txtName" runat="server" Text='<%# Eval("name") %>' />
						</ItemTemplate>
					</asp:TemplateField>
					<asp:TemplateField HeaderText="Age">
						<ItemTemplate>
							<asp:TextBox ID="txtAge" runat="server" Text='<%# Eval("age") %>' />
						</ItemTemplate>
					</asp:TemplateField>
					<asp:CommandField ButtonType="Link" ShowDeleteButton="true" />
				</Columns>
			</asp:GridView>
		</div>
	</form>
</body>
</html>
```

**Default.aspx.cs**

```cs
using System;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		if (!IsPostBack)  {
			var tbl = new DataTable();
			tbl.Columns.Add("name");
			tbl.Columns.Add("age");
			tbl.Rows.Add(tbl.NewRow());
			ViewState["table"] = tbl;
			gvTable.DataSource = tbl;
			gvTable.DataBind();
		}
	}

	private void rehydrate_table()
	{
		if (ViewState["table"] == null) return;
		var dt = (DataTable)ViewState["table"];
		if (dt.Rows.Count == 0) return;

		for (int i = 0; i < dt.Rows.Count; i++)
		{
			var name = ((TextBox)gvTable.Rows[i].Cells[0].FindControl("txtName"));
			dt.Rows[i]["name"] = name.Text;
			var age = ((TextBox)gvTable.Rows[i].Cells[1].FindControl("txtAge"));
			dt.Rows[i]["age"] = age.Text;
		}
	}

	protected void btnAddRow_Click(object sender, EventArgs e)
	{
		rehydrate_table();
		var tbl = (DataTable)ViewState["table"];
		tbl.Rows.Add(tbl.NewRow());
		gvTable.DataSource = tbl;
		gvTable.DataBind();
		ViewState["table"] = tbl;
	}

	protected void gvTable_RowDeleting(object sender, GridViewDeleteEventArgs e)
	{
		rehydrate_table();
		var tbl = (DataTable)ViewState["table"];
		tbl.Rows.RemoveAt(e.RowIndex);
		gvTable.DataSource = tbl;
		gvTable.DataBind();
		ViewState["table"] = tbl;
	}
}
```
