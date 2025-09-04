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
    const names = {
      K: 'King',
      Q: 'Queen',
      R: 'Rook',
      B: 'Bishop',
      N: 'Knight',
      A: 'Archer',
      W: 'Diplomat',
      P: 'Pawn'
    };
    const order = ['K','Q','R','B','N','A','W','P'];

    if (tblBody && window.piecePoints && typeof window.piecePoints === 'object') {
      tblBody.innerHTML = order.map(k => {
        const v = window.piecePoints[k] ?? '';
        return `<tr><td>${names[k]}</td><td>${v}</td></tr>`;
      }).join('');
    }
  } catch {}
})();
