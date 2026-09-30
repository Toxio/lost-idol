import lipstickAtlasUrl from '@/assets/symbols/lipstick/lipstick.atlas.txt?url';
import lipstickJsonUrl from '@/assets/symbols/lipstick/lipstick.json?url';
import lipstickPngUrl from '@/assets/symbols/lipstick/lipstick.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

const lipstick = defineSymbolSpine({
  name: 'lipstick',
  jsonUrl: lipstickJsonUrl,
  atlasUrl: lipstickAtlasUrl,
  images: { 'lipstick.webp': lipstickPngUrl },
});

export const ensureLipstickSpineLoaded = lipstick.ensureLoaded;
export const createLipstickSpine = lipstick.create;
export const createLipstickSetupPose = lipstick.createSetupPose;
