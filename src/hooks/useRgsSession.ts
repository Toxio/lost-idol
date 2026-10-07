import { resetWildSoundSequence } from '@/audio/soundManager';
import bonusBoost from '@/config/bonusBoost.json';
import type { TreasurySession } from '@/features/slot/treasury/treasuryModel';
import bonusBuys from "@/config/bonusBuys.json";
import type { CollectorAction } from '@/features/slot/player/bookEvents';
import { COLLECTOR_TRANSITION, collectorJumps } from '@/features/slot/player/collectorTransition';
import {
  buildRoundFrames,
  type RoundFrame,
} from "@/features/slot/player/roundPlayback";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { WinLine } from "@/api/gameTypes";
import {
  createHttpRgsClient,
  createMockRgsClient,
  DEFAULT_BET_MODE,
  DEFAULT_JURISDICTION,
  extractBook,
  isInsufficientFundsError,
  isSessionError,
  resolveBetConfig,
  snapToBetLevel,
  type JurisdictionFlags,
  type RgsClient,
  type RgsRound,
} from "@/api/rgs";
import {
  createDefaultMatrix,
  EMPTY_EXPANDING_WILD,
  playBookToSpinResult,
  type SpinVisualResult,
  type Book,
} from "@/features/slot/player";
import {
  apiAmountToDisplay,
  decimalsForCurrency,
  DEFAULT_CURRENCY_PRECISION,
  displayAmountToApi,
  resolveCurrencyCode,
} from "@/utils/currency";
import {
  getGameUrlParams,
  isReplayMode,
  shouldUseMockRgs,
} from "@/utils/getGameUrlParams";
import { canAffordStake } from "@/utils/stakeBalance";

export type ConnStatus =
  | "connecting"
  | "ready"
  | "error"
  | "disconnected"
  | "session_expired";

export type { WinLine };

export interface UseRgsSessionOptions {
  onInsufficientFunds?: () => void;
}

export interface ForceSpinPreset {
  /** Optional full event book for development-only feature playback. */
  book?: Book;
  matrix: number[][];
  winLines: WinLine[];
  winAmount: number;
  expandingWild?: number[];
  odd?: number;
}

export interface BonusState {
  purchased?: boolean;
  phase: "idle" | "intro" | "playing" | "summary";
  current: number;
  total: number;
  totalWin: number;
  wildMultipliers: number[];
}
const EMPTY_BONUS: BonusState = {
  phase: "idle",
  current: 0,
  total: 0,
  totalWin: 0,
  wildMultipliers: [],
};

export interface SlotSessionState {
  boostEnabled: boolean;
  setBoostEnabled: (enabled: boolean) => void;
  treasury: TreasurySession | null;
  continueTreasury: () => void;
  roundBusy: boolean;
  collector: CollectorAction | null;
  collectorMoving: boolean;
  collectorWinAmount: number | null;
  bonus: BonusState;
  continueBonus: () => void;
  handleWinPresentationComplete: () => void;
  status: ConnStatus;
  balance: number;
  currency: string;
  precision: number;
  matrix: number[][];
  setMatrix: Dispatch<SetStateAction<number[][]>>;
  quickBets: number[];
  betAmount: number;
  setBetAmount: Dispatch<SetStateAction<number>>;
  spinning: boolean;
  targetMatrix: number[][] | null;
  winAmount: number | null;
  winLines: WinLine[];
  expandingWild: number[];
  spinOdd: number | null;
  jurisdiction: JurisdictionFlags;
  replay: boolean;
  replayMode: string;
  replayCostMultiplier: number;
  replayPayoutMultiplier: number;
  /** True once a replay round is fetched and waiting for the user to press Play. */
  replayReady: boolean;
  /** True after a replay round has fully played once — enables "Play Again". */
  replayFinished: boolean;
  spin: () => Promise<void>;
  buyBonus: (mode: string, stake: number) => Promise<void>;
  forceSpin: (preset: ForceSpinPreset) => void;
  handleSpinComplete: () => void;
  consumePendingRound: () => void;
  /** Re-queue the stored replay round for another playback. No-op outside replay. */
  replayAgain: () => void;
}

