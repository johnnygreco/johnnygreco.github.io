# Repository notes for coding agents

This is Johnny Greco's personal site at `johnnygreco.dev`. It uses Zensical,
not Astro or a JavaScript frontend framework.

## Structure

```text
docs/                       Markdown pages and static public files
  index.md                  Homepage markup
  writing/                  Pieces hosted on this site
  stylesheets/site-v4.css   Shared site design and layout tokens
data/writing.yml            Writing archive data
data/activity.yml           Homepage and archive activity data
data/projects.yml           Random project-spotlight data
overrides/main.html         Zensical template overrides
  partials/content.html     Shared wrapper for every page
zensical.toml               Site configuration and navigation
pyproject.toml / uv.lock    Python dependency definition and lockfile
site/                       Generated output (ignored)
```

## Commands

```bash
uv sync --locked
uv run zensical serve
uv run zensical build --clean
```

## Content model

The macros extension loads the YAML files under `data/`. `data/activity.yml`
drives the prominent homepage feed and Activity archive; `data/writing.yml`
drives the Writing archive. New entries go at the top. External entries use an
absolute URL and `external: true`; local pieces use a relative URL,
`external: false`, and a Markdown file under `docs/writing/`.

The homepage also loops over `data/projects.yml`, then uses a small inline
script to reveal one randomly selected project per visit.

The macro configuration is strict, so missing data or rendering errors fail the
build. Keep `docs/CNAME` and `docs/beacon/install.sh`; their deployed URLs are
part of the site's existing behavior.

All routes inherit `.site-page` from `overrides/partials/content.html`. Header,
content, and footer alignment share `--jg-shell-width` and
`--jg-shell-gutter` in `docs/stylesheets/site-v4.css`. Do not add page-specific
outer widths or margins; add only the layout needed inside the shared shell.

Deployment is intentionally manual. Do not add a `push` trigger to the GitHub
Pages workflow or deploy the site without explicit approval from Johnny.

## Design intent

Preserve the old live site's quiet profile and simple social links. On desktop,
the profile sits in the left column while Project spotlight and Recent activity
stack in the right column; on mobile, those sections follow the profile in that
order. Avoid reintroducing the previous terminal aesthetic or a heavy client
runtime. Dark mode is supplied by Zensical's native palette control.
