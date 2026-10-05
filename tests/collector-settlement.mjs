import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';

const samples = JSON.parse(await readFile('src/api/rgs/collectorBooks.json', 'utf8'));
const plans = JSON.parse(await readFile('src/config/bonusBuys.json', 'utf8'));
const result = await build({ entryPoints: ['src/api/rgs/mockClient.ts'], bundle: true,
  write: false, format: 'esm', platform: 'node', alias: { '@': './src' },
  define: { 'import.meta.env.DEV': 'true' } });
const { createMockRgsClient } = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const originalFetch = globalThis.fetch;
try {
  for (const [mode, books] of Object.entries(samples)) {
    for (const book of books) {
      globalThis.fetch = async () => ({ ok: true, json: async () => book });
      const client = createMockRgsClient();
      const auth = await client.authenticate();
      const stake = auth.config.defaultBetLevel;
      const cost = plans.find(p => p.mode === mode)?.cost ?? 1;
      const played = await client.play({ amount: stake, mode });
      assert.equal(played.balance.amount, auth.balance.amount - stake * cost);
      const expected = played.balance.amount + Math.round(stake * book.payoutMultiplier / 100);
      assert.equal((await client.endRound()).balance.amount, expected, `${mode}: full series payout credited`);
      assert.equal((await client.endRound()).balance.amount, expected, `${mode}: no duplicate credit`);
    }
  }
} finally { globalThis.fetch = originalFetch; }
console.log('Collector settlement: one debit, complete series credit, no duplicate credit in all modes.');
