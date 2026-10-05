import type { WinLine } from "@/api/gameTypes";
import { bookAmountToDisplay } from "@/utils/currency";
import {
  EMPTY_EXPANDING_WILD,
  REEL_COUNT,
  ROW_COUNT,
  symbolNameToId,
} from "./symbolMap";

/** A single cell on a Stake book board. */
export type BookSymbol = {
  name: string;
  [key: string]: unknown;
};

export type BookRevealEvent = {
  index?: number;
  type: "reveal";
  board: BookSymbol[][] | unknown;
  paddingPositions?: number[];
  gameType?: string;
  anticipation?: number[];
};

export type BookWinEntry = {
  symbol?: unknown;
  kind?: number;
  positions?: { reel: number; row: number }[];
  count?: number;
  win?: number;
  winAmount?: number;
  line?: number;
  lineIndex?: number;
  meta?: { lineIndex?: number; line?: number };
};

export type BookWinInfoEvent = {
  index?: number;
  type: "winInfo";
  totalWin?: number;
  wins?: BookWinEntry[];
};

export type BookExpandingWildEvent = {
  index?: number;
  type: "expandingWild" | "setWilds";
  expandingWild?: number[];
  reels?: number[];
  positions?: number[];
};

export type BookAmountEvent = {
  index?: number;
  type: "setTotalWin" | "finalWin" | "setWin";
  amount?: number;
};

export type BookFreeSpinTriggerEvent = {
  index?: number;
  type: "freeSpinTrigger";
  totalFs?: number;
  total?: number;
};

export type BookUpdateFreeSpinEvent = {
  index?: number;
  type: "updateFreeSpin";
  amount?: number;
  total?: number;
};

export type BookUnknownEvent = {
  index?: number;
  type: string;
  [key: string]: unknown;
};

export type BookEvent =
  | BookRevealEvent
  | BookWinInfoEvent
  | BookExpandingWildEvent
  | BookAmountEvent
  | BookFreeSpinTriggerEvent
  | BookUpdateFreeSpinEvent
  | BookUnknownEvent;

export type Book = {
  id?: number | string;
  payoutMultiplier?: number;
  events: BookEvent[];
  criteria?: string;
  baseGameWins?: number;
  freeGameWins?: number;
};

export type SpinVisualResult = {
  collector?: CollectorAction;
  matrix: number[][];
  winLines: WinLine[];
  expandingWild: number[];
  /** Display-currency win (already converted from book/API units). */
  winAmount: number;
  spinOdd: number | null;
};

export type CollectorCell = { reel: number; row: number; multiplier: number };
export type CollectorAction = {
  wild: CollectorCell;
  from: CollectorCell;
  stone: { reel: number; row: number; value: number } | null;
  respin: number;
  totalRespins: number;
  initialMatrix: number[][];
  underlyingMatrix: number[][];
};

export function emptySpinResult(matrix: number[][]): SpinVisualResult {
  return {
    matrix,
    winLines: [],
    expandingWild: [...EMPTY_EXPANDING_WILD],
    winAmount: 0,
    spinOdd: null,
  };
}

export function isBookEvent(value: unknown): value is BookEvent {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof (value as BookEvent).type === "string",
  );
}

export function isBook(value: unknown): value is Book {
  if (!value || typeof value !== "object") return false;
  return Array.isArray((value as Book).events);
}

export function boardToMatrix(board: unknown): number[][] | null {
  if (!Array.isArray(board) || board.length === 0) return null;
  const reels = board.slice(0, REEL_COUNT);
  return reels.map((reel) => {
    const cells = Array.isArray(reel) ? reel : [];
    // Math SDK includes padding rows (top + bottom) when include_padding=True,
    // so a "3-row" reel arrives as 5 cells: [topPad, r0, r1, r2, botPad].
    // Trim leading padding when present; extra bottom cells are simply ignored.
    const rowOffset = cells.length > ROW_COUNT ? 1 : 0;
    return Array.from({ length: ROW_COUNT }, (_, row) => {
      const cell = cells[row + rowOffset];
      if (cell && typeof cell === "object" && "name" in cell) {
        return symbolNameToId((cell as BookSymbol).name);
      }
      return symbolNameToId(cell);
    });
  });
}

export function decodeWinLines(
  wins: BookWinEntry[] | undefined,
  betAmount: number,
): WinLine[] {
  if (!Array.isArray(wins)) return [];
  return wins.map((win) => {
    const count =
      Number(win.count ?? win.kind ?? win.positions?.length ?? 0) || 0;
    const rawAmount = Number(win.winAmount ?? win.win ?? 0) || 0;
    const line =
      Number(
        win.line ?? win.lineIndex ?? win.meta?.line ?? win.meta?.lineIndex ?? 0,
      ) || 0;
    return {
      symbol: symbolNameToId(win.symbol),
      line,
      count,
      winAmount: bookAmountToDisplay(rawAmount, betAmount),
    };
  });
}

export function decodeExpandingWild(event: BookExpandingWildEvent): number[] {
  const fromArray = event.expandingWild ?? event.positions;
  if (Array.isArray(fromArray) && fromArray.length === REEL_COUNT) {
    return fromArray.map((value) => Number(value) || 0);
  }
  const flags = [...EMPTY_EXPANDING_WILD];
  if (Array.isArray(event.reels)) {
    for (const reel of event.reels) {
      if (reel >= 0 && reel < REEL_COUNT) flags[reel] = 1;
    }
  }
  return flags;
}
