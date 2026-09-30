import type {
  Book,
  BookEvent,
  BookRevealEvent,
  SpinVisualResult,
} from "./bookEvents";
import { playBookToSpinResult } from "./BookPlayer";
import { symbolNameToId } from "./symbolMap";

const WILD_SYMBOL_ID = 9;

export interface RoundFrame {
  visual: SpinVisualResult;
  freeSpin: number;
  totalFreeSpins: number;
  awardedFreeSpins: number;
  totalWin: number;
  wildMultipliers: number[];
}

/** One reveal per frame. Cumulative awards never overwrite an individual spin. */
export async function buildRoundFrames(
  book: Book,
  bet: number,
  fallback: number[][],
): Promise<RoundFrame[]> {
  const groups: { events: BookEvent[]; freeSpin: number; total: number }[] = [];
  let freeSpin = 0;
  let total = 0;
  for (const event of book.events) {
    if (event.type === "updateFreeSpin") {
      freeSpin = Number((event as { amount?: number }).amount ?? 0) + 1;
      total = Number((event as { total?: number }).total ?? total);
    }
    if (
      event.type === "freeSpinTrigger" ||
      event.type === "freeSpinRetrigger"
    ) {
      total = Number((event as { totalFs?: number }).totalFs ?? total);
    }
    if (event.type === "reveal") groups.push({ events: [], freeSpin, total });
    groups.at(-1)?.events.push(event);
  }
  let totalWin = 0;
  const frames: RoundFrame[] = [];
  for (const group of groups) {
    const spinEvents = group.events.filter(
      (e) => !["setTotalWin", "finalWin", "freeSpinEnd"].includes(e.type),
    );
    const visual = await playBookToSpinResult({ events: spinEvents }, bet, {
      fallbackMatrix: fallback,
    });
    totalWin += visual.winAmount;
    const cumulative = group.events
      .filter((e) => e.type === "setTotalWin" || e.type === "finalWin")
      .at(-1);
    if (cumulative)
      totalWin =
        (Number((cumulative as { amount?: number }).amount ?? 0) * bet) / 100;
    const trigger = group.events.find((e) => e.type === "freeSpinTrigger");
    const reveal = group.events.find(
      (e) => e.type === "reveal",
    ) as BookRevealEvent;
    const board = reveal.board as { name?: string; wild?: boolean; multiplier?: number }[][];
    // Match math's `_expand_landed_wilds`: expansion multiplier comes from the
    // first wild INSIDE the in-play grid, not padding. Reveal shape is
    // [top_pad, ...rows, bottom_pad]; scanning the whole reel would pick up a
    // padding-row wild whose multiplier isn't the one that actually pays.
    const wildMultipliers = board.map((reel) => {
      const inPlay = reel.slice(1, -1);
      const wild = inPlay.find(
        (cell) => cell?.wild === true || symbolNameToId(cell?.name) === WILD_SYMBOL_ID,
      );
      return Number(wild?.multiplier ?? 0);
    });
    frames.push({
      visual,
      freeSpin: group.freeSpin,
      totalFreeSpins: group.total,
      awardedFreeSpins: Number(
        (trigger as { totalFs?: number } | undefined)?.totalFs ?? 0,
      ),
      totalWin,
      wildMultipliers,
    });
    fallback = visual.matrix;
  }
  return frames;
}
