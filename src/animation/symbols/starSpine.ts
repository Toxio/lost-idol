import atlasUrl from '@/assets/symbols/lost-idol/scatter-saved/symbol-opaque.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/scatter-saved/symbol-opaque.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/scatter-saved/sheet-opaque.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 11.
const symbol = defineSymbolSpine({
  name: 'lost-idol-paying-scatter-opaque',
  jsonUrl,
  atlasUrl,
  images: { 'sheet-opaque.webp': sheetUrl },
});

export const ensureStarSpineLoaded = symbol.ensureLoaded;
export const createStarSpine = symbol.create;
export const createStarSetupPose = symbol.createSetupPose;
