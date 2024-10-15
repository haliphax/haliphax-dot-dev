---
title: "Lower-case specific query string keys with IIS URL Rewrite"
tags: ["post", "fix", "iis", "regex", "seo", "archived"]
layout: post
---

We're going through some normalization of URLs at my day job, which has
necessitated some interesting rewrite rules for lower-casing specific
query string keys. Essentially, we need to turn `site=CampusName` into
`site=campusname`. After quite a bit of tinkering with [IIS URL
Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite) rules, I
managed to pull it off.<!--more-->

First, create a new rewrite rule which matches the URL pattern `.*`.
This will ensure that we are able to re-use the entire URL (minus the
query string, of course) when we redirect later down the line.

Now, on to the **Conditions** settings. To begin with, make sure that
**Track capture groups across conditions** is enabled, and that the
conditions set is configured to **Match all**. You will need two
conditions: one to capture the target query string key, and one to
determine if that key contains any upper-case letters.

To determine if there are any upper-case letters in the query string
key:

`{QUERY_STRING}` _contains_ `\bsite=[^&]*[A-Z][^&]*`

To capture the target query string key (notice the 3 capture groups?):

`{QUERY_STRING}` _contains_ `(.*)\bsite=([^&]+)(.*)`

Finally, we will need to **Redirect** the user to the following URL with
**Include query string** *un*checked:

`{R:0}?{C:1}site={ToLower:{C:2}}{C:3}`

That last pattern injects any leading query string parameters, then a
lower-cased version of the _site_ parameter, and finally, the remainder
of the query string. This ensures that the query string key does not
change position due to this rewrite rule—a must-have for our specific
project.

To make use of this rewrite pattern for a different query string key,
simply use something other than "site" in the rules and conditions.
