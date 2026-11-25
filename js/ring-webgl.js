/* Local WebGL presentation; no scoring or storage operations. */
import {T,part} from './graphics-platform.js';
import {loadCandidate} from './rigged-character.js';
import {buildBoss,poseBoss} from './ring-boss-models.js';
import {buildArena} from './ring-arena-models.js';
const pulse=(t,a,b)=>t<=a||t>=b?0:Math.sin(Math.PI*(t-a)/(b-a));
export function exchangePose(data,entry,t){
 const side=entry?.hit.side??data.turn,attack=entry?pulse(t,0,.43):0,counter=entry?.counter?pulse(t,.49,.88):0;
 return data.fighters.map((q,i)=>{const strike=i===side?attack:counter,impact=i===side?(entry?.counter?.amount?pulse(t,.69,.91):0):(entry?.hit.amount?pulse(t,.21,.45):0);const ko=q.hp===0?(entry?Math.max(0,Math.min(1,(t-.74)/.26)):1):0;return {strike,impact,ko,guard:q.guard!==null,wear:(q.partWear||q.wear).reduce((a,b)=>a+b,0),core:q.broken.length>=2,overdrive:data.solo&&i===1&&data.bossIndex===4&&q.hp<=q.max/2,stance:data.solo&&i===1&&data.bossIndex===3?q.stance||0:0,shield:q.shield>0||!!(entry&&i===side&&entry.counter?.shielded&&t>.49&&t<.92)||!!(entry&&i!==side&&entry.hit.shielded&&t<.46)};});
}
function disposeObject(root){const seen=new Set();root.traverse(o=>{for(const a of [o.geometry,...(Array.isArray(o.material)?o.material:[o.material]),o.skeleton])if(a&&!seen.has(a)){seen.add(a);a.dispose?.();}});}
export function createRingScene(canvas,{onFailure}={}){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'default'});renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.35));renderer.shadowMap.enabled=false;
 const scene=new T.Scene();scene.background=new T.Color('#13283e');scene.fog=new T.Fog('#13283e',15,30);
 const camera=new T.PerspectiveCamera(39,1,.1,60),hemi=new T.HemisphereLight('#d7efff','#536278',2.4),key=new T.DirectionalLight('#ffe6c2',3.0),rim=new T.DirectionalLight('#83caff',2.1);key.position.set(-3,7,5);rim.position.set(4,4,-5);scene.add(hemi,key,rim);
 let arena=null,actors=[],matchKey='',closed=false,ready=false,serial=0,frame=0,last=0,current=null,entry=null,born=0,duration=1800;const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 function resize(){if(closed)return;const r=canvas.getBoundingClientRect();if(r.width<2||r.height<2)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();const distance=Math.max(8.8,8.1/Math.max(.65,camera.aspect));camera.position.set(0,3.6,distance);camera.lookAt(0,1.65,0);if(ready)draw(entry?Math.min(1,(performance.now()-born)/duration):1);}
 function stopFrame(){if(frame)cancelAnimationFrame(frame);frame=0;}
 function destroy(){if(closed)return;closed=true;serial++;stopFrame();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);disposeObject(scene);renderer.dispose();renderer.forceContextLoss?.();}
 function lost(e){e.preventDefault();if(!closed)onFailure?.();}
 function visibility(){if(document.hidden)stopFrame();else if(ready){resize();if(entry&&performance.now()-born<duration)wake();}}
 window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);canvas.addEventListener('webglcontextlost',lost);
 function clear(){for(const a of actors){scene.remove(a.holder);disposeObject(a.holder);}actors=[];if(arena){scene.remove(arena);disposeObject(arena);arena=null;}ready=false;}
 async function prepare(data,profiles){
  const ticket=++serial;stopFrame();clear();matchKey=data.key;current=data;entry=null;
  try{arena=buildArena(data.solo?data.bossIndex:4);scene.add(arena);rim.color.set(data.accent);
   for(let i=0;i<2;i++){const robot=data.solo&&i===1,rig=robot?buildBoss(data.bossIndex):await loadCandidate(profiles[i].avatarStyle==='female'?'female':'male');
    if(closed||ticket!==serial){disposeObject(rig.root);return false;}
    if(!robot){try{rig.repaint(profiles[i]);rig.scale(profiles[i].avatarHeight,profiles[i].avatarBuild);}catch(e){disposeObject(rig.root);throw e;}}
    const holder=new T.Group();holder.add(rig.root);
    const shield=part(holder,new T.SphereGeometry(1,16,12),new T.MeshBasicMaterial({color:'#83e7ff',transparent:true,opacity:.23,wireframe:true,depthWrite:false}),0,1.35,0);shield.scale.set(.99,1.44,.82);shield.visible=false;
    const shadow=part(holder,new T.CircleGeometry(.67,28),new T.MeshBasicMaterial({color:'#111d2b',transparent:true,opacity:.28,depthWrite:false}),0,.012,0);shadow.rotation.x=-Math.PI/2;
    const sparks=new T.Group();sparks.position.set(0,1.5,.55);holder.add(sparks);for(let j=0;j<8;j++){const sp=part(sparks,new T.BoxGeometry(.035,.035,.12),new T.MeshBasicMaterial({color:j%2?'#ffe29a':'#fff7d4'}));sp.rotation.z=j*Math.PI/4;}sparks.visible=false;
    actors.push({rig,robot,holder,shield,sparks});scene.add(holder);
   }
   if(closed||ticket!==serial)return false;ready=true;resize();return true;
  }catch(e){if(ticket===serial&&!closed){clear();throw e;}return false;}
 }
 function draw(t){if(closed||!ready||!current||document.hidden)return;const poses=exchangePose(current,entry,t);
  for(let i=0;i<actors.length;i++){const a=actors[i],p=poses[i],side=i===0?-1:1;const x=side*(1.30-p.strike*.30)+p.stance*.25;
   a.holder.position.set(x,.34-p.ko*.19,0);a.holder.rotation.y=side===-1?.87:-.87;a.holder.rotation.z=side*(p.impact*.14+p.ko*.85);a.shield.visible=p.shield&&!p.ko;
   if(a.robot)poseBoss(a.rig,p);else a.rig.battlePose(p.strike,p.impact);
   a.sparks.visible=p.impact>.02;for(let j=0;j<a.sparks.children.length;j++){const sp=a.sparks.children[j],angle=j*Math.PI/4,r=.12+p.impact*.48;sp.position.set(Math.cos(angle)*r,Math.sin(angle)*r,0);sp.scale.setScalar(.6+p.impact);}
  }renderer.render(scene,camera);
 }
 function wake(){if(!closed&&ready&&!document.hidden&&!frame)frame=requestAnimationFrame(tick);}
 function tick(now){frame=0;if(closed||!ready||document.hidden)return;try{const t=reduce.matches?1:Math.min(1,(now-born)/duration);if(now-last>=31||t===1){last=now;draw(t);}if(entry&&t<1)wake();}catch{onFailure?.();}}
 function show(data,e=null,ms=1800){if(closed||!ready||matchKey!==data.key)return false;current=data;entry=e;duration=ms;born=performance.now();last=0;stopFrame();if(e&&!reduce.matches)wake();else draw(1);return true;}
 return {prepare,show,resize,destroy,get ready(){return ready;}};
}
