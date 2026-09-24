(() => {
 const hero=document.querySelector('.hero'),frame=hero.querySelector('.hero-walkthrough'),video=frame.querySelector('video'),tabs=[...hero.querySelectorAll('[role=tab]')],panels=[...hero.querySelectorAll('[role=tabpanel]')];
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-paused');
 function select(index){tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',i===index);tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});}
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(index));tab.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?2:(index+(e.key==='ArrowRight'?1:2))%3;select(next);tabs[next].focus();});});
 frame.addEventListener('pointermove',e=>{if(reduced()||e.pointerType!=='mouse')return;const r=frame.getBoundingClientRect();frame.style.setProperty('--tilt-x',`${((e.clientX-r.left)/r.width-.5)*12}deg`);frame.style.setProperty('--tilt-y',`${-((e.clientY-r.top)/r.height-.5)*10}deg`);});frame.addEventListener('pointerleave',()=>{frame.style.setProperty('--tilt-x','0deg');frame.style.setProperty('--tilt-y','0deg');});
 const play=hero.querySelector('#film-play'),range=hero.querySelector('#film-seek');
 play.addEventListener('click',()=>{if(document.body.classList.contains('motion-paused')){document.querySelector('#motion-toggle').click();}else if(video.paused){if(!video.src)video.src=video.dataset.src;video.play().catch(()=>{});}else{document.querySelector('#motion-toggle').click();}});
 const sync=()=>{play.textContent=video.paused?'Play ▷':'Pause Ⅱ';play.setAttribute('aria-label',video.paused?'Play architectural film':'Pause motion');};video.addEventListener('play',sync);video.addEventListener('pause',sync);
 // The existing WebM lacks a finite duration header; its measured runtime is 5.67 s.
 const duration=()=>Number.isFinite(video.duration)&&video.duration>0?video.duration:5.67;
 video.addEventListener('timeupdate',()=>{if(document.activeElement!==range)range.value=Math.min(100,video.currentTime/duration()*100);});sync();
})();
