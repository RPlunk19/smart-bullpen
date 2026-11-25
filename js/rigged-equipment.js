/* Original Smart Bullpen fittings. Body paint follows the original skinned mesh. */
import {T,material,part} from './graphics-platform.js';
export const hairStyles=['short-hair','curls-hair','long-hair','blond-hair','ponytail','bun'];
export const hairColors=[['Black','#252128'],['Dark brown','#382a28'],['Brown','#754b32'],['Light brown','#a47a4d'],['Blond','#d7b16a'],['Red','#a54b30'],['Gray','#a9a9b1'],['White','#e8e2d8']];
export function safeColor(value,fallback='#382a28'){return typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value)?value:fallback;}
export function fitDimensions(pos){let top=-Infinity,bottom=Infinity;for(let i=0;i<pos.count;i++){top=Math.max(top,pos.getY(i));bottom=Math.min(bottom,pos.getY(i));}const h=top-bottom,ys=n=>bottom+h*n;let x=0,z0=Infinity,z1=-Infinity;for(let i=0;i<pos.count;i++)if(pos.getY(i)>ys(.88)){x=Math.max(x,Math.abs(pos.getX(i)));z0=Math.min(z0,pos.getZ(i));z1=Math.max(z1,pos.getZ(i));}return {h,top,bottom,ys,headX:x,headZ:(z0+z1)/2,headDepth:(z1-z0)/2};}
export function surfaceSampler(geo){const p=geo.attributes.position,idx=geo.index,tri=[];for(let i=0;i<(idx?idx.count:p.count);i+=3){const a=idx?idx.getX(i):i,b=idx?idx.getX(i+1):i+1,c=idx?idx.getX(i+2):i+2;const ax=p.getX(a),ay=p.getY(a),bx=p.getX(b),by=p.getY(b),cx=p.getX(c),cy=p.getY(c),den=(by-cy)*(ax-cx)+(cx-bx)*(ay-cy);if(Math.abs(den)<1e-10)continue;tri.push([ax,ay,p.getZ(a),bx,by,p.getZ(b),cx,cy,p.getZ(c),den,Math.min(ax,bx,cx),Math.max(ax,bx,cx),Math.min(ay,by,cy),Math.max(ay,by,cy)]);}
return (x,y,fallback=.08)=>{let z=-Infinity;for(const a of tri){if(x<a[10]||x>a[11]||y<a[12]||y>a[13])continue;const u=((a[4]-a[7])*(x-a[6])+(a[6]-a[3])*(y-a[7]))/a[9],v=((a[7]-a[1])*(x-a[6])+(a[0]-a[6])*(y-a[7]))/a[9],w=1-u-v;if(u>=-.00001&&v>=-.00001&&w>=-.00001)z=Math.max(z,u*a[2]+v*a[5]+w*a[8]);}return Number.isFinite(z)?z:fallback;};}
export function colorRegion(x,y,side,hand,sleeve,eyeY,style){const a=Math.abs(x);if(y>.87)return 'skin';if(y<.065)return 'cleats';if(y<.125)return 'socks';if(y<.515)return 'pants';if(a>hand+.012)return side?'glove':'skin';if(Math.abs(a-hand)<.014)return 'tape';if(a>.16&&y>.70&&y<.87&&a>hand*.44)return sleeve&&side?'sleeve':'skin';if(y<.53&&a<.16)return 'trim';return 'jersey';}
function disposeGroup(g){g.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});g.removeFromParent();}
export function createFittings({root,model,bones,body,meshes,restore}){
 const p=body.geometry.attributes.position,d=fitDimensions(p),front=surfaceSampler(body.geometry),eyeMesh=meshes.find(m=>m.material.name==='Eyes'),eyeBox=eyeMesh.geometry.boundingBox||(()=>{eyeMesh.geometry.computeBoundingBox();return eyeMesh.geometry.boundingBox;})(),eyeY=(eyeBox.min.y+eyeBox.max.y)/2;
 const colors=new Float32Array(p.count*3);body.geometry.setAttribute('color',new T.BufferAttribute(colors,3));body.material.vertexColors=true;body.material.color.set(0xffffff);
 const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const ctx=canvas.getContext('2d'),stamp=new T.CanvasTexture(canvas);stamp.generateMipmaps=false;stamp.minFilter=T.LinearFilter;stamp.magFilter=T.LinearFilter;
 const uniforms={sbStamp:{value:stamp},sbBottom:{value:d.bottom},sbHeight:{value:d.h},sbInk:{value:new T.Color('#233c60')},sbEye:{value:0},sbEyeY:{value:(eyeY-d.bottom)/d.h},sbStripe:{value:0},sbCamo:{value:0},sbSeam:{value:1}};
 // The projected print is evaluated on the original bind-space surface before skinning.
 body.material.onBeforeCompile=shader=>{Object.assign(shader.uniforms,uniforms);shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 sbRest;').replace('#include <begin_vertex>','#include <begin_vertex>\nsbRest=position;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 sbRest; uniform sampler2D sbStamp; uniform float sbBottom,sbHeight,sbEye,sbEyeY,sbStripe,sbCamo,sbSeam; uniform vec3 sbInk;').replace('#include <color_fragment>',`#include <color_fragment>
 float sy=(sbRest.y-sbBottom)/sbHeight; float sx=sbRest.x/sbHeight;
 bool front=sbRest.z>0.0; float cx=front?0.057:0.0;
 if(sy>0.665&&sy<0.805&&abs(sx-cx)<0.065&&abs(sbRest.z)>sbHeight*0.014){
 vec2 uvMark=vec2((sx-cx)/0.13+0.5,(sy-0.665)/0.14);
 if(!front)uvMark.x=1.0-uvMark.x;
 float mask=texture2D(sbStamp,uvMark).a;
 diffuseColor.rgb=mix(diffuseColor.rgb,sbInk,mask);
 }
 if(front&&sy>0.53&&sy<0.83&&abs(sx)<0.0018&&sbSeam>0.5)diffuseColor.rgb=mix(diffuseColor.rgb,sbInk,0.8);
 if(sbStripe>0.5&&sy>0.125&&sy<0.515&&abs(sbRest.z)>0.015&&fract((sx+0.5)*100.0)<0.12)diffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.035,0.07,0.12),0.75);
 if(sbCamo>0.5&&sy>0.54&&sy<0.82){float c=sin(sx*82.0+sin(sy*55.0)*2.0)*sin(sy*78.0);diffuseColor.rgb*=c>0.18?0.63:c< -0.55?1.24:1.0;}
 if(front&&sbEye>0.5&&abs(abs(sx)-0.018)<0.013&&abs(sy-(sbEyeY-0.021))<0.0045)diffuseColor.rgb=vec3(0.018);
 if(front&&sbEye>1.5&&abs(abs(sx)-0.018)<0.012&&abs(sy-(sbEyeY-0.032))<0.0025)diffuseColor.rgb=vec3(0.018);
 if(front&&sbEye>2.5&&abs(abs(sx)-0.018)<0.0026&&abs(sy-(sbEyeY-0.025))<0.014)diffuseColor.rgb=vec3(0.018);
 `);};body.material.customProgramCacheKey=()=> 'smart-bullpen-surface-print-020';body.material.addEventListener('dispose',()=>stamp.dispose());body.material.needsUpdate=true;
 const groups=[];const localPos=b=>model.worldToLocal(b.getWorldPosition(new T.Vector3()));const originalScale=root.scale.clone();const sphere=(g,m,x,y,z,rx,ry,rz)=>{const o=part(g,new T.SphereGeometry(1,24,16),m,x,y,z);o.scale.set(rx,ry,rz);return o;};
 function anchor(bone,make){const g=new T.Group();model.add(g);make(g);model.updateMatrixWorld(true);bones.get(bone).attach(g);groups.push(g);return g;}
 function repaint(config){const gear=config.gear||{},item=s=>gear[s]||{},color=(s,fb)=>safeColor(item(s).color,fb),has=s=>item(s).color&&item(s).color!=='none',id=s=>item(s).id||'',hair=safeColor(config.hairColor,color('hair','#382a28')),hairStyle=hairStyles.includes(config.hairStyle)?config.hairStyle:'short-hair';const lastScale=root.scale.clone();root.scale.setScalar(1);restore();root.updateMatrixWorld(true);for(const g of groups.splice(0))disposeGroup(g);
 const left=localPos(bones.get('hand_l')),right=localPos(bones.get('hand_r')),handX=(Math.abs(left.x)+Math.abs(right.x))/2/d.h,sign=Math.sign(left.x)||1;
 const palette={skin:new T.Color(safeColor(config.skin,'#d5a174')),jersey:new T.Color(color('jersey','#461d7c')),pants:new T.Color(color('pants','#e3e6ed')),cleats:new T.Color(color('cleats','#263041')),socks:new T.Color(color('socks','#233c60')),glove:new T.Color(color('glove','#ad723e')),tape:new T.Color(color('tape','#f5f3e9')),sleeve:new T.Color(color('sleeve','#233c60')),trim:new T.Color('#c4a95b')};
 const ink=palette.jersey.getHSL({}).l>.47?'#263448':'#fff0ba';uniforms.sbInk.value.set(ink);uniforms.sbEye.value=has('eye')?(id('eye')==='war-eye'?3:id('eye')==='cross-eye'?2:1):0;uniforms.sbStripe.value=id('pants')==='stripe-pants'?1:0;uniforms.sbCamo.value=id('jersey')==='jungle-jersey'?1:0;
 for(let i=0;i<p.count;i++){const x=p.getX(i)/d.h,y=(p.getY(i)-d.bottom)/d.h,reg=colorRegion(x,y,Math.sign(x)===sign,handX,has('sleeve'),eyeY,hairStyle);const c=palette[reg];colors.set([c.r,c.g,c.b],i*3);}body.geometry.attributes.color.needsUpdate=true;
 const brows=meshes.find(m=>m.material.name==='Brows');if(brows)brows.material.color.set(hair);
 ctx.clearRect(0,0,256,256);ctx.fillStyle='white';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 178px sans-serif';ctx.fillText(String(Math.max(0,Math.min(99,Math.round(Number(config.number)||0)))),128,132,245);stamp.needsUpdate=true;
 // Head-mounted fittings are authored in measured bind coordinates then reparented to the head bone.
 anchor('Head',g=>{const hm=material(hair,0,.77),hat=material(color('hat','#233c60'),0,.8),trim=material('#d5b85c',.1,.65),rx=d.headX,rz=d.headDepth,zc=d.headZ,top=d.top;
 const scalp=sphere(g,hm,0,top-rx*.59,zc-rz*.11,rx*1.02,rx*.68,rz*1.02);
 if(hairStyle==='curls-hair')for(let j=0;j<10;j++){const t=j*Math.PI*2/10;sphere(g,hm,Math.cos(t)*rx*.79,top-rx*.47,zc+Math.sin(t)*rz*.76,rx*.27,rx*.25,rz*.28);}
 if(['long-hair','blond-hair','ponytail','bun'].includes(hairStyle)){sphere(g,hm,0,top-rx*1.28,zc-rz*.78,rx*.86,rx*.91,rz*.39);if(hairStyle==='ponytail'){const o=sphere(g,hm,0,top-rx*2.35,zc-rz*1.04,rx*.40,rx*.99,rz*.45);o.rotation.x=.20;}else if(hairStyle==='bun')sphere(g,hm,0,top-rx*.6,zc-rz*1.1,rx*.56,rx*.56,rz*.57);else for(const s of [-1,1])sphere(g,hm,s*rx*.84,top-rx*1.82,zc-rz*.43,rx*.20,rx*.79,rz*.39);}
 if(config.showHat!==false){const y=top-rx*.55,crown=part(g,new T.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI/2),hat,0,y,zc);crown.scale.set(rx*1.12,rx*.72,rz*1.13);sphere(g,hat,0,y-.004,zc+rz*.94,rx*1.03,.009,rz*.76);sphere(g,trim,0,y+rx*.37,zc+rz*1.00,rx*.19,rx*.21,.005);sphere(g,hat,0,y+rx*.72,zc,rx*.09,.006,rz*.10);}
 if(has('glasses')){const lens=material(color('glasses','#79dcf6'),.48,.19),frame=material('#192637',.16,.43),x=(eyeBox.max.x-eyeBox.min.x)*.25;for(const s of [-1,1]){const z=front(s*x,eyeY,eyeBox.max.z)+.008;sphere(g,frame,s*x,eyeY,z,rx*.43,rx*.24,.012);sphere(g,lens,s*x,eyeY,z+.008,rx*.38,rx*.19,.006);const arm=new T.CatmullRomCurve3([new T.Vector3(s*rx*.82,eyeY,z),new T.Vector3(s*rx*1.02,eyeY,zc),new T.Vector3(s*rx*.92,eyeY-.013,zc-rz*.55)]);part(g,new T.TubeGeometry(arm,8,.0035,6,false),frame);}sphere(g,frame,0,eyeY+.005,front(0,eyeY,eyeBox.max.z)+.012,rx*.16,.005,.006);}
 });
 if(has('necklace'))anchor('spine_03',g=>{const metal=material(color('necklace','#f4bf4a'),.73,.26),points=[];for(let j=0;j<=24;j++){const t=Math.PI*j/24,x=d.h*.041*Math.cos(t),y=d.ys(.852-.075*Math.sin(t)),z=front(x,y,.075)+.004;points.push(new T.Vector3(x,y,z));}const curve=new T.CatmullRomCurve3(points);part(g,new T.TubeGeometry(curve,32,.0032,6,false),metal);for(let j=1;j<24;j+=2){const v=points[j],o=part(g,new T.TorusGeometry(.006,.0017,6,12),metal,v.x,v.y,v.z+.002);o.rotation.z=j*.35;o.rotation.y=j%4===1?.5:-.5;}if(!['silver-chain','gold-chain','robot-chain'].includes(id('necklace'))){const v=points[12];part(g,new T.OctahedronGeometry(.013),metal,v.x,v.y-.014,v.z+.005);}});
 // The glove is fitted to the rest-pose left hand, rather than translated beside it.
 if(has('glove'))anchor('hand_l',g=>{const m=material(color('glove','#ad723e'),0,.65),lace=material('#cfb58a',0,.7),x=left.x+sign*d.h*.031,y=left.y,z=left.z;const palm=sphere(g,m,x,y,z+.007,d.h*.043,d.h*.034,d.h*.028);for(let j=0;j<4;j++)sphere(g,m,x+sign*d.h*.025,y+(j-1.5)*d.h*.011,z+.009,d.h*.021,d.h*.009,d.h*.019);for(let j=0;j<3;j++){const o=part(g,new T.TorusGeometry(.008,.0016,6,12),lace,x+sign*.009,y+(j-1)*.014,z+d.h*.027);o.rotation.y=.3;}});
 root.scale.copy(lastScale);root.updateMatrixWorld(true);}
 return {repaint,dimensions:d};
}
