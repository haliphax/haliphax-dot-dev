# 🎈 haliphax.dev

The source code for https://haliphax.dev and its accompanying processes;
proudly built with [Eleventy]!

## 🎉 Features

### 🗒 Data

#### ignoreTags

List of post tags that should be ignored when building tag pages or displaying
a post's associated tags

#### links

List of objects for use in the **Site** navigation menu. Their format is as
follows:

| Field | Description |
|---|---|
| `name` | Name to display in the menu |
| `url` | URL for the generated link tag |
| `icon` | CSS classes for the link's FontAwesome icon |

#### metaDefaults

Default values for page metadata

| Field | Description |
|---|---|
| `author` | Author of the post/page |
| `description` | Meta description |
| `generator` | Eleventy package name and version |
| `openGraphImageUrl` | URL to use for `og:image` OpenGraph tag |
| `openGraphType` | Type of page for `og:type` tag |

#### misc

Miscellaneous values that don't belong elsewhere

| Field | Description |
|---|---|
| `blurbLength` | Maximum length allowed for post blurbs |
| `jumboBlurbLength` | Maximum length allowed for primary post's blurb |
| `readingTimeWpm` | Words-per-minute for calculating reading time |
| `ytPlaylistId` | YouTube playlist ID for retrieving latest video |

#### socials

