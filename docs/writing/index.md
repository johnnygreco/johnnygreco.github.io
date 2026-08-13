---
title: Writing
description: Writing by Johnny Greco, published here and elsewhere.
hide:
  - navigation
  - toc
---

# Writing

Notes, essays, and technical writing published here and around the web.

<div class="writing-archive">
{% for item in writing %}
  <a class="archive-item" href="{% if item.external %}{{ item.url }}{% else %}../{{ item.url }}{% endif %}"{% if item.external %} target="_blank" rel="noopener noreferrer"{% endif %}>
    <div>
      <span class="archive-source">{{ item.source }}</span>
      <h2>{{ item.title }}{% if item.external %} <span aria-hidden="true">↗</span>{% endif %}</h2>
      <p>{{ item.description }}</p>
    </div>
    <time>{{ item.date }}</time>
  </a>
{% endfor %}
</div>
