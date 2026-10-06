import assert from 'node:assert/strict';
import { build } from 'esbuild';
const result = await build({ entryPoints: ['src/features/slot/treasury/treasuryModel.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { treasuryTotal, validTreasuryPicks, DEMO_REWARDS } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
assert.deepEqual(treasuryTotal([]), {cash:0,multiplier:1,total:0});
assert.deepEqual(treasuryTotal(DEMO_REWARDS.slice(0,1)), {cash:4,multiplier:1,total:4});
assert.deepEqual(treasuryTotal(DEMO_REWARDS.slice(0,2)), {cash:4,multiplier:2,total:8});
assert.deepEqual(treasuryTotal(DEMO_REWARDS), {cash:10,multiplier:2,total:20});
assert.deepEqual(treasuryTotal([...DEMO_REWARDS].reverse()), treasuryTotal(DEMO_REWARDS));
for(const picks of [[],[0],[5,0],[4,2,1]]) assert.ok(validTreasuryPicks(picks));
for(const picks of [null,{},[1,1],[6],[-1],[1.5],['1'],[0,1,2,3]]) assert.equal(validTreasuryPicks(picks),false);
console.log('Treasury preview: totals, retrospective multiplier, order independence and saved choices validated.');

for (const value of [2, 3, 5, 10]) {
 const rewards = [{kind:'cash', value:4}, {kind:'multiplier', value}, {kind:'cash',value:6}];
 assert.equal(treasuryTotal(rewards).total,10*value);
 assert.equal(treasuryTotal([rewards[1],rewards[2],rewards[0]]).total,10*value);
}
