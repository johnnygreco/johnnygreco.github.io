---
title: "Ablation study on tool descriptions"
date: 2026-03-12
tags: ["tool-use", "evaluation", "prompt-engineering"]
description: "Systematically testing which parts of a tool description actually matter for correct tool selection."
---

Ran a structured ablation study on tool descriptions today. The question: when an agent has 20+ tools available, which parts of the tool description most influence correct selection? I took our production tool suite, systematically removed or degraded parts of each description, and measured selection accuracy.

The ranking, from most to least important: (1) the one-line summary, (2) parameter descriptions, (3) example invocations, (4) the detailed description paragraph, (5) the tool name itself. This was counterintuitive — I expected the tool name to matter more. But when you have tools like `search_code`, `search_docs`, and `search_web`, the name alone is ambiguous. The one-line summary is what disambiguates.

The practical takeaway: invest your token budget in crisp one-line summaries and clear parameter descriptions. Lengthy prose explanations of when to use each tool add tokens but barely move the needle. Example invocations help, but only when the tool has non-obvious parameter formats (like date ranges or regex patterns). I rewrote all our tool descriptions based on these findings and saw a 8% improvement in selection accuracy across the board.
