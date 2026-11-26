/* Optional low-load recovery, not rehabilitation or throwing clearance. */
const Recovery=(()=>{
const rows=[
["Move","Easy walk or march",60,"Move easily; no need to raise your heart rate much.","march"],
["Move","Gentle lateral stepping",60,"Small comfortable steps.","side"],
["Move","Relaxed whole-body movement",60,"Walk and gently swing arms.","march"],
["Mobility","Ankle rocks",60,"Hold support; move knee forward over toes without forcing.","ankle"],
["Mobility","90/90 hip transitions",60,"Sit with knees bent; use hands for support. Move within comfort.","hips"],
["Mobility","Half-kneeling hip mobility",60,"Small forward shift; switch sides halfway.","lunge"],
["Mobility","Adductor rockbacks",60,"On hands and knees, extend one leg to the side and rock back gently.","rock"],
["Mobility","Active hamstring mobility",60,"Lie on back, support thigh and gently straighten knee.","ham"],
["Mobility","Cat-cow",60,"On hands and knees, gently round and relax your back.","cat"],
["Mobility","Open-book rotations",60,"Side lying, knees bent; rotate upper trunk comfortably.","book"],
["Mobility","Active shoulder flexion",60,"Raise arms comfortably; no forced overhead reach.","raise"],
["Mobility","Gentle shoulder rotation",60,"Elbows at sides; rotate forearms without forcing.","rotation"],
["Mobility","Scapular movement",60,"Gently move shoulder blades forward and back.","scap"],
["Mobility","Elbow and forearm motion",60,"Bend and straighten elbows, turn palms up and down.","elbow"],
["Mobility","Wrist and hand motion",60,"Open and close hands; gentle wrist motion.","wrist"],
["Activation","Glute bridges",120,"A few easy repetitions, rest, repeat only if comfortable.","bridge"],
["Activation","Bird dogs",120,"Reach opposite arm and leg; use one limb at a time if easier.","bird"],
["Activation","Dead bugs",60,"On back, move one limb at a time; breathe normally.","dead"],
["Activation","Bodyweight split squats",60,"Shallow supported movement; switch sides.","lunge"],
["Activation","Scapular push-ups",60,"Use wall or hands and knees; small shoulder blade movement.","scap"],
["Activation","Prone Y-T-W raises",120,"Small comfortable lifts without weights; rest often.","ytw"],
["Activation","Gentle shoulder rotation isometrics",120,"Elbow at side; gently press into opposite hand, then relax. Both sides.","iso"],
["Activation","Gentle wrist isometrics",60,"Light resistance from opposite hand; brief holds, rest often.","wrist"],
["Reset","Relaxed breathing",60,"Breathe normally and relax shoulders.","breath"],
["Reset","Comfortable movement reassessment",60,"Move gently; notice how you feel, not a test to pass.","raise"],
["Reset","Recovery check-in",60,"Stop and review how you feel. No throwing required.","breath"]
];
const steps=rows.map(([phase,name,seconds,cue,motion])=>({phase,name,seconds,cue,motion}));
function start(){return {index:0,remaining:steps[0].seconds,running:false,finished:false,elapsed:0,skips:0};}
function next(s,skip=false){if(s.finished)return false;if(skip)s.skips++;s.index++;s.running=false;s.finished=s.index===steps.length;s.remaining=s.finished?0:steps[s.index].seconds;return true;}
function tick(s,delta){if(!s.running||s.finished||!Number.isFinite(delta)||delta<=0)return false;const n=Math.min(delta,s.remaining);s.elapsed+=n;s.remaining-=n;return s.remaining<=0?next(s):false;}
function cue(step,level){const extra=level==="Foundations"?" Adult helps; try a few easy movements, then rest.":level==="Developing"?" Take frequent breaks; keep it easy.":level==="Intermediate"?" Use slow control and easy effort.":" Use your individualized comfortable range; stay at easy effort.";return step.cue+extra;}
function advice({pain,motion,soreness,fatigue}){return pain==="yes"||motion==="limited"?"Stop throwing and tell a parent or coach. Seek assessment by a healthcare professional before returning to throwing.":Number(soreness)>=3||Number(fatigue)>=3||motion==="stiff"?"Choose gentle movement or complete rest today. Follow required pitching rest.":"No concerns reported. This does not clear you to throw; follow your planned rest and coach-approved workload.";}
return {steps,start,next,tick,cue,advice};
})();