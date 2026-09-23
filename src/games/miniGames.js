export const miniGameConfigs = {
  'gap-runner':['timing','틈이 가운데일 때 점프'], 'balance-tower':['timing','가운데를 유지해 균형 잡기'], 'pulse-stop':['timing','빛이 초록 칸에 올 때 멈추기'],
  'hex-link':['puzzle','같은 숫자를 찾아 연결하기'], 'pipe-shift':['puzzle','목표 숫자를 찾아 배관 정렬하기'], 'laser-mirror':['puzzle','반사 경로의 목표 찾기'], 'escape-grid':['puzzle','출구 번호를 찾아 탈출하기'],
  'gem-chain':['merge','같은 보석 두 개를 합치기'], 'number-stack':['merge','같은 숫자 두 개를 쌓아 합치기'], 'color-collapse':['merge','같은 색 블록 두 개를 없애기'], 'shape-fusion':['merge','같은 도형 두 개를 융합하기'],
  'brick-burst':['dodge','안전한 레인을 선택해 벽 피하기'], 'sky-hopper':['dodge','구름 사이의 안전한 길로 뛰기'], 'space-drift':['dodge','소행성을 피해 항로 바꾸기'], 'tunnel-shift':['dodge','터널의 빈 레인으로 이동하기'],
  'tiny-mine':['idle','광물을 채굴하고 장비 강화하기'], 'mini-factory':['idle','부품을 생산하고 조립 라인 강화하기'], 'planet-grow':['idle','에너지를 모아 행성을 성장시키기'], 'pocket-farm':['idle','씨앗을 수확하고 농장을 확장하기'], 'energy-lab':['idle','전력을 모아 연구 장비 강화하기'],
  'word-sprint':['quiz','제시어와 맞는 낱말 고르기'], 'math-rush':['quiz','계산 결과를 빠르게 고르기'], 'pattern-next':['quiz','다음 패턴을 찾아 고르기'], 'sequence-recall':['quiz','숫자 순서의 다음 값을 고르기'],
};

const choice = (items) => items[Math.floor(Math.random() * items.length)];

