
// Rueda tipo anillo sin GSAP: centra texto y rota con CSS
(function(){
  const wheel = document.getElementById('funnelWheel');
  const rotor = document.getElementById('wheel-rotor');
  const tip = document.getElementById('wheelTip');
  if(!wheel || !rotor) return;

  const segs = rotor.querySelectorAll('.seg');
  const labels = rotor.querySelectorAll('.seg-label');
  const ANGLE_OFFSET = 90; // adjust if needed
  const clearActive = () => segs.forEach(s => s.classList.remove('seg-active'));

  function rotateTo(angleDeg){
    // center selected segment at 12 o'clock
    angleDeg = (angleDeg + ANGLE_OFFSET) % 360;
    rotor.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)';
    rotor.style.transform = 'rotate(' + (-angleDeg) + 'deg)';
  }

  function showTip(text, x, y){
    tip.textContent = text;
    const rect = wheel.getBoundingClientRect();
    tip.style.left = (x - rect.left) + 'px';
    tip.style.top = (y - rect.top) + 'px';
    tip.classList.add('show');
  }
  function hideTip(){ tip.classList.remove('show'); }

  function handleSelect(angle, seg){
      rotateTo(angle);
      clearActive();
      if(seg){ seg.classList.add('seg-active'); }
      const sel = document.getElementById('funnel');
      if(sel && seg){ sel.value = seg.id; sel.dispatchEvent(new Event('change')); }
    }

  segs.forEach(seg => {
    seg.addEventListener('mouseenter', (e) => {
      const kpi = seg.getAttribute('data-kpi') || '';
      showTip(kpi, e.clientX, e.clientY);
    });
    seg.addEventListener('mousemove', (e) => {
      showTip(tip.textContent, e.clientX, e.clientY);
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

  labels.forEach(lbl => {
    lbl.addEventListener('click', (e) => {
      const angle = parseFloat(lbl.getAttribute('data-angle')) || 0;
      const id = lbl.getAttribute('data-for');
      const seg = rotor.querySelector('.seg#' + CSS.escape(id));
      handleSelect(angle, seg);
    });
    lbl.addEventListener('mouseenter', (e) => {
      const id = lbl.getAttribute('data-for');
      const seg = rotor.querySelector('.seg#' + CSS.escape(id));
      if(seg){
        const kpi = seg.getAttribute('data-kpi') || '';
        showTip(kpi, e.clientX, e.clientY);
      }
    });
    lbl.addEventListener('mousemove', (e) => showTip(tip.textContent, e.clientX, e.clientY));
    lbl.addEventListener('mouseleave', hideTip);
  });

  // Enhance label hover to simulate segment hover effect
  labels.forEach(lbl => {
    lbl.addEventListener('mouseenter', (e) => {
      const id = lbl.getAttribute('data-for');
      const seg = rotor.querySelector('.seg#' + CSS.escape(id));
      if(seg){ seg.classList.add('seg-hover'); }
    });
    lbl.addEventListener('mouseleave', (e) => {
      const id = lbl.getAttribute('data-for');
      const seg = rotor.querySelector('.seg#' + CSS.escape(id));
      if(seg){ seg.classList.remove('seg-hover'); }
    });
  });
