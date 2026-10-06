import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { build } from 'esbuild';
const pool=JSON.parse(gunzipSync(await readFile('../math-sdk/games/lost_idol/library_treasury_single/calibrated_preview/treasury.json.gz')));
const plans=JSON.parse(await readFile('src/config/bonusBuys.json','utf8'));
assert.equal(plans.find(p=>p.mode==='treasury').cost,9);
const compiled=await build({stdin:{contents:'export { createMockRgsClient } from "./src/api/rgs/mockClient"; export { buildRoundFrames } from "./src/features/slot/player/roundPlayback";',resolveDir:process.cwd()},bundle:true,write:false,format:'esm',platform:'node',alias:{'@':'./src'},define:{'import.meta.env.DEV':'true'}});
const {createMockRgsClient,buildRoundFrames}=await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
let mass=0n,moment=0n;
for (const {weight,book} of pool.entries) {
 mass+=BigInt(weight); moment+=BigInt(weight)*BigInt(book.payoutMultiplier);
 const frames=await buildRoundFrames(book,1,[]);
 assert.equal(frames.length,1);
 const frame=frames[0];
 assert.equal(frame.visual.winAmount,0);
 assert.equal(frame.awardedFreeSpins,0);
 assert.equal(frame.treasury.amount,book.payoutMultiplier/100);
 const gems=frame.treasury.rewards.filter(r=>r.kind==='multiplier');
 assert.ok(gems.length<=1);
 assert.ok(gems.every(r=>[2,3,5,10].includes(r.value)));
 assert.equal(frame.totalWin,frame.treasury.amount);
 assert.equal(frame.visual.matrix.flat().filter(s=>s===2).length,3);
 for(const c of [0,4]) assert.ok(!frame.visual.matrix[c].includes(2));
 assert.ok(!book.events.some(e=>['winInfo','freeSpinTrigger'].includes(e.type)));
}
assert.equal(moment*100n,mass*900n*96n);
for (const stake of [10000,1000000,2500000]) {
 const saved=new Map();
 globalThis.sessionStorage={getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v)};
 const book=pool.entries.at(-1).book;
 globalThis.fetch=async url=>{assert.equal(url,'/__calibrated-math?mode=treasury');return {ok:true,json:async()=>book};};
 const client=createMockRgsClient(); const start=await client.authenticate();
 const paid=await client.play({mode:'treasury',amount:stake});
 assert.equal(paid.balance.amount,start.balance.amount-9*stake);
 const resumed=createMockRgsClient();
 assert.equal((await resumed.authenticate()).round.mode,'treasury');
 await assert.rejects(()=>resumed.play({mode:'treasury',amount:stake}));
 const end=await resumed.endRound();
 assert.equal(end.balance.amount,paid.balance.amount+Math.round(stake*book.payoutMultiplier/100));
 assert.equal((await resumed.endRound()).balance.amount,end.balance.amount);
}
console.log(`Treasury buy: all ${pool.entries.length} outcomes, exact 96% RTP, trigger-only boards, 9x debit at three stakes, reload and single settlement passed.`);
