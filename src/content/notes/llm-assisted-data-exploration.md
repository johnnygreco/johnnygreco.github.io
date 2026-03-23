---
title: "LLM-Assisted Data Exploration"
description: "Using language models as a conversational interface to unfamiliar datasets, and where this approach breaks down."
date: 2026-03-18
tags: ["ai", "data-science", "python"]
---

I've been experimenting with a workflow where I point a language model at a new dataset and have a conversation about it before writing any analysis code. "What are the columns? What does the distribution of column X look like? Are there obvious correlations?" The model writes and executes the exploratory code, shows me the results, and I steer with follow-up questions.

This is dramatically faster than my old workflow of writing pandas one-liners in a Jupyter notebook, but it has a subtle failure mode: the model can confidently describe patterns that aren't actually there. I asked about the relationship between two columns and the model generated a scatter plot, fit a trend line, and reported a "moderate positive correlation" — which was technically true (r=0.3) but meaningfully driven by three outliers. When I removed them, the correlation vanished. A human data scientist would have spotted the outliers visually. The model just ran the math.

The fix I've settled on is a hybrid approach. Use the LLM for the mechanical parts — loading data, generating plots, computing summary statistics — but always eyeball the visualizations myself. The model is an excellent research assistant for data exploration, but a poor substitute for domain intuition. This is especially true when working with scientific data where subtle systematics (calibration errors, selection biases) can masquerade as real signals. The model doesn't know about your instrument's quirks. You do.
