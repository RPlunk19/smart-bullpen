/* Dependency-free 3D meshes and perspective projection. */
const Geometry3D = (function createGeometry(){
 const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
 const vertices=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
 const faces=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[0,1,5,4],[3,7,6,2]];
 function rotate(v,yaw=0,pitch=0,roll=0){let [x,y,z]=v;const c=Math.cos(yaw),s=Math.sin(yaw);[x,z]=[x*c+z*s,-x*s+z*c];const a=Math.cos(pitch),b=Math.sin(pitch);[y,z]=[y*a-z*b,y*b+z*a];const r=Math.cos(roll),q=Math.sin(roll);return [x*r-y*q,x*q+y*r,z];}
 function transform(v,pos,angles=[0,0,0]){return rotate(v,...angles).map((n,i)=>n+pos[i]);}
 function box(pos,size,color,angles=[0,0,0]){return {vertices:vertices.map(v=>transform(v.map((n,i)=>n*size[i]/2),pos,angles)),faces,color};}
 function prism(pos,r,h,n,color,angles=[0,0,0]){const v=[];for(const y of [-h/2,h/2])for(let i=0;i<n;i++){const a=i*2*Math.PI/n;v.push(transform([r*Math.cos(a),y,r*Math.sin(a)],pos,angles));}const fs=[Array.from({length:n},(_,i)=>n-1-i),Array.from({length:n},(_,i)=>n+i)];for(let i=0;i<n;i++){const j=(i+1)%n;fs.push([i,j,n+j,n+i]);}return {vertices:v,faces:fs,color};}
 function gem(pos,r,h,color,angles=[0,0,0]){const v=[[0,h/2,0],[r,0,0],[0,0,r],[-r,0,0],[0,0,-r],[0,-h/2,0]].map(p=>transform(p,pos,angles));return {vertices:v,faces:[[0,1,2],[0,2,3],[0,3,4],[0,4,1],[5,2,1],[5,3,2],[5,4,3],[5,1,4]],color};}
 function project(v,camera){const z=v[2]+camera.distance;if(z<=.1)return null;return [camera.x+v[0]*camera.focal/z,camera.y-(v[1]-camera.height)*camera.focal/z,z];}
 function shade(hex,k){const n=parseInt(hex.slice(1),16);return "rgb("+[n>>16&255,n>>8&255,n&255].map(v=>Math.round(clamp(v*k,0,255))).join(",")+")";}
 function normal(a,b,c){const u=b.map((v,i)=>v-a[i]),v=c.map((v,i)=>v-a[i]);const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const l=Math.hypot(...n)||1;return n.map(x=>x/l);}
 function facesFor(meshes,camera){const items=[];for(const m of meshes){for(const face of m.faces){const vs=face.map(i=>m.vertices[i]),ps=vs.map(v=>project(v,camera));if(ps.some(p=>!p))continue;const n=normal(...vs.slice(0,3));const light=.55+.45*Math.abs(n[0]*.36+n[1]*.8-n[2]*.48);items.push({points:ps,depth:ps.reduce((s,p)=>s+p[2],0)/ps.length,fill:shade(m.color,light)});}}return items.sort((a,b)=>b.depth-a.depth);}
 return {rotate,transform,box,prism,gem,project,facesFor};
})();
