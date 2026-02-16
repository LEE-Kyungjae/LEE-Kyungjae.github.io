---
title: "법적 문서"
layout: single
permalink: /legal/
classes: wide
---

서비스별 `개인정보처리방침`과 `이용약관`의 최신 문서를 제공합니다.

## 서비스별 정책 문서

| 서비스 | 개인정보처리방침 | 이용약관 | 다운로드 |
| --- | --- | --- | --- |
{% assign services = site.data.services | sort: "order" %}
{% for service in services %}
{% assign privacy_doc = site.legal | where: "service_name", service.id | where: "doc_type", "privacy" | first %}
{% assign terms_doc = site.legal | where: "service_name", service.id | where: "doc_type", "terms" | first %}
| {{ service.name }} | {% if privacy_doc %}[문서 보기]({{ privacy_doc.url | relative_url }})<br><small>최종 수정: {{ privacy_doc.last_updated }}</small>{% else %}-{% endif %} | {% if terms_doc %}[문서 보기]({{ terms_doc.url | relative_url }})<br><small>최종 수정: {{ terms_doc.last_updated }}</small>{% else %}-{% endif %} | {% if service.download_url %}[리소스]({{ service.download_url }}){% else %}-{% endif %} |
{% endfor %}

{% assign common_privacy = site.legal | where: "service_name", "공통" | where: "doc_type", "privacy" | first %}
{% assign common_terms = site.legal | where: "service_name", "공통" | where: "doc_type", "terms" | first %}

## 공통 문서

| 구분 | 문서 | 최종 수정일 |
| --- | --- | --- |
| 개인정보처리방침(공통) | {% if common_privacy %}[문서 보기]({{ common_privacy.url | relative_url }}){% else %}-{% endif %} | {% if common_privacy %}{{ common_privacy.last_updated }}{% else %}-{% endif %} |
| 이용약관(공통) | {% if common_terms %}[문서 보기]({{ common_terms.url | relative_url }}){% else %}-{% endif %} | {% if common_terms %}{{ common_terms.last_updated }}{% else %}-{% endif %} |
