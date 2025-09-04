(function wireHelpOverlay() {
  const helpButton       = document.getElementById('helpButton');
  const helpOverlay      = document.getElementById('helpOverlay');
  const helpPanel        = document.getElementById('helpPanel');
  const helpClose        = document.getElementById('helpClose');
  const expandAllBtn     = document.getElementById('expandAll');
  const collapseAllBtn   = document.getElementById('collapseAll');

  if (!helpButton || !helpOverlay || !helpPanel) return;

const openHelp = () => {
  if (!helpOverlay) return;
  helpOverlay.removeAttribute('hidden');   // show (works even if CSS missing)
  helpOverlay.classList.add('open');       // visible/interactive state
  helpOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // optional: stop background scroll
};

const closeHelp = () => {
  if (!helpOverlay) return;
  helpOverlay.classList.remove('open');    // hide via CSS state
  helpOverlay.setAttribute('aria-hidden', 'true');
  helpOverlay.setAttribute('hidden', '');  // ensure display:none
  document.body.style.overflow = '';       // restore scroll
};

  // Open/close
  helpButton.addEventListener('click', openHelp);
  helpClose?.addEventListener('click', closeHelp);
  helpOverlay.addEventListener('click', (e) => { if (e.target === helpOverlay) closeHelp(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && helpOverlay.classList.contains('open')) closeHelp(); });

  // Expand/Collapse all
  expandAllBtn?.addEventListener('click', () => helpPanel.querySelectorAll('details').forEach(d => d.open = true));
  collapseAllBtn?.addEventListener('click', () => helpPanel.querySelectorAll('details').forEach(d => d.open = false));

  // Dynamically render Points table with FULL names if window.piecePoints exists
  try {
    const tblBody = document.getElementById('helpPointsBody');
    // Data dictionaries (full names + moves)
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
// Fallback symbols if window.piecesUnicode is not set
const _fallbackSymbols = { P:'♟', R:'♜', N:'♞', B:'♝', Q:'♛', K:'♚', A:'ᕕ', W:'ษ' };
const _sym = (k) => (window.piecesUnicode?.[k] || _fallbackSymbols[k] || k);
const ORDER = ['K','Q','R','B','N','A','W','P'];

// Fill Points table with a Symbol column
(function fillPointsTable(){
  const body = document.getElementById('helpPointsBody');
  if (!body) return;
  const pp = window.piecePoints || {K:20,Q:12,W:6,R:4,B:4,N:3,A:3,P:1};
  body.innerHTML = ORDER.map(k => `
    <tr>
      <td>${_names[k]}</td>
      <td class="sym">${_sym(k)}</td>
      <td>${pp[k] ?? ''}</td>
    </tr>
  `).join('');
})();

// Build the “Pieces at a glance” grid
(function fillPiecesGrid(){
  const host = document.getElementById('helpPiecesGrid');
  if (!host) return;
  const pp = window.piecePoints || {K:20,Q:12,W:6,R:4,B:4,N:3,A:3,P:1};
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
})();
