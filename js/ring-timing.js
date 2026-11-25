/* Pure presentation clock, independent of the combat engine. */
const RingTiming=(()=>{
 const speeds={fast:2000,standard:3500,cinematic:5000};
 const marks={attack:.20,counterStart:.50,counter:.70,end:1};
 const clamp=t=>Math.max(0,Math.min(1,t));
 const pulse=(t,a,b)=>t<=a||t>=b?0:Math.sin(Math.PI*(t-a)/(b-a));
 function duration(speed,reduced=false,off=false){return reduced||off?80:(speeds[speed]||speeds.cinematic);}
 function sample(entry,t){t=clamp(t);if(!entry)return {attack:0,counter:0,impact:0,recoil:0,windup:0,stage:"ready"};
 return {attack:pulse(t,0,.40),counter:entry.counter?pulse(t,.50,.90):0,impact:entry.hit.amount?pulse(t,.20,.40):0,recoil:entry.counter?.amount?pulse(t,.70,.90):0,windup:entry.counter?pulse(t,.30,.50):0,stage:t<.20?"attack":t<.30?"impact":entry.counter&&t<.50?"windup":entry.counter&&t<.70?"counter":entry.counter&&t<.90?"recoil":"settle"};}
 function health(before,after,entry,t){if(!entry||t>=1)return after.map(q=>q.hp);const hp=before.map(q=>q.hp),a=entry.hit.side;if(t>=marks.attack){hp[1-a]=Math.max(0,hp[1-a]-entry.hit.amount);if(entry.hit.reward?.kind==="heal")hp[a]=Math.min(after[a].max,hp[a]+entry.hit.reward.amount);}if(entry.counter&&t>=marks.counter)hp[1-entry.counter.side]=Math.max(0,hp[1-entry.counter.side]-entry.counter.amount);return hp;}
 function shields(before,after,entry,t){if(!entry||t>=1)return after.map(q=>q.shield);const out=before.map(q=>q.shield),a=entry.hit.side;if(t>=marks.attack){if(entry.hit.shielded)out[1-a]=Math.max(0,out[1-a]-1);if(entry.hit.reward?.kind==="shield")out[a]=Math.max(out[a],2);}if(entry.counter&&t>=marks.counter&&entry.counter.shielded)out[1-entry.counter.side]=Math.max(0,out[1-entry.counter.side]-1);return out;}
 function event(entry,t){if(!entry)return null;if(t>=.20&&t<.43)return {side:1-entry.hit.side,amount:entry.hit.amount,label:entry.hit.amount?"−"+entry.hit.amount+" HP":entry.hit.blocked?"BLOCKED":"MISS",kind:"hit"};if(entry.counter&&t>=.70&&t<.93)return {side:1-entry.counter.side,amount:entry.counter.amount,label:entry.counter.amount?"−"+entry.counter.amount+" HP":entry.counter.blocked?"BLOCKED":"MISS",kind:"counter"};return null;}
 return {speeds,marks,duration,sample,health,shields,event};
})();