List of links for populating the **Social** navigation menu. Object format is
the same as that of [links](#links).

#### strings

List of string values used throughout the site and its templates

| Field | Description |
|---|---|
| `githubRoot` | GitHub project root for "Suggest an edit" post links |
| `header` | Text for site header |
| `siteMenuHeader` | Text for **Site** navigation menu header |
| `siteName` | Text for site name (used in `<title>`) |
| `siteRoot` | Root URL of the site |
| `socialMenuHeader` | Text for **Social** navigation menu header |
| `twitter` | Twitter handle (used in meta tags) |

### ⚡ Functions

| Function | Description |
|---|---|
| `getDescription(content, limit)` | Produce a trimmed blurb for the given content |
| `getMetaDescription(content, limit)` | Same as getDescription, but encoded for &lt;meta /&gt; usage |
| `htmlEntities(text)` | Replace certain character combinations with HTML entity equivalents |
| `metaEncode(text)` | Replace illegal characters to produce usable text for meta tags |
| `renderArchivedNotice(tags)` | Used by the `post` layout to display an archived notice (if applicable) |
| `renderCollection(items, limit, jumboFirst)` | Render a collection of pages |
| `renderGitHubLink(data)` | Render link to GitHub for editing the current page |
| `renderIcon(icon)` | Render the provided [Feather Icons] sprite |
| `renderReadingTime(data)` | Render the reading time information for a page/post |
| `renderTags(tags)` | Render a collection of tags |

### 🖼️ Layouts

All layout templates are built using the [`11ty.js`] (JavaScript) template
language.

| Key | Parent | Description |
|---|---|---|
| `base` | _none_ | The base layout, which includes the outer document shell and site navigation |
| `withHeader` | `base` | Reads `data.header` for use in an `<h1>` element |
| `page` | `withHeader` | Used for Markdown pages; includes reading time, edit link, etc. |
| `post` | `withHeader` | Like `page`, but includes posted timestamp |

### 🔖 Special tags

Some tags may confer special behavior to the post they are attached to.

| Key | Description |
|---|---|
| `archived` | Removes the post from tag lists and displays a notice explaining to the viewer that the page has been archived |

### 📚 Libraries

| ID | Description |
|---|---|
| [`markdown-it`] | Used for generating HTML content from Markdown files |

### 🔌 Plugins

| ID | Description |
|---|---|
| [`@11ty/eleventy-plugin-syntaxhighlight`] | Syntax highlighting for code blocks in blog posts |

### 🤖 Transforms

| Name | Description |
|---|---|
| `htmlMinify` | Minifies HTML output using [`html-minifier`] and [`esbuild`] |

## 🌳 Directory structure

The directory structure used by this site may be considered "nonstandard" when
compared to the Eleventy documentation and various starter site templates, but
I personally find it much easier to reason with.

- `.github` Definitions for GitHub actions
- `11ty` Eleventy code and data
  - `data` Global data
    - `external` Data from external sources
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
beneath the `11ty` directory. Each of these folders contains a `_config.js`
file (with the exception of the `data` folder, which is automatically parsed by
Eleventy).

The `_config.js` file is used to collate all of that category's members
together and to expose a single function to the main Eleventy configuration
function. In this way, the complexity of the category's setup is abstracted
from the main configuration and it makes for less clutter.

> **Example:** All of your layout templates are under `layouts`, and a single
> function in `layouts/_config.js` is used by the main Eleventy configuration
> function to assign each of them an alias. They are loaded like so:

```js
// .eleventy.js
const cfgLayouts = require('./11ty/layouts/_config');

module.exports = cfg => {
	cfgLayouts(cfg);
	// ...
};
```

> When you need to make modifications to your layout setup, you will be working
> strictly with the files contained in this directory. Similar mechanisms exist
> for each of the other categories, though their configuration functions'
> content may differ slightly.

## 🌐 Environment variables

There are several environment variables required for the site to operate. These
may be exposed as GitHub environment secrets, standard environment variables,
or by creating a `.env` file in the root of the project.

| Name | Description |
|---|---|
| `TWITCH_USERNAME` | Your Twitch username |
| `TWITCH_CLIENT_ID` | Twitch API client ID |
| `TWITCH_CLIENT_SECRET` | Twitch API client secret |
| `YT_API_KEY` | YouTube Data API key |

## ⏯️ Tasks

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

```shell
# this could fail and end your workflow early
npm run check-twitch
```

```shell
# this will always proceed to the next step
npm run check-twitch || true
```

```shell
# this will set the shell variable DIFF to 1 if there are differences while
# also proceeding to the next step
npm run check-twitch || DIFF=1
```

### Twitch data

```shell
npm run check-twitch
```

Uses the Twitch API to retrieve live stream and VOD information

- Task: [check-twitch.mjs]

### YouTube data

```shell
npm run check-youtube
```

Uses the YouTube Data API to retrieve latest video information

- Task: [check-youtube.mjs]

## 🔄 Workflows

This site is hosted entirely on [GitHub Pages]. Both its main publishing and
periodic update methods make use of [GitHub Actions] workflows to update the
live site automatically when new content or data is available.

### Automatic publish on merge

When the `master` branch of this repository is updated, a GitHub workflow will
regenerate the site and update the `gh-pages` branch. This causes the GitHub
Pages publishing workflow to activate, which will update the live site with any
new content. External data is also refreshed as part of this process.

- Workflow: [publish-site.yml]

### Periodic updates

This site is periodically updated by way of a [hosted cronjob] and a GitHub
workflow. Every 5 minutes, the cronjob runs the workflow responsible for
polling external data sources by using a [workflow dispatch event]. If any of
the external sources have updated data since the last execution of the
workflow, the site will be re-published (along with the new data).

- Workflow: [check-externals.yml]


[Eleventy]: https://11ty.dev
[`11ty.js`]: https://www.11ty.dev/docs/languages/javascript/
[`markdown-it`]: https://www.npmjs.com/package/markdown-it
[`@11ty/eleventy-plugin-syntaxhighlight`]: https://www.npmjs.com/package/@11ty/eleventy-plugin-syntaxhighlight
[`html-minifier`]: https://www.npmjs.com/package/html-minifier
[`esbuild`]: https://www.npmjs.com/package/esbuild
[check-twitch.mjs]: https://github.com/haliphax/haliphax-dot-dev/blob/master/tasks/check-twitch.mjs
[check-youtube.mjs]: https://github.com/haliphax/haliphax-dot-dev/blob/master/tasks/check-youtube.mjs
[Feather Icons]: https://feathericons.com
[GitHub Pages]: https://pages.github.com
[GitHub Actions]: https://github.com/features/actions
[publish-site.yml]: https://github.com/haliphax/haliphax-dot-dev/blob/master/.github/workflows/publish-site.yml
[hosted cronjob]: https://cron-job.org
[workflow dispatch event]: https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event
[check-externals.yml]: https://github.com/haliphax/haliphax-dot-dev/blob/master/.github/workflows/check-externals.yml
