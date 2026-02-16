---
title: "법적 문서"
layout: single
permalink: /legal/
classes: wide
---

서비스별 `개인정보처리방침`과 `이용약관`을 한 곳에서 확인할 수 있습니다.

## 서비스별 문서

| 서비스 | 개인정보처리방침 | 이용약관 |
| --- | --- | --- |
{% assign services = site.data.services | sort: "order" %}
{% for service in services %}
{% assign privacy_doc = site.legal | where: "service_name", service.id | where: "doc_type", "privacy" | first %}
{% assign terms_doc = site.legal | where: "service_name", service.id | where: "doc_type", "terms" | first %}
| {{ service.name }} | {% if privacy_doc %}[보기]({{ privacy_doc.url | relative_url }})<br><small>최종 수정: {{ privacy_doc.last_updated }}</small>{% else %}-{% endif %} | {% if terms_doc %}[보기]({{ terms_doc.url | relative_url }})<br><small>최종 수정: {{ terms_doc.last_updated }}</small>{% else %}-{% endif %} |
{% endfor %}

## 공통 문서

| 구분 | 문서 | 최종 수정일 |
| --- | --- | --- |
{% assign common_privacy = site.legal | where: "service_name", "공통" | where: "doc_type", "privacy" | first %}
{% assign common_terms = site.legal | where: "service_name", "공통" | where: "doc_type", "terms" | first %}
| 개인정보처리방침(공통) | {% if common_privacy %}[{{ common_privacy.title }}]({{ common_privacy.url | relative_url }}){% else %}-{% endif %} | {% if common_privacy %}{{ common_privacy.last_updated }}{% else %}-{% endif %} |
| 이용약관(공통) | {% if common_terms %}[{{ common_terms.title }}]({{ common_terms.url | relative_url }}){% else %}-{% endif %} | {% if common_terms %}{{ common_terms.last_updated }}{% else %}-{% endif %} |
