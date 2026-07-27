---
title: "Legal"
layout: default
permalink: /legal/
body_class: legal-page
---

<section class="shell page-intro compact-intro">
  <p class="eyebrow">Policies</p>
  <h1>Legal.</h1>
</section>

<section class="shell policy-list">
  {% assign services = site.data.services | sort: "order" %}
  {% for service in services %}
  {% assign privacy_doc = site.legal | where: "service_name", service.id | where: "doc_type", "privacy" | first %}
  {% assign terms_doc = site.legal | where: "service_name", service.id | where: "doc_type", "terms" | first %}
  <article class="policy-row" id="{{ service.id }}">
    <div>
      <p class="policy-label">Service</p>
      <h2>{{ service.name }}</h2>
    </div>
    <div class="policy-links">
      {% if privacy_doc %}<a href="{{ privacy_doc.url | relative_url }}"><span>Privacy</span><small>{{ privacy_doc.last_updated }}</small><b aria-hidden="true">→</b></a>{% endif %}
      {% if terms_doc %}<a href="{{ terms_doc.url | relative_url }}"><span>Terms</span><small>{{ terms_doc.last_updated }}</small><b aria-hidden="true">→</b></a>{% endif %}
    </div>
  </article>
  {% endfor %}

  {% assign common_privacy = site.legal | where: "service_name", "공통" | where: "doc_type", "privacy" | first %}
  {% assign common_terms = site.legal | where: "service_name", "공통" | where: "doc_type", "terms" | first %}
  <article class="policy-row" id="common">
    <div>
      <p class="policy-label">Shared</p>
      <h2>Common</h2>
    </div>
    <div class="policy-links">
      {% if common_privacy %}<a href="{{ common_privacy.url | relative_url }}"><span>Privacy</span><small>{{ common_privacy.last_updated }}</small><b aria-hidden="true">→</b></a>{% endif %}
      {% if common_terms %}<a href="{{ common_terms.url | relative_url }}"><span>Terms</span><small>{{ common_terms.last_updated }}</small><b aria-hidden="true">→</b></a>{% endif %}
    </div>
  </article>
</section>
