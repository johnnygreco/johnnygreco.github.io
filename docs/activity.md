---
title: Activity
description: Recent writing, research, and projects from Johnny Greco.
hide:
  - navigation
  - toc
---

# Activity

Recent writing, research, and things I’m building.

<div class="activity-archive">
{% for item in activity %}
  <a class="archive-item" href="{{ item.url }}"{% if item.external %} target="_blank" rel="noopener noreferrer"{% endif %}>
    <div>
      <span class="archive-source">{{ item.kind }} · {{ item.source }}</span>
      <h2>{{ item.title }}{% if item.external %} <span aria-hidden="true">↗</span>{% endif %}</h2>
      <p>{{ item.description }}</p>
    </div>
  </a>
{% endfor %}
</div>
