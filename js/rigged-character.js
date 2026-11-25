/* Visual-only imported skinned-character adapter. Source geometry is Quaternius CC0. */
import {T} from './graphics-platform.js';
import {GLTFLoader} from '../vendor/three-r180/loaders/GLTFLoader.js';
const loader=new GLTFLoader();
export async function loadCandidate(kind){
 if(!['male','female'].includes(kind))throw Error('Unknown candidate');
 const gltf=await loader.loadAsync(new URL('../assets/rigged-candidates/'+kind+'.gltf',import.meta.url).href);
 const model=gltf.scene,root=new T.Group();root.add(model);model.updateMatrixWorld(true);
 const bones=new Map(),meshes=[];model.traverse(o=>{if(o.isBone)bones.set(o.name,o);if(o.isSkinnedMesh){meshes.push(o);o.frustumCulled=false;o.castShadow=true;o.receiveShadow=true;}});
 const required=['Head','spine_03','upperarm_l','upperarm_r','lowerarm_l','lowerarm_r','hand_l','hand_r'];if(required.some(n=>!bones.has(n))||!meshes.length)throw Error('Unsupported character rig');
 const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3());if(!Number.isFinite(size.y)||size.y<.5||size.y>4)throw Error('Unexpected model scale');
 model.position.y=-bounds.min.y;
 const rest=new Map([...bones].map(([n,b])=>[n,b.quaternion.clone()]));
 const base=2.75/size.y;
 const body=meshes.find(m=>m.material.name==='Training suit');if(!body)throw Error('Body material missing');
 const pos=body.geometry.attributes.position;const colors=new Float32Array(pos.count*3);body.geometry.setAttribute('color',new T.BufferAttribute(colors,3));body.material.vertexColors=true;body.material.color.set(0xffffff);body.material.needsUpdate=true;
 function repaint(skin,jersey){const skinCol=new T.Color(skin),shirt=new T.Color(jersey),pants=new T.Color('#e3e6ed'),shoe=new T.Color('#263041'),trim=new T.Color('#fdd023');for(let i=0;i<pos.count;i++){const y=(pos.getY(i)-bounds.min.y)/size.y,x=Math.abs(pos.getX(i))/size.y;let c=y>.878?skinCol:y<.065?shoe:y<.51?pants:shirt;if(y>.505&&y<.525&&x<.16)c=trim;colors.set([c.r,c.g,c.b],i*3);}body.geometry.attributes.color.needsUpdate=true;}
 function scale(height,build){const h=.82+.0036*Math.max(0,Math.min(100,height)),w=.78+.0044*Math.max(0,Math.min(100,build));root.scale.set(base*w,base*h,base*Math.sqrt(w));}
 function restore(){for(const [n,b] of bones)b.quaternion.copy(rest.get(n));model.updateMatrixWorld(true);}
 // Rotate arm bone using actual rest geometry, converting desired direction to parent coordinates.
 function aim(name,childName,target){const b=bones.get(name),child=bones.get(childName);if(!b||!child)return;model.updateMatrixWorld(true);const from=child.position.clone().normalize().applyQuaternion(b.quaternion);const parentQ=b.parent.getWorldQuaternion(new T.Quaternion());const to=target.clone().applyQuaternion(parentQ.invert()).normalize();const delta=new T.Quaternion().setFromUnitVectors(from,to);b.quaternion.premultiply(delta);model.updateMatrixWorld(true);}
 function pose(kind,t){restore();if(kind==='rest')return;const w=kind==='idle'?0.025*Math.sin(t*2):Math.sin(Math.PI*Math.min(1,Math.max(0,t)));for(const side of ['l','r']){const shoulder=bones.get('upperarm_'+side),elbow=bones.get('lowerarm_'+side);const sx=Math.sign(elbow.getWorldPosition(new T.Vector3()).x-shoulder.getWorldPosition(new T.Vector3()).x)||1;const lifted=kind==='win'||kind==='wave'&&side==='r';aim('upperarm_'+side,'lowerarm_'+side,new T.Vector3(sx*(lifted?.26+.55*w:.28),lifted?-1+1.85*w:-1,.10));aim('lowerarm_'+side,'hand_'+side,new T.Vector3(sx*(lifted?.23+.14*Math.sin(t*15):.18),lifted?-1+2.05*w:-1,.14+(lifted?.18*w:0)));}const head=bones.get('Head');head.rotateY(kind==='idle'?.055*Math.sin(t*1.6):0);}
 repaint('#d5a174','#461d7c');scale(50,50);pose('idle',0);return {root,bones:bones.size,meshes:meshes.length,repaint,scale,pose};
}
