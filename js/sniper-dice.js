/* Original vector dice faces; decorative only, labels remain accessible. */
const SniperDice=(()=>{
 const ns="http://www.w3.org/2000/svg";
 function node(tag,attrs={}){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n;}
 const palette={ink:"#26382e",red:"#a33b36",gold:"#c19235",green:"#466a4b"};
 function draw(host,kind,value){const s=node("svg",{viewBox:"0 0 100 100","aria-hidden":"true"}),add=(t,a)=>s.append(node(t,a)),line=(d,stroke=palette.ink,sw=4)=>add("path",{d,fill:"none",stroke,"stroke-width":sw,"stroke-linecap":"round","stroke-linejoin":"round"});
 add("path",{d:"M8 19L19 8H82L93 19V82L82 93H19L8 82Z",fill:"#9c8e63",stroke:"#766b48","stroke-width":2});add("rect",{x:8,y:8,width:76,height:76,rx:12,fill:"#f9efd2",stroke:"#fff9e6","stroke-width":2});line("M87 24V77L78 87","#d5c699",2);
 if(kind==="ball"&&value){const r=value.size==="Small"?20:value.size==="Large"?31:25;add("circle",{cx:46,cy:46,r,fill:"#fffdfa",stroke:"#817e70","stroke-width":1.5});for(const sign of [-1,1]){const x=46+sign*r*.43;line("M"+x+" "+(46-r*.87)+" Q"+(46-sign*r*.22)+" 46 "+x+" "+(46+r*.87),palette.red,2);for(let k=-2;k<=2;k++){const y=46+k*r*.27;line("M"+(x-sign*4)+" "+(y-2)+" l"+(sign*5)+" 4",palette.red,1.6);}}}
 else if(kind==="pitch"&&value){const curves={Fastball:"M18 69L69 22",Changeup:"M18 62Q47 49 69 32",Curveball:"M20 20Q80 14 70 49Q63 67 39 73",Slider:"M18 31Q54 33 73 65",Cutter:"M18 62L53 31L75 43",Sinker:"M18 22Q57 23 73 70"};line(curves[value]||curves.Fastball,palette.green,5);const ends={Fastball:[69,22],Changeup:[69,32],Curveball:[39,73],Slider:[73,65],Cutter:[75,43],Sinker:[73,70]},[x,y]=ends[value]||ends.Fastball;add("circle",{cx:x,cy:y,r:8,fill:"#fffdfa",stroke:palette.red,"stroke-width":2});if(value==="Fastball"){line("M19 48L39 29",palette.gold,2);line("M37 71L57 52",palette.gold,2);}else if(value==="Changeup"){line("M20 75H39",palette.gold,2);line("M23 82H35",palette.gold,2);}}
 else if(kind==="location"&&Number.isInteger(value)){for(let i=0;i<9;i++){const x=17+i%3*20,y=17+Math.floor(i/3)*20;add("rect",{x,y,width:19,height:19,rx:2,fill:i===value?"#dfb343":"#c8d2b9",stroke:"#536e4c","stroke-width":1});if(i===value){add("circle",{cx:x+9.5,cy:y+9.5,r:6,fill:"none",stroke:palette.ink,"stroke-width":1.6});line("M"+(x+9.5)+" "+(y+2)+"v15M"+(x+2)+" "+(y+9.5)+"h15",palette.ink,1.4);}}}
 else{for(const [x,y] of [[25,25],[67,25],[46,46],[25,67],[67,67]])add("circle",{cx:x,cy:y,r:5,fill:palette.ink});}
 host.replaceChildren(s);
 }
 function faces(call){draw(document.getElementById("ballFace"),"ball",call?.ball);draw(document.getElementById("pitchFace"),"pitch",call?.pitch);draw(document.getElementById("locationFace"),"location",call?.target);}
 return {faces};
})();
