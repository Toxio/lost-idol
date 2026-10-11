import { Graphics } from 'pixi.js';
import atlasUrl from '@/assets/symbols/lost-idol/machete/symbol-v2.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/machete/symbol-v2.json?url';
import imageUrl from '@/assets/symbols/lost-idol/machete/symbol-v2.webp?url';
import { defineSymbolSpine, type CreateSymbolSpineOptions } from './symbolSpineFactory';

const symbol = defineSymbolSpine({
  name: 'lost-idol-machete-v2', jsonUrl, atlasUrl,
  images: { 'symbol-v2.webp': imageUrl },
});
export const ensureLipstickSpineLoaded = symbol.ensureLoaded;
export const createLipstickSetupPose = symbol.createSetupPose;
export const createLipstickSpine = (options?: CreateSymbolSpineOptions) => {
  const spine = symbol.create(options);
  const perimeter = new Graphics();
  const emerald = new Graphics();
  const edge = [[-120, 118], [-77, 52], [15, -43], [47, -13], [-16, 65], [-54, 91], [-120, 118]];
  const lengths = edge.slice(1).map((p, i) => Math.hypot(p[0] - edge[i][0], p[1] - edge[i][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const pointAt = (distance: number) => {
    let remaining = ((distance % total) + total) % total;
    for (let i = 0; i < lengths.length; i++) {
      if (remaining <= lengths[i]) {
        // Leave a gap across the guard and a small margin at either blade shoulder.
        if (i === 2 || (i === 1 && remaining > lengths[i] - 10) || (i === 3 && remaining < 10)) return null;
        const t = remaining / lengths[i];
        return [edge[i][0] + (edge[i + 1][0] - edge[i][0]) * t,
          edge[i][1] + (edge[i + 1][1] - edge[i][1]) * t];
      }
      remaining -= lengths[i];
    }
    return edge[0];
  };
  spine.addChild(emerald, perimeter);
  for (const light of [emerald, perimeter]) {
    light.eventMode = 'none';
    light.blendMode = 'add';
  }
  perimeter.onRender = () => {
    emerald.clear();
    perimeter.clear();
    const entry = spine.state.getCurrent(0);
    if (entry?.animation?.name !== 'win') return;
    const progress = Math.max(0, Math.min(1, entry.getAnimationTime() / 1.3333333333));
    const intensity = Math.sin(Math.PI * progress);
    // Light follows only the cutting edge.
    for (const [width, alpha, color] of [[10, 0.18, 0x72ffae], [5, 0.55, 0xd6ffe4], [2, 1, 0xfffbe3]]) {
      let drawing = false;
      for (let i = 0; i <= 20; i++) {
        const p = pointAt(progress * total - 50 + i * 3);
        if (!p) { drawing = false; continue; }
        if (drawing) perimeter.lineTo(p[0], p[1]);
        else perimeter.moveTo(p[0], p[1]);
        drawing = true;
      }
      perimeter.stroke({ width, alpha: alpha * intensity, color, cap: 'round', join: 'round' });
    }
    emerald.poly([-94, 96, -38, 23, 12, -23, 23, -11, -37, 66])
      .fill({ color: 0x44ff79, alpha: 0.28 * intensity });

  };
  return spine;
};
