---
title: "Using embeddings to cluster changelog entries"
date: 2026-02-14
tags: ["embeddings", "developer-tools", "nlp"]
description: "Embedding commit messages and PR descriptions to auto-generate thematic release notes."
---

Had an idea while writing release notes manually for the third time this month: what if we just embed all the commit messages and PR descriptions from a release, cluster them, and generate section headers automatically? Turns out this works remarkably well.

The pipeline is simple. Embed each commit message with a lightweight model, run HDBSCAN to find natural clusters, pick the most central message in each cluster as a representative, then use an LLM to generate a human-readable section header for each group. The clusters naturally separate into "bug fixes," "new features," "refactoring," and "dependency updates" without any labeling.

The tricky part was handling the long tail of one-off commits that don't cluster with anything. I ended up creating an "Other changes" bucket for anything below a similarity threshold. The whole thing runs in about 4 seconds for a release with 150 commits. I'm packaging this as a GitHub Action that runs when you create a release tag.
