import atlasUrl from '@/assets/symbols/lost-idol/scarab/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/scarab/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/scarab/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 11.
const symbol = defineSymbolSpine({
  name: 'lost-idol-paying-scarab',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureStarSpineLoaded = symbol.ensureLoaded;
export const createStarSpine = symbol.create;
export const createStarSetupPose = symbol.createSetupPose;
