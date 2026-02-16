---
title: "법적 문서"
layout: single
permalink: /legal/
classes: wide
---

출시하는 앱/서비스별로 `개인정보처리방침`과 `이용약관`을 이곳에서 제공합니다.

## 개인정보처리방침 {#privacy}

{% assign privacy_docs = site.legal | where: "doc_type", "privacy" | sort: "service_name" %}
{% if privacy_docs.size > 0 %}
| 서비스 | 문서 | 최종 수정일 |
| --- | --- | --- |
{% for doc in privacy_docs %}
| {{ doc.service_name }} | [{{ doc.title }}]({{ doc.url | relative_url }}) | {{ doc.last_updated }} |
{% endfor %}
{% else %}
- 등록된 개인정보처리방침이 없습니다.
{% endif %}

## 이용약관 {#terms}

{% assign terms_docs = site.legal | where: "doc_type", "terms" | sort: "service_name" %}
{% if terms_docs.size > 0 %}
| 서비스 | 문서 | 최종 수정일 |
| --- | --- | --- |
{% for doc in terms_docs %}
| {{ doc.service_name }} | [{{ doc.title }}]({{ doc.url | relative_url }}) | {{ doc.last_updated }} |
{% endfor %}
{% else %}
- 등록된 이용약관이 없습니다.
{% endif %}

## 문서 추가 위치

- 경로: `_legal/`
- 파일 유형: Markdown (`.md`)
- 권장 메타데이터:
  - `service_name`
  - `doc_type` (`privacy` 또는 `terms`)
  - `last_updated` (예: `2026-02-16`)
