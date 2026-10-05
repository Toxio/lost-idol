import { Spine } from '@esotericsoftware/spine-pixi-v8';
import type { Ticker } from 'pixi.js';
import { isBonusDoorSpine } from '@/animation/symbols/scatterSpine';

import {
  createGlassSpine,
  createGobletSpine,
  createHeelsSpine,
  createLipsSpine,
  createLipstickSpine,
  createParfumeSpine,
  createRoseSpine,
  createScatterSpine,
  createSevenSpine,
  createStarSpine,
} from '@/animation/symbols';
import {
  createWildSpineShowThenIdle,
  isWildSpine,
  type WildShowAnimationName,
} from '@/animation/wildSpine';

const SPINE_CELL_SCALE = 0.82;

/** The monkey occupies one cell both at rest and in an expanded column. */
export const layoutWildIdleInCell = layoutSpineInCell;

export function wildAnimationForRow(row: number): WildShowAnimationName {
  return row === 0 ? 'wild1' : row === 2 ? 'wild3' : 'wild2';
}

/** One shot per payline highlight — no chained repeat (see symbol_fx the same). */
function winSpineOnce(spine: Spine, animationName: string): Spine {
  spine.state.setAnimation(0, animationName, false);
  spine.update(0);
  return spine;
}

/** Win Spine for server symbol index (1-based). `row` required for wild (9) → wild1/2/3. */
export function createWinSpineForSymbol(
  serverIdx: number,
  ticker: Ticker,
  row?: number,
): Spine | null {
  switch (serverIdx) {
    case 1:
      return winSpineOnce(createSevenSpine({ loop: false, ticker }), 'win');
    case 2:
      return winSpineOnce(createLipsSpine({ loop: false, animation: 'win', ticker }), 'win');
    case 3:
      return winSpineOnce(createParfumeSpine({ loop: false, ticker }), 'win');
    case 4:
      return winSpineOnce(createRoseSpine({ loop: false, ticker }), 'win');
    case 5:
      return winSpineOnce(createGlassSpine({ loop: false, animation: 'win', ticker }), 'win');
    case 6:
      return winSpineOnce(createLipstickSpine({ loop: false, ticker }), 'win');
    case 7:
      return winSpineOnce(createGobletSpine({ loop: false, ticker }), 'win');
    case 8:
      return winSpineOnce(createHeelsSpine({ loop: false, animation: 'win', ticker }), 'win');
    case 9: {
      const r = row ?? 1;
      const anim = wildAnimationForRow(r);
      return createWildSpineShowThenIdle(anim, ticker);
    }
    case 10:
      return winSpineOnce(createScatterSpine({ loop: false, animation: 'win', ticker }), 'win');
    case 11:
      return winSpineOnce(createStarSpine({ loop: false, animation: 'win', ticker }), 'win');
    default:
      return null;
  }
}

/** Scale and centre a Spine inside one reel cell (same padding as static sprites). */
export function layoutSpineInCell(
  spine: Spine,
  absX: number,
  absY: number,
  cellW: number,
  cellH: number,
): void {
  spine.update(0);
  // Match the moving door's full 256px texture, including transparent padding.
  // Clipping and perimeter graphics must not change the door's fit or centre.
  if (isBonusDoorSpine(spine)) {
    spine.scale.set(Math.min(cellW * SPINE_CELL_SCALE / 256, cellH * SPINE_CELL_SCALE / 256));
    spine.position.set(absX, absY);
    return;
  }
  const lb = spine.getLocalBounds();
  const bw = lb.width > 0 ? lb.width : 1;
  const bh = lb.height > 0 ? lb.height : 1;
  const fit = SPINE_CELL_SCALE * (isWildSpine(spine) ? 1.8 : 1);
  const s = Math.min((cellW * fit) / bw, (cellH * fit) / bh);
  spine.scale.set(s);
  spine.position.set(absX - (lb.x + lb.width / 2) * s, absY - (lb.y + lb.height / 2) * s);
}

/** Background `symbol_fx` only — larger fit than {@link layoutSpineInCell} so glow extends past the symbol. */
const SYMBOL_FX_CELL_SCALE_MUL = 1.8;

export function layoutSymbolFxInCell(
  spine: Spine,
  absX: number,
  absY: number,
  cellW: number,
  cellH: number,
): void {
  spine.update(0);
  const lb = spine.getLocalBounds();
  const bw = lb.width > 0 ? lb.width : 1;
  const bh = lb.height > 0 ? lb.height : 1;
  const pad = SPINE_CELL_SCALE * SYMBOL_FX_CELL_SCALE_MUL;
  const s = Math.min((cellW * pad) / bw, (cellH * pad) / bh);
  spine.scale.set(s);
  spine.position.set(absX - (lb.x + lb.width / 2) * s, absY - (lb.y + lb.height / 2) * s);
}
