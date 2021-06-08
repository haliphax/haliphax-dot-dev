---
title: "Browser-independent XPath with Javascript"
tags: ['post', 'javascript', 'xml', 'xpath']
layout: post
---

Now that you're able to [load
XML](http://roadha.us/2008/09/browser-independent-xml-load-with-javascript/)
and [transform
it](http://roadha.us/2008/09/browser-independent-xslt-with-javascript/)
using an XSL stylesheet, wouldn't it be handy to also be able to perform
XPath selects/functions on that XML outside of the stylesheet's
formatting? Why, yes. Yes, it would:<!--more-->

**Javascript code:**

    #!js
    function xpSelect(xmlDoc, xpathStr)  
    {  
        try {  
            if(xmlDoc.evaluate) {  
                // WebKit (Safari, Chrome), Mozilla/Firefox, Opera, etc.  
                var xpr = xmlDoc.evaluate(xpathStr, xmlDoc, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);  
                var cur = xpr.iterateNext();  
                var a = 0;  
                var retarr = [];

                // build array from returned nodes  
                while(cur) {  
                    retarr[a++] = cur;  
                    cur = xpr.iterateNext();  
                }

                return(retarr);  
            } else {  
                // Internet Explorer  
                return(xmlDoc.selectNodes(xpathStr));  
            }  
        } catch(e) {  
            alert("Error:\n" + e.message);  
            return false;  
        }  
    }

It's worth noting that IE's *selectNodes()* method is drastically slower
than the standard *evaluate()* method, but this function's results will
be the same: an array of *element* objects. The function is rather base
in its implementation, but could be modified to return custom data sets
(or a DOM tree/node) instead of an array. Either way,
*//state[@name='Alabama']/areacode* is just a function call away!
