import { SetupPoseBoundsProvider, Spine } from '@esotericsoftware/spine-pixi-v8';
import { Assets, type Ticker } from 'pixi.js';

import bgAtlasUrl from '@/assets/bg/bg.atlas.txt?url';
import bgJsonUrl from '@/assets/bg/bg.json?url';
import bgPngUrl from '@/assets/bg/bg.webp?url';

export const BG_SKEL_ALIAS = 'bgSpineJson';
export const BG_ATLAS_ALIAS = 'bgSpineAtlas';

/** Spine skeleton native dimensions (from bg.json bounding box). */
const BG_SPINE_WIDTH = 2500;
const BG_SPINE_HEIGHT = 1395;

let registered = false;

export function registerBgSpineAssets(): void {
  if (registered) return;
  Assets.add({ alias: BG_SKEL_ALIAS, src: bgJsonUrl });
  Assets.add({
    alias: BG_ATLAS_ALIAS,
    src: bgAtlasUrl,
    parser: 'spineTextureAtlasLoader',
    data: {
      images: {
        'bg.webp': bgPngUrl,
      },
    },
  });
  registered = true;
}

let loadPromise: Promise<void> | null = null;

export function ensureBgSpineLoaded(): Promise<void> {
  registerBgSpineAssets();
  if (!loadPromise) {
    loadPromise = Assets.load([BG_SKEL_ALIAS, BG_ATLAS_ALIAS]).then(() => undefined);
  }
  return loadPromise;
}

/** The export keeps bonus particles visible in its setup pose. Toggle their root explicitly. */
export function setBgBonusActive(spine: Spine, active: boolean): void {
  spine.state.clearTracks();
  spine.skeleton.setToSetupPose();
  const bonusRoot = spine.skeleton.findBone('scale');
  if (bonusRoot) {
    bonusRoot.scaleX = active ? 1 : 0;
    bonusRoot.scaleY = active ? 1 : 0;
  }
  spine.state.setAnimation(0, active ? 'idle_bonus' : 'idle', true);
  spine.update(0);
}

export function createBgSpine(ticker?: Ticker): Spine {
  const spine = Spine.from({
    skeleton: BG_SKEL_ALIAS,
    atlas: BG_ATLAS_ALIAS,
    boundsProvider: new SetupPoseBoundsProvider(),
    ticker,
  });
  setBgBonusActive(spine, false);
  return spine;
}

/** Scale to cover the full design canvas (fill, no distortion). */
export function layoutBgSpine(spine: Spine, designW: number, designH: number): void {
  const scale = Math.max(designW / BG_SPINE_WIDTH, designH / BG_SPINE_HEIGHT);
  spine.scale.set(scale);
  spine.position.set(designW / 2, designH / 2);
}
