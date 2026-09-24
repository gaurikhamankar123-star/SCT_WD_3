(() => {
  'use strict';

  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const boardEl = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const levelControl = document.getElementById('level-control');

  const state = {
    mode: 'cpu',        // 'cpu' or 'pvp'
    level: 'medium',    // 'easy', 'medium' or 'hard'
    board: Array(9).fill(null),
    current: 'X',
    starter: 'X',
    over: false,
    locked: false,      // true while the computer is "thinking"
    winLine: null,
    scores: { X: 0, O: 0, D: 0 },
    timer: null
  };

  /* ---------- Build the board ---------- */

  const cells = [];
  for (let i = 0; i < 9; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cell';
    btn.addEventListener('click', () => onCellClick(i));
    boardEl.appendChild(btn);
    cells.push(btn);
  }

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const lineSvg = document.createElementNS(SVG_NS, 'svg');
  lineSvg.setAttribute('class', 'win-line');
  lineSvg.setAttribute('aria-hidden', 'true');
  boardEl.appendChild(lineSvg);

  const MARKS = {
    X: '<svg class="mark x" viewBox="0 0 100 100" aria-hidden="true">' +
       '<path d="M24 24 L76 76" pathLength="1"/><path d="M76 24 L24 76" pathLength="1"/></svg>',
    O: '<svg class="mark o" viewBox="0 0 100 100" aria-hidden="true">' +
       '<circle cx="50" cy="50" r="28" pathLength="1"/></svg>'
  };

  /* ---------- Helpers ---------- */

  const isCpuMode = () => state.mode === 'cpu';

  function playerName(p) {
    if (isCpuMode()) return p === 'X' ? 'You' : 'Computer';
    return `Player ${p}`;
  }

  function evaluate(b) {
    for (const line of LINES) {
      const [a, c, d] = line;
      if (b[a] && b[a] === b[c] && b[a] === b[d]) return { winner: b[a], line };
    }
    return b.every(Boolean) ? { draw: true } : null;
  }

  const emptyCells = b => b.map((v, i) => (v ? null : i)).filter(i => i !== null);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- Rendering ---------- */

  function renderCells() {
    cells.forEach((cell, i) => {
      const value = state.board[i];
      const row = Math.floor(i / 3) + 1;
      const col = (i % 3) + 1;
      cell.innerHTML = value ? MARKS[value] : '';
      cell.setAttribute('aria-label', `Row ${row}, column ${col}, ${value || 'empty'}`);
      cell.setAttribute('aria-disabled', String(Boolean(value) || state.over));
      cell.classList.toggle('win', Boolean(state.winLine && state.winLine.includes(i)));
    });
    boardEl.classList.toggle('finished', state.over && Boolean(state.winLine));
  }

  function renderScores() {
    document.getElementById('name-X').textContent = isCpuMode() ? 'You (X)' : 'Player X';
    document.getElementById('name-O').textContent = isCpuMode() ? 'Computer (O)' : 'Player O';
    ['X', 'O', 'D'].forEach(k => {
      document.getElementById(`value-${k}`).textContent = state.scores[k];
    });
    document.getElementById('score-X').classList.toggle('active', !state.over && state.current === 'X');
    document.getElementById('score-O').classList.toggle('active', !state.over && state.current === 'O');
  }

  function renderStatus(result) {
    if (result && result.winner) {
      const w = result.winner;
      statusEl.textContent = isCpuMode()
        ? (w === 'X' ? 'You win!' : 'Computer wins')
        : `Player ${w} wins!`;
    } else if (result && result.draw) {
      statusEl.textContent = 'It\u2019s a draw';
    } else if (isCpuMode()) {
      statusEl.textContent = state.current === 'X' ? 'Your turn' : 'Computer is thinking\u2026';
    } else {
      statusEl.textContent = `Player ${state.current}\u2019s turn`;
    }
  }

  function drawWinLine(animate) {
    if (!state.winLine) { lineSvg.innerHTML = ''; return; }
    const center = i => [
      cells[i].offsetLeft + cells[i].offsetWidth / 2,
      cells[i].offsetTop + cells[i].offsetHeight / 2
    ];
    const [x1, y1] = center(state.winLine[0]);
    const [x2, y2] = center(state.winLine[2]);
    lineSvg.innerHTML =
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" pathLength="1"${animate ? ' class="draw"' : ''}/>`;
  }

  /* ---------- Game flow ---------- */

  function placeMark(i) {
    state.board[i] = state.current;
    const result = evaluate(state.board);

    if (result) {
      state.over = true;
      if (result.winner) {
        state.winLine = result.line;
        state.scores[result.winner]++;
      } else {
        state.scores.D++;
      }
    } else {
      state.current = state.current === 'X' ? 'O' : 'X';
    }

    renderCells();
    renderScores();
    renderStatus(result);
    if (result && result.winner) drawWinLine(true);
    if (!state.over) maybeComputerMove();
  }

  function onCellClick(i) {
    if (state.over || state.locked || state.board[i]) return;
    if (isCpuMode() && state.current === 'O') return;
    placeMark(i);
  }

  function maybeComputerMove() {
    if (!isCpuMode() || state.current !== 'O' || state.over) return;
    state.locked = true;
    state.timer = setTimeout(() => {
      state.locked = false;
      placeMark(chooseMove());
    }, 550);
  }

  function newRound(swapStarter) {
    clearTimeout(state.timer);
    state.locked = false;
    if (swapStarter) state.starter = state.starter === 'X' ? 'O' : 'X';
    state.board = Array(9).fill(null);
    state.current = state.starter;
    state.over = false;
    state.winLine = null;
    lineSvg.innerHTML = '';
    renderCells();
    renderScores();
    renderStatus(null);
    maybeComputerMove();
  }

  function resetScores() {
    state.scores = { X: 0, O: 0, D: 0 };
    state.starter = 'X';
    newRound(false);
  }

  /* ---------- Computer player ---------- */

  function findWinningMove(b, player) {
    return emptyCells(b).find(i => {
      const copy = b.slice();
      copy[i] = player;
      const r = evaluate(copy);
      return r && r.winner === player;
    });
  }

  function minimax(b, turn, depth, alpha, beta) {
    const r = evaluate(b);
    if (r && r.winner) return r.winner === 'O' ? 10 - depth : depth - 10;
    if (r && r.draw) return 0;

    let best = turn === 'O' ? -Infinity : Infinity;
    for (const i of emptyCells(b)) {
      b[i] = turn;
      const score = minimax(b, turn === 'O' ? 'X' : 'O', depth + 1, alpha, beta);
      b[i] = null;
      if (turn === 'O') { best = Math.max(best, score); alpha = Math.max(alpha, best); }
      else { best = Math.min(best, score); beta = Math.min(beta, best); }
      if (beta <= alpha) break;
    }
    return best;
  }

  function bestMove() {
    const b = state.board.slice();
    let bestScore = -Infinity;
    let moves = [];
    for (const i of emptyCells(b)) {
      b[i] = 'O';
      const score = minimax(b, 'X', 1, -Infinity, Infinity);
      b[i] = null;
      if (score > bestScore) { bestScore = score; moves = [i]; }
      else if (score === bestScore) moves.push(i);
    }
    return pick(moves);
  }

  function chooseMove() {
    const free = emptyCells(state.board);

    if (state.level === 'hard') return bestMove();

    if (state.level === 'medium') {
      const win = findWinningMove(state.board, 'O');
      if (win !== undefined) return win;
      const block = findWinningMove(state.board, 'X');
      if (block !== undefined) return block;
      if (free.includes(4)) return 4;
    }

    return pick(free);
  }

  /* ---------- Controls ---------- */

  function syncControls() {
    document.querySelectorAll('#mode-group button').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.mode === state.mode));
    });
    document.querySelectorAll('#level-group button').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.dataset.level === state.level));
    });
    levelControl.hidden = !isCpuMode();
  }

  document.getElementById('mode-group').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.dataset.mode === state.mode) return;
    state.mode = btn.dataset.mode;
    syncControls();
    resetScores();
  });

  document.getElementById('level-group').addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn || btn.dataset.level === state.level) return;
    state.level = btn.dataset.level;
    syncControls();
    resetScores();
  });

  document.getElementById('new-round').addEventListener('click', () => newRound(true));
  document.getElementById('reset-scores').addEventListener('click', resetScores);
  window.addEventListener('resize', () => drawWinLine(false));

  /* ---------- Start ---------- */

  syncControls();
  newRound(false);
})();