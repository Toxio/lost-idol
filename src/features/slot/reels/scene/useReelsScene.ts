import { ensureWinBackgroundLoaded, createWinBackground } from '@/animation/winBackground';
import { type Spine } from "@esotericsoftware/spine-pixi-v8";
import {
  type Application,
  Assets,
  loadTextures,
  BlurFilter,
  Container,
  Graphics,
} from "pixi.js";
import { type RefObject, useEffect } from "react";

import { play as playSound, playWildWin } from "@/audio/soundManager";
import {
  createReelFrame,
  ensureReelFrameLoaded,
} from "@/animation/reelFrame";
import {
  ensureGlassSpineLoaded,
  ensureGobletSpineLoaded,
  ensureHeelsSpineLoaded,
  ensureLipsSpineLoaded,
  ensureLipstickSpineLoaded,
  ensureParfumeSpineLoaded,
  ensureRoseSpineLoaded,
  ensureScatterSpineLoaded,
  ensureSevenSpineLoaded,
  ensureStarSpineLoaded,
} from "@/animation/symbols";
import { ensureLineAssetsLoaded } from "@/animation/lineAnimation";
import { ensureWildSpineLoaded } from "@/animation/wildSpine";
import { preloadHtmlImages } from "@/utils/preloadHtmlImages";
import {
  ALL_ASSETS,
  randomAlias,
  symbolAlias,
} from "./assets";
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  LINE_DELAY_MS,
  REEL_COUNT,
  REEL_FAST_STOP,
  REEL_SETTLE_BOUNCE,
  REEL_SIZE,
  REEL_STOP_SOUND_LEAD_MS,
  type SpinSpeedPreset,
  VISIBLE_ROWS,
} from "../constants";
import { decelStop, lerp } from "../lib/easing";
import { getSlotGridMetrics } from "../lib/grid";
import {
  createWinSpineForSymbol,
  layoutSpineInCell,
} from "../winCycle/spineWin";
import {
  isScatterSymbol,
  isWildMatrixSymbol,
  WILD_SERVER_IDX,
} from "../winCycle/symbolUtils";
import {
  createSymbolSprite,
  INACTIVE_SYMBOL_ALPHA,
  setSlotSymbolDimmed,
  setSlotSymbolVisibility,
  updateSymbol,
} from "./symbolSprites";
import {
  attachSettledColumnOverlays,
  hideSettledOverlaysForColumns,
  setSettledSpinesDimmed,
  setSettledSpinesVisible,
  type SettledSymbolEntry,
} from "./settledSymbolOverlay";
import { attachWildIdleColumnOverlays } from "../wild/wildIdleOverlay";
import type {
  Reel,
  ReelTween,
  SlotSymbol,
  WinCell,
  WinHighlight,
} from "../types";

interface UseReelsSceneOptions {
  app: Application | null;
  isInitialised: boolean;
  onAssetsLoaded?: () => void;
  bumpSceneAssets: () => void;

  // Loaders / sync state
  loadedRef: RefObject<boolean>;
  spineReadyRef: RefObject<boolean>;

  // Strip / matrix state
  reelsRef: RefObject<Reel[]>;
  matrixRef: RefObject<number[][]>;
  collectorOverlayVisibleRef: RefObject<boolean>;
  targetMatrixRef: RefObject<number[][] | null>;
  applyMatrixToAllReelsRef: RefObject<(source: number[][]) => void>;

  // Spin state
  spinRef: RefObject<boolean>;
  completeRef: RefObject<() => void>;
  spinStartRef: RefObject<number>;
  stopFiredRef: RefObject<boolean>;
  tweensRef: RefObject<ReelTween[]>;
  activePresetRef: RefObject<SpinSpeedPreset>;
  stopReelsRef: RefObject<() => void>;

  // Layers
  winOverlayRef: RefObject<Container | null>;
  settledOverlayRef: RefObject<Container | null>;
  settledSymbolSpinesRef: RefObject<SettledSymbolEntry[]>;
  wildOverlayRef: RefObject<Container | null>;
  paylineLayerRef: RefObject<Container | null>;
  bigWinLayerRef: RefObject<Container | null>;
  bigWinAmountTickUpRef: RefObject<{ stop: () => void } | null>;

