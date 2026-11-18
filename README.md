# LEE-Kyungjae.github.io

개인 앱/서비스 소개와 법적 문서(개인정보처리방침, 이용약관)를 제공하는 Next.js(정적 export) 기반 GitHub Pages 사이트입니다.
`_pages/`, `_legal/`의 마크다운은 `app/[...slug]/page.tsx`가 front matter의 `permalink`로 정적 페이지를 생성합니다.

## 핵심 구조

- 홈: `/`
- 소개: `/about/`
- 앱·서비스: `/services/`
- 법적 문서 허브: `/legal/`
- 연락: `/contact/`
- 법적 문서 원본 폴더: `_legal/`

## 로컬 실행

```bash
npm ci
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

정적 빌드 결과(`out/`)를 확인하려면 `npm run build`를 실행합니다. `prebuild`가 `scripts/prepare-public.mjs`로 `public/`을 먼저 채웁니다.

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
- 영문 문서는 front matter에 `lang: en`을 추가하고 `/en/legal/...` permalink를 사용합니다.
- `/services/` 카드 목록은 `app/[...slug]/page.tsx`의 `serviceData` 배열에서 관리합니다.

## 배포

- 기본 배포 대상: GitHub Pages
- `main`에 푸시하면 `.github/workflows/deploy.yml`이 `npm run build`로 `out/`을 만들어 Pages에 배포합니다.
