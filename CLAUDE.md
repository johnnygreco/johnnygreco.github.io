# CLAUDE.md

## Repo layout

Single repo: everything — site source, tests, dev tooling, and documentation — lives in one place. GitHub Actions deploys only the `dist/` build output to Pages; all other files are invisible to the deployed site.

```
johnnygreco.github.io/                ← repo root, you are here
├── src/                              ← all site source code
│   ├── assets/                       ← images (Astro-optimized)
│   ├── components/                   ← Astro + React components
│   ├── content/                      ← content collections (notes, log, external)
│   ├── data/                         ← static data (projects.ts)
│   ├── layouts/                      ← page layouts
│   ├── pages/                        ← file-based routing
│   ├── styles/                       ← global CSS + Tailwind config
│   ├── utils/                        ← helpers (merge-feeds, format-date)
│   └── content.config.ts             ← collection schemas
├── public/                           ← static assets (fonts, favicon, CNAME)
├── tests/                            ← E2E tests + benchmarks
├── _templates/                       ← content creation templates
├── dist/                             ← production build output (gitignored)
├── astro.config.mjs
├── tsconfig.json
├── package.json                      ← all deps + all scripts
├── playwright.config.ts
├── CLAUDE.md                         ← this file
├── DEVELOPMENT.md                    ← dev guide
└── .github/workflows/deploy.yml      ← CI/CD
```

All paths below are relative to the repo root.

## What this is

Personal website for Johnny Greco at johnnygreco.dev. Built with Astro 6, Tailwind v4, deployed to GitHub Pages via GitHub Actions.

## Current state

The site is fully built and functional. All pages render, dark/light theme works, command palette works, Pagefind search works on production builds. A comprehensive test suite (186 tests) covers navigation, content, theme, accessibility, SEO, and performance. The GitHub Actions workflow is written but deployment hasn't been activated yet (branch is still `master`, needs to be renamed to `main`, and Pages source needs to be switched to GitHub Actions in repo settings).

## Architecture

**Framework:** Astro 6 with `@astrojs/mdx`, `@astrojs/react` (for interactive islands), `@astrojs/sitemap`, `@astrojs/rss`. Tailwind v4 via `@tailwindcss/vite` (NOT the deprecated `@astrojs/tailwind`). Static output.

**Content model — three collections defined in `src/content.config.ts`:**

- **notes** (`src/content/notes/*.{md,mdx}`) — Johnny's personal writing. Shows on `/notes/` and homepage Activity feed. Frontmatter: title, description, date, tags, draft, math, updatedDate, hideFromActivity.
- **log** (`src/content/log/*.md`) — 100% AI-agent-written daily logs. Shows on `/log/` and homepage Activity feed. Each entry gets its own page + a raw markdown endpoint at `/log/[slug]/raw.md`. Frontmatter: title, date, tags, description, draft, hideFromActivity.
- **external** (`src/content/external/*.md`) — Links to articles published elsewhere. Frontmatter only (no body). Shows in Notes feed and homepage Activity feed. Frontmatter: title, description, date, url, publication, tags, hideFromActivity.

Both `notes/` and `log/` directories are Obsidian vaults with pre-configured `.obsidian/` directories (app settings + Obsidian Git plugin config for auto-commit/push every 5 min). The `.obsidian/` dirs and `README.md` files are excluded from content collections via the glob ignore pattern.

**Pages:**

```
src/pages/
├── index.astro                    → Homepage (intro + explore links + scrollable activity feed)
├── about.astro                    → About page
├── projects.astro                 → Projects (data from src/data/projects.ts)
├── 404.astro                      → Star field animation 404
├── rss.xml.ts                     → RSS feed (notes only)
├── notes/
│   ├── index.astro                → Notes listing
│   └── [...slug].astro            → Individual note pages
├── log/
│   ├── index.astro                → Agent's Log stream (truncated previews, paginated at 20)
│   └── [...slug]/
│       ├── index.astro            → Individual log entry pages
│       └── raw.md.ts              → Raw markdown endpoint for each entry
└── tags/
    ├── index.astro                → Tag cloud
    └── [tag].astro                → Posts filtered by tag
```

**Navigation:** Agent's Log | Notes | Projects | About (defined in `src/components/Header.astro`)

**Key components:**

- `BaseLayout.astro` — HTML shell, `<head>`, theme init script, View Transitions (`ClientRouter`), font preloads, command palette, header, footer
- `Header.astro` — Sticky nav with mobile hamburger menu, theme toggle, ⌘K hint
- `Footer.astro` — Social links (GitHub, LinkedIn, X, Google Scholar, Email), RSS, "built with curiosity ✨"
- `ThemeToggle.tsx` — React island, reads/writes localStorage, dark default
- `CommandPalette.tsx` — React island (`client:only="react"`), uses `cmdk` library. Static page/action items + Pagefind search (loads at runtime from `/pagefind/pagefind.js`, gracefully fails in dev mode)
- `ReadingProgress.tsx` — React island, thin accent bar on article pages
- `PrevNext.astro` — Card-style prev/next navigation at bottom of note and log entry pages, with "← All notes" / "← All log entries" back link
- `FeedItem.astro` — Card component for notes/external items in feeds (used on notes index)
- `ActivityItem.astro` — Compact list item for the homepage Activity feed (handles all 4 types: note, log, external, project)
- `DotGrid.astro` — CSS-only subtle dot grid background

**Design system (`src/styles/global.css`):**

