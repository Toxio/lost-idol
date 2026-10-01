import atlasUrl from '@/assets/symbols/lost-idol/emerald-torch/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/emerald-torch/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/emerald-torch/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 4.
const symbol = defineSymbolSpine({
  name: 'lost-idol-emerald-torch',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureRoseSpineLoaded = symbol.ensureLoaded;
export const createRoseSpine = symbol.create;
export const createRoseSetupPose = symbol.createSetupPose;
