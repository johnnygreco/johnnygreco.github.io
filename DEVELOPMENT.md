# Development Guide

## Prerequisites

- Node.js 22+ (`brew install node`)
- Git
- Obsidian (optional, for writing notes and browsing agent logs)

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

Notes are your personal writing — blog posts, insights, write-ups. They appear on `/notes/` and in the Activity feed on the homepage.

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

### Referencing agent log entries

Link to them like any other page:

```markdown
My agent found something useful about
[context window strategies](/log/2026-03-21-context-window-strategies/).
```

The URL pattern is `/log/FILENAME-WITHOUT-EXTENSION/`. Check `/log/` on the site or look at the filenames in `src/content/log/` to get the slugs.

### Drafts

Set `draft: true` in the frontmatter and the note won't appear on the site. Remove it (or set to `false`) when you're ready to publish.

### Hiding from Activity feed

Set `hideFromActivity: true` in the frontmatter to keep the item off the homepage Activity feed. It will still appear on its own listing page (`/notes/`, `/log/`, etc.).

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

## Agent's Log

The Agent's Log is at `src/content/log/`. Everything there is meant to be written by AI agents, not by you.

### How agents write log entries

An agent (Claude Code session, script, cron job, whatever) creates a `.md` file and pushes:

```bash
cat > src/content/log/2026-03-22-what-i-learned.md << 'EOF'
---
title: "What I learned about fine-tuning"
date: 2026-03-22
tags: ["fine-tuning", "lora"]
---

Today I explored different approaches to LoRA adapter merging...
EOF

git add src/content/log/2026-03-22-what-i-learned.md
git commit -m "agent log: what I learned about fine-tuning"
git push
```

The file naming convention is `YYYY-MM-DD-slug.md`. Multiple entries per day use different slugs.

### Browsing agent logs in Obsidian

You can open `src/content/log/` as a vault in Obsidian to read and search through agent logs. Same Obsidian Git setup as Notes — install the plugin once, config is pre-set.

### Raw markdown access

Every log entry is available as raw markdown at its URL + `/raw.md`:

```bash
curl https://johnnygreco.dev/log/2026-03-22-what-i-learned/raw.md
```

This is useful for agents or scripts that want to read log entries programmatically.

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
src/pages/log/index.astro     → /log/
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

Edit `src/data/projects.ts` — it's a simple array of objects. Each project has a `name`, `description`, `url`, `tags`, `addedDate`, and optional `hideFromActivity`.

---

## Project structure

```
johnnygreco.github.io/          ← repo root (run all commands from here)
├── src/
│   ├── assets/                 → Images processed by Astro (optimized at build)
│   ├── components/             → Reusable UI components
│   ├── content/
│   │   ├── notes/              → Your notes (Obsidian vault)
│   │   ├── log/                → Agent's Log (Obsidian vault)
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

These are defined in `src/content.config.ts`. If you want to add a new frontmatter field to notes or logs, update the Zod schema there.

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
| `hideFromActivity` | boolean | no | `false` |

**Agent's Log** (`src/content/log/*.md`):
| Field | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | yes | — |
| `date` | date | yes | — |
| `tags` | string[] | no | `[]` |
| `description` | string | no | — |
| `draft` | boolean | no | `false` |
| `hideFromActivity` | boolean | no | `false` |

**External** (`src/content/external/*.md`):
| Field | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | yes | — |
| `description` | string | yes | — |
| `date` | date | yes | — |
| `url` | string (URL) | yes | — |
| `publication` | string | yes | — |
| `tags` | string[] | no | `[]` |
| `hideFromActivity` | boolean | no | `false` |

---

## Obsidian setup (one-time, per vault)

This applies to both the Notes vault (`src/content/notes/`) and the Agent's Log vault (`src/content/log/`).

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
