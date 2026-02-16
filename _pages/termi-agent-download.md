---
title: "termi-agent 다운로드"
layout: single
permalink: /termi-agent/
classes: wide
---

`termi` 모바일 앱 연결용 `termi-agent` 다운로드 페이지입니다.

## 빠른 다운로드

- macOS (Apple Silicon, M1/M2/M3)
  - [termi-agent-macos-arm64.zip]({{ '/assets/downloads/termi-agent/termi-agent-macos-arm64.zip' | relative_url }})

## 사용 방법

1. zip 다운로드 후 압축 해제
2. 터미널에서 폴더 이동
3. `./start-agent.sh` 실행
4. 출력되는 `Tailscale URL`을 앱 페어링 화면에 입력

## 포함 파일

- `termi-agent-bin`
- `start-agent.sh`
- `stop-agent.sh`
- `README.txt`

## 참고

- 현재 패키지는 macOS Apple Silicon 대상입니다.
- Intel macOS/Windows/Linux 패키지가 필요하면 별도 빌드가 필요합니다.
