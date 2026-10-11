import { Graphics } from 'pixi.js';
import atlasUrl from '@/assets/symbols/lost-idol/emerald-torch/symbol-v6.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/emerald-torch/symbol-v6.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/emerald-torch/sheet-v6.webp?url';
import { defineSymbolSpine, type CreateSymbolSpineOptions } from './symbolSpineFactory';

// Animate only the flame; the clipped handle retains its setup-pose geometry.
const symbol = defineSymbolSpine({
  name: 'lost-idol-fire-torch-v6', jsonUrl, atlasUrl,
  images: { 'sheet-v6.webp': sheetUrl },
});
export const ensureRoseSpineLoaded = symbol.ensureLoaded;
export const createRoseSetupPose = symbol.createSetupPose;
export const createRoseSpine = (options?: CreateSymbolSpineOptions) => {
  const spine = symbol.create(options);
  const light = new Graphics();
  light.eventMode = 'none';
  light.blendMode = 'add';
  spine.addChild(light);
  light.onRender = () => {
    light.clear();
    const entry = spine.state.getCurrent(0);
    if (entry?.animation?.name !== 'win') return;
    const progress = entry.getAnimationTime() / entry.animationEnd;
    const pulse = Math.sin(Math.PI * Math.min(1, progress)) ** 2;
    for (let i = 8; i >= 1; i--) {
      light.ellipse(0, 129, i * 3, i * 4)
        .fill({ color: 0x72ffa0, alpha: 0.065 * pulse });
    }
  };
  return spine;
};
