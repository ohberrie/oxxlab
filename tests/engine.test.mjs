import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const code=ts.transpileModule(readFileSync(new URL('../src/app/engine/model.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;
const {generate,preset}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const a=preset('09'),b=preset('10');
assert.equal(generate(a).length,16);assert.equal(generate(b).length,13);
assert.notDeepEqual(generate({...a,count:13}),generate(b));
const folded=generate(b);const flat=generate({...b,fold:0});assert.notDeepEqual(folded,flat);
const reversed={...b,operators:[...b.operators].reverse()};assert.notDeepEqual(generate(b),generate(reversed),'operator order must affect geometry');
const back={...b,operators:b.operators.map(o=>({...o,region:'back'}))};
const noOps={...b,operators:[]};assert.deepEqual(generate(back)[0],generate(noOps)[0],'back-only operations must leave front layers intact');
const zeroWeight={...b,operators:b.operators.map(o=>({...o,weight:0}))};assert.deepEqual(generate(zeroWeight),generate(noOps));
for(const count of [4,28])for(const fold of [0,120]){assert.ok(generate({...b,count,fold,spacing:.5,axis:-60,rotation:120,scale:1.3}).flat(2).every(Number.isFinite));}
console.log('PASS: preset separation, fold, order, region, weights, boundary geometry');
