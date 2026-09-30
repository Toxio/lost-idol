import sevenAtlasUrl from '@/assets/symbols/seven/seven.atlas.txt?url';
import sevenJsonUrl from '@/assets/symbols/seven/seven.json?url';
import sevenPngUrl from '@/assets/symbols/seven/seven.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

const seven = defineSymbolSpine({
  name: 'seven',
  jsonUrl: sevenJsonUrl,
  atlasUrl: sevenAtlasUrl,
  images: { 'seven.webp': sevenPngUrl },
});

export const ensureSevenSpineLoaded = seven.ensureLoaded;
export const createSevenSpine = seven.create;
export const createSevenSetupPose = seven.createSetupPose;
