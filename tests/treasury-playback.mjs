import assert from 'node:assert/strict';
import { build } from 'esbuild';
const compiled = await build({ entryPoints:['src/features/slot/player/roundPlayback.ts'],bundle:true,write:false,format:'esm',platform:'node',alias:{'@':'./src'} });
const {buildRoundFrames} = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const reveal = {type:'reveal',board:Array.from({length:5},()=>[8,2,3,4,8].map(name=>({name:String(name)})))};
const treasury = {type:'treasury',positions:[{reel:1,row:0},{reel:2,row:1},{reel:3,row:2}],rewards:[{kind:'cash',value:400},{kind:'multiplier',value:1},{kind:'cash',value:600}],amount:2000,uncappedAmount:2000};
for(const bet of [.01,1,2.5,100]) {
 const [frame,next] = await buildRoundFrames({events:[reveal,{type:'winInfo',totalWin:100,wins:[]},{type:'setWin',amount:100},treasury,{type:'setTotalWin',amount:2100},{type:'freeSpinTrigger',totalFs:5},{type:'updateFreeSpin',amount:0,total:5},reveal,{type:'winInfo',totalWin:200,wins:[]},{type:'setWin',amount:200},{type:'finalWin',amount:2300}]},bet,[]);
 assert.equal(frame.visual.winAmount,bet);
 assert.equal(frame.treasury.amount,20);
 assert.equal(frame.totalWin,21*bet);
 assert.equal(frame.awardedFreeSpins,5);
 assert.equal(next.treasury,undefined);
 assert.equal(next.visual.winAmount,2*bet);
 assert.equal(next.totalWin,23*bet);
}
const [capped] = await buildRoundFrames({events:[reveal,{...treasury,amount:100},{type:'finalWin',amount:100}]},1,[]);
assert.equal(capped.treasury.amount,1);
assert.equal(capped.treasury.uncappedAmount,20);
await assert.rejects(()=>buildRoundFrames({events:[reveal,{...treasury,amount:2500}]},1,[]),/Invalid treasury total/);
console.log('Treasury playback: isolated line payouts, cumulative awards, concurrent Free Spins and cap verified.');
const { readFile } = await import('node:fs/promises');
const testBooks = JSON.parse(await readFile('src/features/slot/test/treasuryBooks.json', 'utf8'));
for (const book of Object.values(testBooks)) {
  const frames = await buildRoundFrames(book, 1, []);
  const triggers = frames.filter(f => f.treasury);
  assert.equal(triggers.length, 1);
  assert.equal(triggers[0].visual.matrix.flat().filter(id => id === 2).length, 3);
  assert.equal(triggers[0].treasury.rewards.length, 3);
  assert.ok(frames.every(f => f.visual.winLines.every(w => w.symbol !== 2)));
  assert.equal(frames.at(-1).totalWin, book.payoutMultiplier / 100);
}
console.log('Test menu: reels 2/3/4 trigger full Treasury books, three picks each, no chest line payout.');

for (const value of [2,3,5,10]) {
 const award={...treasury,multiplierMode:'set',rewards:[{kind:'cash',value:400},{kind:'multiplier',value},{kind:'cash',value:600}],amount:1000*value,uncappedAmount:1000*value};
 const [frame]=await buildRoundFrames({events:[reveal,award,{type:'finalWin',amount:award.amount}]},1,[]);
 assert.equal(frame.treasury.amount,10*value);
 assert.equal(frame.treasury.rewards[1].value,value);
 await assert.rejects(()=>buildRoundFrames({events:[reveal,{...award,rewards:[{kind:'cash',value:400},{kind:'multiplier',value},{kind:'multiplier',value}]}]},1,[]),/Multiple treasury multipliers/);
}
console.log('Single multiplier: ×2/×3/×5/×10 applied directly, duplicate gems rejected; legacy books still decode.');
