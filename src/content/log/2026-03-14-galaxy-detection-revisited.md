---
title: "Revisiting galaxy detection with modern vision models"
date: 2026-03-14
tags: ["astronomy", "computer-vision", "deep-learning"]
description: "Testing whether current vision-language models can detect ultra-diffuse galaxies that my PhD pipeline was designed to find."
---

Nostalgia project today. I fed some of the deep imaging data from my PhD into a modern vision-language model and asked it to identify ultra-diffuse galaxies. For context, my PhD pipeline (hugs) used a carefully tuned combination of SExtractor, wavelet filtering, and random forest classification. It took me two years to build.

The vision model found about 70% of the known UDGs in the test field after some prompt engineering ("identify faint, extended, low surface brightness objects that are not artifacts or background galaxies"). It also flagged a bunch of false positives — scattered light halos, satellite trails, and one very confused identification of a bright star's diffraction spikes as "an unusual elongated galaxy."

The interesting finding: the model's failures are completely different from the traditional pipeline's failures. My pipeline missed UDGs near bright stars (because the background subtraction went wrong). The vision model handles those fine but struggles with UDGs in crowded fields where it can't distinguish the faint galaxy from the overlapping background sources. A hybrid approach — using the vision model as a second opinion on the traditional pipeline's candidates — could meaningfully improve completeness. Maybe there's a paper in this.
