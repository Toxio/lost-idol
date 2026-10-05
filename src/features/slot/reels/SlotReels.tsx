/**
 * PixiJS reel animation — 5 reels × 3 rows.
 *
 * This component is a thin shell: it owns all PixiJS mutable scene state via refs and delegates
 * each phase (init+ticker, spin-start reset, win-line cycle, wild overlays, big-win) to a
 * dedicated hook. All hooks share the same refs because PixiJS sprites/containers are mutable
 * and survive across React renders.
 */

import { Spine } from "@esotericsoftware/spine-pixi-v8";
import { useApplication } from "@pixi/react";
import type { Container } from "pixi.js";
import { useEffect, useLayoutEffect, useReducer, useRef } from "react";

import { getSpinSpeedPreset, type SpinSpeedPreset } from "./constants";
import type { Reel, ReelTween, SlotReelsProps, WinHighlight } from "./types";
import { useBigWinOverlay } from "./bigWin/useBigWinOverlay";
import { useReelsScene } from "./scene/useReelsScene";
import { useResetOnSpinStart } from "./scene/useResetOnSpinStart";
import type { SettledSymbolEntry } from "./scene/settledSymbolOverlay";
import { useSettledSymbolOverlay } from "./scene/useSettledSymbolOverlay";
import { useExpandingWildOverlay } from "./wild/useExpandingWildOverlay";
import { useWildIdleAnimation } from "./wild/useWildIdleAnimation";
import { useWinLinesSetup } from "./winCycle/useWinLinesSetup";

