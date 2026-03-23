---
title: "The Telescope Operator Problem"
description: "What professional telescope operators taught me about human-AI collaboration and the danger of full automation."
date: 2026-02-28
tags: ["astronomy", "automation", "human-ai"]
---

During my PhD, I spent a lot of nights at the telescope. Not all observatories are fully remote — some still have human operators who physically manage the instrument while astronomers direct the observations. I used to think these operators would eventually be automated away. Now I'm not so sure, and the reason is relevant to AI agent design.

The best operators did something no automated system could: they noticed when things were subtly wrong. The guiding camera showed slightly elongated stars — not enough to trigger an alarm, but enough that an experienced operator would check the mirror support. The humidity was rising faster than the forecast predicted — time to close the dome 30 minutes early rather than risk condensation on the optics. These judgment calls came from years of embodied experience with a specific instrument's quirks.

This maps directly to agent-assisted workflows. The temptation is to fully automate: let the agent handle everything end-to-end. But the most effective pattern I've seen is what I call "operator mode" — the agent does the heavy lifting while a human monitors for the subtle wrongness that doesn't trigger any explicit check. The human doesn't need to understand every step, just like the telescope operator doesn't need to understand the science. They need to recognize when the instrument is behaving unusually. We should be building agent UIs that support this kind of ambient monitoring, not dashboards that demand constant attention.
