import { createBonusDoorLabel } from './bonusDoorLabel';
import staticUrl from '@/assets/symbols/lost-idol/bonus-door/symbol.webp?url';
import atlasUrl from '@/assets/symbols/lost-idol/bonus-door/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/bonus-door/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/bonus-door/sheet.webp?url';
import { Graphics } from 'pixi.js';
import type { Spine } from '@esotericsoftware/spine-pixi-v8';

const doorInstances = new WeakSet<Spine>();
export const isBonusDoorSpine = (spine: Spine): boolean => doorInstances.has(spine);
import type { CreateSymbolSpineOptions } from './symbolSpineFactory';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 10.
const symbol = defineSymbolSpine({
  name: 'lost-idol-bonus-door-opening-v7',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl, 'symbol.webp': staticUrl },
});

export const ensureScatterSpineLoaded = symbol.ensureLoaded;
// Draw the perimeter in fixed symbol coordinates so the architecture never shifts.
export const createScatterSpine = (options?: CreateSymbolSpineOptions) => {
  const spine = symbol.create({ ...options, loop: false });
  doorInstances.add(spine);
  const light = new Graphics();
  light.eventMode = 'none';
  spine.addChild(light);
  const path = [[0, -82], [63, -82], [63, 81], [-63, 81], [-63, -82], [0, -82]];
  const totalLength = 578;
  light.onRender = () => {
    const entry = spine.state.getCurrent(0);
    const time = entry?.getAnimationTime() ?? 0;
    const progress = Math.max(0, Math.min(1, (time - 0.03) / 0.72));
    light.clear();
    if (progress === 0) return;
    for (const [width, alpha, color] of [[12, 0.12, 0x13ff6a], [7, 0.25, 0x32ff80], [3, 0.85, 0x76ffa0], [1, 1, 0xd7ffb2]]) {
      let remaining = totalLength * progress;
      light.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length && remaining > 0; i++) {
        const [x, y] = path[i - 1];
        const [nx, ny] = path[i];
        const length = Math.hypot(nx - x, ny - y);
        const t = Math.min(1, remaining / length);
        light.lineTo(x + (nx - x) * t, y + (ny - y) * t);
        remaining -= length;
      }
      light.stroke({ width, alpha, color, cap: 'round', join: 'round' });
    }
  };
  spine.addChild(createBonusDoorLabel());
  return spine;
};
export const SCATTER_SKEL_ALIAS = symbol.skelAlias;
export const SCATTER_ATLAS_ALIAS = symbol.atlasAlias;
