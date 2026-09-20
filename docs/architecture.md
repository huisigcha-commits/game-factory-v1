# GAME FACTORY V1 Architecture

## 1. Utiqora에서 검증한 원칙과 적용 방식

| 검증된 원칙 | GAME FACTORY 적용 |
| --- | --- |
| 정적 우선 배포 | 게임 메타데이터에서 정적 HTML·사이트맵·robots를 생성한다. |
| 중앙 데이터와 공통 UI | `gameRegistry`가 목록, 상세, 카테고리, 검색, 관련 게임의 단일 원본이다. |
| 페이지별 고유 SEO | 각 게임은 고유 제목, 설명, canonical, JSON-LD를 갖는다. |
| 동의 기반 분석 | 동의 전에는 분석 스크립트와 게임 이벤트를 전송하지 않는다. |
| 배포 전 QA | 경로·메타·링크·에셋·게임 생명주기 점검을 자동화한다. |

수동 복사 배포본과 단일 대형 런타임 파일은 사용하지 않는다. 생성 산출물은 빌드 시 만들어지며 소스와 중복 관리하지 않는다.

## 2. 레이어

1. **Registry**: 게임 메타데이터, 카테고리, 관련 게임, 공개 상태를 정의한다.
2. **Site shell**: 목록·검색·카테고리·상세 페이지와 Safe Ad Zone을 제공한다.
3. **Game SDK**: 입력, canvas 크기, pause/visibility, 점수, localStorage, 분석 이벤트와 정리를 표준화한다.
4. **Game modules**: 한 게임만 실행하고 `mount()` / `destroy()` 계약을 따른다.
5. **Build & QA**: 공개 레지스트리를 정적 경로·SEO·사이트맵으로 변환하고 게임별 smoke test를 실행한다.

## 3. 게임 모듈 계약

```js
export function mountGame({ container, sdk, game }) {
  // 플레이 화면을 만들고 실행한다.
  return {
    start() {},
    restart() {},
    destroy() {}, // 모든 timer, RAF, event listener, audio를 정리한다.
  };
}
```

게임은 전역 상태를 공유하지 않는다. 페이지 전환, 재시작, visibility change 때 SDK가 제공하는 cleanup 등록을 통해 자원을 회수한다.

## 4. Registry 필수 데이터

`id`, `slug`, `title`, `shortDescription`, `description`, `category`, `tags`, `engineType`, `gameVersion`, `desktopControls`, `mobileControls`, `orientation`, `difficulty`, `averagePlayTime`, `thumbnail`, `heroImage`, `seoTitle`, `seoDescription`, `relatedGames`, `status`, `featured`, `new`, `popular`, `releaseDate`, `updatedDate`.

첫 5개 대표 게임은 다른 입력·상태 모델을 검증한다: Orbit Tap, Number Fold, Merge Garden, Lane Dodge, Memory Grid.

## 5. 라우트와 생성물

- `/`, `/games/`, `/games/{slug}/`
- `/category/{category}/`, `/new/`, `/popular/`, `/favorites/`
- `/about/`, `/contact/`, `/privacy/`, `/terms/`
- `/sitemap.xml`, `/robots.txt`

도메인이 확정되기 전에는 canonical과 sitemap의 사이트 URL을 환경 설정으로만 보관하며 실제 운영 URL을 하드코딩하지 않는다.

## 6. 광고와 분석 경계

Safe Ad Zone은 게임 canvas, Play/Restart, 터치·키보드 조작부, 게임 간 이동과 겹치지 않는다. 광고 태그와 CMP는 실제 서비스 가입·정책 검토 Gate 전까지 넣지 않는다.

분석 이벤트는 `game_view`, `game_load`, `game_start`, `game_first_action`, `game_level_start`, `game_level_complete`, `game_over`, `game_score`, `game_restart`, `game_pause`, `game_resume`, `favorite_add`, `related_game_open`, `random_game_open`을 공통 레이어에서 관리한다.

