
// --- Interacciones de la rueda (sin autoplay) ---
(function(){
  const els = {
    wheel: document.getElementById('funnelWheel'),
    rotor: document.getElementById('wheel-rotor'),
    tip: document.getElementById('wheelTip')
  };
  if(!els.wheel || !els.rotor) return;

  function rotateTo(angleDeg){
    els.rotor.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)';
    els.rotor.style.transform = 'rotate(' + (-angleDeg) + 'deg)';
  }
  function showTip(text, x, y){
    els.tip.textContent = text;
    els.tip.style.left = x + 'px';
    els.tip.style.top = y + 'px';
    els.tip.classList.add('show');
  }
  function hideTip(){ els.tip.classList.remove('show'); }

  const segs = els.rotor.querySelectorAll('.seg');
  const clearActive = () => segs.forEach(s => s.classList.remove('seg-active'));

  segs.forEach(seg => {
    seg.addEventListener('mouseenter', (e) => {
      const kpi = seg.getAttribute('data-kpi') || '';
      const rect = els.wheel.getBoundingClientRect();
      showTip(kpi, e.clientX - rect.left, e.clientY - rect.top);
    });
    seg.addEventListener('mousemove', (e) => {
      const rect = els.wheel.getBoundingClientRect();
      els.tip.style.left = (e.clientX - rect.left) + 'px';
      els.tip.style.top = (e.clientY - rect.top) + 'px';
    });
    seg.addEventListener('mouseleave', hideTip);

    seg.addEventListener('click', () => {
      const angle = parseFloat(seg.getAttribute('data-angle')) || 0;
      rotateTo(angle);
      clearActive();
      seg.classList.add('seg-active');
      const sel = document.getElementById('funnel');
      if(sel){ sel.value = seg.id; sel.dispatchEvent(new Event('change')); }
    });
  });
})();
