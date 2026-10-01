import atlasUrl from '@/assets/symbols/lost-idol/compass/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/compass/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/compass/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 5.
const symbol = defineSymbolSpine({
  name: 'lost-idol-compass',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureGlassSpineLoaded = symbol.ensureLoaded;
export const createGlassSpine = symbol.create;
export const createGlassSetupPose = symbol.createSetupPose;
