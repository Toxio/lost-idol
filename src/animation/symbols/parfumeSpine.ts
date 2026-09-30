import parfumeAtlasUrl from '@/assets/symbols/parfume/parfume.atlas.txt?url';
import parfumeJsonUrl from '@/assets/symbols/parfume/parfume.json?url';
import parfumePngUrl from '@/assets/symbols/parfume/parfume.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

const parfume = defineSymbolSpine({
  name: 'parfume',
  jsonUrl: parfumeJsonUrl,
  atlasUrl: parfumeAtlasUrl,
  images: { 'parfume.webp': parfumePngUrl },
});

export const ensureParfumeSpineLoaded = parfume.ensureLoaded;
export const createParfumeSpine = parfume.create;
export const createParfumeSetupPose = parfume.createSetupPose;
