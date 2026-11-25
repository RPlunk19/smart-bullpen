"use strict";
/* Lazy WebGL match bridge; the original Canvas2D fallback stays available. */
const RingView=(()=>{
 let canvas,legacy,status,scene=null,modulePromise=null,serial=0,key=null,latest=null,mode='enhanced',failed=false;
 function init(c,l,s){canvas=c;legacy=l;status=s;return true;}
 function setStatus(t){if(status)status.textContent=t;}
 function drop(){serial++;if(scene){scene.destroy();scene=null;}if(canvas){const next=document.createElement('canvas');next.id=canvas.id;next.setAttribute('aria-label','Enhanced 3D arena');next.hidden=true;canvas.replaceWith(next);canvas=next;}key=null;}
 function stop(){drop();latest=null;if(canvas)canvas.hidden=true;if(legacy)legacy.hidden=true;RingVisuals.stop();}
 function classic(d,e){canvas.hidden=true;legacy.hidden=false;RingVisuals.setEnabled(true);RingVisuals.show(d,e,1800);setStatus(RingVisuals.enabled?'Classic 3D artwork':'Arena unavailable • scoring board active');}
 function fallback(){failed=true;drop();if(latest&&mode!=='off'){classic(latest.data,latest.entry);setStatus('Classic artwork • enhanced 3D unavailable');}}
 function setMode(v){mode=v;if(v==='off'){stop();setStatus('Arena graphics off • scoring board active');}else if(v==='classic'){drop();}else{failed=false;}return mode;}
 function show(data,entry,profiles){
  latest={data,entry,profiles,at:performance.now()};if(mode==='off')return;
  if(mode==='classic'||failed){classic(data,entry);return;}
  if(scene&&key===data.key&&scene.ready){try{RingVisuals.stop();legacy.hidden=true;canvas.hidden=false;scene.show(data,entry,1800);setStatus('Enhanced 3D • live Clubhouse avatars');}catch{fallback();}return;}
  if(key===data.key){classic(data,entry);setStatus('Loading enhanced arena…');return;}
  drop();key=data.key;const ticket=++serial;
  classic(data,entry);setStatus('Loading enhanced arena…');
  modulePromise=modulePromise||import('./ring-webgl.js').catch(e=>{modulePromise=null;throw e;});
  modulePromise.then(mod=>{if(ticket!==serial||mode!=='enhanced')return;try{scene=mod.createRingScene(canvas,{onFailure:()=>{if(ticket===serial)fallback();}});
   return scene.prepare(data,profiles).then(ok=>{if(ticket!==serial||!ok||!latest)return;canvas.hidden=false;legacy.hidden=true;RingVisuals.stop();scene.show(latest.data,performance.now()-latest.at<350?latest.entry:null,1800);scene.resize();setStatus('Enhanced 3D • live Clubhouse avatars');});}catch(e){if(ticket===serial)fallback();}}).catch(()=>{if(ticket===serial)fallback();});
 }
 window.addEventListener('pagehide',stop);
 return {init,show,stop,setMode,get mode(){return mode;}};
})();
