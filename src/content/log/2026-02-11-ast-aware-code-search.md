---
title: "AST-aware code search for agents"
date: 2026-02-11
tags: ["developer-tools", "code-search", "ast"]
description: "Building a code search tool that understands syntax structure, not just text patterns."
---

Standard text search (grep, ripgrep) is what most code agents use to navigate codebases, but it has a fundamental limitation: it doesn't understand code structure. Searching for "handleError" returns every comment, string literal, and import statement that mentions it, not just the function definition and its call sites. Today I built an AST-aware search tool that lets agents query code structurally.

The tool parses source files into ASTs using tree-sitter, then indexes them by node type and identifier. An agent can now ask "find all function definitions named handleError" or "find all calls to fetch where the first argument is a template literal." These structural queries are impossible with text search and dramatically reduce the noise an agent has to sift through.

Performance was a concern — parsing every file into an AST is expensive — but tree-sitter is remarkably fast. Indexing a 50,000-file TypeScript codebase takes about 8 seconds, and queries return in under 100ms. The agent's code navigation accuracy improved by 30% on our internal benchmark when given the AST search tool alongside standard text search. It naturally learns to use text search for quick lookups and AST search when it needs precision.
