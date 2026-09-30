import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { build } from "esbuild";
const compiled = await build({
  entryPoints: ["src/features/slot/player/roundPlayback.ts"],
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
  alias: { "@": "./src" },
});
const { buildRoundFrames } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString("base64")}`
);
const fixture = JSON.parse(
  await readFile("src/api/rgs/bonusFixture.json", "utf8"),
);
for (const bet of [0.01, 1, 2.5, 100]) {
  const frames = await buildRoundFrames(fixture, bet, []);
  assert.equal(frames.length, 6);
  assert.equal(frames[0].awardedFreeSpins, 5);
  assert.ok(frames.slice(1).some(f => f.visual.winLines.length >= 2));
  assert.equal(frames[0].visual.winAmount, 0);
  assert.ok(frames.every((f) => f.visual.winLines.every((w) => w.count > 0)));
  assert.deepEqual(
    frames.slice(1).map((f) => f.freeSpin),
    [1, 2, 3, 4, 5],
  );
  assert.ok(frames.slice(1).every((f) => f.totalFreeSpins === 5));
  assert.ok(
    Math.abs(
      frames.reduce((sum, f) => sum + f.visual.winAmount, 0) -
        (fixture.payoutMultiplier * bet) / 100,
    ) < 1e-8,
  );
  assert.equal(frames.at(-1).totalWin, (fixture.payoutMultiplier * bet) / 100);
  assert.ok(
    frames.some(
      (f) => f.visual.winAmount === 0 && f.visual.winLines.length === 0,
    ),
  );
}
const board = Array.from({ length: 5 }, () => [
  { name: "2" },
  { name: "3" },
  { name: "4" },
]);
const zero = await buildRoundFrames(
  {
    events: [
      { type: "reveal", board },
      { type: "winInfo", totalWin: 100, wins: [] },
      { type: "reveal", board },
      { type: "finalWin", amount: 100 },
    ],
  },
  1,
  [],
);
assert.equal(
  zero[1].visual.winAmount,
  0,
  "previous spin win must not leak into a losing spin",
);
assert.equal(zero[1].totalWin, 1);
console.log(
  "Bonus playback: real math fixture, 6 frames, four stakes and zero-win reset passed.",
);

const presetsBundle = await build({
  entryPoints: ["src/features/slot/test/testPresets.ts"],
  bundle: true, write: false, format: "esm", platform: "node",
  alias: { "@": "./src" },
});
const { TEST_PRESETS } = await import(
  `data:text/javascript;base64,${Buffer.from(presetsBundle.outputFiles[0].text).toString("base64")}`
);
const scatter = TEST_PRESETS.find(p => p.id === "scatter-3-line0");
assert.ok(scatter.preset.book, "scatter preset must provide a full bonus book");
for (const bet of [0.01, 1, 2.5, 100]) {
  const frames = await buildRoundFrames(scatter.preset.book, bet, []);
  assert.equal(frames.length, 6);
  assert.equal(frames[0].awardedFreeSpins, 5);
  assert.ok(frames.slice(1).some(f => f.visual.winLines.length >= 2));
  assert.equal(frames[0].visual.winAmount, 0);
  assert.equal(frames.at(-1).freeSpin, 5);
  assert.equal(frames.at(-1).totalWin, bet * fixture.payoutMultiplier / 100);
}
assert.equal(TEST_PRESETS.find(p => p.id === "win-anim-scatter").preset.book, undefined);
console.log("Scatter test preset: full bonus at current stake; animation-only preset preserved.");
