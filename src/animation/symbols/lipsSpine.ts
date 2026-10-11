import atlasUrl from '@/assets/symbols/lost-idol/gold-satchel/symbol-v2.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/gold-satchel/symbol-fixed-body.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/gold-satchel/sheet-v2.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// A fixed body and complementary Spine clips prevent frame-to-frame size pulsing.
const symbol = defineSymbolSpine({
  name: 'lost-idol-chest-fixed-body',
  jsonUrl,
  atlasUrl,
  images: { 'banana-chest-sheet.webp': sheetUrl },
});

export const ensureLipsSpineLoaded = symbol.ensureLoaded;
export const createLipsSpine = symbol.create;
export const createLipsSetupPose = symbol.createSetupPose;
