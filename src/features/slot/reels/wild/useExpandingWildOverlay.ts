import { type Spine } from '@esotericsoftware/spine-pixi-v8';
import type { Application, Container } from 'pixi.js';
import { type RefObject, useEffect } from 'react';

import { playWildWin } from '@/audio/soundManager';
import { createWildSpineShowThenIdle } from '@/animation/wildSpine';
import { DESIGN_HEIGHT, DESIGN_WIDTH, REEL_COUNT } from '../constants';
import { getSlotGridMetrics } from '../lib/grid';
import {
  syncOverlaySpriteVisibility,
  type SettledSymbolEntry,
} from '../scene/settledSymbolOverlay';
import {
  layoutWildSpineExpandedInColumn,
  wildAnimationForRow,
  wildRevealRowForExpandingColumn,
} from '../winCycle/spineWin';
import type { Reel } from '../types';

interface UseExpandingWildOverlayOptions {
  app: Application | null;
  spinning: boolean;
  matrix: number[][];
  targetMatrix: number[][] | null;
  winLinesCount: number;
  expandingWild: number[];
  /** Bumps when reel strips are rebuilt or Spine assets become ready. */
  sceneAssetsEpoch: number;
  loadedRef: RefObject<boolean>;
  spineReadyRef: RefObject<boolean>;
  reelsRef: RefObject<Reel[]>;
  wildOverlayRef: RefObject<Container | null>;
  /** Active expanding-wild spines; this hook owns their lifecycle. */
  wildActiveSpinesRef: RefObject<Spine[]>;
  /** Columns with active expanding wilds; read by other effects to skip base sprites. */
  expandingWildColsRef: RefObject<number[]>;
  /** Hides base reel sprites in expanding columns; provided by main scene effect. */
  hideWildStripColumnsRef: RefObject<((cols: number[]) => void) | null>;
  settledSymbolSpinesRef: RefObject<SettledSymbolEntry[]>;
  wildIdleSpinesRef: RefObject<Array<{ col: number; row: number }>>;
}

/**
 * After reels stop, plays the column-wide expanding-wild "show → idle" animation in every
 * reel marked by `expandingWild[col]`. Restores base sprites when there's no win cycle.
 */
export function useExpandingWildOverlay({
  app,
  spinning,
  matrix,
  targetMatrix,
  winLinesCount,
  expandingWild,
  sceneAssetsEpoch,
  loadedRef,
  spineReadyRef,
  reelsRef,
  wildOverlayRef,
  wildActiveSpinesRef,
  expandingWildColsRef,
  hideWildStripColumnsRef,
  settledSymbolSpinesRef,
  wildIdleSpinesRef,
}: UseExpandingWildOverlayOptions) {
  useEffect(() => {
    if (spinning) return;

    for (const spine of wildActiveSpinesRef.current) {
      if (spine.parent) spine.parent.removeChild(spine);
      spine.destroy();
    }
    wildActiveSpinesRef.current = [];

    const overlay = wildOverlayRef.current;
    const hasWins = winLinesCount > 0;
    const hasExpandColumn = expandingWild.some((flag) => flag !== 0);
    const gridMatrix = targetMatrix?.length ? targetMatrix : matrix;

    const wildCols: number[] = [];
    if (hasWins && hasExpandColumn) {
      for (let col = 0; col < gridMatrix.length && col < REEL_COUNT; col++) {
        if (expandingWild[col]) wildCols.push(col);
      }
    }

    expandingWildColsRef.current = wildCols;

    // No expanding wild AND no win lines → restore base sprites only where no overlay covers the cell.
    if (
      loadedRef.current &&
      reelsRef.current.length === REEL_COUNT &&
      wildCols.length === 0 &&
      winLinesCount === 0
    ) {
      syncOverlaySpriteVisibility(reelsRef, settledSymbolSpinesRef, wildIdleSpinesRef);
    }

    if (!overlay || !spineReadyRef.current || !hasWins || !hasExpandColumn || wildCols.length === 0)
      return;

    if (!app?.renderer) return;

    const { gridX, gridY, gridH, cellW } = getSlotGridMetrics(DESIGN_WIDTH, DESIGN_HEIGHT);

    hideWildStripColumnsRef.current?.(wildCols);
    playWildWin();

    for (let col = 0; col < gridMatrix.length; col++) {
      if (!expandingWild[col]) continue;
      const revealRow = wildRevealRowForExpandingColumn(gridMatrix, col);
      const animation = wildAnimationForRow(revealRow);
      const spine = createWildSpineShowThenIdle(animation, app.ticker);
      const cx = gridX + col * cellW + cellW / 2;
      const cy = gridY + gridH / 2;
      layoutWildSpineExpandedInColumn(spine, cx, cy, cellW, gridH, animation);
      overlay.addChild(spine);
      wildActiveSpinesRef.current.push(spine);
    }
  }, [
    spinning,
    matrix,
    targetMatrix,
    winLinesCount,
    expandingWild,
    app,
    sceneAssetsEpoch,
    loadedRef,
    spineReadyRef,
    reelsRef,
    wildOverlayRef,
    wildActiveSpinesRef,
    expandingWildColsRef,
    hideWildStripColumnsRef,
    settledSymbolSpinesRef,
    wildIdleSpinesRef,
  ]);
}
