---
title: "scrollFollow: An auto-scrolling extender for knockout.js"
tags: ['post', 'javascript', 'knockout.js', 'mvvm', 'my-software', 'plugin']
layout: post
---

With the following knockout.js extender, you can tie an observable array
to a scrollable HTML element. When the array is updated, the element
will keep scrolling to the bottom. It's smart enough to realize if the
user has scrolled up, as well, and will not interrupt them. I've found
this to be a useful mechanism for logs.<!--more-->

**Source**

    #!js
    ko.extenders.scrollFollow = function (target, selector) {
        target.subscribe(function (newval) {
            var el = document.querySelector(selector);

            // the scroll bar is all the way down, so we know they want to follow the text
            if (el.scrollTop == el.scrollHeight - el.clientHeight) {
                // have to push our code outside of this thread since the text hasn't updated yet
                setTimeout(function () { el.scrollTop = el.scrollHeight - el.clientHeight; }, 0);
            }
        });

        return target;
    };

**Example usage**

    #!js
    var viewModel = {
        someArray: ko.observableArray().extend({ scrollFollow: '#some_element' })
    };

    ko.applyBindings(viewModel);
