import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../src/app/os/layering.ts',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;
const {presetStudy,layeringModel,applyOperation}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const izna=presetStudy('09'),yeonjun=presetStudy('10');
assert.equal(izna.base.profile,'triangle');assert.equal(yeonjun.base.profile,'square');
assert.equal(layeringModel(izna).lines.length,izna.base.count*2);
assert.notDeepEqual(layeringModel(izna),layeringModel(yeonjun));
const base={...yeonjun,operators:[]};
assert.deepEqual(layeringModel({...yeonjun,operators:yeonjun.operators.map(o=>({...o,strength:0}))}),layeringModel(base));
const back={...yeonjun,operators:yeonjun.operators.map(o=>({...o,region:'back'}))};
assert.deepEqual(layeringModel(back).lines[0],layeringModel(base).lines[0]);
assert.notDeepEqual(layeringModel(back).lines.at(-1),layeringModel(base).lines.at(-1));
const reordered=presetStudy('10');reordered.values.rotation=35;reordered.operators.forEach(o=>o.enabled=true);
assert.notDeepEqual(layeringModel(reordered),layeringModel({...reordered,operators:[...reordered.operators].reverse()}),'order should change noncommuting operations');
// Folding a segment about the exact hinge must preserve its length and shared endpoint.
const fold={kind:'Fold',enabled:true,strength:1,region:'all'};
const pts=[[-4,0,-2],[4,0,2],[4,5,2],[-4,5,-2],[-4,0,-2]];
const result=applyOperation(pts,fold,yeonjun,0);
assert.deepEqual(result[0],pts[0]);assert.deepEqual(result[1],pts[1]);
const length=(a,b)=>Math.hypot(...a.map((v,k)=>v-b[k]));
for(let i=1;i<pts.length;i++)assert.ok(Math.abs(length(pts[i],pts[i-1])-length(result[i],result[i-1]))<1e-8,'fold must preserve edge lengths, even after axis reorientation');
for(const profile of ['triangle','square','circle'])for(const count of [3,28])for(const spacing of [0,36]){
 const s={...reordered,base:{...reordered.base,profile,count,spacing},values:{scale:1.3,rotation:-120,axis:80,fold:120}};
 assert.ok(layeringModel(s).lines.flatMap(l=>l.pts.flat()).every(Number.isFinite));
}
assert.deepEqual(layeringModel(JSON.parse(JSON.stringify(reordered))),layeringModel(reordered),'composition JSON must preserve exact geometry');
console.log('PASS: distinct presets, base hierarchy, scope, bypass, noncommuting order, rigid hinge, bounds, JSON round-trip');
