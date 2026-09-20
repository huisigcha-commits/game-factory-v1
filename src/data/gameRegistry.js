const shared = {
  gameVersion: '1.0.0',
  status: 'planned',
  featured: false,
  new: true,
  popular: false,
  releaseDate: null,
  updatedDate: '2026-09-20',
};

const representativeGames = [
  {
    ...shared,
    id: 'G01', slug: 'orbit-tap', title: 'Orbit Tap', category: 'skill',
    shortDescription: '움직이는 궤도 위 목표를 정확한 순간에 탭하세요.',
    description: '회전 속도와 목표 수가 점점 늘어나는 타이밍 게임입니다.',
    tags: ['timing', 'tap', 'collision'], engineType: 'canvas-2d',
    desktopControls: ['Mouse click'], mobileControls: ['Tap'], orientation: 'portrait',
    difficulty: 'easy-to-hard', averagePlayTime: '2–5 min', thumbnail: null, heroImage: null,
    seoTitle: 'Orbit Tap | GAME FACTORY', seoDescription: '정확한 타이밍으로 궤도 목표를 탭하는 무료 웹게임.',
    relatedGames: ['lane-dodge', 'memory-grid'], featured: true, status: 'prototype',
  },
  {
    ...shared,
    id: 'G06', slug: 'number-fold', title: 'Number Fold', category: 'puzzle',
    shortDescription: '숫자 타일을 밀고 합쳐 더 높은 값을 만드세요.',
    description: '키보드와 스와이프를 함께 검증하는 그리드 결합 퍼즐입니다.',
    tags: ['grid', 'swipe', 'numbers'], engineType: 'dom-grid',
    desktopControls: ['Arrow keys'], mobileControls: ['Swipe'], orientation: 'portrait',
    difficulty: 'medium', averagePlayTime: '3–8 min', thumbnail: null, heroImage: null,
    seoTitle: 'Number Fold | GAME FACTORY', seoDescription: '숫자 타일을 결합하는 무료 스와이프 퍼즐 게임.',
    relatedGames: ['memory-grid', 'orbit-tap'], featured: true, status: 'prototype',
  },
  {
    ...shared,
    id: 'G11', slug: 'merge-garden', title: 'Merge Garden', category: 'merge',
    shortDescription: '같은 씨앗을 드래그해 정원을 성장시키세요.',
    description: '드래그, 충돌, 병합과 장기 진행을 검증하는 성장 게임입니다.',
    tags: ['drag', 'merge', 'progression'], engineType: 'canvas-2d',
    desktopControls: ['Drag'], mobileControls: ['Drag'], orientation: 'landscape',
    difficulty: 'relaxed', averagePlayTime: '5–12 min', thumbnail: null, heroImage: null,
    seoTitle: 'Merge Garden | GAME FACTORY', seoDescription: '식물을 합쳐 정원을 키우는 무료 병합 웹게임.',
    relatedGames: ['number-fold', 'memory-grid'], featured: true, status: 'prototype',
  },
  {
    ...shared,
    id: 'G16', slug: 'lane-dodge', title: 'Lane Dodge', category: 'arcade',
    shortDescription: '다가오는 장애물을 피해 가능한 오래 달리세요.',
    description: '실시간 루프와 난이도 상승을 검증하는 아케이드 게임입니다.',
    tags: ['realtime', 'dodge', 'arcade'], engineType: 'canvas-2d',
    desktopControls: ['Arrow keys', 'A / D'], mobileControls: ['Swipe', 'Tap controls'], orientation: 'portrait',
    difficulty: 'easy-to-hard', averagePlayTime: '1–4 min', thumbnail: null, heroImage: null,
    seoTitle: 'Lane Dodge | GAME FACTORY', seoDescription: '장애물을 피하며 기록에 도전하는 무료 아케이드 웹게임.',
    relatedGames: ['orbit-tap', 'merge-garden'], featured: true, status: 'prototype',
  },
  {
    ...shared,
    id: 'G26', slug: 'memory-grid', title: 'Memory Grid', category: 'brain',
    shortDescription: '빛난 칸의 순서를 기억해 그대로 재현하세요.',
    description: '패턴, 타이머, 레벨 상태 전환을 검증하는 기억력 게임입니다.',
    tags: ['memory', 'pattern', 'sequence'], engineType: 'dom-grid',
    desktopControls: ['Mouse click'], mobileControls: ['Tap'], orientation: 'portrait',
    difficulty: 'easy-to-hard', averagePlayTime: '2–6 min', thumbnail: null, heroImage: null,
    seoTitle: 'Memory Grid | GAME FACTORY', seoDescription: '빛의 순서를 기억하는 무료 두뇌 웹게임.',
    relatedGames: ['orbit-tap', 'number-fold'], featured: true, status: 'prototype',
  },
];

const plannedGames = [
  ['G02','perfect-drop','Perfect Drop','skill'],['G03','gap-runner','Gap Runner','skill'],['G04','balance-tower','Balance Tower','skill'],['G05','pulse-stop','Pulse Stop','skill'],
  ['G07','hex-link','Hex Link','puzzle'],['G08','pipe-shift','Pipe Shift','puzzle'],['G09','laser-mirror','Laser Mirror','puzzle'],['G10','escape-grid','Escape Grid','puzzle'],
  ['G12','gem-chain','Gem Chain','merge'],['G13','number-stack','Number Stack','merge'],['G14','color-collapse','Color Collapse','merge'],['G15','shape-fusion','Shape Fusion','merge'],
  ['G17','brick-burst','Brick Burst','arcade'],['G18','sky-hopper','Sky Hopper','arcade'],['G19','space-drift','Space Drift','arcade'],['G20','tunnel-shift','Tunnel Shift','arcade'],
  ['G21','tiny-mine','Tiny Mine','idle'],['G22','mini-factory','Mini Factory','idle'],['G23','planet-grow','Planet Grow','idle'],['G24','pocket-farm','Pocket Farm','idle'],['G25','energy-lab','Energy Lab','idle'],
  ['G27','word-sprint','Word Sprint','brain'],['G28','math-rush','Math Rush','brain'],['G29','pattern-next','Pattern Next','brain'],['G30','sequence-recall','Sequence Recall','brain'],
].map(([id,slug,title,category]) => ({...shared,id,slug,title,category,status:'planned',featured:false,shortDescription:`${title}은(는) GAME FACTORY의 다음 제작 라인업입니다.`,description:'공통 Game SDK와 품질 기준을 통과한 뒤 공개할 예정인 게임입니다.',tags:[category],engineType:'pending',desktopControls:[],mobileControls:[],orientation:'pending',difficulty:'pending',averagePlayTime:'pending',thumbnail:null,heroImage:null,seoTitle:`${title} | GAME FACTORY`,seoDescription:`${title} 무료 웹게임 준비 중.`,relatedGames:[]}));

export const gameRegistry = Object.freeze([...representativeGames,...plannedGames]);

export const publicGames = () => gameRegistry.filter((game) => game.status === 'published');
export const gameBySlug = (slug) => gameRegistry.find((game) => game.slug === slug);
