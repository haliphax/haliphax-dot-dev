---
title: "Browser-independent XSLT with Javascript"
tags: ['post', 'javascript', 'xml', 'xsl']
layout: post
---

To piggy-back on the [Javascript function to load an XML
document](/2008/09/browser-independent-xml-load-with-javascript/):
what can be done to load an XSL stylesheet and apply it to the XML? For
the most part, loading it is a snap... but, as is often the case,
Internet Explorer is the exception to the rule. So, we write a function
that tells every browser except for IE to use our previously-defined
loadXML() function, and an exception for Internet Explorer to load the
XSL as a "free-threaded document."<!--more--> *Note: The reason for this
is that IE's Javascript engine will throw a hissy-fit if you try to
transform an XML tree using an XMLDOM object as your XSL.*

**Javascript code:**

```js
function loadXSL(dname)
{
	if(window.ActiveXObject) {
		// Internet Explorer
		try {
			var xslDoc = new
			ActiveXObject("Msxml2.FreeThreadedDOMDocument");
			xslDoc.async = false;
			xslDoc.resolveExternals = false;
			xslDoc.load(dname);
			return(xslDoc);
		} catch(e) {
			alert("Cannot load XSL stylesheet\\n\\nError:\\n" + e.message);
			return(false);
		}
	} else {
		// Everything else
		return(loadXML(dname));
	}
}
```

Next, we will need a function for applying the XSL stylesheet to the XML
tree. The following function does just that--browser-agnostic, of
course--and sends the resulting formatted XML to a given container
(i.e., a `<div />` element):

**Javascript code:**

```js
function xslTransform(xml, xsl, div, par)
{
	if(typeof par == "undefined") par = null;
	div.innerHTML = "";

	if(window.ActiveXObject) {
		// Internet Explorer
		var xslt = new ActiveXObject("Msxml2.XSLTemplate");
		xslt.stylesheet = xsl;
		var xsltProc = xslt.createProcessor();
		xsltProc.input = xml;
		for(var a = 0; a < par.length; a++)
			xsltProc.addParameter(par[a].pname, par[a].pval);
		xsltProc.transform();
		div.innerHTML = xsltProc.output;
	}
	else if(document.implementation
		&& document.implementation.createDocument)
	{
		// Mozilla/Firefox, Opera, WebKit (Safari, Chrome), etc.
		var xsltProc = new XSLTProcessor();
		xsltProc.importStylesheet(xsl);
		for(var a = 0; a < par.length; a++)
			xsltProc.setParameter(null, par[a].pname, par[a].pval);
		div.appendChild(xsltProc.transformToFragment(xml, document));
	}
}
```

XSL parameters are a handy way for Javascript to influence the XSL
stylesheet's behavior during transformation. The *par* parameter is used
for just that. It is an array of objects/associative arrays that have
two members: *pname* and *pval*. This could easily be reconfigured to
use a two-dimensional, integer-indexed array (or whatever data structure
you may prefer). If no *par* is supplied, it will default to *null* and
the for-loop will not execute. *Remember, an XSL stylesheet must be
loaded in Internet Explorer as a "free-threaded document" (see above),
or the transformation will fail!*
