import {T,material,part} from './graphics-platform.js';
import {harbor} from './harbor-model.js';
export function buildArena(index=0){
 const i=Math.max(0,Math.min(4,Math.trunc(index)||0)),root=harbor();if(i===0)return root;
 const c=['#65c9e7','#ed995a','#b47aff','#6abaf1','#eec86a'][i],m=material(c,.22,.36,c),dark=material('#263648',.5,.55),deck=material(['#426c83','#46434a','#292c57','#4a6780','#4b4132'][i],.15,.72);
 for(const o of root.children){if(!o.isMesh)continue;if(o.position.z<-2.7&&Math.abs(o.position.x)>0.3)o.visible=false;if(Math.abs(o.position.x)<.01&&Math.abs(o.position.z)<.01){if(o.position.y===.29)o.material=deck;if(o.position.y<-.1)o.material=dark;}}
 const b=(x,y,z,w,h,d,mat=m)=>part(root,new T.BoxGeometry(w,h,d),mat,x,y,z);
 for(const x of [-3.6,-1.8,0,1.8,3.6]){b(x,1.35,-3.5,1.35,2.7,.28,dark);b(x,1.65,-3.32,.09,2.1,.045,m);}
 for(const x of [-3.5,3.5]){b(x,.20,-1.7,.72,.6,1.3,dark);b(x,.54,-1.7,.53,.045,1.1,m);}
 if(i===1)for(const x of [-3.1,0,3.1]){part(root,new T.CylinderGeometry(.24,.24,2.6,12),dark,x,1.3,-3.7);b(x,2.55,-3.46,.58,.16,.08,m);}
 if(i===2)for(let k=0;k<8;k++)b(-3.9+k*1.1,2.6,-3.28,.72,.10,.09,m);
 if(i===3)part(root,new T.TorusGeometry(3.9,.08,8,64,Math.PI),m,0,0,-3.3);
 if(i===4){for(const x of [-3.4,3.4]){b(x,1.9,-3.25,.42,3.8,.42,m);b(x,3.85,-3.25,.72,.22,.72,m);}b(0,3.15,-3.32,3.8,.22,.08,m);}
 return root;
}
