"use strict";
/* Canvas renderer. Real 3D coordinates, perspective projection and depth-sorted polygon faces.
   CPU-rendered via Canvas 2D, so no WebGL dependency. HTML controls remain the scoring surface. */
const Arcade3D=(()=>{
 const G=Geometry3D,worlds={
 island:{base:"#a86a32",trim:"#ffcf70",light:"#fff0b0",ground:"#b28d54",gem:"#ffce63"},
 crystal:{base:"#5742a3",trim:"#8fdcf7",light:"#e3ffff",ground:"#40396d",gem:"#80e4ff"},
 jungle:{base:"#687e47",trim:"#d8b567",light:"#f3efaa",ground:"#3a6046",gem:"#c6e57d"},
 volcano:{base:"#59404a",trim:"#f08d48",light:"#ffe3a1",ground:"#4a333c",gem:"#ff9457"},
 sky:{base:"#657aaf",trim:"#f5d787",light:"#f7f5ff",ground:"#7186b2",gem:"#fce8a0"}
 };
 let enabled=true,scene=null,target=null,raf=0,last=0,active=false,reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
 function available(){try{return !!document.createElement("canvas").getContext("2d");}catch{return false;}}
 enabled=available();
 function surface(canvas){try{const rect=canvas.getBoundingClientRect();if(rect.width<2||rect.height<2)return null;const d=Math.min(window.devicePixelRatio||1,1.5),w=Math.round(rect.width*d),h=Math.round(rect.height*d);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}const ctx=canvas.getContext("2d");if(!ctx)return null;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,rect.width,rect.height);return {ctx,w:rect.width,h:rect.height};}catch{return null;}}
 function poly(ctx,points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.55;ctx.stroke();}}
 function draw(ctx,meshes,camera){G.facesFor(meshes,camera).forEach(f=>poly(ctx,f.points,f.fill,"rgba(18,25,35,.17)"));}
 function shadow(ctx,x,y,rx,ry){ctx.save();ctx.fillStyle="rgba(6,10,23,.29)";ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.restore();}
 function crate(world,yaw,t,burst){const w=worlds[world]||worlds.island,mesh=[];const pitch=.12,center=[0,.02,0],add=(pos,size,color,roll=0)=>{const p=G.rotate(pos,yaw,pitch);mesh.push(G.box(p,size,color,[yaw,pitch,roll]));};
 if(burst!==null&&!reduce.matches){const a=Math.min(1,burst/.72);for(let i=0;i<12;i++){const theta=i*Math.PI*2/12;const rad=.3+a*2.1;const y=Math.sin(theta)*rad+.5*a-1.2*a*a;mesh.push(G.box([Math.cos(theta)*rad,y,Math.sin(theta*3)*a*1.3],[.24,.13,.16],i%3===0?w.trim:w.base,[yaw+a*3+i,a*4,i+a*3]));}mesh.push(G.gem([0,.14+Math.sin(a*Math.PI)*.4,0],.45,1,w.gem,[yaw*1.5,t*.2,0]));return mesh;}
 if(burst!==null){mesh.push(G.gem([0,0,0],.48,1,w.gem,[.5,.1,0]));return mesh;}
 add(center,[1.42,1.42,1.42],w.base);
 // Raised planks, metal corners and inset gem, all geometry rather than a flat image.
 for(const x of [-.62,.62]){add([x,0,-.74],[.15,1.48,.1],w.trim);add([x,0,.74],[.15,1.48,.1],w.trim);}
 for(const y of [-.62,.62]){add([0,y,-.74],[1.46,.15,.1],w.trim);add([0,y,.74],[1.46,.15,.1],w.trim);}
 for(const x of [-.35,0,.35])add([x,0,-.72],[.035,1.15,.035],w.trim);
 for(const z of [-.62,.62]){add([-.74,0,z],[.1,1.48,.15],w.trim);add([.74,0,z],[.1,1.48,.15],w.trim);}
 for(const x of [-.62,.62])add([x,.74,0],[.15,.1,1.48],w.trim);
 const p=G.rotate([0,0,-.86],yaw,pitch);mesh.push(G.gem(p,.25,.5,w.light,[yaw,pitch,0]));return mesh;
 }
 function environment(world,t){const w=worlds[world]||worlds.island,m=[];
 const b=(p,s,c,a)=>m.push(G.box(p,s,c,a));
 const g=(p,r,h,c,a)=>m.push(G.gem(p,r,h,c,a));
 const cy=(p,r,h,n,c,a)=>m.push(G.prism(p,r,h,n,c,a));
 const sides=[-1,1];
 // Floating foreground platforms and world props, outside the target lanes.
 for(const s of sides){b([s*4.1,-1.5,1.5],[2.2,.4,3.8],w.ground,[s*.15,0,0]);
 if(world==="island"){cy([s*4.2,-.5,2.8],.18,2.5,7,"#91643b",[0,0,s*.14]);for(let i=0;i<5;i++){const a=i*Math.PI*2/5+t*.045;b([s*4.2+Math.cos(a)*.48,.85,2.8+Math.sin(a)*.48],[1.1,.11,.34],"#4fa77a",[a,0,s*.14]);}for(let i=0;i<3;i++)b([s*(3.5+i*.55),-1.1,4+i*.2],[.38,.38,.38],w.trim,[i*.3,0,0]);}
 if(world==="crystal"){for(let i=0;i<3;i++)g([s*(3.55+i*.55),-.3+i*.12,2.4+i*.75],.37+i*.07,1.8+i*.38,i%2?w.trim:w.gem,[i*.3,0,s*.14]);}
 if(world==="jungle"){for(let i=0;i<4;i++)b([s*4,-1.1+i*.47,3],[1.2-i*.09,.45,.9],"#84906a",[i*.04,0,0]);g([s*4,.95,3],.3,.8,w.gem,[t*.4,0,0]);for(let i=0;i<3;i++)b([s*(3.7+i*.4),-.25+i*.22,4.4],[.42,.14,.8],"#4d9d64",[i*.7,0,.2]);}
 if(world==="volcano"){for(let i=0;i<3;i++)g([s*(3.6+i*.45),-.7,2.7+i*.7],.55,1.8,i===1?"#c9573f":"#5d4653",[i*.4,.1,0]);for(let i=0;i<4;i++)g([s*(3.2+i*.4),-.2+((t*.35+i*.24)%1)*2.1,3.8+i*.15],.08,.18,w.gem,[t+i,0,0]);}
 if(world==="sky"){for(let i=0;i<3;i++){b([s*(3.6+i*.4),-.8+i*.22,3+i*.9],[.6,.35,.8],"#c6d4f5",[0,0,0]);cy([s*(3.6+i*.4),-.5+i*.22,3+i*.9],.19,.65,6,w.trim);}g([s*4,.65+Math.sin(t*.6)*.14,4],.3,.85,w.light,[t*.4,0,0]);}}
 return m;
 }
 function drawScene(canvas,world,t){const q=surface(canvas);if(!q)return;const {ctx,w,h}=q;const p=worlds[world]||worlds.island;
 const cam={x:w/2,y:h*.52,focal:Math.min(w,h)*.92,distance:8,height:.8};draw(ctx,environment(world,t),cam);
 // Slowly moving highlights; keep the central 3x3 target unobstructed.
 ctx.save();ctx.fillStyle=p.light;for(let i=0;i<16;i++){const a=(i*71.3)%100/100,side=i%2===0?1:-1,x=w/2+side*w*(.33+a*.15),y=h*(.16+((i*.157+t*.018)%1)*.67);ctx.globalAlpha=.18+.28*(1+Math.sin(t*1.4+i))/2;ctx.beginPath();ctx.arc(x,y,1+(i%3)*.7,0,Math.PI*2);ctx.fill();}ctx.restore();
 }
 function drawObject(obj,t){const q=surface(obj.canvas);if(!q)return;const {ctx,w,h}=q;const age=obj.hit?Math.max(0,(performance.now()-obj.born)/1000):null,yaw=.60+(reduce.matches?0:Math.sin(t*1.25)*.24);
 shadow(ctx,w/2,h*.83,w*.30,h*.065);
 const cam={x:w/2,y:h*.47,focal:Math.min(w,h)*2.05,distance:4.3,height:0};
 draw(ctx,crate(obj.world,yaw,t,age),cam);
 }
 function frame(now){raf=0;if(!active||!enabled||document.hidden)return;if(now-last>=32||reduce.matches){last=now;const t=reduce.matches?0:now/1000;try{if(scene?.canvas.isConnected)drawScene(scene.canvas,scene.world,t);if(target?.canvas.isConnected)drawObject(target,t);}catch{disable();return;}}if(!reduce.matches)raf=requestAnimationFrame(frame);}
 function wake(){if(!active||!enabled||document.hidden)return;if(!raf)raf=requestAnimationFrame(frame);}
 function disable(){enabled=false;stop();document.querySelectorAll(".meshReady").forEach(n=>n.classList.remove("meshReady"));document.querySelectorAll(".meshCanvas").forEach(n=>n.remove());if(scene?.canvas)scene.canvas.hidden=true;}
 function setEnabled(on){enabled=!!on&&available();if(!enabled)disable();return enabled;}
 function setScene(canvas,world){scene={canvas,world};canvas.hidden=!enabled;active=enabled;wake();}
 function object(container,world,hit){if(!enabled)return false;try{const canvas=document.createElement("canvas");canvas.className="meshCanvas";canvas.setAttribute("aria-hidden","true");if(!canvas.getContext("2d"))return false;container.append(canvas);container.classList.add("meshReady");target={canvas,world,hit,born:performance.now()};active=true;wake();return true;}catch{return false;}}
 function stop(){active=false;if(raf)cancelAnimationFrame(raf);raf=0;target=null;}
 function refresh(){if(active){if(raf)cancelAnimationFrame(raf);raf=0;wake();}}
 window.addEventListener("resize",refresh);document.addEventListener("visibilitychange",()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else refresh();});if(reduce.addEventListener)reduce.addEventListener("change",refresh);
 return {available,setEnabled,setScene,object,stop,get enabled(){return enabled;}};
})();
