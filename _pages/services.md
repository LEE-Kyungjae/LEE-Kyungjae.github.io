---
title: "Services"
layout: default
permalink: /services/
body_class: services-page
---

<section class="shell page-intro compact-intro">
  <p class="eyebrow">Products & resources</p>
  <h1>Services.</h1>
</section>

<section class="shell service-list">
  {% assign services = site.data.services | sort: "order" %}
  {% for service in services %}
  <article class="service-row">
    <div class="service-monogram service-monogram-{{ service.logo_style }}" aria-hidden="true">{{ service.logo_text }}</div>
    <div class="service-info">
      <div class="service-title">
        <h2>{{ service.name }}</h2>
        <span class="status-badge status-{{ service.status | downcase }}"><i></i>{{ service.status }}</span>
      </div>
      <p>{{ service.one_liner }}</p>
    </div>
    <div class="service-actions">
      {% if service.repo_url %}<a href="{{ service.repo_url }}" target="_blank" rel="noreferrer">GitHub ↗</a>{% endif %}
      {% if service.download_url %}<a class="service-download" href="{{ service.download_url }}">Download ↓</a>{% endif %}
      <a href="{{ '/legal/' | relative_url }}#{{ service.id }}">Policy →</a>
    </div>
  </article>
  {% endfor %}
</section>
