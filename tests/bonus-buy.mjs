import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
const plans = JSON.parse(await readFile('src/config/bonusBuys.json', 'utf8'));
const fixtures = JSON.parse(await readFile('src/api/rgs/buyBonusFixtures.json', 'utf8'));
const compiled = await build({
  stdin: { contents: 'export { createMockRgsClient } from "./src/api/rgs/mockClient"; export { buildRoundFrames } from "./src/features/slot/player/roundPlayback";', resolveDir: process.cwd() },
  bundle: true, write: false, format: 'esm', platform: 'node', alias: {'@':'./src'}, define: {'__TEST_TOOLS_ENABLED__':'true'},
});
const { createMockRgsClient, buildRoundFrames } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
for (const plan of plans) {
  for (const stake of [0.01, 1, 2.5]) {
    const client = createMockRgsClient();
    const start = await client.authenticate();
    const response = await client.play({ mode: plan.mode, amount: Math.round(stake * 1e6) });
    assert.equal(response.balance.amount, start.balance.amount - Math.round(stake * plan.cost * 1e6));
    assert.equal(response.round.amount, stake * 1e6);
    assert.equal(response.round.mode, plan.mode);
    const frames = await buildRoundFrames(response.round.state, stake, []);
    const wildSpin = plan.kind === 'wild_spin';
    assert.equal(frames.length, wildSpin ? 1 : plan.spins + 1);
    assert.equal(frames[0].awardedFreeSpins, wildSpin ? 0 : plan.spins);
    assert.equal(frames.at(-1).freeSpin, wildSpin ? 0 : plan.spins);
    if (wildSpin) assert.ok(frames[0].wildMultipliers.some(mult => [2, 3, 5, 10].includes(mult)));
    assert.ok(Math.abs(frames.at(-1).totalWin - fixtures[plan.mode].payoutMultiplier * stake / 100) < 1e-7);
    await assert.rejects(client.play({mode: plan.mode, amount: 1e6}));
    const resumed = await client.authenticate();
    assert.equal(resumed.round.mode, plan.mode);
    const end = await client.endRound();
    assert.equal(end.balance.amount, response.balance.amount + response.round.payout);
    assert.equal((await client.endRound()).balance.amount, end.balance.amount);
    assert.equal((await client.authenticate()).round, null);
  }
  const client = createMockRgsClient();
  if (plan.kind === 'wild_spin') {
    // Deterministic 25× debit and 11× payout leaves less than the 10,000× purchase.
    await client.play({mode: 'bonus_5', amount: 1e6});
    await client.endRound();
  }
  const before = (await client.authenticate()).balance.amount;
  await assert.rejects(client.play({mode: plan.mode, amount: 1000e6}));
  assert.equal((await client.authenticate()).balance.amount, before);
}
console.log('Bonus buys: 4 modes × 3 stakes, cost, spin count, payouts, active-round lock, restoration, settlement and insufficient balance passed.');
