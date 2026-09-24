(() => {
 const hero=document.querySelector('#home'),canvas=hero.querySelector('.opening-canvas'),ctx=canvas.getContext('2d');if(!ctx)return;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-paused');
 let width=0,height=0,visible=true,raf=null,time=0,last=0,yaw=-.5,targetYaw=-.5,tilt=.48,targetTilt=.48,drag=null,view=0;
 const button=hero.querySelector('#opening-view'),labels=['01 / THE UNFOLDING FORM','02 / A DIFFERENT ANGLE','03 / THE STRUCTURAL RHYTHM'];
 function project(x,y,z){const c=Math.cos(yaw),s=Math.sin(yaw),xx=x*c-z*s,zz=x*s+z*c;const yy=y*Math.cos(tilt)-zz*Math.sin(tilt),depth=y*Math.sin(tilt)+zz*Math.cos(tilt);const scale=Math.min(width/22,height/11.5),perspective=36/(36-depth);return [width*.51+xx*scale*perspective,height*.57-yy*scale*perspective,depth];}
 function point(u,v){const x=u*8,z=v*4.8,y=1.65*Math.cos(u*2.1)+1.2*Math.sin(v*2+u*.9)+.28*Math.sin(time*.5+u*3)*(reduced()?0:1);return project(x,y,z);}
 function render(now){raf=null;if(!visible||document.hidden)return;const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!reduced())time+=dt;
  const ease=reduced()?1:.055;yaw+=(targetYaw+(!reduced()&&!drag?Math.sin(time*.18)*.11:0)-yaw)*ease;tilt+=(targetTilt-tilt)*ease;
  ctx.clearRect(0,0,width,height);
  // Grounding ellipse and fine construction axes.
  ctx.save();ctx.translate(width*.5,height*.72);ctx.scale(1,.21);const shadow=ctx.createRadialGradient(0,0,5,0,0,width*.34);shadow.addColorStop(0,'rgba(49,76,52,.15)');shadow.addColorStop(1,'rgba(49,76,52,0)');ctx.fillStyle=shadow;ctx.beginPath();ctx.arc(0,0,width*.34,0,Math.PI*2);ctx.fill();ctx.restore();
  const panels=[],N=30,M=18;for(let i=0;i<N;i++)for(let j=0;j<M;j++){const u=i/N*2-1,v=j/M*2-1;let corners=[point(u,v),point(u+2/N,v),point(u+2/N,v+2/M),point(u,v+2/M)];panels.push({corners,depth:corners.reduce((s,p)=>s+p[2],0)/4,i,j});}panels.sort((a,b)=>a.depth-b.depth);
  for(const p of panels){ctx.beginPath();p.corners.forEach((v,i)=>i?ctx.lineTo(v[0],v[1]):ctx.moveTo(v[0],v[1]));ctx.closePath();const shade=Math.round(228+p.depth*1.4);ctx.fillStyle=`rgba(${shade},${Math.min(250,shade+6)},${shade-4},.96)`;ctx.fill();ctx.strokeStyle=p.i%5===0?'rgba(56,88,59,.45)':'rgba(87,113,82,.25)';ctx.lineWidth=p.i%5===0?.85:.45;ctx.stroke();}
  for(let i=0;i<=6;i++){const u=i/6*2-1,a=point(u,-1),b=project(u*8,-2.8,-4.8);ctx.beginPath();ctx.moveTo(...a.slice(0,2));ctx.lineTo(...b.slice(0,2));ctx.strokeStyle='rgba(65,91,63,.28)';ctx.lineWidth=1;ctx.stroke();ctx.beginPath();ctx.arc(b[0],b[1],2,0,Math.PI*2);ctx.fillStyle='#819577';ctx.fill();}
  canvas.dataset.angle=yaw.toFixed(3);hero.dataset.canvasReady='true';if(!reduced()||Math.abs(yaw-targetYaw)+Math.abs(tilt-targetTilt)>.005)schedule();
 }
 function schedule(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(render);}
 new ResizeObserver(()=>{const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);schedule();}).observe(canvas);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;schedule();}).observe(hero);
 button.addEventListener('click',()=>{view=(view+1)%3;targetYaw=[-.5,.65,1.8][view];targetTilt=[.48,.78,.35][view];hero.querySelector('#opening-view-label').textContent=labels[view];schedule();});
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!drag)return;targetYaw+=(e.clientX-drag.x)*.009;targetTilt=Math.max(.15,Math.min(1.1,targetTilt+(e.clientY-drag.y)*.005));drag={x:e.clientX,y:e.clientY};schedule();});for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>drag=null);
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();if(e.key==='ArrowLeft')targetYaw-=.2;if(e.key==='ArrowRight')targetYaw+=.2;if(e.key==='ArrowUp')targetTilt=Math.min(1.1,targetTilt+.1);if(e.key==='ArrowDown')targetTilt=Math.max(.15,targetTilt-.1);schedule();});
 new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',()=>{last=0;schedule();});matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',schedule);
})();
