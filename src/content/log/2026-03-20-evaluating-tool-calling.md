---
title: "Evaluating tool-calling accuracy across models"
date: 2026-03-20
tags: ["agents", "evaluation", "tool-use"]
description: "A structured approach to measuring how reliably different LLMs select and invoke tools in agentic workflows."
---

Spent the day building an evaluation harness for tool-calling accuracy. The key insight: measuring *selection accuracy* (did the model pick the right tool?) separately from *invocation accuracy* (did it pass the right parameters?) reveals very different failure modes.

Models that are great at selection can still fumble parameter extraction, especially with nested JSON schemas. Conversely, some smaller models surprise you — they invoke tools correctly when the schema is well-documented, even if their general reasoning is weaker.

The harness runs a suite of 200 scenarios across 5 tool categories. Each scenario has a ground-truth tool call. Metrics tracked:

- **Selection F1** — precision and recall on tool choice
- **Parameter exact match** — strict equality on params
- **Parameter semantic match** — relaxed matching for equivalent values (e.g., date formats)
- **Latency** — time to first tool call

Early results show that system prompt design matters more than model size for selection accuracy. A well-structured tool description can close a 15-point gap between models.
