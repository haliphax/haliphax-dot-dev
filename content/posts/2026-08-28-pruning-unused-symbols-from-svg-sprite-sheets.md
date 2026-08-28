---
title: Prune unused symbols from SVG sprite sheets
tags: ["post", "typescript", "perf", "svg"]
layout: post
---

I replaced FontAwesome with [Feather Icons][] for the icons used in this site's
design. While doing so, I was dissatisfied with the idea that I was taking
advantage of only a handful of the symbols defined in the file, but the
entire file was being delivered to visitors. I slapped together a fairly simple
bit of TypeScript code for trimming the unused icons from the file before
publishing the site. I've boiled it down to the base concepts, which we will
walk through in this post.

# Overview

Here is a high-level overview of the steps the code will need to perform:

1. Get a list of all HTML files in the rendered site
2. Loop through the list of HTML files
3. Search each HTML file's content for icon SVG elements
4. Keep a list of each icon that appears in the site
5. Get a list of each symbol in the SVG sprite file
6. Loop through the list of symbols
7. Remove any symbols which do not appear in the list of used icons (step 4)
8. Write a new SVG sprite file with pruned contents

Note: Imports will be introduced in the first snippet they apply to. You will,
of course, want them all at the top of the file in the end.

# Get flat list of HTML files

To know which icons are actually being used in the site, we first need to
build a list of the rendered HTML files that comprise the site's content. To
do this, we will use a crawler function to recursively walk through the site
structure when provided with the parent path. I'm using `promisify` in order
to do this using `async` functions. The function is also responsible for
`filter`ing the resulting list down to only `*.html` files. This is made
easier by first flattening the nested array structure with a `reduce`.

```typescript
import fs from "fs";
import path from "path";
import { promisify } from "util";

const fileOpts: { encoding: BufferEncoding } = { encoding: "utf-8" };
const readdir = promisify(fs.readdir);

const getHtmlFiles = async (dir: string): Promise<string[]> =>
  await Promise.all(
    (await readdir(dir, fileOpts)).map(async (entry: string) => {
      const resolved = path.resolve(dir, entry);

      if ((await stat(resolved)).isDirectory()) {
        return await getHtmlFiles(resolved);
      }

      return resolved;
    }),
  )
    .reduce<string[]>((p: string[], c: string | string[]) => p.concat(c), [])
    .filter((f: string) => f.endsWith(".html"));
```

# Find icons used in each HTML file

Now that we've got a flat list of the HTML files for our site, we can
investigate the content of those files to find out if any Feather Icons are
being used, and if so, which ones. This list of used icons will later be
used as a "keep list" for our pruning function. A regular expression is used
to detect the presence of the icons, since we guarantee the format for the
use of icons in the site and have something predictable to match against.

```typescript
const readFile = promisify(fs.readFile);
const files = await getHtmlFiles("output");
const iconRegex = /<use href="\/img\/feather-sprite\.svg\?_=[^#]+#([^"]+)"/gi;
const iconsUsed = new Map<string, boolean>();

for (let f of files) {
  const content = await readFile(f, fileOpts);
  let match: RegExpExecArray | null;

  do {
    match = iconRegex.exec(content);
    if (match !== null) iconsUsed.set(match[1], true);
  } while (match);
}
```

# Remove unused icons from the sprite sheet

We now have a "keep list" of icons actually used in the site's content, so we
have everything that we need to prune the unused icons out of the SVG
sprite sheet file. The approach here involves the [`svgson`][] library, which
provides convenient methods for parsing and exporting SVG files. Like earlier
with `readdir`, we are using `promisify` to make `async` versions of file
system functions. Effectively, we are just overwriting the `children` of the
root element in the XML tree of the SVG document with our pruned set.

```typescript
import { parse, stringify } from "svgson";

const svg = await parse(
  await readFile("output/img/feather-sprite.svg", fileOpts),
);
const defs = svg.children[0];
const newDefs = [];

// loop through icons, removing unused
for (let i = 0; i < defs.children.length; i++) {
  const icon = defs.children[i];
  if (iconsUsed.has(icon.attributes["id"])) newDefs.push(icon);
}

defs.children = newDefs;

await writeFile("output/img/feather-sprite.svg", stringify(svg), fileOpts);
```

# Further optimization

That's it! You now have a pruned SVG sprite sheet composed of only the icons
that are _actually used_ in your site. To take this one step further, I
recommend generating a unique hash somehow (we'll get to that in a second)
which corresponds to the content or release version for the sprite sheet or
the entire site, then use this value as a query string parameter when loading
the sprite sheet in your pages. This will act as a "cache busting" mechanism to
ensure that visitors are not loading an inaccurate version of the sprite sheet
with missing (or extra) icons when the site is deployed.

Personally, I just phone this one in by using the git hash of the entire repo
for my site at build time. Here's a quick and dirty function for doing just
that:

```typescript
import cp from "child_process";
import { promisify } from "util";

const exec = promisify(cp.exec);
let hashref: string | null = null;

/** get hash ref of the most recent commit in the repository */
const getHashRef = async () => {
  if (!hashref)
    hashref = (await exec("git rev-parse --short HEAD")).stdout.trim();
  return hashref;
};
```

If you want to see my actual implementation of all this stuff, here are a
couple of links for you (pinned to their current versions as of this post):

- [iconPurge event handler][]
- [getHashRef cache buster][]

Good luck, and happy pruning!

[`svgson`]: https://www.npmjs.com/package/svgson
[feather icons]: https://feathericons.com
[gethashref cache buster]: https://github.com/haliphax/haliphax-dot-dev/blob/039d653cd12f0d3615412010b8c967fc5f18bff2/11ty/functions/renderIcon.ts
[iconpurge event handler]: https://github.com/haliphax/haliphax-dot-dev/blob/c7900cb6a6c73d93434abdc67feb97836b11fa0f/11ty/events/iconPurge.ts
