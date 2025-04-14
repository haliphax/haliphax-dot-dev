---
title: Improved "tail" bookmarklet
tags: ["post", "javascript", "bookmarklet", "tool"]
layout: post
---

A while back, I scratched my own itch for automated webpage scrolling (e.g. for
AWS logs) by creating a bookmarklet that would slam the scrollbar to the bottom
of the document every second. It was a ham-fisted approach, but it worked.

I have recently come to find, however, that this does _not_ work on many
so-called "modern" web applications where the UI has been sliced into multiple
divisions, each with their own view boundaries and scrolling-related
properties. To work around this, I have revamped the old bookmarklet so that you
give it a hint by scrolling the element you want to target. So far, it's doing
exactly what I need.

Noteworthy elements include the use of the `addEventListener` options `capture`
and `once`, which are responsible for capturing the `scroll` event (which does
not bubble) and firing the hook to call `setInterval` for the scrolling work
only once without the need for any `removeEventListener` shenanigans.

Grab the bookmarklet for yourself by dragging the link below onto your
bookmarks bar:

<a href="javascript:(()=>{if(window.hx_tail){clearInterval(window.hx_tail);delete window.hx_tail;alert('Disabled')}else{alert('Scroll target element');document.addEventListener('scroll',(e)=>{window.hx_tail=setInterval(()=>{e.target.scrollTop=e.target.scrollHeight},1000)},{capture:true,once:true})}})();">Tail</a>

Here is the source code, altered for formatting and clarity:

```javascript
(() => {
  if (window.hx_tail) {
    clearInterval(window.hx_tail);
    delete window.hx_tail;
    alert("Disabled");
  } else {
    alert("Scroll target element");
    document.addEventListener(
      "scroll",
      (e) => {
        window.hx_tail = setInterval(() => {
          e.target.scrollTop = e.target.scrollHeight;
        }, 1000);
      },
      {
        capture: true,
        once: true,
      },
    );
  }
})();
```
