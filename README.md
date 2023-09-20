# 🎈 haliphax.dev

The source code for https://haliphax.dev and its accompanying processes;
proudly built with [Eleventy][]!

## 🌳 Directory structure

The directory structure used by this site may be considered "nonstandard" when
compared to the Eleventy documentation and various starter site templates, but
I personally find it much easier to reason with.

- `.github` Definitions for GitHub actions
- `11ty` Eleventy code and data
  - `data` Global data
    - `external` Data from external sources
  - `events` Eleventy engine event handlers
  - `functions` Global functions (filters)
  - `layouts` Template layouts
  - `libraries` Libraries used by the engine
  - `plugins` Plugins used by the engine
  - `transforms` Transforms for content manipulation
- `content` Renderable site content
  - `pages` Content pages
  - `posts` Blog posts
- `static` Static files, copied verbatim
  - `css` Stylesheets
  - `img` Images
- `tasks` Node scripts for out-of-band tasks

## 🛠️ Configuration structure

In addition to a nonstandard directory structure, I have built my own
configuration structure in an effort to wrangle the many pieces'
responsibilities.

The various pieces Eleventy needs to consume during
its configuration phase are all divided into their own categorical folders
beneath the `11ty` directory. Each of these folders contains a `_config.ts`
file (with the exception of the `data` folder, which is automatically parsed by
Eleventy).

The `_config.ts` file is used to collate all of that category's members
together and to expose a single function to the main Eleventy configuration
function. In this way, the complexity of the category's setup is abstracted
from the main configuration and it makes for less clutter.

<details>
<summary>Modular configuration example</summary>

> **Example:** All of your layout templates are under `layouts`, and a single
> function in `layouts/_config.ts` is used by the main Eleventy configuration
> function to assign each of them an alias. They are loaded in the main
> [`.eleventy.ts`](eleventy.ts) entrypoint. Here is a (simplified) example:

```ts
export = (cfg: UserConfig) => {
  require("./11ty/layouts/_config")(cfg);
  // ...
};
```

> When you need to make modifications to your layout setup, you will be working
> strictly with the files contained in this directory. Similar mechanisms exist
> for each of the other categories, though their configuration functions'
> content may differ slightly.

</details>

## 🎉 Features

### 🖼️ Layouts

> 🔍 Source folder: [`11ty/layouts`](11ty/layouts/)

All layout templates are built using the [11ty.js][] (JavaScript) template
language.

| Key          | Parent       | Description                                                                  |
| ------------ | ------------ | ---------------------------------------------------------------------------- |
| `base`       | _none_       | The base layout, which includes the outer document shell and site navigation |
| `withHeader` | `base`       | Reads `data.header` for use in an `<h1>` element                             |
| `page`       | `withHeader` | Used for Markdown pages; includes reading time, edit link, etc.              |
| `post`       | `withHeader` | Like `page`, but includes posted timestamp                                   |

### 🔖 Special tags

Some tags may confer special behavior to the post they are attached to.

| Key        | Description                                                                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| `archived` | Removes the post from tag lists and displays a notice explaining to the viewer that the page has been archived |

### 🗒 Data

> 🔍 Source folder: [`11ty/data`](11ty/data/)

#### css

> 🔍 Source: [`11ty/data/css.ts`](11ty/data/css.ts)

CSS combine/minify configuration

| Field                 | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `externalStylesheets` | List of external stylesheet files to pull during build                  |
| `fontDestination`     | Destination folder (relative to output folder) for font resources       |
| `fontSources`         | List of folders that should be copied to `fontDestination` during build |
| `localStylesheets`    | List of CSS files from the local filesystem to incoroporate             |

#### ignoreTags

> 🔍 Source: [`11ty/data/ignoreTags.ts`](11ty/data/ignoreTags.ts)

List of post tags that should be ignored when building tag pages or displaying
a post's associated tags

#### links

> 🔍 Source: [`11ty/data/links.ts`](11ty/data/links.ts)

List of objects for use in the **Site** navigation menu. Their format is as
follows:

| Field  | Description                                 |
| ------ | ------------------------------------------- |
| `name` | Name to display in the menu                 |
| `url`  | URL for the generated link tag              |
| `icon` | CSS classes for the link's FontAwesome icon |

