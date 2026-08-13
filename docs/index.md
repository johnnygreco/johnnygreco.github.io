---
title: Johnny Greco
description: Johnny Greco — AI researcher and builder.
hide:
  - navigation
  - toc
  - footer
---

<div class="home-shell">
  <section class="home-profile" aria-label="About Johnny Greco">
    <img class="home-avatar" src="assets/me.png" alt="Johnny Greco">
    <div class="profile-copy">
      <h1>Johnny Greco</h1>
      <p>AI researcher and builder</p>
      <nav class="profile-links" aria-label="Find Johnny elsewhere">
        <a href="https://github.com/johnnygreco" aria-label="GitHub" title="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .7a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.9 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.4 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .7Z"/></svg></a>
        <a href="https://linkedin.com/in/johnnygreco" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3h-17A.5.5 0 0 0 3 3.5v17c0 .3.2.5.5.5h17c.3 0 .5-.2.5-.5v-17a.5.5 0 0 0-.5-.5ZM8.3 18.3H5.6V9.7h2.7v8.6ZM7 8.5a1.6 1.6 0 1 1 0-3.1 1.6 1.6 0 0 1 0 3.1Zm11.3 9.8h-2.7v-4.2c0-1 0-2.3-1.4-2.3s-1.7 1.1-1.7 2.2v4.3H9.9V9.7h2.6v1.2c.4-.7 1.3-1.5 2.6-1.5 2.8 0 3.3 1.8 3.3 4.2v4.7Z"/></svg></a>
        <a href="https://scholar.google.com/citations?user=CDWpgoAAAAAJ" aria-label="Google Scholar" title="Google Scholar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 1 9l4 2.6V17h2v-4.1l5 3.1 11-7-11-7Zm-6 12.2V18c0 1.7 2.7 4 6 4s6-2.3 6-4v-3.8L12 18l-6-3.8Z"/></svg></a>
        <a href="mailto:jgreco.ai@gmail.com" aria-label="Email" title="Email"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z"/></svg></a>
      </nav>
    </div>
  </section>

  <section class="activity-panel" aria-labelledby="activity-heading">
    <div class="section-heading">
      <h2 id="activity-heading">Recent activity</h2>
      <span class="section-emoji" aria-hidden="true">✍️</span>
    </div>
    <div class="activity-list">
    {% for item in activity %}
      <a class="activity-item" href="{{ item.url }}"{% if item.external %} target="_blank" rel="noopener noreferrer"{% endif %}>
        <div class="activity-meta"><span>{{ item.kind }}</span><span>{{ item.source }}</span></div>
        <h3>{{ item.title }}{% if item.external %} <span aria-hidden="true">↗</span>{% endif %}</h3>
        <p>{{ item.description }}</p>
      </a>
    {% endfor %}
    </div>
    <a class="section-link" href="activity/">All activity <span aria-hidden="true">→</span></a>
  </section>

  <section class="project-spotlight" aria-labelledby="project-heading">
    <div class="section-heading">
      <h2 id="project-heading">Project spotlight</h2>
      <span class="section-emoji" aria-hidden="true">🔦</span>
    </div>
    <div class="project-stack">
    {% for project in projects %}
      <a class="project-card project-card--{{ project.accent }}{% if not loop.first %} is-hidden{% endif %}" href="{{ project.url }}" target="_blank" rel="noopener noreferrer" data-project-card>
        <img src="{{ project.image }}" alt="{{ project.name }} project preview">
        <div class="project-card-body">
          <div class="project-meta"><span>{{ project.owner }}</span><span>{{ project.language }}</span></div>
          <h3>{{ project.name }} <span aria-hidden="true">↗</span></h3>
          <p>{{ project.description }}</p>
        </div>
      </a>
    {% endfor %}
    </div>
    <a class="section-link" href="projects/">All projects <span aria-hidden="true">→</span></a>
  </section>
</div>

<script>
  (() => {
    const cards = Array.from(document.querySelectorAll('[data-project-card]'));
    if (!cards.length) return;
    const selected = Math.floor(Math.random() * cards.length);
    cards.forEach((card, index) => card.classList.toggle('is-hidden', index !== selected));
  })();
</script>
