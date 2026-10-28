/** Location page: filtering, pagination and persistent quote selection. */
import {$, escapeHtml, getSelection, saveSelection, showToast} from './common.js';
const machineIcon = `<svg viewBox="0 0 160 120" aria-hidden="true"><g fill="none" stroke="#32317f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect x="25" y="70" width="100" height="24" rx="10" fill="#32317f"/><circle cx="47" cy="82" r="6" fill="#fff" stroke="#fff"/><circle cx="105" cy="82" r="6" fill="#fff" stroke="#fff"/><path d="M44 68V39h50l18 29z" fill="#d8edff"/><path d="M80 35l22-22 32 15 11 35" stroke="#48479a" stroke-width="10"/><path d="M144 62l-15 12 18 11" stroke="#48479a" stroke-width="8"/></g></svg>`;
let machines = [];
let page = 0;
const selection = getSelection();
function card(machine) {
  const selected = selection.has(machine.id);
  return `<article class="machine-card"><div class="machine-art"><span class="category-tag">${escapeHtml(machine.category)}</span>${machine.photo ? `<img src="${escapeHtml(machine.photo)}" alt="${escapeHtml(machine.name)}" loading="lazy">` : machineIcon}</div><div class="machine-content"><h2>${escapeHtml(machine.name)}</h2><p>${escapeHtml(machine.description)}</p><div class="machine-meta">◷ ${escapeHtml(machine.period || 'Sur demande')} · Prix sur demande</div><button class="machine-button ${selected ? 'active' : ''}" type="button" data-machine="${escapeHtml(machine.id)}" aria-pressed="${selected}">${selected ? '✓ Ajoutée au devis' : 'Demander un devis de location'}</button></div></article>`;
}
function render() {
  const query = $('search').value.trim().toLocaleLowerCase('fr');
  const category = $('category').value;
  const filtered = machines.filter((m) => (!category || m.category === category) && `${m.name} ${m.category} ${m.description}`.toLocaleLowerCase('fr').includes(query));
  const pageSize = matchMedia('(max-width:760px)').matches ? 1 : 3;
  const pages = Math.ceil(filtered.length / pageSize);
  page = Math.max(0, Math.min(page, Math.max(0, pages - 1)));
  $('catalog').innerHTML = filtered.slice(page * pageSize, (page + 1) * pageSize).map(card).join('') || '<p>Aucune machine trouvée.</p>';
  $('catalogPrev').disabled = page === 0;
  $('catalogNext').disabled = page >= pages - 1;
  $('catalogPagination').textContent = pages ? `Page ${page + 1} sur ${pages} · ${filtered.length} machine(s)` : 'Aucun résultat';
  $('resultCount').textContent = `${filtered.length} machine(s)`;
}
async function init() {
  try {
    const response = await fetch('machines.json', {cache:'no-cache'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Format de catalogue invalide');
    machines = data;
    const categories = [...new Set(machines.map(m => m.category))].sort((a,b) => a.localeCompare(b,'fr'));
    $('category').innerHTML = '<option value="">Toutes les catégories</option>' + categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
    render();
  } catch (error) {
    $('catalog').textContent = 'Le catalogue est momentanément indisponible.';
    showToast('Impossible de charger machines.json. Ouvrez le site via un serveur web.');
    console.error(error);
  }
}
$('catalog').addEventListener('click', (event) => {
  const button = event.target.closest('[data-machine]'); if (!button) return;
  const id = button.dataset.machine;
  if (selection.has(id)) selection.delete(id); else selection.add(id);
  saveSelection(selection); render();
  window.dispatchEvent(new CustomEvent("contact-service",{detail:"location"}));
});
$('search').addEventListener('input', () => { page = 0; render(); });
$('category').addEventListener('change', () => { page = 0; render(); });
$('catalogPrev').addEventListener('click', () => { page -= 1; render(); });
$('catalogNext').addEventListener('click', () => { page += 1; render(); });
window.addEventListener('resize', render);
window.addEventListener('selection-change',()=>{selection.clear();getSelection().forEach(id=>selection.add(id));render();});
init();
