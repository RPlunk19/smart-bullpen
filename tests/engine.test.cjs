const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const context=vm.createContext({});
vm.runInContext(fs.readFileSync("js/engine.js","utf8")+"\nthis.engine=Bullpen;",context);
const E=context.engine,rng=()=>0,s=E.start({cap:8,level:0},rng);
for(let i=0;i<6;i++){const t=s.target,p=E.record(s,t,rng);assert.equal(p.points,100*Math.min(i+1,5));assert.notEqual(s.target,t);}
assert.equal(s.score,2000);const old=s.target;E.record(s,-1,rng);assert.equal(s.streak,0);assert.notEqual(s.target,old);
const p=E.record(s,s.target,rng);assert.equal(p.points,100);assert.equal(p.afterMiss,true);assert.equal(s.ended,true);assert.equal(E.record(s,0,rng),null);
const r=E.report(s);assert.equal(r.hits,7);assert.equal(r.inZone,7);assert.equal(r.n,8);assert.equal(r.comebacks,1);assert.equal(r.score,2100);
const stopped=E.start({cap:2,level:1},rng);E.stop(stopped);assert.equal(E.record(stopped,stopped.target,rng),null);assert.equal(E.report(stopped).command,null);
console.log("Core gameplay tests passed.");
const u=E.start({cap:3,level:0},rng);
E.record(u,u.target,rng);const second=u.target;E.record(u,second,rng);
const third=u.target;E.record(u,-1,rng);assert.equal(u.ended,true);
assert.equal(E.undo(u).actual,-1);assert.equal(u.target,third);assert.equal(u.ended,false);assert.equal(u.score,300);assert.equal(u.streak,2);assert.equal(u.best,2);
E.record(u,third,rng);assert.equal(u.ended,true);assert.equal(u.score,600);assert.equal(E.report(u).hits,3);
E.undo(u);E.undo(u);assert.equal(u.target,second);assert.equal(u.score,100);assert.equal(u.streak,1);assert.equal(u.best,1);
E.undo(u);assert.equal(u.score,0);assert.equal(E.undo(u),null);assert.equal(E.report(u).n,0);
console.log("Undo and final pitch correction tests passed.");
const mix=E.start({cap:6,level:1,pitch:"Mixed",allowed:["Fastball","Changeup","Slider"]},rng);
const sequence=[];for(let i=0;i<6;i++){sequence.push(mix.currentPitch);E.record(mix,i===2?-1:mix.target,rng);}
assert.equal(sequence.join(","),"Fastball,Changeup,Slider,Fastball,Changeup,Slider");
assert.equal(E.report(mix).byPitch.find(p=>p.pitch==="Slider").hits,1);
const last=E.undo(mix);assert.equal(mix.currentPitch,last.pitch);assert.equal(mix.target,last.target);E.record(mix,mix.target,rng);assert.equal(E.report(mix).byPitch.find(p=>p.pitch==="Slider").attempts,2);
const fix=E.start({cap:5,level:0,pitch:"Mixed",allowed:["Fastball","Changeup"]},rng);
E.record(fix,fix.target,rng);const upcoming=fix.currentPitch,zone=fix.target;E.undo(fix);assert.equal(fix.currentPitch,"Fastball");E.record(fix,fix.target,rng);assert.equal(fix.currentPitch,upcoming);assert.equal(fix.target,zone);
assert.throws(()=>E.start({cap:5,level:0,pitch:"Mixed",allowed:["Fastball"]},rng));
const single=E.start({cap:3,level:0,pitch:"Curveball"},rng);for(let i=0;i<3;i++)assert.equal(E.record(single,single.target,rng).pitch,"Curveball");
console.log("Mixed pitch and correction tests passed.");
