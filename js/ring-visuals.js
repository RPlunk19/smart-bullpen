/* Visual-only procedural 3D models. */
const RingModels=(function models(G){
 const colors=["#59b4cc","#8ba5c7","#a18bed","#ea835a","#f2cb66"];
 function beat(e,t){return RingTiming.sample(e,t);}
 function builder(pos,yaw,tilt=0){const m=[],rot=p=>G.rotate(p,yaw,0,tilt).map((v,i)=>v+pos[i]);return {m,box:(p,s,c,r=0)=>m.push(G.box(rot(p),s,c,[yaw,0,tilt+r])),cyl:(p,r,h,c)=>m.push(G.prism(rot(p),r,h,10,c,[yaw,0,tilt])),gem:(p,r,h,c)=>m.push(G.gem(rot(p),r,h,c,[yaw,0,tilt]))};}
 function robot(i,pos,yaw,p={}){const {m,box:b,cyl:c,gem:g}=builder(pos,yaw,p.tilt),col=colors[i],dark="#27374c",trim=i===4?"#ffe28e":"#b9cfdb",glove=["#c34c57","#527bb5","#8055c6","#d95e40","#d2a343"][i],s=i===2?.64:1,w=i===1?1.15:i>=3?.72:1,torso=1.25*s,head=2.08*s+(i===2?.12:0),arm=1.42*s;
 for(const a of [-1,1]){b([a*.38*w,.30,0],[.54*w,.55,.62],dark);b([a*.38*w,.12,-.12],[.65*w,.24,.8],col);if(i===1)for(let j=0;j<3;j++)b([a*.38,.16+j*.12,-.52],[.46,.055,.04],trim);}
 b([0,.69*s,0],[.8*w,.38,.60],dark);b([0,torso,0],[1.22*w,.95*s,.72],col);b([0,torso,-.39],[.82*w,.60*s,.12],dark);g([0,torso,-.48],.21,.36,p.overdrive?"#ff7852":p.core?"#b0ffff":trim);
 b([0,head,0],[.79,.66,.68],col);b([0,head+.36,0],[.64,.12,.59],trim);b([0,head+.04,-.36],[.65,.22,.08],dark);
 for(const a of [-1,1]){b([a*.17,head+.04,-.42],[.22,.09,.06],p.overdrive?"#ff694a":"#bdfcff");if(i===4&&a===-1)continue;const x=a*(.83*w+.15),z=-.30-(p.strike||0)*(a===-1?.85:.32);c([a*.65*w,arm,0],.22,.42,dark);b([x,arm-.17,z+.18],[.37,.65,.42],col,a*.16);b([x,arm+.11+(p.guard?.2:0),z-.12],[.62,.53,.61],glove);b([x,arm+.11,z-.45],[.50,.12,.08],trim);}
 for(let j=0;j<Math.min(5,p.wear||0);j++)b([((j%3)-1)*.22*w,torso+.24-Math.floor(j/3)*.34,-.47],[.24,.04,.035],"#121c2c",j%2?.5:-.5);return m;}
 function human(pos,yaw,gear,p={}){const {m,box:b,cyl:c}=builder(pos,yaw,p.tilt),shirt=gear.jersey||"#e7e9ed",skin=gear.skin||"#b87a50",hat=gear.hat||"#243a57";
 for(const a of [-1,1]){b([a*.23,.42,0],[.36,.76,.38],gear.pants||"#dce1e6");b([a*.23,.09,-.12],[.43,.2,.66],gear.cleats||"#263041");b([a*.23,.22,0],[.36,.16,.39],gear.socks||hat);}
 b([0,.88,0],[.76,.19,.48],"#243448");b([0,1.30,0],[.88,.76,.53],shirt);b([0,1.42,-.29],[.045,.51,.04],hat);c([0,1.79,0],.14,.24,skin);c([0,2.02,0],.32,.48,skin);c([0,2.29,0],.34,.19,hat);b([0,2.23,-.31],[.61,.07,.32],hat);
 for(const a of [-1,1]){b([a*.56,1.49,0],[.32,.31,.34],shirt);b([a*.65,1.28,-(p.strike||0)*.55],[.25,.43,.27],a===-1&&gear.sleeve&&gear.sleeve!=="none"?gear.sleeve:skin,a*.25);b([a*.68,1.04,-(p.strike||0)*.85],[.29,.24,.30],gear.tape||"#f2f2e9");}
 if(gear.necklace&&gear.necklace!=="none")for(const x of [-.13,0,.13])b([x,1.62+Math.abs(x)*.65,-.30],[.14,.055,.05],gear.necklace);if(gear.glasses&&gear.glasses!=="none")b([0,2.06,-.30],[.51,.12,.07],gear.glasses);b([.67,1.04,-.08],[.34,.32,.36],gear.glove||"#ad723e");return m;}
 return {beat,robot,human};
})(Geometry3D);
const RingVisuals=(()=>{
 const G=Geometry3D,M=RingModels,reduce=matchMedia("(prefers-reduced-motion: reduce)");
 let canvas,ctx,raf=0,active=false,enabled=true,data,entry,born=0,duration=1800,last=-1000;
 function init(c){canvas=c;try{ctx=c.getContext("2d");}catch{}enabled=!!ctx;return enabled;}
 function stop(){active=false;if(raf)cancelAnimationFrame(raf);raf=0;}
 function wake(){if(active&&enabled&&!document.hidden&&!raf)raf=requestAnimationFrame(frame);}
 function setEnabled(v){enabled=!!v&&!!ctx;if(!enabled)stop();return enabled;}
 function show(d,e=null,ms=1800,start=performance.now()){data=d;entry=e;duration=ms;born=start;last=-1000;active=true;wake();}
 function poly(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.55;ctx.stroke();}}
 function line(a,b,c,w){ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.strokeStyle=c;ctx.lineWidth=w;ctx.stroke();}
 function draw(now){const rect=canvas.getBoundingClientRect(),w=rect.width,h=rect.height;if(w<2||h<2)return;const d=Math.min(devicePixelRatio||1,1.5);if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);}ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);
 const t=reduce.matches?1:Math.min(1,(now-born)/duration),b=M.beat(entry,t),accent=data.accent;
 const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,"#0b1425");bg.addColorStop(.55,"#2b415a");bg.addColorStop(1,"#14273c");ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 for(const x of [.13,.87]){const g=ctx.createRadialGradient(w*x,h*.05,0,w*x,h*.05,w*.48);g.addColorStop(0,accent+"88");g.addColorStop(1,"#101b2c00");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
 for(let i=0;i<42;i++){ctx.fillStyle=i%7===0?accent:"#56728a";ctx.globalAlpha=.20+(i%4)*.07;ctx.fillRect((i*53%997)/997*w,h*(.19+(i%5)*.055),2+(i%3),2);}ctx.globalAlpha=1;
 poly([[w*.12,h*.64],[w*.88,h*.64],[w*.99,h*.94],[w*.01,h*.94]],"#29465c","#7894aa");poly([[w*.21,h*.68],[w*.79,h*.68],[w*.87,h*.90],[w*.13,h*.90]],"#35546b","#90a9bc");for(const y of [.34,.45,.56])line([w*.04,h*y],[w*.96,h*y],"#728ca966",3);for(const x of [.045,.955])line([w*x,h*.22],[w*x,h*.88],"#8097ab",7);
 const scale=Math.min(w*.60,h*.86),cam={x:w/2,y:h*.84,focal:scale*2.4,distance:8,height:0},meshes=[],side=entry?.hit.side??data.turn,strikes=[side===0?b.attack:b.counter,side===1?b.attack:b.counter],impacts=[side===0?b.recoil:b.impact,side===1?b.recoil:b.impact];
 for(let i=0;i<2;i++){const q=data.fighters[i],ko=entry&&t>.72&&q.hp===0?Math.min(1,(t-.72)/.28):0,pose={strike:strikes[i],tilt:(i===0?1:-1)*(impacts[i]*.13+ko*.85),wear:q.wear.reduce((a,v)=>a+v,0),guard:q.guard!==null,core:q.broken.length>=2,overdrive:data.solo&&i===1&&data.bossIndex===4&&q.hp<=q.max/2},pos=[(i===0?-1:1)*(1.76-strikes[i]*.46),-ko*.35,0];ctx.fillStyle="#08111f88";ctx.beginPath();ctx.ellipse(w/2+pos[0]*cam.focal/8,h*.84,w*.11,h*.035,0,0,Math.PI*2);ctx.fill();meshes.push(...(data.solo&&i===1?M.robot(data.bossIndex,pos,.65,pose):M.human(pos,i===0?-.65:.65,data.gear[i],pose)));}
 for(const face of G.facesFor(meshes,cam))poly(face.points,face.fill,"#14233655");
 for(let i=0;i<2;i++){const q=data.fighters[i],x=w/2+(i===0?-1:1)*1.55*cam.focal/8;if(q.shield){ctx.strokeStyle="#83e7ff";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,h*.49,w*.16,h*.32,0,0,Math.PI*2);ctx.stroke();}if(impacts[i]>0){for(let j=0;j<10;j++){const a=j*Math.PI/5,r=8+impacts[i]*w*.10;line([x+Math.cos(a)*r*.55,h*.44+Math.sin(a)*r*.55],[x+Math.cos(a)*r,h*.44+Math.sin(a)*r],j%2?"#ffdb82":"#fff6cb",2);}}}
 if(entry){const phase=b.stage==="impact"?entry.hit:b.stage==="recoil"?entry.counter:null;if(phase){ctx.font="900 "+Math.max(16,Math.min(25,w*.045))+"px system-ui";ctx.textAlign="center";ctx.fillStyle="#f8e9ae";ctx.fillText((b.stage==="recoil"?"COUNTER • ":"ATTACK • ")+(phase.amount?"−"+phase.amount+" HP":phase.blocked?"BLOCKED":"MISS"),w/2,h*.13);}}
 }
 function frame(now){raf=0;if(!active||!enabled||document.hidden)return;try{if(now-last>=31||reduce.matches||!entry||now-born>=duration){last=now;draw(now);}}catch{enabled=false;stop();canvas.hidden=true;return;}if(!reduce.matches&&entry&&now-born<duration)wake();}
 document.addEventListener("visibilitychange",()=>{if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}else wake();});window.addEventListener("resize",wake);if(reduce.addEventListener)reduce.addEventListener("change",wake);
 return {init,show,stop,setEnabled,get enabled(){return enabled;}};
})();