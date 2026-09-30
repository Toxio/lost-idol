import { Spine } from '@esotericsoftware/spine-pixi-v8';

import {
  createGlassSpine,
  createGobletSpine,
  createHeelsSpine,
  createLipsSpine,
  createLipstickSpine,
  createParfumeSpine,
  createRoseSpine,
  createScatterSpine,
  createSevenSpine,
  createStarSpine,
  type CreateSymbolSpineOptions,
} from '@/animation/symbols';

/** Resting frame of `win` — matches the static reel art, not setup pose. */
const SETTLED_WIN_FRAME_TIME = 0;
/** Scatter `scale` bone is unstable at setup pose — freeze `win` at its resting keyframe. */
const SCATTER_REST_FRAME_TIME = 1.0;

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

/** High-quality static pose from the same Spine atlases used by win animations. */
export function createSettledSymbolSpine(alias: string): Spine | null {
  switch (alias) {
    case 'sym-seven':
      return createSettledWinPose(createSevenSpine);
    case 'sym-lips':
      return createSettledWinPose(createLipsSpine);
    case 'sym-parfume':
      return createSettledWinPose(createParfumeSpine);
    case 'sym-rose':
      return createSettledWinPose(createRoseSpine);
    case 'sym-glass':
      return createSettledWinPose(createGlassSpine);
    case 'sym-lipstick':
      return createSettledWinPose(createLipstickSpine);
    case 'sym-goblet':
      return createSettledWinPose(createGobletSpine);
    case 'heels':
      return createSettledWinPose(createHeelsSpine);
    case 'sym-scatter':
      return createSettledWinPose(createScatterSpine, SCATTER_REST_FRAME_TIME);
    case 'sym-star':
      return createSettledWinPose(createStarSpine);
    default:
      return null;
  }
}
