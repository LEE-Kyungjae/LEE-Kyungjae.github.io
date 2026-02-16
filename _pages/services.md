---
title: "앱·서비스"
layout: single
permalink: /services/
classes: wide
---

서비스별 상태와 사용 가능한 리소스를 안내합니다.

## 서비스 목록

| 서비스 | 상태 | 설명 | 리소스 |
| --- | --- | --- | --- |
{% assign services = site.data.services | sort: "order" %}
{% for service in services %}
| {{ service.name }} | {{ service.status }} | {{ service.one_liner }} | {% if service.download_url %}[다운로드]({{ service.download_url }}){% else %}-{% endif %} |
{% endfor %}

## 상태 기준

- `Active`: 외부 공개/운영 중
- `Building`: 개발 진행 중
- `Archived`: 운영 종료 또는 보관 상태

## 운영 안내

1. 서비스 공개 시 정책 문서(개인정보처리방침/이용약관)를 함께 공개합니다.
2. 서비스 상태 변경 시 본 페이지 상태를 갱신합니다.
3. 정책 문서 변경 시 `last_updated`를 갱신합니다.
