export function mountGame({ container, sdk, onScore }) {
  const canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 720; canvas.className = 'game-canvas';
  container.replaceChildren(canvas);
  const ctx = canvas.getContext('2d');
  const backdrop = new Image();
  backdrop.src = '/assets/games/lane-dodge-city.png';
  const lanes = [150, 300, 450];
  let player = 1, obstacles = [], sparks = [], score = 0, running = false, frame = 0, last = 0, spawn = 0, flash = 0;

  const rounded = (x, y, width, height, radius, fill) => { ctx.beginPath(); ctx.roundRect(x, y, width, height, radius); ctx.fillStyle = fill; ctx.fill(); };
  const glow = (color, blur) => { ctx.shadowColor = color; ctx.shadowBlur = blur; };
  const drawCar = (x, y, color, enemy = false) => {
    ctx.save(); ctx.translate(x, y); glow(color, enemy ? 16 : 25); rounded(-34, -44, 68, 88, 16, color); ctx.shadowBlur = 0;
    rounded(-25, -27, 50, 31, 10, enemy ? '#3a1d33' : '#152645'); rounded(-22, 11, 44, 16, 6, enemy ? '#ffca7c' : '#b9f8ff');
    ctx.fillStyle = enemy ? '#ffe8c7' : '#f4ffff'; ctx.fillRect(-21, -40, 13, 8); ctx.fillRect(8, -40, 13, 8); ctx.fillStyle = '#0a1120';
    ctx.fillRect(-38, -25, 7, 24); ctx.fillRect(31, -25, 7, 24); ctx.fillRect(-38, 13, 7, 24); ctx.fillRect(31, 13, 7, 24); ctx.restore();
  };
  const drawSkyline = () => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 720); gradient.addColorStop(0, '#101b3a'); gradient.addColorStop(.4, '#182653'); gradient.addColorStop(1, '#070d1d'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 600, 720);
    ctx.fillStyle = '#23386e'; [15, 53, 540, 575].forEach((x, index) => { const height = 160 + index * 48; ctx.fillRect(x, 120 - height / 3, 28, height); }); ctx.fillStyle = '#9beeff';
    for (let x = 20; x < 590; x += 38) for (let y = 25; y < 170; y += 34) if ((x + y) % 3) ctx.fillRect(x, y, 4, 7);
  };
  const drawRoad = time => {
    ctx.save(); ctx.beginPath(); ctx.moveTo(120, 0); ctx.lineTo(480, 0); ctx.lineTo(590, 720); ctx.lineTo(10, 720); ctx.closePath();
    const road = ctx.createLinearGradient(0, 0, 0, 720); road.addColorStop(0, '#202d57'); road.addColorStop(1, '#111a34'); ctx.fillStyle = road; ctx.fill();
    ctx.strokeStyle = '#7688c9'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(120, 0); ctx.lineTo(10, 720); ctx.moveTo(480, 0); ctx.lineTo(590, 720); ctx.stroke();
    ctx.strokeStyle = '#9deeff'; ctx.lineWidth = 4; ctx.setLineDash([20, 25]); ctx.lineDashOffset = -(time / 14); [240, 360].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + (x - 300) * .48, 720); ctx.stroke(); }); ctx.setLineDash([]); ctx.restore();
  };
  const draw = (time = 0) => {
    if (backdrop.complete && backdrop.naturalWidth) ctx.drawImage(backdrop, 0, 0, 600, 720); else drawSkyline(); drawRoad(time); obstacles.forEach(item => drawCar(lanes[item.lane] + (lanes[item.lane] - 300) * (item.y / 1500), item.y, '#ff7d70', true));
    sparks.forEach(particle => { ctx.globalAlpha = particle.life; glow('#d8ff48', 10); ctx.fillStyle = '#d8ff48'; ctx.fillRect(particle.x, particle.y, 4, 12); }); ctx.globalAlpha = 1; ctx.shadowBlur = 0; drawCar(lanes[player], 620, '#d8ff48');
    rounded(20, 18, 174, 48, 14, '#0b132bcc'); ctx.fillStyle = '#9deeff'; ctx.font = '700 12px system-ui'; ctx.fillText('DISTANCE', 36, 39); ctx.fillStyle = '#f4ffff'; ctx.font = '900 25px system-ui'; ctx.fillText(String(score).padStart(3, '0'), 36, 58);
    rounded(466, 18, 114, 48, 14, '#0b132bcc'); ctx.fillStyle = '#d8ff48'; ctx.font = '800 12px system-ui'; ctx.fillText('SPEED', 482, 39); ctx.fillStyle = '#f4ffff'; ctx.font = '900 22px system-ui'; ctx.fillText(`${Math.min(9, 1 + Math.floor(score / 90))}X`, 482, 58);
    if (!running) { ctx.fillStyle = '#08102599'; ctx.fillRect(0, 0, 600, 720); ctx.textAlign = 'center'; ctx.fillStyle = '#f4ffff'; ctx.font = '900 34px system-ui'; ctx.fillText(score ? 'RUN COMPLETE' : 'NEON LANE', 300, 305); ctx.fillStyle = '#d8ff48'; ctx.font = '700 16px system-ui'; ctx.fillText(score ? `DISTANCE ${score} · PRESS PLAY TO RACE AGAIN` : 'SWIPE OR USE ARROW KEYS TO DODGE', 300, 342); ctx.textAlign = 'left'; }
    if (flash) { ctx.fillStyle = `rgba(255,125,112,${flash})`; ctx.fillRect(0, 0, 600, 720); }
  };
  const reset = () => { player = 1; obstacles = []; sparks = []; score = 0; spawn = 0; flash = 0; onScore(0); draw(); };
  const end = () => { running = false; flash = .32; cancelAnimationFrame(frame); sdk.event('game_over', { score }); draw(); };
  const loop = time => {
    if (!running) return; const dt = Math.min(32, time - last || 16); last = time; spawn += dt; const speed = 4.8 + score / 260;
    if (spawn > Math.max(300, 800 - score * 1.7)) { obstacles.push({ lane: Math.floor(Math.random() * 3), y: -90 }); spawn = 0; }
    obstacles.forEach(item => item.y += speed * dt / 16); obstacles = obstacles.filter(item => item.y < 810); sparks.push({ x: lanes[player] + (Math.random() - .5) * 34, y: 675, life: .8 }); sparks.forEach(particle => { particle.y += 5; particle.life -= .05; }); sparks = sparks.filter(particle => particle.life > 0);
    if (obstacles.some(item => item.lane === player && item.y > 545 && item.y < 700)) return end(); score += Math.floor(dt / 16); onScore(score); draw(time); frame = requestAnimationFrame(loop);
  };
  const move = direction => { if (!running) return; sdk.firstAction(); player = Math.max(0, Math.min(2, player + direction)); };
  const key = event => { if (event.key === 'ArrowLeft' || event.key === 'a') move(-1); if (event.key === 'ArrowRight' || event.key === 'd') move(1); };
  let startX;
  const down = event => { startX = event.clientX; };
  const up = event => { if (startX === undefined) return; const distance = event.clientX - startX; if (Math.abs(distance) > 20) move(distance > 0 ? 1 : -1); startX = undefined; };
  sdk.listen(window, 'keydown', key); sdk.listen(canvas, 'pointerdown', down); sdk.listen(canvas, 'pointerup', up); reset();
  return { start() { reset(); running = true; last = performance.now(); sdk.rememberPlay(); sdk.event('game_start'); frame = requestAnimationFrame(loop); }, restart() { this.start(); }, destroy() { running = false; cancelAnimationFrame(frame); } };
}
