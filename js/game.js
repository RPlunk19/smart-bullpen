"use strict";
const $=id=>document.getElementById(id), E=Bullpen;
const make=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const fmt=n=>n.toLocaleString(),pct=(a,b)=>b?Math.round(100*a/b)+"%":"—";
let session=null,busy=false,timer=null,sound=false,audio=null;
function screen(id){["setup","play","result"].forEach(x=>{$(x).hidden=x!==id;});}
function tone(f,offset,duration,type="triangle"){if(!sound||!audio)return;try{const t=audio.currentTime+offset,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+duration);}catch{}}
$("sound").addEventListener("click",async()=>{if(sound){sound=false;}else{try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();await audio.resume();sound=true;tone(660,0,.15);}catch{sound=false;}}$("sound").textContent=sound?"Sound on":"Sound off";$("sound").setAttribute("aria-pressed",String(sound));});
for(let i=1;i<=30;i++){const o=make("option",i+" pitches");o.value=i;$("cap").append(o);}$("cap").value="15";
function setupGoal(){$("goalText").textContent="Goal: "+E.levels[Number($("difficulty").value)].goal+" treasure points • "+$("cap").value+" pitch maximum.";}
$("difficulty").addEventListener("change",setupGoal);$("cap").addEventListener("change",setupGoal);setupGoal();
$("start").addEventListener("click",()=>{session=E.start({nickname:$("nickname").value.trim()||"Demo Pitcher",level:Number($("difficulty").value),cap:Number($("cap").value),pitch:$("pitch").value,location:$("location").value});busy=false;screen("play");render();});
function render(shot=null){
 const s=session,last=shot||s.shots.at(-1),t=shot?shot.target:s.target;
 $("score").textContent=fmt(s.score);$("remaining").textContent=s.settings.cap-s.shots.length;$("mult").textContent=Math.min(s.streak+1,5)+"×";
 $("goalProgress").textContent=fmt(s.score)+" / "+fmt(s.goal);$("goalBar").value=Math.min(100,100*s.score/s.goal);
 $("combo").replaceChildren();for(let i=1;i<=5;i++)$("combo").append(make("span",i+"×",(s.streak>=i?"lit ":"")+(Math.min(s.streak+1,5)===i?"next":"")));
 $("call").textContent=shot?"PITCH RESULT":"PITCH "+(s.shots.length+1)+" • "+s.settings.pitch.toUpperCase();
 $("targetName").textContent=shot?(shot.hit?"DIRECT HIT!":"NEXT PITCH!") : E.zones[t].toUpperCase();
 $("grid").replaceChildren();$("arena").classList.toggle("shake",Boolean(shot&&shot.hit));
 E.zones.forEach((name,i)=>{const b=make("button",undefined,"cell"+(i===t?" active":"")+(shot&&shot.actual===i?(shot.hit?" correct":" wrong"):""));b.type="button";b.disabled=busy;b.setAttribute("aria-label","Record pitch at "+name);b.addEventListener("click",()=>score(i));
 if(i===t&&shot&&shot.hit){const debris=make("div",undefined,"debris");for(let j=0;j<6;j++)debris.append(make("i"));b.append(debris);const p=make("div",shot.icon,"reveal");p.append(make("b","+"+shot.points));b.append(p);}
 else if(i===t){const img=make("img");img.src="assets/crate.svg";img.alt="Target crate";b.append(img);}else b.append(make("span","·","dot"));
 b.append(make("span",name,"zoneLabel"));$("grid").append(b);});
 $("outside").disabled=busy;$("feedback").replaceChildren();
 const title=last?(last.hit?(last.afterMiss?"COMEBACK!":last.streak>=5?"LEGENDARY COMBO!":last.streak>=3?"ON FIRE!":last.streak===2?"DOUBLE CRASH!":"CRATE SMASHED!"):"NEW TARGET. FRESH START."):"READY TO CRASH!";
 $("feedback").classList.toggle("success",Boolean(last&&last.hit));$("feedback").append(make("strong",title),make("span",last&&last.hit?last.prize+" • +"+last.points+" points":"Focus on the next pitch."));
 $("loot").replaceChildren();const treasures=s.shots.filter(p=>p.hit);if(!treasures.length)$("loot").append(make("p","Your first treasure is waiting.","muted"));treasures.slice(-12).forEach(p=>{const n=make("span",p.icon);n.title=p.prize;n.append(make("b",p.points));$("loot").append(n);});
}
function score(i){if(!session||busy||session.ended)return;const p=E.record(session,i);if(!p)return;busy=true;if(p.hit){tone(110,0,.09);tone(440+p.streak*65,.05,.16);tone(720,.16,.22,"sine");if(p.afterMiss||p.streak>=3)tone(980,.3,.22,"sine");}else tone(220,0,.12,"sine");render(p);timer=setTimeout(()=>{busy=false;if(session.ended)finish();else render();},matchMedia("(prefers-reduced-motion: reduce)").matches?100:800);}
$("outside").addEventListener("click",()=>score(-1));$("stop").addEventListener("click",()=>{clearTimeout(timer);busy=false;E.stop(session);finish();});
function finish(){const s=session,r=E.report(s);screen("result");$("medal").textContent=r.passed?"🏆":"🏅";$("resultTitle").textContent=r.passed?"TREASURE SECURED!":"SESSION COMPLETE";const stars=r.score>=2*s.goal?3:r.passed?2:r.score>0?1:0;$("stars").textContent="★".repeat(stars)+"☆".repeat(3-stars);$("finalScore").textContent=fmt(r.score)+" POINTS";$("resultStatus").textContent=(s.stopped?"Coach ended session. ":"")+(r.passed?"Goal achieved.":"Goal not reached this session.");$("accuracy").textContent=pct(r.hits,r.n);$("best").textContent=r.best;$("comebacks").textContent=r.comebacks;
 $("reportSummary").textContent=s.settings.nickname+" • "+s.settings.location+" • "+s.settings.pitch+" • "+r.hits+"/"+r.n+" exact targets • "+pct(r.inZone,r.n)+" in zone • "+pct(r.comebacks,r.following)+" accuracy after a miss.";
 $("heat").replaceChildren();r.zones.forEach((z,i)=>{const a=z.attempts?z.hits/z.attempts:null,n=make("div",undefined,a===null?"":a>=.7?"good":a>=.4?"mid":"low");n.append(make("strong",pct(z.hits,z.attempts)),make("small",E.zones[i]+" · "+z.hits+"/"+z.attempts));$("heat").append(n);});
 $("log").replaceChildren();s.shots.forEach(p=>{const tr=make("tr");[p.number,E.zones[p.target],p.actual===-1?"Outside":E.zones[p.actual],p.points].forEach(v=>tr.append(make("td",String(v))));$("log").append(tr);});if(r.passed){tone(523,0,.18);tone(659,.15,.18);tone(784,.3,.3);}
}
$("home").addEventListener("click",()=>{clearTimeout(timer);busy=false;session=null;screen("setup");});
