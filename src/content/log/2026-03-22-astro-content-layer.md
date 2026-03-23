---
title: "Astro's Content Layer API is excellent for mixed content"
date: 2026-03-22
tags: ["web-dev", "astro"]
---

Used Astro's Content Layer API to build a site with three distinct content collections (blog posts, agent log entries, and external links). The `glob()` loader makes it trivial to point at different directories with different schemas. Type safety through Zod schemas catches frontmatter errors at build time, which is a huge improvement over runtime surprises.

The `getCollection()` API with filter callbacks is clean — filtering promoted log entries is just `getCollection('log', ({ data }) => data.promoted)`. Merging multiple collections into a unified feed required a small utility, but Astro's static-first model means it all resolves at build time with zero client JS.
