/* Reusable graphics layer. No game logic, profile storage or network APIs. */
import * as T from '../vendor/three-r180/three.module.min.js';
export {T};
export function createStage(canvas,container){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'default'});
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 const scene=new T.Scene();scene.background=new T.Color(0x142438);scene.fog=new T.Fog(0x142438,12,27);
 const camera=new T.PerspectiveCamera(38,1,.1,60),hemi=new T.HemisphereLight(0xcbe9ff,0x41475b,2),key=new T.DirectionalLight(0xffe5bb,3),rim=new T.DirectionalLight(0x70b7ff,2);
 key.position.set(-3,6,4);rim.position.set(4,3,-3);scene.add(hemi,key,rim);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=4;key.shadow.camera.bottom=-4;
 const floor=new T.Mesh(new T.CircleGeometry(8,64),new T.MeshStandardMaterial({color:0x283b50,roughness:.8}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
 const stage=new T.Mesh(new T.CylinderGeometry(2.05,2.2,.15,64),new T.MeshStandardMaterial({color:0x47637c,metalness:.3,roughness:.45}));stage.position.y=.075;stage.receiveShadow=true;scene.add(stage);
 const trim=new T.Mesh(new T.TorusGeometry(2.02,.025,8,64),new T.MeshStandardMaterial({color:0x8bceef,emissive:0x227ab0,emissiveIntensity:.5}));trim.rotation.x=Math.PI/2;trim.position.y=.16;scene.add(trim);
 let quality='balanced',angle=25,model=null;
 function resize(){const w=Math.max(1,container.clientWidth),h=Math.max(1,container.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 function setQuality(q){quality=q;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,q==='low'?1:q==='high'?2:1.5));renderer.shadowMap.enabled=q!=='low';renderer.shadowMap.type=T.PCFSoftShadowMap;resize();}
 function setLight(v){const p=v==='gold'?[0xffd077,0xffa24c,0x292234,1.4]:v==='studio'?[0xffffff,0xb4d9ff,0x39495e,1.1]:[0xffe5bb,0x70b7ff,0x142438,1.15];key.color.setHex(p[0]);rim.color.setHex(p[1]);scene.background.setHex(p[2]);scene.fog.color.setHex(p[2]);renderer.toneMappingExposure=p[3];}
 function setAngle(a){angle=a;const r=a*Math.PI/180;camera.position.set(Math.sin(r)*6.7,3.05,Math.cos(r)*6.7);camera.lookAt(0,1.5,0);}
 function disposeObject(obj){obj.traverse(o=>{if(o.isMesh){o.geometry?.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m?.dispose();}});}
 function setModel(next){if(model){scene.remove(model);disposeObject(model);}model=next;if(model){model.position.y=.16;scene.add(model);}}
 function render(){renderer.render(scene,camera);}
 setAngle(angle);setQuality(quality);return {renderer,scene,camera,setModel,setAngle,setLight,setQuality,resize,render,dispose(){if(model)disposeObject(model);disposeObject(scene);renderer.dispose();}};
}
export function material(color,metalness=0,roughness=.55,emissive=0){return new T.MeshStandardMaterial({color,metalness,roughness,emissive,emissiveIntensity:emissive?.8:0});}
export function part(parent,geometry,mat,x=0,y=0,z=0){const m=new T.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
export function pivot(parent,x,y,z){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}