/** @deprecated Use SlotSessionState — kept so existing imports keep compiling during the swap. */
export type SlotsHubSignalRState = SlotSessionState;

function applyBalance(amount: number): number {
  return apiAmountToDisplay(amount);
}

function visualFromRound(
  round: RgsRound,
  betAmount: number,
  fallbackMatrix: number[][],
  fromIndex = 0,
): Promise<SpinVisualResult> {
  const book = extractBook(round);
  if (!book) {
    return Promise.resolve({
      matrix: fallbackMatrix,
      winLines: [],
      expandingWild: [...EMPTY_EXPANDING_WILD],
      winAmount: round.payout != null ? apiAmountToDisplay(round.payout) : 0,
      spinOdd: round.payoutMultiplier ?? null,
    });
  }
  return playBookToSpinResult(book, betAmount, {
    fromIndex,
    fallbackMatrix,
  }).then((result) => {
    if (round.payoutMultiplier != null) result.spinOdd = round.payoutMultiplier;
    if (round.payout != null)
      result.winAmount = apiAmountToDisplay(round.payout);
    return result;
  });
}

/**
 * RGS session facade. Same outward shape as the old SignalR hook so SlotMachinePixi
 * stays a Pixi/UI shell. Internals: REST authenticate / play / end-round + book player.
 */
