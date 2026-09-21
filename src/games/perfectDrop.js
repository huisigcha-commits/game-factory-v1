export function mountGame({ container, sdk, onScore }) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 720;
  canvas.className = 'game-canvas';
  container.replaceChildren(canvas);

  const ctx = canvas.getContext('2d');
  let frame = 0, running = false, score = 0, x = 110, direction = 1, width = 230, placed = [];
  const speed = () => 4 + score * 0.32;
  const nextY = () => 620 - placed.length * 44;
  const drawBlock = (left, top, blockWidth, color) => { ctx.fillStyle = color; ctx.fillRect(left, top, blockWidth, 32); };
  const draw = () => {
    ctx.fillStyle = '#141b31'; ctx.fillRect(0, 0, 720, 720);
    ctx.fillStyle = '#9da5bc'; ctx.font = '600 22px system-ui'; ctx.textAlign = 'center';
    ctx.fillText(running ? 'CLICK OR PRESS SPACE TO DROP' : score ? 'PRESS RESTART FOR ANOTHER TOWER' : 'PRESS PLAY TO BEGIN', 360, 72);
    drawBlock(245, 652, 230, '#344266');
    placed.forEach((block) => drawBlock(block.x, block.y, block.width, '#d8ff48'));
    if (running) drawBlock(x, nextY() - 82, width, '#ff9974');
    ctx.fillStyle = '#9da5bc'; ctx.font = '20px system-ui';
    ctx.fillText(`Tower: ${placed.length}  ·  Keep the overlap`, 360, 695);
  };
  const gameOver = () => { running = false; cancelAnimationFrame(frame); sdk.event('game_over', { score }); draw(); };
  const loop = () => { if (!running) return; x += direction * speed(); if (x <= 24 || x + width >= 696) direction *= -1; draw(); frame = requestAnimationFrame(loop); };
  const restart = () => { cancelAnimationFrame(frame); running = false; score = 0; x = 110; direction = 1; width = 230; placed = []; onScore(0); draw(); };
  const start = () => { restart(); running = true; sdk.rememberPlay(); sdk.event('game_start'); frame = requestAnimationFrame(loop); };
  const drop = () => {
    if (!running) return;
    sdk.firstAction();
    const base = placed.at(-1) || { x: 245, width: 230, y: 652 };
    const left = Math.max(x, base.x), right = Math.min(x + width, base.x + base.width), overlap = right - left;
    if (overlap < 16 || nextY() < 115) return gameOver();
    width = overlap; x = left; placed.push({ x: left, y: nextY(), width }); score += 1; onScore(score); sdk.event('game_score', { score });
    x = Math.max(24, Math.min(696 - width, x)); direction *= -1; draw();
  };
  const keydown = (event) => { if (event.code === 'Space' || event.code === 'Enter') { event.preventDefault(); drop(); } };
  canvas.addEventListener('pointerdown', drop); window.addEventListener('keydown', keydown); draw();
  return { start, restart, destroy() { running = false; cancelAnimationFrame(frame); canvas.removeEventListener('pointerdown', drop); window.removeEventListener('keydown', keydown); } };
}
