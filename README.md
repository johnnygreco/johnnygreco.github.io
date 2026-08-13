# johnnygreco.dev

Johnny Greco's personal website, built with [Zensical](https://zensical.org/).
The homepage keeps the small, personal feel of the original site and adds
prominent recent activity plus a compact, randomized project spotlight.

## Run it locally

You need Python 3.10+ and [uv](https://docs.astral.sh/uv/).

```bash
uv sync --locked
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

Add items displayed in the homepage activity feed to `data/activity.yml`.
Activity can point to writing, research, releases, or other work; add the newest
item at the top and keep its description to one sentence.

## Important files

- `zensical.toml` — site, navigation, theme, and extension configuration
- `data/writing.yml` — Writing archive entries
- `data/activity.yml` — recent homepage activity
- `data/projects.yml` — projects eligible for the randomized spotlight
- `docs/` — Markdown pages and static assets
- `docs/stylesheets/site-v4.css` — shared visual design and layout tokens
- `overrides/main.html` — small metadata/title overrides
- `overrides/partials/content.html` — shared page wrapper used by every route
- `.github/workflows/deploy.yml` — GitHub Pages deployment

Deployment is intentionally manual through the GitHub Actions workflow.
