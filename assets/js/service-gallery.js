/** Diaporamas de chaque service. Les photos hydrauliques et vêtements sont dans le dépôt GitHub. */
const collections={
 atelier:['assets/images/magasin/8.avif','assets/images/magasin/9.3.avif','assets/images/magasin/9.9.5.avif'],
 hydraulique:Array.from({length:6},(_,i)=>`assets/images/hydraulique/hydraulique-${i+1}.avif`),
 vetements:['assets/images/vetements/vetements-1.avif','assets/images/vetements/vetements-2.avif','assets/images/vetements/vetement-3.avif'],
 amenagement:['assets/images/amenagement-camionnette/1.avif', 'assets/images/amenagement-camionnette/2.avif', 'assets/images/amenagement-camionnette/3.avif', 'assets/images/amenagement-camionnette/4.avif', 'assets/images/amenagement-camionnette/5.avif', 'assets/images/amenagement-camionnette/6.avif', 'assets/images/amenagement-camionnette/7.avif', 'assets/images/amenagement-camionnette/8.avif', 'assets/images/amenagement-camionnette/9.avif', 'assets/images/amenagement-camionnette/9.1.avif', 'assets/images/amenagement-camionnette/9.2.avif', 'assets/images/amenagement-camionnette/9.3.avif', 'assets/images/amenagement-camionnette/9.4.avif', 'assets/images/amenagement-camionnette/9.5.avif'],
 affutage:['assets/images/magasin/5.avif','assets/images/magasin/6.avif','assets/images/magasin/7.avif']
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
