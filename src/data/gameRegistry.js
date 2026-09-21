const shared = {
  gameVersion: '1.0.0',
  status: 'planned',
  featured: false,
  new: true,
  popular: false,
  releaseDate: null,
  updatedDate: '2026-09-20',
};

const playableGames = [
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
  {
    ...shared,
    id: 'G02', slug: 'perfect-drop', title: 'Perfect Drop', category: 'skill',
    shortDescription: '움직이는 블록을 정확한 위치에 떨어뜨려 탑을 쌓으세요.',
    description: '한 번의 클릭으로 블록을 떨어뜨리고, 좁아지는 발판 위에서 연속 착지를 노리는 타이밍 게임입니다.',
    tags: ['timing', 'stack', 'precision'], engineType: 'canvas-2d',
    desktopControls: ['Mouse click', 'Space'], mobileControls: ['Tap'], orientation: 'portrait',
    difficulty: 'easy-to-hard', averagePlayTime: '2–5 min', thumbnail: null, heroImage: null,
    seoTitle: 'Perfect Drop | GAME FACTORY', seoDescription: '움직이는 블록을 정확히 쌓는 무료 타이밍 웹게임.',
    relatedGames: ['orbit-tap', 'lane-dodge'], featured: false, status: 'prototype',
  },
];

