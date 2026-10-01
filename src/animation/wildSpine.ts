import { SetupPoseBoundsProvider, Spine } from '@esotericsoftware/spine-pixi-v8';
import { Assets, type Ticker } from 'pixi.js';

import wildAtlasUrl from '@/assets/symbols/lost-idol/monkey/symbol.atlas.txt?url';
import wildJsonUrl from '@/assets/symbols/lost-idol/monkey/symbol.json?url';
import wildPngUrl from '@/assets/symbols/lost-idol/monkey/sheet.webp?url';

import wildTextUrl from '@/assets/symbols/lost-idol/monkey/text.webp?url';

export const WILD_SKEL_ALIAS = 'wildSymbolSpineJson';
export const WILD_ATLAS_ALIAS = 'wildSymbolSpineAtlas';

let registered = false;

export function registerWildSpineAssets(): void {
  if (registered) return;
  Assets.add({ alias: WILD_SKEL_ALIAS, src: wildJsonUrl });
  Assets.add({
    alias: WILD_ATLAS_ALIAS,
    src: wildAtlasUrl,
    parser: 'spineTextureAtlasLoader',
    data: {
      images: {
        'sheet.webp': wildPngUrl,
        'text.webp': wildTextUrl,
      },
    },
  });
  registered = true;
}

let loadPromise: Promise<void> | null = null;

export function ensureWildSpineLoaded(): Promise<void> {
  registerWildSpineAssets();
  if (!loadPromise) {
    loadPromise = Assets.load([WILD_SKEL_ALIAS, WILD_ATLAS_ALIAS]).then(() => undefined);
  }
  return loadPromise;
}

/** One-shot reveal clips before looping idle. */
export type WildShowAnimationName = 'wild1' | 'wild2' | 'wild3';

export type WildAnimationName = 'idle' | 'idle1' | 'idle2' | 'idle3' | WildShowAnimationName;

export type CreateWildSpineOptions = {
  ticker?: Ticker;
  loop?: boolean;
  animation?: WildAnimationName;
};

const DEFAULT_WILD_TO_IDLE_MIX_SEC = 0.2;

export function idleAnimationForWildShow(show: WildShowAnimationName): 'idle1' | 'idle2' | 'idle3' {
  switch (show) {
    case 'wild1':
      return 'idle1';
    case 'wild2':
      return 'idle2';
    case 'wild3':
    default:
      return 'idle3';
  }
}

function createWildSpineInstance(ticker?: Ticker): Spine {
  return Spine.from({
    skeleton: WILD_SKEL_ALIAS,
    atlas: WILD_ATLAS_ALIAS,
    boundsProvider: new SetupPoseBoundsProvider(),
    ticker,
  });
}

/**
 * Play `wild1`–`wild3` once, then crossfade into the matching looping idle (`idle1`–`idle3`).
 */
export function applyWildShowThenIdleLoop(
  spine: Spine,
  showAnim: WildShowAnimationName,
  mixSec = DEFAULT_WILD_TO_IDLE_MIX_SEC,
): void {
  const idleAnim = idleAnimationForWildShow(showAnim);
  const state = spine.state;
  state.data.setMix(showAnim, idleAnim, mixSec);
  state.setAnimation(0, showAnim, false);
  state.addAnimation(0, idleAnim, true, 0);
  spine.update(0);
}

export function createWildSpineShowThenIdle(
  showAnim: WildShowAnimationName,
  ticker?: Ticker,
  mixSec?: number,
): Spine {
  const spine = createWildSpineInstance(ticker);
  applyWildShowThenIdleLoop(spine, showAnim, mixSec);
  return spine;
}

export function createWildSpine(options?: CreateWildSpineOptions): Spine {
  const spine = createWildSpineInstance(options?.ticker);
  const anim = options?.animation ?? 'wild1';
  spine.state.setAnimation(0, anim, options?.loop ?? true);
  spine.update(0);
  return spine;
}
