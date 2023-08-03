---
title: "Vue.js long-press directive"
tags: ["post", "javascript", "vue"]
layout: post
---

I was looking for an easy way to incorporate the "long press" event so popular
in mobile UI into a web project of mine. In my searching, I came a cross a
[Vue] directive that claimed to do the trick. Well, it certainly did, but I had
a few reservations:

1. It was TypeScript. I only want to be using pure JavaScript in this
   particular project; no transpilation.
2. It provided a bit more than I cared about. I only wanted to handle the long
   press itself. I didn't care about when it started.
3. There was no default timeout value for the long press detection, and so one
   would need to be specified anywhere that it was used.
4. It did not prevent the `click` event from also triggering on the element, so
   binding an element to both handlers was not feasible.

I took the directive and shifted it around a bit to meet my own needs. It is
now plain JavaScript, deals with a single event type, uses a default timeout
value if none is provided, and swallows the `click` event when the long press
is successful. You still have to attach the directive to the element that you
want handling a long press event, and so it's a bit verbose in that sense, but
you could pretty easily just move the behavior to a global scope rather than
a Vue directive (or some combination of the two).

```javascript
const LONG_PRESS_DEFAULT_DELAY = 750,
  longPressEvent = new CustomEvent("long-press");

Vue.directive("long-press", {
  bind(el, binding, vnode) {
    el.dataset.longPressTimeout = null;

    const onPointerUp = (e) => {
        clearTimeout(parseInt(el.dataset.longPressTimeout));
        document.removeEventListener("pointerup", onPointerUp);
      },
      onPointerDown = (e) => {
        document.addEventListener("pointerup", onPointerUp);
        el.addEventListener("click", swallowClick);

        const timeout = setTimeout(() => {
          if (vnode.componentInstance)
            vnode.componentInstance.$emit("long-press");
          else el.dispatchEvent(longPressEvent);

          el.dataset.elapsed = true;
        }, binding.value || LONG_PRESS_DEFAULT_DELAY);

        el.dataset.elapsed = false;
        el.dataset.longPressTimeout = timeout;
      },
      swallowClick = (e) => {
        el.removeEventListener("click", swallowClick);

        if (el.dataset.elapsed !== "true") return true;

        e.preventDefault();
        e.stopPropagation();

        return false;
      };

    el.$longPressHandler = onPointerDown;
    el.addEventListener("pointerdown", onPointerDown);
  },
  unbind(el) {
    clearTimeout(parseInt(el.dataset.longPressTimeout));
    el.removeEventListener("pointerdown", el.$longPressHandler);
  },
});
```

```html
<button
  v-long-press="1000"
  @long-press="someEventHandler()"
  @click="someOtherHandler()"
>
  Click or long press (1 second)
</button>
<button v-long-press @long-press="someEventHandler()">
  Long press only (default 0.75 seconds)
</button>
<button @long-press="someEventHandler()">
  This won't trigger without v-long-press attribute
</button>
```

The original source comes from [FeliciousX] on GitHub.

[Vue]: https://vuejs.org
[FeliciousX]: https://github.com/FeliciousX/vue-directive-long-press/
