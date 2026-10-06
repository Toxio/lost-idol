import { useCallback, useEffect, useRef, useState } from 'react';

import type { AutoplayStartOptions } from '@/features/slot/modals/autoplaySettings';
import { useScreenWakeLock } from './useScreenWakeLock';

interface UseAutoplayOptions {
  spinning: boolean;
  freeSpinsTriggered?: boolean;
  treasuryTriggered?: boolean;
  status: string;
  winAmount: number | null;
  winLines: { length: number };
  betAmount: number;
  cannotAffordBet: boolean;
  connectionLost: boolean;
  spin: () => Promise<void> | void;
  onSpinSpeedChange: (speed: 1 | 2) => void;
  showInsufficientFunds: () => void;
}

export interface AutoplayApi {
  autoSpin: boolean;
  autoPickBonus: boolean;
  autoContinueFreeSpins: boolean;
  autoSpinRemaining: number | null;
  autoSpinEnabled: boolean;
  autoplayStoppedOpen: boolean;
  lastAutoSpinCount: number | null;
  start: (options: AutoplayStartOptions) => void;
  repeatLast: () => void;
  stop: () => void;
  closeAutoplayStoppedModal: () => void;
  /** Call from reels when win cycle finishes — gates next autoplay spin. */
  onWinCycleDone: () => void;
}

interface ResolvedStopConditions {
  stopAfterWin: boolean;
  stopOnWinAmount: number | null;
  stopOnLossAmount: number | null;
}

const NO_STOP: ResolvedStopConditions = {
  stopAfterWin: false,
  stopOnWinAmount: null,
  stopOnLossAmount: null,
};

