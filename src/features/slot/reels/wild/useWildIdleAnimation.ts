import type { Application, Container } from 'pixi.js';
import { type RefObject, useEffect } from 'react';

import type { Reel } from '../types';
import { type WildIdleEntry, syncAllWildIdleOverlays } from './wildIdleOverlay';

interface UseWildIdleAnimationOptions {
  app: Application | null;
  spinning: boolean;
  matrix: number[][];
  targetMatrix: number[][] | null;
  expandingWild: number[];
  sceneAssetsEpoch: number;
  spineReadyRef: RefObject<boolean>;
  reelsRef: RefObject<Reel[]>;
  winOverlayRef: RefObject<Container | null>;
  wildIdleSpinesRef: RefObject<WildIdleEntry[]>;
}

/**
 * Idempotent backfill for idle wild cells (initial load / assets ready).
 * Per-column wild idle is attached imperatively when each reel lands during a spin.
 */
export function useWildIdleAnimation({
  app,
  spinning,
  matrix,
  targetMatrix,
  expandingWild,
  sceneAssetsEpoch,
  spineReadyRef,
  reelsRef,
  winOverlayRef,
  wildIdleSpinesRef,
}: UseWildIdleAnimationOptions) {
  useEffect(() => {
    if (spinning || !spineReadyRef.current || !app?.renderer) return;

    const gridMatrix = targetMatrix?.length ? targetMatrix : matrix;
    const skipCols = expandingWild.map((flag, col) => (flag ? col : -1)).filter((col) => col >= 0);

    syncAllWildIdleOverlays(gridMatrix, {
      app,
      winOverlayRef,
      wildIdleSpinesRef,
      reelsRef,
      skipCols,
    });
  }, [
    spinning,
    matrix,
    targetMatrix,
    expandingWild,
    app,
    sceneAssetsEpoch,
    spineReadyRef,
    reelsRef,
    winOverlayRef,
    wildIdleSpinesRef,
  ]);
}
