---
title: "Minifying Javascript using ESBuild with Flask-Assets"
tags: ["post", "flask", "javascript", "python", "tool"]
layout: post
---

I've been using [Flask] and its [Flask-Assets] package (which is a wrapper
around the [webassets] package) for quite some time now without issue, but
recently, I've been scratching an itch for ES2016 and beyond. One of my
favorite features of ES2016+ is that modules (and importing them) are part of
the native browser implementation! No more AMD, CommonJS, RequireJS, and the
like. Much to my chagrin, however, the Flask-Assets default Javascript
minifier, `jsmin`, doesn't seem to have great support for bundling modules. It
does fine with minifying them, but bundling is outside of its wheelhouse.
Enter: [ESBuild].

I won't get into the particulars of ESBuild except to say that it does a good
job of not only minifying Javascript, but also tree-shaking and managing a
script's dependencies. It seemed like a great option for replacing `jsmin`,
so I set about doing so. First things first, I needed to figure out how
minifiers are even hooked up as far as the `webassets` package is concerned. I
quickly discovered that a custom class with two methods and a single member
can be slapped together in short order to produce a new minifier. Here, I have
done just that with `esbuild`:

```python
from os import dirname
from subprocess import PIPE, Popen, STDOUT
from webassets.filter import Filter, register_filter


class ESBuildFilter(Filter):

    "Minify and bundle Javascript using esbuild."

    name = 'esbuild'

    def input(self, _in, out, **kwargs):
        cwd = dirname(kwargs['source_path'])
        p = Popen(['esbuild', '--bundle', '--minify', '--format=esm'],
                  cwd=cwd, stdin=PIPE, stdout=PIPE, stderr=STDOUT)
        outputs, errors = p.communicate(_in.read().encode('utf-8'))
        out.write(outputs.decode('utf-8'))

    def output(self, _in, out, **kwargs):
        out.write(_in.read())

register_filter(ESBuildFilter)
```

It pulls the current working directory out of the `source_path` argument, which
is the filename of the file being processed by the minifier. It then executes
the `esbuild` command with select parameters, acting against `stdin` and
sending its data to `stdout` for capture. To use it, simply swap out any
filter reference to `jsmin` with `esbuild`, like so:

```html
{% assets filters='esbuild', output='js/file.min.js', 'js/file.js' %}
<script src="{{ ASSET_URL }}" type="module"></script>
{% endassets %}
```

Note the `type="module"`, as this is necessary for testing and developing the
scripts while they are un-minified. Otherwise, the use of the `import` keyword
in the scripts will throw an error. Happy minifying!

[Flask]: https://flask.palletsprojects.com/en/3.0.x/
[Flask-Assets]: https://flask-assets.readthedocs.io/en/latest/
[webassets]: https://webassets.readthedocs.io/en/latest/
[ESBuild]: https://github.com/evanw/esbuild
