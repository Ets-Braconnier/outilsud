/** Diaporamas de chaque service. Les photos hydrauliques et vêtements sont dans le dépôt GitHub. */
const collections={
 atelier:['assets/images/magasin/8.png','assets/images/magasin/9.3.png','assets/images/magasin/9.9.5.png'],
 hydraulique:Array.from({length:6},(_,i)=>`assets/images/hydraulique/hydraulique-${i+1}.jpg`),
 vetements:['assets/images/vetements/vetements-1.jpg','assets/images/vetements/vetements-2.jpg','assets/images/vetements/vetement-3.jpg'],
 amenagement:['assets/images/amenagement-camionnette/1.jpg', 'assets/images/amenagement-camionnette/2.jpg', 'assets/images/amenagement-camionnette/3.jpg', 'assets/images/amenagement-camionnette/4.jpg', 'assets/images/amenagement-camionnette/5.jpg', 'assets/images/amenagement-camionnette/6.jpg', 'assets/images/amenagement-camionnette/7.jpg', 'assets/images/amenagement-camionnette/8.jpg', 'assets/images/amenagement-camionnette/9.jpg', 'assets/images/amenagement-camionnette/9.1.jpg', 'assets/images/amenagement-camionnette/9.2.jpg', 'assets/images/amenagement-camionnette/9.3.jpg', 'assets/images/amenagement-camionnette/9.4.jpg', 'assets/images/amenagement-camionnette/9.5.jpg'],
 affutage:['assets/images/magasin/5.png','assets/images/magasin/6.png','assets/images/magasin/7.png']
};
document.querySelectorAll('[data-gallery]').forEach(root=>{
 const files=collections[root.dataset.gallery]||[];
 const img=root.querySelector('img'),count=root.querySelector('.service-count');
 let i=0,timer;
 function show(n){
  i=(n+files.length)%files.length;
  img.src=files[i];
  img.alt=`Photo ${i+1} sur ${files.length} — ${root.dataset.gallery}`;
  count.textContent=`${i+1} / ${files.length}`;
 }
 function start(){
  clearInterval(timer);
  if(files.length>1&&!matchMedia('(prefers-reduced-motion: reduce)').matches)
   timer=setInterval(()=>show(i+1),4500);
 }
 root.querySelector('.service-prev')?.addEventListener('click',()=>{show(i-1);start()});
 root.querySelector('.service-next')?.addEventListener('click',()=>{show(i+1);start()});
 if(files.length){show(0);start()}
});
