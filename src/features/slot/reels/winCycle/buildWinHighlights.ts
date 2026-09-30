import type { Ticker } from "pixi.js";

import { createPaylineAnimation } from "@/animation/lineAnimation";
import {
  findMatrixCellsForSymbol,
  getPaylineForLineId,
  isScatterWinLine,
} from "@/config/paylines";
import type { WinLine } from "@/api/gameTypes";
import { REEL_COUNT, SCATTER_WIN_SHOW_MS } from "../constants";
import { isWinLineMatrixSymbol } from "./symbolUtils";
import type { WinCell, WinHighlight } from "../types";

interface GridMetrics {
  gridX: number;
  gridY: number;
  cellW: number;
  cellH: number;
}

interface BuildWinHighlightsOptions {
  winLines: WinLine[];
  gridMatrix: number[][];
  expandingWild: number[];
  metrics: GridMetrics;
  ticker: Ticker;
}

/**
 * Convert server win-line data into renderable highlight cycles.
 * Pure transform — no PixiJS scene mutation here; only payline-animation objects are constructed
 * (caller adds them to the stage and disposes via `paylineAnim.destroy()`).
 */
export function buildWinHighlights({
  winLines,
  gridMatrix,
  expandingWild,
  metrics,
  ticker,
}: BuildWinHighlightsOptions): WinHighlight[] {
  const highlights: WinHighlight[] = [];

  for (const win of winLines) {
    const serverIdx = win.symbol;

    if (isScatterWinLine(win.line)) {
      const scatterCells = findMatrixCellsForSymbol(
        gridMatrix,
        serverIdx,
        win.count,
      );
      if (scatterCells.length === 0) continue;
      highlights.push({
        cells: scatterCells.map(({ col, row }) => ({
          col,
          row,
          animIdx: serverIdx,
          matrixIdx: gridMatrix[col]?.[row] ?? serverIdx,
        })),
        paylineAnim: null,
        showMs: SCATTER_WIN_SHOW_MS,
        winAmount: win.winAmount,
      });
      continue;
    }

    const payline = getPaylineForLineId(win.line);
    if (!payline) continue;

    const cells: WinCell[] = [];
    for (let col = 0; col < win.count && col < REEL_COUNT; col++) {
      if (expandingWild[col]) continue;
      const row = payline[col] ?? 1;
      const matrixIdx = gridMatrix[col]?.[row] ?? -1;
      if (!isWinLineMatrixSymbol(matrixIdx, serverIdx)) continue;
      cells.push({ col, row, animIdx: serverIdx, matrixIdx });
    }

    if (cells.length === 0) continue;

    const anim = createPaylineAnimation(win.line, payline, {
      ...metrics,
      ticker,
    });
    highlights.push({
      cells,
      paylineAnim: anim,
      showMs: anim.durationMs,
      winAmount: win.winAmount,
    });
  }

  return highlights;
}
