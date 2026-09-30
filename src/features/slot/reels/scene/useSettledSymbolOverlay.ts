import type { Application } from 'pixi.js';
import { type RefObject, useEffect } from 'react';

import {
  type SettledOverlayContext,
  type SettledSymbolEntry,
  syncAllSettledOverlays,
  syncOverlaySpriteVisibility,
} from './settledSymbolOverlay';

interface UseSettledSymbolOverlayOptions {
  app: Application | null;
  spinning: boolean;
  matrix: number[][];
  targetMatrix: number[][] | null;
  expandingWild: number[];
  sceneAssetsEpoch: number;
  spineReadyRef: RefObject<boolean>;
  settledOverlayRef: RefObject<import('pixi.js').Container | null>;
  settledSymbolSpinesRef: RefObject<SettledSymbolEntry[]>;
  reelsRef: RefObject<import('../types').Reel[]>;
  wildIdleSpinesRef: RefObject<Array<{ col: number; row: number }>>;
}

/**
 * Idempotent backfill for idle state (initial load / assets ready).
 * Per-column overlays are attached imperatively when each reel lands during a spin.
 */
export function useSettledSymbolOverlay({
  app,
  spinning,
  matrix,
  targetMatrix,
  expandingWild,
  sceneAssetsEpoch,
  spineReadyRef,
  reelsRef,
  settledOverlayRef,
  settledSymbolSpinesRef,
  wildIdleSpinesRef,
}: UseSettledSymbolOverlayOptions) {
  useEffect(() => {
    if (spinning || !spineReadyRef.current || !app?.renderer) return;

    const gridMatrix = targetMatrix?.length ? targetMatrix : matrix;
    const skipCols = expandingWild.map((flag, col) => (flag ? col : -1)).filter((col) => col >= 0);

    const ctx: SettledOverlayContext = {
      settledOverlayRef,
      settledSymbolSpinesRef,
      reelsRef,
      skipCols,
    };

    syncAllSettledOverlays(gridMatrix, ctx);
    syncOverlaySpriteVisibility(reelsRef, settledSymbolSpinesRef, wildIdleSpinesRef);
  }, [
    spinning,
    matrix,
    targetMatrix,
    expandingWild,
    app,
    sceneAssetsEpoch,
    spineReadyRef,
    reelsRef,
    settledOverlayRef,
    settledSymbolSpinesRef,
    wildIdleSpinesRef,
  ]);
}
