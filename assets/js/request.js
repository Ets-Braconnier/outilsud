/** Quote request page: persistent selected machines and email draft. */
import {$, escapeHtml, getSelection, saveSelection, prepareEmail, showToast} from './common.js';
let machines = [];
const selected = getSelection();
function render() {
  const items = machines.filter(m => selected.has(m.id));
  $('selection').innerHTML = items.length ? items.map(m => `<div class="selected-item"><span>✓ ${escapeHtml(m.name)}</span><button type="button" data-remove="${escapeHtml(m.id)}" aria-label="Retirer ${escapeHtml(m.name)}">×</button></div>`).join('') : '<div class="empty-selection">Aucune machine sélectionnée pour le moment.</div>';
}
$('selection').addEventListener('click', e => {
  const button = e.target.closest('[data-remove]');
  if (!button) return;
  selected.delete(button.dataset.remove); saveSelection(selected); render();
});
$('requestForm').addEventListener('submit', e => {
  e.preventDefault();
  const items = machines.filter(m => selected.has(m.id));
  if (!items.length) return showToast('Sélectionnez au moins une machine.');
  const d = Object.fromEntries(new FormData(e.currentTarget));
  if (d.end < d.start) return showToast('La date de fin doit être postérieure ou égale au début.');
  const body = `Bonjour,\n\nJe souhaite obtenir un devis de location.\n\nMachines : ${items.map(m=>m.name).join(', ')}\nDébut : ${d.start}\nFin : ${d.end}\nNom : ${d.name}\nSociété : ${d.company || '-'}\nE-mail : ${d.email}\nTéléphone : ${d.phone}\nPrécisions : ${d.message || '-'}\n\nCordialement`;
  prepareEmail('Demande de devis de location Outilsud', body);
});
const today = new Date();
const localToday = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
$('requestForm').elements.start.min = localToday;
$('requestForm').elements.end.min = localToday;
fetch('machines.json').then(r => {if(!r.ok)throw new Error('Catalogue indisponible');return r.json()}).then(data=>{machines=data;render()}).catch(()=>showToast('Impossible de charger le catalogue.'));
