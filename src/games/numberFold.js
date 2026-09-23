const size = 4;

export function mountGame({ container, sdk, onScore }) {
  let cells, score = 0, running = false, start, combo = 0;
  const shell = document.createElement('div'); shell.className = 'number-fold-stage';
  const grid = document.createElement('div'); grid.className = 'number-grid'; shell.append(grid); container.replaceChildren(shell);
  const spawn = () => { const open = cells.map((n, i) => n ? null : i).filter(i => i !== null); if (open.length) cells[open[Math.floor(Math.random() * open.length)]] = Math.random() < .9 ? 2 : 4; };
  const render = () => { shell.dataset.combo = combo ? `+${combo}` : ''; grid.innerHTML = cells.map(n => `<button class="number-tile n${n}" disabled>${n || ''}</button>`).join(''); };
  const reset = () => { cells = Array(16).fill(0); score = 0; combo = 0; spawn(); spawn(); onScore(0); render(); };
  const fold = values => { const packed = values.filter(Boolean), out = []; let gained = 0; for (let i = 0; i < packed.length; i++) { if (packed[i] === packed[i + 1]) { out.push(packed[i] * 2); gained += packed[i] * 2; i++; } else out.push(packed[i]); } return { values: [...out, ...Array(size - out.length).fill(0)], gained }; };
  const move = direction => { if (!running) return; sdk.firstAction(); const before = cells.join(','), get = (r, c) => cells[r * size + c], set = (r, c, value) => cells[r * size + c] = value; let gained = 0; if (['left', 'right'].includes(direction)) for (let r = 0; r < size; r++) { const forward = direction === 'left', next = fold(Array.from({ length: size }, (_, c) => get(r, forward ? c : size - 1 - c))); gained += next.gained; next.values.forEach((value, i) => set(r, forward ? i : size - 1 - i, value)); } else for (let c = 0; c < size; c++) { const forward = direction === 'up', next = fold(Array.from({ length: size }, (_, r) => get(forward ? r : size - 1 - r, c))); gained += next.gained; next.values.forEach((value, i) => set(forward ? i : size - 1 - i, c, value)); } if (before === cells.join(',')) return; score += gained; combo = gained; spawn(); onScore(score); sdk.event('game_score', { score }); render(); };
  const key = event => { const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }; if (map[event.key]) { event.preventDefault(); move(map[event.key]); } };
  const down = event => start = [event.clientX, event.clientY], up = event => { if (!start) return; const dx = event.clientX - start[0], dy = event.clientY - start[1]; if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) move(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up'); start = null; };
  sdk.listen(window, 'keydown', key); sdk.listen(grid, 'pointerdown', down); sdk.listen(grid, 'pointerup', up); reset(); return { start() { reset(); running = true; sdk.rememberPlay(); sdk.event('game_start'); }, restart() { reset(); running = true; }, destroy() { running = false; } };
}
