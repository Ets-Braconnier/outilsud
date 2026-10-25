/**
 * Outilsud - page unique, composants conservés séparément.
 * Chaque section se modifie dans sections/<nom>.html.
 */
import './common.js';

const order = ['index','location','vente','services','apropos','contact','demande'];
const anchor = name => name === 'index' ? 'accueil' : name;

async function loadSections() {
  const results = await Promise.all(order.map(async name => {
    const response = await fetch(`sections/${name}.html`, {cache:'no-cache'});
    if (!response.ok) throw new Error(`Section ${name} : HTTP ${response.status}`);
    return response.text();
  }));
  order.forEach((name, i) => {
    document.getElementById(anchor(name)).innerHTML = results[i];
  });

  // Modules remain independent and only initialize once their HTML exists.
  await Promise.all([
    import('./location.js'),
    import('./gallery.js'),
    import('./contact.js'),
    import('./request.js')
  ]);
  const nav = document.querySelector('#main-nav');
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    nav?.classList.remove('open');
    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded', 'false');
  });
  const target = location.hash && document.querySelector(location.hash);
  if (target) requestAnimationFrame(() => target.scrollIntoView({behavior:'instant'}));
}

loadSections().catch(error => {
  console.error('Chargement du site impossible :', error);
  document.querySelector('main').innerHTML = '<div class="container section"><h1>Chargement impossible</h1><p>Veuillez actualiser la page ou consulter le site depuis un serveur web.</p></div>';
});
