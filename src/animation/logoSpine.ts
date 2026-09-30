import { SetupPoseBoundsProvider, Spine } from '@esotericsoftware/spine-pixi-v8';
import { Assets, type Ticker } from 'pixi.js';

import logoLandAtlasUrl from '@/assets/logo/logo_land/logo_land.atlas.txt?url';
import logoLandJsonUrl from '@/assets/logo/logo_land/logo_land.json?url';
import logoLandPngUrl from '@/assets/logo/logo_land/logo_land.webp?url';
import logoPortAtlasUrl from '@/assets/logo/logo_port/logo_port.atlas.txt?url';
import logoPortJsonUrl from '@/assets/logo/logo_port/logo_port.json?url';
import logoPortPngUrl from '@/assets/logo/logo_port/logo_port.webp?url';

const LAND_SKEL_ALIAS = 'logoLandJson';
const LAND_ATLAS_ALIAS = 'logoLandAtlas';
const PORT_SKEL_ALIAS = 'logoPortJson';
const PORT_ATLAS_ALIAS = 'logoPortAtlas';

/** Native skeleton dimensions from JSON bounding boxes. */
export const LOGO_LAND_W = 677;
export const LOGO_LAND_H = 233.38;
export const LOGO_PORT_W = 271.25;
export const LOGO_PORT_H = 369;

let registeredLand = false;
let registeredPort = false;

function registerLandAssets(): void {
  if (registeredLand) return;
  Assets.add({ alias: LAND_SKEL_ALIAS, src: logoLandJsonUrl });
  Assets.add({
    alias: LAND_ATLAS_ALIAS,
    src: logoLandAtlasUrl,
    parser: 'spineTextureAtlasLoader',
    data: { images: { 'logo_land.webp': logoLandPngUrl } },
  });
  registeredLand = true;
}

function registerPortAssets(): void {
  if (registeredPort) return;
  Assets.add({ alias: PORT_SKEL_ALIAS, src: logoPortJsonUrl });
  Assets.add({
    alias: PORT_ATLAS_ALIAS,
    src: logoPortAtlasUrl,
    parser: 'spineTextureAtlasLoader',
    data: { images: { 'logo_port.webp': logoPortPngUrl } },
  });
  registeredPort = true;
}

let loadLandPromise: Promise<void> | null = null;
let loadPortPromise: Promise<void> | null = null;

export function ensureLogoLandLoaded(): Promise<void> {
  registerLandAssets();
  if (!loadLandPromise) {
    loadLandPromise = Assets.load([LAND_SKEL_ALIAS, LAND_ATLAS_ALIAS]).then(() => undefined);
  }
  return loadLandPromise;
}

export function ensureLogoPortLoaded(): Promise<void> {
  registerPortAssets();
  if (!loadPortPromise) {
    loadPortPromise = Assets.load([PORT_SKEL_ALIAS, PORT_ATLAS_ALIAS]).then(() => undefined);
  }
  return loadPortPromise;
}

export function createLogoLandSpine(ticker?: Ticker): Spine {
  const spine = Spine.from({
    skeleton: LAND_SKEL_ALIAS,
    atlas: LAND_ATLAS_ALIAS,
    boundsProvider: new SetupPoseBoundsProvider(),
    ticker,
  });
  spine.state.setAnimation(0, 'idle', true);
  spine.update(0);
  return spine;
}

export function createLogoPortSpine(ticker?: Ticker): Spine {
  const spine = Spine.from({
    skeleton: PORT_SKEL_ALIAS,
    atlas: PORT_ATLAS_ALIAS,
    boundsProvider: new SetupPoseBoundsProvider(),
    ticker,
  });
  spine.state.setAnimation(0, 'idle', true);
  spine.update(0);
  return spine;
}

export type LogoVerticalAlign = 'top' | 'center';

/** Scale spine to fit inside the canvas, no distortion. */
export function layoutLogoSpine(
  spine: Spine,
  nativeW: number,
  nativeH: number,
  canvasW: number,
  canvasH: number,
  verticalAlign: LogoVerticalAlign = 'center',
): void {
  const scale = Math.min(canvasW / nativeW, canvasH / nativeH);
  const scaledH = nativeH * scale;
  const y = verticalAlign === 'top' ? scaledH / 2 : canvasH / 2;

  spine.scale.set(scale);
  spine.position.set(canvasW / 2, y);
}
