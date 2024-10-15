---
title: "jQuery.noFlickerSlide Plugin v1.0.0 released"
tags:
  [
    "post",
    "fix",
    "internet-explorer",
    "javascript",
    "jquery",
    "my-software",
    "plugin",
    "archived",
  ]
layout: post
---

Since 1.1.3, [jQuery's](https://jquery.com)
[slideUp()](https://api.jquery.com/slideUp/) method has had problems with
flickering in Internet Explorer. While this issue can generally be fixed
by avoiding Quirks Mode with a `DOCTYPE` declaration, it doesn't always
work so easily. (The HTML 5 declaration worked for me, but was
unfortunately not an option in the project at hand—which was filled with
XHTML 1.0 Transitional pages.) To correct the problem with a JavaScript
solution, you can overload the `$.fn.slideUp` prototype for all Internet
Explorer versions and have it animate the element to a minimum height of
1px. The bug with IE seems to stem from it being unable to elegantly
handle 0px-tall elements.

I've built a jQuery plugin, **jQuery.noFlickerSlide**, which does just
that.<!--more-->

**Javascript code:**

```js
/*
jQuery.noFlickerSlide v1.0.0 by haliphax - 2011/5/13

This jQuery plugin is used to eliminate the flicker caused by
$.fn.slideUp and $.fn.slideDown in Internet Explorer.
*/
(function ($) {
  // replace the .slideUp() function
  $.fn.slideUp = function (a, b, c) {
    // check for optional arguments to pass to .animate()
    var dur, cb, ease;

    if (typeof c == "undefined") {
      dur = a;
      cb = b;
    } else {
      dur = a;
      ease = b;
      cb = c;
    }

    // add the animation sequence to the animation queue rather than fire immediately
    var opts = { queue: true };

    if (typeof dur != "undefined") opts.duration = dur;
    if (typeof ease != "undefined") opts.easing = ease;
    if (typeof cb != "undefined") opts.complete = cb;

    $(this)
      .animate(
        {
          height: 1, // min height of 1px to avoid IE flicker
          paddingTop: "hide", // collapse padding
          paddingBottom: "hide",
        },
        { queue: true },
      )
      .animate({ display: "hide" }, opts); // hide after sliding

    return $(this);
  };

  // replace the .slideDown() function
  $.fn.slideDown = function (a, b, c) {
    // check for optional arguments to pass to .animate()
    var dur, cb, ease;

    if (typeof c == "undefined") {
      dur = a;
      cb = b;
    } else {
      dur = a;
      ease = b;
      cb = c;
    }

    // add the animation sequence to the animation queue rather than fire immediately
    var opts = { queue: true };

    if (typeof dur != "undefined") opts.duration = dur;
    if (typeof ease != "undefined") opts.easing = ease;
    if (typeof cb != "undefined") opts.complete = cb;
    // set initial height to 1px to avoid flicker and then stretch
    $(this)
      .height(1)
      .show()
      .animate({ height: $(this).data("h") }, opts);

    return $(this);
  };

  // fix flicker (one-time call)
  $.fn.noFlickerSlide = function () {
    // set global flag
    $(document).data("noflickerslide", true);

    // grab height of each element and append a padding <div> to retain padding-bottom
    return $(this).each(function () {
      $(this)
        .append($("<div>").css("height", $(this).css("padding-bottom")))
        .data("h", $(this).height());
    });
  };

  // back-up default .hide() function
  $.fn.noFlickerSlide_hide = $.fn.hide;

  // replace the .hide() function
  $.fn.hide = function (a, b, c) {
    // check for global flag to see if we already grabbed element heights
    if ($(document).data("noflickerslide"))
      return $(this).noFlickerSlide_hide(a, b, c);
    else return $(this).noFlickerSlide().noFlickerSlide_hide(a, b, c);
  };
})(jQuery);
```

Wrap that sucker in a conditional comment, and you're in business! I've
tried my best to mimic the native functionality of `$.fn.slideUp`,
`$.fn.slideDown`, and `$.fn.hide`, so there shouldn't be any
configuration necessary on your part aside from including the JavaScript
file.

**Example usage:**

```html
<!--[if IE]><script src="jquery.noflickerslide.min.js"></script><![endif]-->
```

One caveat: I'm inserting a `<div>` element with its `height` CSS
attribute set to mirror the `padding-bottom` value of the item being
hidden. For some reason, padding is not considered when `.slideDown()`
is fired. Maybe I'm just missing something, though—feel free to comment
with any corrections or suggestions you may have. This is, after all,
the initial release; there are bound to be some improvements that can be
made.
