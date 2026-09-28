(() => {
  'use strict';
  const canvas = document.querySelector('#site-atmosphere');
  const gl = canvas.getContext('webgl', {alpha:false, antialias:false, depth:false, powerPreference:'low-power'});
  if (!gl) return; // CSS supplies a static atmospheric background.
  const vertex = 'attribute vec2 a; void main(){gl_Position=vec4(a,0.,1.);}';
  const fragment = `precision mediump float;
    uniform vec2 size; uniform float time; uniform float scroll;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.05+3.7;a*=.5;}return v;}
    void main(){vec2 uv=gl_FragCoord.xy/size;vec2 p=uv*vec2(size.x/size.y,1.)*3.2;p.y+=scroll*.00016;
      vec2 q=vec2(fbm(p+vec2(time*.025,0.)),fbm(p+vec2(4.1,-time*.018)));
      float cloud=fbm(p+3.4*q+vec2(0.,-time*.035));
      float strands=pow(1.-abs(sin((cloud+q.x*.35)*17.)),7.);
      float veil=smoothstep(.32,.82,cloud)*(.22+strands*.78);
      float edge=.5+.5*abs(uv.x-.5)*2.;
      vec3 base=vec3(.032,.043,.049);
      vec3 fog=mix(vec3(.19,.26,.25),vec3(.30,.31,.36),uv.x);
      vec3 color=base+fog*veil*edge*.62;
      color+=vec3(.012,.022,.024)*pow(1.-distance(uv,vec2(.72,.4)),3.);
      gl_FragColor=vec4(color,1.);
    }`;
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))return null;return s;}
  const v=shader(gl.VERTEX_SHADER,vertex),f=shader(gl.FRAGMENT_SHADER,fragment);if(!v||!f)return;
  const program=gl.createProgram();gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
  const uniforms={size:gl.getUniformLocation(program,'size'),time:gl.getUniformLocation(program,'time'),scroll:gl.getUniformLocation(program,'scroll')};
  const media=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0,clock=0,scroll=window.scrollY;
  const paused=()=>media.matches||document.body.classList.contains('motion-paused')||document.body.classList.contains('dialog-open');
  function paint(){gl.uniform2f(uniforms.size,canvas.width,canvas.height);gl.uniform1f(uniforms.time,clock);gl.uniform1f(uniforms.scroll,scroll);gl.drawArrays(gl.TRIANGLES,0,6);canvas.dataset.ready='true';canvas.dataset.frame=clock.toFixed(2);}
  function resize(){const scale=Math.min(.65,900/innerWidth);canvas.width=Math.round(innerWidth*scale);canvas.height=Math.round(innerHeight*scale);gl.viewport(0,0,canvas.width,canvas.height);paint();}
  function tick(now){raf=0;if(document.hidden||paused()){last=0;return;}if(now-last>=33){clock+=last?Math.min((now-last)/1000,.1):0;last=now;scroll+=(window.scrollY-scroll)*.075;paint();}raf=requestAnimationFrame(tick);}
  function sync(){cancelAnimationFrame(raf);raf=0;last=0;canvas.dataset.paused=String(paused());if(!document.hidden&&!paused())raf=requestAnimationFrame(tick);else paint();}
  addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);canvas.style.display='none';});resize();sync();
})();
