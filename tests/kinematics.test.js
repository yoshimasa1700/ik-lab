import test from 'node:test';
import assert from 'node:assert/strict';
import {forward, inverse} from '../kinematics.js';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('both branches reach targets in every quadrant',()=>{
 for(const x of [-2,-1,0,1,2]) for(const y of [-2,-1,0,1,2]){
  if(Math.hypot(x,y)<.5)continue;
  for(const sign of [-1,1]){const s=inverse(x,y,2,1.5,sign);assert.equal(s.reachable,true);const p=forward(s.a,s.b,2,1.5);near(p.x,x);near(p.y,y);}
 }
});
test('unreachable targets project to nearest boundary',()=>{
 for(const [x,y,r] of [[5,0,3.5],[0,0,.5],[.1,.1,.5]]){
 const s=inverse(x,y,2,1.5);assert.equal(s.reachable,false);const p=forward(s.a,s.b,2,1.5);near(Math.hypot(p.x,p.y),r);assert.ok(Number.isFinite(s.a));}
});
test('equal-link origin is an infinite family of solutions',()=>{const s=inverse(0,0,2,2);assert.equal(s.infinite,true);const p=forward(s.a,s.b,2,2);near(p.x,0);near(p.y,0);});
test('outer boundary is singular',()=>{const s=inverse(3.5,0,2,1.5);near(s.b,0);assert.equal(s.reachable,true);});
