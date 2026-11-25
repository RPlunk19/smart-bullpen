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
 else {x+=dx/r*(ease+folds);z+=dz/r*(ease+folds);if(kind==='jersey'&&Math.abs(x)<.12&&y>.58&&y<.81){const zref=Math.sign(dz)*(.077+.012*smooth(.6,.75,y))+cz;z=Math.sign(dz)>0?Math.max(z,zref):Math.min(z,zref);}}
 out.setXYZ(i,x*d.h,y*d.h+d.bottom,z*d.h);
 }
 out.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();return {geometry:g,triangles:faces.length/3,used:used.size};
}
export function createUniform(body,d,uniforms,shaderHook){
 const pieces={};for(const kind of ['jersey','pants']){const {geometry,triangles,used}=garmentGeometry(body.geometry,d,kind);const mat=new T.MeshStandardMaterial({color:kind==='jersey'?'#461d7c':'#e3e6ed',roughness:.96,metalness:0,side:T.DoubleSide});mat.onBeforeCompile=shaderHook;mat.customProgramCacheKey=()=> 'sb-garment-0201-'+kind;const mesh=new T.SkinnedMesh(geometry,mat);mesh.name='SB fitted '+kind;mesh.bindMode=body.bindMode;mesh.bind(body.skeleton,body.bindMatrix);mesh.position.copy(body.position);mesh.quaternion.copy(body.quaternion);mesh.scale.copy(body.scale);mesh.frustumCulled=false;mesh.castShadow=true;mesh.receiveShadow=true;body.parent.add(mesh);pieces[kind]={mesh,mat,triangles,used};}
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
export function buildGlove(g,{left,sign,h,color}){
 const leather=material(color,0,.63),inside=material('#503323',0,.92),lace=material('#d4ba89',0,.82),edge=material('#39291f',0,.78);
 // In the bind pose, X runs from wrist toward fingers; cup opens toward +Z.
 const origin=[left.x+sign*h*.051,left.y,left.z],u=h*.066,v=h*.057,depth=h*.026;
 const point=(a,b,c)=>[origin[0]+sign*a*u,origin[1]+b*v,origin[2]+c*depth];
 const perimeter=[[-1,-.38],[-.75,-.78],[-.30,-1.03],[.10,-.96],[.48,-1.05],[.85,-.83],[1.05,-.42],[1.04,.02],[.98,.45],[.70,.78],[.32,.95],[.08,.71],[-.16,.40],[-.46,.80],[-.77,.65],[-.95,.20]];
 const rings=[0,.34,.67,1],n=perimeter.length,verts=[],indices=[];for(const r of rings)for(const [a,b] of perimeter){verts.push(...point(a*r,b*r,-.64+1.36*r*r));}
 for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=(j+1)*n+i,d=(j+1)*n+(i+1)%n;indices.push(a,c,b,b,c,d);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();const cupMat=inside.clone();cupMat.side=T.DoubleSide;mesh(g,geo,cupMat,0,0,0);
 const back=geo.clone(),bp=back.attributes.position;for(let i=0;i<bp.count;i++)bp.setZ(i,bp.getZ(i)-.009);back.computeVertexNormals();const backMat=leather.clone();backMat.side=T.DoubleSide;mesh(g,back,backMat,0,0,0);
 const rim=perimeter.map(([a,b])=>point(a,b,.76));rim.push(rim[0]);tube(g,leather,rim,.007);tube(g,edge,rim.map(p=>[p[0],p[1],p[2]-.006]),.0035);
 // Four finger channels and thumb contour. Webbing bridges the thumb/index notch.
 for(const q of [-.65,-.25,.16,.55])tube(g,leather,[point(-.45,q*.28,-.22),point(.28,q*.62,-.18),point(.91,q,.58)],.008);
 for(const q of [-.65,-.25,.16,.55])tube(g,lace,[point(.52,q*.66,.20),point(.72,q*.84,.39),point(.91,q,.60)],.0018);
 tube(g,leather,[point(-.72,.60,.56),point(-.44,.81,.76),point(-.12,.37,.50)],.010);
 for(let i=0;i<4;i++){const t=i/3;tube(g,leather,[point(-.40+t*.42,.53,.58),point(-.23+t*.39,.79,.73)],.0055);}
 for(let i=0;i<3;i++)tube(g,lace,[point(-.42+i*.10,.53+i*.055,.72),point(.01+i*.10,.63+i*.045,.77)],.002);
 for(let i=0;i<perimeter.length;i++){const [a,b]=perimeter[i],[c,d]=perimeter[(i+1)%n];tube(g,lace,[point(a*.94,b*.94,.81),point((a+c)*.49,(b+d)*.49,.83),point(c*.94,d*.94,.81)],.0022);}
 oval(g,leather,left.x,left.y,left.z-.008,h*.020,h*.029,h*.027);
}
