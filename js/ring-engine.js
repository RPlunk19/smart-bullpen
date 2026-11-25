/* Virtual boxing battle logic. */
const Ring=(function ring(){
 const zones=["Left guard","Head guard","Right guard","Left arm","Chest plate","Right arm","Left hip","Core guard","Right hip"],factors=[1,.65,.35,.2];
 const clone=x=>JSON.parse(JSON.stringify(x)),pick=(a,r)=>a[Math.floor(r()*a.length)],range=()=>Array.from({length:9},(_,i)=>i);
 const damage=(base,wear,weak)=>Math.max(1,Math.round(base*factors[Math.min(wear,3)]*(weak?1.5:1)));
 function fighter(name,max,weak,mask,parts){return {name,max,hp:max,weak,mask:mask.slice(),parts:parts.slice(),wear:Array(9).fill(0),n:0,hits:0,best:0,streak:0,comebacks:0,last:null,dealt:0};}
 function validMask(mask){return Array.isArray(mask)&&mask.length>=2&&mask.every(x=>Number.isInteger(x)&&x>=0&&x<9)&&new Set(mask).size===mask.length;}
 function call(s,i,r){if(!s.bags[i].length)s.bags[i]=s.pitches.slice();return {zone:pick(s.fighters[1-i].mask.filter(x=>x!==s.previous[i]),r),pitch:s.bags[i].splice(Math.floor(r()*s.bags[i].length),1)[0]};}
 function start({mode,boss,cap,names,pitches},r=Math.random){if(!["solo","duel"].includes(mode)||!Number.isInteger(cap)||cap<1||cap>10||!pitches.length||mode==="solo"&&!boss)throw Error("Invalid setup");
 const mask=mode==="solo"&&boss.mask!==undefined?boss.mask:range();if(!validMask(mask))throw Error("Invalid boss hitbox");const parts=mode==="solo"&&Array.isArray(boss.parts)&&boss.parts.length===9?boss.parts:zones;
 const s={mode,boss,cap,pitches:pitches.slice(),fighters:[fighter(names[0],100,pick(range(),r),range(),zones),fighter(names[1],mode==="solo"?boss.hp:100,pick(mask,r),mask,parts)],turn:0,previous:[-1,-1],bags:[[],[]],log:[],history:[],replay:null,result:null};s.call=call(s,0,r);return s;}
 function attack(s,i,actual,target,pitch,power){const a=s.fighters[i],b=s.fighters[1-i],occupied=b.mask.includes(actual),exact=occupied&&actual===target,weak=occupied&&actual===b.weak,empty=actual>=0&&!occupied;let amount=0;if(occupied){amount=Math.min(b.hp,damage(exact?power:Math.max(1,Math.round(power*.21)),b.wear[actual],weak));b.wear[actual]++;b.hp-=amount;}a.n++;a.hits+=Number(exact);a.streak=exact?a.streak+1:0;a.best=Math.max(a.best,a.streak);if(exact&&a.last===false)a.comebacks++;a.last=exact;a.dealt+=amount;return {side:i,actual,target,pitch,exact,weak,empty,amount};}
 function record(s,actual,rng=Math.random){if(s.result||!Number.isInteger(actual)||actual< -1||actual>8)return null;const old=clone({...s,history:[],replay:null});s.history.push(old);const tape=s.replay||Array.from({length:12},()=>rng());s.replay=null;let j=0;const r=()=>tape[j++%tape.length],i=s.turn,c=s.call;s.previous[i]=c.zone;const hit=attack(s,i,actual,c.zone,c.pitch,24);let counter=null;
 if(s.mode==="solo"){if(s.fighters[1].hp>0){const t=pick(s.fighters[0].mask.filter(x=>x!==s.previous[1]),r);s.previous[1]=t;const u=r(),actual=u<s.boss.accuracy?t:u<s.boss.accuracy+.15?pick(range().filter(x=>x!==t),r):-1;counter=attack(s,1,actual,t,"Simulated",s.boss.power);}if(!s.fighters[1].hp)s.result="win";else if(!s.fighters[0].hp)s.result="loss";else if(s.fighters[0].n>=s.cap)s.result="limit";else s.call=call(s,0,r);}
 else if(i===0){s.turn=1;s.call=call(s,1,r);}else{const [a,b]=s.fighters;if(!a.hp||!b.hp||a.n>=s.cap)s.result=a.hp===b.hp?"draw":a.hp>b.hp?"p1":"p2";else{s.turn=0;s.call=call(s,0,r);}}
 const entry={hit,counter,tape};s.log.push(entry);return entry;}
 function undo(s){const e=s.log.at(-1),old=s.history.pop();if(!e||!old)return false;const history=s.history;Object.assign(s,old,{history,replay:e.tape});return true;}
 function stop(s){if(!s.result)s.result="stopped";}
 function report(s,i=0){const p=s.fighters[i];return {n:p.n,hits:p.hits,best:p.best,comebacks:p.comebacks,command:p.n?p.hits/p.n:0,hp:p.hp,damage:p.dealt,emptyMisses:s.log.filter(x=>x.hit.side===i&&x.hit.empty).length,victory:s.mode==="solo"&&s.result==="win",duelWin:s.mode==="duel"&&s.result===(i===0?"p1":"p2")};}
 return {zones,factors,damage,start,record,undo,stop,report};
})();