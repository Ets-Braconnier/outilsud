/** Common functionality shared by every page. */
export const $ = (id) => document.getElementById(id);
export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const STORAGE_KEY = 'outilsud-selected-machines';
export function getSelection() {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(value) ? value : []); }
  catch { return new Set(); }
}
export function saveSelection(selection) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...selection])); }
  catch { showToast('Impossible de mémoriser la sélection dans ce navigateur.'); }
  updateCart();
}
export function updateCart() { if ($('cartCount')) $('cartCount').textContent = getSelection().size; }
export function showToast(message) {
  const node = $('toast'); if (!node) return;
  node.textContent = message; node.classList.add('show');
  clearTimeout(showToast.timeout); showToast.timeout = setTimeout(() => node.classList.remove('show'), 4000);
}
// Renseigner une adresse de destination vérifiée avant de publier les formulaires.
export const CONTACT_EMAIL = '';
export function prepareEmail(subject, body) {
  if (!CONTACT_EMAIL) {
    showToast('Adresse e-mail destinataire non configurée. Consultez assets/js/common.js.');
    return;
  }
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
const menu = document.querySelector('.menu-toggle');
menu?.addEventListener('click', () => {
  const opened = document.querySelector('#main-nav').classList.toggle('open');
  menu.setAttribute('aria-expanded', String(opened));
});
$('year').textContent = new Date().getFullYear();
updateCart();
window.addEventListener('storage', updateCart);
