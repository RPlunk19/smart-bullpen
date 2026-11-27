"use strict";
// Deterministic, offline scenario generation. Stable IDs must not change after release.
const IQScenarios=(()=>{
const questions={pitching:[],baseball:[]},prompts={pitching:new Set(),baseball:new Set()};
function add(mode,id,level,topic,prompt,correct,wrong,why){if(prompts[mode].has(prompt))return;prompts[mode].add(prompt);const options=[correct,...wrong].map(String);if(new Set(options).size!==4)throw Error("Duplicate answers "+id);questions[mode].push({id:mode[0]+"2-"+id,level,topic,prompt,correct:String(correct),options,why});}
const pitch=["Fastball","Changeup","Curveball","Slider","Cutter"],positions=["catcher","first baseman","second baseman","third baseman","shortstop","left fielder","center fielder","right fielder"],base=["first","second","third","home"],counts=[];for(let b=0;b<4;b++)for(let s=0;s<3;s++)counts.push([b,s]);
const pct=(n,d)=>Math.round(n/d*1000)/10;
function num(mode,id,level,topic,prompt,n,why,step=1,suffix=""){const correct=String(n)+suffix,wrong=[];for(const x of [n+step,n-step,n+2*step,n-2*step,n+3*step,n+4*step])if(x>=0&&(suffix!=="%"||x<=100)&&x!==n&&wrong.length<3&&!wrong.includes(String(Math.round(x*10)/10)+suffix))wrong.push(String(Math.round(x*10)/10)+suffix);add(mode,id,level,topic,prompt,correct,wrong,why);}
for(const [b,s] of counts)for(let outs=0;outs<3;outs++)for(let mask=0;mask<8;mask++){
 const runners=[0,1,2].filter(i=>mask&(1<<i)).map(i=>base[i]).join(" and ")||"none",context="Count "+b+"–"+s+", "+outs+" out"+(outs===1?"":"s")+", runners: "+runners+". ";
 for(const mode of ["pitching","baseball"]){
  const id=b+"-"+s+"-"+outs+"-"+mask;
  const strike=s===2?"Strikeout (assume caught third strike)":"Count becomes "+b+"–"+(s+1);
  const ball=b===3?"Walk":"Count becomes "+(b+1)+"–"+s;
  add(mode,"countS-"+id,1,"Count",context+"The next pitch is a called strike, caught cleanly. What happens?",strike,[ball,"The inning ends automatically","Count stays unchanged"],"A called strike increases strikes by one; a caught third strike retires the hitter.");
  add(mode,"countB-"+id,1,"Count",context+"The next pitch is called a ball. What happens?",ball,[strike,"The inning ends automatically","Count stays unchanged"],"Four balls award first base; otherwise the ball count increases.");
  const forced=(mask&1)?(mask&2)?(mask&4)?3:2:1:0;
  if(b===3)num(mode,"walk-"+id,2,"Baserunners",context+"Ball four is caught. How many existing runners must advance one base because of the walk?",forced,"Only runners forced by the batter's award of first must advance.");
 }
}
for(let outs=0;outs<3;outs++)for(let mask=0;mask<8;mask++)for(const position of positions){
 const runners=[0,1,2].filter(i=>mask&(1<<i)).map(i=>base[i]).join(" and ")||"none",ctx=outs+" outs; runners: "+runners+". ";
 const forced=[0];if(mask&1){forced.push(1);if(mask&2){forced.push(2);if(mask&4)forced.push(3);}}
 for(let target=0;target<4;target++){
 const f=forced.includes(target);
 add("baseball","force-"+outs+"-"+mask+"-"+position.replaceAll(" ","")+"-"+target,2,"Defensive decisions",ctx+"The "+position+" fields a fair ground ball. Before any runner is retired, is there a force play at "+base[target]+"?",""+(f?"Yes — the batter-runner or a runner is forced there":"No — no runner is forced to that base"),[f?"No — no runner is forced to that base":"Yes — the batter-runner or a runner is forced there","Only if the count was full","Only if a run has scored"],"The batter-runner is forced to first. Existing runners are forced only when all preceding bases are occupied.");
 }
}
for(let outs=0;outs<3;outs++)for(let mask=1;mask<8;mask++)for(let inn=1;inn<=7;inn++){
 const runners=[0,1,2].filter(i=>mask&(1<<i)).map(i=>base[i]).join(" and "),ctx="Inning "+inn+", "+outs+" outs, runners on "+runners+". ";
 const runs=1+[0,1,2].filter(i=>mask&(1<<i)).length;
 num("baseball","hr-"+outs+"-"+mask+"-"+inn,1,"Scoring",ctx+"The batter hits a fair over-the-fence home run. Everyone legally touches all required bases. How many runs score?",runs,"All existing runners plus the batter score.");
 const remaining=3-outs;
 num("pitching","outs-"+outs+"-"+mask+"-"+inn,1,"Game awareness",ctx+"How many more outs does your defense need to end this half-inning?",remaining,"A half-inning ends after three outs.");
}
for(let level=1;level<=5;level++)for(let total=level===1?5:10;total<=(level===1?30:level===2?40:level===3?60:level===4?80:100);total+=level===1?5:5){
 for(let hit=1;hit<total;hit+=Math.max(1,Math.floor(total/10))){
  const miss=total-hit,n=pct(hit,total);
  for(const mode of ["pitching","baseball"]){
   const id=level+"-"+total+"-"+hit;
   if(level===1){num(mode,"remain-"+id,level,"Game awareness",mode==="pitching"?"You have recorded "+hit+" throws against a practice ceiling of "+total+". How many throws remain under the ceiling (not a target)?":"Your team has "+total+" scheduled games and has played "+hit+". How many games remain?",miss,"Subtract completed from total.");}
   if(level===2){num(mode,"rate-"+id,level,mode==="pitching"?"Command":"Hitting",mode==="pitching"?"You hit "+hit+" of "+total+" called targets. What percentage were exact (nearest tenth)?":"You reached safely "+hit+" times in "+total+" opportunities. What percentage is that (nearest tenth)?",n,"Divide successful opportunities by total and multiply by 100.",1,"%");}
   if(level===3){num(mode,"rate-"+id,level,"Analytics",mode==="pitching"?"You struck out "+hit+" of "+total+" batters faced. What is your K% (nearest tenth)?":"A fielder converted "+hit+" of "+total+" recorded opportunities into outs. What is the conversion rate (nearest tenth)?",n,"Divide successful outcomes by opportunities and multiply by 100.",1,"%");}
   if(level===4){num(mode,"rate-"+id,level,"Advanced analytics",mode==="pitching"?"A pitch produced "+hit+" misses on "+total+" swings. What is its whiff rate (nearest tenth)?":"A batter swung and missed "+hit+" times in "+total+" swings. What is the whiff rate (nearest tenth)?",n,"Whiff rate uses swings as the denominator, not all pitches.",1,"%");}
   if(level===5){const bb=Math.max(0,Math.floor(hit/3)),v=pct(hit-bb,total);num(mode,"kbb-"+id,level,"Advanced analytics","Across "+total+" plate appearances, there were "+hit+" strikeouts and "+bb+" walks. What is K% minus BB% (nearest tenth, percentage points)?",v,"Subtract walks from strikeouts, divide by plate appearances, multiply by 100.",1," pp");}
  }
 }
}
for(let level=2;level<=5;level++)for(let a=10;a<=50;a+=5)for(let b=10;b<=50;b+=5)for(let x=2;x<a;x+=4){
 const y=Math.min(b-1,Math.max(1,Math.floor(x/a*b)+(x%3)-1)),pa=pct(x,a),pb=pct(y,b);
 if(pa===pb)continue;
 for(const mode of ["pitching","baseball"]){
 const prompt=level<=3?(mode==="pitching"?"Pitch A hit "+x+"/"+a+" targets; pitch B hit "+y+"/"+b+".":"Hitter A had "+x+" hits in "+a+" at-bats; hitter B had "+y+" hits in "+b+" at-bats."):(mode==="pitching"?"Pitch A induced "+x+" misses on "+a+" swings; pitch B induced "+y+" misses on "+b+" swings.":"Hitter A missed "+x+" of "+a+" swings; hitter B missed "+y+" of "+b+" swings.");
 const correct=pa>pb?"A":"B",metric=level<=3?(mode==="pitching"?"target rate":"batting average"):"whiff rate";if(level===2||level===4)add(mode,"compare-"+level+"-"+a+"-"+b+"-"+x,level,level<=3?"Performance comparison":"Analytics",prompt+" Which had the higher observed "+metric+"?",correct,[correct==="A"?"B":"A","Equal rates","Cannot calculate from these counts"],"A: "+pa+"%; B: "+pb+"%. Compare rates, not just counts; sample size matters.");else if(level===3)num(mode,"gap-"+a+"-"+b+"-"+x,level,"Performance comparison",prompt+" What is the absolute difference in observed rates, in percentage points (nearest tenth)?",pct(Math.abs(x*b-y*a),a*b),"Subtract the two unrounded rates, then round.",1," pp");else num(mode,"pool-"+a+"-"+b+"-"+x,level,"Analytics",prompt+" What is the pooled whiff rate across both samples (nearest tenth)?",pct(x+y,a+b),"Pool the misses and swings before dividing; do not simply average the two percentages.",1,"%");
 }
}
for(let level=2;level<=5;level++)for(const [b,s] of counts)for(let o=0;o<3;o++)for(const p of pitch){
 const ctx="Count "+b+"–"+s+", "+o+" outs. ";
 if(b>=2&&s<2)add("pitching","reliable-"+level+"-"+b+"-"+s+"-"+o+"-"+p,level,"Sequencing",ctx+"Your "+p.toLowerCase()+" is the only pitch you are consistently locating today. Your catcher asks for a competitive strike. Which choice best follows the plan?",p,pitch.filter(v=>v!==p).slice(0,3),"Choose a familiar, reliably commanded pitch when the stated goal is a competitive strike.");
 else if(s===2&&b<3)add("pitching","chase-"+level+"-"+b+"-"+s+"-"+o+"-"+p,level,"Sequencing",ctx+"The hitter repeatedly chases your well-commanded "+p.toLowerCase()+" just below the zone. Your coach wants to use that observation. Which pitch best matches the stated plan?",p,pitch.filter(v=>v!==p).slice(0,3),"Use observed tendencies and familiar pitches; this is a reasonable option, not a guaranteed out.");
}
for(let level=3;level<=5;level++)for(let v=70;v<=96;v+=2)for(let diff=5;diff<=15;diff+=2)for(const p of ["Changeup","Curveball","Slider"]){
 const slow=v-diff;
 const ctx="A tracking device measures a fastball at "+v+" mph and a "+p.toLowerCase()+" at "+slow+" mph. ";if(level===3)num("pitching","velo-"+level+"-"+v+"-"+diff+"-"+p,level,"Pitch tracking",ctx+"What is the measured speed separation?",diff,"Subtract the slower speed from the faster. Separation alone does not establish pitch quality.",1," mph");if(level===4)num("pitching","velo-"+level+"-"+v+"-"+diff+"-"+p,level,"Pitch tracking",ctx+"What percentage slower is the second pitch relative to the fastball (nearest tenth)?",pct(diff,v),"Divide the difference by fastball velocity and multiply by 100.",1,"%");if(level===5)num("pitching","velo-"+level+"-"+v+"-"+diff+"-"+p,level,"Pitch tracking",ctx+"Assuming constant speed over the same distance, approximately what percentage longer does the slower pitch take (nearest tenth)?",pct(diff,slow),"Travel time is inversely proportional to speed in this simplified model. Real pitches decelerate.",1,"%");
}
for(let level=4;level<=5;level++)for(let rpm=1500;rpm<=3000;rpm+=100)for(let eff=50;eff<=100;eff+=5){
 const n=rpm*eff/100;
 num("pitching","spin-"+level+"-"+rpm+"-"+eff,level,"Pitch tracking","A simplified report lists "+rpm+" rpm total spin and "+eff+"% active-spin fraction. In this model, how many rpm contribute to active spin?",n,"Multiply total spin by the active-spin fraction; actual movement depends on other factors too.",25," rpm");
}
for(let level=3;level<=5;level++)for(let ab=10;ab<=50;ab+=5)for(let singles=1;singles<=5;singles++)for(let doubles=0;doubles<=3;doubles++)for(let hr=0;hr<=2;hr++){
 if(singles+doubles+hr>ab)continue;const tb=singles+2*doubles+4*hr;
 const ctx="In "+ab+" at-bats, a hitter records "+singles+" singles, "+doubles+" doubles, no triples and "+hr+" home runs. ";if(level===3)num("baseball","tb-"+level+"-"+ab+"-"+singles+"-"+doubles+"-"+hr,level,"Hitting analytics",ctx+"How many total bases?",tb,"Singles count 1, doubles 2, triples 3 and home runs 4.");if(level===4)num("baseball","tb-"+level+"-"+ab+"-"+singles+"-"+doubles+"-"+hr,level,"Hitting analytics",ctx+"What is slugging percentage expressed as total bases per 100 at-bats (nearest tenth)?",pct(tb,ab),"Divide total bases by at-bats and multiply by 100.",1);if(level===5)num("baseball","tb-"+level+"-"+ab+"-"+singles+"-"+doubles+"-"+hr,level,"Hitting analytics",ctx+"What is isolated power (SLG minus AVG) expressed per 100 at-bats (nearest tenth)?",pct(tb-singles-doubles-hr,ab),"Subtract hits from total bases, divide by at-bats and multiply by 100.",1);
}
for(let level=3;level<=5;level++)for(let attempts=5;attempts<=35;attempts+=5)for(let stolen=1;stolen<attempts;stolen++){
 num("baseball","sb-"+level+"-"+attempts+"-"+stolen,level,"Baserunning","A runner successfully steals "+stolen+" bases in "+attempts+" attempts. What is their success rate (nearest tenth)?",pct(stolen,attempts),"Successful steals divided by attempts, times 100.",1,"%");
}
return {questions};
})();
