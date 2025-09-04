(() => {
  const onReady = (fn) =>
    (document.readyState !== 'loading')
      ? fn()
      : document.addEventListener('DOMContentLoaded', fn);

  onReady(() => {
    // ---- cache elements
    const helpButton       = document.getElementById('helpButton');
    const helpOverlay      = document.getElementById('helpOverlay');
    const helpPanel        = document.getElementById('helpPanel');
    const helpClose        = document.getElementById('helpClose');
    const expandAllBtn     = document.getElementById('expandAll');
    const collapseAllBtn   = document.getElementById('collapseAll');

    if (!helpButton || !helpOverlay || !helpPanel) return;

    // ---- open/close
    const openHelp = () => {
      helpOverlay.removeAttribute('hidden');
      helpOverlay.classList.add('open');
      helpOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (typeof window.hidePieceTooltip === 'function') window.hidePieceTooltip();
    };

    const closeHelp = () => {
      helpOverlay.classList.remove('open');
      helpOverlay.setAttribute('aria-hidden', 'true');
      helpOverlay.setAttribute('hidden', '');
      document.body.style.overflow = '';
    };

    helpButton.addEventListener('click', openHelp);
    helpClose && helpClose.addEventListener('click', closeHelp);
    helpOverlay.addEventListener('click', (e) => { if (e.target === helpOverlay) closeHelp(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && helpOverlay.classList.contains('open')) closeHelp();
    });

    // ---- expand/collapse all
    expandAllBtn && expandAllBtn.addEventListener('click', () => {
      helpPanel.querySelectorAll('details').forEach(d => d.open = true);
    });
    collapseAllBtn && collapseAllBtn.addEventListener('click', () => {
      helpPanel.querySelectorAll('details').forEach(d => d.open = false);
    });

    // ---- data dicts
    const NAMES = { K:'King', Q:'Queen', R:'Rook', B:'Bishop', N:'Knight', A:'Archer', W:'Diplomat', P:'Pawn' };
    const MOVES = {
      P:'Forward 1 (2 from start); diagonal capture; promotes on last rank.',
      R:'Any squares orthogonally; cannot jump.',
      N:'L-shape (2+1); can jump.',
      B:'Any squares diagonally; cannot jump.',
      Q:'Rook + Bishop moves.',
      K:'1 square in any direction.',
      A:'Exactly 2 squares in any direction; can jump.',
      W:'1 square any direction; can convert adjacent enemy (not King).'
    };
    const FALLBACK_SYM = { P:'♟', R:'♜', N:'♞', B:'♝', Q:'♛', K:'♚', A:'ᕕ', W:'ษ' };
    const sym = (k) => (window.piecesUnicode?.[k] || FALLBACK_SYM[k] || k);
    const ORDER = ['K','Q','R','B','N','A','W','P'];

    // ---- renderers
    function fillPointsTable() {
      const body = document.getElementById('helpPointsBody');
      if (!body) return;
      const pp = window.piecePoints || {K:20,Q:12,R:4,B:4,N:3,A:3,W:6,P:1};
      body.innerHTML = ORDER.map(k => (
        `<tr>
          <td>${NAMES[k]}</td>
          <td class="sym">${sym(k)}</td>
          <td>${pp[k] ?? ''}</td>
        </tr>`
      )).join('');
    }

    function fillPiecesGrid() {
      const host = document.getElementById('helpPiecesGrid');
      if (!host) return;
      const pp = window.piecePoints || {K:20,Q:12,R:4,B:4,N:3,A:3,W:6,P:1};
      host.innerHTML = ORDER.map(k => (
        `<div class="piece-card">
          <div class="piece-sigil">${sym(k)}</div>
          <div>
            <div class="piece-name">${NAMES[k]}</div>
            <div class="piece-moves">${MOVES[k]}</div>
            <div class="piece-points">${pp[k]} points</div>
          </div>
        </div>`
      )).join('');
    }

    // ---- build UI
    try { fillPointsTable(); fillPiecesGrid(); } catch (e) { /* keep static fallback */ }

    // expose helpers for console testing
    window.openHelp = openHelp;
    window.closeHelp = closeHelp;
  });
})();
