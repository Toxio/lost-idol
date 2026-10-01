import atlasUrl from '@/assets/symbols/lost-idol/machete/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/machete/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/machete/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 6.
const symbol = defineSymbolSpine({
  name: 'lost-idol-machete',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureLipstickSpineLoaded = symbol.ensureLoaded;
export const createLipstickSpine = symbol.create;
export const createLipstickSetupPose = symbol.createSetupPose;
