import type { Application, Container } from "pixi.js";
import { type RefObject, useEffect, useRef } from "react";

import {
  play as playSound,
  playBigWin,
  playWildWin,
  stopBigWinSounds,
} from "@/audio/soundManager";
import {
  bigWinAmountTickUpDurationMs,
  bigWinAnimationForOdd,
  startBigWinAmountTickUp,
} from "@/animation/bigWinSpine";
import { createLostIdolBigWin, loadLostIdolBigWin } from "@/animation/lostIdolBigWin";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "../constants";

/** Extra time the banner stays up after the amount finishes ticking, before auto-advancing. */
const BIG_WIN_HOLD_AFTER_TICK_MS = 1500;

/** Resolves once `ref.current` is true, polling on the Pixi ticker (ref is imperative, not React state). */
function waitForRef(app: Application, ref: RefObject<boolean>): Promise<void> {
  if (ref.current) return Promise.resolve();
  return new Promise((resolve) => {
    const check = () => {
      if (!ref.current) return;
      app.ticker.remove(check);
      resolve();
    };
    app.ticker.add(check);
  });
}

interface UseBigWinOverlayOptions {
  app: Application | null;
  spinning: boolean;
  spinOdd: number | null;
  winAmount: number | null;
  winLinesCount: number;
  expandingWild: number[];
  currency: string;
  precision: number;
  /** Mirrors the latest `spinning` value for async callbacks that fire after Spine load. */
  spinRef: RefObject<boolean>;
  /** Container that hosts the big-win banner; created in the main scene effect. */
  bigWinLayerRef: RefObject<Container | null>;
  /** Set true while big-win is on-screen; suppresses inline win-line sounds. */
  bigWinActiveRef: RefObject<boolean>;
  /** Tick-up handle for the win amount counter; owned by SlotReels for cross-effect cleanup. */
  amountTickUpRef: RefObject<{ stop: () => void } | null>;
  /** Flips true once the win-line cycle completes its first pass; reset false at spin start. */
  winCycleFiredRef: RefObject<boolean>;
  /**
   * Set synchronously (before the async banner mount) once we know a big win will show; reset
   * false at spin start. useReelsScene reads this to hold off `winCycleDoneRef` — which drives
   * autoplay's next spin and bonus-round frame advance — until the banner is actually dismissed.
   * Without this gate, autoplay/bonus advance the instant the win-lines finish their first pass,
   * which used to be exactly when the banner mounted — now that mounting is deferred to that same
   * moment, advancing immediately would cut the banner off before it's shown anything.
   */
  bigWinPendingRef: RefObject<boolean>;
  /** External win-cycle-done callback (autoplay / bonus advance); called once the banner is dismissed. */
  winCycleDoneRef: RefObject<(() => void) | undefined>;
  /**
   * Autoplay or a bonus round is driving the game, so no tap is coming — the banner dismisses
   * itself after a hold. In manual play it stays up until the player clicks.
   */
  autoAdvance: boolean;
}

/**
 * Triggers the big-win banner overlay once a spin settles with a high-multiplier win.
 * The overlay is built asynchronously (Spine spritesheet loads on demand), so the hook
 * re-checks tier and `spinning` state before mounting.
 *
 * Tick-up animation is owned here; the main scene effect resets layer children at spin start.
 */
