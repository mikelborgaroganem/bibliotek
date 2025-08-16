
// --- App: carga CSV, filtros, render y modal ---
const SHEET_CSV_URL = window.SHEET_CSV_URL;

let RAW = [];
let FILTERED = [];

const els = {
  status: document.getElementById('status'),
  count: document.getElementById('count'),
  lastSync: document.getElementById('lastSync'),
  grid: document.getElementById('grid'),
  funnel: document.getElementById('funnel'),
  attrib: document.getElementById('attrib'),
  platform: document.getElementById('platform'),
  q: document.getElementById('q'),
  btnClear: document.getElementById('btn-clear'),
  btnExport: document.getElementById('btn-export'),
  sheetLink: document.getElementById('sheet-link'),
  modal: document.getElementById('modal'),
  modalClose: document.getElementById('modalClose'),
  modalTitle: document.getElementById('modalTitle'),
  modalObjective: document.getElementById('modalObjective'),
  modalKpis: document.getElementById('modalKpis'),
  modalSpecs: document.getElementById('modalSpecs'),
  modalBuying: document.getElementById('modalBuying'),
  modalBudget: document.getElementById('modalBudget'),
  modalNotes: document.getElementById('modalNotes'),
  modalBadges: document.getElementById('modalBadges'),
  modalExample: document.getElementById('modalExample'),
  modalSpecPDF: document.getElementById('modalSpecPDF'),
  modalMedia: document.getElementById('modalMedia'),
};

function norm(v){ return (v || '').toString().trim(); }
function includes(hay, needle){ return hay.toLowerCase().includes(needle.toLowerCase()); }

function badge(text, type="default"){
  const map = {
    default: "bg-gray-100 text-gray-800",
    funnel: {
      Awareness: "bg-yellow-100 text-yellow-900",
      Consideration: "bg-blue-100 text-blue-900",
      Conversion: "bg-green-100 text-green-900",
      Loyalty: "bg-purple-100 text-purple-900",
    },
    attrib: "bg-indigo-100 text-indigo-900",
    platform: "bg-gray-100 text-gray-800",
  };
  let cls = map[type] || map.default;
  if(type === 'funnel' && map.funnel[text]) cls = map.funnel[text];
  return `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cls}">${text}</span>`;
}

function render(items){
  els.count.textContent = items.length;
  els.grid.innerHTML = items.map(row => {
    const f = norm(row.funnel);
    const a = norm(row.attribution);
    const p = norm(row.platform);
    const title = norm(row.format) || 'Formato sin nombre';
    const objective = norm(row.objective);
    const kpi = norm(row.kpi);
    const example = norm(row.example_url);
    return `
    <article class="card p-0 flex flex-col">
      ${row.thumb_url ? `<div class="aspect-video w-full overflow-hidden rounded-t-2xl bg-gray-100"><img src="${row.thumb_url}" alt="${title}" class="w-full h-full object-cover"/></div>` : ''}
      <div class="p-4 flex flex-col gap-3">
        <div class="flex items-start gap-2 flex-wrap">
          ${f ? badge(f, 'funnel') : ''}
          ${a ? badge(a, 'attrib') : ''}
          ${p ? badge(p, 'platform') : ''}
        </div>
        <h3 class="text-lg font-semibold leading-tight">${title}</h3>
        ${objective ? `<p class="text-sm text-gray-700">${objective}</p>` : ''}
        ${kpi ? `<p class="text-xs text-gray-600"><span class='font-medium'>KPI:</span> ${kpi}</p>` : ''}
        <div class="mt-auto flex items-center gap-2">
          <button class="px-3 py-2 rounded-xl bg-gray-900 text-white hover:bg-black" data-id="${norm(row.id)}">Ver detalle</button>
          ${example ? `<a href="${example}" target="_blank" rel="noopener" class="text-sm text-indigo-600 hover:underline">Ejemplo</a>` : ''}
          ${row.spec_pdf_url ? `<a href="${row.spec_pdf_url}" target="_blank" rel="noopener" class="text-sm text-indigo-600 hover:underline">Specs</a>` : ''}
        </div>
      </div>
    </article>`;
  }).join('');

  els.grid.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', () => openDetail(btn.getAttribute('data-id')));
  });
}

