"use strict";
/* Classic UI bridge. Load the local renderer only when a visible character is requested. */
const AvatarView=(()=>{
 let view=null,host=null,fallback=null,canvas=null,serial=0,loading=null,desiredAngle=25,disabled=false;
 function hide(){serial++;if(view){view.dispose();view=null;}if(canvas)canvas.remove();if(fallback)fallback.hidden=false;host=null;fallback=null;canvas=null;disabled=false;}
 function show(target,p,previewId=null,options={}){
  if(host!==target){hide();host=target;fallback=document.createElement("div");fallback.className="avatarFallback";canvas=document.createElement("canvas");canvas.className="avatarCanvas";canvas.hidden=true;canvas.setAttribute("aria-label","Customizable 3D baseball player");target.replaceChildren(fallback,canvas);}
  const token=++serial,status=options.status,config=Clubhouse.preview(p,previewId);desiredAngle=Number.isFinite(options.angle)?options.angle:25;Avatar.draw(p,fallback,previewId,true);
  const report=t=>{if(status)status.textContent=t;};
  const classic=()=>{if(view){view.dispose();view=null;}canvas.hidden=true;fallback.hidden=false;report("Classic illustrated avatar • 3D unavailable or off");};
  if(options.enabled===false){classic();return;}if(disabled){classic();return;}
  report(previewId?"Updating gear preview…":"Loading 3D player…");
  const targetCanvas=canvas;
  loading=loading||import("./avatar-renderer.js").catch(e=>{loading=null;throw e;});
  loading.then(mod=>{
   if(token!==serial||host!==target||canvas!==targetCanvas)return;
   if(!view)view=mod.createAvatarRenderer(canvas,target,{onFailure:()=>{if(host===target){disabled=true;classic();}}});
   view.show(config,{motion:options.motion||"idle",angle:desiredAngle,result:!!options.result}).then(ok=>{
    if(token!==serial||host!==target)return;if(ok){canvas.hidden=false;fallback.hidden=true;view.resize();report(previewId?"3D try-on • not saved":"3D player • saved appearance");}
   }).catch(()=>{if(token===serial){disabled=true;classic();}});
  }).catch(()=>{if(token===serial){disabled=true;classic();}});
 }
 function angle(a){desiredAngle=a;view?.angle(a);}
 window.addEventListener("pagehide",hide);
 return {show,hide,angle};
})();
