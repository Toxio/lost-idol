import { Graphics } from 'pixi.js';
import atlasUrl from '@/assets/symbols/lost-idol/treasure-map/symbol-v3.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/treasure-map/symbol-v3.json?url';
import imageUrl from '@/assets/symbols/lost-idol/treasure-map/symbol-v3.webp?url';
import { defineSymbolSpine, type CreateSymbolSpineOptions } from './symbolSpineFactory';

const symbol = defineSymbolSpine({
  name: 'lost-idol-treasure-map-v3', jsonUrl, atlasUrl,
  images: { 'symbol-v3.webp': imageUrl },
});
export const ensureHeelsSpineLoaded = symbol.ensureLoaded;
export const createHeelsSetupPose = symbol.createSetupPose;
export const createHeelsSpine = (options?: CreateSymbolSpineOptions) => {
  const spine = symbol.create(options);
  const ink = new Graphics();
  ink.eventMode = 'none';
  spine.addChild(ink);
  const route = [[-39, 76], [-25, 62], [-18, 44], [-8, 26], [8, 9], [26, -5], [39, -22], [51, -39]];
  ink.onRender = () => {
    ink.clear();
    const entry = spine.state.getCurrent(0);
    if (entry?.animation?.name !== 'win') return;
    const time = entry.getAnimationTime();
    const progress = Math.max(0, Math.min(1, (time - 0.08) / 0.65));
    const fade = Math.min(1, Math.max(0, (1.3333333333 - time) / 0.22));
    for (let i = 0; i < route.length; i++) {
      const alpha = Math.min(1, Math.max(0, progress * route.length - i)) * fade;
      const [x, y] = route[i];
      ink.ellipse(x, y, 10, 8).fill({ color: 0xffe7a3, alpha });
      ink.ellipse(x, y, 8.5, 6.5).fill({ color: 0xc92222, alpha });
    }
    const cross = Math.min(1, Math.max(0, (progress - 0.82) / 0.18)) * fade;
    if (cross > 0) {
      for (const [width, color] of [[20, 0xffe7a3], [15, 0xc92222]]) {
        ink.moveTo(55, -74).lineTo(79, -48).moveTo(79, -74).lineTo(55, -48)
          .stroke({ color, width, cap: 'round', alpha: cross });
      }
    }
  };
  return spine;
};
