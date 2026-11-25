"use strict";
/* Original layered vector avatar; attributes are generated from validated local gear. */
const Avatar=(()=>{
const ns="http://www.w3.org/2000/svg",node=(tag,attrs)=>{const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));return n;};
function draw(player,container,previewId=null,hideGlove=false){
 const p=Clubhouse.sanitize(player),gear=Object.fromEntries(Clubhouse.slots.map(s=>[s,Clubhouse.items.find(i=>i.id===p.gear[s])])),skin=p.skin;
 const preview=Clubhouse.items.find(i=>i.id===previewId);if(preview)gear[preview.slot]=preview;gear.hair={...gear.hair,id:preview?.slot==="hair"?preview.id:p.hairStyle,color:p.hairColor};
 const svg=node("svg",{viewBox:"0 0 240 310",role:"img","aria-label":p.name+" baseball avatar"});
 const add=(tag,a)=>svg.appendChild(node(tag,a)),path=(d,fill,stroke="#182436",sw=2)=>add("path",{d,fill,stroke,"stroke-width":sw,"stroke-linejoin":"round","stroke-linecap":"round"});
 const rect=(x,y,width,height,fill,rx=4)=>add("rect",{x,y,width,height,rx,fill,stroke:"#182436","stroke-width":2});
 const ellipse=(cx,cy,rx,ry,fill)=>add("ellipse",{cx,cy,rx,ry,fill});
 const line=(x1,y1,x2,y2,stroke,width)=>add("line",{x1,y1,x2,y2,stroke,"stroke-width":width,"stroke-linecap":"round"});
 ellipse(120,286,77,11,"#101c2c");
 path("M83 193 L115 193 L113 268 L81 268 L77 228 Z",gear.pants.color);path("M125 193 L157 193 L163 228 L159 268 L127 268 Z",gear.pants.color);
 for(const x of [88,148])line(x,209,x,248,"#9eacbd",2);
 if(gear.pants.id==="stripe-pants")for(const x of [92,101,137,146])line(x,209,x,249,"#344c70",1.3);
 rect(81,245,32,19,gear.socks.color,2);rect(127,245,32,19,gear.socks.color,2);if(gear.socks.id.includes("stirrups"))for(const x of [82,128]){line(x+2,249,x+28,249,"#f5d164",3);line(x+2,255,x+28,255,"#f5d164",2);}
 path("M80 260 L112 260 L114 277 Q111 287 63 284 L62 277 Z",gear.cleats.color);path("M128 260 L160 260 L178 277 L177 284 Q129 287 126 277 Z",gear.cleats.color);
 for(const x of [73,88,100,138,151,165])line(x,277,x+6,277,"#eaf2ff",2);
 path("M78 114 Q61 115 48 147 L45 186 Q49 200 62 192 L70 154 L88 137 Z",skin);path("M162 114 Q179 115 192 147 L195 186 Q191 200 178 192 L170 154 L152 137 Z",skin);
 if(gear.sleeve.color!=="none"){path("M70 137 L77 146 L68 169 L47 177 L50 151 Z",gear.sleeve.color);if(gear.sleeve.id==="purple-sleeve"||gear.sleeve.id==="forge-sleeve")path("M60 145 L68 151 L58 160 L63 162 L53 174 L55 161 L50 159 Z","#f9da83","none",0);}
 rect(45,170,22,15,gear.tape.color,3);rect(174,170,22,15,gear.tape.color,3);
 path("M90 104 L150 104 L175 124 L164 157 L154 151 L159 199 Q120 211 81 199 L86 151 L76 157 L65 124 Z",gear.jersey.color);
 if(gear.jersey.id==="jungle-jersey"){path("M96 139 L113 146 L111 157 L94 153 Z","#3f593c","none",0);path("M130 178 L150 167 L154 188 L139 194 Z","#a4a66d","none",0);}
 const trim=gear.jersey.id==="purple-jersey"?"#fdd023":"#243c65";path("M93 104 L120 124 L147 104 L143 118 L120 138 L97 118 Z",trim);
 line(120,139,120,194,trim,2);line(74,145,86,149,trim,4);line(154,149,166,145,trim,4);
 const number=node("text",{x:141,y:176,"text-anchor":"middle","font-size":25,"font-weight":"900",fill:gear.jersey.id==="forge-jersey"||gear.jersey.id==="purple-jersey"?"#fff4bf":"#24334b",stroke:"none","font-family":"system-ui"});number.textContent=p.number;svg.append(number);
 rect(83,194,74,10,"#2a3548",2);
 rect(107,92,26,23,skin,7);
 if(gear.necklace.color!=="none"){path("M91 111 Q120 157 149 111","none",gear.necklace.color,5);if(["comeback-chain","ice-chain","relic-chain","flame-chain","robot-omega"].includes(gear.necklace.id))path("M120 139 l8 9 -8 9 -8 -9 Z",gear.necklace.color,"#527187",1);if(gear.necklace.id==="gold-chain"){for(let i=0;i<7;i++){const x=97+i*7,y=118+Math.sin(i*Math.PI/6)*15;ellipse(x,y,3,2,"#ffeb9a");}}}
 ellipse(87,67,9,13,skin);ellipse(153,67,9,13,skin);
 path("M87 47 Q89 24 120 24 Q151 24 153 47 L151 83 Q146 102 120 107 Q94 102 89 83 Z",skin);
 path("M87 51 Q80 24 109 19 Q142 14 154 43 L151 52 Q133 40 110 47 Z",gear.hair.color);
 if(gear.hair.id==="curls-hair")for(const [x,y] of [[86,48],[84,55],[154,48],[156,55]])ellipse(x,y,6,6,gear.hair.color);
 if(gear.hair.id==="ponytail"){ellipse(155,78,10,26,gear.hair.color);}if(gear.hair.id==="bun"){ellipse(145,32,12,12,gear.hair.color);}
 if(["long-hair","blond-hair"].includes(gear.hair.id)){path("M87 47 Q75 65 78 93 L91 106 L90 74 Z",gear.hair.color);path("M153 47 Q165 65 162 93 L149 106 L150 74 Z",gear.hair.color);}
 ellipse(106,65,3,4,"#263141");ellipse(134,65,3,4,"#263141");path("M117 69 L114 77 L121 78","none","#8d6045",1.4);path("M108 88 Q120 96 132 88","none","#563b32",2);
 if(gear.eye.color!=="none"){line(96,77,111,79,gear.eye.color,4);line(129,79,144,77,gear.eye.color,4);if(gear.eye.id!=="classic-eye"){line(99,83,110,84,gear.eye.color,2);line(130,84,141,83,gear.eye.color,2);}if(gear.eye.id==="war-eye"){line(103,78,103,87,gear.eye.color,2);line(137,78,137,87,gear.eye.color,2);}}
 if(gear.glasses.color!=="none"){path("M90 56 L116 57 L116 72 Q99 79 92 68 Z",gear.glasses.color);path("M124 57 L150 56 L148 68 Q141 79 124 72 Z",gear.glasses.color);line(116,61,124,61,"#273347",3);line(96,60,108,63,"#ffffff",2);line(130,60,142,63,"#ffffff",2);}
 path("M83 47 Q81 10 120 10 Q159 10 157 47 Q120 42 83 47 Z",gear.hat.color);
 path("M85 45 Q125 36 161 44 Q181 52 154 57 Q125 50 85 52 Z",gear.hat.color);
 line(120,13,120,38,"#f5d780",1.5);path("M112 23 L128 23 L128 33 L112 33 Z","#f2cd66","none",0);
 if(!hideGlove){path("M177 173 Q198 157 206 174 L208 192 Q199 209 179 205 L171 191 Z",gear.glove.color);for(let i=0;i<3;i++)line(185+i*5,177,187+i*5,191,"#e1bd83",1.5);line(177,190,199,197,"#523b2c",2);}
 container.replaceChildren(svg);
}
return {draw};
})();