import roseAtlasUrl from '@/assets/symbols/rose/rose.atlas.txt?url';
import roseJsonUrl from '@/assets/symbols/rose/rose.json?url';
import rosePngUrl from '@/assets/symbols/rose/rose.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

const rose = defineSymbolSpine({
  name: 'rose',
  jsonUrl: roseJsonUrl,
  atlasUrl: roseAtlasUrl,
  images: { 'rose.webp': rosePngUrl },
});

export const ensureRoseSpineLoaded = rose.ensureLoaded;
export const createRoseSpine = rose.create;
export const createRoseSetupPose = rose.createSetupPose;
