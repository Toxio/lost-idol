import { Graphics } from 'pixi.js';
import atlasUrl from '@/assets/symbols/lost-idol/stone-chalice/symbol-stable.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/stone-chalice/symbol-stable.json?url';
import imageUrl from '@/assets/symbols/lost-idol/stone-chalice/symbol-v2.webp?url';
import { defineSymbolSpine, type CreateSymbolSpineOptions } from './symbolSpineFactory';

// Keep the cup geometry fixed; animate the central glow and reflected light separately.
const symbol = defineSymbolSpine({
  name: 'lost-idol-stone-chalice-stable',
  jsonUrl,
  atlasUrl,
  images: { 'symbol-v2.webp': imageUrl },
});

export const ensureGobletSpineLoaded = symbol.ensureLoaded;
export const createGobletSetupPose = symbol.createSetupPose;

export const createGobletSpine = (options?: CreateSymbolSpineOptions) => {
  const spine = symbol.create(options);
  const shine = new Graphics();
  shine.eventMode = 'none';
  shine.blendMode = 'add';
  spine.addChild(shine);
  shine.onRender = () => {
    shine.clear();
    const entry = spine.state.getCurrent(0);
    if (entry?.animation?.name !== 'win') return;
    const progress = Math.max(0, Math.min(1, (entry.getAnimationTime() - 0.08) / 1.12));
    if (progress <= 0 || progress >= 1) return;
    const intensity = Math.sin(Math.PI * progress);
    // Soft overlapping halos restore the pendant and liquid glow without changing poses.
    for (let layer = 10; layer >= 1; layer--) {
      const radius = layer / 10;
      shine.ellipse(0, -126, 78 * radius, 23 * radius)
        .fill({ color: 0x83ff44, alpha: 0.11 * intensity });
      shine.circle(0, -58, 34 * radius)
        .fill({ color: 0xffd34e, alpha: 0.065 * intensity });
    }
    shine.circle(0, -58, 6).fill({ color: 0xfff6bb, alpha: 0.65 * intensity });
    // Screen Y increases downwards, so decreasing angle travels counterclockwise.
    const angle = -Math.PI - progress * Math.PI * 2;
    // Coordinates match the rim in the fixed 437 × 413 attachment.
    const point = (a: number) => [Math.cos(a) * 170, -128 + Math.sin(a) * 40];
    for (const [width, alpha, color] of [[16, 0.22, 0xffd66d], [8, 0.65, 0xffe9a4], [3.5, 1, 0xfff9db]]) {
      const start = point(angle - 0.30);
      shine.moveTo(start[0], start[1]);
      for (let i = 1; i <= 12; i++) {
        const p = point(angle - 0.30 + i * 0.60 / 12);
        shine.lineTo(p[0], p[1]);
      }
      shine.stroke({ width, alpha: alpha * intensity, color, cap: 'round' });
    }
    const [x, y] = point(angle);
    shine.ellipse(x, y, 5, 3).fill({ color: 0xfffce9, alpha: intensity });
  };
  return spine;
};
