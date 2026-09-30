import scatterAtlasUrl from '@/assets/symbols/scatter_box/scatter_box.atlas.txt?url';
import scatterJsonUrl from '@/assets/symbols/scatter_box/scatter_box.json?url';
import scatterPngUrl from '@/assets/symbols/scatter_box/scatter_box.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

const scatter = defineSymbolSpine({
  name: 'scatter',
  jsonUrl: scatterJsonUrl,
  atlasUrl: scatterAtlasUrl,
  images: { 'scatter_box.webp': scatterPngUrl },
});

// Aliases are consumed directly by `reels/scene/assets.ts` to bake the static
// reel-strip texture from the same skeleton.
export const SCATTER_SKEL_ALIAS = scatter.skelAlias;
export const SCATTER_ATLAS_ALIAS = scatter.atlasAlias;

export const ensureScatterSpineLoaded = scatter.ensureLoaded;
export const createScatterSpine = scatter.create;
