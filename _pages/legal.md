---
title: "운영 정책"
layout: default
permalink: /legal/
lang: ko
nav_key: legal
alternate_url: /en/legal/
body_class: legal-page
---

<section class="shell page-intro compact-intro"><p class="eyebrow">서비스 정책</p><h1>정책.</h1></section>
<section class="shell policy-list">
  {% assign services = site.data.services | sort: "order" %}
  {% for service in services %}{% unless service.id == 'zaeze' %}
  {% assign privacy_doc = site.legal | where: "service_name", service.id | where: "doc_type", "privacy" | where: "lang", "ko" | first %}
  {% assign terms_doc = site.legal | where: "service_name", service.id | where: "doc_type", "terms" | where: "lang", "ko" | first %}
  <article class="policy-row" id="{{ service.id }}"><div><p class="policy-label">서비스</p><h2>{{ service.name_ko }}</h2></div><div class="policy-links">{% if privacy_doc %}<a href="{{ privacy_doc.url | relative_url }}"><span>개인정보처리방침</span><small>{{ privacy_doc.last_updated }}</small><b aria-hidden="true">→</b></a>{% endif %}{% if terms_doc %}<a href="{{ terms_doc.url | relative_url }}"><span>이용약관</span><small>{{ terms_doc.last_updated }}</small><b aria-hidden="true">→</b></a>{% endif %}</div></article>
  {% endunless %}{% endfor %}
  {% assign common_privacy = site.legal | where: "service_name", "공통" | where: "doc_type", "privacy" | where: "lang", "ko" | first %}
  {% assign common_terms = site.legal | where: "service_name", "공통" | where: "doc_type", "terms" | where: "lang", "ko" | first %}
  <article class="policy-row" id="common"><div><p class="policy-label">공통</p><h2>공통 정책</h2></div><div class="policy-links">{% if common_privacy %}<a href="{{ common_privacy.url | relative_url }}"><span>개인정보처리방침</span><small>{{ common_privacy.last_updated }}</small><b aria-hidden="true">→</b></a>{% endif %}{% if common_terms %}<a href="{{ common_terms.url | relative_url }}"><span>이용약관</span><small>{{ common_terms.last_updated }}</small><b aria-hidden="true">→</b></a>{% endif %}</div></article>
</section>
