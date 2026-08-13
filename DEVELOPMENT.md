# Development guide

## Setup and preview

Install [uv](https://docs.astral.sh/uv/) and run:

```bash
uv sync --locked
uv run zensical serve
```

Zensical watches the Markdown, YAML, templates, and stylesheets and rebuilds
the preview at <http://127.0.0.1:8000>.

Before committing, run the production build:

```bash
uv run zensical build --clean
```

## Publish a piece on this site

1. Create `docs/writing/my-piece.md`.
2. Add front matter and a Markdown title:

   ```markdown
   ---
   title: My piece
   description: A short description.
   date: 2026-09-01
   hide:
     - toc
   ---

   # My piece

   Start writing here.
   ```

3. Add its card to the top of `data/writing.yml` with a relative URL and
   `external: false`.
4. Add the page to `nav` in `zensical.toml` if it should appear in navigation.

## Link to writing published elsewhere

Only a card entry is needed. Add it to `data/writing.yml` with an absolute URL,
the publication in `source`, and `external: true`. External cards open in a new
tab and display an external-link mark.

## Update recent activity

The homepage feed and Activity archive use `data/activity.yml`. Put the newest
entry first and provide a short `kind`, source, URL, and one-sentence
description. Set `external: true` for links that leave this site.

## Update the project spotlight

Project details live in `data/projects.yml`. Every entry participates in the
random homepage selection and needs a name, owner, description, GitHub URL,
local preview image, language, and color accent. Preview images live in
`docs/assets/projects/`.

## Design and assets

The homepage content lives in `docs/index.md`. Every page is wrapped in
`.site-page` by `overrides/partials/content.html`; shared widths and gutters are
defined once at the top of `docs/stylesheets/site-v4.css`. Keep page-specific CSS
inside that shell rather than adding route-specific container widths. The
profile image and self-hosted Inter font live in `docs/assets/`. Zensical copies
non-Markdown files in `docs/` into the build, including `CNAME` and
`beacon/install.sh`.
