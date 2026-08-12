# Development guide

## Setup and preview

Install [uv](https://docs.astral.sh/uv/) and run:

```bash
uv sync
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

## Design and assets

The homepage content lives in `docs/index.md`. Site-wide styles are in
`docs/stylesheets/extra.css`. The profile image and self-hosted Inter font live
in `docs/assets/`. Zensical copies non-Markdown files in `docs/` into the build,
including `CNAME` and `beacon/install.sh`.
