# Development Guide

## Prerequisites

- Node.js 22+ (`brew install node`)
- Git
- Obsidian (optional, for writing notes)

## Setup

```bash
cd ~/projects/johnnygreco.github.io
npm install
```

## Local development

All commands run from the repo root:

```bash
# Start the dev server (hot reload, fast)
npm run dev
# → http://localhost:4321

# Production build (includes Pagefind search index)
npm run build

# Preview the production build locally
npm run preview
# → http://localhost:4321

# Run the full test suite
npm test

# Run build analysis (bundle sizes, budgets)
npm run test:build

# Build + analyze + test everything
npm run validate
```

The dev server is best for editing layouts, styles, and components. Use the production build + preview when you want to test Pagefind search (it only works after a build).

---

## Deploying

Deployment is automatic. Push to `main` and GitHub Actions builds and deploys to GitHub Pages.

```bash
git push origin main
```

That's it. The workflow (`.github/workflows/deploy.yml`) runs `npm ci` → `npm run build` → deploys `dist/` to GitHub Pages. Tests, dev tooling, and everything else in the repo are invisible to the deployed site — Pages only sees the build output.

### First-time setup

If you haven't switched to GitHub Actions deployment yet:

1. Rename the branch:
   ```bash
   git branch -m master main
   git push -u origin main
   ```
2. Go to the repo on GitHub → Settings → Pages → Source → select "GitHub Actions"
3. The `CNAME` file in `public/` handles the `johnnygreco.dev` domain

---

## Writing a note

Notes are your personal writing — blog posts, insights, write-ups. They appear on `/notes/` and as recent notes on the homepage.

### Option A: Write in Obsidian (recommended)

1. Open `src/content/notes/` as a vault in Obsidian ("Open folder as vault")
2. First time only: install the **Obsidian Git** plugin (Settings → Community plugins → Browse → "Git" → Install → Enable). The config is pre-set.
3. Create a new file, e.g. `my-note.md`
4. Add frontmatter at the top:

```markdown
---
title: "Your title here"
description: "A one-liner that shows up in previews and cards"
date: 2026-03-22
tags: ["agents", "building"]
---

Your content starts here. Use standard markdown.

## Headings work

So do **bold**, *italic*, [links](https://example.com), and:

- bullet lists
- code blocks
- blockquotes
- images
```

5. Save. Obsidian Git auto-commits every 5 minutes and pushes. The site rebuilds automatically.

### Option B: Write in your editor

1. Create a file at `src/content/notes/my-note.md` (or `.mdx` if you want to embed React components)
2. Add the same frontmatter as above
3. Commit and push:
   ```bash
   git add src/content/notes/my-note.md
   git commit -m "note: my note"
   git push
   ```

### Drafts

Set `draft: true` in the frontmatter and the note won't appear on the site. Remove it (or set to `false`) when you're ready to publish.

### Math

If your note uses LaTeX math, add `math: true` to the frontmatter:

```markdown
---
title: "Some math"
description: "..."
date: 2026-03-22
tags: ["math"]
math: true
---

Inline math: $E = mc^2$

Display math:

$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}
$$
```

---

## Adding an external link

External links are for articles you published on other sites. They appear in the Notes feed with an external link icon.

Create a file at `src/content/external/some-title.md`:

```markdown
---
title: "Title of the Article"
description: "One-liner"
date: 2026-03-22
url: "https://example.com/your-article"
publication: "Publication Name"
tags: ["topic"]
---
```

No body content needed — just the frontmatter. Commit and push.

---

## Editing site copy, layout, or styles

All site source files are in `src/`.

### Changing text on a page

Page files are in `src/pages/`. Each `.astro` file is a page:

```
src/pages/index.astro        → homepage
src/pages/about.astro         → /about/
src/pages/projects.astro      → /projects/
src/pages/notes/index.astro   → /notes/
src/pages/404.astro            → 404 page
```

Open the file, edit the text, save. If `npm run dev` is running, changes appear instantly.

### Changing navigation

Edit `src/components/Header.astro` — the `navItems` array at the top.

