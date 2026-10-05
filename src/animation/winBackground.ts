import atlasUrl from '@/assets/reel/win-background.atlas.txt?url';
import jsonUrl from '@/assets/reel/win-background.json?url';
import sheetUrl from '@/assets/reel/win-background.webp?url';
import { defineSymbolSpine } from '@/animation/symbols/symbolSpineFactory';
const effect = defineSymbolSpine({ name: 'lost-idol-win-background', atlasUrl, jsonUrl, images: { 'win-background.webp': sheetUrl } });
export const ensureWinBackgroundLoaded = effect.ensureLoaded;
export const createWinBackground = effect.create;
