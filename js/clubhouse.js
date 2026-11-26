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
["cleats","crystal-cleats","Crystal Ice Cleats","2-4","#83d4e9"],
["hat","robot-cap","Scout Circuit Cap","robot:r1","#227b91"],
["tape","robot-tape","Electric Circuit Tape","robot:r1","#65e6e3"],
["glove","robot-glove","Iron Defender Glove","robot:r2","#7188a5"],
["necklace","robot-chain","Circuit Link Chain","robot:r2","#87d9e8"],
["jersey","robot-jersey","Circuit Crusher Jersey","robot:r3","#674bb1"],
["sleeve","robot-sleeve","Titan Tech Sleeve","robot:r4","#e56b45"],
["cleats","robot-cleats","Titan Alloy Cleats","robot:r4","#627b91"],
["glasses","robot-visor","Omega Gold Visor","robot:r5","#eac44f"],
["necklace","robot-omega","Omega Core Pendant","robot:r5","#eac44f"],
["jersey","robot-champ","Omega Champion Jersey","robot:r5","#26475b"],["hat","ring-cap","Ring Champion Cap","duel-win","#cb454a"],["necklace","ring-medal","Ringside Medal","duel-win","#f0ca64"]
 ,["hat","sniper-cap","Precision Cap","sniper:win","#526347"],["jersey","sniper-jersey","Sniper Jersey","sniper:points","#314c36"],["tape","sniper-tape","Bullseye Wrist Tape","sniper:streak","#d8c66d"],["glasses","sniper-shades","Elite Command Shades","sniper:legend","#94bca2"],["necklace","sniper-chain","Golden Target Chain","sniper:perfect","#e4bc4c"],["jersey","sniper-champ","Sniper Champion Uniform","sniper:champ","#b0a052"] ].map(([slot,id,name,requirement,color])=>({slot,id,name,requirement,color}));
 const defaultGear=Object.fromEntries(slots.map(slot=>[slot,items.find(i=>i.slot===slot&&i.requirement==="starter").id]));
 const skins=["#f1c7a1","#d5a174","#b87a50","#925938","#69412f","#4e3028"];
 const avatarStyles=["male","female","neutral"];
 const hairStyles=["short-hair","curls-hair","long-hair","blond-hair","ponytail","bun"];
 const hairColors=[["Black","#252128"],["Dark brown","#382a28"],["Brown","#754b32"],["Light brown","#a47a4d"],["Blond","#d7b16a"],["Red","#a54b30"],["Gray","#a9a9b1"],["White","#e8e2d8"]];
 function validColor(v){return typeof v==="string"&&/^#[0-9a-f]{6}$/i.test(v);}
 function rarity(item){const req=item?.requirement||"starter";if(req.startsWith("sniper:"))return ["sniper:perfect","sniper:champ"].includes(req)?"Legendary":["sniper:streak","sniper:legend"].includes(req)?"Epic":"Rare";if(req==="starter")return "Common";if(["master","duel-win","5-4","robot:r5"].includes(req))return "Legendary";if(req==="combo"||/^4-/.test(req)||/^5-/.test(req)||/^robot:r[34]$/.test(req)||/^3-/.test(req))return "Epic";return "Rare";}
 function avatarScale(v){return Number.isFinite(v)?Math.max(0,Math.min(100,Math.round(v))):50;}
 const flags=["combo","comeback","master","duel-win"];
 const abLevels=["Foundations","Developing","Intermediate","Advanced","Elite"],abPitches=["Fastball","Changeup","Curveball","Slider","Cutter","Sinker"],abDifficulties=["Rookie","Pro","All-Star"];
 function abPreferences(v){const a=Array.isArray(v?.arsenal)?abPitches.filter(p=>v.arsenal.includes(p)):[];return {development:abLevels.includes(v?.development)?v.development:"Foundations",arsenal:a.length?a:["Fastball"]};}
 function atbatsClean(v){const n=k=>Number.isSafeInteger(v?.[k])&&v[k]>=0?Math.min(v[k],100000000):0;const out=Object.fromEntries(["sessions","wins","innings","pitches","runs","hits","walks","ks","outs","exact","strikes","scoreless"].map(k=>[k,n(k)]));out.categories={};for(const d of abLevels)for(const l of abDifficulties){const k=d+"|"+l,r=v?.categories?.[k];if(r&&typeof r==="object"){out.categories[k]=Object.fromEntries(["sessions","wins","innings","pitches","runs","exact","strikes","scoreless"].map(x=>[x,Number.isSafeInteger(r[x])&&r[x]>=0?Math.min(r[x],100000000):0]));}}return out;}
 function sniperClean(v){const num=(x,max)=>Number.isSafeInteger(x)&&x>=0?Math.min(max,x):0;const records={};for(const cap of [10,15,20,30,50])for(const format of ["random","mirror"])for(const imp of ["regulation","mixed"]){const k=cap+"|"+format+"|"+imp,r=v?.records?.[k];if(r&&Number.isInteger(r.points)&&r.points>=0&&r.points<=2*cap&&Number.isInteger(r.exact)&&r.exact>=0&&r.exact<=cap&&Number.isInteger(r.strikes)&&r.strikes>=r.exact&&r.strikes<=cap&&r.points===r.strikes+r.exact)records[k]={points:r.points,exact:r.exact,strikes:r.strikes,date:typeof r.date==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(r.date)?r.date:""};}const cpuWins={};for(const k of ["Rookie","Pro","All-Star","Legend"])cpuWins[k]=num(v?.cpuWins?.[k],1000000);const pitches=num(v?.pitches,100000000),strikes=Math.min(pitches,num(v?.strikes,100000000)),exact=Math.min(strikes,num(v?.exact,100000000));return {matches:num(v?.matches,1000000),wins:num(v?.wins,1000000),points:num(v?.points,100000000),best:num(v?.best,50),legend:v?.legend===true,perfect:v?.perfect===true,pitches,strikes,exact,trackedMatches:num(v?.trackedMatches,1000000),individualWins:num(v?.individualWins,1000000),teamWins:num(v?.teamWins,1000000),cpuWins,records,tournaments:num(v?.tournaments,1000000),titles:num(v?.titles,1000000)};}
 function sniperRequirement(req){return ({"sniper:win":"Win a completed Sniper match","sniper:points":"Earn 50 cumulative Sniper points","sniper:streak":"Five consecutive exact locations in one match","sniper:legend":"Win against a Legend CPU","sniper:perfect":"Complete a perfect match of at least 10 pitches","sniper:champ":"Win 25 completed Sniper matches"})[req]||"";}
 function unlocked(p,item){const req=item.requirement;if(req.startsWith("sniper:")){const s=sniperClean(p.games?.sniper);return req==="sniper:win"?s.wins>=1:req==="sniper:points"?s.points>=50:req==="sniper:streak"?s.best>=5:req==="sniper:legend"?s.legend:req==="sniper:perfect"?s.perfect:req==="sniper:champ"?s.wins>=25:false;}if(req==="starter")return true;if(flags.includes(req))return Boolean(p.flags[req]);if(req.startsWith("robot:"))return Boolean(p.games.robot[req.slice(6)]);return Boolean(p.progress[req]);}
 function sanitize(p){p=p&&typeof p==="object"?p:{};const progress=C.clean(p.games?.crate??p.progress),robot=GameCatalog.clean(p.games?.robot),fs=Object.fromEntries(flags.map(k=>[k,p.flags?.[k]===true]));const result={id:typeof p.id==="string"?p.id.slice(0,64):"",name:typeof p.name==="string"?p.name.trim().slice(0,24):"Player",skin:skins.includes(p.skin)?p.skin:skins[1],number:Number.isInteger(p.number)&&p.number>=0&&p.number<=99?p.number:7,avatarStyle:avatarStyles.includes(p.avatarStyle)?p.avatarStyle:"male",avatarHeight:avatarScale(p.avatarHeight),avatarBuild:avatarScale(p.avatarBuild),atbatsPreferences:abPreferences(p.atbatsPreferences),progress,games:{crate:progress,robot,sniper:sniperClean(p.games?.sniper),atbats:atbatsClean(p.games?.atbats)},flags:fs,gear:{...defaultGear}};
 if(!result.name)result.name="Player";
 for(const slot of slots){const item=items.find(i=>i.id===p.gear?.[slot]&&i.slot===slot);if(item&&unlocked(result,item))result.gear[slot]=item.id;}const legacyHair=items.find(i=>i.id===result.gear.hair);result.hairStyle=hairStyles.includes(p.hairStyle)?p.hairStyle:result.gear.hair;result.hairColor=validColor(p.hairColor)?p.hairColor.toLowerCase():legacyHair.color;return result;}
 function load(raw,legacy){const data=raw&&typeof raw==="object"?raw:{};let players=Array.isArray(data.players)?data.players.slice(0,32).map(sanitize).filter(p=>p.id):[];players=players.filter((p,i)=>players.findIndex(q=>q.id===p.id)===i);if(!players.length){const old=C.clean(legacy);players=[sanitize({id:"legacy",name:Object.keys(old).length?"Legacy Player":"Player 1",progress:old})];}return {players,active:players.some(p=>p.id===data.active)?data.active:players[0].id};}
 function career(p){const cleared=Object.keys(p.progress).length,stars=Object.values(p.progress).reduce((n,l)=>n+l.stars,0),worlds=C.worlds.filter((w,i)=>p.progress[(i+1)+"-4"]).length;const rank=cleared===20?"Champion":cleared>=16?"Elite":cleared>=12?"All-Star":cleared>=8?"Veteran":cleared>=4?"Prospect":"Rookie";const next=C.stages.find(l=>!p.progress[l.id]);const robotCleared=Object.keys(p.games.robot).length,robotStars=Object.values(p.games.robot).reduce((n,l)=>n+l.stars,0);return {cleared,stars,worlds,rank,next,robotCleared,robotStars,totalCleared:cleared+robotCleared,totalStars:stars+robotStars};}
 function earned(p){return items.filter(i=>unlocked(p,i));}
 function acceptGame(p,game,level,r){const out=sanitize(p),before=new Set(earned(out).map(i=>i.id));if(game==="atbats"){const a=out.games.atbats;if(r&&Number.isInteger(r.n)&&r.n>0&&r.n<=50&&["runs","hits","walks","ks","outs","completed","exact","strikes"].every(k=>Number.isInteger(r[k])&&r[k]>=0&&r[k]<=r.n*4)){a.sessions++;a.pitches+=r.n;a.innings+=r.completed;for(const k of ["runs","hits","walks","ks","outs","exact","strikes"])a[k]+=r[k];if(r.win===true)a.wins++;if(r.complete&&r.runs===0)a.scoreless++;if(abLevels.includes(r.development)&&abDifficulties.includes(r.difficulty)){const k=r.development+"|"+r.difficulty,b=a.categories[k]??={sessions:0,wins:0,innings:0,pitches:0,runs:0,exact:0,strikes:0,scoreless:0};b.sessions++;b.pitches+=r.n;b.innings+=r.completed;b.runs+=r.runs;b.exact+=r.exact;b.strikes+=r.strikes;if(r.win===true)b.wins++;if(r.complete&&r.runs===0)b.scoreless++;}}return {player:out,newItems:[]};}if(game==="sniper"){const a=out.games.sniper;if(r&&Number.isInteger(r.n)&&r.n>0&&r.n<=50&&Number.isInteger(r.points)&&r.points>=0&&r.points<=2*r.n&&Number.isInteger(r.best)&&r.best>=0&&r.best<=r.n){a.points=Math.min(100000000,a.points+r.points);a.best=Math.max(a.best,r.best);if(Number.isInteger(r.strikes)&&Number.isInteger(r.exact)&&r.exact>=0&&r.strikes>=r.exact&&r.strikes<=r.n&&r.points===r.strikes+r.exact){a.pitches=Math.min(100000000,a.pitches+r.n);a.strikes=Math.min(100000000,a.strikes+r.strikes);a.exact=Math.min(100000000,a.exact+r.exact);if(r.complete===true){a.trackedMatches++;if(r.win===true){if(r.teamMatch)a.teamWins++;else a.individualWins++;if(Object.hasOwn(a.cpuWins,r.cpuLevel))a.cpuWins[r.cpuLevel]++;}if([10,15,20,30,50].includes(r.cap)&&r.n===r.cap&&["random","mirror"].includes(r.format)&&["regulation","mixed"].includes(r.implement)){const k=r.cap+"|"+r.format+"|"+r.implement,old=a.records[k];if(!old||r.points>old.points||r.points===old.points&&r.exact>old.exact)a.records[k]={points:r.points,exact:r.exact,strikes:r.strikes,date:typeof r.date==="string"?r.date:""};}}}if(r.complete===true){a.matches=Math.min(1000000,a.matches+1);if(r.win===true)a.wins=Math.min(1000000,a.wins+1);a.legend=a.legend||r.win===true&&r.legend===true;a.perfect=a.perfect||r.perfect===true&&r.n>=10&&r.points===2*r.n;}}return {player:out,newItems:earned(out).filter(i=>!before.has(i.id))};}if(!["crate","robot","duel"].includes(game))return {player:out,newItems:[]};if(level&&game==="crate"){out.progress=C.clear(out.progress,level,r);out.games.crate=out.progress;}if(level&&game==="robot")out.games.robot=GameCatalog.clear(out.games.robot,level,r);if(r.n>0){if(game==="duel"&&r.duelWin===true)out.flags["duel-win"]=true;out.flags.combo=out.flags.combo||r.best>=5;out.flags.comeback=out.flags.comeback||r.comebacks>=1;out.flags.master=out.flags.master||Object.values(out.progress).filter(v=>v.stars===3).length>=5;}return {player:out,newItems:earned(out).filter(i=>!before.has(i.id))};}
 function accept(p,level,r){return acceptGame(p,"crate",level,r);}
 function equip(p,id){const out=sanitize(p),item=items.find(i=>i.id===id);if(item&&unlocked(out,item)){out.gear[item.slot]=id;if(item.slot==="hair")out.hairStyle=id;}return out;}
 function preview(p,id){const out=sanitize(p),item=items.find(i=>i.id===id);const gear={...out.gear};if(item)gear[item.slot]=item.id;return {skin:out.skin,number:out.number,avatarStyle:out.avatarStyle,avatarHeight:out.avatarHeight,avatarBuild:out.avatarBuild,hairStyle:item?.slot==="hair"?item.id:out.hairStyle,hairColor:out.hairColor,gear:Object.fromEntries(slots.map(s=>[s,items.find(i=>i.id===gear[s])])),showHat:true};}
 return {sniperRequirement,slots,items,skins,avatarStyles,avatarScale,hairStyles,hairColors,validColor,rarity,preview,defaultGear,sanitize,load,earned,unlocked,accept,acceptGame,equip,career};
})(Campaign);
