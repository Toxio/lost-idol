import atlasUrl from '@/assets/symbols/lost-idol/bonus-door/symbol.atlas.txt?url';
import jsonUrl from '@/assets/symbols/lost-idol/bonus-door/symbol.json?url';
import sheetUrl from '@/assets/symbols/lost-idol/bonus-door/sheet.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

// Legacy API name retains the existing math symbol ID 10.
const symbol = defineSymbolSpine({
  name: 'lost-idol-bonus-door',
  jsonUrl,
  atlasUrl,
  images: { 'sheet.webp': sheetUrl },
});

export const ensureScatterSpineLoaded = symbol.ensureLoaded;
export const createScatterSpine = symbol.create;
export const SCATTER_SKEL_ALIAS = symbol.skelAlias;
export const SCATTER_ATLAS_ALIAS = symbol.atlasAlias;
