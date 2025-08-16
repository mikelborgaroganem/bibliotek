
// Start-empty addon: adds a 'no-selection' class to <body> until any filter has value.
// Non-intrusive: doesn't modify your app's logic or renderers.
(function(){
  const IDS = { funnel: 'funnel', attrib: 'attrib', platform: 'platform', q: 'q' };
  const $ = (id)=> document.getElementById(id);
  const val = (el)=> (el && el.value ? String(el.value).trim() : '');
  const anyActive = ()=> !!(val($(IDS.funnel)) || val($(IDS.attrib)) || val($(IDS.platform)) || val($(IDS.q)));

  function applyState(){
    if (anyActive()) {
      document.body.classList.remove('no-selection');
    } else {
      document.body.classList.add('no-selection');
    }
  }

  function bind(){
    ['change','input','keyup'].forEach(evt=>{
      document.addEventListener(evt, (e)=>{
        const t = e.target;
        if(!t) return;
        if (['funnel','attrib','platform','q'].includes(t.id)) applyState();
      }, true);
    });

    // Clear button support (id or data attribute, plus fallback by label)
    const clear = ()=> { setTimeout(applyState, 30); };
    const btn = document.querySelector('[id="btnClear"], [data-action="clear"]');
    if (btn) btn.addEventListener('click', clear);
    else {
      document.addEventListener('click', (e)=>{
        const t = e.target;
        if (!t) return;
        if (t.matches('button, .btn, [role="button"]')) {
          const label = (t.textContent||'').trim().toLowerCase();
          if (label === 'limpiar filtros' || label === 'limpiar' || label === 'reset') clear();
        }
      }, true);
    }

    // Also re-evaluate when grid content changes (after your app renders)
    const grid = document.getElementById('grid');
    if (grid) {
      const obs = new MutationObserver(()=> applyState());
      obs.observe(grid, { childList: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=> { document.body.classList.add('no-selection'); bind(); applyState(); });
  } else {
    document.body.classList.add('no-selection'); bind(); applyState();
  }
})();