export function mountGame({ container, sdk, game, onScore }) {
  const [type, instruction] = miniGameConfigs[game.slug] || ['quiz', '정답을 골라 점수를 얻기'];
  let score = 0, running = false, timer = 0, selected = null, resource = 0, level = 1;
  const updateScore = (value) => { score = value; onScore(score); sdk.event('game_score', { score }); const panel = container.querySelector('.mini-game'); if (panel) { panel.classList.remove('is-scoring'); requestAnimationFrame(() => panel.classList.add('is-scoring')); sdk.timeout(() => panel.classList.remove('is-scoring'), 260); } };
  const shell = (content) => { container.innerHTML = `<div class="mini-game mini-${type}" data-game="${game.slug}"><header><span>${type.toUpperCase()}</span><b>${game.title}</b></header><p class="mini-game-instruction">${instruction}</p>${content}</div>`; };
  const stop = () => { running = false; window.clearInterval(timer); };
  const gameOver = () => { stop(); sdk.event('game_over', { score }); const panel = container.querySelector('.mini-game'); if (panel) panel.classList.add('is-game-over'); const note = container.querySelector('.mini-game-note'); if (note) note.textContent = `Game over · Score ${score}`; };
  const randomQuiz = () => {
    let answer, prompt, options;
    if (game.slug === 'math-rush') { const a = 2 + Math.floor(Math.random()*8), b = 2 + Math.floor(Math.random()*8); answer = a+b; prompt = `${a} + ${b} = ?`; options = [answer, answer-1, answer+2].sort(() => Math.random()-.5); }
    else if (game.slug === 'word-sprint') { const data = choice([['바다','파도'],['하늘','구름'],['밤','별']]); answer = data[1]; prompt = `“${data[0]}”와 가장 잘 어울리는 말은?`; options = [answer,'연필','책상'].sort(() => Math.random()-.5); }
    else { const start = 2 + Math.floor(Math.random()*5), step = 2 + Math.floor(Math.random()*3); answer = start + step * 3; prompt = `${start}, ${start+step}, ${start+step*2}, ?`; options = [answer,answer-step,answer+step].sort(() => Math.random()-.5); }
    shell(`<p class="mini-game-prompt">${prompt}</p><div class="mini-choice-row">${options.map(value => `<button data-answer="${value}">${value}</button>`).join('')}</div><p class="mini-game-note">정답을 골라 연속 기록을 만드세요.</p>`);
    container.querySelectorAll('[data-answer]').forEach(button => button.onclick = () => { if (!running) return; sdk.firstAction(); if (button.dataset.answer !== String(answer)) return gameOver(); updateScore(score+1); randomQuiz(); });
  };
  const renderTiming = () => { let position = 0, direction = 1; shell(`<div class="mini-track"><span class="mini-marker"></span><b class="mini-target"></b></div><button class="mini-action">DROP</button><p class="mini-game-note">초록 구간을 맞히면 점수가 오릅니다.</p>`); const marker = container.querySelector('.mini-marker'); timer = window.setInterval(() => { if (document.hidden) return; position += direction * (2 + score*.15); if(position>96||position<0) direction *= -1; marker.style.left = `${position}%`; }, 22); container.querySelector('.mini-action').onclick = () => { if(!running)return; sdk.firstAction(); if (position >= 42 && position <= 58) { updateScore(score+1); } else gameOver(); }; };
  const renderPuzzle = () => { const target = 1 + Math.floor(Math.random()*9), numbers = Array.from({length:9}, (_,index)=>index+1).sort(()=>Math.random()-.5); shell(`<p class="mini-game-prompt">목표: <b>${target}</b></p><div class="mini-number-grid">${numbers.map(number=>`<button data-number="${number}">${number}</button>`).join('')}</div><p class="mini-game-note">숫자를 찾아 탭하세요.</p>`); container.querySelectorAll('[data-number]').forEach(button=>button.onclick=()=>{if(!running)return;sdk.firstAction();if(+button.dataset.number!==target)return gameOver();updateScore(score+1);renderPuzzle();}); };
  const renderMerge = () => { const tiles = [1,1,2,2,3,3,choice([1,2,3]),choice([1,2,3]),choice([1,2,3])]; shell(`<div class="mini-number-grid merge-grid">${tiles.map((value,index)=>`<button data-tile="${index}" data-value="${value}">${value}</button>`).join('')}</div><p class="mini-game-note">같은 숫자 두 개를 연속으로 선택하세요.</p>`); container.querySelectorAll('[data-tile]').forEach(button=>button.onclick=()=>{if(!running)return;sdk.firstAction();if(!selected){selected=button;button.classList.add('is-selected');return;}if(selected===button)return;const matches=selected.dataset.value===button.dataset.value;selected.classList.remove('is-selected');selected=null;if(!matches)return gameOver();updateScore(score+Number(button.dataset.value));renderMerge();}); };
  const renderDodge = () => { let danger = 1, lane = 0; shell(`<p class="mini-game-prompt">위험 레인: <b class="danger-lane">${danger+1}</b></p><div class="mini-lanes">${[0,1,2].map(index=>`<button data-lane="${index}">LANE ${index+1}</button>`).join('')}</div><p class="mini-game-note">장애물이 닿기 전에 다른 레인으로 이동하세요.</p>`); const show = () => { const label=container.querySelector('.danger-lane'); if(label)label.textContent=danger+1; }; container.querySelectorAll('[data-lane]').forEach(button=>button.onclick=()=>{lane=+button.dataset.lane;sdk.firstAction();container.querySelectorAll('[data-lane]').forEach(item=>item.classList.toggle('is-selected',item===button));}); timer=window.setInterval(()=>{if (document.hidden) return;if(lane===danger)return gameOver();updateScore(score+1);danger=(danger+1+Math.floor(Math.random()*2))%3;show();},1100); };
  const renderIdle = () => { const cost = level*8; shell(`<p class="mini-resource">${game.slug.replace('-',' ').toUpperCase()}: <b>${resource}</b></p><button class="mini-primary">COLLECT +${level}</button><button class="mini-upgrade" ${resource<cost?'disabled':''}>UPGRADE · ${cost}</button><p class="mini-game-note">업그레이드할수록 한 번에 더 많이 얻습니다.</p>`); container.querySelector('.mini-primary').onclick=()=>{if(!running)return;sdk.firstAction();resource+=level;updateScore(score+level);renderIdle();}; container.querySelector('.mini-upgrade').onclick=()=>{if(!running||resource<cost)return;resource-=cost;level++;renderIdle();}; };
  const render = () => ({timing:renderTiming,puzzle:renderPuzzle,merge:renderMerge,dodge:renderDodge,idle:renderIdle,quiz:randomQuiz}[type]());
  const restart = () => { stop(); score=0; selected=null; resource=0; level=1; onScore(0); shell('<p class="mini-game-note">Press Play to begin.</p>'); };
  const start = () => { restart(); running=true; sdk.rememberPlay(); sdk.event('game_start'); render(); };
  const keydown = (event) => {
    if (!running) return;
    let button;
    if (type === 'timing' && (event.code === 'Space' || event.code === 'Enter')) button = container.querySelector('.mini-action');
    if (type === 'dodge') {
      const lane = event.code === 'ArrowLeft' || event.code === 'KeyA' ? 0 : event.code === 'ArrowRight' || event.code === 'KeyD' ? 2 : event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'Space' ? 1 : null;
      if (lane !== null) button = container.querySelector(`[data-lane="${lane}"]`);
    }
    if (type === 'quiz' && /^Digit[1-3]$/.test(event.code)) button = container.querySelectorAll('[data-answer]')[Number(event.code.at(-1)) - 1];
    if (button) { event.preventDefault(); button.click(); }
  };
  window.addEventListener('keydown', keydown);
  restart();
  return { start, restart, destroy() { stop(); window.removeEventListener('keydown', keydown); } };
}