  // Win cycling
  winHighlightsRef: RefObject<WinHighlight[]>;
  paylineCycleIdxRef: RefObject<number>;
  paylineCycleElapsedRef: RefObject<number>;
  paylineInDelayRef: RefObject<boolean>;
  winCycleFiredRef: RefObject<boolean>;
  winCycleDoneRef: RefObject<(() => void) | undefined>;
  activeWinSpinesRef: RefObject<Spine[]>;
  activateWinLineRef: RefObject<((idx: number) => void) | null>;
  presentedAccumRef: RefObject<number>;
  creditedWinIdxRef: RefObject<Set<number>>;
  finalWinAmountRef: RefObject<number | null>;
  onPresentedWinChangeRef: RefObject<((amount: number) => void) | undefined>;

  // Wild
  wildActiveSpinesRef: RefObject<Spine[]>;
  wildIdleSpinesRef: RefObject<
    Array<{ spine: Spine; col: number; row: number }>
  >;
  expandingWildColsRef: RefObject<number[]>;
  hideWildStripColumnsRef: RefObject<((cols: number[]) => void) | null>;

  // Bigwin state (read by activateWinLine to suppress inline sounds)
  bigWinActiveRef: RefObject<boolean>;
  /** True once a big win is confirmed for this spin; holds off `winCycleDoneRef` until it's dismissed. */
  bigWinPendingRef: RefObject<boolean>;
}

/**
 * Owns the PixiJS scene lifecycle: stage layout, asset loading, reel construction,
 * per-frame ticker (spin → stop → settle → win cycle), and complete teardown.
 *
 * Most of this hook is closure-captured imperative state, which is why so many refs are
 * threaded in: each sibling React effect (reset, win-lines, big-win, etc.) reads and writes
 * the same shared mutable scene.
 */
