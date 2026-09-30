import bonusBuys from "@/config/bonusBuys.json";
import { displayAmountToApi } from "@/utils/currency";
import {
  REEL_COUNT,
  ROW_COUNT,
  symbolIdToName,
} from "@/features/slot/player/symbolMap";
import type { Book, BookEvent } from "@/features/slot/player/bookEvents";
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
const SYMBOL_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

function randomSymbolId(): number {
  return SYMBOL_IDS[Math.floor(Math.random() * SYMBOL_IDS.length)];
}

function randomBoardIds(): number[][] {
  return Array.from({ length: REEL_COUNT }, () =>
    Array.from({ length: ROW_COUNT }, () => randomSymbolId()),
  );
}

function revealEvent(matrix: number[][]): BookEvent {
  return {
    index: 0,
    type: "reveal",
    board: matrix.map((reel) =>
      reel.map((id) => ({ name: symbolIdToName(id) })),
    ),
    gameType: "basegame",
    anticipation: [0, 0, 0, 0, 0],
  };
}

async function buildMockBook(mode?: string): Promise<Book> {
  if (__TEST_TOOLS_ENABLED__ && bonusBuys.some((plan) => plan.mode === mode)) {
    const fixtures = await import("./buyBonusFixtures.json");
    const fixture = (fixtures.default as Record<string, { payoutMultiplier: number }>)[mode!] as Book;
    return { ...fixture, id: Date.now(), payoutMultiplier: fixture.payoutMultiplier! / 100 };
  }
  if (__TEST_TOOLS_ENABLED__ && new URLSearchParams(window.location.search).get("bonus") === "1") {
    const { default: fixture } = await import("./bonusFixture.json");
    return { ...fixture, id: Date.now(), payoutMultiplier: fixture.payoutMultiplier / 100 } as Book;
  }
  const roll = Math.random();
  let matrix = randomBoardIds();
  const events: BookEvent[] = [];
  let payoutMultiplier = 0;

  if (roll < 0.35) {
    const symbol = [1, 2, 3, 4][Math.floor(Math.random() * 4)];
    matrix = matrix.map((reel, i) => {
      const next = [...reel];
      next[1] = i < 3 ? symbol : next[1];
      return next;
    });
    payoutMultiplier = 2;
    events.push(revealEvent(matrix));
    events.push({
      index: 1,
      type: "winInfo",
      totalWin: 200,
      wins: [{ symbol: symbolIdToName(symbol), count: 3, win: 200, line: 1 }],
    });
    events.push({ index: 2, type: "setTotalWin", amount: 200 });
    events.push({ index: 3, type: "finalWin", amount: 200 });
  } else if (roll < 0.45) {
    matrix[1] = [9, 9, 9];
    const wildMultiplier = [2, 3, 5, 10][Math.floor(Math.random() * 4)];
    const reveal = revealEvent(matrix) as BookEvent & {
      board: { name: string; wild?: boolean; multiplier?: number }[][];
    };
    reveal.board[1] = reveal.board[1].map((cell) => ({
      ...cell,
      wild: true,
      multiplier: wildMultiplier,
    }));
    events.push(reveal);
    events.push({
      index: 1,
      type: "expandingWild",
      expandingWild: [0, 9, 0, 0, 0],
    });
    events.push({ index: 2, type: "setTotalWin", amount: 0 });
    events.push({ index: 3, type: "finalWin", amount: 0 });
  } else {
    events.push(revealEvent(matrix));
    events.push({ index: 1, type: "setTotalWin", amount: 0 });
    events.push({ index: 2, type: "finalWin", amount: 0 });
  }

  return { id: Date.now(), payoutMultiplier, events };
}

/**
 * Local stand-in for RGS while math + ACP session are not ready.
 * Speaks the same client interface so `useRgsSession` does not branch on transport.
 */
export function createMockRgsClient(currency = "USD"): RgsClient {
  let balanceAmount = displayAmountToApi(MOCK_DISPLAY_BALANCE);
  const betLevels = MOCK_BET_LEVELS_DISPLAY.map(displayAmountToApi);
  let roundActive = false;
  let lastRound: RgsRound | null = null;

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
      const plan = bonusBuys.find((item) => item.mode === params.mode);
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
