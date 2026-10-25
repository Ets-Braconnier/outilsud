/** Charge les rubriques du site, conservées dans des fichiers distincts. */
import './common.js';

const sections = ['index','location','vente','services','apropos','contact','demande'];
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

  document.addEventListener('click', event => {
    if (!event.target.closest('a[href^="#"]')) return;
    document.querySelector('.main-nav')?.classList.remove('open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded','false');
  });
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }
}
init().catch(error => {
  console.error(error);
  document.getElementById('main').innerHTML =
    '<section class="section container"><h1>Chargement impossible</h1><p>Veuillez actualiser la page.</p></section>';
});
