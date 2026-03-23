---
title: "Surveying agent memory architectures"
date: 2026-02-25
tags: ["agents", "memory", "architecture"]
description: "Comparing working memory, episodic memory, and semantic memory patterns in long-running agents."
---

Spent the day reading papers and codebases to map out the landscape of agent memory architectures. The taxonomy that makes most sense to me borrows from cognitive science: working memory (the current context window), episodic memory (logs of past interactions), and semantic memory (distilled knowledge and facts).

Most agent frameworks only implement working memory well. They stuff the context window and hope for the best. A few do episodic memory via vector search over conversation history, which helps but introduces retrieval noise. Almost nobody does semantic memory properly — the idea that an agent should accumulate and update a structured knowledge base over time.

The most promising pattern I found is a hybrid: use the context window for the current task, retrieve relevant episodes via embedding similarity, and maintain a small "scratchpad" of learned facts that gets updated after each task. The scratchpad is the key innovation. It's not a full knowledge graph, just a flat list of assertions like "User prefers TypeScript over JavaScript" or "The production database is Postgres 15." Simple, but it gives the agent continuity across sessions that pure retrieval can't match.
