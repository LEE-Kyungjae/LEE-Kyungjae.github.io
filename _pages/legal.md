---
title: "법적 문서"
layout: single
permalink: /legal/
classes: wide
---

<section class="legal-intro">
  <p>서비스별 <strong>개인정보처리방침</strong>과 <strong>이용약관</strong>을 최신 기준으로 제공합니다.</p>
</section>

<section class="legal-section">
  <h2>서비스별 문서</h2>
  <div class="legal-grid">
    {% assign services = site.data.services | sort: "order" %}
    {% for service in services %}
      {% assign privacy_doc = site.legal | where: "service_name", service.id | where: "doc_type", "privacy" | first %}
      {% assign terms_doc = site.legal | where: "service_name", service.id | where: "doc_type", "terms" | first %}
      <article class="legal-card">
        <div class="legal-card__top">
          <div class="service-card__logo service-card__logo--{{ service.logo_style | default: 'indigo' }}" aria-hidden="true">
            {{ service.logo_text | default: service.name | upcase | truncate: 2, '' }}
          </div>
          <div class="legal-card__heading">
            <h3>{{ service.name }}</h3>
            <p>{{ service.one_liner }}</p>
          </div>
        </div>
        <div class="legal-doc-list">
          <a class="btn btn--inverse" href="{% if privacy_doc %}{{ privacy_doc.url | relative_url }}{% else %}#{% endif %}">
            개인정보처리방침
          </a>
          <small>{% if privacy_doc %}최종 수정: {{ privacy_doc.last_updated }}{% else %}문서 준비 중{% endif %}</small>
          <a class="btn btn--inverse" href="{% if terms_doc %}{{ terms_doc.url | relative_url }}{% else %}#{% endif %}">
            이용약관
          </a>
          <small>{% if terms_doc %}최종 수정: {{ terms_doc.last_updated }}{% else %}문서 준비 중{% endif %}</small>
        </div>
      </article>
    {% endfor %}
  </div>
</section>

{% assign common_privacy = site.legal | where: "service_name", "공통" | where: "doc_type", "privacy" | first %}
{% assign common_terms = site.legal | where: "service_name", "공통" | where: "doc_type", "terms" | first %}

<section class="legal-section">
  <h2>공통 문서</h2>
  <div class="legal-common">
    <a class="legal-common__item" href="{% if common_privacy %}{{ common_privacy.url | relative_url }}{% else %}#{% endif %}">
      <strong>개인정보처리방침(공통)</strong>
      <span>{% if common_privacy %}최종 수정: {{ common_privacy.last_updated }}{% else %}문서 준비 중{% endif %}</span>
    </a>
    <a class="legal-common__item" href="{% if common_terms %}{{ common_terms.url | relative_url }}{% else %}#{% endif %}">
      <strong>이용약관(공통)</strong>
      <span>{% if common_terms %}최종 수정: {{ common_terms.last_updated }}{% else %}문서 준비 중{% endif %}</span>
    </a>
  </div>
</section>
