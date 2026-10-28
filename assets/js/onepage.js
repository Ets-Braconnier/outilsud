/** Outilsud : sections distinctes dans les fichiers, affichage autonome par rubrique. */
import './common.js?v=27';
const names=['index','location','vente','atelier','hydraulique','amenagement','vetements','affutage','apropos'];
const idFor=n=>n==='index'?'accueil':n;
const standalone=new Set(['atelier','hydraulique']);
async function init(){
 const fragments=await Promise.all(names.map(async n=>{
  const r=await fetch(`sections/${n}.html?v=31`,{cache:'no-cache'});
  if(!r.ok)throw new Error(`Section ${n} : HTTP ${r.status}`);
  return r.text();
 }));
 names.forEach((n,i)=>{document.getElementById(idFor(n)).innerHTML=fragments[i]});
 await Promise.all([import('./location.js'),import('./gallery.js'),import('./contact.js?v=27')]);
 await import('./service-gallery.js?v=31');
 // Carrousel Services : 4 cartes visibles sur grand écran, une rangée uniquement.
 const track=document.getElementById('services-carousel-track');
 const prev=document.querySelector('.services-carousel-prev');
 const next=document.querySelector('.services-carousel-next');
 if(track&&prev&&next){
   const update=()=>{
     prev.disabled=track.scrollLeft<=2;
     next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;
   };
   const move=dir=>{
     const first=track.querySelector('.feature');
     if(!first)return;
     const gap=parseFloat(getComputedStyle(track).gap)||0;
     track.scrollBy({left:dir*(first.getBoundingClientRect().width+gap),behavior:'smooth'});
   };
   prev.addEventListener('click',()=>move(-1));
   next.addEventListener('click',()=>move(1));
   track.addEventListener('scroll',update,{passive:true});
   window.addEventListener('resize',update);
   update();
 }

 // Toutes les rubriques restent dans le même document : aucune vue isolée.
 function route(hash,behavior='instant'){
  const id=(hash==='#demande'?'#contact':hash||'#accueil').replace(/^#/,'');
  if(hash==='#demande')window.dispatchEvent(new CustomEvent('contact-service',{detail:'location'}));
  if(['location','vente','atelier','hydraulique','amenagement','vetements','affutage'].includes(id))window.dispatchEvent(new CustomEvent('contact-service',{detail:id}));
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
