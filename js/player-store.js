"use strict";
/* Shared browser-local profile storage. No network or authentication. */
const PlayerStore=(()=>{
const key="smart-bullpen-clubhouse-v1",legacyKey="smart-bullpen-campaign-v1";
function read(storage=localStorage){let ok=true,roster;try{const raw=JSON.parse(storage.getItem(key)||"null");roster=Clubhouse.load(raw,JSON.parse(storage.getItem(legacyKey)||"{}"));roster.tournaments=Array.isArray(raw?.tournaments)?raw.tournaments:[];roster.coach=raw?.coach&&typeof raw.coach==="object"?raw.coach:{};}catch{ok=false;roster=Clubhouse.load(null,{});}return {roster,ok};}
function write(roster,storage=localStorage){try{const raw=JSON.parse(storage.getItem(key)||"null");const tournaments=Array.isArray(roster.tournaments)?roster.tournaments:Array.isArray(raw?.tournaments)?raw.tournaments:[];storage.setItem(key,JSON.stringify({...roster,tournaments,coach:roster.coach??raw?.coach??{}}));return true;}catch{return false;}}
function active(roster){return roster.players.find(p=>p.id===roster.active);}
function accept(roster,id,game,level,result){const p=roster.players.find(p=>p.id===id);if(!p)return null;const reward=Clubhouse.acceptGame(p,game,level,result);return {roster:{...roster,players:roster.players.map(q=>q.id===id?reward.player:q)},...reward};}
return {key,read,write,active,accept};
})();