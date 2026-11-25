/* Local-only player profiles and cosmetic reward rules. */
const Clubhouse = (function createClubhouse(C){
 const slots=["hat","jersey","necklace","tape","glasses","cleats","glove","sleeve","pants","socks","eye","hair"];
 const items=[
 ["hat","classic-cap","Classic Navy Cap","starter","#233c60"],
 ["hat","gold-cap","Captain's Gold Cap","1-4","#f3bf49"],
 ["hat","crystal-cap","Crystal Snapback","2-2","#7455d3"],
 ["hat","sky-cap","Championship Cap","5-4","#e8e9f2"],
 ["jersey","home-jersey","Home Whites","starter","#f4f0e8"],
 ["jersey","purple-jersey","Purple & Gold","1-2","#461d7c"],
 ["jersey","jungle-jersey","Jungle Camo","3-4","#507b50"],
 ["jersey","forge-jersey","Blackout Forge","4-4","#27212c"],
 ["jersey","sky-jersey","Sky Blue City Edition","5-2","#6eb5e9"],
 ["necklace","no-chain","No Necklace","starter","none"],
 ["necklace","silver-chain","Silver Rope Chain","1-1","#dbe4ef"],
 ["necklace","gold-chain","Gold Cuban Link","2-4","#f4bf4a"],
 ["necklace","ice-chain","Iced Diamond Chain","5-4","#b4f5ff"],
 ["tape","white-tape","Classic White Tape","starter","#f5f3e9"],
 ["tape","purple-tape","Purple Wrist Tape","1-3","#8257bf"],
 ["tape","teal-tape","Electric Teal Tape","2-1","#35c9bf"],
 ["tape","flame-tape","Forge Orange Tape","4-2","#fa7c37"],
 ["glasses","no-shades","No Sunglasses","starter","none"],
 ["glasses","gold-shades","Gold Mirror Shades","2-3","#e9b84f"],
 ["glasses","ice-shades","Ice Blue Visor","5-1","#79dcf6"],
 ["cleats","classic-cleats","Classic Black Cleats","starter","#263041"],
 ["cleats","gold-cleats","Gold Spikes","3-1","#e9b74d"],
 ["cleats","fire-cleats","Flame Cleats","4-3","#d75435"],
 ["glove","classic-glove","Classic Tan Glove","starter","#ad723e"],
 ["glove","purple-glove","Purple Web Glove","3-2","#7143a5"],
 ["glove","ice-glove","Ice Web Glove","5-3","#83d4e9"],
 ["hat","streak-cap","On Fire Cap","combo","#e65b37"],
 ["necklace","comeback-chain","Comeback Pendant","comeback","#cddaff"],
 ["jersey","master-jersey","Command Master Jersey","master","#e4ac39"],
 ["glove","champion-glove","Champion Gold Glove","5-4","#f4cd64"],
["sleeve","no-sleeve","No Arm Sleeve","starter","none"],
["sleeve","navy-sleeve","Navy Compression Sleeve","1-1","#233c60"],
["sleeve","purple-sleeve","Purple Lightning Sleeve","2-2","#8257bf"],
["sleeve","forge-sleeve","Forge Flame Sleeve","4-1","#e76b3c"],
["sleeve","champ-sleeve","Championship Gold Sleeve","5-4","#f3cf64"],
["pants","white-pants","Home White Pants","starter","#e3e6ed"],
["pants","gray-pants","Road Grays","1-2","#aeb8c8"],
["pants","stripe-pants","Classic Pinstripes","2-4","#f4f0e8"],
["pants","black-pants","Blackout Pants","4-4","#27212c"],
["socks","navy-socks","Classic Navy Socks","starter","#233c60"],
["socks","purple-stirrups","Purple & Gold Stirrups","1-3","#461d7c"],
["socks","crystal-socks","Crystal Teal Socks","2-3","#35c9bf"],
["socks","sky-stirrups","Sky Blue Stirrups","5-2","#6eb5e9"],
["eye","no-eye","No Eye Black","starter","none"],
["eye","classic-eye","Classic Eye Black","1-1","#242632"],
["eye","cross-eye","Double Stripe Eye Black","3-3","#242632"],
["eye","war-eye","War Paint Eye Black","4-3","#242632"],
["hair","short-hair","Short Crop","starter","#382a28"],
["hair","curls-hair","Curly Hair","starter","#382a28"],
["hair","blond-hair","Blond Flow","starter","#c89b57"],
["hair","long-hair","Long Flow","starter","#49352d"],
["hat","jungle-cap","Jungle Camo Cap","3-3","#507b50"],
["hat","forge-cap","Forge Black Cap","4-1","#29232e"],
["necklace","relic-chain","Ancient Relic Pendant","3-4","#d8b567"],
["necklace","flame-chain","Ember Pendant","4-4","#f28a43"],
["tape","gold-tape","Championship Gold Tape","5-4","#f3cf64"],
["glove","forge-glove","Forge Black & Orange Glove","4-2","#40313b"],
["cleats","crystal-cleats","Crystal Ice Cleats","2-4","#83d4e9"]
 ].map(([slot,id,name,requirement,color])=>({slot,id,name,requirement,color}));
 const defaultGear=Object.fromEntries(slots.map(slot=>[slot,items.find(i=>i.slot===slot&&i.requirement==="starter").id]));
 const skins=["#f1c7a1","#d5a174","#b87a50","#925938","#69412f","#4e3028"];
 const flags=["combo","comeback","master"];
 function unlocked(p,item){return item.requirement==="starter"||flags.includes(item.requirement)?item.requirement==="starter"||Boolean(p.flags[item.requirement]):Boolean(p.progress[item.requirement]);}
 function sanitize(p){p=p&&typeof p==="object"?p:{};const progress=C.clean(p.progress),fs=Object.fromEntries(flags.map(k=>[k,p.flags?.[k]===true]));const result={id:typeof p.id==="string"?p.id.slice(0,64):"",name:typeof p.name==="string"?p.name.trim().slice(0,24):"Player",skin:skins.includes(p.skin)?p.skin:skins[1],number:Number.isInteger(p.number)&&p.number>=0&&p.number<=99?p.number:7,progress,flags:fs,gear:{...defaultGear}};
 if(!result.name)result.name="Player";
 for(const slot of slots){const item=items.find(i=>i.id===p.gear?.[slot]&&i.slot===slot);if(item&&unlocked(result,item))result.gear[slot]=item.id;}return result;}
 function load(raw,legacy){const data=raw&&typeof raw==="object"?raw:{};let players=Array.isArray(data.players)?data.players.slice(0,32).map(sanitize).filter(p=>p.id):[];players=players.filter((p,i)=>players.findIndex(q=>q.id===p.id)===i);if(!players.length){const old=C.clean(legacy);players=[sanitize({id:"legacy",name:Object.keys(old).length?"Legacy Player":"Player 1",progress:old})];}return {players,active:players.some(p=>p.id===data.active)?data.active:players[0].id};}
 function career(p){const cleared=Object.keys(p.progress).length,stars=Object.values(p.progress).reduce((n,l)=>n+l.stars,0),worlds=C.worlds.filter((w,i)=>p.progress[(i+1)+"-4"]).length;const rank=cleared===20?"Champion":cleared>=16?"Elite":cleared>=12?"All-Star":cleared>=8?"Veteran":cleared>=4?"Prospect":"Rookie";const next=C.stages.find(l=>!p.progress[l.id]);return {cleared,stars,worlds,rank,next};}
 function earned(p){return items.filter(i=>unlocked(p,i));}
 function accept(p,level,r){const out=sanitize(p),before=new Set(earned(out).map(i=>i.id));if(level)out.progress=C.clear(out.progress,level,r);if(r.n>0){out.flags.combo=out.flags.combo||r.best>=5;out.flags.comeback=out.flags.comeback||r.comebacks>=1;out.flags.master=out.flags.master||Object.values(out.progress).filter(v=>v.stars===3).length>=5;}return {player:out,newItems:earned(out).filter(i=>!before.has(i.id))};}
 function equip(p,id){const out=sanitize(p),item=items.find(i=>i.id===id);if(item&&unlocked(out,item))out.gear[item.slot]=id;return out;}
 return {slots,items,skins,defaultGear,sanitize,load,earned,unlocked,accept,equip,career};
})(Campaign);
