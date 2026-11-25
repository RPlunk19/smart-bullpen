/* Pure time and bullpen planning functions. */
const Prep = (function createPrep(){
 const stages=[
  {
    "name": "Readiness check",
    "from": 60,
    "to": 57,
    "kind": "Recovery",
    "tasks": [
      "Confirm eligibility, arm readiness and recent workload with your coach. Hydrate and check equipment. Stop for pain or unusual fatigue."
    ]
  },
  {
    "name": "Dynamic warm-up",
    "from": 57,
    "to": 50,
    "kind": "Movement",
    "tasks": [
      "2 min easy jog, skips and lateral shuffle.",
      "2 min walking lunges with rotation and lateral lunges (5 each side).",
      "2 min leg swings and hip openers.",
      "1 min thoracic rotations and arm circles; short accelerations if appropriate."
    ]
  },
  {
    "name": "Jaeger J-Bands",
    "from": 50,
    "to": 42,
    "kind": "Movement",
    "tasks": [
      "Secure the anchor away from the line of the face. Use light resistance; junior bands for ages 12 and under.",
      "Over-the-head forearm extensions: 10 reps. Side and diagonal extensions: gentle 15–20 sec per side each.",
      "Forward flies and reverse flies: 10 each.",
      "Internal and external rotation at hip height: 10 each.",
      "Elevated internal and external rotation: 10 each.",
      "Reverse throwing and forward throwing motion: 10 each. Smooth controlled reps; stop before fatigue. Reduced pregame dose, not the full Jaeger conditioning prescription."
    ]
  },
  {
    "name": "PlyoCare preparation",
    "from": 42,
    "to": 33,
    "kind": "Throwing",
    "tasks": [
      "Follow the selected coach-approved plan. Only familiar drills and weights, at easy to moderate intent, into a suitable wall/net.",
      "No max-effort or velocity work. Stop before fatigue; do not introduce weighted balls on game day.",
      "If none selected, use light mobility, shadow deliveries or rest. Do not add throws to fill the time."
    ]
  },
  {
    "name": "Progressive catch",
    "from": 33,
    "to": 28,
    "kind": "Throwing",
    "tasks": [
      "Start short with a regulation baseball. Gradually build comfortable distance and intent. Rest as needed."
    ]
  },
  {
    "name": "Extension & return",
    "from": 28,
    "to": 23,
    "kind": "Throwing",
    "tasks": [
      "Extend within the athlete's established comfortable range if accustomed to long toss, then return to pitching distance. No max-distance throws or high-intent pull-downs."
    ]
  },
  {
    "name": "Hydrate & reset",
    "from": 23,
    "to": 20,
    "kind": "Recovery",
    "tasks": [
      "Drink water, check arm response, and review the first-inning plan with catcher and coach."
    ]
  },
  {
    "name": "Programmed bullpen",
    "from": 20,
    "to": 6,
    "kind": "Bullpen",
    "tasks": [
      "Start with comfortable fastballs, progress to familiar secondary pitches and game locations.",
      "Take normal recovery and short water breaks. Stop when ready or at the agreed cap; never rush."
    ]
  },
  {
    "name": "Competition transition",
    "from": 6,
    "to": 0,
    "kind": "Ready",
    "tasks": [
      "Stay warm, hydrate, review first-batter plan and coordinate permitted on-field warm-ups. Adjust timing for actual mound entry if needed."
    ]
  }
];
 const profiles={youth:{label:"Youth starter (9–12)",cap:12,max:15},junior:{label:"Junior starter (13–14)",cap:16,max:20},high:{label:"High school starter (15–18)",cap:20,max:25},adult:{label:"Adult starter",cap:20,max:30}};
 function plyoPlan(profile,mode,heavy){
 if(mode==="none")return [];
 if(!["high","adult"].includes(profile))throw Error("Weighted-ball preset unavailable for this age profile.");
 if(!["short","full"].includes(mode)||![1500,2000].includes(heavy))throw Error("Invalid PlyoCare selection.");
 const row=(name,weights,reps)=>({name,weights,reps,total:weights.length*reps});
 const r=mode==="short"?3:5,light=[450,225,150,100];
 const rows=[row("Reverse throws",[heavy,1000],r),row("Pivot pickoffs",[1000,450],r)];
 if(mode==="full")rows.push(row("Step backs",light,1),row("Drop steps",light,1));
 rows.push(row("Walking windups",light,1));return rows;
 }
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
 return {stages,profiles,timeState,bullpen,plyoPlan};
})();
