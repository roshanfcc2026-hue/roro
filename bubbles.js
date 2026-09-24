(() => {
 const gallery=document.querySelector('.bubble-gallery'),button=document.querySelector('#bubble-pause');
 const preference=matchMedia('(prefers-reduced-motion: reduce)');let paused=preference.matches;
 const sync=()=>{gallery.classList.toggle('bubbles-paused',paused);button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Resume bubbles ▷':'Pause bubbles Ⅱ';};
 button.addEventListener('click',()=>{paused=!paused;sync();});preference.addEventListener('change',()=>{paused=preference.matches;sync();});
 new IntersectionObserver(entries=>gallery.classList.toggle('in-view',entries[0].isIntersecting)).observe(gallery);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)gallery.classList.remove('in-view');else{const r=gallery.getBoundingClientRect();gallery.classList.toggle('in-view',r.bottom>0&&r.top<innerHeight);}});
 sync();
})();
