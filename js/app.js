
(function(){
  const els = {
    funnel: document.getElementById('funnel'),
    grid: document.getElementById('grid'),
    nores: document.getElementById('noResults')
  };

  let RAW = [];
  let FILTERED = [];

  function norm(s){ return (s||'').toString().trim().toLowerCase(); }

  function render(rows){
    els.grid.innerHTML = '';
    if(!rows || rows.length === 0){
      els.nores && (els.nores.style.display = 'block');
      return;
    }
    els.nores && (els.nores.style.display = 'none');
    rows.forEach(r => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<h3 class="font-semibold">${r.format||''}</h3>
                        <p class="text-sm text-gray-600">${r.objective||''}</p>`;
      els.grid.appendChild(card);
    });
  }

  function applyFilters(){
    const f = (els.funnel && els.funnel.value ? els.funnel.value : '').trim();
    if(!f){
      FILTERED = [];
      render(FILTERED);
      return;
    }
    FILTERED = RAW.filter(r => norm(r.funnel) === norm(f));
    render(FILTERED);
  }

  Papa.parse(window.SHEET_CSV_URL, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: (res) => {
      RAW = Array.isArray(res.data) ? res.data : [];
      // Start empty
      FILTERED = [];
      els.nores && (els.nores.style.display = 'block');
      render(FILTERED);
    },
    error: (err) => {
      console.error('Error al cargar CSV:', err);
      els.nores && (els.nores.textContent = 'Error al cargar CSV');
    }
  });

  els.funnel && els.funnel.addEventListener('change', applyFilters);
})();
