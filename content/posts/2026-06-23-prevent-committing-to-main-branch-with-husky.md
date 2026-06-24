---
title: Prevent committing to main branch with husky
tags: ["post", "javascript", "git"]
layout: post
---

I've recently moved from using [pre-commit][] for my git hooks to [husky][],
and as part of this transition, I've migrated some of my
quality-of-life hooks over to the new system. First and foremost:
prevent committing to the main/master branch. It's very simple, but
it can save a lot of headaches.

You're able to prevent just this hook from running by setting the
`ALLOW_MAIN` environment variable for those situations where you're
feeling particularly angry with the world.

Here's the script, short and simple:

```javascript
// .husky/scripts/no-commit-to-main.mjs

import child_process from "node:child_process";

if (process.env.ALLOW_MAIN) process.exit(0);

const branch = child_process
  .execSync("git branch --show-current")
  .toString()
  .trim();

if (branch === "main") {
  process.stderr.write("❌ Do not commit to main branch\n");
  process.exit(1);
}
```

[pre-commit]: https://pre-commit.com
[husky]: https://typicode.github.io/husky
