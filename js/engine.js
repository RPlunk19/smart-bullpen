/* Smart Bullpen: pure mission logic; no browser APIs. */
const Bullpen = (function makeEngine(){
 const zones=["High left","High middle","High right","Middle left","Center","Middle right","Low left","Low middle","Low right"];
 const levels=[{name:"Rookie",goal:300},{name:"Pro",goal:600},{name:"All-Star",goal:900},{name:"Legend",goal:1400}];
 const prizes=[["Gold coins","Golden shell"],["Ancient medal","Treasure key"],["Crystal diamond","Royal ring"],["Power star","Island relic"],["Royal crown","Legendary gem"]];
 const icons=[["🪙","🐚"],["🏅","🗝️"],["💎","💍"],["⭐","🏆"],["👑","💎"]];
 function choose(previous,rng=Math.random){const pool=zones.map((_,i)=>i).filter(i=>i!==previous);return pool[Math.floor(rng()*pool.length)];}
 function start(settings,rng=Math.random){if(!Number.isInteger(settings.cap)||settings.cap<1||settings.cap>30||!levels[settings.level])throw Error("Invalid setup");return {settings:{...settings},goal:levels[settings.level].goal,target:choose(-1,rng),shots:[],score:0,streak:0,best:0,ended:false,stopped:false};}
 function record(s,actual,rng=Math.random){if(s.ended||s.shots.length>=s.settings.cap||!Number.isInteger(actual)||actual< -1||actual>8)return null;
 const target=s.target,hit=actual===target,afterMiss=s.shots.length>0&&!s.shots[s.shots.length-1].hit;
 s.streak=hit?s.streak+1:0;s.best=Math.max(s.best,s.streak);
 const mult=Math.min(s.streak,5),pick=hit?Math.floor(rng()*2):0,points=hit?100*mult:0;
 const shot={number:s.shots.length+1,target,actual,hit,afterMiss,points,streak:s.streak,prize:hit?prizes[mult-1][pick]:null,icon:hit?icons[mult-1][pick]:null};
 s.shots.push(shot);s.score+=points;
 if(s.shots.length===s.settings.cap)s.ended=true;else s.target=choose(target,rng);
 return shot;}
 function undo(s){
 const removed=s.shots.pop();if(!removed)return null;
 s.target=removed.target;s.ended=false;s.stopped=false;
 s.score=s.shots.reduce((sum,p)=>sum+p.points,0);
 s.streak=s.shots.length?s.shots[s.shots.length-1].streak:0;
 s.best=s.shots.reduce((best,p)=>Math.max(best,p.streak),0);
 return removed;}
 function stop(s){if(!s.ended){s.ended=true;s.stopped=true;}}
 function report(s){const n=s.shots.length,hits=s.shots.filter(p=>p.hit).length,inZone=s.shots.filter(p=>p.actual>=0).length,following=s.shots.filter(p=>p.afterMiss);
 return {n,hits,inZone,command:n?hits/n:null,best:s.best,comebacks:following.filter(p=>p.hit).length,following:following.length,score:s.score,passed:s.score>=s.goal,zones:zones.map((_,i)=>{const a=s.shots.filter(p=>p.target===i);return {attempts:a.length,hits:a.filter(p=>p.hit).length};})};}
 return {zones,levels,start,record,undo,stop,report};
})();
