---
title: "Javascript document.write alternative"
tags: ["post", "javascript", "method"]
layout: post
---

When a script is loaded _synchronously_, its element's position in the
DOM can be determined. With this information, the `<script>` element can
act as a pivot point for inserting dynamic content. This eliminates the
need for `document.write`, a function which wreaks havoc where AJAX is
involved (and flies in the face of modern web development best
practices).<!--more-->

````html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>document.write alternative</title>
	</head>
	<body>
		<p>Here is some content.</p>
		<!-- load a script; any script -->
		<script
			type="text/javascript"
			src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"
		></script>
		<!-- here is our document.write analog; could just as easily be a remote file -->
		<script type="text/javascript">
			// get the "last" script on the page
			var s = document.getElementsByTagName("script");
			s = s[s.length - 1];
			var p = document.createElement("p");
			p.innerHTML = "Here is some dynamic content.";
			s.parentNode.insertBefore(p, s);
		</script>
		<!-- load another script; any other script -->
		<script
			type="text/javascript"
			src="//ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js"
		></script>
		<p>Here is some more content.</p>
	</body>
</html>
```html [View the demo on jsfiddle.net](https://jsfiddle.net/haliphax/2y4cx/)
````
