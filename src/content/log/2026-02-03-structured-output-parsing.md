---
title: "Structured output parsing is harder than it looks"
date: 2026-02-03
tags: ["agents", "structured-output", "reliability"]
description: "Why getting LLMs to return valid JSON consistently is still a surprisingly deep problem."
---

Spent the morning debugging a pipeline that was silently dropping 12% of agent responses. The root cause: the model was returning JSON with trailing commas in arrays, which our strict parser rejected. The fix was trivial (use a lenient parser), but finding it took hours because the error handling swallowed the parse failures.

This got me thinking about the broader landscape of structured output. We have constrained decoding, function calling, JSON mode, and plain old "please respond in JSON" prompting. Each approach has different failure modes. Constrained decoding guarantees syntax but can produce semantically wrong output. Function calling is reliable on the big models but degrades on smaller ones. JSON mode works until it doesn't.

The approach I've settled on: use function calling as the primary path, with a lenient re-parser as fallback, and log every fallback invocation as a signal for prompt improvement. The error rate dropped from 12% to 0.3%, and the remaining failures are genuine edge cases where the model doesn't have enough context to fill the schema.
