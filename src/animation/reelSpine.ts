import { SetupPoseBoundsProvider, Spine } from '@esotericsoftware/spine-pixi-v8';
import { Assets, type Ticker } from 'pixi.js';

import reelAtlasUrl from '@/assets/reel/reel.atlas.txt?url';
import reelJsonUrl from '@/assets/reel/reel.json?url';
import reelPngUrl from '@/assets/reel/reel.webp?url';

export const REEL_SPINE_SKEL_ALIAS = 'reelFrameSpineJson';
export const REEL_SPINE_ATLAS_ALIAS = 'reelFrameSpineAtlas';

/**
 * Reel frame attachment native size (from reel.atlas.txt `reel` region).
 * The Spine skeleton (2500×1395) is wider than the frame — decorations bones
 * extend beyond it. We scale by the frame's own size so it lines up with the
 * old static reel.webp (1641×1022) that filled the design canvas.
 */
const REEL_ATTACHMENT_WIDTH = 1628;
const REEL_ATTACHMENT_HEIGHT = 1015;

let registered = false;

export function registerReelSpineAssets(): void {
  if (registered) return;
  Assets.add({ alias: REEL_SPINE_SKEL_ALIAS, src: reelJsonUrl });
  Assets.add({
    alias: REEL_SPINE_ATLAS_ALIAS,
    src: reelAtlasUrl,
    parser: 'spineTextureAtlasLoader',
    data: {
      images: {
        'reel.webp': reelPngUrl,
      },
    },
  });
  registered = true;
}

let loadPromise: Promise<void> | null = null;

export function ensureReelSpineLoaded(): Promise<void> {
  registerReelSpineAssets();
  if (!loadPromise) {
    loadPromise = Assets.load([REEL_SPINE_SKEL_ALIAS, REEL_SPINE_ATLAS_ALIAS]).then(
      () => undefined,
    );
  }
  return loadPromise;
}

/**
 * Static additive-blend yellow glow slots — always visible in setup pose, bleeds
 * ~70px past the frame edge (bone x=±795, attachment reaches ±886). Not part of
 * the animated `idle` clip, so hiding via attachment=null is stable.
 */
const HIDDEN_SLOTS = ['sideglow', 'sideglow2'] as const;

export function createReelSpine(ticker?: Ticker): Spine {
  const spine = Spine.from({
    skeleton: REEL_SPINE_SKEL_ALIAS,
    atlas: REEL_SPINE_ATLAS_ALIAS,
    boundsProvider: new SetupPoseBoundsProvider(),
    ticker,
  });
  for (const name of HIDDEN_SLOTS) {
    const slot = spine.skeleton.findSlot(name);
    if (slot) slot.setAttachment(null);
  }
  spine.state.setAnimation(0, 'idle', true);
  spine.update(0);
  return spine;
}

/** Scale so the reel frame attachment matches the design canvas, replacing the old reel.webp sprite. */
export function layoutReelSpine(spine: Spine, designW: number, designH: number): void {
  const scale = Math.max(designW / REEL_ATTACHMENT_WIDTH, designH / REEL_ATTACHMENT_HEIGHT);
  spine.scale.set(scale);
  spine.position.set(designW / 2, designH / 2);
}
