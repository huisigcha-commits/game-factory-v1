export function mountGame({ container, sdk, onScore }) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 720; canvas.className = 'game-canvas'; container.replaceChildren(canvas);
  const ctx = canvas.getContext('2d'); const backdrop = new Image(); backdrop.src = '/assets/games/orbit-tap-space.png';
  let running = false, frame = 0, score = 0, angle = 0, target = Math.PI * 1.5, speed = 1.2, started = 0, burst = [];
  const glow = (color, blur) => { ctx.shadowColor = color; ctx.shadowBlur = blur; };
  const draw = () => {
    if (backdrop.complete && backdrop.naturalWidth) ctx.drawImage(backdrop, 0, 0, 720, 720); else { ctx.fillStyle = '#0b1430'; ctx.fillRect(0, 0, 720, 720); }
    ctx.fillStyle = '#07112a99'; ctx.fillRect(0, 0, 720, 720); const c = 360, r = 225;
    glow('#7d8fe5', 24); ctx.beginPath(); ctx.arc(c, c, r, 0, Math.PI * 2); ctx.strokeStyle = '#6f80c9aa'; ctx.lineWidth = 18; ctx.stroke(); ctx.shadowBlur = 0;
    glow('#d8ff48', 34); ctx.beginPath(); ctx.arc(c, c, r, target - .2, target + .2); ctx.strokeStyle = '#d8ff48'; ctx.lineWidth = 25; ctx.stroke(); ctx.shadowBlur = 0;
    ctx.beginPath(); ctx.arc(c, c, 86, 0, Math.PI * 2); const core = ctx.createRadialGradient(c - 20, c - 25, 8, c, c, 90); core.addColorStop(0, '#c7faff'); core.addColorStop(.45, '#3589f2'); core.addColorStop(1, '#172c78'); ctx.fillStyle = core; ctx.fill();
    const x = c + Math.cos(angle) * r, y = c + Math.sin(angle) * r; glow('#ff9974', 28); ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fillStyle = '#ff9974'; ctx.fill(); ctx.shadowBlur = 0; ctx.fillStyle = '#fff1e9'; ctx.beginPath(); ctx.arc(x - 8, y - 9, 7, 0, Math.PI * 2); ctx.fill();
    burst.forEach(p => { ctx.globalAlpha = p.life; ctx.fillStyle = '#d8ff48'; ctx.fillRect(p.x, p.y, 5, 5); }); ctx.globalAlpha = 1;
    ctx.fillStyle = '#07112acc'; ctx.roundRect(26, 24, 165, 54, 16); ctx.fill(); ctx.fillStyle = '#a8c4ff'; ctx.font = '800 13px system-ui'; ctx.fillText('ORBIT SCORE', 44, 47); ctx.fillStyle = '#f5f8ff'; ctx.font = '900 26px system-ui'; ctx.fillText(String(score).padStart(2, '0'), 44, 70);
    ctx.textAlign = 'center'; ctx.fillStyle = '#f7f9ff'; ctx.font = '900 30px system-ui'; ctx.fillText(running ? 'HIT THE LIME GATE' : score ? 'ORBIT COMPLETE' : 'ORBIT TAP', c, 332); ctx.fillStyle = '#d8ff48'; ctx.font = '800 15px system-ui'; ctx.fillText(running ? `${Math.max(0, Math.ceil(30 - (performance.now() - started) / 1000))} SECONDS LEFT` : 'PRESS PLAY, THEN TAP THE LIME GATE', c, 370); ctx.textAlign = 'left';
  };
  backdrop.onload = () => draw();
  const loop = time => { if (!running) return; angle = (angle + speed / 60) % (Math.PI * 2); burst.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= .035; }); burst = burst.filter(p => p.life > 0); if (time - started >= 30000) { running = false; sdk.event('game_over', { score }); draw(); return; } draw(); frame = requestAnimationFrame(loop); };
  const restart = () => { cancelAnimationFrame(frame); score = 0; angle = 0; target = Math.PI * 1.5; speed = 1.2; burst = []; onScore(0); draw(); };
  const start = () => { restart(); running = true; started = performance.now(); sdk.rememberPlay(); sdk.event('game_start'); frame = requestAnimationFrame(loop); };
  const tap = () => { if (!running) return; sdk.firstAction(); const delta = Math.abs(Math.atan2(Math.sin(angle - target), Math.cos(angle - target))); if (delta <= .21) { score++; speed += .12; target = Math.random() * Math.PI * 2; burst = Array.from({ length: 18 }, () => ({ x: 360 + Math.cos(angle) * 225, y: 360 + Math.sin(angle) * 225, vx: (Math.random() - .5) * 8, vy: (Math.random() - .5) * 8, life: 1 })); onScore(score); sdk.event('game_score', { score }); } else { running = false; cancelAnimationFrame(frame); sdk.event('game_over', { score }); } draw(); };
  canvas.addEventListener('pointerdown', tap); draw(); return { start, restart, destroy() { running = false; cancelAnimationFrame(frame); canvas.removeEventListener('pointerdown', tap); } };
}
