---
title: "서비스"
layout: default
permalink: /services/
lang: ko
nav_key: services
alternate_url: /en/services/
body_class: services-page
---

<section class="shell page-intro compact-intro"><p class="eyebrow">제품과 리소스</p><h1>서비스.</h1></section>
<section class="shell service-list">
  {% assign services = site.data.services | sort: "order" %}
  {% for service in services %}
  <article class="service-row">
    <div class="service-monogram service-monogram-{{ service.logo_style }}" aria-hidden="true">{{ service.logo_text }}</div>
    <div class="service-info"><div class="service-title"><h2>{{ service.name_ko }}</h2><span class="status-badge"><i></i>{{ service.status_ko }}</span></div><p>{{ service.one_liner_ko }}</p></div>
    <div class="service-actions">
      {% if service.product_url %}<a href="{{ service.product_url }}" target="_blank" rel="noreferrer">열기 ↗</a>{% endif %}
      {% if service.repo_url %}<a href="{{ service.repo_url }}" target="_blank" rel="noreferrer">GitHub ↗</a>{% endif %}
      {% if service.download_url %}<a class="service-download" href="{{ service.download_url }}">다운로드 ↓</a>{% endif %}
      {% unless service.id == 'zaeze' %}<a href="{{ '/legal/' | relative_url }}#{{ service.id }}">정책 →</a>{% endunless %}
    </div>
  </article>
  {% endfor %}
</section>
