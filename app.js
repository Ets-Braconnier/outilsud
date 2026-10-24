
const fallback=[
{id:'aerogommeuse',name:'Aérogommeuse',category:'Décapage',description:'Décapage doux de bois, pierre et métal par projection d’abrasif. Modèle et accessoires à confirmer.',period:'Journée / semaine'},
{id:'mini-pelle',name:'Mini-pelle 1,8 t',category:'Terrassement',description:'Mini-pelle compacte pour tranchées, fondations et aménagements.',period:'Journée / semaine'},
{id:'plaque-vibrante',name:'Plaque vibrante',category:'Compactage',description:'Compactage d’empierrement, sable et pavés.',period:'Journée / semaine'},
{id:'betonniere',name:'Bétonnière électrique',category:'Béton',description:'Préparation de béton et de mortier sur chantier.',period:'Journée / semaine'},
{id:'marteau-piqueur',name:'Marteau-piqueur',category:'Démolition',description:'Démolition de dalles et maçonneries.',period:'Journée / semaine'},
{id:'carotteuse',name:'Carotteuse diamant',category:'Forage',description:'Percement précis de béton et maçonnerie.',period:'Sur demande'},
{id:'scie-sol',name:'Scie de sol',category:'Découpe',description:'Découpe de sols et surfaces minérales.',period:'Journée / semaine'},
{id:'nacelle',name:'Nacelle élévatrice',category:'Élévation',description:'Travaux en hauteur et interventions techniques.',period:'Sur demande'},
{id:'deshumidificateur',name:'Déshumidificateur',category:'Traitement de l’air',description:'Séchage de locaux après travaux.',period:'Journée / semaine'},
{id:'nettoyeur',name:'Nettoyeur haute pression',category:'Nettoyage',description:'Nettoyage intensif des surfaces extérieures.',period:'Journée / semaine'},
{id:'groupe-electrogene',name:'Groupe électrogène',category:'Énergie',description:'Alimentation électrique temporaire.',period:'Journée / semaine'},
{id:'tronconneuse',name:'Tronçonneuse thermique',category:'Espaces verts',description:'Travaux de coupe et d’entretien extérieur.',period:'Journée / semaine'},
{id:'broyeur',name:'Broyeur de branches',category:'Espaces verts',description:'Réduction des branches et déchets verts.',period:'Sur demande'}];
let machines=fallback, selected=new Set(), catalogPage=0;
const $=id=>document.getElementById(id);
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const machineIcon=()=>`<svg viewBox="0 0 160 120" aria-hidden="true"><g fill="none" stroke="#32317f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect x="25" y="70" width="100" height="24" rx="10" fill="#32317f"/><circle cx="47" cy="82" r="6" fill="#fff" stroke="#fff"/><circle cx="105" cy="82" r="6" fill="#fff" stroke="#fff"/><path d="M44 68V39h50l18 29z" fill="#d8edff"/><path d="M80 35l22-22 32 15 11 35" stroke="#48479a" stroke-width="10"/><path d="M144 62l-15 12 18 11" stroke="#48479a" stroke-width="8"/></g></svg>`;
function render(){let q=$('search').value.toLocaleLowerCase('fr'),cat=$('category').value;let items=machines.filter(m=>(!cat||m.category===cat)&&(`${m.name} ${m.description} ${m.category}`).toLocaleLowerCase('fr').includes(q));const pageSize=window.matchMedia('(max-width:760px)').matches?1:3;const pageCount=Math.ceil(items.length/pageSize);catalogPage=Math.max(0,Math.min(catalogPage,pageCount-1));const visible=items.slice(catalogPage*pageSize,(catalogPage+1)*pageSize);$('catalogPrev').disabled=catalogPage===0;$('catalogNext').disabled=catalogPage>=pageCount-1;$('catalogPagination').textContent=pageCount?`Page ${catalogPage+1} sur ${pageCount} · ${items.length} machine(s)`:'Aucun résultat';$('resultCount').textContent=items.length+' machine(s)';$('catalog').innerHTML=visible.map(m=>`<article class="machine-card"><div class="machine-art"><span class="category-tag">${escapeHtml(m.category)}</span>${m.photo?`<img src="${escapeHtml(m.photo)}" alt="${escapeHtml(m.name)}" style="width:100%;height:100%;object-fit:cover" loading="lazy">`:machineIcon()}</div><div class="machine-content"><h3>${escapeHtml(m.name)}</h3><p>${escapeHtml(m.description)}</p><div class="machine-meta">⏱ ${escapeHtml(m.period||'Sur demande')} · Prix sur demande</div><button class="machine-button ${selected.has(m.id)?'active':''}" data-machine="${escapeHtml(m.id)}">${selected.has(m.id)?'✓ Ajoutée au devis':'Demander un devis de location'}</button></div></article>`).join('')||'<p>Aucune machine trouvée.</p>';$('cartCount').textContent=selected.size;$('selection').innerHTML=selected.size?[...selected].map(id=>{let m=machines.find(x=>x.id===id);return m?`<div class="selected-item"><span>✓ ${escapeHtml(m.name)}</span><button type="button" data-remove="${escapeHtml(id)}" aria-label="Retirer ${escapeHtml(m.name)}">×</button></div>`:''}).join(''):'<div class="empty-selection">Aucune machine sélectionnée pour le moment.</div>'}
function init(){let categories=[...new Set(machines.map(m=>m.category))].sort((a,b)=>a.localeCompare(b,'fr'));$('category').innerHTML='<option value="">Toutes les catégories</option>'+categories.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');render()}
$('catalog').addEventListener('click',e=>{let b=e.target.closest('[data-machine]');if(!b)return;let id=b.dataset.machine;selected.has(id)?selected.delete(id):selected.add(id);render();});
$('selection').addEventListener('click',e=>{let b=e.target.closest('[data-remove]');if(b){selected.delete(b.dataset.remove);render()}});
$('search').addEventListener('input',()=>{catalogPage=0;render()});$('category').addEventListener('change',()=>{catalogPage=0;render()});$('catalogPrev').addEventListener('click',()=>{catalogPage--;render()});$('catalogNext').addEventListener('click',()=>{catalogPage++;render()});window.addEventListener('resize',render);
$('menuToggle').addEventListener('click',()=>{let n=$('navLinks');let opened=n.classList.toggle('open');$('menuToggle').setAttribute('aria-expanded',opened)});
document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>$('navLinks').classList.remove('open')));
function toast(s){$('toast').textContent=s;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),3800)}
function mail(subject,body){const configuredEmail='';if(!configuredEmail){toast('Démo : ajoutez l’adresse e-mail Outilsud dans app.js pour activer le destinataire.')}location.href='mailto:'+configuredEmail+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)}
$('requestForm').addEventListener('submit',e=>{e.preventDefault();if(!selected.size){toast('Sélectionnez au moins une machine.');return}let d=Object.fromEntries(new FormData(e.currentTarget));if(d.end<d.start){toast('La date de fin doit être après la date de début.');return}let list=[...selected].map(id=>machines.find(m=>m.id===id)?.name).filter(Boolean).join(', ');mail('Demande de location Outilsud','Bonjour,\n\nJe souhaite obtenir une offre de location.\n\nMachines : '+list+'\nDébut : '+d.start+'\nFin : '+d.end+'\nNom : '+d.name+'\nSociété : '+(d.company||'-')+'\nE-mail : '+d.email+'\nTéléphone : '+d.phone+'\nPrécisions : '+(d.message||'-')+'\n\nCordialement')});
$('contactForm').addEventListener('submit',e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.currentTarget));mail('Contact via le site Outilsud','Nom : '+d.name+'\nE-mail : '+d.email+'\n\n'+d.message)});
$('year').textContent=new Date().getFullYear();const today=new Date().toLocaleDateString('en-CA');document.querySelector('[name=start]').min=today;document.querySelector('[name=end]').min=today;init();

// Galerie du magasin : fichiers présents dans images-site/magasin/ sur GitHub.
(()=>{
 const filenames=['1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.1.png','9.2.png','9.3.png','9.4.png','9.5.png','9.6.png','9.7.png','9.8.png','9.9.1.png','9.9.2.png','9.9.3.png','9.9.4.png','9.9.5.png','9.9.9.png','9.png'];
 const img=document.getElementById('shopSlide'),counter=document.getElementById('shopCounter'),prev=document.getElementById('shopPrev'),next=document.getElementById('shopNext');
 if(!img||!counter||!prev||!next)return;
 let index=0, timer;
 function show(n){index=(n+filenames.length)%filenames.length;img.src='images-site/magasin/'+filenames[index];img.alt='Photo du magasin Outilsud '+(index+1);counter.textContent=(index+1)+' / '+filenames.length;}
 function start(){clearInterval(timer);timer=setInterval(()=>show(index+1),4000)}
 prev.addEventListener('click',()=>{show(index-1);start()});next.addEventListener('click',()=>{show(index+1);start()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInterval(timer);else start()});
 show(0);start();
})();
