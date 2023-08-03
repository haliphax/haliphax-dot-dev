---
title: "Consuming newlines with the Javascript regex engine"
tags: ["post", "javascript", "regex"]
layout: post
---

In most server-side languages (with an available regex engine),
programmers are given a wonderful set of pattern modifiers. One such
modifier for PCRE (Perl-compatible regular expressions) is the "s"
modifier, known in PHP as the constant _PCRE_DOTALL_. This modifier
will cause the "dot" character--which will usually match any normal
character--to include newlines. This is especially useful if you are
dealing with text files and your pattern match may span multiple lines
of those files.<!--more-->

Javascript, woefully, does not have this modifier. In fact, Javascript's
regex engine has only two modifiers: "i" for case-insensitivity and "g"
for global matching (or "match all"). However, there are ways you can
tweak your pattern to mimic the "s" modifier's behavior...

1.  Use a matching group that includes the "dot" character **or** the
    newline character
2.  Use a negated character set if the text following the matching
    portion does not occur in that negated character set

The first method is the simplest. In fact, here's the entire premise:
Instead of just using the "dot" character (like so: */blah.*blah/_),
pack it into a capture group along with the newline character (like so:
_/blah(.|\n)blah/\*). Here is an example:

**Javascript code:**

```js
var pattern = /<p class="someClass"(.|\n)*<\/p>/g;
var body = document.getElementsByTagName("body")[0];
body.innerHTML = body.innerHTML.replace(pattern, "");
```

In the example above, all instances of paragraph tags within the page's
source that have the class _"someClass"_ will be removed. *Note: To
prevent the capture group from being included in the match's result
groups, prepend it with **?:** like so: \*\*/blah(?:.|\n)*blah/g\*\*\*

The second method is only slightly more complicated than the first.
Rather than using a capture group, a negated character set is utilized
(like so: _/blah[^<]blah/g_). This method is best when working
with **non-nested elements** of the HTML DOM, since it is banking on the
fact that the text following the negated character set won't match that
character set. For example, _/<p[^<]<\/p>/_ will do fine
to match an entire paragraph element... but only if that paragraph
element does not **contain** any HTML elements. If you know it won't,
this is a good solution. If you're not sure, go with the first method.

Here is an example of the negated character set method:

**Javascript code:**

```js
var pattern = /<p class="someClass"[^<]*<\/p>/g;
var body = document.getElementsByTagName("body")[0];
body.innerHTML = body.innerHTML.replace(pattern, "");
```

As you can see, it is nearly identical to the first example (except for
the absence of the matching group and the presence of the negated
character set). Again, keep in mind--nested elements will confuse this
regex pattern.

With this knowledge, it will hopefully be an easy transition
back-and-forth between true PCRE and the Javascript regex engine. Happy
matching!
