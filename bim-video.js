(() => {
 const section=document.querySelector('#nexus-bim'),video=document.querySelector('#nexus-bim-video');
 if(!section||!video)return;
 const pin=section.querySelector('.bim-pin');
 const hint=section.querySelector('#bim-scroll-hint'),percent=section.querySelector('#bim-scroll-percent');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let target=0,smooth=0,raf=0,last=0,ready=false;
 const disabled=()=>reduced.matches||document.body.classList.contains('motion-paused');
 const duration=()=>Math.max(0,video.duration-1/24);
 function labels(){
  const time=video.currentTime;
  percent.textContent=`${String(Math.round((ready?time/duration():0)*100)).padStart(2,'0')} / 100`;
  hint.textContent=disabled()?'BIM MODEL / MOTION PAUSED':smooth>.995?'BUILT. KEEP SCROLLING ↓':'SCROLL DOWN TO BUILD · UP TO REVERSE';
 }
 function seek(){if(ready&&!video.seeking){const time=Math.min(duration(),Math.round(smooth*duration()*24)/24);if(Math.abs(video.currentTime-time)>.015)video.currentTime=time;}}
 function tick(now){raf=0;if(document.hidden)return;const dt=Math.min(64,now-last);last=now;smooth+=(target-smooth)*(1-Math.exp(-dt/150));if(Math.abs(smooth-target)<.0003)smooth=target;seek();labels();if(smooth!==target)raf=requestAnimationFrame(tick);}
 function wake(){if(!raf){last=performance.now();raf=requestAnimationFrame(tick);}}
 function measure(){if(disabled())return;const rect=section.getBoundingClientRect(),distance=Math.max(1,section.offsetHeight-pin.offsetHeight);target=Math.min(1,Math.max(0,(12-rect.top)/distance/.94));wake();}
 function sync(){video.pause();section.classList.toggle('is-static',disabled());if(disabled()){cancelAnimationFrame(raf);raf=0;target=smooth=1;seek();labels();}else measure();}
 video.addEventListener('loadedmetadata',()=>{ready=Number.isFinite(video.duration);sync();});video.addEventListener('seeked',()=>{labels();seek();});video.addEventListener('play',()=>video.pause());video.addEventListener('error',()=>{section.classList.add('is-static');hint.textContent='MODEL PREVIEW · VIDEO UNAVAILABLE';});
 addEventListener('scroll',measure,{passive:true});addEventListener('resize',measure,{passive:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden)measure();});reduced.addEventListener('change',sync);
 let paused=disabled();new MutationObserver(()=>{if(paused!==disabled()){paused=disabled();sync();}}).observe(document.body,{attributes:true,attributeFilter:['class']});
 if(video.readyState>=1)ready=true;sync();
})();