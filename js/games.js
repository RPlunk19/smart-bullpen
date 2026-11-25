/* App-wide game catalog; each game owns its own completion rules. */
const GameCatalog = (function makeGameCatalog(){
 const robot=[
 {id:"r1",name:"Scout Bot",goal:2,cap:10,color:"#59b4cc"},
 {id:"r2",name:"Iron Defender",goal:3,cap:10,color:"#8ba5c7"},
 {id:"r3",name:"Circuit Crusher",goal:4,cap:10,color:"#a18bed"},
 {id:"r4",name:"Titan X",goal:5,cap:10,color:"#ea835a"},
 {id:"r5",name:"Omega Prime",goal:6,cap:10,color:"#f2cb66"}];
 function clean(raw){const out={};for(const l of robot){const v=raw?.[l.id];if(!v||!Number.isInteger(v.best)||v.best<l.goal||v.best>10||![1,2,3].includes(v.stars))break;out[l.id]={best:v.best,stars:v.stars};}return out;}
 function unlocked(raw,id){const i=robot.findIndex(l=>l.id===id);return i>=0&&(i===0||!!clean(raw)[robot[i-1].id]);}
 function clear(raw,id,r){const out=clean(raw),l=robot.find(x=>x.id===id);if(!l||!unlocked(out,id)||!Number.isInteger(r.hits)||!Number.isInteger(r.n)||r.hits<l.goal||r.hits>r.n||r.n>l.cap||r.n<1)return out;const command=r.hits/r.n,stars=command>=.7?3:command>=.5?2:1,old=out[id]||{best:0,stars:0};out[id]={best:Math.max(old.best,r.hits),stars:Math.max(old.stars,stars)};return out;}
 return {robot,clean,unlocked,clear};
})();
