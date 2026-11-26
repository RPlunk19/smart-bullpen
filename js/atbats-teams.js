/* Fictional clubs, original scouting text and illustrative tendencies. */
const AtBatTeams=(()=>{
const archetypes=[
["Velocity hunter","Looks to jump on hard stuff before falling behind. Changes in tempo can disrupt his timing.",["Fastball","Cutter"],["Changeup"],[1,4,5],.10,.02,.04],
["Patient table setter","Makes pitchers earn strikes. Handles softer pitches but can be late against elevated velocity.",["Changeup","Curveball"],["Fastball"],[4,7],-.12,.10,0],
["Inside power","Turns on pitches near his hands; less dangerous when made to cover the outer edge.",["Fastball","Sinker"],["Slider"],[0,3,6],.04,.01,.10],
["Low-zone damage","Likes a pitch down in his swing path. Changing the eye level makes him uncomfortable.",["Sinker","Changeup"],["Fastball"],[6,7,8],.04,.03,.09],
["Spin reader","Recognizes breaking pitches early. Harder looks and changes in speed can upset his balance.",["Curveball","Slider"],["Cutter"],[1,4,7],.02,.06,.03],
["Contact grinder","Stays alive with two strikes and rarely expands. Can be tied up by late movement.",["Fastball","Changeup"],["Cutter"],[3,4],-.08,.12,0],
["Chase-prone slugger","Swings with intent and can be drawn beyond the zone. Mistakes over the plate are dangerous.",["Fastball","Cutter"],["Curveball","Slider"],[1,4,7],.19,-.02,.11],
["Away-field hitter","Tracks pitches away and uses the opposite field. Has less room to extend against tight pitches.",["Changeup","Sinker"],["Cutter"],[2,5,8],-.03,.08,0],
["Sequence reader","Gets more comfortable seeing the same pitch twice. Changing speed and location keeps him unsettled.",["Fastball"],["Changeup"],[1,4,5],.06,.05,.04],
["High-ball hitter","Prefers pitches he can lift above the belt. Downward movement can take him out of his comfort zone.",["Fastball","Cutter"],["Sinker"],[0,1,2],.06,.03,.08],
["Breaking-ball ambusher","Looks for spin when ahead in the count. Can be caught late by firm pitches.",["Slider","Curveball"],["Fastball"],[3,4,6],.07,.02,.07],
["Disciplined power","Will wait for a pitch he can drive instead of chasing. Do not assume a three-ball count means a free strike.",["Fastball","Changeup"],["Slider"],[4,5,7],-.11,.04,.13]
];
const specs=[
["hawks","Prairie Hawks","Balanced approach","#543589","#e3bc49","A versatile lineup with a mix of patience, power and contact.",[0,1,2,3,4,5,6,7,8],["Evan Reed","Miles Cruz","Jordan King","Noah Vega","Alex Brooks","Sam Ellis","Drew Park","Casey Lane","Taylor Moss"]],
["forge","Iron Forge","Power hitters","#9f302e","#f0c66a","Extra-base threats throughout the order; some will chase.",[0,9,11,6,3,2,10,4,8],["Cole Maddox","Jace Warren","Roman Holt","Brock Steele","Dante Price","Gavin Knox","Troy Bishop","Nico Shaw","Luca Grant"]],
["tide","Harbor Tide","Patient contact","#176779","#b8ded9","Works counts and makes pitchers finish at-bats.",[1,5,7,11,4,1,5,8,7],["Finn Mercer","Owen Lake","Rafael Soto","Silas Bay","Mason Wells","Eli Porter","Jules Hart","Theo Quinn","Avery Dean"]],
["foxes","Copper Foxes","Aggressive offense","#a74e21","#f2cd86","Early-count pressure and frequent chase opportunities.",[0,6,9,2,10,6,3,0,8],["Blake Rowan","Rory Flint","Cody Nash","Rex Dalton","Adrian Cole","Kellan Wade","Tate Flynn","Reid Tucker","Jett Ross"]],
["summit","Summit Owls","Pitch recognition","#304e85","#d6ddeb","Recognizes spin and repeated looks; requires varied sequencing.",[8,4,1,10,11,5,4,7,8],["Asher Snow","Liam Frost","Mateo Rios","Nolan Stone","Isaac Peak","Julian North","Emmett Gray","Kai Vale","Ezra Hill"]],
["storm","Delta Storm","Left-heavy lineup","#246344","#b6d86e","A left-heavy order that tests changing locations and pitch movement.",[7,0,3,11,9,5,2,4,1],["Leo Rivers","Caleb Marsh","Diego Silva","Max Wilder","Hugo West","Micah Banks","Jasper Reed","Oscar Lane","Ben Archer"]],
["comets","Metro Comets","Mixed speed and contact","#344052","#70c9fa","Contact at the top, power in the middle, unpredictable bottom order.",[5,7,9,11,10,2,1,6,8],["Aidan Bell","Kobe James","Marco Diaz","Cruz Vega","Dylan Hart","Jayden Parks","Zane Ford","Rylan Boyd","Seth Young"]],
["bears","Timber Bears","Low-ball and pull power","#755038","#e4c9a4","Strong low-zone hitters with several inside-pitch threats.",[3,2,0,11,3,6,9,5,10],["Wyatt Boone","Logan Pike","Hank Miller","Brady Oak","Felix Wood","Clay Stone","Chase Hunt","Griffin Dale","Austin Hale"]]
];
const skins=["#d5a174","#bd8b67","#8d5b40","#e4b894","#a77352"],hands=["R","L","R","L","R","L","R","L","R"];
const teams=specs.map(([id,name,style,color,accent,description,order,names],ti)=>({id,name,style,color,accent,description,lineup:order.map((a,i)=>{const [style,hint,fav,weak,hot,chase,contact,power]=archetypes[a];const hand=id==="storm"?(i===2||i===6?"R":"L"):hands[(i+ti)%9];const mirrored=hand==="L"&&[2,7].includes(a);const zones=hot.map(z=>mirrored?Math.floor(z/3)*3+2-z%3:z);return {id:id+"-"+(i+1),name:names[i],hand,style,hint,fav:[...fav],weak:[...weak],hot:zones,chase:Math.max(-.15,Math.min(.23,chase+((i+ti)%3-1)*.015)),contact:contact+((i*3+ti)%5-2)*.008,power:Math.max(0,power+((i+2*ti)%5-2)*.008),repeatSensitivity:a===8?.15:.10,early:a===0||a===6,number:11+i*3+ti,skin:skins[(i+ti*2)%skins.length],height:40+(i*7+ti)%25,build:40+(i*5+ti*3)%28};})}));
const byId=id=>teams.find(t=>t.id===id);
function scouting(h,q){let situational="";if(q.strikes===2)situational=h.chase>.10?"With two strikes he may expand to protect.":h.contact>.08?"He shortens up and battles with two strikes.":"He has to protect more of the plate now.";else if(q.balls===3)situational=h.chase<0?"With three balls he is likely to make you earn the next strike.":"He may still attack a pitch he can drive.";else if(q.pa.slice(-2).length===2&&q.pa.slice(-2).every(x=>x.pitch===q.pa[q.pa.length-1].pitch))situational="He has now seen that pitch repeatedly; his timing may be improving.";else if(q.balls===0&&q.strikes===0&&h.early)situational="Be aware of his first-pitch aggression.";return [h.hint,situational].filter(Boolean).join(" ");}
return {teams,byId,scouting};
})();