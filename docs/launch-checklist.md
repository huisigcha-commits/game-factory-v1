# GAME FACTORY 공개 준비 체크리스트

이 문서는 정식 공개와 광고 검토 전에 완료해야 할 항목을 한곳에서 관리합니다. 도메인 구매나 외부 계정 작업은 운영자 확인 후에만 진행합니다.

## 현재 완료

- 30개 게임과 각 게임의 상세 페이지
- 검색, 카테고리, 즐겨찾기, 최근 플레이, 최고 점수
- 게임별 canonical URL과 VideoGame 구조화 데이터 생성
- sitemap.xml, robots.txt 생성
- About, Contact, Privacy, Terms의 공개 전 초안
- Registry 검증, 구조 QA, Node 회귀 테스트

## 도메인·배포 전 확인

- [ ] 브랜드명과 실제 도메인 확정
- [ ] 운영자 명칭과 공개 가능한 문의 이메일 확정
- [ ] 개인정보처리방침과 이용약관의 적용일 및 운영자 정보 확정
- [ ] 모바일 브라우저에서 대표 게임·검색·즐겨찾기 최종 점검
- [ ] 실제 도메인으로 `GAME_FACTORY_SITE_URL` 설정
- [ ] 게임 페이지, sitemap, robots 생성 명령 재실행

## Cloudflare 연결 시점

- [ ] 도메인을 Cloudflare에 추가하고 DNS 또는 네임서버 연결
- [ ] 배포 호스트의 사용자 도메인 연결
- [ ] HTTPS로 홈, 게임 상세, 정책 페이지 열림 확인
- [ ] `https://실제도메인/sitemap.xml`과 `robots.txt` 확인
- [ ] 검색 엔진 도구에 사이트맵 제출 여부 결정

## 광고 신청 전 확인

- [ ] 광고 없이도 게임 시작과 탐색 흐름이 자연스러운지 확인
- [ ] 광고를 게임 조작 영역과 겹치지 않는 Safe Ad Zone에만 배치
- [ ] 분석·광고 도입 시 개인정보처리방침에 실제 데이터 흐름과 동의 절차 반영
- [ ] 운영자 정보와 문의 채널이 공개 상태인지 확인
- [ ] 모든 게임 페이지와 정책 페이지에 깨진 링크가 없는지 확인

## 재현 가능한 검증 명령

로컬 Node 실행 파일이 준비된 환경에서는 다음 순서로 확인합니다.

```text
node scripts/generate-game-pages.mjs
node scripts/generate-seo.mjs
node --test
node scripts/validate-registry.mjs
node scripts/qa.mjs
```
