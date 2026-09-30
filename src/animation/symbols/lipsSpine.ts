import lipsAtlasUrl from '@/assets/symbols/lips/lips.atlas.txt?url';
import lipsJsonUrl from '@/assets/symbols/lips/lips.json?url';
import lipsPngUrl from '@/assets/symbols/lips/lips.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

const lips = defineSymbolSpine({
  name: 'lips',
  jsonUrl: lipsJsonUrl,
  atlasUrl: lipsAtlasUrl,
  images: { 'lips.webp': lipsPngUrl },
});

export const ensureLipsSpineLoaded = lips.ensureLoaded;
export const createLipsSpine = lips.create;
export const createLipsSetupPose = lips.createSetupPose;
