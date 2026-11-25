/* Original skinned uniform shells and fitted sports equipment. CC0 base mesh derivative. */
import {T,material,part} from './graphics-platform.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};
export function garmentRegion(x,y){const a=Math.abs(x);if(y>=.53&&y<.86&&a<.192)return 'jersey';if(y>=.735&&y<.86&&a<.278)return 'jersey';if(y>=.105&&y<.53&&a<.21)return 'pants';return null;}
function centerAt(samples,y,side){const k=samples.filter(p=>Math.abs(p[1]-y)<.022&&(side===0||Math.sign(p[0])===side));if(!k.length)return [side*.075,0];return [(Math.min(...k.map(p=>p[0]))+Math.max(...k.map(p=>p[0])))/2,(Math.min(...k.map(p=>p[2]))+Math.max(...k.map(p=>p[2])))/2];}
export function garmentGeometry(geo,d,kind){
 const pos=geo.attributes.position,norm=geo.attributes.normal,idx=geo.index,faces=[],used=new Set(),samples=[];
 for(let i=0;i<pos.count;i++)samples.push([pos.getX(i)/d.h,(pos.getY(i)-d.bottom)/d.h,pos.getZ(i)/d.h]);
 for(let i=0;i<(idx?idx.count:pos.count);i+=3){const a=idx?idx.getX(i):i,b=idx?idx.getX(i+1):i+1,c=idx?idx.getX(i+2):i+2;const q=[samples[a],samples[b],samples[c]],x=q.reduce((s,p)=>s+p[0],0)/3,y=q.reduce((s,p)=>s+p[1],0)/3;if(garmentRegion(x,y)!==kind)continue;faces.push(a,b,c);used.add(a);used.add(b);used.add(c);}
 const g=geo.clone();g.setIndex(faces);g.deleteAttribute('color');const out=g.attributes.position;
 const bins=Array.from({length:55},(_,i)=>{const y=i*.02;return {mid:centerAt(samples,y,0),left:centerAt(samples,y,-1),right:centerAt(samples,y,1)};});
 for(const i of used){let [x,y,z]=samples[i];const bin=bins[Math.min(54,Math.round(y/.02))];const [cx,cz]=kind==='pants'&&y<.48?(x<0?bin.left:bin.right):bin.mid;
 const sleeve=kind==='jersey'&&Math.abs(x)>.158;const dx=x-cx,dz=z-cz,r=Math.hypot(dx,dz)||1;
 // Give the fabric clearance, relaxed silhouette and mild folds, rather than a second painted skin.
 let ease=kind==='jersey'?.009+.009*Math.sin(Math.PI*smooth(.53,.85,y)): .006+.007*Math.sin(Math.PI*smooth(.11,.51,y));
 const folds=(Math.sin(y*105+Math.abs(x)*22)+.35*Math.sin(y*183+z*45))*.0018;
 if(sleeve){x+=norm?norm.getX(i)*.008:0;z+=(norm?norm.getZ(i):Math.sign(z))*.012;y+=(norm?norm.getY(i):0)*.008;}
 else if(kind==='jersey'){
 // Preserve the original curved ribcage, waist and back. Never flatten to a fixed Z plane.
 // Small positive ease follows the native normals, with more room at chest and less at waist.
 const chest=smooth(.61,.77,y),waist=1-smooth(.55,.64,y);
 const clearance=.0045+.0038*chest-.0012*waist;
 const drape=.0008*Math.sin(y*98+Math.abs(x)*19)*Math.sin(Math.PI*smooth(.53,.84,y));
 let nx=norm?norm.getX(i):dx/r,nz=norm?norm.getZ(i):dz/r;
 // Reject inward radial components and use a smooth radial fallback around the torso.
 const radial=Math.hypot(x,z-cz)||1,rx=x/radial,rz=(z-cz)/radial;
 if(nx*rx+nz*rz<.18){nx=rx;nz=rz;}
 const length=Math.hypot(nx,nz)||1;
 x+=nx/length*(clearance+drape);z+=nz/length*(clearance+drape);
 }else{x+=dx/r*(ease+folds);z+=dz/r*(ease+folds);}
 out.setXYZ(i,x*d.h,y*d.h+d.bottom,z*d.h);
 }
 out.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();return {geometry:g,triangles:faces.length/3,used:used.size};
}
export function createUniform(body,d,uniforms,shaderHook){
 const pieces={};for(const kind of ['jersey','pants']){const {geometry,triangles,used}=garmentGeometry(body.geometry,d,kind);const mat=new T.MeshStandardMaterial({color:kind==='jersey'?'#461d7c':'#e3e6ed',roughness:.96,metalness:0,side:T.DoubleSide});mat.onBeforeCompile=shaderHook;mat.customProgramCacheKey=()=> 'sb-garment-0202-'+kind;const mesh=new T.SkinnedMesh(geometry,mat);mesh.name='SB fitted '+kind;mesh.bindMode=body.bindMode;mesh.bind(body.skeleton,body.bindMatrix);mesh.position.copy(body.position);mesh.quaternion.copy(body.quaternion);mesh.scale.copy(body.scale);mesh.frustumCulled=false;mesh.castShadow=true;mesh.receiveShadow=true;body.parent.add(mesh);pieces[kind]={mesh,mat,triangles,used};}
 return {pieces,repaint(jersey,pants){pieces.jersey.mat.color.copy(jersey);pieces.pants.mat.color.copy(pants);}};
}
function mesh(g,geo,mat,x,y,z){return part(g,geo,mat,x,y,z);}
function oval(g,m,x,y,z,rx,ry,rz){const o=mesh(g,new T.SphereGeometry(1,18,12),m,x,y,z);o.scale.set(rx,ry,rz);return o;}
function tube(g,m,pts,r=.0025){return mesh(g,new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p))),Math.max(8,pts.length*3),r,6,false),m,0,0,0);}
export function footBounds(pos,d,sign){const v=[];for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);if(Math.sign(x)===sign&&y<d.ys(.066))v.push([x,y,z]);}if(v.length<5)throw Error('Foot geometry unavailable');const min=[0,1,2].map(i=>Math.min(...v.map(p=>p[i]))),max=[0,1,2].map(i=>Math.max(...v.map(p=>p[i])));return {min,max,count:v.length};}
export function buildCleat(g,b,color){
 const [x0,y0,z0]=b.min,[x1,y1,z1]=b.max,cx=(x0+x1)/2,hw=(x1-x0)*.56+.004,len=z1-z0+.018,back=z0-.009,base=y0-.006;
 const upper=material(color,.08,.63),sole=material('#202632',0,.83),lace=material('#e3e8ef',0,.75),accent=material('#c5a55a',.2,.6);
 // Cross-sections along the length give a recognizable toe box, instep and heel.
 function shell(mat,rings){const vs=[],ix=[],n=20;for(const [z,w,lo,hi] of rings)for(let i=0;i<n;i++){const a=i*2*Math.PI/n;vs.push(cx+Math.cos(a)*hw*w,lo+(hi-lo)*(Math.sin(a)+1)/2,z);}
 for(let k=0;k<rings.length-1;k++)for(let i=0;i<n;i++){const a=k*n+i,b=k*n+(i+1)%n,c=(k+1)*n+i,d=(k+1)*n+(i+1)%n;ix.push(a,b,c,b,d,c);}for(let i=1;i<n-1;i++){ix.push(0,i+1,i);const k=(rings.length-1)*n;ix.push(k,k+i,k+i+1);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vs,3));geo.setIndex(ix);geo.computeVertexNormals();return mesh(g,geo,mat,0,0,0);}
 const top=Math.max(y1+.007,base+.073);shell(sole,[[back,.65,base-.007,base+.012],[back+len*.15,.98,base-.007,base+.012],[back+len*.70,1.04,base-.007,base+.012],[back+len,.70,base-.007,base+.012]]);
 shell(upper,[[back,.65,base+.008,top-.015],[back+len*.16,.96,base+.008,top+.004],[back+len*.42,.94,base+.008,top],[back+len*.76,1.03,base+.008,base+.05],[back+len,.65,base+.008,base+.035]]);
 for(let i=0;i<5;i++){const z=back+len*(.33+i*.075),y=top-.006-i*.006;tube(g,lace,[[cx-hw*.54,y-.006,z],[cx,y+.004,z+.004],[cx+hw*.54,y-.006,z]],.0025);}
 for(const s of [-1,1]){tube(g,accent,[[cx+s*hw*.87,base+.026,back+len*.17],[cx+s*hw*.94,base+.031,back+len*.45],[cx+s*hw*.92,base+.022,back+len*.72]],.003);for(const z of [.17,.48,.77])mesh(g,new T.CylinderGeometry(.008,.005,.010,7),sole,cx+s*hw*.55,base-.011,back+len*z);}
}
// Bounds of the covered hand in the original T-pose; wrist coordinate is supplied by the rig.
export function handBounds(pos,left,sign){
 const q=[];for(let i=0;i<pos.count;i++){const x=pos.getX(i);if(sign*(x-left.x)>=-.009)q.push([x,pos.getY(i),pos.getZ(i)]);}
 if(q.length<20)throw Error('Hand geometry unavailable');
 return {min:[0,1,2].map(i=>Math.min(...q.map(p=>p[i]))),max:[0,1,2].map(i=>Math.max(...q.map(p=>p[i]))),count:q.length};
}
export function coveredHandIndices(index,pos,left,sign){
 const out=[];for(let i=0;i<index.count;i+=3){const ids=[index.getX(i),index.getX(i+1),index.getX(i+2)];
 // Keep wrist and forearm intact; remove only fully covered distal triangles.
 if(ids.every(v=>sign*(pos.getX(v)-left.x)>.006))continue;out.push(...ids);}
 return out;
}
export function buildGlove(g,{left,sign,h,color,bounds}){
 const leather=material(color,0,.67),inside=material('#503323',0,.92),lace=material('#d4ba89',0,.82),edge=material('#39291f',0,.78);
 const distal=sign>0?bounds.max[0]:-bounds.min[0],prox=sign*left.x-.022;
 const center=(prox+distal+.035)/2,u=(distal+.035-prox)/2;
 const cy=(bounds.min[1]+bounds.max[1])/2,v=Math.max((bounds.max[1]-bounds.min[1])*.66+.014,h*.043);
 const backZ=bounds.min[2]-.014,frontZ=bounds.max[2]+.011,depth=Math.max(.029,h*.023);
 const point=(a,b,z)=>[sign*(center+a*u),cy+b*v,z];
 // Finger side is distal (+a); scalloped thumb and web are on the opposite upper side.
 const outline=[[-1,-.36],[-.82,-.72],[-.42,-.96],[.02,-1.03],[.45,-1.02],[.80,-.79],[1,-.43],[1.02,-.07],[.99,.30],[.86,.65],[.56,.89],[.18,1.02],[-.12,.82],[-.32,.61],[-.57,.96],[-.86,.78],[-1.02,.35]];
 const n=outline.length,verts=[],idx=[],rings=[0,.34,.68,1];
 // Continuous padded enclosure: concave front, convex leather back, joined perimeter wall.
 // The catching pocket is outside the hand, rather than a hole exposing the fingers.
 for(const r of rings)for(const [a,b] of outline)verts.push(...point(a*r,b*r,frontZ+depth*r*r));
 for(const r of rings)for(const [a,b] of outline)verts.push(...point(a*r,b*r,backZ+.009*r*r));
 function band(offset,reverse){for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){const a=offset+j*n+i,b=offset+j*n+(i+1)%n,c=offset+(j+1)*n+i,d=offset+(j+1)*n+(i+1)%n;idx.push(...(reverse?[a,b,c,b,d,c]:[a,c,b,b,c,d]));}}
 band(0,sign<0);const frontCount=idx.length;band(n*rings.length,sign>=0);
 for(let i=0;i<n;i++){const a=(rings.length-1)*n+i,b=(rings.length-1)*n+(i+1)%n,c=(2*rings.length-1)*n+i,d=(2*rings.length-1)*n+(i+1)%n;idx.push(...(sign<0?[a,c,b,b,c,d]:[a,b,c,b,d,c]));}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setIndex(idx);geo.computeVertexNormals();geo.addGroup(0,frontCount,0);geo.addGroup(frontCount,idx.length-frontCount,1);
 inside.side=T.DoubleSide;leather.side=T.DoubleSide;const cup=mesh(g,geo,[inside,leather],0,0,0);cup.name='Enclosed leather glove';
 const rim=outline.map(([a,b])=>point(a,b,frontZ+depth));rim.push(rim[0]);tube(g,leather,rim,.006);tube(g,edge,rim.map(p=>[p[0],p[1],p[2]-.008]),.003);
 // Raised finger stalls on the back and distinct stitched seams on the catching face.
 for(const q of [-.67,-.26,.15,.53]){
 tube(g,leather,[point(-.44,q*.32,backZ-.001),point(.23,q*.65,backZ-.004),point(.91,q,backZ+.006)],.008);
 tube(g,lace,[point(.52,q*.68,frontZ+depth*.48),point(.73,q*.84,frontZ+depth*.74),point(.91,q,frontZ+depth)],.0018);
 }
 tube(g,leather,[point(-.75,.62,frontZ+depth*.78),point(-.56,.95,frontZ+depth),point(-.28,.60,frontZ+depth*.58)],.010);
 for(let i=0;i<4;i++){const t=i/3;tube(g,leather,[point(-.38+t*.42,.56,frontZ+depth*.76),point(-.20+t*.40,.83,frontZ+depth)],.0055);}
 for(let i=0;i<3;i++)tube(g,lace,[point(-.39+i*.10,.56+i*.055,frontZ+depth),point(.03+i*.10,.66+i*.045,frontZ+depth)],.002);
 for(let i=0;i<n;i++){const [a,b]=outline[i],[c,d]=outline[(i+1)%n];tube(g,lace,[point(a*.96,b*.96,frontZ+depth+.004),point((a+c)*.49,(b+d)*.49,frontZ+depth+.007),point(c*.96,d*.96,frontZ+depth+.004)],.0022);}
 // Wrist entry/cuff: a short fitted leather band with a dark opening around the wrist.
 const wristY=left.y,wristZ=left.z,wr=Math.max(.024,Math.min(.042,(bounds.max[1]-bounds.min[1])*.33));
 const cuff=mesh(g,new T.CylinderGeometry(wr*1.11,wr,.045,24,1,true),leather,left.x,wristY,wristZ);cuff.rotation.z=-sign*Math.PI/2;
 const lip=mesh(g,new T.TorusGeometry(wr,.004,8,24),edge,left.x-sign*.022,wristY,wristZ);lip.rotation.y=Math.PI/2;
}
