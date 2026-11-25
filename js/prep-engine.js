/* Pure time and bullpen planning functions. */
const Prep = (function createPrep(){
 const stages=[
 {name:"Readiness check",from:60,to:55,kind:"Recovery",tasks:["Check arm readiness, recent throwing workload and required rest with your coach.","Confirm game time, catcher availability and the day's pitch plan.","Drink water; check cleats and equipment. No throwing if pain or unusual fatigue is present."]},
 {name:"Dynamic warm-up",from:55,to:47,kind:"Movement",tasks:["2 min easy jog, skips and lateral shuffle.","2 min walking lunges with rotation (5/side) and lateral lunges (5/side).","2 min leg swings forward/lateral (8 each/leg) and hip openers (5/side).","2 min thoracic rotations (6/side), arm circles (8 each direction), then 2 short progressive accelerations if space permits."]},
 {name:"Arm activation",from:47,to:41,kind:"Movement",tasks:["Light band rows and external/internal rotation at side: 1 × 8–10 each, easy resistance.","Scapular wall slides or standing reaches: 1 × 8.","Gentle wrist/forearm movement and 5 controlled shadow deliveries. No fatigue, forced stretching or unfamiliar drills."]},
 {name:"Progressive catch",from:41,to:35,kind:"Throwing",tasks:["Start at a comfortable short distance, e.g. 20–30 ft for younger players or 30–45 ft for older players.","Easy throws at roughly 40–50% perceived intent; gradually back up toward normal pitching distance as tolerated.","Focus on rhythm, relaxed arm action and smooth catch. Take rests as needed; no required throw total."]},
 {name:"Extension & return",from:35,to:28,kind:"Throwing",tasks:["If accustomed to long toss, extend in small increments within your normal comfortable range. Otherwise continue easy catch.","Older pitchers may use a familiar 60–90 ft progression; younger pitchers can stay at a shorter comfortable distance. These are examples, not distance targets.","Return to normal pitching distance with smooth, controlled throws. No max-distance throws or max-effort pull-downs."]},
 {name:"Hydrate & reset",from:28,to:24,kind:"Recovery",tasks:["Water, relaxed breathing, check arm response and confirm readiness.","Discuss first-inning plan with catcher and coach. Stop if pain or unusual fatigue develops.","Set up the mound and agree on the bullpen cap before throwing."]},
 {name:"Programmed bullpen",from:24,to:8,kind:"Bullpen",tasks:["Begin with comfortable mound fastballs, then progress to familiar secondary pitches and game-location calls.","Take normal recovery between pitches and a short water/rest break between blocks as needed.","Stop when ready or at the agreed cap, whichever comes first. Never rush to finish the program."]},
 {name:"Competition transition",from:8,to:0,kind:"Ready",tasks:["Water as needed; stay warm with a jacket and light movement.","Review first batter, first-pitch plan, breathing and one simple cue.","Coordinate permitted on-field warm-up pitches with the coach. If pitching later (e.g. away team), adjust the plan around actual mound entry."]}
 ];
 const profiles={youth:{label:"Youth starter (9–12)",cap:12,max:15},junior:{label:"Junior starter (13–14)",cap:16,max:20},high:{label:"High school starter (15–18)",cap:20,max:25},adult:{label:"Adult starter",cap:20,max:30}};
 function timeState(target,now){
  const ms=target-now,remaining=Math.max(0,Math.ceil(ms/1000));
  const active=ms>60*60000?-1:ms<=0?stages.length:stages.findIndex(s=>ms<=s.from*60000&&ms>s.to*60000);
  const phaseRemaining=active===-1?Math.max(0,Math.ceil((ms-60*60000)/1000)):active===stages.length?0:Math.max(0,Math.ceil((ms-stages[active].to*60000)/1000));
  return {remaining,active,phaseRemaining};
 }
 function bullpen(cap,secondary){
  if(!Number.isInteger(cap)||cap<3||cap>30)throw Error("Invalid bullpen cap");
  const a=Math.max(1,Math.floor(cap*.30)),b=Math.max(1,Math.floor(cap*.40)),c=cap-a-b;
  const groups=[{name:"Find rhythm",intent:"Easy → moderate (about 50–65% perceived intent)",count:a},{name:"Build & feel",intent:"Moderate → comfortably firm (about 65–80%)",count:b},{name:"Compete",intent:"Approach normal game intent only if ready",count:c}];
  const targets=["Glove-side","Arm-side","Low middle","Glove-side","Arm-side"];
  return groups.map((g,j)=>({...g,calls:Array.from({length:g.count},(_,i)=>({pitch:j===0||!secondary.length||i%2===0?"Fastball":secondary[Math.floor(i/2)%secondary.length],target:j===0?"Comfortable catcher target":targets[i%targets.length],delivery:j===2&&i%2===1?"Stretch":"Usual delivery"}))}));
 }
 return {stages,profiles,timeState,bullpen};
})();
