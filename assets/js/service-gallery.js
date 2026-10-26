/** Diaporamas séparés. Photos existantes du magasin, à remplacer par photos métier. */
const collections={
 atelier:['8.png','9.3.png','9.9.5.png'],
 hydraulique:['9.9.4.png','2.png','9.9.png']
};
document.querySelectorAll('[data-gallery]').forEach(root=>{
 const images=collections[root.dataset.gallery]||[];
 const img=root.querySelector('img'),count=root.querySelector('.service-count');
 let i=0,timer;
 const show=n=>{
  i=(n+images.length)%images.length;
  img.src='assets/images/magasin/'+encodeURIComponent(images[i]);
  img.alt=`Photo Outilsud ${i+1} sur ${images.length} (illustration)`;
  count.textContent=`${i+1} / ${images.length}`;
 };
 const start=()=>{
  clearInterval(timer);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>show(i+1),4500);
 };
 root.querySelector('.service-prev').addEventListener('click',()=>{show(i-1);start()});
 root.querySelector('.service-next').addEventListener('click',()=>{show(i+1);start()});
 show(0);start();
});
