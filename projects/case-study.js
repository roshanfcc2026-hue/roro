(() => {
 const origin=new URLSearchParams(location.search).get('from');
 if(['building-tour','project-index','work'].includes(origin))document.querySelector('#back').href=`../?revision=22#${origin}`;
 const dialog=document.createElement('dialog');
 dialog.className='image-viewer';
 dialog.innerHTML='<div class="viewer-toolbar"><p></p><button type="button" aria-label="Close image viewer">Close ×</button></div><div class="viewer-image"><img alt=""></div><a class="original-image" target="_blank" rel="noopener">Open original image ↗</a>';
 document.body.append(dialog);
 const close=()=>dialog.close();
 dialog.querySelector('button').addEventListener('click',close);
 dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
 dialog.addEventListener('close',()=>{document.body.style.overflow='';});
 document.querySelectorAll('.case-hero img').forEach(img=>{
  const link=document.createElement('a');link.className='image-open';link.href=img.src;
  link.setAttribute('aria-label','Enlarge project visualization');img.before(link);link.append(img);
 });
 document.querySelectorAll('.image-open').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();
  const source=link.querySelector('img');
  const img=dialog.querySelector('img');img.src=source.src;img.alt=source.alt;
  dialog.querySelector('p').textContent=source.alt;
  dialog.querySelector('a').href=source.src;
  dialog.showModal();document.body.style.overflow='hidden';
 }));
})();
