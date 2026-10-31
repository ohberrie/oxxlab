import { useMemo } from 'react';

// 3D solids under one orthographic axonometric camera.
// Editorial reconstruction, not original imported stage geometry.
type V=[number,number,number];
type Mat='ground'|'wall'|'frame'|'mass'|'panel'|'steel';
type Mesh={verts:V[]; faces:number[][];mat:Mat};
type Scene=Mesh[];
const A=(a:V,b:V):V=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
const D=(a:V,b:V):V=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
const M=(a:V,k:number):V=>[a[0]*k,a[1]*k,a[2]*k];
const X=(a:V,b:V):V=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const dot=(a:V,b:V)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const norm=(a:V):V=>M(a,1/Math.max(.00001,Math.hypot(...a)));
const mid=(a:V[]):V=>M(a.reduce((p,c)=>A(p,c),[0,0,0] as V),1/a.length);
const faces=[[0,3,2,1],[4,5,6,7],[0,4,7,3],[1,2,6,5],[0,1,5,4],[3,7,6,2]];
const unit:V[]=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
function box(s:Scene,c:V,sz:V,mat:Mat='frame',ry=0,rz=0) {
 const verts=unit.map(([x,y,z]):V=>{
  const px=x*sz[0]/2,py=y*sz[1]/2,pz=z*sz[2]/2;
  const xx=px*Math.cos(ry)+pz*Math.sin(ry),zz=-px*Math.sin(ry)+pz*Math.cos(ry);
  return [c[0]+xx*Math.cos(rz)-py*Math.sin(rz),c[1]+xx*Math.sin(rz)+py*Math.cos(rz),c[2]+zz];
 });
 s.push({verts,faces,mat});
}
function beam(s:Scene,a:V,b:V,w:number,mat:Mat='frame',h=w){
 const ax=norm(D(b,a));
 let n=norm(X(ax,[0,1,0]));
 if(Math.hypot(...X(ax,[0,1,0]))<.03)n=norm(X(ax,[0,0,1]));
 const t=norm(X(ax,n));
 const corners=(p:V):V[]=>[
  A(p,A(M(n,-w/2),M(t,-h/2))),A(p,A(M(n,w/2),M(t,-h/2))),
  A(p,A(M(n,w/2),M(t,h/2))),A(p,A(M(n,-w/2),M(t,h/2)))
 ];
 s.push({verts:[...corners(a),...corners(b)],faces:[[0,3,2,1],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]],mat});
}
function chain(s:Scene,p:V[],w:number,mat:Mat='frame'){for(let i=1;i<p.length;i++)beam(s,p[i-1],p[i],w,mat);}
function frame(s:Scene,z:number,w:number,h:number,t=7){chain(s,[[-w/2,0,z],[-w/2,h,z],[w/2,h,z],[w/2,0,z]],t);}
function triangle(s:Scene,z:number,w:number,h:number,t=8,r=0){
 const rotate=(x:number,y:number):V=>[x*Math.cos(r)-(y-h*.47)*Math.sin(r),(y-h*.47)*Math.cos(r)+x*Math.sin(r)+h*.47,z];
 const a=rotate(-w/2,5),b=rotate(0,h),c=rotate(w/2,5);
 chain(s,[a,b,c,a],t);
}
function arch(s:Scene,z:number,w:number,h:number,t=6,off=0,mat:Mat='frame'){
 const r=w/2,sp=h-r*.72,p:V[]=[[-r+off,0,z],[-r+off,sp,z]];
 for(let i=0;i<=20;i++){const a=Math.PI-i*Math.PI/20;p.push([r*Math.cos(a)+off,sp+r*.72*Math.sin(a),z]);}
 p.push([r+off,0,z]);chain(s,p,t,mat);
}
function ground(s:Scene){box(s,[0,-5,0],[244,8,185],'ground');}
function room(s:Scene){
 ground(s);
 box(s,[0,74,86],[226,148,7],'wall');
 box(s,[-116,74,5],[7,148,168],'wall');
}
function model(id:string):Scene{
 const s:Scene=[];
 if(id==='03'){
  room(s);
  for(let i=0;i<9;i++){const col=i%3,row=Math.floor(i/3);
   box(s,[-78+col*77,23+row*39,72-(i%3)*11],[50+(i%2)*10,30,8+(i%3)*15],'panel',i%4===0?.07:0);}
  box(s,[12,34,22],[36,65,46],'mass');box(s,[-54,20,-12],[36,38,31],'panel',.25);
  box(s,[77,10,-26],[29,25,31],'mass',-.28);
 }else if(id==='04'){
  ground(s);
  for(let i=0;i<5;i++)frame(s,78-i*39,227-i*31,154-i*15,7);
  box(s,[-82,109,-13],[31,61,5],'panel',.18);box(s,[76,58,-56],[28,38,5],'panel',-.12);
 }else if(id==='05'){
  room(s);box(s,[0,151,2],[236,10,175],'mass');
  for(let i=0;i<7;i++)box(s,[-97+i*32,69,76],[4,129,5],'steel');
  for(let i=0;i<4;i++)box(s,[0,35+i*34,75],[225,3,5],'steel');
  for(let i=0;i<5;i++)box(s,[-80+i*36,144,2],[3,6,174],'steel');
  box(s,[63,43,30],[35,15,27],'panel');
 }else if(id==='06'){
  ground(s);arch(s,70,160,134,6,-22);arch(s,-65,150,132,6,27);
  for(let j=0;j<3;j++){const p:V[]=Array.from({length:28},(_,i):V=>{const t=i/27;return [-115+t*230,95+Math.sin(t*Math.PI*2+j*.25)*24+j*9,50-t*95-j*8];});chain(s,p,3+j*.5,j===1?'steel':'frame');}
  box(s,[-83,23,44],[35,46,34],'mass');box(s,[85,28,-40],[37,55,31],'mass');
 }else if(id==='07'){
  ground(s);for(let i=0;i<5;i++)arch(s,82-i*38,200-i*15,158-i*10,6,Math.sin(i*.6)*9);
 }else if(id==='08'){
  ground(s);arch(s,78,176,156,12,0,'mass');
  const p:V[]=Array.from({length:19},(_,i):V=>{const t=i/18;return [-117+234*t,165+18*Math.sin(t*Math.PI*1.45),30-62*Math.sin(t*Math.PI*1.2)];});
  chain(s,p,4,'steel');p.forEach((a,i)=>{if(i===0||i===18)return;const angle=i*.31,dist=19+4*Math.cos(i*.7);
   beam(s,[a[0]-dist*Math.cos(angle),a[1]-11,a[2]-dist*.52],[a[0]+dist*Math.cos(angle),a[1]+12,a[2]+dist*.52],7,'frame',9);});
 }else if(id==='09'){
  ground(s);for(let i=0;i<6;i++)triangle(s,83-i*33,216-i*20,161-i*10,7,i*.065);
 }else if(id==='10'){
  ground(s);box(s,[-115,79,3],[6,158,178],'wall');box(s,[0,0,-86],[226,6,8],'wall');
  for(let i=0;i<5;i++){const x=-100+i*38,y=157-i*17,z=72-i*20;
   chain(s,[[x,0,70],[x,y,70],[x,y,-83],[x+25,y,-83]],6);
   chain(s,[[x,0,70],[x+28,0,12],[x+28,0,-78]],3,'steel');}
 }else if(id==='11'){
  ground(s);box(s,[-76,104,80],[71,97,8],'wall',-.13,.06);
  box(s,[19,111,85],[94,77,8],'wall',.12,-.16);
  box(s,[-111,62,4],[8,113,74],'wall',.14,.19);
  box(s,[98,73,50],[8,113,65],'wall',-.21,-.24);
  box(s,[8,29,67],[97,64,9],'panel',-.15,.3);
  box(s,[-47,18,21],[60,25,44],'mass',.37,-.17);
  box(s,[64,11,-31],[58,20,42],'mass',-.43,.23);
  box(s,[13,9,-62],[68,12,23],'mass',.58);
 }else if(id==='12'){
  ground(s);box(s,[-105,141,0],[43,113,128],'mass');
  box(s,[105,141,0],[43,113,128],'mass');
  box(s,[0,192,0],[249,28,130],'mass');
  box(s,[0,176,0],[166,9,12],'steel');
  for(let i=0;i<5;i++)beam(s,[-90+i*45,206,-30],[-90+i*45,237,-30],3,'steel');
 }else ground(s);
 return s;
}
// True orthographic isometric basis, identical for every model.
const project=(p:V):[number,number]=>[(p[0]-p[2])*.70710678,(p[0]+p[2])*.40824829-p[1]*.81649658];
const eye=norm([1,1,1]),light=norm([-0.5,1.4,0.9]);
const colors:Record<Mat,number>={ground:246,wall:234,frame:211,mass:191,panel:221,steel:161};
type Poly={points:[number,number][];depth:number;fill:string;stroke:string};
function render3D(meshes:Scene):Poly[]{
 const result:Poly[]=[];
 meshes.forEach(m=>m.faces.forEach(ix=>{
  const pts=ix.map(i=>m.verts[i]),normal=norm(X(D(pts[1],pts[0]),D(pts[2],pts[0])));
  const lambert=Math.abs(dot(normal,light));
  const gray=Math.min(249,Math.max(126,colors[m.mat]+Math.round((lambert-.5)*25)));
  const fill='rgb('+gray+','+Math.min(255,gray+2)+','+Math.min(255,gray+4)+')';
  result.push({points:pts.map(project),depth:dot(mid(pts),eye),fill,stroke:m.mat==='ground'?'#dfdfdf':'#999fa5'});
 }));
 return result.sort((a,b)=>a.depth-b.depth);
}
export function CaseAxon({id}:{id:string}){
 const polys=useMemo(()=>render3D(model(id)),[id]);
 const all=polys.flatMap(p=>p.points);
 const left=Math.min(...all.map(p=>p[0])),right=Math.max(...all.map(p=>p[0]));
 const top=Math.min(...all.map(p=>p[1])),bottom=Math.max(...all.map(p=>p[1]));
 const scale=Math.min(422/Math.max(1,right-left),236/Math.max(1,bottom-top));
 const dx=240-(left+right)*.5*scale,dy=147-(top+bottom)*.5*scale;
 const transform='translate('+dx.toFixed(2)+' '+dy.toFixed(2)+') scale('+scale.toFixed(4)+')';
 return <div className="case-axon">
  <svg viewBox="0 0 480 300" role="img" aria-label={'Case '+id+' axonometric 3D solid study, not original stage geometry'}>
   <ellipse cx="241" cy="254" rx="154" ry="24" fill="#000" opacity=".025"/>
   <g transform={transform} strokeLinejoin="round">
    {polys.map((p,i)=><polygon key={i} points={p.points.map(q=>q[0].toFixed(2)+','+q[1].toFixed(2)).join(' ')}
     fill={p.fill} stroke={p.stroke} strokeWidth={.5/scale} strokeOpacity=".42"/>)}
   </g>
  </svg>
 </div>;
}
