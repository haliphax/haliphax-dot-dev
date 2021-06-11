---
title: "UserScript: Tidy up TVGuide.com listings"
tags: ['post', 'javascript', 'my-software', 'userscript']
layout: post
---

The way that [TVGuide.com's listings](http://www.tvguide.com/listings/)
are organized is difficult to work with. This UserScript (compatible
with [GreaseMonkey](http://www.greasespot.net/), Chrome, Opera, and
perhaps more) will gut the listings from the layout and give you one
all-encompassing, manageable scroll bar for perusal.<!--more-->

    #!js
    // ==UserScript==
    // @match http://www.tvguide.com/listings/
    // @name TV Guide Tidy
    // @description Cleans up the TV Guide listings page
    // @version 1.0
    // ==/UserScript==

    window.onload = function(){
        var l = document.querySelector(".listings-w");
        var b = document.querySelector("body");
        l.parentNode.removeChild(l);
        b.innerHTML = "";
        b.appendChild(l);
        l.setAttribute("style", "position:absolute;top:0;left:0;width:100%;height:100%");
        document.querySelector(".gridDiv").setAttribute("style", "height:auto;overflow-x:hidden;border-bottom:solid 1px #DCDDCB");
    };

The script is [available for
download](https://greasyfork.org/scripts/4654-tv-guide-tidy) at
[greasyfork.org](http://greasyfork.org/).

*Note: To install this UserScript in Chrome, you will have to download
the file, open `chrome://extensions` (Settings icon → Tools →
Extensions) and drag the extension onto the page to avoid the web store
requirement.*
