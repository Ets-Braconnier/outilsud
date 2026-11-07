/** Location page: filtering, pagination and persistent quote selection. */
import {$, escapeHtml, getSelection, saveSelection, showToast} from './common.js?v=34';
const machineIcon = `<svg viewBox="0 0 160 120" aria-hidden="true"><g fill="none" stroke="#32317f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect x="25" y="70" width="100" height="24" rx="10" fill="#32317f"/><circle cx="47" cy="82" r="6" fill="#fff" stroke="#fff"/><circle cx="105" cy="82" r="6" fill="#fff" stroke="#fff"/><path d="M44 68V39h50l18 29z" fill="#d8edff"/><path d="M80 35l22-22 32 15 11 35" stroke="#48479a" stroke-width="10"/><path d="M144 62l-15 12 18 11" stroke="#48479a" stroke-width="8"/></g></svg>`;
let machines = [];
let page = 0;
const selection = getSelection();
if (selection.delete("aspirateur-classique-25-l-90-l-etc") || selection.delete("aspirateur")) saveSelection(selection);
function card(machine) {
  const selected = selection.has(machine.id);
  return `<article class="machine-card"><div class="machine-art">${machine.photo ? `<img src="${escapeHtml(machine.photo)}" alt="${escapeHtml(machine.name)}" loading="lazy">` : machineIcon}</div><div class="machine-content"><h2>${escapeHtml(machine.name)}</h2><p>${escapeHtml(machine.description)}</p><div class="machine-meta">◷ ${escapeHtml(machine.period || 'Sur demande')} · Prix sur demande</div>${machine.models?.length ? `<button class="machine-button" type="button" data-models="${escapeHtml(machine.id)}">Voir les ${machine.models.length} modèles</button>` : `<button class="machine-button ${selected ? 'active' : ''}" type="button" data-machine="${escapeHtml(machine.id)}" aria-pressed="${selected}">${selected ? '✓ Ajoutée au devis' : 'Demander un devis de location'}</button>`}</div></article>`;
}
const families = [
 ['percage','Perçage & carottage','drill','adaptateur-de-couronne,carotteuse-a-beton,forets,foreuse-diamant-a-eau,perceuse-visseuse,perforateur,bati-de-forage-pied-de-carotteuse,foreuse-magnetique'],
 ['demolition','Démolition','hammer','burineur,marteau-piqueur,dejointoyeur-pneumatique,goulotte-a-gravats'],
 ['beton','Béton & maçonnerie','blocks','aiguille-vibrante,plaque-vibrante,rainureuse,polisseuse-a-beton'],
 ['decoupe','Sciage & découpe','scissors','coupe-carrelage,multi-cutter,meuleuse,grignoteuse,scie-a-onglets-scie-a-table,scie-sabre,scie-sauteuse,tronconneuse-disqueuse,scie-circulaire,scie--matriaux'],
 ['finition','Ponçage & finition','sparkles','ponceuse-a-parquet,ponceuse-excentrique-girafe-etc,sableuse'],
 ['bois','Travail du bois','tree','mortaiseuse,raboteuse,defonceuse'],
 ['fixation','Fixation & assemblage','wrench','agrafeuse,cloueur,cloueur-gaz,cloueur-pneumatique,cloueur-vertigel,boulonneuse,sertisseuse,poste-inverter'],
 ['nettoyage','Nettoyage','droplet','shampouineuse,aspirateur,autolaveuse,nettoyeur-haute-pression'],
 ['jardin','Jardin & espaces verts','leaf','debroussailleuse,motoculteur,taille-haie,tariere-thermique,tondeuse-autotractee,tronconneuse-a-bois,souffleur--feuilles'],
 ['levage','Levage & manutention','package','leve-plaque-leve-panneau,transpalette,ventouse-de-levage-grabo'],
 ['acces','Échafaudage & étançonnement','layers','echafaudage,etancons'],
 ['energie','Électricité & air comprimé','zap','compresseur,groupe-electrogene'],
 ['chauffage','Chauffage & séchage','sun','canon-a-chaleur,deshumidificateur'],
 ['pompage','Pompage','waves','pompe-a-vide,pompe-submersible'],
 ['mesure','Mesure & traçage','ruler','laserliner,lunettes-de-chantier']
].map(([id,name,icon,ids])=>({id,name,icon,ids:ids.split(',')}));
let activeFamily = null;
let visibleCount = 20;
const icons = {
 drill:'M5 5l14 14M14 4l6 6M4 14l6 6',hammer:'M4 20l10-10m-5-5 5-5 10 10',blocks:'M3 5h18v14H3zM3 12h18M10 5v7m4 0v7',scissors:'M4 4l16 16M20 4L4 20',sparkles:'M12 2l2 7 7 3-7 2-2 7-2-7-7-2 7-3z',tree:'M12 3L4 15h16L12 3zM12 15v6',wrench:'M20 7a6 6 0 0 1-8 6l-7 7-3-3 7-7a6 6 0 0 1 6-8l-4 4 3 3z',droplet:'M12 2C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-13z',leaf:'M20 4C8 4 4 10 4 16a5 5 0 0 0 5 5c6 0 11-6 11-17zM5 20l12-12',package:'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 5 9-5M12 12v9',layers:'M3 7l9-4 9 4-9 4zM3 12l9 4 9-4M3 17l9 4 9-4',zap:'M13 2L4 13h7l-1 9 10-12h-7z',sun:'M12 3v3m0 12v3M3 12h3m12 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',waves:'M2 8q5-4 10 0t10 0M2 14q5-4 10 0t10 0M2 20q5-4 10 0t10 0',ruler:'M4 4h16v16H4zM8 4v5m4-5v3m4-3v5M4 12h5m-5 4h3'};
