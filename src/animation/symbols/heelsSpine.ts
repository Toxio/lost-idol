import heelsAtlasUrl from '@/assets/symbols/heels/heels.atlas.txt?url';
import heelsJsonUrl from '@/assets/symbols/heels/heels.json?url';
import heelsPngUrl from '@/assets/symbols/heels/heels.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

const heels = defineSymbolSpine({
  name: 'heels',
  jsonUrl: heelsJsonUrl,
  atlasUrl: heelsAtlasUrl,
  images: { 'heels.webp': heelsPngUrl },
});

export const ensureHeelsSpineLoaded = heels.ensureLoaded;
export const createHeelsSpine = heels.create;
export const createHeelsSetupPose = heels.createSetupPose;
