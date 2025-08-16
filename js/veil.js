
/* Overlay wraps ONLY the #grid element to avoid covering filters */
(function () {
  const GRID_SEL = '#grid';
  const IDS = { funnel: 'funnel', attrib: 'attrib', platform: 'platform', q: 'q' };

  const $ = (id) => document.getElementById(id);
  const get = (sel) => document.querySelector(sel);
  const val = (el) => (el && el.value ? String(el.value).trim() : '');

  function anyFilterActive(){
    return !!(val($(IDS.funnel)) || val($(IDS.attrib)) || val($(IDS.platform)) || val($(IDS.q)));
  }

  // Create a dedicated wrapper around #grid so the veil only covers results
  function ensureWrapperAndVeil(){
    const grid = get(GRID_SEL);
    if(!grid) return null;

    let wrap = grid.closest('.results-wrap');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'results-wrap';
      grid.parentNode.insertBefore(wrap, grid);
      wrap.appendChild(grid); // move grid inside the wrapper
    }

    let veil = document.getElementById('resultsVeil');
    if(!veil){
      veil = document.createElement('div');
      veil.id = 'resultsVeil';
      veil.innerHTML = `
        <div class="veil-box">
          <span class="veil-title">Selecciona un filtro</span>
          <span>para ver los resultados</span>
        </div>`;
      wrap.appendChild(veil); // add veil inside wrapper (covers only grid area)
    }

    return veil;
  }

  function updateVeil(){
    const veil = ensureWrapperAndVeil();
    if(!veil) return;
    if (anyFilterActive()) veil.classList.add('hidden');
    else veil.classList.remove('hidden');
  }

  function bindListeners(){
    // Listen to changes on known filters
    ['change','input','keyup'].forEach(evt=>{
      document.addEventListener(evt, (e)=>{
        const t = e.target;
        if(!t) return;
        if (['funnel','attrib','platform','q'].includes(t.id)) updateVeil();
      }, true);
    });

    // compat with wheel (fires change on #funnel)
    const f = $(IDS.funnel);
    if (f) f.addEventListener('change', updateVeil);

    // Clear filters buttons
    const btnClear = document.querySelector('[id="btnClear"], [data-action="clear"]');
    const doClear = () => {
      if ($(IDS.funnel)) $(IDS.funnel).value = '';
      if ($(IDS.attrib)) $(IDS.attrib).value = '';
      if ($(IDS.platform)) $(IDS.platform).value = '';
      if ($(IDS.q)) $(IDS.q).value = '';
      setTimeout(updateVeil, 50);
    };
    if (btnClear) btnClear.addEventListener('click', doClear);
    else {
      document.addEventListener('click', (e)=>{
        const t = e.target;
        if (!t) return;
        if (t.matches('button, .btn, [role="button"]')) {
          const label = (t.textContent||'').trim().toLowerCase();
          if (label === 'limpiar filtros' || label === 'limpiar' || label === 'reset') doClear();
        }
      }, true);
    }

    // Keep veil synced with grid mutations
    const grid = get(GRID_SEL);
    if (grid) {
      const obs = new MutationObserver(() => updateVeil());
      obs.observe(grid, { childList: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { ensureWrapperAndVeil(); updateVeil(); bindListeners(); });
  } else {
    ensureWrapperAndVeil(); updateVeil(); bindListeners();
  }
})();
