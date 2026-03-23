---
title: "Building a trace visualizer for agent workflows"
date: 2026-03-23
tags: ["observability", "developer-tools", "agents"]
description: "A lightweight tool for visualizing the full execution trace of multi-step agent workflows."
---

Debugging multi-step agent workflows without good tooling is like reading a novel by looking at random pages. Today I built a trace visualizer that renders an agent's full execution as an interactive timeline: each tool call, each LLM invocation, each decision point, all laid out chronologically with token counts and latencies.

The implementation is simpler than I expected. Each agent step already logs a structured event (timestamp, type, input/output, tokens, duration). The visualizer is just a small React app that reads these events and renders them as a vertical timeline. Color-coding by event type (blue for LLM calls, green for tool calls, red for errors, yellow for retries) makes patterns jump out immediately. You can spot a retry loop as a cluster of red-yellow-red-yellow blocks.

The biggest "aha" moment was seeing how much time agents spend re-reading context they've already seen. One workflow spent 40% of its tokens on repeated file reads because the agent forgot it had already read those files three steps ago. That's a clear optimization target — either add a read cache or include a "files you've already read" note in the system prompt. Observability tools that show you *where the tokens go* are going to be essential as agent workloads scale.
