import gobletAtlasUrl from '@/assets/symbols/goblet/goblet.atlas.txt?url';
import gobletJsonUrl from '@/assets/symbols/goblet/goblet.json?url';
import gobletPngUrl from '@/assets/symbols/goblet/goblet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

const goblet = defineSymbolSpine({
  name: 'goblet',
  jsonUrl: gobletJsonUrl,
  atlasUrl: gobletAtlasUrl,
  images: { 'goblet.webp': gobletPngUrl },
});

export const ensureGobletSpineLoaded = goblet.ensureLoaded;
export const createGobletSpine = goblet.create;
export const createGobletSetupPose = goblet.createSetupPose;
