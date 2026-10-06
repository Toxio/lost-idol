import bonusBoost from '@/config/bonusBoost.json';
import bonusBuys from "@/config/bonusBuys.json";
import { displayAmountToApi } from "@/utils/currency";
import type { Book } from "@/features/slot/player/bookEvents";
import { RgsError, RGS_ERROR } from "./errors";
import type {
  AuthenticateResponse,
  EndRoundResponse,
  EventResponse,
  PlayParams,
  PlayResponse,
  ReplayParams,
  ReplayResponse,
  RgsClient,
  RgsRound,
} from "./types";
import { DEFAULT_BET_MODE, DEFAULT_JURISDICTION } from "./types";

const MOCK_DISPLAY_BALANCE = 10_000;
/** Typical RGS ladder so the bet picker can be tested with a long list locally. */
const MOCK_BET_LEVELS_DISPLAY = [
  0.01, 0.02, 0.03, 0.05, 0.08, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75,
  0.8, 1, 1.2, 1.5, 1.6, 2, 2.4, 2.5, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 25, 30,
  40, 50, 60, 80, 100, 120, 160, 200, 250, 500, 750, 1000,
];
const MOCK_DEFAULT_BET_DISPLAY = 1;
/** Dev server samples calibrated payout weights; offline previews use visual fixtures. */
async function buildMockBook(mode = 'base'): Promise<Book> {
  if (import.meta.env.DEV) {
    const response = await fetch(`/__calibrated-math?mode=${encodeURIComponent(mode)}`);
    if (!response.ok) throw new Error('Calibrated local math is unavailable. Generate the math preview library.');
    const sample = await response.json() as Book;
    return { ...sample, id: Date.now(), payoutMultiplier: (sample.payoutMultiplier ?? 0) / 100 };
  }
  const { default: samples } = await import('./collectorBooks.json');
  const pool = (samples as unknown as Record<string, Book[]>)[mode] ?? samples.base;
  const sample = pool[Math.floor(Math.random() * pool.length)] as Book;
  return { ...sample, id: Date.now(), payoutMultiplier: (sample.payoutMultiplier ?? 0) / 100 };
}

export function createMockRgsClient(currency = "USD"): RgsClient {
  let balanceAmount = displayAmountToApi(MOCK_DISPLAY_BALANCE);
  const betLevels = MOCK_BET_LEVELS_DISPLAY.map(displayAmountToApi);
  let roundActive = false;
  let lastRound: RgsRound | null = null;
  const storageKey = `lost-idol-local-wallet-treasury-${currency}`;
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null');
    if (saved && Number.isSafeInteger(saved.balanceAmount) && saved.balanceAmount >= 0) {
      balanceAmount = saved.balanceAmount;
      lastRound = saved.lastRound ?? null;
      roundActive = Boolean(lastRound?.active);
    }
  } catch { /* The local wallet also works when browser storage is unavailable. */ }
  function persist() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({ balanceAmount, lastRound })); } catch { /* Optional local persistence. */ }
  }


  return {
    async authenticate(): Promise<AuthenticateResponse> {
      return {
        balance: { amount: balanceAmount, currency },
        config: {
          minBet: betLevels[0],
          maxBet: betLevels[betLevels.length - 1],
          stepBet: betLevels[0],
          defaultBetLevel: displayAmountToApi(MOCK_DEFAULT_BET_DISPLAY),
          betLevels,
        },
        jurisdictionFlags: { ...DEFAULT_JURISDICTION },
        round: lastRound?.active ? lastRound : null,
      };
    },

    async play(params: PlayParams): Promise<PlayResponse> {
      if (roundActive) {
        throw new RgsError(
          RGS_ERROR.INVALID_REQUEST,
          400,
          "A round is already active",
        );
      }
      if (
        params.amount < betLevels[0] ||
        params.amount > betLevels[betLevels.length - 1]
      ) {
        throw new RgsError(
          RGS_ERROR.INVALID_REQUEST,
          400,
          "Bet is outside minBet/maxBet",
        );
      }
      if (betLevels[0] > 0 && params.amount % betLevels[0] !== 0) {
        throw new RgsError(
          RGS_ERROR.INVALID_REQUEST,
          400,
          "Bet is not divisible by stepBet",
        );
      }
      const plan = params.mode === bonusBoost.mode ? bonusBoost : bonusBuys.find((item) => item.mode === params.mode);
      if (params.mode !== DEFAULT_BET_MODE && !plan) throw new RgsError(RGS_ERROR.INVALID_REQUEST, 400, "Unknown mode");
      const debit = Math.round(params.amount * (plan?.cost ?? 1));
      if (debit > balanceAmount) {
        throw new RgsError(
          RGS_ERROR.INSUFFICIENT_BALANCE,
          400,
          "Insufficient balance",
        );
      }
      const book = await buildMockBook(params.mode);
      balanceAmount -= debit;
      const payoutMultiplier = book.payoutMultiplier ?? 0;
      const payout = Math.round(params.amount * payoutMultiplier);
      roundActive = payout > 0;
      lastRound = {
        betID: Number(book.id) || Date.now(),
        amount: params.amount,
        payout,
        payoutMultiplier,
        active: roundActive,
        mode: params.mode || DEFAULT_BET_MODE,
        state: book,
      };
      persist();
      return {
        balance: { amount: balanceAmount, currency },
        round: lastRound,
      };
    },

    async endRound(): Promise<EndRoundResponse> {
      if (roundActive && lastRound?.payout && lastRound.payout > 0) {
        balanceAmount += lastRound.payout;
      }
      roundActive = false;
      if (lastRound) lastRound = { ...lastRound, active: false };
      persist();
      return { balance: { amount: balanceAmount, currency } };
    },

    async event(eventValue: string): Promise<EventResponse> {
      return { event: eventValue };
    },

    async fetchReplay(params: ReplayParams): Promise<ReplayResponse> {
      void params;
      const book = await buildMockBook();
      return {
        payoutMultiplier: book.payoutMultiplier ?? 0,
        costMultiplier: 1,
        state: book,
      };
    },
  };
}
