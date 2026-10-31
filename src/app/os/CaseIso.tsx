import type { ReactNode } from 'react';

/** Fixed axonometric camera shared by all cases. Interpretive model — not built CAD. */
type V = [number,number,number];
const iso = ([x,y,z]: V) => [240 + x*.98-z*.68, 219 + x*.32+z*.32-y*.96] as const;
const line = (pts: V[], key: string, cls = '') => <path key={key} className={cls} d={pts.map((p,i)=>{const [x,y]=iso(p);return (i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}).join(' ')} fill="none"/>;
const polygon = (pts: V[], key:string, cls='') => <path key={key} className={cls} d={pts.map((p,i)=>{const [x,y]=iso(p);return (i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}).join(' ')+' Z'}/>;
const frame = (z:number,w:number,h:number,key:string,shape:'rect'|'tri'|'arch'='rect') => {
  if(shape==='tri')return line([[-w/2,0,z],[0,h,z],[w/2,0,z],[-w/2,0,z]],key);
  if(shape==='arch')return line(Array.from({length:17},(_,i)=>{const a=Math.PI-i*Math.PI/16;return [Math.cos(a)*w/2,Math.sin(a)*h,z] as V}),key);
  return line([[-w/2,0,z],[-w/2,h,z],[w/2,h,z],[w/2,0,z],[-w/2,0,z]],key);
};
const floor = <>{polygon([[-145,0,-100],[145,0,-100],[145,0,100],[-145,0,100]],'ground','iso-ground')}{line([[-145,0,0],[145,0,0]],'datum','iso-guide')}</>;
const enclosure = () => <>
  {polygon([[-110,0,80],[-110,145,80],[110,145,80],[110,0,80]],'back','iso-face')}
  {polygon([[-110,0,-75],[-110,145,-75],[-110,145,80],[-110,0,80]],'left','iso-face')}
  {line([[-110,0,-75],[-110,145,-75],[110,145,-75],[110,0,-75]],'front','iso-soft')}
  {line([[-110,0,80],[110,0,80],[110,145,80],[-110,145,80],[-110,0,80]],'backEdges')}
  {line([[-110,145,-75],[-110,145,80],[110,145,80]],'topEdges')}
</>;
function scene(id:string):ReactNode {
 if(id==='03')return <>{enclosure()}{Array.from({length:6},(_,i)=>polygon([[i%3*58-92,25+Math.floor(i/3)*52,80],[i%3*58-92,65+Math.floor(i/3)*52,80],[i%3*58-50,65+Math.floor(i/3)*52,76-(i%2)*22],[i%3*58-50,25+Math.floor(i/3)*52,76-(i%2)*22]],'panel'+i,'iso-panel'))}</>;
 if(id==='04')return <>{Array.from({length:5},(_,i)=>frame(75-i*30,240-i*26,170-i*10,'frame'+i))}{line([[-120,0,75],[0,0,-75],[120,0,75]],'focal','iso-guide')}</>;
 if(id==='05')return <>{enclosure()}{polygon([[-110,145,-75],[110,145,-75],[110,145,80],[-110,145,80]],'ceiling','iso-face')}{Array.from({length:7},(_,i)=>line([[i*30-90,0,75],[i*30-90,145,75]],'bar'+i))}{Array.from({length:4},(_,i)=>line([[-110,145,-75+i*40],[110,145,-75+i*40]],'grid'+i,'iso-soft'))}</>;
 if(id==='06')return <>{frame(75,115,100,'a','arch')}{frame(-75,115,100,'b','arch')}{Array.from({length:3},(_,j)=>line(Array.from({length:25},(_,i)=>{const t=i/24;return [-100+200*t,72+Math.sin(t*Math.PI)*(92+j*15),65-130*t-j*12] as V}), 'wave'+j))}</>;
 if(id==='07')return <>{Array.from({length:5},(_,i)=>frame(82-i*36,225-i*25,148-i*13,'arch'+i,'arch'))}{line([[0,0,95],[0,0,-95]],'axis','iso-guide')}</>;
 if(id==='08')return <>{frame(82,200,135,'portal','arch')}{line(Array.from({length:40},(_,i)=>{const t=i/39;return [-125+250*t,150+16*Math.sin(t*Math.PI*2),15-68*Math.sin(t*Math.PI)] as V}),'spine')}{Array.from({length:14},(_,i)=>{const t=i/13;const x=-125+250*t,y=150+16*Math.sin(t*Math.PI*2),z=15-68*Math.sin(t*Math.PI);return line([[x-9,y-19,z-4],[x+9,y-19,z+4],[x+12,y+19,z+5],[x-12,y+19,z-5],[x-9,y-19,z-4]],'rib'+i)})}</>;
 if(id==='09')return <>{Array.from({length:6},(_,i)=>frame(90-i*32,246-i*20,170-i*10,'triangle'+i,'tri'))}</>;
 if(id==='10')return <>{polygon([[-112,0,-78],[-112,145,-78],[-112,145,75],[-112,0,75]],'wall','iso-face')}{polygon([[-112,0,75],[112,0,75],[112,0,-78],[-112,0,-78]],'slab','iso-face')}{Array.from({length:4},(_,i)=>{const w=211-i*39, y=143-i*25;return line([[-w/2,0,75],[-w/2,y,75],[-w/2,y,-80],[w/2,y,-80],[w/2,0,-80]],'fold'+i)})}</>;
 if(id==='11')return <>{enclosure()}{line([[-110,145,45],[-83,107,43],[-104,81,45],[-75,38,45],[-110,0,45]],'fractureA','iso-break')}{line([[110,145,55],[74,106,55],[93,75,55],[64,35,55],[110,0,55]],'fractureB','iso-break')}{polygon([[22,0,-35],[65,35,-35],[92,12,-22],[70,0,8]],'rubble','iso-panel')}{polygon([[-70,0,-52],[-30,35,-44],[-10,0,-15]],'rubble2','iso-panel')}</>;
 if(id==='12'){const bar=(x1:number,x2:number,z1:number,z2:number,y1:number,y2:number,key:string)=> <g key={key}>{polygon([[x1,y1,z1],[x2,y1,z1],[x2,y2,z1],[x1,y2,z1]],key+'face','iso-face')}{polygon([[x2,y1,z1],[x2,y1,z2],[x2,y2,z2],[x2,y2,z1]],key+'side','iso-panel')}{line([[x1,y1,z1],[x2,y1,z1],[x2,y1,z2],[x2,y2,z2],[x2,y2,z1],[x1,y2,z1],[x1,y1,z1]],key+'outline')}</g>;return <>{bar(-125,-90,-65,75,70,190,'left')}{bar(90,125,-65,75,70,190,'right')}{bar(-125,125,-65,-30,155,190,'top')}{Array.from({length:4},(_,i)=>line([[i*55-82,190,-45],[i*55-82,223,-45]],'rig'+i,'iso-soft'))}</>;}
 return <>{enclosure()}</>;
}
export function CaseIso({id,large=false}:{id:string;large?:boolean}) {
 return <div className={'case-iso'+(large?' case-iso-large':'')}>
  <svg viewBox="0 0 480 302" role="img" aria-label={'Consistent axonometric formal study of case '+id+' (not verified as-built geometry)'}>
   <g className="iso-grid">{floor}</g>
   <g className="iso-massing">{scene(id)}</g>
   <path d="M22 22H43M22 22V43M458 22H437M458 22V43" className="iso-corners"/>
  </svg>
  <div className="iso-caption"><span>CASE {id} / AXONOMETRIC FORM STUDY</span><span>INTERPRETIVE / NOT CAD</span></div>
 </div>;
}
