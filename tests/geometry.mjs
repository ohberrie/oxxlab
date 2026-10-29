import { build } from 'esbuild';
import assert from 'node:assert/strict';
const bundled = await build({entryPoints:['src/app/os/geometry.ts'], bundle:true,write:false,format:'esm'});
const {model, project} = await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const p={count:10,rotation:35,depth:180,profile:'triangle',scale:0.6,fold:0,domain:'axis'};
for(const kind of ['layer','perspective','spine','division','enclosure']) {
 const a=model(kind,p);
 assert.ok(a.lines.length>0,kind);
 for(const line of a.lines) for(const pt of line.pts) assert.ok(project(pt,1000,600,-0.5,0.15).every(Number.isFinite),kind);
}
assert.notDeepEqual(model('layer',p),model('layer',{...p,scale:0.2}));
assert.notDeepEqual(model('layer',p),model('layer',p,new Set(['Rotate'])));
assert.notDeepEqual(model('layer',p),model('layer',{...p,domain:'planes'}));
assert.notDeepEqual(model('enclosure',p),model('enclosure',{...p,fold:65}));
assert.notDeepEqual(model('layer',p,new Set(),['line','perspective']),model('layer',p,new Set(),['perspective','line']));
assert.notDeepEqual(model('enclosure',p),model('enclosure',{...p,rotation:0}));
console.log('PASS: five generators, finite projection, scale, bypass, domain, fold and noncommutative composition order');
