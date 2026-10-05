import atlasUrl from '@/assets/symbols/lost-idol/emerald-idol/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/emerald-idol/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/emerald-idol/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 1.
const symbol = defineSymbolSpine({
  name: 'lost-idol-emerald-idol-v5',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureSevenSpineLoaded = symbol.ensureLoaded;
export const createSevenSpine = symbol.create;
export const createSevenSetupPose = symbol.createSetupPose;