const gameDetails = {
  'gap-runner': ['틈이 열리는 순간에 점프해 연속 질주 기록을 세우세요.', '움직이는 마커가 안전 구간에 들어올 때 정확히 멈추는 반응 속도 게임입니다.', ['timing', 'reaction', 'runner'], 'easy-to-hard', '1–3 min'],
  'balance-tower': ['흔들리는 중심선에 블록을 맞춰 균형 탑을 쌓으세요.', '짧은 입력 하나로 중심을 지키며 높이와 점수를 늘리는 타이밍 게임입니다.', ['balance', 'precision', 'stack'], 'medium', '2–4 min'],
  'pulse-stop': ['빠르게 흐르는 펄스를 초록 구간에서 멈추세요.', '라운드가 이어질수록 속도가 빨라지는 순간 판단 게임입니다.', ['pulse', 'reflex', 'timing'], 'easy-to-hard', '1–3 min'],
  'hex-link': ['숫자 타일 사이에서 목표 값을 가장 먼저 찾아 연결하세요.', '매 라운드 바뀌는 보드에서 관찰력으로 목표 타일을 찾는 퍼즐입니다.', ['grid', 'logic', 'numbers'], 'easy', '2–5 min'],
  'pipe-shift': ['뒤섞인 배관 번호에서 목표 연결점을 찾아 정렬하세요.', '제한된 보드에서 다음 수를 빠르게 찾아내는 가벼운 논리 퍼즐입니다.', ['pipes', 'logic', 'grid'], 'medium', '2–5 min'],
  'laser-mirror': ['반사 경로의 도착 번호를 찾아 레이저를 안전하게 안내하세요.', '시선 추적과 짧은 추론을 이용해 목표를 고르는 퍼즐입니다.', ['laser', 'reflection', 'logic'], 'medium', '2–6 min'],
  'escape-grid': ['출구 번호를 찾아 미로 보드에서 탈출하세요.', '목표 숫자를 빠르게 판별할수록 더 긴 탈출 기록을 만들 수 있습니다.', ['escape', 'grid', 'focus'], 'easy-to-hard', '2–4 min'],
  'gem-chain': ['같은 보석 쌍을 이어 합치고 긴 체인을 만드세요.', '보드 위에서 같은 값의 보석을 순서대로 찾아 합치는 병합 게임입니다.', ['gems', 'match', 'merge'], 'easy', '2–5 min'],
  'number-stack': ['같은 숫자 블록을 합쳐 더 높은 스택을 만드세요.', '값이 같은 타일을 선택해 점수를 누적하는 숫자 병합 게임입니다.', ['numbers', 'stack', 'merge'], 'medium', '3–6 min'],
  'color-collapse': ['같은 색 블록을 짝지어 보드를 정리하세요.', '색과 숫자를 함께 보고 맞는 쌍을 찾아내는 빠른 병합 퍼즐입니다.', ['color', 'collapse', 'match'], 'easy-to-hard', '2–5 min'],
  'shape-fusion': ['같은 도형 조각을 융합해 더 높은 점수를 만드세요.', '형태와 값을 관찰해 올바른 두 조각을 선택하는 병합 게임입니다.', ['shapes', 'fusion', 'merge'], 'medium', '2–5 min'],
  'brick-burst': ['다가오는 벽을 피해 안전한 레인으로 이동하세요.', '장애물 위치를 읽고 좌우 레인을 바꿔 생존 시간을 늘리는 아케이드 게임입니다.', ['bricks', 'dodge', 'lanes'], 'easy-to-hard', '1–4 min'],
  'sky-hopper': ['구름 사이 빈 길을 골라 하늘 위로 올라가세요.', '위험한 레인을 피하며 한 번 더 오래 버티는 반응 속도 게임입니다.', ['sky', 'hop', 'dodge'], 'easy-to-hard', '1–4 min'],
  'space-drift': ['소행성 항로를 피해 우주선의 안전 레인을 유지하세요.', '매 순간 바뀌는 위험 구역을 보고 빠르게 방향을 선택하는 게임입니다.', ['space', 'asteroid', 'survival'], 'medium', '2–5 min'],
  'tunnel-shift': ['터널 벽이 닫히기 전에 빈 레인으로 이동하세요.', '속도가 빨라지는 통로에서 집중력을 시험하는 아케이드 게임입니다.', ['tunnel', 'shift', 'reflex'], 'easy-to-hard', '1–4 min'],
  'tiny-mine': ['광물을 채굴하고 장비를 업그레이드해 생산량을 높이세요.', '짧은 탭으로 자원을 모으고 투자로 다음 수집을 키우는 성장 게임입니다.', ['mine', 'upgrade', 'idle'], 'relaxed', '3–8 min'],
  'mini-factory': ['부품을 생산해 조립 라인을 한 단계씩 강화하세요.', '생산과 업그레이드를 반복해 점점 큰 공장을 만드는 가벼운 경영 게임입니다.', ['factory', 'production', 'idle'], 'relaxed', '3–8 min'],
  'planet-grow': ['에너지를 모아 작은 행성을 성장시키세요.', '수집한 자원을 성장 단계에 투자하는 느긋한 우주 성장 게임입니다.', ['planet', 'growth', 'idle'], 'relaxed', '3–8 min'],
  'pocket-farm': ['수확한 씨앗으로 작은 농장을 확장하세요.', '탭으로 작물을 모으고 업그레이드로 수확량을 늘리는 농장 게임입니다.', ['farm', 'harvest', 'idle'], 'relaxed', '3–8 min'],
  'energy-lab': ['전력을 모아 실험 장비를 업그레이드하세요.', '연구 점수를 쌓으며 효율을 높이는 간단한 실험실 성장 게임입니다.', ['energy', 'lab', 'upgrade'], 'relaxed', '3–8 min'],
  'word-sprint': ['제시어와 가장 잘 어울리는 낱말을 빠르게 고르세요.', '짧은 단어 연상 문제를 연속으로 풀며 기록에 도전하는 두뇌 게임입니다.', ['words', 'language', 'quiz'], 'easy-to-hard', '2–5 min'],
  'math-rush': ['계산 결과를 가장 빠르게 골라 연속 정답을 만드세요.', '간단한 덧셈 문제를 제한 없이 빠르게 푸는 계산 게임입니다.', ['math', 'numbers', 'quiz'], 'easy-to-hard', '2–5 min'],
  'pattern-next': ['수열의 다음 값을 찾아 패턴을 완성하세요.', '증가 규칙을 관찰하고 정확한 다음 항을 고르는 추론 게임입니다.', ['pattern', 'sequence', 'logic'], 'medium', '2–5 min'],
  'sequence-recall': ['숫자 흐름의 다음 값을 기억하고 선택하세요.', '짧은 수열을 보고 규칙을 찾아내는 집중력 게임입니다.', ['memory', 'sequence', 'brain'], 'medium', '2–5 min'],
};

