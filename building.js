(() => {
 'use strict';
 const section=document.querySelector('#building-tour'),stage=section.querySelector('.building-stage'),canvas=section.querySelector('canvas');
 const fallback=reason=>{section.classList.add('model-unavailable');section.querySelector('.building-instructions').textContent=reason;};
 if(!window.THREE){fallback('The 3D viewer could not load. The original project rendering is shown.');return;}
 const T=THREE;let renderer;
 try{renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});}catch(e){fallback('3D is unavailable in this browser. The original project rendering is shown.');return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.85;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.1,200);scene.add(new T.HemisphereLight(0xffffff,0x6c8058,2.4));
 const sun=new T.DirectionalLight(0xfff7e4,3);sun.position.set(-12,25,15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;sun.shadow.bias=-.0005;scene.add(sun);
 const mat=(color,roughness=.75)=>new T.MeshStandardMaterial({color,roughness,metalness:0});
 const white=mat(0xf0eee3),glass=mat(0x597f83,.25),frame=mat(0xc6cdc3,.4),ground=mat(0xa6b493),paving=mat(0xd3d1bd),trunk=mat(0x72614c),leaf=mat(0x67805a),accent=mat(0x8eac71),dark=mat(0x6d7666);
 const root=new T.Group();scene.add(root);const roofs=new T.Group(),facades=new T.Group(),landscape=new T.Group();root.add(roofs,facades,landscape);
 function mesh(geo,material,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 const box=(w,h,d,m,p,x,y,z)=>mesh(new T.BoxGeometry(w,h,d),m,p,x,y,z);
 box(26,.35,20,ground,landscape,0,-.28,0);box(24,.12,18,paving,landscape,0,-.06,0);
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
 wing(-4,-2,6.2,3.4,2.8,.2);wing(4,1.2,6,3.9,2.4,1.3);wing(5,-5.5,4.5,2.8,3.8,.8);wing(-5,5.1,4,2.7,1.1,2.5);
 // Central landscaped spine, approach paths and small trees establish scale.
 box(2,.08,8,paving,landscape,0,.08,5);box(5,.09,1.2,paving,landscape,-1,.09,2);
 for(const [x,z,s] of [[-10,-6,1],[-10,1,.8],[-9,7,1],[10,7,.9],[10,-8,.8],[1,7,.7],[-1,4,.65],[-2,7,.6],[8,6,.65],[-11,-2,.7],[3,-8,.8]]){
  const bed=mesh(new T.CylinderGeometry(1.1*s,1.1*s,.12,24),accent,landscape,x,.07,z);
  mesh(new T.CylinderGeometry(.08*s,.12*s,1.2*s,7),trunk,landscape,x,.7*s,z);
  let tree=mesh(new T.IcosahedronGeometry(.8*s,1),leaf,landscape,x,1.65*s,z);tree.scale.y=1.35;
 }
 // Thin paving strips lead toward the public entrance.
 for(let i=0;i<7;i++)box(3,.025,.06,dark,landscape,1,.08,6+i*.43);
 const grid=new T.GridHelper(38,38,0x7c9270,0x9caf91);grid.position.y=-.49;grid.material.transparent=true;grid.material.opacity=.18;scene.add(grid);
 const shadow=mesh(new T.PlaneGeometry(200,200),new T.ShadowMaterial({opacity:.13}),scene,0,-.48,0);shadow.rotation.x=-Math.PI/2;
 const views=[{name:'The whole, in motion.',text:'Three curved volumes, a lower pavilion, and a connected landscape. Scroll to orbit the study, or drag to choose your own view.',part:null,target:[0,1,0],yaw:.65,pitch:.72,distance:39},{name:'A roof that flows.',text:'Follow the sweeping roof forms and their changing edges. The pale shells are highlighted so you can read their relationship.',part:roofs,target:[1,2,-1],yaw:1.1,pitch:.85,distance:29},{name:'The transparent edge.',text:'Move closer to the glazed perimeter, where the curved roof meets a rhythm of slender vertical frames.',part:facades,target:[2,1,3],yaw:.3,pitch:.35,distance:25},{name:'Landscape connects.',text:'Pull back to see how the public approach and planted spaces bring the separate volumes together.',part:landscape,target:[0,0,3],yaw:-.7,pitch:1.02,distance:35}];
 const buttons=[...section.querySelectorAll('[data-view]')],markers=[...section.querySelectorAll('.model-marker')];
 let current=0,manual=false,yaw=.65,pitch=.72,distance=39,goal={yaw,pitch,distance,target:new T.Vector3(0,1,0)},target=new T.Vector3(0,1,0),panMode=false,drag=null,visible=false,raf=null,lastProgress=-1;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('motion-paused');
 const originals=new Map();root.traverse(m=>{if(m.isMesh)originals.set(m,{color:m.material.color.clone(),emissive:m.material.emissive.clone()});});
 function select(index,byUser=false){current=index;const v=views[index];if(byUser){manual=true;goal={yaw:v.yaw,pitch:v.pitch,distance:v.distance,target:new T.Vector3(...v.target)};}
  section.querySelector('#building-view-title').textContent=v.name;section.querySelector('#building-view-copy').textContent=v.text;section.querySelector('#building-view-number').textContent=`0${index+1} / SPATIAL STUDY`;buttons.forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.view)===index));
  root.traverse(m=>{if(m.isMesh){const o=originals.get(m);m.material.color.copy(o.color);m.material.emissive.copy(o.emissive);}});if(v.part)v.part.traverse(m=>{if(m.isMesh){m.material.emissive.set(0x29420e);m.material.color.lerp(new T.Color(0xaed584),.35);}});requestRender();
 }
 buttons.forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.view),true)));
 function updateScroll(){const bounds=section.getBoundingClientRect(),progress=T.MathUtils.clamp(-bounds.top/Math.max(1,section.offsetHeight-innerHeight),0,1);section.querySelector('.building-progress span').style.width=`${progress*100}%`;if(!manual&&!reduced()){
  goal.yaw=.65+progress*Math.PI*1.55;goal.pitch=.65+Math.sin(progress*Math.PI)*.35;goal.distance=39-Math.sin(progress*Math.PI)*12;goal.target.set(0,1,progress> .66?1:0);let idx=Math.min(3,Math.floor(progress*4));if(idx!==current)select(idx);}
  lastProgress=progress;requestRender();
 }
 section.querySelectorAll('[data-camera]').forEach(b=>b.addEventListener('click',()=>{const action=b.dataset.camera;if(action==='reset'){manual=false;select(0,true);manual=false;updateScroll();}else if(action==='pan'){panMode=!panMode;b.setAttribute('aria-pressed',panMode);canvas.classList.toggle('pan-mode',panMode);}else{manual=true;goal.distance=T.MathUtils.clamp(goal.distance+(action==='in'?-4:4),17,55);}requestRender();}));
 canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;manual=true;drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag={x:e.clientX,y:e.clientY};if(panMode||e.shiftKey){const right=new T.Vector3(Math.cos(goal.yaw),0,-Math.sin(goal.yaw));goal.target.addScaledVector(right,-dx*.025);goal.target.y=T.MathUtils.clamp(goal.target.y+dy*.025,-2,6);goal.target.x=T.MathUtils.clamp(goal.target.x,-9,9);goal.target.z=T.MathUtils.clamp(goal.target.z,-9,9);}else{goal.yaw-=dx*.007;goal.pitch=T.MathUtils.clamp(goal.pitch+dy*.005,.16,1.4);}requestRender();});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>drag=null);
 canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','='].includes(e.key))return;e.preventDefault();manual=true;if(e.key==='ArrowLeft')goal.yaw-=.15;if(e.key==='ArrowRight')goal.yaw+=.15;if(e.key==='ArrowUp')goal.pitch=Math.min(1.4,goal.pitch+.1);if(e.key==='ArrowDown')goal.pitch=Math.max(.16,goal.pitch-.1);if(['+','='].includes(e.key))goal.distance=Math.max(17,goal.distance-3);if(e.key==='-')goal.distance=Math.min(55,goal.distance+3);requestRender();});
 const positions=[new T.Vector3(5,4,-5),new T.Vector3(7,1,3),new T.Vector3(-1,.5,7)];
 function render(){raf=null;if(!visible||document.hidden)return;const ease=reduced()?1:.12;yaw=T.MathUtils.lerp(yaw,goal.yaw,ease);pitch=T.MathUtils.lerp(pitch,goal.pitch,ease);distance=T.MathUtils.lerp(distance,goal.distance,ease);target.lerp(goal.target,ease);const responsive=Math.max(1,1.15/camera.aspect);camera.position.set(target.x+Math.sin(yaw)*Math.cos(pitch)*distance*responsive,target.y+Math.sin(pitch)*distance*responsive,target.z+Math.cos(yaw)*Math.cos(pitch)*distance*responsive);camera.lookAt(target);renderer.render(scene,camera);
  markers.forEach((m,i)=>{const v=positions[i].clone().project(camera);m.style.left=`${(v.x*.5+.5)*stage.clientWidth}px`;m.style.top=`${(-v.y*.5+.5)*stage.clientHeight}px`;m.hidden=v.z>1||Math.abs(v.x)>.94||Math.abs(v.y)>.8;});
  canvas.dataset.yaw=yaw.toFixed(3);canvas.dataset.distance=distance.toFixed(2);canvas.dataset.view=String(current);
  if(Math.abs(yaw-goal.yaw)+Math.abs(pitch-goal.pitch)+Math.abs(distance-goal.distance)+target.distanceTo(goal.target)>.003)requestRender();
 }
 function requestRender(){if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(render);}
 new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight,false);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();requestRender();}).observe(stage);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){updateScroll();requestRender();}},{rootMargin:'100px'}).observe(section);
 addEventListener('scroll',()=>{if(visible)updateScroll();},{passive:true});document.addEventListener('visibilitychange',requestRender);
 new MutationObserver(()=>{if(reduced())select(current,true);requestRender();}).observe(document.body,{attributes:true,attributeFilter:['class']});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback('The 3D view was interrupted. Reload to restore it.');});
 stage.dataset.ready='true';select(0);updateScroll();
})();
