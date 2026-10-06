import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
const plans = JSON.parse(await readFile('src/config/bonusBuys.json', 'utf8'));
const compiled = await build({
  stdin: { contents: 'export { createMockRgsClient } from "./src/api/rgs/mockClient"; export { buildRoundFrames } from "./src/features/slot/player/roundPlayback";', resolveDir: process.cwd() },
  bundle: true, write: false, format: 'esm', platform: 'node', alias: {'@':'./src'}, define: {'__TEST_TOOLS_ENABLED__':'true', 'import.meta.env.DEV':'false'},
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
    if (plan.kind === 'free_spins') {
      assert.equal(frames[0].awardedFreeSpins, plan.spins);
      assert.equal(frames.at(-1).freeSpin, plan.spins);
    } else {
      assert.equal(frames[0].awardedFreeSpins, 0);
      if (plan.kind === 'treasury') assert.ok(frames[0].treasury);
      else assert.ok(frames.some(f => f.visual.collector));
    }
    assert.ok(Math.abs(frames.at(-1).totalWin - response.round.payoutMultiplier * stake) < 1e-7);
    await assert.rejects(client.play({mode: plan.mode, amount: 1e6}));
    const resumed = await client.authenticate();
    assert.equal(resumed.round.mode, plan.mode);
    const end = await client.endRound();
    assert.equal(end.balance.amount, response.balance.amount + response.round.payout);
    assert.equal((await client.endRound()).balance.amount, end.balance.amount);
    assert.equal((await client.authenticate()).round, null);
  }
  // A deliberately small wallet makes every purchase unaffordable.
  const saved = new Map();
  globalThis.sessionStorage = { getItem: k => saved.get(k) ?? null, setItem: (k,v) => saved.set(k,v) };
  saved.set('lost-idol-local-wallet-treasury-USD', JSON.stringify({balanceAmount:1000,lastRound:null}));
  const client = createMockRgsClient();
  const before = (await client.authenticate()).balance.amount;
  await assert.rejects(client.play({mode: plan.mode, amount: 1e6}));
  assert.equal((await client.authenticate()).balance.amount, before);
  delete globalThis.sessionStorage;
}
console.log('Bonus buys: all modes, three stakes, debit, feature type, payouts, active-round lock, restoration, settlement and insufficient balance passed.');