export function useRgsSession({
  onInsufficientFunds,
}: UseRgsSessionOptions): SlotSessionState {
  const [roundBusy, setRoundBusy] = useState(false);
  const roundBusyRef = useRef(false);
  const [treasury, setTreasury] = useState<TreasurySession | null>(null);
  const treasuryRoundRef = useRef('');
  const treasuryPendingRef = useRef(false);
  const [bonus, setBonus] = useState<BonusState>(EMPTY_BONUS);
  const framesRef = useRef<RoundFrame[]>([]);
  const frameRef = useRef<RoundFrame | null>(null);
  const presentedRef = useRef(false);
  const bonusBaseWinRef = useRef(0);
  const purchasedBonusRef = useRef(false);
  const [status, setStatus] = useState<ConnStatus>("connecting");
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState(() => resolveCurrencyCode());
  const [precision, setPrecision] = useState(DEFAULT_CURRENCY_PRECISION);
  const [matrix, setMatrix] = useState<number[][]>(() => createDefaultMatrix());
  const [quickBets, setQuickBets] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(0);
  const [boostEnabled, setBoostEnabled] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [collector, setCollector] = useState<CollectorAction | null>(null);
  const [collectorMoving, setCollectorMoving] = useState(false);
  const [collectorWinAmount, setCollectorWinAmount] = useState<number | null>(null);
  const [targetMatrix, setTargetMatrix] = useState<number[][] | null>(null);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [winLines, setWinLines] = useState<WinLine[]>([]);
  const [expandingWild, setExpandingWild] = useState<number[]>([
    ...EMPTY_EXPANDING_WILD,
  ]);
  const [spinOdd, setSpinOdd] = useState<number | null>(null);
  const [jurisdiction, setJurisdiction] =
    useState<JurisdictionFlags>(DEFAULT_JURISDICTION);
  const [replay] = useState(() => isReplayMode());

  const clientRef = useRef<RgsClient | null>(null);
  const spinningRef = useRef(false);
  const targetMatrixRef = useRef<number[][] | null>(null);
  const betAmountRef = useRef(betAmount);
  const winAmountRef = useRef<number | null>(winAmount);
  const balanceRef = useRef(balance);
  const matrixRef = useRef(matrix);
  const pendingEndRoundRef = useRef(false);
  const pendingRoundRef = useRef<RgsRound | null>(null);
  const replayLockedRef = useRef(replay);
  const [replayMode, setReplayMode] = useState<string>(DEFAULT_BET_MODE);
  const [replayCostMultiplier, setReplayCostMultiplier] = useState(1);
  const [replayPayoutMultiplier, setReplayPayoutMultiplier] = useState(0);
  const [replayReady, setReplayReady] = useState(false);
  const [replayFinished, setReplayFinished] = useState(false);
  /** Kept alongside pendingRoundRef so "Play Again" can re-queue the same round
   *  without re-fetching from the RGS. */
  const replayRoundRef = useRef<RgsRound | null>(null);
  const onInsufficientFundsRef = useRef(onInsufficientFunds);

  useEffect(() => {
    onInsufficientFundsRef.current = onInsufficientFunds;
  }, [onInsufficientFunds]);
  useEffect(() => {
    spinningRef.current = spinning;
  }, [spinning]);
  useEffect(() => {
    targetMatrixRef.current = targetMatrix;
  }, [targetMatrix]);
  useEffect(() => {
    betAmountRef.current = betAmount;
  }, [betAmount]);
  useEffect(() => {
    winAmountRef.current = winAmount;
  }, [winAmount]);
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);
  useEffect(() => {
    matrixRef.current = matrix;
  }, [matrix]);

  const applyVisual = useCallback(
    (visual: SpinVisualResult, asTarget: boolean) => {
      setCollector(visual.collector ?? null);
      if (asTarget) {
        // Withhold the stop target until the in-spin jump has finished.
        setTargetMatrix(visual.collector && collectorJumps(visual.collector) ? null : visual.matrix);
        if (!spinningRef.current) setMatrix(visual.matrix);
      } else {
        setMatrix(visual.matrix);
        setTargetMatrix(null);
      }
      // BONUS awards free spins without a cash payline, but still needs a reveal cycle.
      const bonusCount = visual.matrix.flat().filter(symbol => symbol === 10).length;
      const bonusReveal = frameRef.current?.awardedFreeSpins && bonusCount > 0
        && !visual.winLines.some(line => line.symbol === 10 && line.line === 0);
      const presentationLines = bonusReveal
        ? [...visual.winLines, { symbol: 10, line: 0, count: bonusCount, winAmount: 0 }]
        : [...visual.winLines];
      if (frameRef.current?.treasury) presentationLines.push({ symbol: 2, line: 0, count: visual.matrix.flat().filter(symbol => symbol === 2).length, winAmount: 0 });
      setWinLines(asTarget && visual.collector ? [] : presentationLines);
      setExpandingWild(visual.expandingWild);
      setWinAmount(asTarget && visual.collector ? null : visual.winAmount);
      setSpinOdd(asTarget && visual.collector ? null : visual.spinOdd);
    },
    [],
  );

  const clearPreviousSpinResult = useCallback(() => {
    resetWildSoundSequence();
    setCollector(null);
    setCollectorMoving(false);
    setCollectorWinAmount(null);
    setWinAmount(null);
    setWinLines([]);
    setExpandingWild([...EMPTY_EXPANDING_WILD]);
    setSpinOdd(null);
    setTargetMatrix(null);
  }, []);

  const applyAuthConfig = useCallback(
    (auth: Awaited<ReturnType<RgsClient["authenticate"]>>) => {
      setBalance(applyBalance(auth.balance.amount));
      const nextCurrency = resolveCurrencyCode(auth.balance.currency);
      setCurrency(nextCurrency);
      setPrecision(decimalsForCurrency(nextCurrency));
      setJurisdiction(auth.jurisdictionFlags);
      const resolved = resolveBetConfig(auth.config);
      if (!resolved.betLevels.length) throw new Error("Authenticate returned no valid bet levels");
      setQuickBets(resolved.betLevels);
      setBetAmount(resolved.defaultBet);
    },
    [],
  );

  useEffect(() => {
    let disposed = false;

    async function boot(): Promise<void> {
      const params = getGameUrlParams();
      const mock = shouldUseMockRgs();

      if (mock) {
        console.warn(
          "[rgs] No sessionID/rgs_url — using mock RGS until math + ACP session exist",
        );
        clientRef.current = createMockRgsClient(params.currency ?? (params.social ? "XSC" : "USD"));
      } else if (
        params.replay &&
        params.rgsUrl &&
        params.replayGame &&
        params.replayEvent
      ) {
        clientRef.current = createHttpRgsClient({
          sessionID: params.sessionID ?? "replay",
          rgsUrl: params.rgsUrl,
          lang: params.lang,
        });
      } else if (params.sessionID && params.rgsUrl) {
        clientRef.current = createHttpRgsClient({
          sessionID: params.sessionID,
          rgsUrl: params.rgsUrl,
          lang: params.lang,
        });
      } else {
        setStatus("error");
        return;
      }

      const client = clientRef.current;
      if (!client) {
        setStatus("error");
        return;
      }

      try {
        if (
          params.replay &&
          params.replayGame &&
          params.replayEvent &&
          params.rgsUrl &&
          !mock
        ) {
          const replayData = await client.fetchReplay({
            game: params.replayGame,
            version: params.replayVersion ?? "1",
            mode: params.replayMode ?? DEFAULT_BET_MODE,
            event: params.replayEvent,
            language: params.lang,
          });
          if (disposed) return;
          setReplayMode(params.replayMode ?? DEFAULT_BET_MODE);
          setReplayCostMultiplier(replayData.costMultiplier || 1);
          setReplayPayoutMultiplier(replayData.payoutMultiplier);
          if (params.currency) setCurrency(params.currency);
          setPrecision(decimalsForCurrency(params.currency));
          if (params.replayAmount)
            setBetAmount(apiAmountToDisplay(params.replayAmount));
          const round: RgsRound = {
            active: false,
            mode: params.replayMode ?? DEFAULT_BET_MODE,
            payoutMultiplier: replayData.payoutMultiplier,
            state: replayData.state,
          };
          pendingRoundRef.current = round;
          replayRoundRef.current = round;
          setReplayReady(true);
          setStatus("ready");
          return;
        }

        const auth = await client.authenticate();
        if (disposed) return;
        applyAuthConfig(auth);
        if (auth.round?.active) pendingRoundRef.current = auth.round;
        setStatus("ready");
      } catch (error) {
        if (disposed) return;
        if (isSessionError(error)) setStatus("session_expired");
        else setStatus("error");
      }
    }

    void boot();

    const handleOffline = () => {
      if (!disposed) setStatus("disconnected");
    };
    const handleOnline = () => {
      if (disposed) return;
      // A fetched book can finish locally; keep its client and pending settlement.
      if (roundBusyRef.current && frameRef.current) {
        setStatus("ready");
        return;
      }
      setStatus((prev) => (prev === "disconnected" ? "connecting" : prev));
      void boot();
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      disposed = true;
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [applyAuthConfig]);

  const showFrame = useCallback(
    (frame: RoundFrame) => {
      frameRef.current = frame;
      presentedRef.current = false;
      spinningRef.current = true;
      setSpinning(true);
      applyVisual(frame.visual, true);
      setCollectorMoving(Boolean(frame.visual.collector && collectorJumps(frame.visual.collector)));
      setCollectorWinAmount(frame.visual.collector
        ? Math.max(0, frame.totalWin - frame.visual.winAmount)
        : null);
      if (frame.freeSpin > 0)
        setBonus({
          purchased: purchasedBonusRef.current,
          phase: "playing",
          current: frame.freeSpin,
          total: frame.totalFreeSpins,
          totalWin: Math.max(
            0,
            frame.totalWin - frame.visual.winAmount - bonusBaseWinRef.current,
          ),
          wildMultipliers: frame.wildMultipliers,
        });
      else setBonus({ ...EMPTY_BONUS, wildMultipliers: frame.wildMultipliers });
    },
    [applyVisual],
  );

  const beginRoundPlayback = useCallback(
    async (round: RgsRound) => {
      setBoostEnabled(round.mode === bonusBoost.mode);
      treasuryRoundRef.current = String(round.betID ?? round.id ?? extractBook(round)?.id ?? "replay");
      setTreasury(null);
      treasuryPendingRef.current = false;
      purchasedBonusRef.current = bonusBuys.some(plan => plan.mode === round.mode && plan.kind === 'free_spins');
      roundBusyRef.current = true;
      setRoundBusy(true);
      setBonus(EMPTY_BONUS);
      const stake =
        round.amount != null
          ? apiAmountToDisplay(round.amount)
          : betAmountRef.current;
      setBetAmount(stake);
      const book = extractBook(round);
      const frames = book
        ? await buildRoundFrames(book, stake, matrixRef.current)
        : [];
      if (!frames.length)
        frames.push({
          visual: await visualFromRound(round, stake, matrixRef.current),
          freeSpin: 0,
          totalFreeSpins: 0,
          awardedFreeSpins: 0,
          totalWin: 0,
          wildMultipliers: [],
        });
      const last = frames.at(-1)!;
      if (round.payout != null)
        last.totalWin = apiAmountToDisplay(round.payout);
      pendingEndRoundRef.current =
        Boolean(round.active) && !replayLockedRef.current;
      framesRef.current = frames.slice(1);
      showFrame(frames[0]);
    },
    [showFrame],
  );

  const consumePendingRound = useCallback(() => {
    const round = pendingRoundRef.current;
    if (!round || roundBusyRef.current) return;
    pendingRoundRef.current = null;
    if (replayLockedRef.current) setReplayReady(false);
    void beginRoundPlayback(round);
  }, [beginRoundPlayback]);

  const playRound = useCallback(async (mode = DEFAULT_BET_MODE, requestedStake = betAmount) => {
    const client = clientRef.current;
    if (
      !client ||
      roundBusyRef.current ||
      spinning ||
      status !== "ready" ||
      replayLockedRef.current
    )
      return;

    if (!Number.isFinite(requestedStake) || !quickBets.length) return;
    const plan = mode === bonusBoost.mode ? bonusBoost : bonusBuys.find((item) => item.mode === mode);
    if (boostEnabled && mode !== DEFAULT_BET_MODE && mode !== bonusBoost.mode) return;
    if (mode !== DEFAULT_BET_MODE && (!plan || jurisdiction.disabledBuyFeature)) return;
    const stake = snapToBetLevel(quickBets, requestedStake);
    if (stake !== betAmount) setBetAmount(stake);

    const stakePool = balance;
    if (!canAffordStake(stake * (plan?.cost ?? 1), stakePool)) {
      onInsufficientFunds?.();
      return;
    }

    roundBusyRef.current = true;
    setRoundBusy(true);
    spinningRef.current = true;
    setSpinning(true);
    clearPreviousSpinResult();
    pendingEndRoundRef.current = false;

    try {
      const response = await client.play({
        amount: displayAmountToApi(stake),
        mode,
      });
      setBalance(applyBalance(response.balance.amount));
      await beginRoundPlayback(response.round);
    } catch (error) {
      roundBusyRef.current = false;
      setRoundBusy(false);
      spinningRef.current = false;
      setSpinning(false);
      if (isInsufficientFundsError(error)) {
        onInsufficientFundsRef.current?.();
        return;
      }
      if (isSessionError(error)) {
        setStatus("session_expired");
        return;
      }
      setStatus("disconnected");
    }
  }, [
    spinning,
    status,
    balance,
    betAmount,
    quickBets,
    jurisdiction.disabledBuyFeature,
    boostEnabled,
    onInsufficientFunds,
    clearPreviousSpinResult,
    beginRoundPlayback,
  ]);

  const spin = useCallback(() => playRound(boostEnabled ? bonusBoost.mode : DEFAULT_BET_MODE), [playRound, boostEnabled]);
  const buyBonus = useCallback((mode: string, stake: number) => playRound(mode, stake), [playRound]);

  const forceSpin = useCallback(
    (preset: ForceSpinPreset) => {
      if (
        !__TEST_TOOLS_ENABLED__ ||
        roundBusyRef.current ||
        spinning ||
        replayLockedRef.current
      )
        return;
      const stake = snapToBetLevel(quickBets, betAmount);
      if (stake !== betAmount) setBetAmount(stake);
      const stakePool = balance;
      if (!canAffordStake(stake, stakePool)) {
        onInsufficientFunds?.();
        return;
      }
      if (preset.book) {
        clearPreviousSpinResult();
        void beginRoundPlayback({
          id: `test-${crypto.randomUUID()}`,
          active: false,
          mode: DEFAULT_BET_MODE,
          amount: displayAmountToApi(stake),
          state: preset.book,
        }).catch(() => {
          framesRef.current = [];
          frameRef.current = null;
          roundBusyRef.current = false;
          spinningRef.current = false;
          setRoundBusy(false);
          setSpinning(false);
          setStatus("error");
        });
        return;
      }
      setBonus(EMPTY_BONUS);
      setSpinning(true);
      clearPreviousSpinResult();
      pendingEndRoundRef.current = false;
      setTimeout(() => {
        setTargetMatrix(preset.matrix);
        setWinLines(preset.winLines);
        setWinAmount(preset.winAmount);
        setExpandingWild(preset.expandingWild ?? [...EMPTY_EXPANDING_WILD]);
        setSpinOdd(
          preset.odd !== undefined && Number.isFinite(preset.odd)
            ? preset.odd
            : null,
        );
      }, 0);
    },
    [
      spinning,
      betAmount,
      quickBets,
      balance,
      onInsufficientFunds,
      clearPreviousSpinResult,
      beginRoundPlayback,
    ],
  );

  const finishRound = useCallback(async () => {
    if (replayLockedRef.current) {
      setReplayFinished(true);
      setReplayReady(false);
    } else if (pendingEndRoundRef.current) {
      pendingEndRoundRef.current = false;
      try {
        const response = await clientRef.current!.endRound();
        setBalance(applyBalance(response.balance.amount));
      } catch (error) {
        setStatus(isSessionError(error) ? "session_expired" : "disconnected");
      }
    }
    frameRef.current = null;
    roundBusyRef.current = false;
    setRoundBusy(false);
  }, []);

  const advanceAfterTreasury = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    if (frame.awardedFreeSpins > 0) {
      bonusBaseWinRef.current = frame.totalWin;
      setBonus({ phase: 'intro', purchased: purchasedBonusRef.current, current: 0,
        total: frame.awardedFreeSpins, totalWin: 0, wildMultipliers: [] });
    } else if (framesRef.current.length) {
      showFrame(framesRef.current.shift()!);
    } else if (frame.freeSpin > 0) {
      setBonus(prev => ({ ...prev, phase: 'summary', totalWin: Math.max(0, frame.totalWin - bonusBaseWinRef.current) }));
      setWinAmount(frame.totalWin);
    } else if (frame.treasury) {
      setWinAmount(frame.totalWin);
      setCollectorWinAmount(frame.totalWin);
      void finishRound();
    }
  }, [showFrame, finishRound]);

  const continueTreasury = useCallback(() => {
    if (!treasuryPendingRef.current) return;
    treasuryPendingRef.current = false;
    setTreasury(null);
    advanceAfterTreasury();
  }, [advanceAfterTreasury]);

  const handleWinPresentationComplete = useCallback(() => {
    const frame = frameRef.current;
    if (!frame || spinningRef.current || collectorMoving || presentedRef.current) return;
    presentedRef.current = true;
    if (frame.treasury) {
      treasuryPendingRef.current = true;
      setWinLines([]);
      setTreasury({ ...frame.treasury, id: `${replayLockedRef.current ? "replay-" : ""}${treasuryRoundRef.current}`, bet: betAmountRef.current });
      return;
    }
    advanceAfterTreasury();
  }, [advanceAfterTreasury, collectorMoving]);

  const continueBonus = useCallback(() => {
    if (spinningRef.current || !presentedRef.current) return;
    presentedRef.current = false;
    if (bonus.phase === "intro" && framesRef.current.length) {
      showFrame(framesRef.current.shift()!);
    } else if (bonus.phase === "summary") {
      setBonus((prev) => ({ ...prev, phase: "idle" }));
      void finishRound();
    }
  }, [bonus.phase, showFrame, finishRound]);

  const handleSpinComplete = useCallback(() => {
    const committed = targetMatrixRef.current;
    if (committed) setMatrix(committed);
    spinningRef.current = false;
    setSpinning(false);
    setTargetMatrix(null);
    const frame = frameRef.current;
    if (frame?.visual.collector) {
      applyVisual(frame.visual, false);
      setCollectorWinAmount(frame.totalWin - (frame.treasury?.amount ?? 0) * betAmountRef.current);
    }
    if (frame?.freeSpin)
      setBonus((prev) => ({
        ...prev,
        totalWin: Math.max(0, frame.totalWin - bonusBaseWinRef.current),
      }));
    if (
      !frame ||
      (!framesRef.current.length && !frame.freeSpin && !frame.awardedFreeSpins && !frame.treasury)
    )
      void finishRound();
  }, [finishRound, applyVisual]);

  useEffect(() => {
    if (!collectorMoving) return;
    const frame = frameRef.current;
    const timer = window.setTimeout(() => {
      if (!frame || frameRef.current !== frame) return;
      // Reels are still spinning: only now allow them to settle on the final board.
      setCollectorMoving(false);
      setTargetMatrix(frame.visual.matrix);
    }, COLLECTOR_TRANSITION.duration);
    return () => window.clearTimeout(timer);
  }, [collectorMoving]);

  // Losing bonus spins have no win-cycle callback to advance them.
  useEffect(() => {
    if (
      !roundBusy ||
      collectorMoving ||
      spinning ||
      winLines.length ||
      bonus.phase === "intro" ||
      bonus.phase === "summary"
    )
      return;
    const timer = window.setTimeout(handleWinPresentationComplete, 900);
    return () => window.clearTimeout(timer);
  }, [
    roundBusy,
    collectorMoving,
    spinning,
    winLines.length,
    bonus.phase,
    handleWinPresentationComplete,
  ]);

  const replayAgain = useCallback(() => {
    if (!replayLockedRef.current || roundBusyRef.current) return;
    const round = replayRoundRef.current;
    if (!round) return;
    setReplayFinished(false);
    clearPreviousSpinResult();
    pendingRoundRef.current = round;
    setReplayReady(true);
  }, [clearPreviousSpinResult]);

  return {
    boostEnabled,
    setBoostEnabled,
    roundBusy,
    collector,
    treasury,
    continueTreasury,
    collectorMoving,
    collectorWinAmount,
    bonus,
    continueBonus,
    handleWinPresentationComplete,
    status,
    balance,
    currency,
    precision,
    matrix,
    setMatrix,
    quickBets,
    betAmount,
    setBetAmount,
    spinning,
    targetMatrix,
    winAmount,
    winLines,
    expandingWild,
    spinOdd,
    jurisdiction,
    replay,
    replayMode,
    replayCostMultiplier,
    replayPayoutMultiplier,
    replayReady,
    replayFinished,
    spin,
    buyBonus,
    forceSpin,
    handleSpinComplete,
    consumePendingRound,
    replayAgain,
  };
}

/** @deprecated Use useRgsSession */
export const useSlotsHubSignalR = useRgsSession;
