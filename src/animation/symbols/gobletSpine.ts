import atlasUrl from '@/assets/symbols/lost-idol/stone-chalice/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/stone-chalice/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/stone-chalice/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 7.
const symbol = defineSymbolSpine({
  name: 'lost-idol-stone-chalice',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureGobletSpineLoaded = symbol.ensureLoaded;
export const createGobletSpine = symbol.create;
export const createGobletSetupPose = symbol.createSetupPose;
