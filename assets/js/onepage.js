/** Outilsud : sections distinctes dans les fichiers, affichage autonome par rubrique. */
import './common.js';
const names=['index','location','vente','atelier','hydraulique','amenagement','vetements','affutage','apropos','contact','demande'];
const idFor=n=>n==='index'?'accueil':n;
const standalone=new Set(['atelier','hydraulique']);
async function init(){
 const fragments=await Promise.all(names.map(async n=>{
  const r=await fetch(`sections/${n}.html`,{cache:'no-cache'});
  if(!r.ok)throw new Error(`Section ${n} : HTTP ${r.status}`);
  return r.text();
 }));
 names.forEach((n,i)=>{document.getElementById(idFor(n)).innerHTML=fragments[i]});
 await Promise.all([import('./location.js'),import('./gallery.js'),import('./contact.js'),import('./request.js')]);
 await import('./service-gallery.js');
 // Toutes les rubriques restent dans le même document : aucune vue isolée.
 function route(hash,behavior='instant'){
  const id=(hash||'#accueil').replace(/^#/,'');
  document.body.classList.remove('detail-mode','service-focus');
  document.querySelectorAll('#main>.page-section').forEach(el=>el.classList.remove('detail-visible','service-active'));
  document.querySelectorAll('.main-nav a').forEach(a=>{
   const active=a.getAttribute('href')===(['atelier','hydraulique','amenagement','vetements','affutage'].includes(id)?'#services':'#'+id);
   if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
  const target=document.getElementById(id);
  if(!target)return;
  requestAnimationFrame(()=>{
   const header=document.querySelector('.site-header')?.getBoundingClientRect().height||0;
   let top=window.scrollY+target.getBoundingClientRect().top-header;
   if(id==='services'){
    // Cadrage voulu : fin de la vidéo, bandeau Braconnier, puis les quatre cartes.
    const band=document.querySelector('#accueil .partner-band');
    if(band)top=window.scrollY+band.getBoundingClientRect().top-Math.min(190,window.innerHeight*.20)-header;
   }
   if(id==='accueil')top=0;
   window.scrollTo({top:Math.max(0,top),behavior});
  });
 }
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a)return;
  const hash=a.getAttribute('href');
  if(!hash||!document.getElementById(hash.slice(1)))return;
  e.preventDefault();
  document.querySelector('.main-nav')?.classList.remove('open');
  document.querySelector('.menu-toggle')?.setAttribute('aria-expanded','false');
  history.pushState(null,'',hash);
  route(hash,'smooth');
 });
 window.addEventListener('popstate',()=>route(location.hash));
 route(location.hash);
}
init().catch(err=>{console.error(err);document.getElementById('main').innerHTML='<section class="section container"><h1>Chargement impossible</h1><p>Veuillez actualiser.</p></section>'});
