import assert from 'node:assert/strict';
import { build } from 'esbuild';
const compiled = await build({ entryPoints: ['src/features/slot/reels/lib/anticipation.ts'], bundle: true, write: false, format: 'esm', platform: 'node' });
const { anticipationSymbol, anticipationLanding } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const matrix = [[10, 1, 2], [11, 3, 4], [10, 5, 6], [11, 7, 8], [1, 2, 3]];
assert.equal(anticipationSymbol(matrix, new Set([0])), null);
assert.equal(anticipationSymbol(matrix, new Set([0, 1])), null, 'Different symbols must not combine');
assert.equal(anticipationSymbol(matrix, new Set([0, 2])), 10);
assert.equal(anticipationSymbol(matrix, new Set([1, 3])), 11);
assert.equal(anticipationSymbol(matrix, new Set()), null, 'Unrevealed symbols must not trigger');
const chests = [[1, 3, 4], [2, 5, 6], [7, 2, 8], [1, 3, 4], [5, 6, 7]];
assert.equal(anticipationSymbol(chests, new Set([0, 1])), null);
assert.equal(anticipationSymbol(chests, new Set([0, 1, 2])), 2, 'Two chests anticipate reel 4');
assert.equal(anticipationSymbol(chests, new Set([0, 1, 2, 3])), null, 'No Treasury anticipation after reel 4 missed');
for (const speed of [22, 43]) {
  for (const from of [0, 4.75, 19.999]) {
    for (let order = 0; order < 4; order++) {
      const velocity = speed / 2000;
      const t = anticipationLanding(from, velocity, 12 / 1000, order, 10);
      assert.equal(t.to % 10, 0, 'Landing must preserve symbol alignment');
      assert.equal(t.ease(0), 0);
      assert.ok(Math.abs(t.ease(1) - 1) < 1e-10);
      let previous = 0;
      for (let i = 1; i <= 1000; i++) {
        const position = t.ease(i / 1000);
        assert.ok(position >= previous && position <= 1 + 1e-10, 'No reversal or overshoot');
        previous = position;
      }
      const epsilon = 1e-6;
      const initialVelocity = t.ease(epsilon) * (t.to - from) / (epsilon * t.duration);
      assert.ok(Math.abs(initialVelocity - velocity) < 1e-5, 'Velocity must match at handoff');
      const finalVelocity = (1 - t.ease(1 - epsilon)) * (t.to - from) / (epsilon * t.duration);
      assert.ok(Math.abs(finalVelocity) < 1e-5, 'Must stop smoothly');
      if (order) {
        const previousReel = anticipationLanding(from, velocity, 12 / 1000, order - 1, 10);
        assert.ok(t.brakeStartMs >= previousReel.duration + 1200, 'Next reel must keep cruising after the previous landing');
        const positionAt = ms => t.ease(ms / t.duration) * (t.to - from);
        const before = positionAt(previousReel.duration) - positionAt(previousReel.duration - 100);
        const after = positionAt(previousReel.duration + 100) - positionAt(previousReel.duration);
        assert.ok(before > 0 && Math.abs(before - after) < 1e-8, 'No premature braking when the previous reel stops');
      }
    }
  }
}
console.log('Reel anticipation: revealed matching symbols, ordered aligned landings, continuous velocity and no overshoot passed.');

// Exercise the scene's completion callback with the fifth reel landing before the fourth.
const { readFileSync } = await import('node:fs');
const { transform } = await import('esbuild');
const scene = readFileSync('src/features/slot/reels/scene/useReelsScene.ts', 'utf8');
const callback = scene.slice(scene.indexOf('    function onReelLanded('), scene.indexOf('    function revealAnticipation('));
const { code } = await transform(callback, { loader: 'ts' });
const reels = [{}, {}, {}, {}, {}];
let completions = 0, commits = 0;
const onLanded = new Function('landedReels', 'reelsRef', 'attachColumnOverlays', 'REEL_COUNT', 'commitSettledGrid', 'targetMatrixRef', 'completeRef', `${code}; return onReelLanded;`)(new Set(), {current: reels}, () => {}, 5, () => commits++, {current: []}, {current: () => completions++});
for (const col of [0, 1, 2, 4]) onLanded(reels[col], col);
assert.equal(completions, 0, 'Reel 5 must not complete a spin while reel 4 is still moving');
onLanded(reels[3], 3);
assert.equal(completions, 1);
assert.equal(commits, 1);
onLanded(reels[3], 3);
assert.equal(completions, 1, 'Completion must be idempotent');
console.log('Out-of-order chest landing waits for all five reels and completes once.');
