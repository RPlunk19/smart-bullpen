/* Optional guided preparation. Time is guidance, not readiness clearance. */
const Warmup=(()=>{
const steps=[
["Move","Light jog or march",30,"Easy pace; use a march in a small space.","march"],
["Move","Lateral shuffles",30,"Small steps, soft knees; step side to side if space is limited.","shuffle"],
["Move","High knees",30,"Lift comfortably; walking pace is fine.","march"],
["Move","Jumping jacks",30,"Land softly; step jacks are fine.","jack"],
["Mobility","Reverse lunge with rotation",30,"Alternate sides; use a shallow step and gentle turn.","lunge"],
["Mobility","Lateral lunges",30,"Shift gently side to side; keep feet planted.","side"],
["Mobility","Standing hip rotations",30,"Hold support if needed; alternate sides.","hip"],
["Mobility","Standing trunk rotations",30,"Turn comfortably without forcing range.","rotate"],
["Mobility","Arm circles",30,"Start small; gradually increase if comfortable.","circle"],
["Mobility","Alternating arm swings",30,"Relax shoulders; swing gently.","swing"],
["Activation","Scapular wall slides",30,"Slide arms gently; stand away from wall if unavailable.","wall"],
["Activation","Standing W raises",30,"Keep shoulders relaxed; no resistance required.","w"],
["Activation","Bodyweight squats",30,"Comfortable depth; controlled pace.","squat"],
["Activation","Single-leg balance with reach",30,"Alternate sides; use support if needed.","balance"],
["Throw","Easy short-distance throws",120,"Use a safe net or ready partner. Easy effort; rest between throws.","throw"],
["Throw","Gradually build distance or effort",120,"Increase only if comfortable; no maximum-effort throws.","throw"],
["Throw","Comfortable pitching-specific throws",60,"Gradually prepare for the session. Extend or stop as needed.","throw"]
].map(([phase,name,seconds,cue,motion])=>({phase,name,seconds,cue,motion}));
const day=(d=new Date())=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
function start(){return {index:0,remaining:steps[0].seconds,running:false,finished:false,skipped:false,elapsed:0,completed:0};}
function advance(s,skip=false){if(s.finished)return false;if(skip)s.skipped=true;else s.completed++;s.index++;if(s.index===steps.length){s.finished=true;s.running=false;s.remaining=0;}else{s.remaining=steps[s.index].seconds;s.running=false;}return true;}
function tick(s,delta){if(!s.running||s.finished||!Number.isFinite(delta)||delta<=0)return false;const used=Math.min(delta,s.remaining);s.elapsed+=used;s.remaining-=used;if(s.remaining<=0){advance(s);return true;}return false;}
function extend(s,seconds=30){if(s.finished||!Number.isFinite(seconds)||seconds<=0)return false;s.remaining+=seconds;return true;}
function credit(s){return s.finished&&!s.skipped&&s.completed===steps.length&&s.elapsed>=720-1e-6;}
return {steps,day,start,advance,tick,extend,credit};
})();