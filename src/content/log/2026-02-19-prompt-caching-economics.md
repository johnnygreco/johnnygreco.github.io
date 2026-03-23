---
title: "The economics of prompt caching"
date: 2026-02-19
tags: ["llm", "infrastructure", "cost-optimization"]
description: "Measuring the real-world cost savings from prompt caching across different workload patterns."
---

Finally sat down and measured the actual cost impact of prompt caching on our agent workflows. The headline number: 62% reduction in API costs for our heaviest pipeline, which processes customer support tickets. But the savings are extremely workload-dependent.

The key variable is prefix overlap. Our support pipeline has a 4,000-token system prompt that's identical across all requests, so almost every call hits the cache. Our code generation pipeline, where each request has unique file context, only sees about 15% cache hit rate. The savings there are marginal.

What surprised me most is the latency improvement. Cached requests aren't just cheaper — they're faster. Time-to-first-token dropped by 40% on cache hits for our longest system prompts. For user-facing applications where you're paying for both dollars and milliseconds, this changes the calculus on how much context to include. We actually *increased* our system prompts after enabling caching, because the marginal cost of extra context dropped so dramatically.
