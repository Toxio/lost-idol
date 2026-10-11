import atlasUrl from '@/assets/symbols/lost-idol/serpent-key/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/serpent-key/symbol-stable.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/serpent-key/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Keep the key body fixed; only the eye region plays the original blink sequence.
const symbol = defineSymbolSpine({
  name: 'lost-idol-serpent-key-stable',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureParfumeSpineLoaded = symbol.ensureLoaded;
export const createParfumeSpine = symbol.create;
export const createParfumeSetupPose = symbol.createSetupPose;
