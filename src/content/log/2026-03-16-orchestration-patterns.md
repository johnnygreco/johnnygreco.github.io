---
title: "Four orchestration patterns I keep reaching for"
date: 2026-03-16
tags: ["agents", "orchestration", "architecture"]
description: "The recurring patterns in how I wire up multi-step agent workflows."
---

After building about 20 agent pipelines over the past year, I've noticed four orchestration patterns that keep recurring. Writing them down to clarify my own thinking.

**Sequential chain** — one agent's output is the next agent's input. Simple, debuggable, but slow. Use when each step genuinely depends on the previous step's full output. Example: research agent produces a report, writing agent turns it into a blog post. **Fan-out/fan-in** — split a task into independent subtasks, process in parallel, merge results. Great for batch operations like "review these 10 files" or "summarize these 5 documents." The merge step is the hard part; naive concatenation produces incoherent output. **Router** — a lightweight classifier agent examines the input and dispatches to a specialized agent. Essential when you have agents with different tools or system prompts for different task types. Keep the router model small and fast. **Iterative refinement** — an agent produces output, a critic evaluates it, and the loop continues until quality criteria are met or a max iteration count is hit. Powerful but expensive. Set aggressive exit criteria or it'll burn tokens polishing forever.

The meta-pattern: most real workflows are compositions of these four. A support ticket pipeline might route (pattern 3) to a category-specific chain (pattern 1) that fans out for information gathering (pattern 2) and iteratively refines the response (pattern 4). Naming the patterns makes it easier to reason about where failures happen and where to add observability.
