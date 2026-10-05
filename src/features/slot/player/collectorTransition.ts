import { getPaylineForLineId } from '@/config/paylines';
import type { WinLine } from '@/api/gameTypes';
import type { CollectorAction } from './bookEvents';

export const COLLECTOR_TRANSITION = { clearTarget: 320, revealOrigin: 550, duration: 1350 } as const;
export const COLLECTOR_EMPTY_CELL = -1;
export function collectorJumps(action: CollectorAction) {
  return action.from.reel !== action.wild.reel || action.from.row !== action.wild.row;
}
/** Presentation-only cells; never modifies the math book or final win matrix. */
export function collectorTransitionMatrix(action: CollectorAction, elapsed = 0) {
  const matrix = action.underlyingMatrix.map(reel => [...reel]);
  if (!collectorJumps(action) || elapsed < COLLECTOR_TRANSITION.revealOrigin)
    matrix[action.from.reel][action.from.row] = COLLECTOR_EMPTY_CELL;
  if (collectorJumps(action) && elapsed >= COLLECTOR_TRANSITION.clearTarget)
    matrix[action.wild.reel][action.wild.row] = COLLECTOR_EMPTY_CELL;
  return matrix;
}

/** Only server-awarded lines that are already visible at the origin play before departure. */
export function collectorWinsBeforeJump(action: CollectorAction, wins: WinLine[]) {
  if (!collectorJumps(action)) return [];
  return wins.filter(win => {
    const rows = getPaylineForLineId(win.line);
    if (!rows || action.from.reel >= win.count || rows[action.from.reel] !== action.from.row) return false;
    // A line can cross both positions and already be complete before the jump.
    // Validate the initial board instead of excluding every destination-crossing line.
    return rows.slice(0, win.count).every((row, reel) => {
      const symbol = action.initialMatrix[reel]?.[row];
      return symbol === win.symbol || symbol === 9;
    });
  });
}
