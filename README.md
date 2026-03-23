# johnnygreco.dev

Personal website for Johnny Greco — AI engineer and former astronomer.

Built with Astro 6, Tailwind v4, React islands, and deployed to GitHub Pages via GitHub Actions. Dark mode default, command palette with Pagefind search, Obsidian-powered content workflow.

**Status:** Code is complete, mock content in place. Real content TBD. Deployment not yet activated.

## Quick start

```bash
npm install
npm run dev       # http://localhost:4321
```

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Production build + Pagefind search index |
| `npm run preview` | Preview production build locally |
| `npm test` | Run E2E tests (Playwright, desktop + mobile) |
| `npm run test:build` | Analyze build output against size budgets |
| `npm run benchmark` | Build timing + build analysis |
| `npm run validate` | Build + analyze + test everything |

## Content

Content lives in `src/content/` as markdown files organized into three collections:

- **Notes** (`src/content/notes/`) — Personal writing, shows on `/notes/` and homepage Activity feed
- **Agent's Log** (`src/content/log/`) — AI-agent-written logs, shows on `/log/` and Activity feed
- **External** (`src/content/external/`) — Links to articles published elsewhere

Both Notes and Agent's Log directories are Obsidian vaults with auto-commit/push pre-configured. See [DEVELOPMENT.md](DEVELOPMENT.md) for content workflows.

## Deployment

Push to `main` triggers GitHub Actions → builds → deploys `dist/` to GitHub Pages. Tests, docs, and dev tooling in the repo are invisible to the deployed site.

**First-time activation:** Go to repo Settings → Pages → Source → select "GitHub Actions".

## Docs

- **[DEVELOPMENT.md](DEVELOPMENT.md)** — Full dev guide: setup, content workflows, Obsidian config, editing site code, troubleshooting
- **[CLAUDE.md](CLAUDE.md)** — Architecture, key decisions, and context for AI agents working on this codebase
