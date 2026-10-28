/** One adaptive contact form, shared by all services. */
import {$,escapeHtml,getSelection,saveSelection,prepareEmail,showToast} from './common.js';
const form=$('contactForm');
let machines=[];
const config={
 general:['Votre demande','Posez votre question à notre équipe.','Votre message *',''],
 location:['Votre location','Les machines choisies sont reprises ci-dessous. Précisez les dates souhaitées.','Précisions',''],
 vente:['Votre matériel','Indiquez le matériel ou la référence recherchée.','Votre besoin *','Matériel recherché'],
 atelier:['Réparation et entretien','Décrivez la machine et les symptômes observés.','Panne, symptômes ou entretien souhaité *','Machine à réparer'],
 hydraulique:['Votre demande hydraulique','Précisez les dimensions, les raccords et les références disponibles.','Dimensions et caractéristiques souhaitées *','Flexible ou équipement concerné'],
 amenagement:['Votre aménagement','Présentez votre véhicule et vos besoins de rangement.','Votre projet d’aménagement *','Véhicule concerné'],
 vetements:['Vos vêtements de travail','Indiquez les vêtements, les tailles et les quantités souhaités.','Tailles, quantités et besoins *','Vêtements recherchés'],
 affutage:['Votre affûtage','Précisez le type de lame et son état.','État de la lame et demande *','Lame ou outil concerné']
};
function renderSelection(){
 const selected=getSelection();
 const items=machines.filter(m=>selected.has(m.id));
 $('selection').innerHTML=items.length?items.map(m=>`<div class="selected-item"><span>✓ ${escapeHtml(m.name)}</span><button type="button" data-remove="${escapeHtml(m.id)}" aria-label="Retirer ${escapeHtml(m.name)}">×</button></div>`).join(''):'<div class="empty-selection">Choisissez une ou plusieurs machines dans le catalogue.</div>';
}
function adapt(service){
 if(!config[service])service='general';
 $('contactService').value=service;
 const [title,help,message,equipment]=config[service];
 $('contactTitle').textContent=title;$('contactHelp').textContent=help;$('messageLabel').textContent=message;
 const rental=service==='location';
 $('rentalSelection').hidden=!rental;
 $('rentalFields').hidden=!rental;$('rentalFields').disabled=!rental;
 $('equipmentFields').hidden=!equipment;$('equipmentFields').disabled=!equipment;
 $('equipmentLabel').textContent=equipment;
 form.elements.message.required=!rental;
 renderSelection();
}
$('contactService').addEventListener('change',e=>adapt(e.target.value));
window.addEventListener('contact-service',e=>adapt(e.detail));
document.addEventListener('click',e=>{const a=e.target.closest('[data-contact-service]');if(a)adapt(a.dataset.contactService);});
window.addEventListener('selection-change',renderSelection);
window.addEventListener('storage',renderSelection);
$('selection').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;const selected=getSelection();selected.delete(b.dataset.remove);saveSelection(selected);renderSelection();});
const today=new Date();const localDate=`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
form.elements.start.min=localDate;form.elements.end.min=localDate;
form.elements.start.addEventListener('change',()=>{form.elements.end.min=form.elements.start.value||localDate;});
form.addEventListener('submit',e=>{
 e.preventDefault();const d=Object.fromEntries(new FormData(form));const lines=['Bonjour,','',config[d.service][0],'',`Nom : ${d.name}`,`Société : ${d.company||'-'}`,`E-mail : ${d.email}`,`Téléphone : ${d.phone||'-'}`];
 if(d.service==='location'){
  const items=machines.filter(m=>getSelection().has(m.id));
  if(!items.length)return showToast('Sélectionnez au moins une machine dans le catalogue.');
  if(d.end<d.start)return showToast('La fin doit être postérieure ou égale au début.');
  lines.push(`Machines : ${items.map(m=>m.name).join(', ')}`,`Début : ${d.start}`,`Fin : ${d.end}`);
 }
 if(d.equipment)lines.push(`Matériel : ${d.equipment}`);if(d.reference)lines.push(`Marque / référence : ${d.reference}`);
 lines.push('',d.message||'','', 'Cordialement');prepareEmail(`${config[d.service][0]} — Outilsud`,lines.join('\n'));
});
fetch('machines.json').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{machines=data;renderSelection();}).catch(()=>showToast('Impossible de charger les machines sélectionnées.'));
adapt('general');