#### metaDefaults

> 🔍 Source: [`11ty/data/metaDefaults.ts`](11ty/data/metaDefaults.ts)

Default values for page metadata

| Field               | Description                             |
| ------------------- | --------------------------------------- |
| `author`            | Author of the post/page                 |
| `description`       | Meta description                        |
| `generator`         | Eleventy package name and version       |
| `openGraphImageUrl` | URL to use for `og:image` OpenGraph tag |
| `openGraphType`     | Type of page for `og:type` tag          |

#### misc

> 🔍 Source: [`11ty/data/misc.ts`](11ty/data/misc.ts)

Miscellaneous values that don't belong elsewhere

| Field              | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `blurbLength`      | Maximum length allowed for post blurbs               |
| `githubRoot`       | GitHub project root for "Suggest an edit" post links |
| `jumboBlurbLength` | Maximum length allowed for primary post's blurb      |
| `readingTimeWpm`   | Words-per-minute for calculating reading time        |
| `siteRoot`         | Root URL of the site                                 |
| `ytPlaylistId`     | YouTube playlist ID for retrieving latest video      |

#### socials

> 🔍 Source: [`11ty/data/socials.ts`](11ty/data/links.ts)

List of links for populating the **Social** navigation menu. Object format is
the same as that of [links](#links).

#### strings

> 🔍 Source: [`11ty/data/strings.ts`](11ty/data/strings.ts)

List of string values used throughout the site and its templates

| Field              | Description                                |
| ------------------ | ------------------------------------------ |
| `aboutMe`          | HTML for the "About me" section            |
| `header`           | Text for site header                       |
| `siteMenuHeader`   | Text for **Site** navigation menu header   |
| `siteName`         | Text for site name (used in `<title>`)     |
| `socialMenuHeader` | Text for **Social** navigation menu header |

### ⚡ Functions

> 🔍 Source folder: [`11ty/functions`](11ty/functions/)

These are equivalent to _filters_ in other templating languages (e.g. nunjucks).

| Function                                     | Description                                                                            |
| -------------------------------------------- | -------------------------------------------------------------------------------------- |
| `getDescription(content, limit)`             | Produce a trimmed blurb for the given content                                          |
| `getHashRef()`                               | Get the hash ref of the latest commit in the repository                                |
| `getMetaDescription(content, limit)`         | Same as getDescription, but encoded for &lt;meta /&gt; usage                           |
| `htmlEntities(text)`                         | Replace certain character combinations with HTML entity equivalents                    |
| `inlineScript(...paths)`                     | Return an auto-executing anonymous method for the given Javascript file for inline use |
| `metaEncode(text)`                           | Replace illegal characters to produce usable text for meta tags                        |
| `renderArchivedNotice(tags)`                 | Used by the `post` layout to display an archived notice (if applicable)                |
| `renderCollection(items, limit, jumboFirst)` | Render a collection of pages                                                           |
| `renderGitHubLink(data)`                     | Render link to GitHub for editing the current page                                     |
| `renderIcon(icon)`                           | Render the provided [Feather Icons][] sprite                                           |
| `renderLazyImage(html)`                      | Render a lazy loaded image of the provided &lt;img&gt; element                         |
| `renderReadingTime(data)`                    | Render the reading time information for a page/post                                    |
| `renderTags(tags)`                           | Render a collection of tags                                                            |

### ⏰ Event handlers

> 🔍 Source folder: [`11ty/events`](11ty/events/)

| Handler     | Event            | Description                                                                                 |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------- |
| `cssTidy`   | `eleventy.after` | Purges unused rules with [purgecss][], minifies and combines stylesheets with [clean-css][] |
| `iconPurge` | `eleventy.after` | Removes unused SVG icons from `feather-icons.svg` sprite sheet                              |

### 🤖 Transforms

> 🔍 Source folder: [`11ty/transforms`](11ty/transforms/)

| Name         | Description                                                  |
| ------------ | ------------------------------------------------------------ |
| `htmlMinify` | Minifies HTML output using [html-minifier][] and [esbuild][] |

### 📚 Libraries

> 🔍 Source folder: [`11ty/libraries`](11ty/libraries/)

| ID              | Description                                          |
| --------------- | ---------------------------------------------------- |
| [markdown-it][] | Used for generating HTML content from Markdown files |

### 🔌 Plugins

> 🔍 Source folder: [`11ty/plugins`](11ty/plugins/)

| ID                                        | Description                                       |
| ----------------------------------------- | ------------------------------------------------- |
| [@11ty/eleventy-plugin-syntaxhighlight][] | Syntax highlighting for code blocks in blog posts |

## 🌐 Environment variables

There are several environment variables required for the site to operate. These
may be exposed as GitHub environment secrets, standard environment variables,
or by creating a `.env` file in the root of the project.

| Name                   | Description              |
| ---------------------- | ------------------------ |
| `TWITCH_USERNAME`      | Your Twitch username     |
| `TWITCH_CLIENT_ID`     | Twitch API client ID     |
| `TWITCH_CLIENT_SECRET` | Twitch API client secret |
| `YT_API_KEY`           | YouTube Data API key     |

## ⏯️ Tasks

> 🔍 Source folder: [`tasks`](tasks/)

There are tasks which are run directly with `node`, outside of the scope of the
the Eleventy system. These will each output a JSON file in the
`11ty/data/external` directory corresponding to the external data source they
represent.

The scripts compare their external data against the file's previous contents
(if any). If the file is identical to the external data, they will end with
an exit code of `0`. If there are differences, they will end with an exit code
of `1`. This is used to chain them together with an early exit in the GitHub
workflow responsible for polling external data sources so that a publish action
does not take place if there is nothing to update.

> **Note:** Because they will end with an exit code of `1` when there are
> differences, this must be accounted for when running them individually in a
> workflow. See examples below.

<details>
<summary>Task execution examples</summary>

```shell
# this could fail and end your workflow early
npm run check:twitch
```

```shell
# this will always proceed to the next step
npm run check:twitch || true
```

```shell
# this will set the shell variable DIFF to 1 if there are differences while
# also proceeding to the next step
npm run check:twitch || DIFF=1
```

```shell
# this will run *all* checks; return code behavior is the same
npm run check
```

</details>

| Task            | Description                                      |
| --------------- | ------------------------------------------------ |
| `check`         | Runs all `check:*` tasks                         |
| `check:twitch`  | Retrieves Twitch live stream and VOD information |
| `check:youtube` | Retrieves YouTube latest video information       |

## 🏭 Workflows

> 🔍 Source folder: [`.github/workflows`](.github/workflows/)

This site is hosted entirely on [GitHub Pages][]. Both its main publishing and
periodic update methods make use of [GitHub Actions][] workflows to update the
live site automatically when new content or data is available.

### Automatic publish on merge

> 🔍 Source: [`.github/workflows/publish-site.yml`](.github/workflows/publish-site.yml)

When the `master` branch of this repository is updated, a GitHub workflow will
regenerate the site and update the `gh-pages` branch. This causes the GitHub
Pages publishing workflow to activate, which will update the live site with any
new content. External data is also refreshed as part of this process.

### Periodic updates

> 🔍 Source: [`.github/workflows/check-externals.yml`](.github/workflows/check-externals.yml)

This site is periodically updated by way of a [hosted cronjob][] and a GitHub
workflow. Every 5 minutes, the cronjob runs the workflow responsible for
polling external data sources by using a [workflow dispatch event][]. If any of
the external sources have updated data since the last execution of the
workflow, the site will be re-published (along with the new data).

[11ty.js]: https://www.11ty.dev/docs/languages/javascript/
[@11ty/eleventy-plugin-syntaxhighlight]: https://www.npmjs.com/package/@11ty/eleventy-plugin-syntaxhighlight
[clean-css]: https://www.npmjs.com/package/clean-css
[eleventy]: https://11ty.dev
[feather icons]: https://feathericons.com
[github actions]: https://github.com/features/actions
[github pages]: https://pages.github.com
[esbuild]: https://www.npmjs.com/package/esbuild
[hosted cronjob]: https://cron-job.org
[html-minifier]: https://www.npmjs.com/package/html-minifier
[markdown-it]: https://www.npmjs.com/package/markdown-it
[purgecss]: https://www.npmjs.com/package/purgecss
[workflow dispatch event]: https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event