export function SlotReels({
  collectorOverlayVisible = false,
  spinSpeed,
  spinning,
  targetMatrix,
  matrix,
  onSpinComplete,
  onWinCycleDone,
  onPresentedWinChange,
  winLines,
  expandingWild,
  spinOdd,
  winAmount,
  currency,
  precision,
  onAssetsLoaded,
  stopSignal = 0,
  autoAdvance = false,
}: SlotReelsProps) {
  const { app, isInitialised } = useApplication();

  // ── Sync refs (mirror props for use inside imperative ticker / async callbacks) ──
  const spinRef = useRef(spinning);
  const completeRef = useRef(onSpinComplete);
  const winCycleDoneRef = useRef(onWinCycleDone);
  const onPresentedWinChangeRef = useRef(onPresentedWinChange);
  const presentedAccumRef = useRef(0);
  const creditedWinIdxRef = useRef<Set<number>>(new Set());
  const finalWinAmountRef = useRef<number | null>(winAmount);
  const targetMatrixRef = useRef<number[][] | null>(null);
  const matrixRef = useRef(matrix);
  const collectorOverlayVisibleRef = useRef(collectorOverlayVisible);
  useLayoutEffect(() => { collectorOverlayVisibleRef.current = collectorOverlayVisible; }, [collectorOverlayVisible]);

  // ── Scene state (created/destroyed by useReelsScene) ──
  const reelsRef = useRef<Reel[]>([]);
  const loadedRef = useRef(false);
  const spineReadyRef = useRef(false);
  /** Bumps when reel strips are built or Spine preload finishes — retriggers overlays. */
  const [sceneAssetsEpoch, bumpSceneAssets] = useReducer(
    (n: number) => n + 1,
    0,
  );

  // ── Spin / stop state ──
  const tweensRef = useRef<ReelTween[]>([]);
  const spinStartRef = useRef(0);
  const activePresetRef = useRef<SpinSpeedPreset>(
    getSpinSpeedPreset(spinSpeed),
  );
  const stopFiredRef = useRef(false);
  const stopReelsRef = useRef<() => void>(() => {});
  const applyMatrixToAllReelsRef = useRef<(source: number[][]) => void>(
    () => {},
  );

  // ── Layers ──
  const winOverlayRef = useRef<Container | null>(null);
  const settledOverlayRef = useRef<Container | null>(null);
  const settledSymbolSpinesRef = useRef<SettledSymbolEntry[]>([]);
  const wildOverlayRef = useRef<Container | null>(null);
  const paylineLayerRef = useRef<Container | null>(null);
  const bigWinLayerRef = useRef<Container | null>(null);

  // ── Big win ──
  const bigWinAmountTickUpRef = useRef<{ stop: () => void } | null>(null);
  const bigWinActiveRef = useRef(false);
  const bigWinPendingRef = useRef(false);

  // ── Wild ──
  const wildActiveSpinesRef = useRef<Spine[]>([]);
  const wildIdleSpinesRef = useRef<
    Array<{ spine: Spine; col: number; row: number }>
  >([]);
  const expandingWildColsRef = useRef<number[]>([]);
  const hideWildStripColumnsRef = useRef<((cols: number[]) => void) | null>(
    null,
  );

  // ── Win line cycling ──
  const winHighlightsRef = useRef<WinHighlight[]>([]);
  const paylineCycleIdxRef = useRef(0);
  const paylineCycleElapsedRef = useRef(0);
  const activeWinSpinesRef = useRef<Spine[]>([]);
  const paylineInDelayRef = useRef(false);
  const activateWinLineRef = useRef<((idx: number) => void) | null>(null);
  const winCycleFiredRef = useRef(false);

  // ── Sync prop → ref ──
  useEffect(() => {
    spinRef.current = spinning;
  }, [spinning]);
  useEffect(() => {
    completeRef.current = onSpinComplete;
  }, [onSpinComplete]);
  useEffect(() => {
    winCycleDoneRef.current = onWinCycleDone;
  }, [onWinCycleDone]);
  useEffect(() => {
    onPresentedWinChangeRef.current = onPresentedWinChange;
  }, [onPresentedWinChange]);
  useEffect(() => {
    finalWinAmountRef.current = winAmount;
  }, [winAmount]);
  useEffect(() => {
    if (!spinning) return;
    presentedAccumRef.current = 0;
    creditedWinIdxRef.current = new Set();
  }, [spinning]);
  useEffect(() => {
    targetMatrixRef.current = targetMatrix;
  }, [targetMatrix]);
  useEffect(() => {
    matrixRef.current = matrix;
  }, [matrix]);

  // Re-apply when API result arrives after reels already began stopping.
  useEffect(() => {
    if (!targetMatrix) return;
    applyMatrixToAllReelsRef.current(targetMatrix);
  }, [targetMatrix]);

  // Ensure settled grid matches matrix before win-line cycling shows static sprites.
  useEffect(() => {
    if (spinning) return;
    applyMatrixToAllReelsRef.current(matrix);
  }, [spinning, matrix]);

  // External stop request from parent (spin button, screen tap).
  useEffect(() => {
    if (!stopSignal) return;
    stopReelsRef.current();
  }, [stopSignal]);

  useResetOnSpinStart({
    spinning,
    spinSpeed,
    bigWinActiveRef,
    bigWinPendingRef,
    bigWinAmountTickUpRef,
    bigWinLayerRef,
    activePresetRef,
    spinStartRef,
    stopFiredRef,
    tweensRef,
    reelsRef,
    activeWinSpinesRef,
    wildIdleSpinesRef,
    wildActiveSpinesRef,
    winOverlayRef,
    settledOverlayRef,
    settledSymbolSpinesRef,
    wildOverlayRef,
    paylineLayerRef,
    winHighlightsRef,
    paylineInDelayRef,
    expandingWildColsRef,
  });

  useWinLinesSetup({
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
  });

  useExpandingWildOverlay({
    app,
    spinning,
    matrix,
    targetMatrix,
    winLinesCount: winLines.length,
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
  });

  useWildIdleAnimation({
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
  });

  useSettledSymbolOverlay({
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
  });

  useBigWinOverlay({
    app,
    spinning,
    spinOdd,
    winAmount,
    winLinesCount: winLines.length,
    expandingWild,
    currency,
    precision,
    spinRef,
    bigWinLayerRef,
    bigWinActiveRef,
    amountTickUpRef: bigWinAmountTickUpRef,
    winCycleFiredRef,
    bigWinPendingRef,
    winCycleDoneRef,
    autoAdvance,
  });

  useReelsScene({
    collectorOverlayVisibleRef,
    app,
    isInitialised,
    onAssetsLoaded,
    bumpSceneAssets,
    loadedRef,
    spineReadyRef,
    reelsRef,
    matrixRef,
    targetMatrixRef,
    applyMatrixToAllReelsRef,
    spinRef,
    completeRef,
    spinStartRef,
    stopFiredRef,
    tweensRef,
    activePresetRef,
    stopReelsRef,
    winOverlayRef,
    settledOverlayRef,
    settledSymbolSpinesRef,
    wildOverlayRef,
    paylineLayerRef,
    bigWinLayerRef,
    bigWinAmountTickUpRef,
    winHighlightsRef,
    paylineCycleIdxRef,
    paylineCycleElapsedRef,
    paylineInDelayRef,
    winCycleFiredRef,
    winCycleDoneRef,
    activeWinSpinesRef,
    activateWinLineRef,
    presentedAccumRef,
    creditedWinIdxRef,
    finalWinAmountRef,
    onPresentedWinChangeRef,
    wildActiveSpinesRef,
    wildIdleSpinesRef,
    expandingWildColsRef,
    hideWildStripColumnsRef,
    bigWinActiveRef,
    bigWinPendingRef,
  });

  return null;
}
