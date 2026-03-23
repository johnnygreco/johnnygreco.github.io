---
title: "On Writing Evals"
description: "Evaluation suites are the tests of the AI world. Here's what I've learned about writing good ones."
date: 2026-03-02
tags: ["evaluation", "ai", "engineering"]
---

If you're building with LLMs and you don't have an evaluation suite, you're driving without a dashboard. You might feel like you're making progress, but you can't actually tell. You're just vibing. I've been writing evals for two years now, and here's what I wish someone had told me at the start.

**Start with failures, not successes.** Don't build an eval that confirms your system works on easy cases. Build one that reproduces the last five production failures. A good eval suite is a museum of your system's past mistakes. Every time something breaks, add a test case. Over time, this becomes an incredibly valuable regression suite that captures the actual edge cases your system encounters, not the sanitized examples from a blog post.

**Grade on a rubric, not pass/fail.** Binary evals (correct/incorrect) hide useful signal. A response that gets the right answer with wrong formatting is fundamentally different from one that hallucinates facts. Score on multiple dimensions: factual accuracy, format compliance, completeness, and relevance. The multidimensional view tells you exactly which aspect to improve. I use a 1-5 rubric per dimension with clear anchor descriptions for each score, which lets me use an LLM as a grader with reasonable inter-rater reliability.

**Version your evals like code.** Every change to your prompt, tools, or model should trigger a full eval run. Store results in a database with the commit hash and config. This lets you answer "did that prompt change actually help or did I just get lucky on the five examples I tested manually?" The answer is almost always the latter.
