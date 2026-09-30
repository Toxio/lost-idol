import type { Application, Container } from "pixi.js";
import { type RefObject, useEffect } from "react";

import type { WinLine } from "@/api/gameTypes";
import { buildWinHighlights } from "./buildWinHighlights";
import { DESIGN_HEIGHT, DESIGN_WIDTH, REEL_COUNT } from "../constants";
import { getSlotGridMetrics } from "../lib/grid";
import { setSlotSymbolVisibility } from "../scene/symbolSprites";
import type { Reel, WinHighlight } from "../types";

interface UseWinLinesSetupOptions {
  app: Application | null;
  spinning: boolean;
  matrix: number[][];
  targetMatrix: number[][] | null;
  winLines: WinLine[];
  expandingWild: number[];
  /** Bumps when reel strips are rebuilt or Spine assets become ready. */
  sceneAssetsEpoch: number;
  loadedRef: RefObject<boolean>;
  spineReadyRef: RefObject<boolean>;
  reelsRef: RefObject<Reel[]>;
  matrixRef: RefObject<number[][]>;
  paylineLayerRef: RefObject<Container | null>;
  winHighlightsRef: RefObject<WinHighlight[]>;
  paylineCycleIdxRef: RefObject<number>;
  paylineCycleElapsedRef: RefObject<number>;
  paylineInDelayRef: RefObject<boolean>;
  winCycleFiredRef: RefObject<boolean>;
  expandingWildColsRef: RefObject<number[]>;
  applyMatrixToAllReelsRef: RefObject<(source: number[][]) => void>;
  activateWinLineRef: RefObject<((idx: number) => void) | null>;
  presentedAccumRef: RefObject<number>;
  finalWinAmountRef: RefObject<number | null>;
  onPresentedWinChangeRef: RefObject<((amount: number) => void) | undefined>;
}

/**
 * After spin settles with wins, prepares the payline overlay:
 * - syncs grid to authoritative matrix (server result may arrive after reels stop)
 * - hides base sprites in expanding-wild columns (so Spine show-then-idle can take over)
 * - builds the `WinHighlight[]` cycle and activates the first line
 */
export function useWinLinesSetup({
  app,
  spinning,
  matrix,
  targetMatrix,
  winLines,
  expandingWild,
  sceneAssetsEpoch,
  loadedRef,
  spineReadyRef,
  reelsRef,
  matrixRef,
  paylineLayerRef,
  winHighlightsRef,
  paylineCycleIdxRef,
  paylineCycleElapsedRef,
  paylineInDelayRef,
  winCycleFiredRef,
  expandingWildColsRef,
  applyMatrixToAllReelsRef,
  activateWinLineRef,
  presentedAccumRef,
  finalWinAmountRef,
  onPresentedWinChangeRef,
}: UseWinLinesSetupOptions) {
  useEffect(() => {
    if (spinning || !winLines.length) return;
    const layer = paylineLayerRef.current;
    if (!layer || !app?.renderer) return;

    // Prefer server matrix — local `matrix` state can lag if GameActionResult arrives after reels stop.
    const gridMatrix = targetMatrix?.length ? targetMatrix : matrix;
    matrixRef.current = gridMatrix;
    applyMatrixToAllReelsRef.current(gridMatrix);

    const hasExpandColumn = expandingWild.some((flag) => flag !== 0);
    const wildCols: number[] = [];
    if (hasExpandColumn) {
      for (let col = 0; col < gridMatrix.length && col < REEL_COUNT; col++) {
        if (expandingWild[col]) wildCols.push(col);
      }
    }
    expandingWildColsRef.current = wildCols;

    // Hide base sprites in expanding-wild columns only after Spine preload; else cells stay visibly empty.
    if (
      loadedRef.current &&
      reelsRef.current.length === REEL_COUNT &&
      wildCols.length > 0 &&
      spineReadyRef.current
    ) {
      for (const col of wildCols) {
        const reel = reelsRef.current[col];
        if (!reel) continue;
        for (const sym of reel.symbols) setSlotSymbolVisibility(sym, false);
      }
    }

    layer.removeChildren();
    for (const highlight of winHighlightsRef.current)
      highlight.paylineAnim?.destroy();
    winHighlightsRef.current = [];
    paylineCycleIdxRef.current = 0;
    paylineCycleElapsedRef.current = 0;
    paylineInDelayRef.current = false;
    winCycleFiredRef.current = false;

    const { gridX, gridY, cellW, cellH } = getSlotGridMetrics(
      DESIGN_WIDTH,
      DESIGN_HEIGHT,
    );
    winHighlightsRef.current = buildWinHighlights({
      winLines,
      gridMatrix,
      expandingWild,
      metrics: { gridX, gridY, cellW, cellH },
      ticker: app.ticker,
    });

    if (winHighlightsRef.current.length > 0) {
      activateWinLineRef.current?.(0);
    } else {
      const finalWin = finalWinAmountRef.current;
      if (finalWin != null && finalWin > 0) {
        presentedAccumRef.current = finalWin;
        onPresentedWinChangeRef.current?.(finalWin);
      }
    }
  }, [
    spinning,
    winLines,
    matrix,
    targetMatrix,
    expandingWild,
    app,
    sceneAssetsEpoch,
    loadedRef,
    spineReadyRef,
    reelsRef,
    matrixRef,
    paylineLayerRef,
    winHighlightsRef,
    paylineCycleIdxRef,
    paylineCycleElapsedRef,
    paylineInDelayRef,
    winCycleFiredRef,
    expandingWildColsRef,
    applyMatrixToAllReelsRef,
    activateWinLineRef,
    presentedAccumRef,
    finalWinAmountRef,
    onPresentedWinChangeRef,
  ]);
}
