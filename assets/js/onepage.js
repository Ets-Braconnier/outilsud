/** Charge les rubriques du site, conservées dans des fichiers distincts. */
import './common.js';

const sections = ['index','location','vente','services','atelier','hydraulique','apropos','contact','demande'];
const idFor = name => name === 'index' ? 'accueil' : name;

async function init() {
  const fragments = await Promise.all(sections.map(async name => {
    const response = await fetch(`sections/${name}.html`, {cache: 'no-cache'});
    if (!response.ok) throw new Error(`Impossible de charger ${name} (${response.status})`);
    return response.text();
  }));
  sections.forEach((name, i) => {
    document.getElementById(idFor(name)).innerHTML = fragments[i];
  });

  await import('./location.js');
  await import('./gallery.js');
  await import('./contact.js');
  await import('./request.js');

  // Les deux fiches techniques s'ouvrent comme de vraies pages complètes.
  // Les autres liens retrouvent le site défilant normalement.
  function applyServiceView(hash) {
    const name = (hash || '').replace(/^#/, '');
    const detail = name === 'atelier' || name === 'hydraulique';
    document.body.classList.toggle('service-focus', detail);
    document.querySelectorAll('.page-section').forEach(el => {
      el.classList.toggle('service-active', detail && el.id === name);
    });
  }
  // Calculer la hauteur réelle du menu évite de masquer le début des sections.
  function scrollToSection(hash, behavior = 'smooth') {
    const id = decodeURIComponent(hash.replace(/^#/, ''));
    const target = document.getElementById(id);
    if (!target) return;
    const header = document.querySelector('.site-header');
    const offset = header ? header.getBoundingClientRect().height : 0;
    const top = window.scrollY + target.getBoundingClientRect().top - offset;
    window.scrollTo({top: Math.max(0, top), behavior});
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (!hash || !document.getElementById(hash.slice(1))) return;
    event.preventDefault();
    document.querySelector('.main-nav')?.classList.remove('open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded','false');
    if (location.hash !== hash) history.pushState(null, '', hash);
    applyServiceView(hash);
    requestAnimationFrame(() => scrollToSection(hash));
  });
  window.addEventListener('popstate', () => {
    applyServiceView(location.hash);
    requestAnimationFrame(() => scrollToSection(location.hash || '#accueil', 'instant'));
  });
  applyServiceView(location.hash);
  if (location.hash) {
    requestAnimationFrame(() => scrollToSection(location.hash, 'instant'));
  }

}
init().catch(error => {
  console.error(error);
  document.getElementById('main').innerHTML =
    '<section class="section container"><h1>Chargement impossible</h1><p>Veuillez actualiser la page.</p></section>';
});
