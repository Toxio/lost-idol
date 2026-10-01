import { Texture } from 'pixi.js';

import {
  heelsImg,
  glassImg,
  gobletImg,
  lipsImg,
  lipstickImg,
  parfumeImg,
  roseImg,
  scatterImg,
  sevenImg,
  starImg,
  wildImg,
} from '@/assets/symbols/images';
/** Moving and resting symbols use the same Lost Idol artwork. */
export function resolveSymbolTexture(alias: string): Texture {
  return Texture.from(alias);
}

export const ALL_ASSETS = [
  { alias: 'heels', src: heelsImg },
  { alias: 'sym-bonus-door', src: scatterImg },
  { alias: 'sym-rose', src: roseImg },
  { alias: 'sym-paying-scatter', src: starImg },
  { alias: 'sym-goblet', src: gobletImg },
  { alias: 'sym-seven', src: sevenImg },
  { alias: 'sym-lips', src: lipsImg },
  { alias: 'sym-lipstick', src: lipstickImg },
  { alias: 'sym-parfume', src: parfumeImg },
  { alias: 'sym-glass', src: glassImg },
  { alias: 'sym-wild', src: wildImg },
] as const;

/**
 * Server symbol index → reel sprite alias.
 * Prefix `sym-` avoids Pixi `Assets` clashes with Spine atlas page keys (e.g. `seven.webp` resolving as alias `seven`).
 */
const SYMBOL_MAP: Record<number, string> = {
  1: 'sym-seven',
  2: 'sym-lips',
  3: 'sym-parfume',
  4: 'sym-rose',
  5: 'sym-glass',
  6: 'sym-lipstick',
  7: 'sym-goblet',
  8: 'heels',
  9: 'sym-wild',
  10: 'sym-bonus-door',
  11: 'sym-paying-scatter',
};

const SYMBOL_ALIASES = Object.values(SYMBOL_MAP);

export function symbolAlias(serverIdx: number): string {
  return SYMBOL_MAP[serverIdx] ?? 'sym-seven';
}

export function randomAlias(): string {
  return SYMBOL_ALIASES[Math.floor(Math.random() * SYMBOL_ALIASES.length)];
}