export function useAutoplay({
  spinning,
  freeSpinsTriggered = false,
  treasuryTriggered = false,
  status,
  winAmount,
  winLines,
  betAmount,
  cannotAffordBet,
  connectionLost,
  spin,
  onSpinSpeedChange,
  showInsufficientFunds,
}: UseAutoplayOptions): AutoplayApi {
  const [bonusStops, setBonusStops] = useState({ free: false, treasury: false });
  const bonusTriggered = (freeSpinsTriggered && bonusStops.free) || (treasuryTriggered && bonusStops.treasury);
  const remainingRef = useRef<number | null>(null);
  const [autoSpin, setAutoSpin] = useState(false);
  const [autoSpinRemaining, setAutoSpinRemaining] = useState<number | null>(null);
  const [autoplayStoppedOpen, setAutoplayStoppedOpen] = useState(false);
  const [lastAutoSpinCount, setLastAutoSpinCount] = useState<number | null>(null);

  const waitingWinCycleRef = useRef(false);
  const autoSpinBlockedRef = useRef(false);
  const autoplayFinishedRef = useRef(false);
  const autoSpinTimerRef = useRef<number | null>(null);
  const prevSpinningRef = useRef(false);

  const stopConditionsRef = useRef<ResolvedStopConditions>(NO_STOP);
  const cumulativeWinRef = useRef(0);
  const cumulativeLossRef = useRef(0);
  const sessionBetRef = useRef(0);
  const lastOptionsRef = useRef<AutoplayStartOptions | null>(null);
  const stoppedModalTimerRef = useRef<number | null>(null);

  const autoSpinEnabled = autoSpin && !cannotAffordBet;

  useScreenWakeLock(autoSpin);

  const clearPendingTimer = useCallback(() => {
    if (autoSpinTimerRef.current !== null) {
      window.clearTimeout(autoSpinTimerRef.current);
      autoSpinTimerRef.current = null;
    }
  }, []);

  const decrementAndSpin = useCallback(() => {
    if (remainingRef.current !== null) {
      remainingRef.current = Math.max(0, remainingRef.current - 1);
      setAutoSpinRemaining(remainingRef.current);
      if (remainingRef.current === 0) autoplayFinishedRef.current = true;
    }
    void spin();
  }, [spin]);

  // Without this, every hub state update would recreate decrementAndSpin → re-run the effect →
  // cancel the pending timer → counter stalls (the spin&stop-mid-autoplay bug).
  const decrementAndSpinRef = useRef(decrementAndSpin);
  useEffect(() => {
    decrementAndSpinRef.current = decrementAndSpin;
  }, [decrementAndSpin]);

  const start = useCallback(
    (options: AutoplayStartOptions) => {
      if (cannotAffordBet) {
        showInsufficientFunds();
        return;
      }
      setBonusStops({ free: options.stopOnFreeSpins ?? false, treasury: options.stopOnTreasury ?? false });
      const bet = betAmount;
      sessionBetRef.current = bet;
      cumulativeWinRef.current = 0;
      cumulativeLossRef.current = 0;
      stopConditionsRef.current = {
        stopAfterWin: options.stopAfterWin,
        stopOnWinAmount: options.winMultiplier != null ? options.winMultiplier * bet : options.stopOnWinAmount,
        stopOnLossAmount: options.lossMultiplier != null ? options.lossMultiplier * bet : options.stopOnLossAmount,
      };

      lastOptionsRef.current = options;
      autoSpinBlockedRef.current = false;
      autoplayFinishedRef.current = false;
      setLastAutoSpinCount(options.count || null);
      remainingRef.current = options.count === 0 ? null : options.count;
      setAutoSpinRemaining(remainingRef.current);
      setAutoSpin(true);
      onSpinSpeedChange(2);
      autoSpinTimerRef.current = window.setTimeout(() => { autoSpinTimerRef.current = null; decrementAndSpin(); }, 300);
    },
    [betAmount, cannotAffordBet, showInsufficientFunds, onSpinSpeedChange, decrementAndSpin],
  );

  const stop = useCallback(() => {
    clearPendingTimer();
    if (stoppedModalTimerRef.current !== null) {
      window.clearTimeout(stoppedModalTimerRef.current);
      stoppedModalTimerRef.current = null;
    }
    autoplayFinishedRef.current = false;
    setAutoSpin(false);
    setAutoSpinRemaining(null);
    waitingWinCycleRef.current = false;
    stopConditionsRef.current = NO_STOP;
  }, [clearPendingTimer]);

  useEffect(() => {
    if (!bonusTriggered || !autoSpin) return;
    clearPendingTimer();
    const timer = window.setTimeout(stop, 0);
    return () => window.clearTimeout(timer);
  }, [bonusTriggered, autoSpin, clearPendingTimer, stop]);

  useEffect(() => () => clearPendingTimer(), [clearPendingTimer]);

  // Schedule next autoplay spin after current one ends.
  useEffect(() => {
    const wasSpinning = prevSpinningRef.current;
    prevSpinningRef.current = spinning;

    const spinJustEnded = wasSpinning && !spinning && status === 'ready';
    const hasPending = autoSpinTimerRef.current !== null;

    if (!spinJustEnded && !hasPending) return;
    if (spinning || status !== 'ready' || bonusTriggered) return;

    // Track cumulative win/loss and evaluate stop conditions once per spin completion.
    if (spinJustEnded && autoSpin && !autoplayFinishedRef.current) {
      const win = winAmount ?? 0;
      cumulativeWinRef.current += win;
      // Net loss for the session: every spin costs sessionBet and pays back `win`.
      // Wins reduce the running loss (and can even flip it negative on a big hit),
      // matching balance delta from the player's perspective.
      cumulativeLossRef.current += sessionBetRef.current - win;

      const c = stopConditionsRef.current;
      // Win condition is per-spin odd (win / bet) so a single big spin stops autoplay
      // immediately, regardless of running total. Loss condition uses net balance delta.
      const stopByCondition =
        (c.stopAfterWin && win > 0) ||
        (c.stopOnWinAmount !== null && win >= c.stopOnWinAmount) ||
        (c.stopOnLossAmount !== null && cumulativeLossRef.current >= c.stopOnLossAmount);

      if (stopByCondition) {
        clearPendingTimer();
        autoplayFinishedRef.current = true;
        window.setTimeout(() => {
          setAutoSpin(false);
          setAutoSpinRemaining(null);
        }, 0);
      }
    }

    if (autoSpinEnabled && !autoplayFinishedRef.current) {
      if (winLines.length > 0) {
        clearPendingTimer();
        waitingWinCycleRef.current = true;
        return;
      }
      if (autoSpinTimerRef.current === null) {
        autoSpinTimerRef.current = window.setTimeout(() => {
          autoSpinTimerRef.current = null;
          decrementAndSpinRef.current();
        }, 500);
      }
      return;
    }

    if (autoplayFinishedRef.current) {
      if (winLines.length > 0) {
        waitingWinCycleRef.current = true;
        return;
      }
      autoplayFinishedRef.current = false;
      if (stoppedModalTimerRef.current === null) {
        stoppedModalTimerRef.current = window.setTimeout(() => {
          stoppedModalTimerRef.current = null;
          setAutoSpin(false);
          setAutoSpinRemaining(null);
          setAutoplayStoppedOpen(true);
        }, 500);
      }
    }
  }, [spinning, autoSpinEnabled, autoSpin, status, winLines.length, winAmount, clearPendingTimer, bonusTriggered]);

  const onWinCycleDone = useCallback(() => {
    if (!waitingWinCycleRef.current) return;
    waitingWinCycleRef.current = false;
    if (autoplayFinishedRef.current) {
      autoplayFinishedRef.current = false;
      stoppedModalTimerRef.current = window.setTimeout(() => { setAutoSpin(false); setAutoSpinRemaining(null); setAutoplayStoppedOpen(true); }, 500);
      return;
    }
    autoSpinTimerRef.current = window.setTimeout(() => { autoSpinTimerRef.current = null; decrementAndSpinRef.current(); }, 300);
  }, []);

  // Show insufficient-funds modal mid-autoplay (once per blocked transition).
  useEffect(() => {
    if (!autoSpin || spinning) {
      if (!cannotAffordBet) autoSpinBlockedRef.current = false;
      return;
    }
    if (!cannotAffordBet || autoSpinBlockedRef.current) return;
    autoSpinBlockedRef.current = true;
    const id = window.setTimeout(() => showInsufficientFunds(), 0);
    return () => window.clearTimeout(id);
  }, [autoSpin, cannotAffordBet, spinning, showInsufficientFunds]);

  // Stop autoplay on connection loss.
  useEffect(() => {
    if (!connectionLost || !autoSpin) return;
    clearPendingTimer();
    const id = window.setTimeout(() => {
      setAutoSpin(false);
      setAutoSpinRemaining(null);
      waitingWinCycleRef.current = false;
    }, 0);
    return () => window.clearTimeout(id);
  }, [connectionLost, autoSpin, clearPendingTimer]);

  const closeAutoplayStoppedModal = useCallback(() => setAutoplayStoppedOpen(false), []);

  const repeatLast = useCallback(() => {
    if (lastOptionsRef.current) start(lastOptionsRef.current);
  }, [start]);

  return {
    autoSpin,
    autoContinueFreeSpins: autoSpin && !bonusStops.free && !connectionLost,
    autoPickBonus: autoSpin && !bonusStops.treasury && !connectionLost,
    autoSpinRemaining,
    autoSpinEnabled,
    autoplayStoppedOpen,
    lastAutoSpinCount,
    start,
    repeatLast,
    stop,
    closeAutoplayStoppedModal,
    onWinCycleDone,
  };
}
