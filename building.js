(() => {
 'use strict';
 const section=document.querySelector('#building-tour'),stage=section.querySelector('.building-stage'),canvas=section.querySelector('canvas');
 const fallback=reason=>{section.classList.add('model-unavailable');section.querySelector('.building-instructions').textContent=reason;};
 if(!window.THREE){fallback('The 3D viewer could not load. The original project rendering is shown.');return;}
 const T=THREE;let renderer;
 try{renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});}catch(e){fallback('3D is unavailable in this browser. The original project rendering is shown.');return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
 const scene=new T.Scene(),camera=new T.OrthographicCamera(-24,24,18,-18,.1,200);scene.add(new T.HemisphereLight(0xffffff,0x6c8058,2.4));
 const sun=new T.DirectionalLight(0xfff7e4,3);sun.position.set(-12,25,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;sun.shadow.bias=-.0005;scene.add(sun);
 const mat=(color,roughness=.75)=>new T.MeshStandardMaterial({color,roughness,metalness:0});
 const white=mat(0xf0eee3),glass=mat(0x597f83,.25),frame=mat(0xc6cdc3,.4),ground=mat(0xa6b493),paving=mat(0xd3d1bd),trunk=mat(0x72614c),leaf=mat(0x67805a),accent=mat(0x8eac71),dark=mat(0x6d7666);
 const root=new T.Group();scene.add(root);const roofs=new T.Group(),facades=new T.Group(),landscape=new T.Group();root.add(roofs,facades,landscape);
 function mesh(geo,material,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const box=(w,h,d,m,p,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),m,p,x,y,z);
 box(36,.35,27,ground,landscape,0,-.28,0);box(34,.12,25,paving,landscape,0,-.06,0);
 // Elliptical wings, undulating roof edges and glazed perimeter: an interpretive massing study.
 function wing(cx,cz,rx,rz,height,phase){
  const N=96,R=20,pos=[],idx=[];const edge=a=>height+.38*Math.sin(2*a+phase);
  for(let r=0;r<=R;r++){const q=r/R;for(let j=0;j<=N;j++){let a=j/N*Math.PI*2;pos.push(cx+rx*q*Math.cos(a),height+.38*Math.sin(2*a+phase)*q*q+1.2*(1-q*q),cz+rz*q*Math.sin(a));}}
  for(let r=0;r<R;r++)for(let j=0;j<N;j++){let a=r*(N+1)+j,b=a+N+1;idx.push(a,b,a+1,b,b+1,a+1);}
  let g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();let roofmat=white.clone();roofmat.side=T.DoubleSide;mesh(g,roofmat,roofs);
  const walls=[],wi=[],band=[],bi=[];
  for(let j=0;j<=N;j++){let a=j/N*Math.PI*2,x=cx+rx*.975*Math.cos(a),z=cz+rz*.975*Math.sin(a),h=edge(a);walls.push(x,.18,z,x,h-.13,z);band.push(cx+rx*Math.cos(a),h-.23,cz+rz*Math.sin(a),cx+rx*Math.cos(a),h,cz+rz*Math.sin(a));if(j<N){let k=2*j;wi.push(k,k+1,k+2,k+1,k+3,k+2);bi.push(k,k+1,k+2,k+1,k+3,k+2);}
   if(j%2===0&&j<N)box(.045,h-.2,.045,frame,facades,x,(h-.2)/2+.18,z);
  }
  for(const [verts,indices,material,parent] of [[walls,wi,glass,facades],[band,bi,white,roofs]]){let geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();const ma=material.clone();ma.side=T.DoubleSide;mesh(geo,ma,parent);}
 }
 // Three independent project models share an exhibition site, not a real masterplan.
 const sports=new T.Group();root.add(sports);sports.add(roofs,facades);sports.scale.setScalar(.58);sports.position.set(8,0,5);
 wing(-4,-2,6.2,3.4,2.8,.2);wing(4,1.2,6,3.9,2.4,1.3);wing(5,-5.5,4.5,2.8,3.8,.8);wing(-5,5.1,4,2.7,1.1,2.5);
 box(8,4,2.4,glass,sports,0,2,-6);for(let k=0;k<4;k++)box(8.2,.14,2.6,white,sports,0,.6+k*1.1,-6);
 const terminal=new T.Group();root.add(terminal);terminal.position.set(-8,0,3);
 const gold=mat(0xb7a465),road=mat(0x768078);
 function beam(a,b,width,material,parent){const v1=new T.Vector3(...a),v2=new T.Vector3(...b),m=mesh(new T.CylinderGeometry(width,width,v1.distanceTo(v2),5),material,parent);m.position.copy(v1).add(v2).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v2.sub(v1).normalize());return m;}
 box(12,.2,5,white,terminal,0,.15,0);
 for(let level=0;level<3;level++){const y=.6+level*1.35;box(11,1.2,3.8,glass,terminal,0,y+.5,0);box(11.5,.15,4.4,white,terminal,0,y+1.1,0);for(let x=-5;x<=5;x+=1){box(.09,1.25,4,frame,terminal,x,y+.5,0);}for(let x=-4;x<=4;x+=4)box(1,.8,.08,gold,terminal,x,y+.5,2);}
 box(11.8,.16,4.8,white,terminal,0,4.9,0);
 for(let x=-5.5;x<=5.5;x+=1.1){beam([x,4.98,-2.3],[x,5.75,0],.045,frame,terminal);beam([x,5.75,0],[x,4.98,2.3],.045,frame,terminal);beam([x,4.98,-2.3],[x,4.98,2.3],.04,frame,terminal);}
 beam([-5.5,5.75,0],[5.5,5.75,0],.05,frame,terminal);
 for(let side of [-1,1]){for(let i=0;i<20;i++)box(.22,.12+i*.13,.85,white,terminal,-4+i*.22,.15+i*.065,side*2.7);beam([-4,.8,side*3.05],[.3,3.35,side*3.05],.025,frame,terminal);}
 const tower=new T.Group();root.add(tower);tower.position.set(2,0,-6);
 box(6,.35,5,white,tower,0,.2,0);box(5,1.1,4,glass,tower,0,.9,0);
 const height=11.5,base=1.65,top=2.7;
 const geo=new T.BoxGeometry(2, height, 2,1,1,1),v=geo.attributes.position;
 for(let i=0;i<v.count;i++){const q=(v.getY(i)+height/2)/height,w=base+(top-base)*q;v.setX(i,v.getX(i)*w);v.setZ(i,v.getZ(i)*w*.8);}geo.computeVertexNormals();mesh(geo,glass,tower,0,1.5+height/2,0);
 for(let i=0;i<=25;i++){const q=i/25,w=base+(top-base)*q,y=1.5+height*q;box(2*w+.08,.045,2*w*.8+.08,frame,tower,0,y,0);}
 for(let side of [-1,1])for(let j=-4;j<=4;j++){let t=j/4;beam([base*t,1.5,side*base*.8],[top*t,13,side*top*.8],.027,frame,tower);beam([side*base,1.5,base*.8*t],[side*top,13,top*.8*t],.027,frame,tower);}
 for(let x of [-1,1])for(let z of [-1,1])beam([x*base,1.5,z*base*.8],[x*top,13,z*top*.8],.1,white,tower);
 box(5.6,.2,4.5,white,tower,0,13.08,0);box(3,.6,2,white,tower,0,13.45,0);
 box(32,.02,1.4,road,landscape,0,.03,10.6);box(1.8,.03,20,paving,landscape,0,.09,0);
 for(let x=-14;x<16;x+=2)box(.8,.025,.055,white,landscape,x,.06,10.6);
 for(const [x,z] of [[-15,-9],[-12,-9],[-8,-9],[-4,-9],[7,-10],[12,-10],[15,-6],[15,-1],[15,6],[-15,7],[-15,1],[-14,-4],[4,9],[8,9],[-7,9]]){
 mesh(new T.CylinderGeometry(.6,.6,.1,16),accent,landscape,x,.12,z);mesh(new T.CylinderGeometry(.07,.1,.8,6),trunk,landscape,x,.6,z);mesh(new T.IcosahedronGeometry(.6,1),leaf,landscape,x,1.3,z);}
 const grid=new T.GridHelper(52,52,0x7c9270,0x9caf91);grid.position.y=-.49;grid.material.transparent=true;grid.material.opacity=.18;scene.add(grid);
 const shadow=mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.13}),scene,0,-.48,0);shadow.rotation.x=-Math.PI/2;
 const views=[
 {name:'Academic Projects',text:'Explore the shared display site. Tap a numbered building to open its project story.',part:null,target:[0,2,0],yaw:.55,pitch:.72,distance:49},
 {name:'01 / Nexus Terminal',text:'Porto / BIM coordination, scheduling and estimation for a multi-level metro station.',part:null,target:[-8,2,3],yaw:.6,pitch:.65,distance:29},
 {name:'02 / Miami Tower',text:'Miami / Site logistics, quantity takeoffs and pre-construction planning for a bank and office tower.',part:null,target:[2,6,-6],yaw:.5,pitch:.5,distance:30},
 {name:'03 / Thesis Sports Complex',text:'Bangalore / An architectural thesis linking sports, training and public space.',part:null,target:[8,1,5],yaw:.5,pitch:.8,distance:23}];
 const buttons=[...section.querySelectorAll('[data-view]')],markers=[...section.querySelectorAll('.model-marker')];
 let current=0,manual=false,yaw=.65,pitch=.72,distance=49,goal={yaw,pitch,distance,target:new T.Vector3(0,2,0)},target=new T.Vector3(0,2,0),panMode=false,drag=null,visible=false,raf=null,lastProgress=-1;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-paused');
 const originals=new Map();root.traverse(m=>{if(m.isMesh)originals.set(m,{color:m.material.color.clone(),emissive:m.material.emissive.clone()});});
 function select(index,byUser=false){current=index;const v=views[index];if(byUser){manual=true;goal={yaw:v.yaw,pitch:v.pitch,distance:v.distance,target:new T.Vector3(...v.target)};}
  section.querySelector('#building-view-title').textContent=v.name;section.querySelector('#building-view-copy').textContent=v.text;section.querySelector('#building-view-number').textContent=index?'SELECTED PROJECT / 0'+index:'01-03 / PROJECT CAMPUS';buttons.forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.view)===index));
  root.traverse(m=>{if(m.isMesh){const o=originals.get(m);m.material.color.copy(o.color);m.material.emissive.copy(o.emissive);}});if(v.part)v.part.traverse(m=>{if(m.isMesh){m.material.emissive.set(0x29420e);m.material.color.lerp(new T.Color(0xaed584),.35);}});requestRender();
 }
 buttons.forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.view),true)));
 function updateScroll(){const bounds=section.getBoundingClientRect(),progress=T.MathUtils.clamp(-bounds.top/Math.max(1,section.offsetHeight-innerHeight),0,1);section.querySelector('.building-progress span').style.width=`${progress*100}%`;if(!manual&&!reduced()){
  goal.yaw=.55+progress*Math.PI*2;goal.pitch=.72;goal.distance=49;goal.target.set(0,2,0);}
  lastProgress=progress;requestRender();
 }
 function setMode(pan){panMode=pan;section.querySelector('[data-camera=pan]').setAttribute('aria-pressed',String(pan));section.querySelector('[data-camera=rotate]').setAttribute('aria-pressed',String(!pan));canvas.classList.toggle('pan-mode',pan);}
 section.querySelectorAll('[data-camera]').forEach(b=>b.addEventListener('click',()=>{const action=b.dataset.camera;if(action==='reset'){select(0,true);setMode(false);}else if(action==='pan'||action==='rotate'){manual=true;setMode(action==='pan');}else{manual=true;goal.distance=T.MathUtils.clamp(goal.distance+(action==='in'?-4:4),16,70);}requestRender();}));
 // Screen-space panning follows the pointer at every zoom and camera angle.
 function panBy(dx,dy){const aspect=stage.clientWidth/stage.clientHeight,units=goal.distance*.76*Math.max(1,1/aspect)/stage.clientHeight;
 const right=new T.Vector3(Math.cos(goal.yaw),0,-Math.sin(goal.yaw));
 const up=new T.Vector3(-Math.sin(goal.yaw)*Math.sin(goal.pitch),Math.cos(goal.pitch),-Math.cos(goal.yaw)*Math.sin(goal.pitch));
 goal.target.addScaledVector(right,-dx*units).addScaledVector(up,dy*units);goal.target.clamp(new T.Vector3(-35,-15,-35),new T.Vector3(35,25,35));}
 const pointers=new Map();let gesture=null;
 function snapshot(){const a=[...pointers.values()];return a.length>1?{x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2,gap:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}:null;}
 canvas.addEventListener('contextmenu',e=>e.preventDefault());
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0&&e.button!==2)return;e.preventDefault();manual=true;canvas.focus({preventScroll:true});pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});drag={x:e.clientX,y:e.clientY,pan:e.button===2};gesture=snapshot();canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;e.preventDefault();const old=pointers.get(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const next=snapshot();
 if(next&&gesture){panBy(next.x-gesture.x,next.y-gesture.y);if(next.gap>5)goal.distance=T.MathUtils.clamp(goal.distance*gesture.gap/next.gap,16,70);gesture=next;}
 else{const dx=e.clientX-old.x,dy=e.clientY-old.y;if(panMode||e.shiftKey||drag?.pan)panBy(dx,dy);else{goal.yaw-=dx/stage.clientWidth*Math.PI*2;goal.pitch=T.MathUtils.clamp(goal.pitch+dy*.005,.16,1.4);}}
 requestRender();});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{pointers.delete(e.pointerId);gesture=snapshot();if(!pointers.size)drag=null;});
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key))return;e.preventDefault();manual=true;
 if((panMode||e.shiftKey)&&e.key.startsWith('Arrow'))panBy(e.key==='ArrowLeft'?-30:e.key==='ArrowRight'?30:0,e.key==='ArrowUp'?-30:e.key==='ArrowDown'?30:0);
 else{if(e.key==='ArrowLeft')goal.yaw-=.15;if(e.key==='ArrowRight')goal.yaw+=.15;if(e.key==='ArrowUp')goal.pitch=Math.min(1.4,goal.pitch+.1);if(e.key==='ArrowDown')goal.pitch=Math.max(.16,goal.pitch-.1);}
 if(['+','='].includes(e.key))goal.distance=Math.max(16,goal.distance-3);if(e.key==='-')goal.distance=Math.min(70,goal.distance+3);requestRender();});
 const positions=[new T.Vector3(-8,6,3),new T.Vector3(2,14,-6),new T.Vector3(8,3,5)];
 function render(){raf=null;if(!visible||document.hidden)return;const ease=reduced()?1:.12;yaw=T.MathUtils.lerp(yaw,goal.yaw,ease);pitch=T.MathUtils.lerp(pitch,goal.pitch,ease);distance=T.MathUtils.lerp(distance,goal.distance,ease);target.lerp(goal.target,ease);const aspect=stage.clientWidth/stage.clientHeight;const responsive=1;const span=distance*.38;camera.left=-span*Math.max(1,aspect);camera.right=-camera.left;camera.top=span*Math.max(1,1/aspect);camera.bottom=-camera.top;camera.updateProjectionMatrix();camera.position.set(target.x+Math.sin(yaw)*Math.cos(pitch)*distance*responsive,target.y+Math.sin(pitch)*distance*responsive,target.z+Math.cos(yaw)*Math.cos(pitch)*distance*responsive);camera.lookAt(target);renderer.render(scene,camera);
  markers.forEach((m,i)=>{const v=positions[i].clone().project(camera);m.style.left=`${(v.x*.5+.5)*stage.clientWidth}px`;m.style.top=`${(-v.y*.5+.5)*stage.clientHeight}px`;m.hidden=v.z>1||Math.abs(v.x)>.94||Math.abs(v.y)>.8;});
  canvas.dataset.target=target.toArray().map(v=>v.toFixed(3)).join(",");canvas.dataset.yaw=yaw.toFixed(3);canvas.dataset.distance=distance.toFixed(2);canvas.dataset.view=String(current);
  if(Math.abs(yaw-goal.yaw)+Math.abs(pitch-goal.pitch)+Math.abs(distance-goal.distance)+target.distanceTo(goal.target)>.003)requestRender();
 }
 function requestRender(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(render);}
 new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight,false);camera.updateProjectionMatrix();requestRender();}).observe(stage);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){updateScroll();requestRender();}},{rootMargin:'100px'}).observe(section);
 addEventListener('scroll',()=>{if(visible)updateScroll();},{passive:true});document.addEventListener('visibilitychange',requestRender);
 new MutationObserver(()=>{if(reduced())select(current,true);requestRender();}).observe(document.body,{attributes:true,attributeFilter:['class']});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback('The 3D view was interrupted. Reload to restore it.');});
 stage.dataset.ready='true';select(0);updateScroll();
})();
