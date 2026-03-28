# CLAUDE.md

## Repo layout

Single repo: everything — site source, tests, dev tooling, and documentation — lives in one place. GitHub Actions deploys only the `dist/` build output to Pages; all other files are invisible to the deployed site.

```
johnnygreco.github.io/                ← repo root, you are here
├── src/                              ← all site source code
│   ├── assets/                       ← images (Astro-optimized)
│   ├── components/                   ← Astro + React components
│   ├── content/                      ← content collections (notes, external)
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

The site is fully built and functional. All pages render, dark/light theme works, command palette works, Pagefind search works on production builds. A Playwright test suite covers navigation, content, theme, accessibility, SEO, and performance across desktop and mobile viewports.

**Deployment status:** The repo is on `main` and the GitHub Actions workflow is ready. To activate deployment, switch the Pages source to "GitHub Actions" in the repo's GitHub Settings → Pages. This has intentionally not been done yet — the current content is mock/placeholder. The old static site remains live until the switch is flipped.

**Content status:** Notes, external links, and projects all contain mock content for development. Johnny needs to replace these with real content before activating deployment.

## Architecture

**Framework:** Astro 6 with `@astrojs/mdx`, `@astrojs/react` (for interactive islands), `@astrojs/sitemap`, `@astrojs/rss`. Tailwind v4 via `@tailwindcss/vite` (NOT the deprecated `@astrojs/tailwind`). Static output.

**Content model — two collections defined in `src/content.config.ts`:**

- **notes** (`src/content/notes/*.{md,mdx}`) — Johnny's personal writing. Shows on `/notes/` and as recent notes cards on the homepage. Frontmatter: title, description, date, tags, draft, math, updatedDate.
- **external** (`src/content/external/*.md`) — Links to articles published elsewhere. Frontmatter only (no body). Shows in Notes feed and as recent notes cards on the homepage. Frontmatter: title, description, date, url, publication, tags.

The `notes/` directory is an Obsidian vault with a pre-configured `.obsidian/` directory (app settings + Obsidian Git plugin config for auto-commit/push every 5 min). The `.obsidian/` dir and `README.md` files are excluded from content collections via the glob ignore pattern.

**Pages:**

```
src/pages/
├── index.astro                    → Homepage (hero card + recent notes grid)
├── about.astro                    → About page
├── projects.astro                 → Projects (data from src/data/projects.ts)
├── 404.astro                      → Star field animation 404
├── rss.xml.ts                     → RSS feed (notes only)
├── notes/
│   ├── index.astro                → Notes listing
│   └── [...slug].astro            → Individual note pages
└── tags/
    ├── index.astro                → Tag cloud
    └── [tag].astro                → Posts filtered by tag
```

**Navigation:** Notes | Projects | About (defined in `src/components/Header.astro`)

**Key components:**

- `BaseLayout.astro` — HTML shell, `<head>`, theme init script, View Transitions (`ClientRouter`), font preloads, command palette, header, footer
- `Header.astro` — Sticky nav with mobile hamburger menu, theme toggle, ⌘K hint
- `Footer.astro` — Social links (GitHub, LinkedIn, X, Google Scholar, Email), RSS, "built with curiosity ✨"
- `ThemeToggle.tsx` — React island, reads/writes localStorage, dark default
- `CommandPalette.tsx` — React island (`client:only="react"`), uses `cmdk` library. Static page/action items + Pagefind search (loads at runtime from `/pagefind/pagefind.js`, gracefully fails in dev mode)
- `ReadingProgress.tsx` — React island, thin accent bar on article pages
- `PrevNext.astro` — Card-style prev/next navigation at bottom of note pages, with "← All notes" back link
- `FeedItem.astro` — Card component for notes/external items in feeds (used on notes index and homepage)
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

- **Activate deployment** — Switch GitHub Pages source to "GitHub Actions" in repo settings. The workflow and branch (`main`) are ready; this is blocked on real content.
- **Real content** — Notes, external links, and projects all contain mock/seed content. Replace with real content before going live.
- **About page** — Has placeholder bio text. Johnny should review and personalize.
- **OG image** — No default Open Graph image (`/og-default.png`) has been created yet.

## Key decisions and context

- **Homepage layout** — The hero section includes a "Project Spotlight" card that randomly features one project on each page load (client-side randomization via `is:inline` script, with `astro:after-swap` for View Transitions). Projects with images show the image; others get a gradient placeholder with the project initial. Below the hero, a grid of recent notes (up to 6) uses `FeedItem` cards. A "View all →" link leads to `/notes/`.
- **Notes** — Notes are Johnny's personal writing (blog posts, essays). External links are articles published elsewhere. Both appear together in the notes feed and on the homepage.
- **Obsidian integration** — The notes content directory is an Obsidian vault. Obsidian Git plugin is pre-configured but needs to be installed once through Obsidian's UI. Auto-commits every 5 min, auto-pushes every 5 min.
- **Sans-serif only** — User explicitly requested no serif fonts anywhere. All headings use Inter (font-sans font-semibold).
- **Emojis** — Used tastefully in headings and section labels. User likes them but not over the top.
- **Wider layout** — `max-w-5xl` throughout (not `max-w-3xl`). User didn't like content restricted to a narrow column.
- **Cards not lists** — Feed items are card-based (rounded-xl border bg-surface), not flat list items.
- **Theme default** — Dark mode is the default. The `<html>` tag has `data-theme="dark"` in the markup. Theme init script reads localStorage and overrides if the user previously chose light.

## How to work on this project

All commands run from the repo root (`johnnygreco.github.io/`):

```bash
npm run dev          # start Astro dev server
npm run build        # production build + pagefind
npm run preview      # preview production build
npm test             # run E2E tests (desktop + mobile viewports)
npm run test:build   # analyze build output against budgets
npm run benchmark    # build timing + build analysis
npm run validate     # build + analyze + all tests
```

See `DEVELOPMENT.md` for the full guide including content workflows, Obsidian setup, and troubleshooting.

## File reference

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro config: site URL, integrations, Tailwind vite plugin, Shiki themes, remark/rehype plugins |
| `src/content.config.ts` | Content collection schemas (notes, external) |
| `src/styles/global.css` | All CSS: theme colors, font-face, Tailwind config, prose overrides, Shiki styling |
| `src/layouts/BaseLayout.astro` | HTML shell used by every page |
| `src/layouts/BlogPost.astro` | Layout for individual notes (title, date, tags, prose, prev/next) |
| `src/utils/merge-feeds.ts` | `getMergedFeed()` for notes feed (notes + external), used on homepage and notes index |
| `src/data/projects.ts` | Project list data (name, description, url, tags, addedDate, image) |
| `.github/workflows/deploy.yml` | GitHub Actions: checkout → npm ci → build → deploy to Pages |
| `tests/e2e/*.spec.ts` | Playwright E2E tests (navigation, content, theme, a11y, seo, perf) |
| `tests/benchmarks/build-analysis.ts` | Build output analysis with size budgets |
| `tests/benchmarks/build-timing.ts` | Build time measurement |
| `playwright.config.ts` | Playwright config (desktop Chrome + mobile Pixel 7) |
| `DEVELOPMENT.md` | Human-readable development and content workflow guide |
| `_templates/` | Example frontmatter for notes, external links |
