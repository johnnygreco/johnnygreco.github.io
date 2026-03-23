---
title: "SWE-bench is not enough: benchmarking code agents in the wild"
date: 2026-03-07
tags: ["evaluation", "code-generation", "benchmarks"]
description: "Why standardized coding benchmarks don't predict real-world agent performance and what to measure instead."
---

We ran our code agent against SWE-bench and got a respectable 47% resolve rate. Then we deployed it on our actual codebase and it struggled with tasks that should have been easier than the benchmark. The disconnect forced us to think carefully about what SWE-bench actually measures versus what matters in practice.

The biggest gap: SWE-bench tasks come with well-isolated test cases and clear problem descriptions. Real issues have vague descriptions ("the dashboard is slow"), require understanding cross-cutting concerns, and often don't have tests at all. Our agent would fix the literal bug described in the issue but miss the three related problems in adjacent files.

We built an internal benchmark using 50 real issues from our own repos, categorized by difficulty and type (bug fix, feature, refactor, performance). The scores look completely different from SWE-bench. Our agent excels at mechanical refactors (85% success) and simple bug fixes (70%) but falls apart on performance optimization (20%) and features requiring architectural decisions (15%). These numbers are more useful for deciding where to deploy the agent than any public benchmark.
