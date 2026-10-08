import { type Spine } from '@esotericsoftware/spine-pixi-v8';
import type { Application, Container } from 'pixi.js';
import type { RefObject } from 'react';

import { createWildSpine } from '@/animation/wildSpine';
import { DESIGN_HEIGHT, DESIGN_WIDTH, REEL_COUNT, VISIBLE_ROWS } from '../constants';
import { getSlotGridMetrics } from '../lib/grid';
import { layoutWildIdleInCell } from '../winCycle/spineWin';
import { setSlotSymbolVisibility } from '../scene/symbolSprites';
import { WILD_SERVER_IDX } from '../winCycle/symbolUtils';
import type { Reel } from '../types';

export interface WildIdleEntry {
  spine: Spine;
  col: number;
  row: number;
}

export interface WildIdleOverlayContext {
  app: Application;
  winOverlayRef: RefObject<Container | null>;
  wildIdleSpinesRef: RefObject<WildIdleEntry[]>;
  reelsRef: RefObject<Reel[]>;
  skipCols?: readonly number[];
  playAppearance?: boolean;
}

function settledStripIndexForRow(row: number): number {
  return row + 1;
}

function hasWildIdleAt(entries: readonly WildIdleEntry[], col: number, row: number): boolean {
  return entries.some((entry) => entry.col === col && entry.row === row);
}

/** Attach looping wild idle for one landed column (idempotent per cell). */
export function attachWildIdleColumnOverlays(
  col: number,
  source: number[][] | null | undefined,
  ctx: WildIdleOverlayContext,
): void {
  if (!source?.[col]) return;
  if (ctx.skipCols?.includes(col)) return;

  const overlay = ctx.winOverlayRef.current;
  if (!overlay) return;

  const { gridX, gridY, cellW, cellH } = getSlotGridMetrics(DESIGN_WIDTH, DESIGN_HEIGHT);

  for (let row = 0; row < VISIBLE_ROWS; row++) {
    if (hasWildIdleAt(ctx.wildIdleSpinesRef.current, col, row)) continue;
    if (source[col][row] !== WILD_SERVER_IDX) continue;

    const spine = createWildSpine({ animation: 'idle', loop: true, ticker: ctx.app.ticker });
    const absX = gridX + col * cellW + cellW / 2;
    const absY = gridY + row * cellH + cellH / 2;
    layoutWildIdleInCell(spine, absX, absY, cellW, cellH);
    const idle = spine.state.setAnimation(0, 'idle', true);
    // Restoring the standing monkey after a win must start with the rest,
    // not immediately repeat the chest beat that just finished.
    idle.trackTime = ctx.playAppearance ? 0 : 2.25;
    spine.update(0);
    overlay.addChild(spine);
    ctx.wildIdleSpinesRef.current.push({ spine, col, row });

    const sym = ctx.reelsRef.current[col]?.symbols[settledStripIndexForRow(row)];
    if (sym) setSlotSymbolVisibility(sym, false);
  }
}

/** Fill any missing wild idle overlays — does not destroy existing entries. */
export function syncAllWildIdleOverlays(
  source: number[][] | null | undefined,
  ctx: WildIdleOverlayContext,
): void {
  if (!source?.length) return;
  ctx.wildIdleSpinesRef.current = ctx.wildIdleSpinesRef.current.filter(entry => {
    if (source[entry.col]?.[entry.row] === WILD_SERVER_IDX) return true;
    entry.spine.removeFromParent();
    entry.spine.destroy();
    return false;
  });
  for (let col = 0; col < REEL_COUNT; col++) {
    attachWildIdleColumnOverlays(col, source, ctx);
  }
}
