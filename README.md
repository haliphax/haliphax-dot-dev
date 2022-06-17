# haliphax.dev

The source code for https://haliphax.dev and its accompanying processes;
proudly built with [Eleventy]!

## Directory structure

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

## Configuration structure

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

## Environment variables

There are several environment variables required for the site to operate. These
may be exposed as GitHub environment secrets, standard environment variables,
or by creating a `.env` file in the root of the project.

- `TWITCH_USERNAME` Your Twitch username
- `TWITCH_CLIENT_ID` Twitch API client ID
- `TWITCH_CLIENT_SECRET` Twitch API client secret
- `YT_API_KEY` YouTube Data API key

## Tasks

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

- Task: [checkTwitch.mjs]

### YouTube data

```shell
npm run check-youtube
```

Uses the YouTube Data API to retrieve latest video information

- Task: [checkYouTube.mjs]

## Workflows

This site is hosted entirely on [GitHub Pages]. Both its main publishing and
periodic update methods make use of [GitHub Actions] workflows to update the
live site automatically when new content or data is available.

### Automatic publish on merge

When the `master` branch of this repository is updated, a GitHub workflow will
regenerate the site and update the `gh-pages` branch. This causes the GitHub
Pages publishing workflow to activate, which will update the live site with any
new content.

- Workflow: [publish-site.yml]

### Periodic updates

This site is periodically updated by way of a [hosted cronjob] and a GitHub
workflow. Every 5 minutes, the cronjob runs the workflow responsible for
polling external data sources by using a [workflow dispatch event]. If any of
the external sources have updated data since the last execution of the
workflow, the site will be re-published (along with the new data).

- Workflow: [check-externals.yml]


[Eleventy]: https://11ty.dev
[checkTwitch.mjs]: https://github.com/haliphax/haliphax-dot-dev/blob/master/tasks/checkTwitch.mjs
[checkYouTube.mjs]: https://github.com/haliphax/haliphax-dot-dev/blob/master/tasks/checkYouTube.mjs
[GitHub Pages]: https://pages.github.com
[GitHub Actions]: https://github.com/features/actions
[publish-site.yml]: https://github.com/haliphax/haliphax-dot-dev/blob/master/.github/workflows/publish-site.yml
[hosted cronjob]: https://cron-job.org
[workflow dispatch event]: https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event
[check-externals.yml]: https://github.com/haliphax/haliphax-dot-dev/blob/master/.github/workflows/check-externals.yml
