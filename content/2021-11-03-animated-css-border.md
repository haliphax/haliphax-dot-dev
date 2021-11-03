---
title: Animated CSS "border"
tags: ['post', 'css', 'experiment']
layout: post
---

I had an idea for an animated "border" of sorts, and the urge to implement it
in pure CSS (as much as my feeble skills are capable) stuck with me all day. I
decided to take a crack at it on-stream last night. I managed to do a halfway
decent job, if I do say so myself, though it requires two wrapper elements in
order to perform its function. [Check out the CodePen] and see for yourself!

It basically divides the first wrapper element into a row with 3 segments. The
"bookend" segments represent the faux vertical borders of the object. The
second wrapper is divided into a column with 3 segments; its bookends
representing the faux horizontal borders of the object. A `linear-gradient()`
CSS function is used to generate a half-magenta, half-transparent background
image for each border, and animations are triggered on hover that kick off in
a delayed series. The overall effect is that the border "crawls" along the
outside of the object before being entirely visible.

It was fun to do, as I don't stretch my CSS muscles very often. Next time,
maybe I'll see if I can implement the same effect using the Grid layout model!

For the sake of posterity, here is the HTML and CSS source code:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>Tron border demo</title>
		<link rel="stylesheet" href="styles.css" />
	</head>
	<body>
		<div class="tron">
			<div>
				<div class="example">Hover over me!</div>
			</div>
		</div>
	</body>
</html>
```

```css
html {
	font-family: Arial, Helvetica, sans-serif;
}

body, body * {
	display: flex;
}

.example {
	border: 1px solid #aaa;
	padding: .25em;
}

/* ✨ special stuff */

/* main wrapper */
.tron {
	flex-direction: row;
}

/* universal styles */
.tron::before,
.tron::after,
.tron > div::before,
.tron > div::after {
	animation-fill-mode: forwards;
	animation-iteration-count: 1;
	animation-timing-function: linear;
	background-repeat: no-repeat;
	content: '';
}

/* vertical borders */
.tron::before,
.tron::after {
	animation-duration: .0625s;
	background-size: 100% 200%;
	width: 4px;
}

/* left border animation */
@keyframes tron-before {
	0% {
		background-position: 0 0;
	}
	100% {
		background-position: 0 100%;
	}
}

/* left border hover */
.tron:hover::before {
	animation-name: tron-before;
	background-image: linear-gradient(to top, #f0f 50%, transparent 50%, transparent 100%);
}

/* right border animation */
@keyframes tron-after {
	0% {
		background-position: 0 100%;
	}
	100% {
		background-position: 0 0;
	}
}

/* right border hover */
.tron:hover::after {
	animation-delay: .1875s;
	animation-name: tron-after;
	background-image: linear-gradient(to bottom, #f0f 50%, transparent 50%, transparent 100%);
	background-position: 0 100%;
}

/* internal wrapper */
.tron > div {
	flex-direction: column;
}

/* horizontal borders */
.tron > div::before,
.tron > div::after {
	animation-duration: .125s;
	background-size: 200% 100%;
	height: 4px;
}

/* top border animation */
@keyframes tron-inner-before {
	0% {
		background-position: 100% 0;
	}
	100% {
		background-position: 0 0;
	}
}

/* top border hover */
.tron:hover > div::before {
	animation-delay: .0625s;
	animation-name: tron-inner-before;
	background-image: linear-gradient(to right, #f0f 50%, transparent 50%, transparent 100%);
	background-position: 100% 0;
}

/* bottom border animation */
@keyframes tron-inner-after {
	0% {
		background-position: 0% 0;
	}
	100% {
		background-position: 100% 0;
	}
}

/* bottom border hover */
.tron:hover > div::after {
	animation-delay: .25s;
	animation-name: tron-inner-after;
	background-image: linear-gradient(to left, #f0f 50%, transparent 50%, transparent 100%);
}
```


[Check out the CodePen]: https://codepen.io/haliphax/pen/bGradKo
