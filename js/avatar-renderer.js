/* A single lazy-loaded WebGL avatar per page; no persistent animation during play. */
import {createStage} from './graphics-platform.js';
import {loadCandidate} from './rigged-character.js';
function disposeRoot(root){const seen=new Set();root.traverse(o=>{if(o.isMesh){if(o.geometry&&!seen.has(o.geometry)){seen.add(o.geometry);o.geometry.dispose();}for(const m of Array.isArray(o.material)?o.material:[o.material])if(m&&!seen.has(m)){seen.add(m);m.dispose();}if(o.skeleton&&!seen.has(o.skeleton)){seen.add(o.skeleton);o.skeleton.dispose();}}});}
export function createAvatarRenderer(canvas,container,{onFailure}={}){
 let stage=null,rig=null,base=null,serial=0,frame=0,closed=false,signature='',pending=null,angleValue=25;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 function stop(){cancelAnimationFrame(frame);frame=0;}
 function fail(){if(!closed)onFailure?.();}
 function render(){if(!closed&&stage&&!document.hidden)stage.render();}
 function resize(){if(!closed&&stage&&!canvas.hidden){stage.resize();render();}}
 function angle(a){angleValue=a;if(stage){stage.setAngle(a);render();}}
 function lost(e){e.preventDefault();fail();}
 function visibility(){if(document.hidden)stop();else resize();}
 function dispose(){if(closed)return;closed=true;serial++;stop();window.removeEventListener('resize',resize);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);if(stage){if(rig)disposeRoot(rig.root);stage.dispose();stage.renderer.forceContextLoss?.();stage=null;}rig=null;}
 async function show(config,{motion='idle',angle:nextAngle=25,result=false}={}){
  if(closed)return false;const ticket=++serial;stop();angleValue=nextAngle;const key=config.avatarStyle==='female'?'female':'male';
  try{
   if(!stage){canvas.hidden=false;stage=createStage(canvas,container);stage.setQuality('low');stage.setLight('studio');canvas.addEventListener('webglcontextlost',lost);window.addEventListener('resize',resize);document.addEventListener('visibilitychange',visibility);}
   if(base!==key||!rig){
    if(!pending||pending.key!==key){const entry={key,promise:loadCandidate(key)};pending=entry;}
    const entry=pending,next=await entry.promise;
    if(closed||ticket!==serial){if(closed||pending!==entry)disposeRoot(next.root);return false;}
    pending=null;if(rig&&rig!==next){rig.root.traverse(o=>{if(o.isSkinnedMesh)o.skeleton?.dispose();});}rig=next;base=key;signature='';stage.setModel(rig.root);
   }
   if(ticket!==serial||closed)return false;
   const sig=JSON.stringify(config);if(sig!==signature){rig.repaint(config);rig.scale(config.avatarHeight,config.avatarBuild);signature=sig;}
   stage.setAngle(angleValue);rig.pose(motion,reduce.matches&&motion==='win'?.5:0);stage.resize();render();
   if(motion==='win'&&!reduce.matches&&!document.hidden){const start=performance.now();const tick=now=>{frame=0;if(closed||ticket!==serial||document.hidden)return;try{const t=Math.min(1,(now-start)/1600);rig.pose('win',t);render();if(t<1)frame=requestAnimationFrame(tick);else{rig.pose('idle',0);render();}}catch{fail();}};frame=requestAnimationFrame(tick);}
   return true;
  }catch(e){if(ticket===serial&&!closed)throw e;return false;}
 }
 return {show,resize,angle,dispose};
}
