---
title: Ko-fi icon for FontAwesome
tags: ["post", "css"]
layout: post
---

[FontAwesome] is a pretty great resource. I use it extensively on this site.
In addition to loads of useful UI icons, it also has a _brands_ icon set, which
you can see examples of in the "Socials" section of my site menu. What you may
not immediately be aware of, though, is that I had to cobble the [Ko-fi] icon
together using CSS chicanery.

I guess there's a [pretty extensive process] for getting icons added to the
FontAwesome library, and Ko-fi hasn't yet made the cut. In the meantime, I was
able to combine the `coffee` and `heart` icons to act as a stand-in:

```html
<i class="fas fa-ko-fi"></i>
```

```css
/* ko-fi icon */
.fa-ko-fi::before {
  content: "\f0f4";
  display: inline-block;
  font-size: 1.1em;
  line-height: 0.45em;
  margin: -0.45em 0 0 -0.2em;
  overflow-y: hidden;
  padding-top: 0.45em;
}
.fa-ko-fi::after {
  color: #000;
  content: "\f004";
  font-size: 50%;
  font-weight: 900;
  margin: 0.5em 0 0 -2em;
  position: absolute;
}
```

The `::before` and `::after` pseudo elements use the `content` property to
display the `coffee` and `heart` icons, respectively. A combination of
`font-size`, `line-height`, `overflow-y`, `padding-top`, and `margin` are used
to truncate the "saucer" component of the `coffee` icon and resize the
result. This step is necessary since the free icon set does not include the
`mug` icon, which has no saucer. Finally, `font-size`, `color`, `position`, and
`margin` are used to shrink the `heart` icon and move it into place over the
mug.

Since _em_ units are being used for the icon sizes and offsets, you should be
able to adjust the font size of the containing element without upsetting the
icons' overlapping positions.

Some caveats:

- The `fas` class is for _solid_ icons. The `::before` and `::after` pseudo
  elements' `content` property value will be displayed using whichever font set
  you chose (e.g. `fa`, `far`, etc.).
- The `::after` element's color is set to black in this example, which may not
  work with the color scheme for your site.

# Update

I have since retired the use of FontAwesome icons on the site. I am now using
[Feather Icons], instead.

[Feather Icons]: https://feathericons.com
[FontAwesome]: https://fontawesome.com
[pretty extensive process]: https://fontawesome.com/support#requesting-icons
[Ko-fi]: https://ko-fi.com
