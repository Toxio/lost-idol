import atlasUrl from '@/assets/symbols/lost-idol/emerald-torch/fire-clean.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/emerald-torch/fire-clean.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/emerald-torch/fire2-sheet.webp?url';
import cleanStaticUrl from '@/assets/symbols/lost-idol/emerald-torch/fire-clean-static.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 4.
const symbol = defineSymbolSpine({
  name: 'lost-idol-fire-torch-clean-v5',
  jsonUrl,
  atlasUrl,
  images: { 'fire2-sheet.webp': sheetUrl, 'fire-clean-static.webp': cleanStaticUrl },
});

export const ensureRoseSpineLoaded = symbol.ensureLoaded;
export const createRoseSpine = symbol.create;
export const createRoseSetupPose = symbol.createSetupPose;
