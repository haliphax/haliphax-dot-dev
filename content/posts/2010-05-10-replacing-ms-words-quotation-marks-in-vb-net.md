---
title: "Replacing MS Word's quotation marks in VB.NET"
tags: ['post', 'dot net', 'regex', 'vbnet']
layout: post
---

When dealing with text pasted from Microsoft Word, the presence of
"special" (read: non-ASCII) quotation marks and apostrophes can be quite
troublesome. Here's a simple way to convert them to "standard" (read:
ASCII) quotation marks and apostrophes...

**VB.NET Code:**

```vb
myString = Regex.Replace(myString, "\u201C|\u201D", """")
myString = Regex.Replace(myString, "\u2018|\u2019", "'")
```

Obviously, this doesn't handle *all* of Word's annoying special
characters; but it should get you off on the right foot.
