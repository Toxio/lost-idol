import atlasUrl from '@/assets/symbols/lost-idol/serpent-key/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/serpent-key/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/serpent-key/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 3.
const symbol = defineSymbolSpine({
  name: 'lost-idol-serpent-key',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureParfumeSpineLoaded = symbol.ensureLoaded;
export const createParfumeSpine = symbol.create;
export const createParfumeSetupPose = symbol.createSetupPose;