const remainingGames = [
  ['G03','gap-runner','Gap Runner','skill'],['G04','balance-tower','Balance Tower','skill'],['G05','pulse-stop','Pulse Stop','skill'],
  ['G07','hex-link','Hex Link','puzzle'],['G08','pipe-shift','Pipe Shift','puzzle'],['G09','laser-mirror','Laser Mirror','puzzle'],['G10','escape-grid','Escape Grid','puzzle'],
  ['G12','gem-chain','Gem Chain','merge'],['G13','number-stack','Number Stack','merge'],['G14','color-collapse','Color Collapse','merge'],['G15','shape-fusion','Shape Fusion','merge'],
  ['G17','brick-burst','Brick Burst','arcade'],['G18','sky-hopper','Sky Hopper','arcade'],['G19','space-drift','Space Drift','arcade'],['G20','tunnel-shift','Tunnel Shift','arcade'],
  ['G21','tiny-mine','Tiny Mine','idle'],['G22','mini-factory','Mini Factory','idle'],['G23','planet-grow','Planet Grow','idle'],['G24','pocket-farm','Pocket Farm','idle'],['G25','energy-lab','Energy Lab','idle'],
  ['G27','word-sprint','Word Sprint','brain'],['G28','math-rush','Math Rush','brain'],['G29','pattern-next','Pattern Next','brain'],['G30','sequence-recall','Sequence Recall','brain'],
].map(([id,slug,title,category]) => {
  const categoryDetails = {
    skill: { controls: ['Mouse click', 'Space'], mobile: ['Tap'], description: '순간 판단과 정확한 타이밍을 겨루는 스킬 게임입니다.' },
    puzzle: { controls: ['Mouse click'], mobile: ['Tap'], description: '짧은 규칙을 파악해 목표를 해결하는 퍼즐 게임입니다.' },
    merge: { controls: ['Mouse click'], mobile: ['Tap'], description: '같은 조각을 합쳐 더 높은 점수를 만드는 병합 게임입니다.' },
    arcade: { controls: ['Arrow keys', 'A / D'], mobile: ['Tap controls'], description: '빠른 판단으로 기록에 도전하는 아케이드 게임입니다.' },
    idle: { controls: ['Mouse click'], mobile: ['Tap'], description: '자원을 모으고 업그레이드하는 가벼운 성장 게임입니다.' },
    brain: { controls: ['Mouse click', 'Number keys'], mobile: ['Tap'], description: '관찰력과 기억력, 계산력을 시험하는 두뇌 게임입니다.' },
  }[category];
  const [shortDescription, description, tags, difficulty, averagePlayTime] = gameDetails[slug];
  return {...shared,id,slug,title,category,status:'prototype',featured:false,shortDescription,description,tags,engineType:category==='arcade'||category==='skill'?'canvas-2d':'dom-grid',desktopControls:categoryDetails.controls,mobileControls:categoryDetails.mobile,orientation:'portrait',difficulty,averagePlayTime,thumbnail:null,heroImage:null,seoTitle:`${title} | GAME FACTORY`,seoDescription:shortDescription,relatedGames:['orbit-tap']};
});

export const gameRegistry = Object.freeze([...playableGames,...remainingGames]);

export const publicGames = () => gameRegistry.filter((game) => game.status === 'prototype' || game.status === 'published');
export const gameBySlug = (slug) => gameRegistry.find((game) => game.slug === slug);