function familyIcon(key){return `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[key]}"></path></svg>`;}
function render() {
 const query = $('search').value.trim().toLocaleLowerCase('fr');
 const overview = !activeFamily && !query;
 $('locationFamilies').hidden = !overview;
 $('locationCatalogHeader').hidden = overview;
 if (overview) {
   $('locationFamilies').innerHTML = families.map(f=>`<button class="location-family" type="button" data-family="${f.id}">${familyIcon(f.icon)}<span>${escapeHtml(f.name)}</span><small>${f.ids.filter(id=>machines.some(m=>m.id===id)).length} machine(s)</small></button>`).join('');
   $('catalog').innerHTML=''; $('catalogPagination').textContent=''; $('locationMore').hidden=true;
   $('resultCount').textContent=`${machines.length} machines · 15 familles`;
   return;
 }
 const family = families.find(f=>f.id===activeFamily);
 const filtered = machines.filter(m=>(!family || family.ids.includes(m.id)) && `${m.name} ${m.description} ${(m.models||[]).map(x=>x.name).join(' ')}`.toLocaleLowerCase('fr').includes(query));
 $('locationCatalogTitle').textContent=family ? family.name : 'Résultats de recherche';
 $('catalog').innerHTML=filtered.slice(0,visibleCount).map(card).join('') || '<p>Aucune machine trouvée.</p>';
 $('catalogPagination').textContent=`${Math.min(filtered.length,visibleCount)} sur ${filtered.length} machine(s)`;
 $('locationMore').hidden=filtered.length<=visibleCount;
 $('resultCount').textContent=`${filtered.length} machine(s)`;
}
async function init() {
  try {
    const response = await fetch('machines.json', {cache:'no-cache'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Format de catalogue invalide');
    machines = data;
    render();
  } catch (error) {
    $('catalog').textContent = 'Le catalogue est momentanément indisponible.';
    showToast('Impossible de charger machines.json. Ouvrez le site via un serveur web.');
    console.error(error);
  }
}
$('catalog').addEventListener('click', (event) => {
  const modelsButton = event.target.closest('[data-models]');
  if (modelsButton) { openModels(modelsButton.dataset.models); return; }
  const button = event.target.closest('[data-machine]'); if (!button) return;
  const id = button.dataset.machine;
  if (selection.has(id)) selection.delete(id); else selection.add(id);
  saveSelection(selection); render();
  window.dispatchEvent(new CustomEvent("contact-service",{detail:"location"}));
});
$('search').addEventListener('input', () => { activeFamily=null; visibleCount=20; render(); });
$('locationFamilies').addEventListener('click',event=>{const button=event.target.closest('[data-family]');if(!button)return;activeFamily=button.dataset.family;visibleCount=20;render();});
$('locationBack').addEventListener('click',()=>{activeFamily=null;visibleCount=20;$('search').value='';render();});
$('locationMore').addEventListener('click',()=>{visibleCount+=20;render();});
window.addEventListener('resize', render);
window.addEventListener('selection-change',()=>{selection.clear();getSelection().forEach(id=>selection.add(id));render();});
init();

// Fiche détaillée : un seul catalogue, plusieurs modèles à choisir.
const modelDialog = document.getElementById('locationModelsDialog');
function openModels(id) {
  const machine = machines.find(m => m.id === id);
  if (!machine?.models?.length || !modelDialog) return;
  modelDialog.dataset.machineId = id;
  document.getElementById('locationModelsTitle').textContent = machine.name;
  document.getElementById('locationModelsList').innerHTML = machine.models.map((model, i) => {
    const selected = selection.has(`${id}-modele-${i}`);
    return `<article class="location-model"><div class="location-model-art">${model.photo ? `<img src="${escapeHtml(model.photo)}" alt="${escapeHtml(model.name)}" loading="lazy">` : machineIcon}</div><div class="location-model-body"><h3>${escapeHtml(model.name)}</h3><p>Disponibilité et tarif sur demande.</p><button type="button" class="machine-button ${selected ? 'active' : ''}" data-model-select="${i}" aria-pressed="${selected}">${selected ? '✓ Sélectionné' : 'Demander un devis'}</button></div></article>`;
  }).join('');
  if (!modelDialog.open) modelDialog.showModal();
}
modelDialog?.addEventListener('click', event => {
  if (event.target === modelDialog) modelDialog.close();
  const button = event.target.closest('[data-model-select]');
  if (!button) return;
  const index = Number(button.dataset.modelSelect);
  const id = modelDialog.dataset.machineId;
  const key = `${id}-modele-${index}`;
  if (selection.has(key)) selection.delete(key); else selection.add(key);
  saveSelection(selection);
  openModels(id);
  window.dispatchEvent(new CustomEvent('contact-service', {detail:'location'}));
});
