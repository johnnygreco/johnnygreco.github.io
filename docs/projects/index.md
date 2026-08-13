---
title: Projects
description: Selected projects from Johnny Greco.
hide:
  - navigation
  - toc
---

# Projects

Research, open-source tools, and experiments I’ve helped build.

<div class="projects-grid">
{% for project in projects %}
  <a class="project-index-card" href="{{ project.url }}" target="_blank" rel="noopener noreferrer">
    <img src="../{{ project.image }}" alt="{{ project.name }} project preview">
    <div>
      <span>{{ project.owner }} · {{ project.language }}</span>
      <h2>{{ project.name }} <span aria-hidden="true">↗</span></h2>
      <p>{{ project.description }}</p>
    </div>
  </a>
{% endfor %}
</div>
