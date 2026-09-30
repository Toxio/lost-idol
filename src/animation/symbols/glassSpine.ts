import glassAtlasUrl from '@/assets/glass/glass.atlas.txt?url';
import glassJsonUrl from '@/assets/glass/glass.json?url';
import glassPngUrl from '@/assets/glass/glass.webp?url';
import { defineSymbolSpine } from './symbolSpineFactory';

const glass = defineSymbolSpine({
  name: 'glass',
  jsonUrl: glassJsonUrl,
  atlasUrl: glassAtlasUrl,
  images: { 'glass.webp': glassPngUrl },
});

export const ensureGlassSpineLoaded = glass.ensureLoaded;
export const createGlassSpine = glass.create;
export const createGlassSetupPose = glass.createSetupPose;
