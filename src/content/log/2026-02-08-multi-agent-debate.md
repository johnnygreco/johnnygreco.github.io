---
title: "Multi-agent debate for code review"
date: 2026-02-08
tags: ["agents", "code-review", "multi-agent"]
description: "Testing whether two agents arguing over a pull request catch more bugs than one agent reviewing alone."
---

Ran an experiment today: instead of having a single agent review pull requests, I set up a two-agent debate where one plays the role of advocate (argues the code is correct) and the other plays critic (finds problems). The results were surprisingly clear.

The debate setup caught 40% more logic errors than the single-agent baseline, especially in edge cases around error handling and concurrency. The advocate agent, forced to defend the code, would sometimes realize mid-argument that it couldn't actually justify a particular design choice — which is exactly how human code review works at its best.

The downsides are real though. It takes 3x longer, costs 3x more in tokens, and occasionally the agents get stuck in a loop arguing about stylistic preferences that don't matter. I added a "mediator" prompt that steps in after 3 rounds to force a verdict. Next step is running this on a larger corpus of real PRs to see if the bug-catch rate holds up outside my curated test set.
