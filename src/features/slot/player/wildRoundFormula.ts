import type { WinLine } from '@/api/gameTypes';
import { getPaylineForLineId } from '@/config/paylines';
import type { CollectorAction } from './bookEvents';

export function wildRoundFormula(action: CollectorAction, wins: WinLine[]) {
  const { reel, row, multiplier } = action.wild;
  let multiplied = 0;
  let other = 0;
  for (const win of wins) {
    const line = getPaylineForLineId(win.line);
    if (line?.[reel] === row && reel < win.count) multiplied += win.winAmount;
    else other += win.winAmount;
  }
  return { multiplier, base: multiplied / multiplier, other, total: multiplied + other };
}
