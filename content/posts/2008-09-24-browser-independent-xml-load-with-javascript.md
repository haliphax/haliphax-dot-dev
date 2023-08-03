---
title: "Browser-independent XML load with Javascript"
tags: ["post", "javascript", "xml"]
layout: post
---

XML data is, in a word, awesome. It's standardized, it's well-formatted,
and there are XML parsing methods in nearly every major programming
language--including Javascript. However, when using Javascript, the
nasty problem of "browser agnosticism" comes into play: a method that
works in Firefox may not (read: won't) work in Internet Explorer; and
both methods may fail for WebKit (Safari, Chrome, etc.).<!--more-->

The next several articles detail browser-agnostic functions for loading
and manipulating XML/XSL data. For this article, we start with loading
the XML document:

**Javascript code:**

```js
function loadXML(dname) {
	var xmlDoc;

	// IE ActiveX
	try {
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	} catch (e) {
		// Mozilla/Firefox, Opera (Also WebKit fallthrough)
		try {
			xmlDoc = document.implementation.createDocument("", "", null);
		} catch (e) {
			// Error
			alert("Cannot instantiate XMLDOM object\\n\\nError:\\n" + e.message);
			return false;
		}
	}

	try {
		xmlDoc.async = false;
		xmlDoc.load(dname);
		return xmlDoc;
	} catch (e) {
		// WebKit (Safari, Chrome) - AJAX fallback
		try {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", dname, false);
			xhr.send(null);
			xmlDoc = xhr.responseXML;
			if (!xmlDoc) return false;
			return xmlDoc;
		} catch (e) {
			alert("Cannot instantiate XMLDOM object\\n\\nError:\\n" + e.message);
			return false;
		}
	}
}
```

True, you could use an AJAX call instead of creating an XMLDOM object
(or using createDocument)... but the example serves a second purpose for
demonstrating XMLDOM instantiation. _Note: As far as I can tell,
instantiating an XML document object without XMLHttpRequest() is not
possible in WebKit browsers._