### Changing social links

Edit `src/components/Footer.astro` — the `socialLinks` array at the top. Also update `src/pages/index.astro` if you want to change the social icons in the hero section.

### Changing the color scheme

Edit `src/styles/global.css` — the CSS custom properties under `:root` (dark theme) and `[data-theme="light"]` (light theme).

### Changing fonts

Font files are in `public/fonts/`. `@font-face` declarations are in `src/styles/global.css`. The Tailwind theme references them in the `@theme` block.

### Updating projects

Edit `src/data/projects.ts` — it's a simple array of objects. Each project has a `name`, `description`, `url`, `tags`, `addedDate`, and optional `image`.

---

## Project structure

```
johnnygreco.github.io/          ← repo root (run all commands from here)
├── src/
│   ├── assets/                 → Images processed by Astro (optimized at build)
│   ├── components/             → Reusable UI components
│   ├── content/
│   │   ├── notes/              → Your notes (Obsidian vault)
│   │   └── external/           → External link entries
│   ├── content.config.ts       → Content collection schemas
│   ├── data/                   → Static data (projects list)
│   ├── layouts/                → Page layout templates
│   ├── pages/                  → Routes (each file = a page)
│   ├── styles/                 → Global CSS
│   └── utils/                  → Helper functions
├── public/                     → Static files (fonts, favicon, CNAME)
├── tests/                      → E2E tests + benchmarks
├── _templates/                 → Example files for creating new content
├── dist/                       → Production build output (gitignored)
├── .github/workflows/          → GitHub Actions deployment
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── playwright.config.ts
├── CLAUDE.md
└── DEVELOPMENT.md              → this file
```

---

## Content collection schemas

These are defined in `src/content.config.ts`. If you want to add a new frontmatter field, update the Zod schema there.

**Notes** (`src/content/notes/*.md` or `*.mdx`):
| Field | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | yes | — |
| `description` | string | yes | — |
| `date` | date | yes | — |
| `tags` | string[] | no | `[]` |
| `draft` | boolean | no | `false` |
| `math` | boolean | no | `false` |
| `updatedDate` | date | no | — |

**External** (`src/content/external/*.md`):
| Field | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | yes | — |
| `description` | string | yes | — |
| `date` | date | yes | — |
| `url` | string (URL) | yes | — |
| `publication` | string | yes | — |
| `tags` | string[] | no | `[]` |

---

## Obsidian setup (one-time, per vault)

This applies to the Notes vault (`src/content/notes/`).

1. In Obsidian: File → Open vault → Open folder as vault → select the directory
2. When prompted, click "Trust author and enable plugins"
3. Go to Settings → Community plugins → Browse → search "Git" → Install → Enable
4. Close settings. The plugin is pre-configured:
   - Auto-commits every 5 minutes
   - Auto-pushes every 5 minutes
   - Pulls on launch
5. Done. Edits auto-sync to the site.

**Important:** Use standard markdown only. Obsidian-specific features (`[[wikilinks]]`, `![[embeds]]`, callout blocks) will not render correctly on the site.

---

## Troubleshooting

**Build fails:**
```bash
npm run build
# Read the error — usually a frontmatter issue (missing required field, bad date format)
```

**Note not showing up:**
- Check `draft` isn't set to `true`
- Make sure the file has a `.md` or `.mdx` extension
- Make sure frontmatter has all required fields (`title`, `description`, `date`)

**Obsidian Git not pushing:**
- Check the plugin is enabled (Settings → Community plugins)
- Look at the status bar at the bottom of Obsidian — it shows sync status
- Try the command palette (Cmd+P) → "Obsidian Git: Push"

**Pagefind search not working:**
- Search only works on production builds, not `npm run dev`
- Run `npm run build && npm run preview` to test it

**Fonts not loading:**
- Check that `public/fonts/` has the `.woff2` files
- Check `src/styles/global.css` `@font-face` declarations match the filenames

**Port already in use:**
- Something else is running on 4321: `lsof -ti :4321 | xargs kill -9`
