import { Spine } from '@esotericsoftware/spine-pixi-v8';

import {
  createGlassSpine,
  createGobletSpine,
  createHeelsSetupPose,
  createLipsSpine,
  createLipstickSpine,
  createParfumeSpine,
  createRoseSetupPose,
  createScatterSpine,
  createSevenSpine,
  createStarSpine,
  type CreateSymbolSpineOptions,
} from '@/animation/symbols';

/** Resting frame of `win` — matches the static reel art, not setup pose. */
const SETTLED_WIN_FRAME_TIME = 0;

function freezeSpine(spine: Spine): Spine {
  spine.autoUpdate = false;
  spine.update(0);
  return spine;
}

function createSettledWinPose(
  create: (options?: CreateSymbolSpineOptions) => Spine,
  frameTime = SETTLED_WIN_FRAME_TIME,
): Spine {
  const spine = create({ animation: 'win', loop: false });
  const entry = spine.state.getCurrent(0);
  if (entry) entry.trackTime = frameTime;
  return freezeSpine(spine);
}

/** Static resting poses; animations play only in the win overlay. */
export function createSettledSymbolSpine(alias: string): Spine | null {
  switch (alias) {
    case 'sym-seven':
      return createSettledWinPose(createSevenSpine);
    case 'sym-lips':
      return createSettledWinPose(createLipsSpine);
    case 'sym-parfume':
      return createSettledWinPose(createParfumeSpine);
    case 'sym-fire2':
      return freezeSpine(createRoseSetupPose());
    case 'sym-glass':
      return createSettledWinPose(createGlassSpine);
    case 'sym-lipstick':
      return createSettledWinPose(createLipstickSpine);
    case 'sym-goblet':
      return createSettledWinPose(createGobletSpine);
    case 'heels':
      return freezeSpine(createHeelsSetupPose());
    case 'sym-bonus-door':
      return createSettledWinPose(createScatterSpine);
    case 'sym-paying-scatter':
      return createSettledWinPose(createStarSpine);
    default:
      return null;
  }
}
