import { Assets } from 'pixi.js';
import atlas from '@/assets/transition/transition.atlas.txt?url';
import skeleton from '@/assets/transition/transition.json?url';
import image from '@/assets/transition/transition.webp?url';

export const TRANSITION_SKELETON = 'bonusTransitionSkeleton';
export const TRANSITION_ATLAS = 'bonusTransitionAtlas';
let loading: Promise<void> | null = null;
export function ensureTransitionLoaded(): Promise<void> {
  if (!loading) {
    Assets.add({ alias: TRANSITION_SKELETON, src: skeleton });
    Assets.add({ alias: TRANSITION_ATLAS, src: atlas, parser: 'spineTextureAtlasLoader',
      data: { images: { 'transition.webp': image } } });
    loading = Assets.load([TRANSITION_SKELETON, TRANSITION_ATLAS]).then(() => undefined);
  }
  return loading;
}