export function useBigWinOverlay({
  app,
  spinning,
  spinOdd,
  winAmount,
  winLinesCount,
  expandingWild,
  currency,
  precision,
  spinRef,
  bigWinLayerRef,
  bigWinActiveRef,
  amountTickUpRef,
  winCycleFiredRef,
  bigWinPendingRef,
  winCycleDoneRef,
  autoAdvance,
}: UseBigWinOverlayOptions) {
  const prevSpinningRef = useRef(spinning);

  // Mirrors the latest prop values so the trigger effect below can depend on just
  // `[spinning, app]` — these props get new references on incidental re-renders (e.g. every
  // presented-win tick), which would otherwise re-run the effect, tear down the dismiss-on-click
  // listener via cleanup, and never re-attach it (`justStopped` is false on that re-run).
  const latestRef = useRef({
    spinOdd,
    winAmount,
    winLinesCount,
    expandingWild,
    currency,
    precision,
    autoAdvance,
  });
  useEffect(() => {
    latestRef.current = {
      spinOdd,
      winAmount,
      winLinesCount,
      expandingWild,
      currency,
      precision,
      autoAdvance,
    };
  });

  useEffect(() => {
    const justStopped = prevSpinningRef.current && !spinning;
    prevSpinningRef.current = spinning;

    /** Set once the banner mounts; removes the dismiss-on-click listener. */
    let dismiss: (() => void) | null = null;
    const cleanup = () => dismiss?.();

    if (!justStopped) return cleanup;

    const {
      spinOdd,
      winAmount,
      winLinesCount,
      expandingWild,
      currency,
      precision,
    } = latestRef.current;

    const tier = spinOdd != null ? bigWinAnimationForOdd(spinOdd) : null;
    if (!tier) {
      if (winLinesCount > 0) {
        const hasWild = expandingWild.some((x) => x !== 0);
        if (hasWild) playWildWin();
        else playSound("win_simple");
      }
      return cleanup;
    }
    if (winLinesCount === 0 || winAmount == null || winAmount <= 0)
      return cleanup;
    const appRef = app;
    if (!appRef) return cleanup;

    // Hold off bonus-advance / autoplay's next spin until the banner has been dismissed —
    // set synchronously, well before the win-line cycle even reaches its first pass.
    bigWinPendingRef.current = true;

    const targetWinAmount = winAmount;
    // Let the first win-lines pass play out (with its own sounds) before the big-win
    // banner takes over — banner mounts only once that pass completes.
    void Promise.all([
      loadLostIdolBigWin(),
      waitForRef(appRef, winCycleFiredRef),
    ]).then(() => {
      if (spinRef.current) {
        bigWinPendingRef.current = false;
        return;
      }
      const stillTier = spinOdd != null ? bigWinAnimationForOdd(spinOdd) : null;
      if (stillTier !== tier) {
        bigWinPendingRef.current = false;
        return;
      }
      const layer = bigWinLayerRef.current;
      if (!layer || !appRef.ticker) {
        bigWinPendingRef.current = false;
        return;
      }

      bigWinActiveRef.current = true;
      playBigWin();

      amountTickUpRef.current?.stop();
      amountTickUpRef.current = null;

      for (const child of [...layer.children]) {
        layer.removeChild(child);
        child.destroy({ children: true });
      }

      const { root, amountLabel } = createLostIdolBigWin(
        tier, appRef.ticker, DESIGN_WIDTH, DESIGN_HEIGHT,
        targetWinAmount, currency, precision,
      );
      layer.addChild(root);

      amountTickUpRef.current = startBigWinAmountTickUp(
        amountLabel,
        targetWinAmount,
        appRef.ticker,
        { currency, precision },
      );

      let finished = false;
      let autoAdvanceTimer: number | null = null;

      const finish = () => {
        if (finished) return;
        finished = true;
        window.removeEventListener("pointerdown", onPointerDown, true);
        window.removeEventListener("keydown", onKeyDown, true);
        if (autoAdvanceTimer !== null) window.clearTimeout(autoAdvanceTimer);
        dismiss = null;

        bigWinActiveRef.current = false;
        bigWinPendingRef.current = false;
        stopBigWinSounds();
        amountTickUpRef.current?.stop();
        amountTickUpRef.current = null;
        for (const child of [...layer.children]) {
          layer.removeChild(child);
          child.destroy({ children: true });
        }
        // Unblocks autoplay's next spin / bonus-round frame advance, held off until now.
        winCycleDoneRef.current?.();
      };

      // Any click/tap dismisses the banner immediately (swallowed so it doesn't also
      // trigger whatever button is underneath, e.g. spin).
      const onPointerDown = (event: PointerEvent) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        finish();
      };
      // Space maps to the spin button (see useSpaceKeyForSpin) and doesn't go through
      // pointerdown — block it too so it can't sneak a spin past the still-pending banner.
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.code !== "Space" && event.key !== " ") return;
        event.preventDefault();
        event.stopImmediatePropagation();
        finish();
      };
      window.addEventListener("pointerdown", onPointerDown, true);
      window.addEventListener("keydown", onKeyDown, true);
      // Read at mount time, not at spin-stop: autoplay can end while the win lines cycle.
      // Manual play gets no timer at all — the banner waits for the player.
      if (latestRef.current.autoAdvance) {
        autoAdvanceTimer = window.setTimeout(
          finish,
          bigWinAmountTickUpDurationMs(targetWinAmount) +
            BIG_WIN_HOLD_AFTER_TICK_MS,
        );
      }
      dismiss = () => {
        window.removeEventListener("pointerdown", onPointerDown, true);
        window.removeEventListener("keydown", onKeyDown, true);
        if (autoAdvanceTimer !== null) window.clearTimeout(autoAdvanceTimer);
      };
    });

    return cleanup;
    // `spinOdd`/`winAmount`/etc. are intentionally excluded — read from `latestRef` above so
    // incidental reference changes don't re-run this effect while the banner is up. See comment above.
  }, [
    spinning,
    app,
    spinRef,
    bigWinLayerRef,
    bigWinActiveRef,
    amountTickUpRef,
    winCycleFiredRef,
    bigWinPendingRef,
    winCycleDoneRef,
  ]);
  // `autoAdvance` is intentionally absent — read from `latestRef` inside the mount callback.

  return { amountTickUpRef };
}
