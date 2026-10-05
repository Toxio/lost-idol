import atlasUrl from '@/assets/symbols/lost-idol/treasure-map/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/treasure-map/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/treasure-map/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 8.
const symbol = defineSymbolSpine({
  name: 'lost-idol-treasure-map-v2',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureHeelsSpineLoaded = symbol.ensureLoaded;
export const createHeelsSpine = symbol.create;
export const createHeelsSetupPose = symbol.createSetupPose;
