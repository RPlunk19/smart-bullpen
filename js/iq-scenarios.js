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
  add(mode,"countS-"+id,1,"Count",context+"The next pitch is a called strike, caught cleanly. What happens?",strike,[ball,"The batter is awarded second base","Count stays unchanged"],"A called strike increases strikes by one; a caught third strike retires the hitter.");
  add(mode,"countB-"+id,1,"Count",context+"The next pitch is called a ball. What happens?",ball,[strike,"The batter is awarded second base","Count stays unchanged"],"Four balls award first base; otherwise the ball count increases.");
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

// Additional rules and situational families. These assume standard baseball rules
// unless stated; local youth modifications may differ.
for(let outs=0;outs<3;outs++)for(let b=0;b<4;b++)for(let mask=1;mask<8;mask++){
 const runners=[0,1,2].filter(i=>mask&(1<<i)).map(i=>base[i]).join(" and "),ctx="Count "+b+"–2, "+outs+" outs, runners on "+runners+". ",id=outs+"-"+b+"-"+mask;
 for(const mode of ["pitching","baseball"]){
 add(mode,"foul-"+id,1,"Rules",ctx+"The batter hits an ordinary foul ball that is not caught and is not a bunt. What is the count afterward?",b+"–2",[b+"–1","Strikeout","Walk"],"An uncaught ordinary foul with two strikes does not add a third strike.");
 const eligible=!(mask&1)||outs===2;
 add(mode,"third-"+id,3,"Rules",ctx+"The next swinging strike is not caught. Under standard uncaught-third-strike rules, may the batter attempt to reach first?",eligible?"Yes":"No — the batter is out",[eligible?"No — the batter is out":"Yes","Only if the ball was hit fair","Only if the pitcher calls time"],"The batter may attempt first on an uncaught third strike if first is unoccupied or there are two outs. League exceptions exist.");
 }
 if(outs<2&&(mask&4)){
 add("baseball","tag-"+id,2,"Baserunning",ctx+"A fair fly is caught. The runner on third wants to score. What is the legal timing?", "Leave third after the ball is first touched by a fielder, or retouch third before advancing",["Leave on contact without retouching","Wait until the next batter","A runner cannot advance on a caught fly"],"Runners must retouch their base after a caught fly unless they left no earlier than first touch.");
 }
 if(outs===2&&(mask&4)){
 add("baseball","run-"+id,4,"Scoring",ctx+"A fair ground ball is fielded and the batter-runner is retired at first for the third out. The runner from third crossed home before that out. Does the run count?","No",["Yes, because home was touched first","Yes, if the pitcher made the throw","Only if the count was full"],"No run scores when the third out is the batter-runner before reaching first.");
 }
}
for(let outs=0;outs<2;outs++)for(let mask of [3,7])for(let inning=1;inning<=7;inning++)for(const location of ["near second base","near shortstop","near third base"]){
 const runners=mask===3?"first and second":"bases loaded",ctx="Inning "+inning+", "+outs+" outs, "+runners+". ";
 for(const mode of ["pitching","baseball"])add(mode,"iff-"+outs+"-"+mask+"-"+inning+"-"+location.replaceAll(" ",""),3,"Rules",ctx+"The batter hits a fair pop-up "+location+" that an infielder can catch with ordinary effort (not a bunt or line drive). What may the umpire declare?","Infield fly",["Automatic double play","Ground-rule double","Balk"],"With runners on first and second or bases loaded and fewer than two outs, an eligible fair fly can be declared an infield fly.");
}
for(let outs=0;outs<3;outs++)for(const location of ["left field","center field","right field"])for(const runner of ["first","second","third"])for(const score of ["tied","ahead by one","behind by one"]){
 const ctx=outs+" outs, runner on "+runner+", team "+score+". ";
 add("baseball","read-"+outs+"-"+location.replaceAll(" ","")+"-"+runner+"-"+score.replaceAll(" ",""),2,"Baserunning",ctx+"A line drive heads toward "+location+" and may be caught. What should the runner do before committing to advance?", "Read the ball, know the outs and follow base-coach guidance",["Run without watching the ball","Assume it is a hit","Stop watching the field"],"The best advance depends on whether the ball is caught, the outs, and team instructions.");
 add("pitching","bk-"+outs+"-"+location[0]+"-"+runner[0]+"-"+["tied","ahead by one","behind by one"].indexOf(score),2,"Fielding",ctx+"A hit goes to "+location+". Your team assigns the pitcher to back up the expected throw. What is your first responsibility?","Read the play and move to the assigned backup position",["Remain on the mound regardless","Stand in the runner's path","Chase the outfielder"],"Backup responsibilities depend on team coverage and the developing play.");
}
for(const [mode,items] of Object.entries({
 baseball:[
 [1,"Hitting","Your coach calls for a normal swing and the pitch is clearly outside your hitting zone. What is a reasonable decision?","Take the pitch",["Swing at every pitch","Step toward the catcher","Close your eyes"],"Good swing decisions start with recognizing pitches you can handle."],
 [1,"Fielding","A routine ground ball is coming toward you. What is your first priority?","Get into position and secure the ball",["Throw before catching it","Look away","Run toward the dugout"],"Secure possession before making a play."],
 [1,"Team play","An infielder and outfielder both approach a fly ball. What helps prevent a collision?","Communicate using the team's priority rules",["Both stay silent","Both dive blindly","Ignore the other player"],"Clear communication and practiced priority rules help keep players safe."],
 [2,"Hitting","You are behind in the count and your coach wants you to protect the plate. What should change?","Be ready to compete on reachable strikes without chasing everything",["Swing at every pitch","Always bunt","Never swing"],"Protecting with two strikes does not mean abandoning pitch recognition."],
 [2,"Fielding","A throw to first is not available after you field a ground ball. What is the best response?","Secure the ball and avoid forcing a risky throw",["Throw as hard as possible anyway","Throw into the stands","Drop the ball"],"Keeping possession can prevent an extra base."],
 [3,"Strategy","A teammate is on second with no outs. Your coach has not called a bunt. What is appropriate?","Use the team hitting approach and the actual pitch rather than assuming a sacrifice",["Always bunt","Always swing for a home run","Never swing"],"The best approach depends on team strategy, hitter strengths and pitch location."],
 [4,"Analytics","A hitter has a high batting average but rarely walks or hits for extra bases. Which metrics add context?","On-base and slugging measures",["Jersey number and height","Only RBI totals","Only stolen bases"],"Different offensive metrics capture distinct contributions."],
 [5,"Analytics","A team's stolen-base success rate fell after facing several strong throwing catchers. What should an analyst consider?","Opponent quality and attempt selection",["The runners definitely became slower","Only total steals","The context is irrelevant"],"Observed outcomes reflect selection and opponent context, not ability alone."]
 ],
 pitching:[
 [1,"Fielding","Your catcher calls time and the umpire grants it. Should you deliver a pitch immediately?","No — wait until play resumes",["Yes, throw immediately","Only if the count is full","Only with bases empty"],"Do not pitch while time is out."],
 [2,"Sequencing","Your catcher sets up for a pitch you do not know how to throw. What should you do?","Communicate and use a familiar approved pitch",["Attempt it at maximum effort","Ignore the catcher","Invent a grip mid-delivery"],"Use pitches you know and communicate with your coach or catcher."],
 [3,"Strategy","A hitter has been taking borderline pitches and you are behind in the count. What adjustment fits the evidence?","Use a competitively located familiar pitch instead of relying on chase",["Throw farther outside","Ignore the count","Throw only a new pitch"],"Count leverage and hitter discipline both matter."],
 [4,"Pitch tracking","Two reports use different sign conventions for horizontal break. What should you do before comparing them?","Confirm the coordinate convention and normalize the values",["Compare signed values directly","Assume one pitcher improved","Ignore the units"],"Tracking systems may define axes differently; compare like with like."],
 [5,"Pitch tracking","A new pitch shape appears in a tracking report after a device was moved. What is the strongest next step?","Verify alignment and repeat the measurement under comparable conditions",["Treat it as proven pitch design success","Change the athlete's mechanics immediately","Ignore calibration"],"Measurement changes can masquerade as performance changes."]
 ]
}))items.forEach(([level,topic,prompt,correct,wrong,why],i)=>add(mode,"concept-"+i,level,topic,prompt,correct,wrong,why));
return {questions};
})();
