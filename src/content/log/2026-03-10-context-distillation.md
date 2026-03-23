---
title: "Context distillation for long-running tasks"
date: 2026-03-10
tags: ["agents", "context-window", "optimization"]
description: "A technique for summarizing intermediate steps so agents can work on tasks that exceed the context window."
---

Hit the context window limit on a refactoring task that required understanding 30+ files. The agent needed to read all the files, build a mental model of the dependency graph, then make coordinated changes. By file 20, early context was getting pushed out and the agent started making contradictory edits.

The solution I implemented today: context distillation checkpoints. After every 5 files, the agent pauses and writes a structured summary of what it's learned so far — key types, function signatures, dependency relationships, and planned changes. This summary replaces the raw file contents in the context, freeing up space for the next batch.

The results are promising. The agent can now handle the full 30-file refactor by working in stages, with each stage building on the distilled context from the previous one. The summaries lose some detail (you can't grep a summary for exact line numbers), so I added a "re-read" tool that lets the agent pull specific files back into context when it needs precision. The combination of distilled overview plus on-demand detail feels like how humans actually work with large codebases — you keep a mental model in your head and look up specifics as needed.
