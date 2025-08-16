
/* Non-intrusive overlay: hides #grid results until any filter is selected */
(function () {
  const SELECTOR_GRID = '#grid';           // id of the cards container
  const IDS = { funnel: 'funnel', attrib: 'attrib', platform: 'platform', q: 'q' };

  function $(id){ return document.getElementById(id); }
  function val(el){ return (el && el.value ? String(el.value).trim() : ''); }

  // At least one filter active?
  function anyFilterActive(){
    return !!(
      val($(IDS.funnel)) ||
      val($(IDS.attrib)) ||
      val($(IDS.platform)) ||
      val($(IDS.q))
    );
  }

  function ensureVeil(){
    const grid = document.querySelector(SELECTOR_GRID);
    if(!grid) return null;

    const wrap = grid.parentElement;
    if(!wrap) return null;
    wrap.classList.add('results-wrap');

    let veil = document.getElementById('resultsVeil');
    if(!veil){
      veil = document.createElement('div');
      veil.id = 'resultsVeil';
      veil.innerHTML = `
        <div class="veil-box">
          <span class="veil-title">Selecciona un filtro</span>
          <span>para ver los resultados</span>
        </div>`;
      wrap.appendChild(veil);
    }
    return veil;
  }

  function updateVeil(){
    const veil = ensureVeil();
    if(!veil) return;
    if (anyFilterActive()) {
      veil.classList.add('hidden');
    } else {
      veil.classList.remove('hidden');
    }
  }

  function bindListeners(){
    // General listeners for inputs
    ['change','input','keyup'].forEach(evt=>{
      document.addEventListener(evt, (e)=>{
        const t = e.target;
        if(!t) return;
        if (['funnel','attrib','platform','q'].includes(t.id)) updateVeil();
      }, true);
    });

    // Compat with the wheel (fires change on #funnel)
    const f = $('funnel');
    if (f) f.addEventListener('change', updateVeil);

    // Clear filters button(s)
    // Supports: id="btnClear", data-action="clear", or a button whose text is "Limpiar filtros"
    const btnClear = document.querySelector('[id="btnClear"], [data-action="clear"]');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if ($('funnel')) $('funnel').value = '';
        if ($('attrib')) $('attrib').value = '';
        if ($('platform')) $('platform').value = '';
        if ($('q')) $('q').value = '';
        // Allow app.js to process the clear, then re-show veil
        setTimeout(updateVeil, 50);
      });
    } else {
      // Fallback: delegate click by text content
      document.addEventListener('click', (e)=>{
        const t = e.target;
        if (!t) return;
        if (t.matches('button, .btn, [role="button"]')) {
          const label = (t.textContent||'').trim().toLowerCase();
          if (label === 'limpiar filtros' || label === 'limpiar' || label === 'reset') {
            if ($('funnel')) $('funnel').value = '';
            if ($('attrib')) $('attrib').value = '';
            if ($('platform')) $('platform').value = '';
            if ($('q')) $('q').value = '';
            setTimeout(updateVeil, 50);
          }
        }
      }, true);
    }

    // Keep veil in sync after renders (when your app mutates the grid)
    const grid = document.querySelector(SELECTOR_GRID);
    if (grid) {
      const obs = new MutationObserver(() => updateVeil());
      obs.observe(grid, { childList: true });
    }
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { ensureVeil(); updateVeil(); bindListeners(); });
  } else {
    ensureVeil(); updateVeil(); bindListeners();
  }
})();
