/* Pure animation timeline. The scored engine result is authoritative. */
const AtBatFilm=(()=>{
const clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,t)=>a+(b-a)*clamp(t),bases=[[0,0],[9,9],[0,18],[-9,9],[0,0]];
function plan(e){const hit=["Single","Double","Triple","Home run"].indexOf(e.outcome)+1,out=e.outcome==="Ball in play • out",walk=e.outcome==="Walk",foul=e.outcome==="Foul",swing=hit>0||out||foul||e.outcome==="Swinging strike"||e.outcome==="Strikeout"&&e.visualSwing===true;const old=e.before.frames[e.player].bases;
const paths=[];if(hit){paths.push({start:0,end:hit});for(let i=0;i<3;i++)if(old[i])paths.push({start:i+1,end:Math.min(4,i+1+hit)});}else if(walk){paths.push({start:0,end:1});let force=true;for(let i=0;i<3;i++)if(old[i]){paths.push({start:i+1,end:i+1+(force?1:0)});}else force=false;}else if(out)paths.push({start:0,end:1,out:true});if(out||foul)for(let i=0;i<3;i++)if(old[i])paths.push({start:i+1,end:i+1});
return {hit,out,walk,foul,swing,paths,duration:hit===4?5500:hit||out||walk?4500:foul?3000:2600};}
function spot(i){return i<9?[(i%3-1)*.37,1.22+(1-Math.floor(i/3))*.42]:[[0,2.08],[0,.48],[-.94,1.22],[.94,1.22]][i-9];}
function runner(path,t){const end=path.out?.88:path.end,progress=mix(path.start,end,t),i=Math.min(3,Math.floor(progress)),u=progress-i;return [mix(bases[i][0],bases[i+1][0],u),mix(bases[i][1],bases[i+1][1],u)];}
function sample(e,ms){const p=plan(e),t=clamp(ms/p.duration),release=clamp((ms-380)/650),contact=ms>=1030,flight=clamp((ms-1030)/1150),run=clamp((ms-1350)/(p.duration-1500));const [x,y]=spot(e.actual);let ball=[mix(.45,x,release),mix(2.05,y,release)+Math.sin(Math.PI*release)*.18,mix(8.2,0,release)];
if(contact&&(p.hit||p.out||p.foul)){const dest=p.foul?[-13,4]:p.hit===4?[4,37]:p.hit===3?[-10,29]:p.hit===2?[12,24]:p.out?[2,18]:[-7,14];ball=[mix(x,dest[0],flight),y*(1-flight)+Math.sin(Math.PI*flight)*(p.hit===4?10:p.foul?3:4),mix(0,dest[1],flight)];}
return {p,t,release,contact,flight,run,ball,delivery:clamp(ms/780),bat:p.swing?clamp((ms-750)/500):0,wide:ms>=1250&&(p.hit||p.out||p.walk||p.foul),caption:ms<380?"DELIVERY":!contact?"PITCH IN FLIGHT":e.outcome.toUpperCase(),runners:p.paths.map(q=>({path:q,pos:runner(q,run)}))};}
return {plan,sample,spot,runner,bases};
})();