function openDetail(id){
  const row = RAW.find(r => norm(r.id) === norm(id));
  if(!row) return;
  els.modalTitle.textContent = norm(row.format) || 'Formato';
  els.modalObjective.textContent = norm(row.objective);
  els.modalKpis.textContent = norm(row.kpi);
  els.modalSpecs.textContent = norm(row.creative_specs);
  els.modalBuying.textContent = norm(row.buying_method);
  els.modalBudget.textContent = norm(row.min_budget);
  els.modalNotes.textContent = norm(row.notes);
  els.modalBadges.innerHTML = `
    ${row.funnel ? badge(norm(row.funnel), 'funnel') : ''}
    ${row.attribution ? badge(norm(row.attribution), 'attrib') : ''}
    ${row.platform ? badge(norm(row.platform), 'platform') : ''}
  `;

  const t = (row.media_type || '').toLowerCase();
  const media = norm(row.media_url);
  let mediaHTML = '';
  if(media){
    if(t === 'video' || /\.mp4($|\?)/i.test(media)){
      mediaHTML = `<video src="${media}" controls class="w-full h-auto"></video>`;
    } else if(t === 'iframe' || /youtube|vimeo|player|teads/i.test(media)){
      const url = media.replace('watch?v=', 'embed/');
      mediaHTML = `<div class="aspect-video"><iframe src="${url}" class="w-full h-full" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
    } else {
      mediaHTML = `<img src="${media}" alt="${norm(row.format)}" class="w-full h-auto"/>`;
    }
  }
  els.modalMedia.innerHTML = mediaHTML;

  const ex = norm(row.example_url);
  els.modalExample.href = ex || '#';
  els.modalExample.classList.toggle('hidden', !ex);

  const sp = norm(row.spec_pdf_url);
  els.modalSpecPDF.href = sp || '#';
  els.modalSpecPDF.classList.toggle('hidden', !sp);

  els.modal.showModal();
}

function applyFilters(){
  const f = els.funnel.value.trim();
  const a = els.attrib.value.trim();
  const p = els.platform.value.trim();
  const q = els.q.value.trim();

  FILTERED = RAW.filter(r => {
    const okF = !f || norm(r.funnel) === f;
    const okA = !a || norm(r.attribution) === a;
    const okP = !p || includes(norm(r.platform), p);
    const blob = [r.format, r.objective, r.kpi, r.creative_specs, r.platform, r.notes].map(norm).join(' ');
    const okQ = !q || includes(blob, q);
    return okF && okA && okP && okQ;
  });
  render(FILTERED);
}

function debounce(fn, ms=250){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), ms); }; }

function exportCSV(rows){
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'formatos_filtrados.csv';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

async function load(){
  if(!SHEET_CSV_URL || !SHEET_CSV_URL.includes('output=csv')){
    els.status.textContent = 'Configura SHEET_CSV_URL';
    return;
  }
  els.sheetLink.href = SHEET_CSV_URL; els.sheetLink.classList.remove('hidden');
  els.status.textContent = 'Cargando…';

  const res = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
  const text = await res.text();

  const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
  const rows = parsed.data.map(r => ({
    id: r.id || r.ID || '',
    format: r.format || r.Formato || r.nombre || '',
    platform: r.platform || r.Plataforma || r.canal || '',
    funnel: r.funnel || r.Funnel || r.etapa || '',
    attribution: r.attribution || r.Attribution || r.atribucion || '',
    objective: r.objective || r.Objetivo || '',
    kpi: r.kpi || r.KPI || '',
    creative_specs: r.creative_specs || r.Specs || r.especificaciones || '',
    buying_method: r.buying_method || r.Compra || '',
    min_budget: r.min_budget || r.Budget || '',
    notes: r.notes || r.Notas || '',
    example_url: r.example_url || r.Ejemplo || '',
    thumb_url: r.thumb_url || r.thumbnail || r.imagen || '',
    media_url: r.media_url || r.creative_url || r.demo || '',
    media_type: (r.media_type || r.tipo || '').toLowerCase(),
    spec_pdf_url: r.spec_pdf_url || r.specs_url || '',
  }));

  RAW = rows;
  FILTERED = rows;
  render(FILTERED);

  els.status.textContent = 'Listo';
  els.lastSync.textContent = 'Actualizado ' + new Date().toLocaleString();
}

// Eventos
els.funnel.addEventListener('change', applyFilters);
els.attrib.addEventListener('change', applyFilters);
els.platform.addEventListener('input', debounce(applyFilters, 200));
els.q.addEventListener('input', debounce(applyFilters, 200));
els.btnClear.addEventListener('click', () => { els.funnel.value = ''; els.attrib.value = ''; els.platform.value = ''; els.q.value = ''; applyFilters(); });
els.btnExport.addEventListener('click', () => exportCSV(FILTERED));
els.modalClose.addEventListener('click', () => els.modal.close());
els.modal.addEventListener('click', (e)=>{ if(e.target===els.modal) els.modal.close(); });

load();
