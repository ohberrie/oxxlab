export type Point = [number,number,number];
export type Kind = 'Scale'|'Rotation'|'Axis'|'Fold';
export type Operator = {id:Kind; enabled:boolean; weight:number; region:'all'|'front'|'back'};
export type Composition = {preset:'09'|'10'; count:number; spacing:number; rotation:number; scale:number; fold:number; axis:number; operators:Operator[]};
export const preset = (id:'09'|'10'):Composition => ({preset:id,count:id==='09'?16:13,spacing:0.23,rotation:id==='09'?65:0,scale:id==='09'?0.48:0.82,fold:id==='09'?0:90,axis:id==='09'?0:28,operators:(id==='09'?['Scale','Rotation','Axis','Fold']:['Fold','Axis','Scale','Rotation']).map(id=>({id:id as Kind,enabled:true,weight:1,region:'all'}))});
const rad=(n:number)=>n*Math.PI/180;
export function generate(c:Composition):Point[][] {
 return Array.from({length:c.count},(_,i)=>{
  const t=i/(c.count-1); const w=3,h=2.4,b=.13;
  // One continuous rectangular ribbon, sampled at the hinge for physical folding.
  const ring:Point[]=[[-w,-h,0],[w,-h,0],[w,0,0],[w,h,0],[-w,h,0],[-w,0,0],[-w,-h,0],[-w+b,-h+b,0],[-w+b,0,0],[-w+b,h-b,0],[w-b,h-b,0],[w-b,0,0],[w-b,-h+b,0],[-w+b,-h+b,0],[-w,-h,0]];
  return ring.map(p=>{
   let [x,y,z]=p;
   for(const o of c.operators){
    if(!o.enabled || (o.region==='front'&&t>.5)||(o.region==='back'&&t<=.5))continue;
    const a=o.weight;
    if(o.id==='Scale'){const s=1+(c.scale-1)*t*a;x*=s;y*=s;z*=s;}
    if(o.id==='Rotation'){const r=rad(c.rotation*t*a);[x,y]=[x*Math.cos(r)-y*Math.sin(r),x*Math.sin(r)+y*Math.cos(r)];}
    if(o.id==='Fold'&&y<0){const r=rad(c.fold*a);[y,z]=[y*Math.cos(r)-z*Math.sin(r),y*Math.sin(r)+z*Math.cos(r)];}
    if(o.id==='Axis'){const r=rad(c.axis*t*a);[x,z]=[x*Math.cos(r)+z*Math.sin(r),-x*Math.sin(r)+z*Math.cos(r)];}
   }
   return [x,y,z-(i-(c.count-1)/2)*c.spacing] as Point;
  });
 });
}
export function project([x,y,z]:Point,yaw:number,pitch:number):Point {const a=rad(yaw),b=rad(pitch);const xx=x*Math.cos(a)+z*Math.sin(a),zz=-x*Math.sin(a)+z*Math.cos(a);return [xx,y*Math.cos(b)-zz*Math.sin(b),y*Math.sin(b)+zz*Math.cos(b)];}
