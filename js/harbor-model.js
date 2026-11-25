import {T,material,part} from './graphics-platform.js';
export function harbor(){const g=new T.Group(),deck=material('#6f8190',0,.85),sea=material('#247e9f',.18,.32),steel=material('#334963',.35,.55),rope=material('#e2d6b8',0,.8),mat=material('#426c83',0,.65),paint=['#b55c48','#366d87','#d1a557','#507f70'].map(c=>material(c,.25,.65));const b=(x,y,z,m,w,h,d)=>part(g,new T.BoxGeometry(w,h,d),m,x,y,z);
 b(0,-.20,0,sea,20,.18,18);b(0,-.08,0,deck,9,.2,8);b(0,.10,0,steel,5,.32,5);b(0,.29,0,mat,4.8,.08,4.8);
 for(const x of [-2.35,2.35])for(const z of [-2.35,2.35]){b(x,.94,z,steel,.16,1.4,.16);b(x,1.48,z,paint[0],.28,.26,.28);}
 for(const h of [.65,.98,1.31]){for(const z of [-2.35,2.35])b(0,h,z,rope,4.7,.038,.038);for(const x of [-2.35,2.35])b(x,h,0,rope,.038,.038,4.7);}
 for(const [i,x] of [-3.6,-1.2,1.2,3.6].entries()){const z=-3.1,m=paint[i];b(x,.48,z,m,2.08,1.1,.95);for(let j=0;j<8;j++)b(x-.9+j*.25,.48,z+.485,steel,.045,.92,.045);if(i%2===0)b(x,1.57,z,paint[(i+1)%4],2.08,1.08,.95);}
 for(const x of [-3.9,3.9]){b(x,1.3,2.8,steel,.10,2.6,.10);b(x,2.57,2.8,rope,.40,.14,.24);}return g;}