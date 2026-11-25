"use strict";
/* Original layered vector avatar; attributes are generated from validated local gear. */
const Avatar=(()=>{
const ns="http://www.w3.org/2000/svg",node=(tag,attrs)=>{const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));return n;};
function draw(player,container){
 const p=Clubhouse.sanitize(player),gear=Object.fromEntries(Clubhouse.slots.map(s=>[s,Clubhouse.items.find(i=>i.id===p.gear[s])])),skin=p.skin;
 const svg=node("svg",{viewBox:"0 0 240 310",role:"img","aria-label":p.name+" baseball avatar"});
 const add=(tag,a)=>svg.appendChild(node(tag,a)),path=(d,fill,stroke="#182436",sw=2)=>add("path",{d,fill,stroke,"stroke-width":sw,"stroke-linejoin":"round","stroke-linecap":"round"});
 const rect=(x,y,width,height,fill,rx=4)=>add("rect",{x,y,width,height,rx,fill,stroke:"#182436","stroke-width":2});
 const ellipse=(cx,cy,rx,ry,fill)=>add("ellipse",{cx,cy,rx,ry,fill});
 const line=(x1,y1,x2,y2,stroke,width)=>add("line",{x1,y1,x2,y2,stroke,"stroke-width":width,"stroke-linecap":"round"});
 ellipse(120,286,77,11,"#101c2c");
 path("M83 193 L115 193 L113 268 L81 268 L77 228 Z","#e3e6ed");path("M125 193 L157 193 L163 228 L159 268 L127 268 Z","#e3e6ed");
 for(const x of [88,148])line(x,209,x,262,"#9eacbd",2);
 path("M80 260 L112 260 L114 277 Q111 287 63 284 L62 277 Z",gear.cleats.color);path("M128 260 L160 260 L178 277 L177 284 Q129 287 126 277 Z",gear.cleats.color);
 for(const x of [73,88,100,138,151,165])line(x,277,x+6,277,"#eaf2ff",2);
 path("M78 114 Q61 115 48 147 L45 186 Q49 200 62 192 L70 154 L88 137 Z",skin);path("M162 114 Q179 115 192 147 L195 186 Q191 200 178 192 L170 154 L152 137 Z",skin);
 rect(45,170,22,15,gear.tape.color,3);rect(174,170,22,15,gear.tape.color,3);
 path("M90 104 L150 104 L175 124 L164 157 L154 151 L159 199 Q120 211 81 199 L86 151 L76 157 L65 124 Z",gear.jersey.color);
 const trim=gear.jersey.id==="purple-jersey"?"#fdd023":"#243c65";path("M93 104 L120 124 L147 104 L143 118 L120 138 L97 118 Z",trim);
 line(120,139,120,194,trim,2);line(74,145,86,149,trim,4);line(154,149,166,145,trim,4);
 const number=node("text",{x:141,y:176,"text-anchor":"middle","font-size":25,"font-weight":"900",fill:gear.jersey.id==="forge-jersey"||gear.jersey.id==="purple-jersey"?"#fff4bf":"#24334b",stroke:"none","font-family":"system-ui"});number.textContent=p.number;svg.append(number);
 rect(83,194,74,10,"#2a3548",2);
 rect(107,92,26,23,skin,7);
 if(gear.necklace.color!=="none"){path("M91 111 Q120 157 149 111","none",gear.necklace.color,5);if(gear.necklace.id==="comeback-chain"||gear.necklace.id==="ice-chain")path("M120 139 l8 9 -8 9 -8 -9 Z",gear.necklace.color,"#527187",1);if(gear.necklace.id==="gold-chain"){for(let i=0;i<7;i++){const x=97+i*7,y=118+Math.sin(i*Math.PI/6)*15;ellipse(x,y,3,2,"#ffeb9a");}}}
 ellipse(87,67,9,13,skin);ellipse(153,67,9,13,skin);
 path("M87 47 Q89 24 120 24 Q151 24 153 47 L151 83 Q146 102 120 107 Q94 102 89 83 Z",skin);
 path("M87 51 Q80 24 109 19 Q142 14 154 43 L151 52 Q133 40 110 47 Z","#382a28");
 ellipse(106,65,3,4,"#263141");ellipse(134,65,3,4,"#263141");path("M117 69 L114 77 L121 78","none","#8d6045",1.4);path("M108 88 Q120 96 132 88","none","#563b32",2);
 if(gear.glasses.color!=="none"){path("M90 56 L116 57 L116 72 Q99 79 92 68 Z",gear.glasses.color);path("M124 57 L150 56 L148 68 Q141 79 124 72 Z",gear.glasses.color);line(116,61,124,61,"#273347",3);line(96,60,108,63,"#ffffff",2);line(130,60,142,63,"#ffffff",2);}
 path("M83 47 Q81 10 120 10 Q159 10 157 47 Q120 42 83 47 Z",gear.hat.color);
 path("M85 45 Q125 36 161 44 Q181 52 154 57 Q125 50 85 52 Z",gear.hat.color);
 line(120,13,120,38,"#f5d780",1.5);path("M112 23 L128 23 L128 33 L112 33 Z","#f2cd66","none",0);
 path("M177 173 Q198 157 206 174 L208 192 Q199 209 179 205 L171 191 Z",gear.glove.color);for(let i=0;i<3;i++)line(185+i*5,177,187+i*5,191,"#e1bd83",1.5);line(177,190,199,197,"#523b2c",2);
 container.replaceChildren(svg);
}
return {draw};
})();