import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
const result = await build({ entryPoints: ['src/features/slot/player/roundPlayback.ts'], bundle: true, write: false, format: 'esm', platform: 'node', alias: {'@':'./src'} });
const {buildRoundFrames} = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const samples = JSON.parse(await readFile('src/api/rgs/collectorBooks.json','utf8'));
for(const [mode,books] of Object.entries(samples)) for(const book of books) for(const bet of [0.01,1,100]) {
 const frames=await buildRoundFrames(book,bet,[]);
 if(mode==='wild_spin') assert.equal(frames.length,4);
 if(mode==='bonus_5') assert.equal(frames.length,6);
 for(const f of frames) if(f.visual.collector) {
  assert.deepEqual(f.visual.expandingWild,[0,0,0,0,0]);
  assert.equal(f.visual.matrix.flat().filter(v=>v===9).length,1);
  assert.equal(f.visual.collector.underlyingMatrix.flat().filter(v=>v===9).length,0);
 }
 assert.ok(Math.abs(frames.reduce((s,f)=>s+f.visual.winAmount,0)-book.payoutMultiplier*bet/100)<0.00001);
}
console.log('Collector playback: frame counts, no expansion, single wild, payout scaling passed');