- Dark mode default (`data-theme="dark"` on `<html>`)
- Theme persisted in localStorage, applied before first paint via inline script
- `astro:before-swap` listener preserves theme across client-side navigations
- Colors via CSS custom properties: `--bg`, `--surface`, `--border`, `--text`, `--text-muted`, `--accent`, `--accent-hover`, `--accent-subtle`
- Dark: bg `#0a0a0b`, accent `#818cf8` (indigo). Light: bg `#fafafa`, accent `#4f46e5`
- Fonts: Inter (variable, sans), JetBrains Mono (variable, mono) — self-hosted WOFF2 in `public/fonts/`
- Tailwind v4 config via `@theme` block in CSS (no `tailwind.config.mjs`)
- `@tailwindcss/typography` for prose styling
- Shiki dual-theme syntax highlighting (github-light / github-dark), switched via CSS not JS
- `.btn` / `.btn-primary` classes exclude elements from global `a` color styling

**Build:**

`npm run build` = `astro build && npx pagefind --site dist`. Pagefind generates search index at `dist/pagefind/`. The command palette loads it at runtime.

**Preserved files from old site:**

- `public/CNAME` → `johnnygreco.dev`
- `public/beacon/install.sh` → Install script for the beacon project (must stay at this URL)
- `src/assets/me.png` → Profile photo (Astro optimizes it to WebP at build)

## What's NOT done

- **Deployment activation** — Branch rename (`master` → `main`) and GitHub Pages source switch to "GitHub Actions" haven't been done yet
- **Real content** — The notes and log entries are seed/example content. Johnny needs to write real ones.
- **Projects page** — Only has `beacon` and `hugs` as placeholders. Needs real project data.
- **About page** — Has placeholder bio text. Johnny should review and personalize.
- **OG image** — No default Open Graph image (`/og-default.png`) has been created yet.
- **Color contrast** — Accent `#818cf8` on `#0a0a0b` is ~6.1:1 (passes WCAG AA).

## Key decisions and context

- **Notes vs Agent's Log** — These are intentionally separate content collections. Notes = Johnny's writing. Agent's Log = agent-written only. Both appear in the homepage Activity feed (a unified chronological stream of all content types). Any item can be excluded from the Activity feed via `hideFromActivity: true` in frontmatter.
- **Obsidian integration** — Both content directories are Obsidian vaults. Obsidian Git plugin is pre-configured but needs to be installed once through Obsidian's UI. Auto-commits every 5 min, auto-pushes every 5 min.
- **Raw markdown endpoints** — Every log entry has `/log/[slug]/raw.md` serving the original markdown with frontmatter. Content-Type is `text/markdown`. This is for agent consumption.
- **Sans-serif only** — User explicitly requested no serif fonts anywhere. All headings use Inter (font-sans font-semibold).
- **Emojis** — Used tastefully in headings and section labels. User likes them but not over the top.
- **Wider layout** — `max-w-5xl` throughout (not `max-w-3xl`). User didn't like content restricted to a narrow column.
- **Cards not lists** — Feed items are card-based (rounded-xl border bg-surface), not flat list items.
- **Log index truncation** — Long log entries show a 250-char plain-text preview on the index page. Full content only on the individual entry page.
- **Log index pagination** — First 20 entries shown, "Show more" button reveals next 20. All entries are in the HTML (client-side pagination via CSS hidden class).
- **Theme default** — Dark mode is the default. The `<html>` tag has `data-theme="dark"` in the markup. Theme init script reads localStorage and overrides if the user previously chose light.

## How to work on this project

All commands run from the repo root (`johnnygreco.github.io/`):

```bash
npm run dev          # start Astro dev server
npm run build        # production build + pagefind
npm run preview      # preview production build
npm test             # run all 186 E2E tests (desktop + mobile)
npm run test:build   # analyze build output against budgets
npm run benchmark    # build timing + build analysis
npm run validate     # build + analyze + all tests
```

See `DEVELOPMENT.md` for the full guide including content workflows, Obsidian setup, and troubleshooting.

## File reference

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro config: site URL, integrations, Tailwind vite plugin, Shiki themes, remark/rehype plugins |
| `src/content.config.ts` | Content collection schemas (notes, log, external) |
| `src/styles/global.css` | All CSS: theme colors, font-face, Tailwind config, prose overrides, Shiki styling |
| `src/layouts/BaseLayout.astro` | HTML shell used by every page |
| `src/layouts/BlogPost.astro` | Layout for individual notes (title, date, tags, prose, prev/next) |
| `src/layouts/LogEntry.astro` | Layout for individual log entries (breadcrumb, raw link, prev/next) |
| `src/utils/merge-feeds.ts` | `getMergedFeed()` for notes index (notes + external), `getRecentActivity()` for homepage Activity (all 4 types) |
| `src/data/projects.ts` | Project list data (name, description, url, tags, addedDate, hideFromActivity) |
| `.github/workflows/deploy.yml` | GitHub Actions: checkout → npm ci → build → deploy to Pages |
| `tests/e2e/*.spec.ts` | Playwright E2E tests (navigation, content, theme, a11y, seo, perf) |
| `tests/benchmarks/build-analysis.ts` | Build output analysis with size budgets |
| `tests/benchmarks/build-timing.ts` | Build time measurement |
| `playwright.config.ts` | Playwright config (desktop Chrome + mobile Pixel 7) |
| `DEVELOPMENT.md` | Human-readable development and content workflow guide |
| `_templates/` | Example frontmatter for notes, log entries, external links |
