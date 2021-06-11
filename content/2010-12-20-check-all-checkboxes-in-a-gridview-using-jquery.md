---
title: "Check all CheckBoxes in a GridView using jQuery"
tags: ['post', 'aspx', 'c-sharp', 'dot net', 'javascript', 'jquery', 'my-software']
layout: post
---

If you're working with a `GridView` control where you've built a
`CheckBox` control into each row of data displayed, odds are, it would
be convenient for your users if a "Check/Un-check All" option was
available. The following example will show how to do just that; and with
only the tiniest bit of jQuery script!<!--more-->

First, we'll build a `GridView` control similar to this, with an
`<input />` check box in the `HeaderTemplate` corresponding to each
row's `CheckBox` control:

**ASP.NET Code:**

    #!xml
    <asp:GridView ID="myGridView" runat="server">
        <Columns>
            <asp:TemplateField>
                <HeaderTemplate>
                    <input type="checkbox" id="chkAll" />
                </HeaderTemplate>
                <ItemTemplate>
                    <asp:CheckBox ID="myCheckBox" runat="server" />
                </ItemTemplate>
            </asp:TemplateField>
            <!-- other fields here ... -->
        </Columns>
    </asp:GridView>

Obviously, the `chkAll` item needs some client-side script before it's
going to do anything meaningful. You could either place the following
jQuery code into the `onchange` event for `chkAll`, or we can wire up an
event handler in a `&gt;script />` block:

**Javascript (jQuery) code:**

    #!js
    $('#chkAll').change(function() {
        $('#<%=myGridView.ClientID%> input[type=checkbox]')
            .attr('checked', $(this).attr('checked'));
    });

It's as simple as that! Checking or un-checking `chkAll` will cause each
`CheckBox` control within the `GridView` to inherit its value. If you've
separated your *\*.js* files from your *\*.aspx* files, you can attach a
CSS class to your `GridView` and select based on that (rather than using
the `GridView`'s `ClientID` property).
