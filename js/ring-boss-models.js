/* Original free boss variants built from the exact Design Lab Scout foundation. */
import {T,material,part} from './graphics-platform.js';
import {scout} from './lab-models.js';
export const bossNames=['Scout Bot','Iron Defender','Circuit Crusher','Titan X','Omega Prime'];
const palette=['#3987b1','#778a9b','#8055c6','#d45b38','#d5a742'],gloves=['#c83f48','#435b79','#4e2b9b','#ac3e2b','#b17c24'];
export function buildBoss(index=0){
 const i=Math.max(0,Math.min(4,Math.trunc(index)||0)),rig=scout(),{root,body,head,arms}=rig;
 const col=material(palette[i],.72,.29),silver=material(i===4?'#ffe2a0':'#c0d3df',.76,.27),dark=material('#192736',.63,.42),light=material(i===4?'#ffd26d':i===3?'#ff9b59':i===2?'#c695ff':'#a9f5ff',.2,.28,i===4?'#ffb72b':i===3?'#ff5a32':i===2?'#9851ff':'#47dfff');
 const box=(parent,x,y,z,w,h,d,m=col)=>part(parent,new T.BoxGeometry(w,h,d),m,x,y,z),cyl=(parent,x,y,z,r,h,m=dark)=>part(parent,new T.CylinderGeometry(r,r,h,20),m,x,y,z);
 const accents=new Set(),damage=[];
 root.traverse(o=>{if(!o.isMesh)return;const hex=o.material.color.getHex();if(hex===0x92fbff)accents.add(o.material);});
 if(i>0){const changed=new Set();root.traverse(o=>{if(!o.isMesh||changed.has(o.material))return;changed.add(o.material);const hex=o.material.color.getHex();if(hex===0x3987b1)o.material.color.set(palette[i]);if(hex===0xc83f48)o.material.color.set(gloves[i]);if(hex===0x92fbff){o.material.color.copy(light.color);o.material.emissive.copy(light.emissive);}});
 if(i===1){body.scale.set(1.13,1.04,1.13);for(const s of [-1,1]){box(body,s*.40,.13,.05,.73,.36,1.0,dark);for(let j=0;j<5;j++)box(body,s*.40,.12,-.36+j*.19,.76,.40,.055,silver);box(body,s*.66,1.2,0,.34,.66,.77,silver);box(arms[s===-1?0:1].elbow,0,-.06,.43,.68,.62,.65,col);}box(body,0,1.08,.53,.91,.19,.07,silver);}
 if(i===2){body.scale.set(1.13,.73,1.03);root.scale.set(1.05,.89,1.05);for(const s of [-1,1]){box(body,s*.44,1.11,.49,.29,.67,.12,col);box(body,s*.76,1.45,.04,.32,.31,.67,dark);box(body,s*.76,1.45,.40,.23,.12,.045,light);box(body,s*.39,.24,.38,.55,.20,.12,silver);}cyl(body,0,.70,.47,.25,.1,light).rotation.x=Math.PI/2;accents.add(light);}
 if(i===3){body.scale.set(.78,1.20,.85);root.scale.set(.90,1.07,.92);for(const s of [-1,1]){box(body,s*.28,.48,.03,.31,.76,.41,col);box(body,s*.70,1.38,.06,.30,.45,.54,silver);}box(body,0,.28,.37,.32,.64,.15,dark);box(head,0,.60,.03,.28,.23,.42,silver);box(head,0,.76,.02,.06,.22,.06,light);accents.add(light);}
 if(i===4){body.scale.set(.87,1.13,1.03);root.scale.set(1.02,1.08,1.02);arms[0].shoulder.visible=false;const power=arms[1].elbow;box(power,0,-.06,.45,.78,.65,.77,col);for(const y of [-.21,.08])box(power,0,y,.86,.65,.10,.08,light);box(body,0,.35,.34,.49,.57,.20,silver);box(body,0,1.05,.53,.52,.61,.12,dark);cyl(body,0,1.05,.61,.22,.14,light).rotation.x=Math.PI/2;box(head,0,.66,.03,.74,.14,.59,silver);accents.add(light);}
 }
 for(let j=0;j<6;j++){const m=box(body,((j%3)-1)*.25,1.27-Math.floor(j/3)*.33,.565,.17,.025,.012,dark);m.rotation.z=j%2?.48:-.62;m.visible=false;damage.push(m);}
 return {...rig,index:i,damage,accents:[...accents],light};
}
export function poseBoss(r,{strike=0,impact=0,ko=0,guard=false,wear=0,core=false,overdrive=false}={}){
 r.body.rotation.z=-ko*.18-impact*.08;r.body.position.x=0;r.head.rotation.y=impact*.15;
 for(const a of r.arms){a.shoulder.rotation.x=-strike*(a.side===1?1.22:.4)-(guard?.32:0);a.elbow.rotation.x=-strike*.62-(guard?.25:0);a.shoulder.rotation.z=a.side*(guard?.10:0);}
 r.damage.forEach((m,i)=>m.visible=i<Math.min(6,wear));for(const m of r.accents){m.emissiveIntensity=overdrive?1.9:core?1.5:.8;if(overdrive)m.emissive.set('#ff632c');else m.emissive.copy(r.light.emissive);}
}
