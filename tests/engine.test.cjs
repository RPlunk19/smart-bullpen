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