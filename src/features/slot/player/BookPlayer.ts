import { bookAmountToDisplay } from '@/utils/currency';
import {
  getPaylineForLineId,
  isScatterWinLine,
} from '@/config/paylines';
import type { Book, BookEvent, SpinVisualResult } from './bookEvents';
import {
  boardToMatrix,
  decodeExpandingWild,
  decodeWinLines,
  emptySpinResult,
  type BookAmountEvent,
  type BookExpandingWildEvent,
  type BookRevealEvent,
  type BookWinInfoEvent,
} from './bookEvents';
import {
  createDefaultMatrix,
  EMPTY_EXPANDING_WILD,
  REEL_COUNT,
} from './symbolMap';

const WILD_SYMBOL_ID = 9;

/**
 * Math does not emit an `expandingWild` event — it's a presentation choice
 * ("only expand wilds that participate in a winning line"). Derive it here
 * from the final matrix and winLines instead of asking math to duplicate the info.
 */
function deriveExpandingWild(
  matrix: number[][],
  winLines: SpinVisualResult['winLines'],
): number[] {
  const flags = [...EMPTY_EXPANDING_WILD];
  for (const win of winLines) {
    if (isScatterWinLine(win.line)) continue;
    const rows = getPaylineForLineId(win.line);
    if (!rows) continue;
    const stretch = Math.min(win.count, REEL_COUNT);
    for (let reel = 0; reel < stretch; reel++) {
      const row = rows[reel];
      if (matrix[reel]?.[row] === WILD_SYMBOL_ID) flags[reel] = WILD_SYMBOL_ID;
    }
  }
  return flags;
}

export type BookPlayerContext = {
  betAmount: number;
  result: SpinVisualResult;
  skip: boolean;
};

type BookEventHandler = (
  event: BookEvent,
  ctx: BookPlayerContext,
) => Promise<void>;

const handlers: Record<string, BookEventHandler> = {
  reveal: async (event, ctx) => {
    const matrix = boardToMatrix((event as BookRevealEvent).board);
    if (matrix) ctx.result.matrix = matrix;
  },
  winInfo: async (event, ctx) => {
    const info = event as BookWinInfoEvent;
    ctx.result.winLines = decodeWinLines(info.wins, ctx.betAmount);
    if (info.totalWin != null) {
      ctx.result.winAmount = bookAmountToDisplay(info.totalWin, ctx.betAmount);
    }
  },
  expandingWild: async (event, ctx) => {
    ctx.result.expandingWild = decodeExpandingWild(
      event as BookExpandingWildEvent,
    );
  },
  setWilds: async (event, ctx) => {
    ctx.result.expandingWild = decodeExpandingWild(
      event as BookExpandingWildEvent,
    );
  },
  setTotalWin: async (event, ctx) => {
    const amount = Number((event as BookAmountEvent).amount ?? 0) || 0;
    ctx.result.winAmount = bookAmountToDisplay(amount, ctx.betAmount);
  },
  setWin: async (event, ctx) => {
    const amount = Number((event as BookAmountEvent).amount ?? 0) || 0;
    ctx.result.winAmount = bookAmountToDisplay(amount, ctx.betAmount);
  },
  finalWin: async (event, ctx) => {
    const amount = Number((event as BookAmountEvent).amount ?? 0) || 0;
    if (amount > 0)
      ctx.result.winAmount = bookAmountToDisplay(amount, ctx.betAmount);
  },
  // Feature events — no-op until math defines the exact payload.
  freeSpinTrigger: async () => {},
  updateFreeSpin: async () => {},
};

/**
 * Walks a math book in order and folds it into the visual spin result the
 * existing Pixi reels already know how to play (matrix / winLines / wilds).
 *
 * Handlers are async so they can later await Spine animations per event.
 * Until math lands, they only accumulate state — skip/turbo is a no-op delay-wise.
 */
export async function playBook(
  book: Book,
  ctx: BookPlayerContext,
  fromIndex = 0,
): Promise<SpinVisualResult> {
  const events = book.events ?? [];
  for (const event of events) {
    const index = event.index ?? 0;
    if (index < fromIndex) continue;
    const handler = handlers[event.type];
    if (handler) await handler(event, ctx);
  }
  if (book.payoutMultiplier != null && Number.isFinite(book.payoutMultiplier)) {
    ctx.result.spinOdd = book.payoutMultiplier;
  } else if (ctx.betAmount > 0 && ctx.result.winAmount > 0) {
    ctx.result.spinOdd = ctx.result.winAmount / ctx.betAmount;
  }
  // Only fall back to derived wilds if math did not emit them explicitly.
  const gotExplicitWilds = ctx.result.expandingWild.some((v) => v !== 0);
  if (!gotExplicitWilds && ctx.result.winLines.length > 0) {
    ctx.result.expandingWild = deriveExpandingWild(
      ctx.result.matrix,
      ctx.result.winLines,
    );
  }
  return ctx.result;
}

export async function playBookToSpinResult(
  book: Book,
  betAmount: number,
  options?: { fromIndex?: number; skip?: boolean; fallbackMatrix?: number[][] },
): Promise<SpinVisualResult> {
  const ctx: BookPlayerContext = {
    betAmount,
    skip: options?.skip ?? false,
    result: emptySpinResult(options?.fallbackMatrix ?? createDefaultMatrix()),
  };
  return playBook(book, ctx, options?.fromIndex ?? 0);
}
