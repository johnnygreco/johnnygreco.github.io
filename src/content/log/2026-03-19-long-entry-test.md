---
title: "Deep dive into multi-agent orchestration patterns"
date: 2026-03-19
tags: ["agents", "architecture", "orchestration"]
---

Today I spent a full session exploring different patterns for orchestrating multiple AI agents working together on complex tasks. This is a comprehensive writeup of what I found.

## The problem

When you have a single agent, control flow is straightforward: the agent receives a task, uses tools, and returns a result. But when you need multiple agents collaborating — each with different capabilities, different contexts, and potentially different models — the orchestration layer becomes the hardest part.

## Pattern 1: Sequential pipeline

The simplest pattern. Agent A produces output, which becomes Agent B's input, which feeds Agent C.

```
Task → Agent A → Agent B → Agent C → Result
```

**Pros:** Easy to reason about, easy to debug, clear data flow.
**Cons:** Slow (no parallelism), brittle (one failure stops everything), no feedback loops.

**When to use:** Data transformation pipelines, ETL-like workflows, document processing chains.

## Pattern 2: Parallel fan-out / fan-in

Split the task into independent subtasks, run them in parallel, then merge results.

```
         ┌→ Agent A ─┐
Task ────┼→ Agent B ──┼→ Merge → Result
         └→ Agent C ─┘
```

**Pros:** Fast (parallel execution), fault-tolerant (one agent failing doesn't block others).
**Cons:** Merging results is hard, subtasks must be truly independent.

**When to use:** Research tasks (search multiple sources), code review (check style, security, performance in parallel), multi-perspective analysis.

## Pattern 3: Supervisor / worker

A supervisor agent breaks down the task, delegates to workers, reviews their output, and iterates.

**Pros:** Adaptive (supervisor can re-route based on intermediate results), handles complex multi-step tasks.
**Cons:** The supervisor is a single point of failure, can be expensive (supervisor sees all context).

**When to use:** Complex open-ended tasks, project-level work, tasks requiring judgment about what to do next.

## Pattern 4: Debate / adversarial

Two or more agents argue opposing positions, with a judge agent selecting the best answer.

**Pros:** Catches errors, produces more robust outputs, explores the solution space more thoroughly.
**Cons:** Expensive (3x the compute), slower, can get stuck in loops.

**When to use:** Critical decisions, code with security implications, factual claims that need verification.

## Pattern 5: Blackboard

Agents share a common workspace (the "blackboard") and contribute to it asynchronously. Each agent watches the blackboard for changes relevant to its expertise and contributes when appropriate.

**Pros:** Highly flexible, agents are loosely coupled, easy to add/remove agents.
**Cons:** Complex coordination, potential for conflicts, hard to guarantee completion.

**When to use:** Long-running collaborative tasks, knowledge synthesis, complex problem-solving where the full approach isn't known upfront.

## My takeaways

After testing all five patterns, I've settled on a hybrid approach for most of my work:

1. **Default to supervisor/worker** for complex tasks
2. **Use fan-out/fan-in** for well-defined subtasks within the supervisor pattern
3. **Add a debate layer** for high-stakes decisions
4. **Never use pure sequential** unless the pipeline is truly linear

The key insight is that the orchestration pattern should match the task structure, not the other way around. Don't pick a pattern and force your task into it.

## Code example

Here's a simplified orchestrator in Python:

```python
class Orchestrator:
    def __init__(self, supervisor, workers):
        self.supervisor = supervisor
        self.workers = workers

    async def run(self, task):
        plan = await self.supervisor.plan(task)
        results = await asyncio.gather(*[
            self.workers[step.agent].execute(step)
            for step in plan.steps
            if not step.depends_on
        ])
        return await self.supervisor.synthesize(results)
```

This is still a work in progress. Tomorrow I want to test this with real tool-calling agents and measure the quality/cost tradeoffs of each pattern.
