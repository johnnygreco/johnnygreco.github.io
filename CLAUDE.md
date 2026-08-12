# Repository notes for coding agents

This is Johnny Greco's personal site at `johnnygreco.dev`. It uses Zensical,
not Astro or a JavaScript frontend framework.

## Structure

```text
docs/                       Markdown pages and static public files
  index.md                  Homepage markup
  writing/                  Pieces hosted on this site
  stylesheets/extra.css     Site design
data/writing.yml            Homepage writing-card data
overrides/main.html         Zensical template overrides
zensical.toml               Site configuration and navigation
pyproject.toml / uv.lock    Python dependency definition and lockfile
site/                       Generated output (ignored)
```

## Commands

```bash
uv sync
uv run zensical serve
uv run zensical build --clean
```

## Content model

The macros extension loads `data/writing.yml` as the `writing` variable. The
homepage loops over it to render cards. New entries go at the top. External
entries use an absolute URL and `external: true`; local pieces use a relative
URL, `external: false`, and a Markdown file under `docs/writing/`.

The macro configuration is strict, so missing data or rendering errors fail the
build. Keep `docs/CNAME` and `docs/beacon/install.sh`; their deployed URLs are
part of the site's existing behavior.

Deployment is intentionally manual. Do not add a `push` trigger to the GitHub
Pages workflow or deploy the site without explicit approval from Johnny.

## Design intent

Preserve the old live site's quiet, centered profile and simple social links.
Recent writing is the main extension: clean, responsive cards beneath the
profile. Avoid reintroducing the previous terminal aesthetic or a heavy client
runtime. Dark mode is supplied by Zensical's native palette control.
