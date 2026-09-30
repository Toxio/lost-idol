import starAtlasUrl from '@/assets/symbols/star/star.atlas.txt?url';
import starJsonUrl from '@/assets/symbols/star/star.json?url';
import starPngUrl from '@/assets/symbols/star/star.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

const star = defineSymbolSpine({
  name: 'star',
  jsonUrl: starJsonUrl,
  atlasUrl: starAtlasUrl,
  images: { 'star.webp': starPngUrl },
});

export const ensureStarSpineLoaded = star.ensureLoaded;
export const createStarSpine = star.create;
export const createStarSetupPose = star.createSetupPose;
