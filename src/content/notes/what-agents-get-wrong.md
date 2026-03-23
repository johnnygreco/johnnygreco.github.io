---
title: "What AI Agents Still Get Wrong"
description: "An honest look at the failure modes I see daily when building agentic systems, and why we're further from AGI than the demos suggest."
date: 2026-02-05
tags: ["agents", "ai", "opinion"]
---

I build AI agent systems for a living, and I think the public discourse is about two years ahead of the actual capability. The demos are incredible. The production deployments are... humbling. Here are the failure modes I see most often.

**Planning over long horizons.** Agents are great at tasks that take 1-5 steps. They're decent at 5-15 steps. Beyond 15 steps, they start losing the thread — forgetting constraints, repeating work, or drifting from the original goal. This isn't a context window problem; it's a planning problem. Humans hold a mental model of the full plan and adapt it on the fly. Current agents execute step by step and hope the next step is obvious from the current state.

**Knowing when to stop.** An agent will happily keep refining, researching, or iterating forever unless you give it explicit stopping criteria. This sounds like a minor issue until you see the bill for an agent that spent 45 minutes "perfecting" a function that was correct after the first edit. Worse, aggressive stopping criteria cause premature termination on hard tasks. Finding the right balance is one of the hardest UX problems in agentic systems.

**Recovering from wrong assumptions.** When an agent makes an incorrect assumption early in a task (e.g., "this codebase uses React" when it's actually Vue), it rarely questions that assumption later even when evidence contradicts it. Humans do this too, but we have a self-awareness that says "wait, something doesn't add up." Agents lack that metacognitive check. Building it in — via explicit reflection steps or contradiction detection — is where I think the next big quality gains will come from.
