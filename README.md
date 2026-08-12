# johnnygreco.dev

Johnny Greco's personal website, built with [Zensical](https://zensical.org/).
The homepage keeps the small, personal feel of the original site and adds a
card-based list of recent writing from this site and elsewhere.

## Run it locally

You need Python 3.10+ and [uv](https://docs.astral.sh/uv/).

```bash
uv sync
uv run zensical serve
```

Open <http://127.0.0.1:8000>. To make a production build:

```bash
uv run zensical build --clean
```

The generated site is written to `site/`.

## Add recent writing

Edit `data/writing.yml` and add the newest item at the top:

```yaml
writing:
  - title: Your article title
    description: A short description for the card.
    date: September 1, 2026
    source: Publication name
    url: https://example.com/your-article
    external: true
```

Use `external: false` and a relative URL such as `writing/my-piece/` for a
piece hosted here. Then create `docs/writing/my-piece.md` with regular Markdown.

## Important files

- `zensical.toml` — site, navigation, theme, and extension configuration
- `data/writing.yml` — homepage writing cards
- `docs/` — Markdown pages and static assets
- `docs/stylesheets/extra.css` — visual design
- `overrides/main.html` — small metadata/title overrides
- `.github/workflows/deploy.yml` — GitHub Pages deployment

Deployment is intentionally manual until the new site is approved for launch.
