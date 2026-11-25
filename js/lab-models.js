/* Original prototype geometry. Reusable independently articulated models. */
import {T,material,part,pivot} from './graphics-platform.js';
const box=(x,y,z)=>new T.BoxGeometry(x,y,z),ball=(r)=>new T.SphereGeometry(r,20,14),cap=(r,h)=>new T.CapsuleGeometry(r,h,5,16),cyl=(a,b,h)=>new T.CylinderGeometry(a,b,h,24);
export function scout(){
 const root=new T.Group(),body=pivot(root,0,.25,0),blue=material(0x3987b1,.67,.27),silver=material(0xb7d3df,.8,.25),dark=material(0x26384d,.6,.42),red=material(0xc83f48,.26,.32),glow=material(0x92fbff,.15,.24,0x49dfff);
 for(const side of [-1,1]){part(body,box(.61,.22,.75),blue,side*.38,.05,.07);part(body,cyl(.19,.23,.48),dark,side*.38,.36,0);part(body,ball(.22),silver,side*.38,.59,0);}
 part(body,box(1.23,.83,.76),blue,0,1.04,0);part(body,box(.95,.53,.12),silver,0,1.08,.42);part(body,cyl(.21,.21,.10),glow,0,1.08,.52).rotation.x=Math.PI/2;part(body,cyl(.28,.28,.18),dark,0,1.57,0);
 const head=pivot(body,0,1.64,0);part(head,box(.85,.58,.68),blue,0,.30,0);part(head,box(.75,.18,.07),dark,0,.32,.365);for(const side of [-1,1]){part(head,box(.22,.085,.045),glow,side*.18,.32,.41);part(head,ball(.15),silver,side*.47,.27,0);}part(head,box(.72,.08,.62),silver,0,.62,0);
 const arms=[];for(const side of [-1,1]){const shoulder=pivot(body,side*.76,1.36,0);part(shoulder,ball(.25),silver);part(shoulder,cap(.16,.25),blue,side*.12,-.23,0);const elbow=pivot(shoulder,side*.18,-.40,.03);part(elbow,ball(.17),dark);part(elbow,cap(.17,.28),blue,0,-.13,.18).rotation.x=-Math.PI/2.8;part(elbow,ball(.32),red,0,-.06,.43).scale.set(1,1.03,1.15);part(elbow,cyl(.22,.22,.12),silver,0,-.06,.21).rotation.x=Math.PI/2;arms.push({shoulder,elbow,side});}
 return {root,body,head,arms};
}
export function player(){
 const root=new T.Group(),body=pivot(root,0,.15,0),purple=material(0x461d7c,0,.65),gold=material(0xfdd023,.7,.3),skin=material(0xb87a50,0,.75),white=material(0xe6eaf0,0,.8),black=material(0x253346,0,.65);
 for(const s of [-1,1]){part(body,cap(.17,.55),white,s*.22,.52,0);part(body,box(.36,.17,.59),black,s*.22,.10,.10);}
 part(body,box(.75,.70,.49),purple,0,1.17,0);part(body,box(.78,.13,.5),black,0,.80,0);part(body,box(.035,.54,.035),gold,0,1.18,.265);part(body,cyl(.11,.13,.18),skin,0,1.61,0);
 const head=pivot(body,0,1.72,0);part(head,ball(.30),skin,0,.21,0).scale.set(.9,1.12,.9);part(head,cyl(.29,.29,.14),purple,0,.44,0);part(head,box(.5,.065,.28),purple,0,.40,.28);for(const s of [-1,1])part(head,ball(.026),black,s*.09,.24,.26);part(body,new T.TorusGeometry(.17,.025,8,24),gold,0,1.52,.25).rotation.x=.5;
 const arms=[];for(const s of [-1,1]){const shoulder=pivot(body,s*.47,1.38,0);part(shoulder,cap(.14,.22),purple,0,-.12,0);const elbow=pivot(shoulder,0,-.29,0);part(elbow,cap(.105,.22),skin,0,-.12,0);part(elbow,cyl(.12,.12,.08),white,0,-.28,0);part(elbow,ball(.12),s===1?gold:skin,0,-.36,0);arms.push({shoulder,elbow,side:s});}return {root,body,head,arms};
}
export function pose(r,kind,t){if(!r)return;const p=Math.max(0,Math.min(1,t)),pulse=Math.sin(Math.PI*p);r.body.position.x=kind==='attack'?pulse*.3:0;r.body.rotation.z=kind==='ko'?-p*.85:0;r.head.position.y=r.head.userData.rest??r.head.position.y;r.head.userData.rest=r.head.position.y;if(kind==='ko')r.head.position.y+=Math.sin(Math.PI*p*.85)*.9;r.head.rotation.y=kind==='idle'?Math.sin(t*2)*.08:0;for(const a of r.arms){a.shoulder.rotation.x=kind==='attack'?-pulse*(a.side===-1?1.25:.32):kind==='idle'?Math.sin(t*2+a.side)*.05:0;a.elbow.rotation.x=kind==='attack'?-pulse*.8:0;}}