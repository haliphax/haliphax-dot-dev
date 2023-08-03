---
title: "jQuery.imgradio Plugin v1.0 released"
tags: ["post", "css", "forms", "javascript", "jquery", "my-software", "plugin"]
layout: post
---

The default HTML radio buttons and check boxes aren't the most
aesthetically pleasing things in the world of web design. With this in
mind, I have created a [jQuery](https://jquery.com)
[plugin](https://plugins.jquery.com) that will replace those pesky
`<input />` elements with `<span />` elements for your CSS styling
pleasure. Under the hood, the original elements are still being used for
storing the user's selection(s), so there's nothing extra for you to do
when the form is submitted. Additionally, it can be configured to
operate as a "rating" system—so that, for example, checking the 4th star
in a 5-star list would swap the first 4 stars in the list to the
"checked" state (visually speaking, at least... in the underlying radio
buttons, only the 4th star would be selected).<!--more-->

You can pick up the [original
source](https://github.com/haliphax/jquery.imgradio/raw/master/jquery.imgradio.js)
or the [minified
version](https://github.com/haliphax/jquery.imgradio/raw/master/jquery.imgradio.min.js)
for use on your site.

I have also created a [demonstration page](https://haliphax.github.io/jquery.imgradio/)
so you can see the plugin in action.

In the interest of transparency, here is the original source:

**Javascript:**

```js
/*
jQuery.imgradio v1.0.3 by haliphax - 2011/6/16
This jQuery plugin replaces standard radio buttons and check boxes with image
counterparts. It can also be used to turn radio button lists into an image-based
"rating" system.
*/
(function ($) {
	// extend jQuery object
	$.fn.imgradio = function (ratings) {
		// affect all objects in the selector array
		this.each(function () {
			// get IDs
			var radioid = $(this).attr("id");
			var imgid = radioid + "_img";
			// hide the original inputs
			$(this).css("display", "none");
			// hide the label (if any)
			$('label[for="' + radioid + '"]').css("display", "none");
			// inject the <span /> for our image replacement
			var html =
				'<span class="radio_img' +
				($(this).is(":checked") ? " checked" : "") +
				'" id="' +
				imgid +
				'" data-imgradiogroup="' +
				$(this).attr("name") +
				'"></span>';
			$(html).insertAfter($("#" + radioid));
			$("#" + imgid)
				// remember underlying element
				.data("imgradio_el", radioid)
				// handle clicks (check/uncheck)
				.click(function () {
					var el = $("#" + $(this).data("imgradio_el"));

					// unchecking
					if ($(el).is(":checked")) {
						$(el).removeAttr("checked");
						var form = $(el).parents("form:first");
						if (!form) form = $(document);

						// ratings system
						if (typeof ratings != "undefined") {
							// uncheck all others in our group in the form
							form
								.find(
									'[data-imgradiogroup="' +
										$(this).attr("data-imgradiogroup") +
										'"]',
								)
								.removeClass("checked");
						} else $(this).removeClass("checked");
					}
					// checking
					else {
						// checkbox lists don"t uncheck each other, only radios
						if ($(el).attr("type") != "checkbox") {
							var that = this;
							var form = $(el).parents("form:first");
							if (!form) form = $(document);
							// first uncheck all others in the list
							form
								.find('[name="' + $(el).attr("name") + '"]')
								.removeAttr("checked");
							var radiogroup = form.find(
								'[data-imgradiogroup="' +
									$(this).attr("data-imgradiogroup") +
									'"]',
							);
							radiogroup.removeClass("checked");

							// ratings system
							if (typeof ratings != "undefined") {
								var stop = false;

								// check previous elements
								radiogroup.each(function () {
									if (this === that || stop) {
										stop = true;
										return;
									}

									$(this).addClass("checked");
								});
							}
						}

						// check this element
						$(el).attr("checked", "checked");
						$(this).addClass("checked");
					}
				});
		});
	};
})(jQuery);
```
