---
title: "Running evals on local models with Ollama"
date: 2026-03-18
tags: ["evaluation", "local-models", "ollama"]
description: "Setting up a local evaluation loop to test open-weight models before committing to API costs."
---

Set up an evaluation pipeline that runs entirely locally using Ollama. The motivation: I want to test whether open-weight models can handle our simpler agent tasks before committing to API costs for the full workload. Running evals against an API is expensive when you're iterating on prompts and want fast feedback loops.

The setup is straightforward — Ollama serves the model, a Python script sends the eval suite, and results get logged to a SQLite database for comparison across runs. The tricky part was getting Apple Silicon GPU acceleration working reliably. Ollama handles it automatically for most models, but the 70B quantized models sometimes OOM on my M3 Max with 64GB. Learned to check `ollama ps` for memory usage before starting a big eval run.

The headline results: Llama 3.3 70B (Q4 quantized) handles our tool-selection benchmark at 82% accuracy versus 94% for the frontier API model. That's a meaningful gap for complex tasks, but for our simple classification and extraction pipelines, the local model is within 3 points. The latency is actually better for short prompts since there's no network round-trip. I'm going to start routing our lowest-complexity tasks to the local model and see if the cost savings justify the slight accuracy drop.
