
// Clean implementation: clickable segments + clickable curved labels,
// rotate selected segment's CENTER to 12 o'clock (top) without GSAP.
(function(){
  const wheel = document.getElementById('funnelWheel');
  const rotor = document.getElementById('wheel-rotor');
  const tip = document.getElementById('wheelTip');

  if(!wheel || !rotor) return;

  const segs   = rotor.querySelectorAll('.seg');
  const labels = rotor.querySelectorAll('.seg-label');

  const ANGLE_OFFSET = 90;

  function rotateTo(angleDeg){
    const target = -(angleDeg + ANGLE_OFFSET);
    rotor.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)';
    rotor.style.transform  = `rotate(${target}deg)`;
  }

  function clearActive(){ segs.forEach(s => s.classList.remove('seg-active')); }

  function setSelectFromSeg(seg){
    const sel = document.getElementById('funnel');
    if(sel && seg){ sel.value = seg.id; sel.dispatchEvent(new Event('change')); }
  }

  function showTip(text, clientX, clientY){
    if(!tip) return;
    tip.textContent = text;
    const rect = wheel.getBoundingClientRect();
    tip.style.left = (clientX - rect.left) + 'px';
    tip.style.top  = (clientY - rect.top)  + 'px';
    tip.classList.add('show');
  }
  function hideTip(){ if(tip) tip.classList.remove('show'); }

  function setOutlineActive(segId, on){
    const g = rotor.querySelector('#segment-outlines');
    if(!g) return;
    const outline = g.querySelector(`.seg-outline[data-for="${segId}"]`);
    if(outline){
      if(on) outline.classList.add('active');
      else   outline.classList.remove('active');
    }
  }

  (function buildOutlines(){
    const segGroup = rotor.querySelector('#segments');
    if(!segGroup) return;
    let outlineGroup = rotor.querySelector('#segment-outlines');
    if(!outlineGroup){
      outlineGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      outlineGroup.setAttribute('id','segment-outlines');
      outlineGroup.setAttribute('fill','none');
      outlineGroup.setAttribute('stroke-linecap','round');
      segGroup.parentNode.insertBefore(outlineGroup, segGroup);
    }
    outlineGroup.innerHTML = '';
    segs.forEach(seg => {
      const href = seg.getAttribute('href') || seg.getAttribute('xlink:href');
      const useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      if(href){
        useEl.setAttributeNS('http://www.w3.org/1999/xlink','href', href);
      }
      useEl.setAttribute('class','seg-outline');
      useEl.setAttribute('data-for', seg.id);
      useEl.setAttribute('stroke','#ffffff');
      const sw = seg.getAttribute('stroke-width') || (segGroup.getAttribute('stroke-width') || '60');
      useEl.setAttribute('stroke-width', String(parseFloat(sw) + 8));
      outlineGroup.appendChild(useEl);
    });
  })();

  function handleSelectBySeg(seg){
    if(!seg) return;
    const angle = parseFloat(seg.getAttribute('data-angle')) || 0;
    rotateTo(angle);
    clearActive();
    seg.classList.add('seg-active');
    setSelectFromSeg(seg);
  }

  segs.forEach(seg => {
    seg.addEventListener('click', () => handleSelectBySeg(seg));
    seg.addEventListener('mouseenter', (e) => {
      const kpi = seg.getAttribute('data-kpi') || '';
      showTip(kpi, e.clientX, e.clientY);
      setOutlineActive(seg.id, true);
      seg.classList.add('seg-hover');
    });
    seg.addEventListener('mousemove', (e) => showTip(tip ? tip.textContent : '', e.clientX, e.clientY));
    seg.addEventListener('mouseleave', () => {
      hideTip();
      setOutlineActive(seg.id, false);
      seg.classList.remove('seg-hover');
    });
  });

  labels.forEach(lbl => {
    lbl.style.pointerEvents = 'visiblePainted';
    lbl.addEventListener('click', () => {
      const id = lbl.getAttribute('data-for');
      const seg = rotor.querySelector('.seg#' + CSS.escape(id));
      handleSelectBySeg(seg);
    });
    lbl.addEventListener('mouseenter', (e) => {
      const id = lbl.getAttribute('data-for');
      const seg = rotor.querySelector('.seg#' + CSS.escape(id));
      if(seg){
        const kpi = seg.getAttribute('data-kpi') || '';
        showTip(kpi, e.clientX, e.clientY);
        setOutlineActive(id, true);
        seg.classList.add('seg-hover');
      }
    });
    lbl.addEventListener('mousemove', (e) => showTip(tip ? tip.textContent : '', e.clientX, e.clientY));
    lbl.addEventListener('mouseleave', () => {
      const id = lbl.getAttribute('data-for');
      const seg = rotor.querySelector('.seg#' + CSS.escape(id));
      hideTip();
      setOutlineActive(id, false);
      if(seg){ seg.classList.remove('seg-hover'); }
    });
  });
})();
