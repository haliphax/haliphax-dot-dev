# haliphax.dev

The source code for https://haliphax.dev and its accompanying processes;
proudly built with [Eleventy]!

## Directory structure

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
node tasks/getTwitchData.mjs
```

```shell
# this will always proceed to the next step
node tasks/getTwitchData.mjs || true
```

### Twitch data

```shell
node tasks/getTwitchData.mjs
```

Uses the Twitch API to retrieve live stream and VOD information

### YouTube data

```shell
node tasks/getYouTubeData.mjs
```

Uses the YouTube Data API to retrieve latest video information

## Automatic publish on merge

When the `master` branch of this repository is updated, a GitHub workflow will
regenerate the site and update the `gh-pages` branch. This causes the GitHub
Pages publishing workflow to activate, which will update the live site with any
new content.

## Periodic updates

This site is periodically updated by way of a [hosted cronjob] and a GitHub
workflow. Every 5 minutes, the cronjob runs the workflow responsible for
polling external data sources. If any of the external sources have updated
data since the last execution of the workflow, the site will be re-published
(along with the new data).


[Eleventy]: https://11ty.dev
[hosted cronjob]: https://cron-job.org