export function useReelsScene({
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
}: UseReelsSceneOptions) {
  useEffect(() => {
    if (!isInitialised || !app) return;
    const { gridX, gridY, maskH, cellW, cellH } = getSlotGridMetrics(
      DESIGN_WIDTH,
      DESIGN_HEIGHT,
    );

    const syncStageScale = () => {
      const screenW = app.screen.width;
      const screenH = app.screen.height;
      if (screenW <= 0 || screenH <= 0) return;
      app.stage.scale.set(screenW / DESIGN_WIDTH, screenH / DESIGN_HEIGHT);
    };

    syncStageScale();
    app.renderer.on("resize", syncStageScale);

    const reelCont = new Container();
    reelCont.x = gridX;
    reelCont.y = gridY;
    app.stage.addChild(reelCont);

    const winOverlayCont = new Container();
    app.stage.addChild(winOverlayCont);
    winOverlayRef.current = winOverlayCont;

    const settledOverlayCont = new Container();
    app.stage.addChild(settledOverlayCont);
    settledOverlayRef.current = settledOverlayCont;
    const settledMask = new Graphics();
    settledMask.rect(gridX, gridY, REEL_COUNT * cellW, maskH).fill(0xffffff);
    app.stage.addChild(settledMask);
    settledOverlayCont.mask = settledMask;

    // Above per-symbol win spines, below payline (line must stay on top).
    const wildOverlayCont = new Container();
    app.stage.addChild(wildOverlayCont);
    wildOverlayRef.current = wildOverlayCont;

    const paylineLayer = new Container();
    app.stage.addChild(paylineLayer);
    paylineLayerRef.current = paylineLayer;

    const bigWinLayer = new Container();
    app.stage.addChild(bigWinLayer);
    bigWinLayerRef.current = bigWinLayer;

    let reelFrameContainer: Container | null = null;
    let cancelled = false;

    // Mobile/LAN browsers can stall the worker ImageBitmap capability probe.
    if (loadTextures.config && (!window.isSecureContext || window.matchMedia('(pointer: coarse)').matches)) {
      loadTextures.config.preferWorkers = false;
      loadTextures.config.preferCreateImageBitmap = false;
    }
    const spinePromise = Promise.all([
      ensureReelFrameLoaded(),
      ensureGlassSpineLoaded(),
      ensureGobletSpineLoaded(),
      ensureLipsSpineLoaded(),
      ensureLipstickSpineLoaded(),
      ensureParfumeSpineLoaded(),
      ensureRoseSpineLoaded(),
      ensureSevenSpineLoaded(),
      ensureStarSpineLoaded(),
      ensureHeelsSpineLoaded(),
      ensureWildSpineLoaded(),
      ensureScatterSpineLoaded(),
      ensureLineAssetsLoaded(),
      ensureWinBackgroundLoaded(),
    ]);

    async function init() {
      await Promise.all([Assets.load(ALL_ASSETS), spinePromise, preloadHtmlImages()]);
      if (cancelled) return;

      spineReadyRef.current = true;
      loadedRef.current = true;
      onAssetsLoaded?.();


      const reelFrame = createReelFrame(DESIGN_WIDTH, DESIGN_HEIGHT);
      app!.stage.addChildAt(reelFrame, 0);
      reelFrameContainer = reelFrame;

      const reels: Reel[] = [];
      for (let i = 0; i < REEL_COUNT; i++) {
        const rc = new Container();
        rc.x = i * cellW;
        reelCont.addChild(rc);

        // Blur filter is attached lazily on spin start. Leaving `.filters = [blur]` at rest
        // forces Pixi to render the reel through a RenderTexture even at strength 0, which
        // softens sprite edges on first paint (last reels most visibly).
        const blur = new BlurFilter();
        blur.strengthX = 0;
        blur.strengthY = 0;

        const mask = new Graphics();
        mask.rect(0, 0, cellW, maskH).fill(0xffffff);
        rc.addChild(mask);
        rc.mask = mask;

        const stripCont = new Container();
        rc.addChild(stripCont);

        const symbols: SlotSymbol[] = [];
        for (let j = 0; j < REEL_SIZE; j++) {
          const sym = createSymbolSprite(randomAlias(i), cellW, cellH);
          sym.container.y = j * cellH;
          stripCont.addChild(sym.container);
          symbols.push(sym);
        }

        reels.push({
          rc,
          stripCont,
          symbols,
          position: 0,
          prevPos: 0,
          blur,
          stopping: false,
        });
      }

      reelsRef.current = reels;
      bumpSceneAssets();
    }

    void init().catch((error: unknown) => {
      console.error('Game assets failed to load', error);
      if (!cancelled) window.dispatchEvent(new Event('game-assets-error'));
    });

    // ── Grid / symbol helpers ────────────────────────────────────────────────
    /** Strip index for each grid row when the reel has landed (position ≡ 0 mod REEL_SIZE). */
    function settledStripIndexForRow(row: number): number {
      return row + 1;
    }

    function settledGridSymbol(
      reel: Reel,
      row: number,
    ): SlotSymbol | undefined {
      return reel.symbols[settledStripIndexForRow(row)];
    }

    function setSettledGridCellSymbol(
      col: number,
      row: number,
      source: number[][],
    ): void {
      const reel = reelsRef.current[col];
      if (!reel) return;
      const sym = settledGridSymbol(reel, row);
      const idx = source[col]?.[row];
      if (sym && idx !== undefined)
        updateSymbol(sym, symbolAlias(idx), cellW, cellH);
    }

    function syncHighlightCellsFromMatrix(cells: readonly WinCell[]): void {
      for (const { col, row, matrixIdx } of cells) {
        if (expandingWildColsRef.current.includes(col)) continue;
        const reel = reelsRef.current[col];
        if (!reel) continue;
        const sym = settledGridSymbol(reel, row);
        if (sym) updateSymbol(sym, symbolAlias(matrixIdx), cellW, cellH);
      }
    }

    function resetGridSymbolAppearance() {
      const settledKeys = new Set(
        settledSymbolSpinesRef.current.map(({ col, row }) => `${col},${row}`),
      );

      for (let col = 0; col < REEL_COUNT; col++) {
        const reel = reelsRef.current[col];
        if (!reel) continue;
        for (let row = 0; row < VISIBLE_ROWS; row++) {
          const sym = settledGridSymbol(reel, row);
          if (!sym) continue;
          setSlotSymbolDimmed(sym, false);
          setSlotSymbolVisibility(sym, !settledKeys.has(`${col},${row}`));
        }
      }

      for (const { spine } of settledSymbolSpinesRef.current) {
        spine.alpha = 1;
        spine.filters = null;
        spine.visible = true;
      }
    }

    function dimInactiveGridSymbols(activeCells: ReadonlySet<string>) {
      for (let col = 0; col < REEL_COUNT; col++) {
        if (expandingWildColsRef.current.includes(col)) continue;
        const reel = reelsRef.current[col];
        if (!reel) continue;
        for (let row = 0; row < VISIBLE_ROWS; row++) {
          const sym = settledGridSymbol(reel, row);
          if (!sym) continue;
          setSlotSymbolDimmed(sym, !activeCells.has(`${col},${row}`));
        }
      }
      setSettledSpinesDimmed(
        settledSymbolSpinesRef.current,
        activeCells,
        INACTIVE_SYMBOL_ALPHA,
      );
    }

    function restoreWildIdle() {
      for (const { spine, col, row } of wildIdleSpinesRef.current) {
        spine.visible = !expandingWildColsRef.current.includes(col);
        const sym = reelsRef.current[col]?.symbols[row + 1];
        if (sym) setSlotSymbolVisibility(sym, false);
      }
    }

    function hideWildIdleForCells(cells: readonly WinCell[]) {
      for (const { col, row, matrixIdx } of cells) {
        if (!isWildMatrixSymbol(matrixIdx)) continue;
        const entry = wildIdleSpinesRef.current.find(
          (e) => e.col === col && e.row === row,
        );
        if (entry) entry.spine.visible = false;
      }
    }

    function deactivateCurrentLine() {
      for (const spine of activeWinSpinesRef.current) {
        if (spine.parent) spine.parent.removeChild(spine);
        spine.destroy();
      }
      activeWinSpinesRef.current = [];
      applyMatrixToAllReels(matrixRef.current);
      resetGridSymbolAppearance();
      hideWildStripColumnsRef.current?.(expandingWildColsRef.current);
      paylineLayerRef.current?.removeChildren();
      restoreWildIdle();
    }

    function restoreStaticWinCells(cells: readonly WinCell[]) {
      syncHighlightCellsFromMatrix(cells);
      setSettledSpinesVisible(settledSymbolSpinesRef.current, cells, true);
      for (const { col, row } of cells) {
        if (expandingWildColsRef.current.includes(col)) continue;
        const sym = settledGridSymbol(reelsRef.current[col], row);
        if (sym) setSlotSymbolVisibility(sym, false);
      }
    }

    function creditPresentedWin(idx: number, highlight: WinHighlight) {
      if (winCycleFiredRef.current) return;
      if (creditedWinIdxRef.current.has(idx)) return;
      creditedWinIdxRef.current.add(idx);
      presentedAccumRef.current += highlight.winAmount;
      const highlights = winHighlightsRef.current;
      const isLast = idx === highlights.length - 1;
      const finalWin = finalWinAmountRef.current;
      const shown =
        isLast && finalWin != null && finalWin > 0
          ? finalWin
          : presentedAccumRef.current;
      onPresentedWinChangeRef.current?.(shown);
    }

    function activateWinLine(idx: number) {
      deactivateCurrentLine();

      const highlights = winHighlightsRef.current;
      const layer = paylineLayerRef.current;
      const overlay = winOverlayRef.current;
      const highlight = highlights[idx];
      if (!highlight) return;

      creditPresentedWin(idx, highlight);

      if (!layer || !overlay) return;

      const paylineAnim = highlight.paylineAnim;
      const hasScatterSymbol = highlight.cells.some(({ animIdx }) =>
        isScatterSymbol(animIdx),
      );
      const lineSound = highlight.cells.some(({ animIdx }) => animIdx === 10)
        ? "bonus_door"
        : hasScatterSymbol || !paylineAnim ? "scatter_win" : "winning_line";
      if (paylineAnim) {
        if (!bigWinActiveRef.current && !winCycleFiredRef.current)
          playSound(lineSound);
        paylineAnim.restart();
        layer.addChild(paylineAnim.container);
      } else {
        if (!bigWinActiveRef.current && !winCycleFiredRef.current)
          playSound(lineSound);
      }

      const activeCells = new Set(
        highlight.cells.map(({ col, row }) => `${col},${row}`),
      );
      dimInactiveGridSymbols(activeCells);
      hideWildIdleForCells(highlight.cells);
      setSettledSpinesVisible(
        settledSymbolSpinesRef.current,
        highlight.cells,
        false,
      );

      if (!spineReadyRef.current) return;

      const newSpines: Spine[] = [];
      for (const { col, row, animIdx, matrixIdx } of highlight.cells) {
        if (expandingWildColsRef.current.includes(col)) continue;
        const reel = reelsRef.current[col];
        const gridSym = reel ? settledGridSymbol(reel, row) : undefined;
        const absX = gridX + col * cellW + cellW / 2;
        const absY = gridY + row * cellH + cellH / 2;

        // Wild substituting cells have animIdx=comboSymbol but matrixIdx=9 — play wild animation.
        const effectiveAnimIdx = isWildMatrixSymbol(matrixIdx)
          ? WILD_SERVER_IDX
          : animIdx;
        const spine = createWinSpineForSymbol(effectiveAnimIdx, app!.ticker, row);
        if (!spine) continue;

        const background = createWinBackground({ ticker: app!.ticker, loop: false });
        // Each payline pass owns exactly one full symbol/effect playback.
        // Replacing the track also removes the wild's queued looping idle.
        for (const animated of [spine, background]) {
          const animation = animated.state.getCurrent(0)?.animation;
          if (animation) {
            const entry = animated.state.setAnimation(0, animation.name, false);
            entry.timeScale = animation.duration / (highlight.showMs / 1000);
            animated.update(0);
          }
        }
        layoutSpineInCell(background, absX, absY, cellW * 1.3, cellH * 1.3);
        overlay.addChildAt(background, 0);
        newSpines.push(background);
        layoutSpineInCell(spine, absX, absY, cellW, cellH);
        overlay.addChild(spine);
        newSpines.push(spine);

        if (gridSym)
          updateSymbol(gridSym, symbolAlias(matrixIdx), cellW, cellH);
        setSlotSymbolVisibility(gridSym, false);
      }
      activeWinSpinesRef.current = newSpines;
    }

    activateWinLineRef.current = activateWinLine;

    function attachSettledColumn(col: number) {
      if (!spineReadyRef.current || !app) return;
      attachSettledColumnOverlays(col, targetMatrixRef.current, {
        ticker: app.ticker,
        settledOverlayRef,
        settledSymbolSpinesRef,
        reelsRef,
        skipCols: expandingWildColsRef.current,
      });
    }

    function attachWildIdleColumn(col: number) {
      if (!spineReadyRef.current || !app) return;
      attachWildIdleColumnOverlays(col, targetMatrixRef.current, {
        app,
        winOverlayRef,
        wildIdleSpinesRef,
        reelsRef,
        skipCols: expandingWildColsRef.current,
      });
    }

    let wildSoundSpin: number | null = null;
    function attachColumnOverlays(col: number) {
      if (spinRef.current && !collectorOverlayVisibleRef.current && targetMatrixRef.current?.[col]?.includes(9)
        && wildSoundSpin !== spinStartRef.current) {
        wildSoundSpin = spinStartRef.current;
        playWildWin();
      }
      attachSettledColumn(col);
      attachWildIdleColumn(col);
    }

    hideWildStripColumnsRef.current = (cols: number[]) => {
      for (const col of cols) {
        const reel = reelsRef.current[col];
        if (!reel) continue;
        for (const sym of reel.symbols) setSlotSymbolVisibility(sym, false);
      }
      hideSettledOverlaysForColumns(settledSymbolSpinesRef.current, cols);
      for (const { spine, col } of wildIdleSpinesRef.current) {
        if (cols.includes(col)) spine.visible = false;
      }
    };

    // ── Reel landing tween logic ─────────────────────────────────────────────
    const FRAME_MS = 1000 / 60;
    /** Target entry slope for sizing stop distance. After the REEL_SIZE snap, the actual k
     * for normal/fast presets lands in [1, 2] — decelStop's exact-match window where Phase 1
     * runs at spin velocity (invisible handoff) and Phase 2 decelerates smoothly to rest. */
    const TARGET_K = 1.5;

    function startReelSettleBounce(reel: Reel, onComplete: () => void) {
      reel.settleBounce = {
        elapsedMs: 0,
        duration: REEL_SETTLE_BOUNCE.durationMs,
        dropPx: cellH * REEL_SETTLE_BOUNCE.dropFrac,
        onComplete,
      };
    }

    /** Distance chosen so tween's start velocity equals spin velocity at k=TARGET_K,
     *  then snapped up to the next REEL_SIZE boundary so symbols land aligned. */
    function reelStopDistance(
      spinVelocity: number,
      durationMs: number,
    ): number {
      const durationFrames = durationMs / FRAME_MS;
      const desired = (spinVelocity * durationFrames) / TARGET_K;
      return Math.max(REEL_SIZE, Math.ceil(desired / REEL_SIZE) * REEL_SIZE);
    }

    /** Write matrix rows into landing strip slots (indices 1–3), not scroll-visible slots. */
    function applyColumnSymbols(colIndex: number, source: number[][]) {
      for (let row = 0; row < VISIBLE_ROWS; row++) {
        setSettledGridCellSymbol(colIndex, row, source);
      }
    }

    function applyMatrixToAllReels(source: number[][]) {
      if (!loadedRef.current || reelsRef.current.length !== REEL_COUNT) return;
      if (spinRef.current && !stopFiredRef.current) return;
      for (let col = 0; col < REEL_COUNT; col++) {
        applyColumnSymbols(col, source);
      }
    }

    applyMatrixToAllReelsRef.current = applyMatrixToAllReels;

    function applyTargetSymbols(_reel: Reel, colIndex: number) {
      if (!targetMatrixRef.current?.[colIndex]) return;
      applyColumnSymbols(colIndex, targetMatrixRef.current);
    }

    function commitSettledGrid(source: number[][] | null | undefined) {
      if (!source?.length) return;
      applyMatrixToAllReels(source);
    }

    function onReelLanded(reel: Reel, colIndex: number) {
      const col = reelsRef.current.indexOf(reel);
      if (col >= 0) attachColumnOverlays(col);
      if (colIndex === REEL_COUNT - 1) {
        commitSettledGrid(targetMatrixRef.current);
        completeRef.current();
      }
    }

    function beginReelStop(fast = false) {
      const reels = reelsRef.current;
      const preset = activePresetRef.current;
      if (!spinRef.current || reels.length === 0 || stopFiredRef.current)
        return;
      if (!targetMatrixRef.current) return;

      stopFiredRef.current = true;
      tweensRef.current = [];

      const spinVelocity = preset.reelVelocity / 60;

      reels.forEach((reel, i) => {
        reel.stopping = true;
        applyTargetSymbols(reel, i);

        const duration = fast
          ? REEL_FAST_STOP.baseMs + i * REEL_FAST_STOP.stepMs
          : preset.stopBase + i * preset.stopStep;
        const soundLead = fast
          ? REEL_FAST_STOP.soundLeadMs
          : REEL_STOP_SOUND_LEAD_MS;
        const soundAtMs = Math.max(0, duration - soundLead);
        const durationFrames = duration / FRAME_MS;
        const from = reel.position;
        const desired = reelStopDistance(spinVelocity, duration);
        const to = Math.ceil((from + desired) / REEL_SIZE) * REEL_SIZE;
        // Entry-slope target: matches spin velocity at handoff when in range; decelStop clamps.
        const k = (spinVelocity * durationFrames) / (to - from);

        tweensRef.current.push({
          reel,
          from,
          to,
          elapsedMs: 0,
          duration,
          soundAtMs,
          ease: decelStop(k),
          onDone: () => {
            reel.blur.strengthY = 0;
            reel.rc.filters = null;
            attachSettledColumn(i);
            if (preset.settleBounce) {
              startReelSettleBounce(reel, () => {
                reel.stripCont.y = 0;
                onReelLanded(reel, i);
              });
            } else {
              onReelLanded(reel, i);
            }
          },
        });
      });
    }

    function finishReelStopInstantly() {
      const reels = reelsRef.current;
      if (!spinRef.current || reels.length === 0) return;
      if (!targetMatrixRef.current) return;

      const tweens = tweensRef.current;
      reels.forEach((reel, i) => {
        reel.stopping = true;
        reel.settleBounce = undefined;
        reel.stripCont.y = 0;
        applyTargetSymbols(reel, i);
        const tw = tweens.find((t) => t.reel === reel);
        const targetPos =
          tw?.to ??
          Math.ceil((reel.position + REEL_SIZE) / REEL_SIZE) * REEL_SIZE;
        reel.position = targetPos;
        reel.prevPos = targetPos;
        reel.blur.strengthY = 0;
        reel.rc.filters = null;
        attachColumnOverlays(i);
      });

      tweensRef.current = [];
      stopFiredRef.current = true;
      playSound("reel_stop");
      commitSettledGrid(targetMatrixRef.current);
      completeRef.current();
    }

    function requestReelStop() {
      if (!spinRef.current) return;
      if (!stopFiredRef.current) {
        beginReelStop(true);
        return;
      }
      if (tweensRef.current.length > 0) {
        finishReelStopInstantly();
      }
    }

    stopReelsRef.current = requestReelStop;

    // ── Per-frame loop ───────────────────────────────────────────────────────
    /** Cap deltaMS to avoid position teleports when the main thread hitches (mobile Safari
     * pausing the ticker during SignalR parse/React commit). Two frames' worth is generous
     * enough that momentum stays consistent, tight enough that jumps stay imperceptible. */
    const MAX_STEP_MS = 2 * FRAME_MS;
    const onTick = () => {
      if (!loadedRef.current) return;

      const reels = reelsRef.current;
      const preset = activePresetRef.current;
      const stepMs = Math.min(app!.ticker.deltaMS, MAX_STEP_MS);

      if (
        spinRef.current &&
        !stopFiredRef.current &&
        reels.length > 0 &&
        targetMatrixRef.current &&
        Date.now() - spinStartRef.current >= preset.minSpin
      ) {
        beginReelStop();
      }

      const done: ReelTween[] = [];
      for (const tw of tweensRef.current) {
        tw.elapsedMs += stepMs;
        const phase = Math.min(1, tw.elapsedMs / tw.duration);
        tw.reel.position = lerp(tw.from, tw.to, tw.ease(phase));
        if (!tw.soundFired && tw.elapsedMs >= tw.soundAtMs) {
          tw.soundFired = true;
          playSound("reel_stop");
          tw.reel.blur.strengthY = 0;
        }
        if (phase >= 1) {
          tw.reel.position = tw.to;
          done.push(tw);
          tw.onDone?.();
        }
      }
      if (done.length)
        tweensRef.current = tweensRef.current.filter((t) => !done.includes(t));

      for (const reel of reels) {
        const bounce = reel.settleBounce;
        if (bounce) {
          bounce.elapsedMs += stepMs;
          const t = Math.min(1, bounce.elapsedMs / bounce.duration);
          const offsetY = bounce.dropPx * Math.sin(t * Math.PI);
          reel.stripCont.y = offsetY;
          const col = reels.indexOf(reel);
          for (const entry of settledSymbolSpinesRef.current) {
            if (entry.col === col)
              entry.spine.position.y = entry.baseY + offsetY;
          }
          if (bounce.elapsedMs >= bounce.duration) {
            reel.stripCont.y = 0;
            for (const entry of settledSymbolSpinesRef.current) {
              if (entry.col === col) entry.spine.position.y = entry.baseY;
            }
            reel.settleBounce = undefined;
            bounce.onComplete?.();
          }
        }

        if (spinRef.current && !reel.stopping) {
          // Ticker-based with capped step: constant velocity on 60/120Hz, no teleport on hitch.
          reel.position += (preset.reelVelocity * stepMs) / 1000;
        }

        // Normalise blur to a 60Hz-equivalent per-frame delta so it doesn't halve on 120Hz.
        const perFrameDelta =
          stepMs > 0
            ? (Math.abs(reel.position - reel.prevPos) * FRAME_MS) / stepMs
            : 0;
        reel.blur.strengthY = perFrameDelta * 8;
        // Attach the blur filter only while the reel actually moves — see construction note.
        if (perFrameDelta > 0 && !reel.rc.filters)
          reel.rc.filters = [reel.blur];
        reel.prevPos = reel.position;

        for (let j = 0; j < reel.symbols.length; j++) {
          const sym = reel.symbols[j];
          const prevY = sym.container.y;
          const baseY = ((reel.position + j) % REEL_SIZE) * cellH - cellH;
          sym.container.y = baseY;

          if (sym.container.y < 0 && prevY > cellH && !reel.stopping) {
            updateSymbol(sym, randomAlias(reels.indexOf(reel)), cellW, cellH);
          }
          // Buffer cells outside a landed reel must not bleed into the grid,
          // especially the enlarged wild above the first visible row.
          const reelMoving = (spinRef.current && !reel.stopping)
            || tweensRef.current.some(tween => tween.reel === reel);
          const outsideSettledGrid = !reelMoving
            && (baseY < -0.01 || baseY >= VISIBLE_ROWS * cellH - 0.01);
          sym.sprite.renderable = !outsideSettledGrid
            && !(collectorOverlayVisibleRef.current && sym.alias === 'sym-wild');
        }
      }

      for (const { spine } of wildIdleSpinesRef.current) {
        spine.renderable = !collectorOverlayVisibleRef.current;
      }
      const highlights = winHighlightsRef.current;
      // The bonus-entry reveal is one-shot; keep it from restarting under the transition.
      const bonusRevealFinished = winCycleFiredRef.current && highlights.some(highlight =>
        highlight.winAmount === 0 && highlight.cells.some(cell => cell.animIdx === 10));
      if (!spinRef.current && highlights.length > 0 && !bonusRevealFinished) {
        const current = highlights[paylineCycleIdxRef.current];
        const lineShowMs = current?.showMs ?? 1000;
        const lineCycleMs = lineShowMs + LINE_DELAY_MS;

        paylineCycleElapsedRef.current += app!.ticker.deltaMS;
        const elapsed = paylineCycleElapsedRef.current;

        // Door reaches its fully-open pose before the end of the reveal.
        // Hand off directly to the portal transition and keep the open Spine
        // visible underneath it instead of restoring the closed static symbol.
        const isFinalBonusDoor = paylineCycleIdxRef.current === highlights.length - 1
          && current?.winAmount === 0
          && current.cells.some(cell => cell.animIdx === 10);
        if (isFinalBonusDoor && elapsed >= lineShowMs * 0.84 && !winCycleFiredRef.current) {
          const finalWin = finalWinAmountRef.current;
          if (finalWin != null && finalWin > 0) onPresentedWinChangeRef.current?.(finalWin);
          winCycleFiredRef.current = true;
          if (!bigWinPendingRef.current) winCycleDoneRef.current?.();
          return;
        }

        if (elapsed >= lineCycleMs) {
          paylineCycleElapsedRef.current = 0;
          paylineInDelayRef.current = false;
          const nextIdx = (paylineCycleIdxRef.current + 1) % highlights.length;

          if (nextIdx === 0 && !winCycleFiredRef.current) {
            const finalWin = finalWinAmountRef.current;
            if (finalWin != null && finalWin > 0) {
              onPresentedWinChangeRef.current?.(finalWin);
            }
            winCycleFiredRef.current = true;
            // Big win pending: useBigWinOverlay calls winCycleDoneRef itself once the
            // banner is dismissed, so autoplay/bonus don't advance past it.
            if (!bigWinPendingRef.current) winCycleDoneRef.current?.();
            return;
          }

          paylineCycleIdxRef.current = nextIdx;
          activateWinLine(nextIdx);
        } else if (elapsed >= lineShowMs && !paylineInDelayRef.current) {
          paylineInDelayRef.current = true;
          if (current?.paylineAnim) paylineLayerRef.current?.removeChildren();
          for (const spine of activeWinSpinesRef.current) {
            if (spine.parent) spine.parent.removeChild(spine);
            spine.destroy();
          }
          activeWinSpinesRef.current = [];
          applyMatrixToAllReels(matrixRef.current);
          restoreStaticWinCells(current?.cells ?? []);
          resetGridSymbolAppearance();
          hideWildStripColumnsRef.current?.(expandingWildColsRef.current);
          const activeCells = new Set(
            (current?.cells ?? []).map(({ col, row }) => `${col},${row}`),
          );
          dimInactiveGridSymbols(activeCells);
          restoreWildIdle();
        }
      }
    };

    app.ticker.add(onTick);

    return () => {
      app.renderer.off("resize", syncStageScale);
      cancelled = true;
      loadedRef.current = false;
      spineReadyRef.current = false;
      app.ticker.remove(onTick);
      tweensRef.current = [];
      reelsRef.current = [];
      winOverlayRef.current = null;
      settledOverlayRef.current = null;
      settledSymbolSpinesRef.current = [];
      paylineLayerRef.current = null;
      bigWinLayerRef.current = null;
      bigWinAmountTickUpRef.current?.stop();
      bigWinAmountTickUpRef.current = null;
      activateWinLineRef.current = null;
      applyMatrixToAllReelsRef.current = () => {};
      for (const spine of activeWinSpinesRef.current) spine.destroy();
      activeWinSpinesRef.current = [];
      for (const h of winHighlightsRef.current) h.paylineAnim?.destroy();
      winHighlightsRef.current = [];
      for (const spine of wildActiveSpinesRef.current) spine.destroy();
      wildActiveSpinesRef.current = [];
      for (const { spine } of wildIdleSpinesRef.current) spine.destroy();
      wildIdleSpinesRef.current = [];
      expandingWildColsRef.current = [];
      wildOverlayRef.current = null;
      hideWildStripColumnsRef.current = null;
      stopReelsRef.current = () => {};
      wildOverlayCont.destroy({ children: true });
      winOverlayCont.destroy({ children: true });
      settledOverlayCont.destroy({ children: true });
      paylineLayer.destroy({ children: true });
      bigWinLayer.destroy({ children: true });
      reelFrameContainer?.destroy({ children: true });
      reelFrameContainer = null;
      reelCont.destroy({ children: true });
      if (reelCont.parent) reelCont.parent.removeChild(reelCont);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app, isInitialised]);
}
