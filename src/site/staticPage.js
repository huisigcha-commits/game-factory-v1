const pages={
  about:{title:'About GAME FACTORY',body:'GAME FACTORY는 설치 없이 바로 플레이하는 HTML5 웹게임 플랫폼을 만들고 있습니다. 현재 명칭과 도메인은 개발용 임시값이며, 게임은 로그인 없이 이용할 수 있도록 설계됩니다.'},
  contact:{title:'Contact',body:'정식 운영자 정보와 문의 채널은 브랜드 및 도메인 확정 후 이 페이지에 공개합니다. 현재는 프로젝트 개발 단계입니다.'},
  privacy:{title:'Privacy',body:'현재 프로토타입은 계정 정보를 수집하지 않습니다. 최고 점수·즐겨찾기·최근 플레이는 이 브라우저의 저장소에만 보관됩니다. 실제 분석 또는 광고 도입 전에는 수집 범위와 동의 절차를 이 페이지에 명시합니다.'},
  terms:{title:'Terms',body:'현재는 개발 중인 프로토타입입니다. 정식 공개 전 이용 조건, 책임 제한, 콘텐츠 정책 및 운영자 정보를 검토해 이 페이지에 반영합니다.'},
};
const page=pages[document.body.dataset.page],root=document.querySelector('#static-page');
document.title=`${page.title} | GAME FACTORY`;
root.innerHTML=`<article class="static-page"><a class="back-link" href="/">← Home</a><p class="eyebrow">GAME FACTORY</p><h1>${page.title}</h1><p>${page.body}</p><p class="page-note">Last updated: 2026-09-20 · 임시 개발 문서</p></article>`;

