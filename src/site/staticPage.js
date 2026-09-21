const pages = {
  about: {
    title: 'About GAME FACTORY',
    intro: 'GAME FACTORY는 설치 없이 바로 시작할 수 있는 브라우저 게임 컬렉션입니다. 짧은 플레이, 명확한 조작, 가벼운 저장 기능을 중심으로 설계합니다.',
    sections: [['플레이 방식', '회원가입 없이 게임을 시작할 수 있으며, 최고 점수·즐겨찾기·최근 플레이는 사용 중인 브라우저에만 저장됩니다.'], ['현재 상태', '이 사이트는 공개 전 품질 점검 단계입니다. 브랜드, 운영자 정보, 도메인은 정식 공개 전에 확정합니다.']],
  },
  contact: {
    title: 'Contact',
    intro: '문의 채널은 정식 공개 시점에 이 페이지에서 안내합니다.',
    sections: [['예정된 문의 범위', '게임 오류, 콘텐츠 제안, 저작권 관련 요청, 개인정보 문의를 받을 수 있는 채널을 준비합니다.'], ['공개 전 안내', '운영자 명칭과 전용 문의 이메일이 확정되기 전에는 개인 정보나 민감한 자료를 보내지 마세요.']],
  },
  privacy: {
    title: 'Privacy',
    intro: '이 문서는 현재 구현을 설명하는 공개 전 개인정보 안내 초안입니다. 정식 운영 전 실제 운영자 정보와 적용일을 확정해 갱신합니다.',
    sections: [['현재 브라우저 저장 정보', '최고 점수, 즐겨찾기, 최근 플레이 기록은 계정 서버가 아니라 사용자의 브라우저 저장소에 보관됩니다. 브라우저 데이터를 지우면 함께 삭제될 수 있습니다.'], ['현재 수집하지 않는 정보', '프로토타입은 회원 계정, 결제 정보, 광고 식별자, 서버 기반 게임 기록을 수집하도록 구현되어 있지 않습니다.'], ['향후 분석·광고', '분석 또는 광고를 도입하기 전에 사용 목적, 수집 항목, 보관 기간, 제3자 제공 여부와 필요한 동의 절차를 이 페이지에 명시합니다.']],
  },
  terms: {
    title: 'Terms',
    intro: '이 문서는 공개 전 이용 안내 초안입니다. 정식 공개 전에 운영자 정보와 실제 적용 조건을 확정합니다.',
    sections: [['이용 범위', '게임은 개인적인 오락 목적으로 제공될 예정입니다. 자동화된 대량 접근, 서비스 방해, 콘텐츠의 무단 재배포는 허용하지 않을 예정입니다.'], ['서비스 변경', '게임 구성과 기능은 품질 개선을 위해 변경되거나 중단될 수 있습니다. 공개 시점에는 적용일과 변경 고지 방법을 명시합니다.'], ['정식 공개 전 확인 사항', '운영자, 연락처, 준거법, 책임 제한, 신고 절차는 도메인과 운영 방식이 확정된 뒤 법률 검토를 거쳐 반영해야 합니다.']],
  },
};

const page = pages[document.body.dataset.page];
const root = document.querySelector('#main');
document.title = `${page.title} | GAME FACTORY`;
root.innerHTML = `<article class="static-page"><a class="back-link" href="/">← Home</a><p class="eyebrow">GAME FACTORY · PRE-LAUNCH</p><h1>${page.title}</h1><p class="static-intro">${page.intro}</p>${page.sections.map(([heading, body]) => `<section><h2>${heading}</h2><p>${body}</p></section>`).join('')}<p class="page-note">Last updated: 2026-09-21 · 정식 공개 전 초안</p></article>`;
