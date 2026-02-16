# LEE-Kyungjae.github.io

개인 앱/서비스 소개와 법적 문서(개인정보처리방침, 이용약관)를 제공하는 Jekyll 기반 GitHub Pages 사이트입니다.

## 핵심 구조

- 홈: `/`
- 소개: `/about/`
- 앱·서비스: `/services/`
- 법적 문서 허브: `/legal/`
- 연락: `/contact/`
- 법적 문서 원본 폴더: `_legal/`

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve
```

브라우저에서 `http://127.0.0.1:4000` 접속.

## 새 서비스 문서 추가 방법

### 1) 개인정보처리방침 파일 생성

경로 예시: `_legal/my-service-privacy.md`

```md
---
title: "My Service 개인정보처리방침"
layout: single
service_name: "My Service"
doc_type: "privacy"
last_updated: "2026-02-16"
permalink: /legal/my-service/privacy/
---
```

### 2) 이용약관 파일 생성

경로 예시: `_legal/my-service-terms.md`

```md
---
title: "My Service 이용약관"
layout: single
service_name: "My Service"
doc_type: "terms"
last_updated: "2026-02-16"
permalink: /legal/my-service/terms/
---
```

### 3) 확인

- `/legal/` 페이지에서 문서가 자동으로 목록에 표시됩니다.
- 필요 시 `/services/` 페이지에 서비스 소개를 추가하세요.

## 배포

- 기본 배포 대상: GitHub Pages
- 저장소 기본 브랜치에 푸시하면 Pages 빌드로 반영됩니다.
