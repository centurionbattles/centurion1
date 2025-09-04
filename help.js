(function () {
  // Run after DOM is ready
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(() => {
    const helpButton       = document.getElementById('helpButton');
    const helpOverlay      = document.getElementById('helpOverlay');
    const helpPanel        = document.getElementById('helpPanel');
    const helpClose        = document.getElementById('helpClose');
    const expandAllBtn     = document.getElementById('expandAll');
    const collapseAllBtn   = document.getElementById('collapseAll');

    // Log what we found to help debug
    console.log('Help wiring:', {
      helpButton: !!helpButton,
      helpOverlay: !!helpOverlay,
      helpPanel: !!helpPanel,
      helpClose: !!helpClose
    });

    if (!helpButton || !helpOverlay || !helpPanel) return;

    const openHelp = () => {
      helpOverlay.removeAttribute('hidden');     // ensure visible even w/o CSS
      helpOverlay.classList.add('open');         // set visible state
      helpOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (typeof hidePieceTooltip === 'function') hidePieceTooltip();
    };

    const closeHelp = () => {
      helpOverlay.classList.remove('open');
      helpOverlay.setAttribute('aria-hidden', 'true');
      helpOverlay.setAttribute('hidden', '');    // guarantee display:none
      document.body.style.overflow = '';
    };

    // Wire controls
    helpButton.addEventListener('click', openHelp);
    helpClose?.addEventListener('click', closeHelp);
    helpOverlay.addEventListener('click', (e) => { if (e.target === helpOverlay) closeHelp(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && helpOverlay.classList.contains('open')) closeHelp();
    });

    // Expand/Collapse all
    expandAllBtn?.addEventListener('click', () => helpPanel.querySelectorAll('details').forEach(d => d.open = true));
    collapseAllBtn?.addEventListener('click', () => helpPanel.querySelectorAll('details').forEach(d => d.open = false));

    // ===== Build Points table + Pieces grid (full names + symbols) =====
    const _names = { K:'King', Q:'Queen', R:'Rook', B:'Bishop', N:'Knight', A:'Archer', W:'Diplomat', P:'Pawn' };
    const _moves = {
      P:'Forward 1 (2 from start); diagonal capture; promotes on last rank.',
      R:'Any squares orthogonally; cannot jump.',
      N:'L-shape (2+1); can jump.',
      B:'Any squares diagonally; cannot jump.',
      Q:'Rook + Bishop moves.',
      K:'1 square in any direction.',
      A:'Exactly 2 squares in any direction; can jump.',
      W:'1 square any direction; can convert adjacent enemy (not King).'
    };
    const _fallbackSymbols = { P:'♟', R:'♜', N:'♞', B:'♝', Q:'♛', K:'♚', A:'ᕕ', W:'ษ' };
    const _sym = (k) => (window.piecesUnicode?.[k] || _fallbackSymbols[k] || k);
    const ORDER = ['K','Q','R','B','N','A','W','P'];

    function fillPointsTable() {
      const body = document.getElementById('helpPointsBody');
      if (!body) return;
      const pp = window.piecePoints || {K:20,Q:12,R:4,B:4,N:3,A:3,W:6,P:1};
      body.innerHTML = ORDER.map(k => `
        <tr>
          <td>${_names[k]}</td>
          <td class="sym">${_sym(k)}</td>
          <td>${pp[k] ?? ''}</td>
        </tr>
      `).join('');
    }

    function fillPiecesGrid() {
      const host = document.getElementById('helpPiecesGrid');
      if (!host) return;
      const pp = window.piecePoints || {K:20,Q:12,R:4,B:4,N:3,A:3,W:6,P:1};
      host.innerHTML = ORDER.map(k => `
        <div class="piece-card">
          <div class="piece-sigil">${_sym(k)}</div>
          <div>
            <div class="piece-name">${_names[k]}</div>
            <div class="piece-moves">${_moves[k]}</div>
            <div class="piece-points">${pp[k]} points</div>
          </div>
        </div>
      `).join('');
    }

    try { fillPointsTable(); fillPiecesGrid(); } catch (e) { /* keep static fallback */ }

    // Expose for quick console testing
    window.openHelp = openHelp;
    window.closeHelp = closeHelp;

    console.log('Help wired ✓');
  });
})();
