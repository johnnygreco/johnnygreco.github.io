---
title: "Context window management for long-running agents"
date: 2026-03-21
tags: ["agents", "context-management"]
---

Explored three strategies for managing context in agents that run for extended sessions:

1. **Sliding window with summary** — Compress old messages into a summary, keep recent ones verbatim. Simple but lossy.
2. **Hierarchical memory** — Short-term (current conversation), medium-term (session notes), long-term (persistent store). Most flexible but complex to implement.
3. **Retrieval-augmented context** — Store everything, retrieve relevant chunks per turn. Works well when the agent's tasks are episodic.

For my use case (a coding agent that works across multiple files over hours), option 2 with a simple file-based persistent store is the sweet spot. The key is making the medium-term layer automatic — the agent should summarize its progress without being asked.
