"use strict";
const IQScoring=(()=>{
const LIMIT=30000,MAX=1000;
function points(correct,ms){return correct&&Number.isFinite(ms)&&ms>=0&&ms<LIMIT?Math.max(1,Math.ceil(MAX*(LIMIT-ms)/LIMIT)):0;}
function total(r){return (r?.answers||[]).reduce((n,a)=>n+points(a.correct,a.ms),0);}
function timed(r){return r?.answers?.length===5&&r.answers.every(a=>Number.isInteger(a.ms)&&a.ms>=0&&a.ms<=LIMIT);}
const periods={day:86400000,week:604800000,month:2592000000,year:31536000000,all:Infinity};
function leaders(players,period="all",now=Date.now(),level=0){const range=periods[period]??Infinity,rows=[];for(const p of players)for(const r of p.baseballIQ?.rounds||[]){if(!timed(r)||!Number.isFinite(r.savedAt)||r.savedAt>now||now-r.savedAt>=range||(level&&r.level!==level))continue;rows.push({id:r.id,player:p.id,name:p.name,score:total(r),level:r.level,savedAt:r.savedAt});}return rows.sort((a,b)=>b.score-a.score||a.savedAt-b.savedAt||a.id.localeCompare(b.id));}
function lifetime(players){return players.map(p=>({player:p.id,name:p.name,score:(p.baseballIQ?.archivedPoints||0)+(p.baseballIQ?.rounds||[]).filter(timed).reduce((n,r)=>n+total(r),0)})).filter(p=>p.score>0).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)||a.player.localeCompare(b.player));}
function timer({onTick,onExpire,clock=()=>performance.now(),schedule=(f)=>setInterval(f,50),cancel=id=>clearInterval(id)}={}){let started=0,handle=null,running=false;function stop(){if(handle!==null)cancel(handle);handle=null;running=false;}function elapsed(){return Math.min(LIMIT,Math.max(0,Math.floor(clock()-started)));}function tick(){if(!running)return;const ms=elapsed();onTick?.(LIMIT-ms);if(ms>=LIMIT){stop();onExpire?.();}}function start(){stop();started=clock();running=true;handle=schedule(tick);tick();}function claim(){if(!running)return null;const ms=elapsed();stop();onTick?.(LIMIT-ms);return ms;}return {start,stop,claim,tick};}
return {LIMIT,MAX,points,total,timed,leaders,lifetime,timer};
})();