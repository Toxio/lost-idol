import { type Spine } from '@esotericsoftware/spine-pixi-v8';
import { AlphaFilter, type Container, type Ticker } from 'pixi.js';
import type { RefObject } from 'react';

import { DESIGN_HEIGHT, DESIGN_WIDTH, REEL_COUNT, VISIBLE_ROWS } from '../constants';
import { getSlotGridMetrics } from '../lib/grid';
import { layoutSpineInCell } from '../winCycle/spineWin';
import { symbolAlias } from './assets';
import { createSettledSymbolSpine } from './settledSymbolSpine';
import { setSlotSymbolVisibility } from './symbolSprites';
import { WILD_SERVER_IDX } from '../winCycle/symbolUtils';
import type { Reel } from '../types';

export interface SettledSymbolEntry {
  spine: Spine;
  col: number;
  row: number;
  baseY: number;
  serverIdx: number;
}

export interface SettledOverlayContext {
  ticker: Ticker;
  settledOverlayRef: RefObject<Container | null>;
  settledSymbolSpinesRef: RefObject<SettledSymbolEntry[]>;
  reelsRef: RefObject<Reel[]>;
  skipCols?: readonly number[];
}

function settledStripIndexForRow(row: number): number {
  return row + 1;
}

function hasSettledSpineAt(
  entries: readonly SettledSymbolEntry[],
  col: number,
  row: number,
): boolean {
  return entries.some((entry) => entry.col === col && entry.row === row);
}

export function clearSettledSymbolOverlays(
  settledOverlayRef: RefObject<Container | null>,
  settledSymbolSpinesRef: RefObject<SettledSymbolEntry[]>,
): void {
  for (const { spine } of settledSymbolSpinesRef.current) {
    if (spine.parent) spine.parent.removeChild(spine);
    spine.destroy();
  }
  settledSymbolSpinesRef.current = [];
  settledOverlayRef.current?.removeChildren();
}

/** Attach sharp overlay spines for one landed column (idempotent per cell). */
export function attachSettledColumnOverlays(
  col: number,
  source: number[][] | null | undefined,
  ctx: SettledOverlayContext,
): void {
  if (!source?.[col]) return;

  const overlay = ctx.settledOverlayRef.current;
  if (!overlay) return;
  if (ctx.skipCols?.includes(col)) return;

  const { gridX, gridY, cellW, cellH } = getSlotGridMetrics(DESIGN_WIDTH, DESIGN_HEIGHT);

  for (let row = 0; row < VISIBLE_ROWS; row++) {
    if (hasSettledSpineAt(ctx.settledSymbolSpinesRef.current, col, row)) continue;

    const serverIdx = source[col][row];
    if (serverIdx === undefined || serverIdx < 0 || serverIdx === WILD_SERVER_IDX) continue;

    const spine = createSettledSymbolSpine(symbolAlias(serverIdx));
    if (!spine) continue;

    const absX = gridX + col * cellW + cellW / 2;
    const absY = gridY + row * cellH + cellH / 2;
    layoutSpineInCell(spine, absX, absY, cellW, cellH);
    overlay.addChild(spine);
    ctx.settledSymbolSpinesRef.current.push({ spine, col, row, baseY: spine.position.y, serverIdx });

    const sym = ctx.reelsRef.current[col]?.symbols[settledStripIndexForRow(row)];
    if (sym) setSlotSymbolVisibility(sym, false);
  }
}

/** Fill any missing settled overlays — does not destroy existing entries (no blink). */
export function syncAllSettledOverlays(
  source: number[][] | null | undefined,
  ctx: SettledOverlayContext,
): void {
  if (!source?.length) return;
  ctx.settledSymbolSpinesRef.current = ctx.settledSymbolSpinesRef.current.filter(entry => {
    if (source[entry.col]?.[entry.row] === entry.serverIdx) return true;
    entry.spine.removeFromParent();
    entry.spine.destroy();
    return false;
  });
  for (let col = 0; col < REEL_COUNT; col++) {
    attachSettledColumnOverlays(col, source, ctx);
  }
}

export function hideSettledOverlaysForColumns(
  entries: readonly SettledSymbolEntry[],
  cols: readonly number[],
): void {
  const colSet = new Set(cols);
  for (const { spine, col } of entries) {
    if (colSet.has(col)) spine.visible = false;
  }
}

export function setSettledSpinesVisible(
  entries: readonly SettledSymbolEntry[],
  cells: readonly { col: number; row: number }[],
  visible: boolean,
): void {
  const keys = new Set(cells.map(({ col, row }) => `${col},${row}`));
  for (const { spine, col, row } of entries) {
    if (keys.has(`${col},${row}`)) spine.visible = visible;
  }
}

export function setSettledSpinesDimmed(
  entries: readonly SettledSymbolEntry[],
  activeCells: ReadonlySet<string>,
  dimAlpha: number,
): void {
  for (const { spine, col, row } of entries) {
    spine.alpha = 1;
    if (activeCells.has(`${col},${row}`)) {
      spine.filters = null;
      continue;
    }
    // AlphaFilter composites all spine slots into one buffer before applying
    // opacity — avoids the "seams" you get when overlapping slots each render
    // semi-transparent independently.
    const existing = (spine.filters as AlphaFilter[] | null)?.[0];
    if (existing instanceof AlphaFilter) {
      existing.alpha = dimAlpha;
    } else {
      spine.filters = [
        new AlphaFilter({ alpha: dimAlpha, resolution: 'inherit', antialias: 'inherit' }),
      ];
    }
  }
}

/** Keep PNG sprites hidden wherever a sharp overlay spine already covers the cell. */
export function syncOverlaySpriteVisibility(
  reelsRef: RefObject<Reel[]>,
  settledSymbolSpinesRef: RefObject<SettledSymbolEntry[]>,
  wildIdleSpinesRef?: RefObject<Array<{ col: number; row: number }>>,
): void {
  const hiddenKeys = new Set<string>();
  for (const { col, row } of settledSymbolSpinesRef.current) {
    hiddenKeys.add(`${col},${row}`);
  }
  if (wildIdleSpinesRef) {
    for (const { col, row } of wildIdleSpinesRef.current) {
      hiddenKeys.add(`${col},${row}`);
    }
  }

  for (let col = 0; col < reelsRef.current.length; col++) {
    const reel = reelsRef.current[col];
    if (!reel) continue;
    for (let row = 0; row < VISIBLE_ROWS; row++) {
      const sym = reel.symbols[settledStripIndexForRow(row)];
      if (sym) setSlotSymbolVisibility(sym, !hiddenKeys.has(`${col},${row}`));
    }
  }
}
