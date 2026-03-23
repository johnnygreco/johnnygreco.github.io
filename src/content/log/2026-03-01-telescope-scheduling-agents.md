---
title: "Could agents schedule telescope observations?"
date: 2026-03-01
tags: ["astronomy", "agents", "scheduling"]
description: "Exploring whether LLM-based agents could handle the constraint-satisfaction problem of telescope queue scheduling."
---

A conversation with a former colleague got me thinking: telescope observation scheduling is essentially a constraint-satisfaction problem with soft preferences. You have weather windows, target visibility, instrument configurations, and PI priority rankings. Current systems use hand-tuned heuristics or integer programming. Could an agent do better?

I sketched out a prototype where an LLM agent receives the night's constraints (targets above horizon, weather forecast, instrument status) and proposes an observation sequence. The agent has access to tools for checking target altitude, estimating exposure times, and querying the archive for existing coverage. It outputs a ranked schedule with justifications.

Early results on synthetic data are mixed. The agent produces valid schedules — it respects hard constraints like "don't observe below 30 degrees altitude" — but it's worse than the integer programming baseline at optimizing total science return. Where it shines is handling the messy edge cases that break rigid optimizers: "the PI emailed saying they'd accept partial coverage" or "clouds are rolling in from the west, should we switch to a bright-time program early?" Those judgment calls are where the agent actually adds value over traditional scheduling.
