import atlasUrl from '@/assets/symbols/lost-idol/gold-satchel/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/gold-satchel/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/gold-satchel/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 2.
const symbol = defineSymbolSpine({
  name: 'lost-idol-gold-satchel',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureLipsSpineLoaded = symbol.ensureLoaded;
export const createLipsSpine = symbol.create;
export const createLipsSetupPose = symbol.createSetupPose;
