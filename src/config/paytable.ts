/**
 * Mirrors math-sdk `games/lost_idol/game_config.py`.
 *
 * RGS authenticate does not send a paytable. Line wins come from
 * `GameConfig.paytable`; scatter wins from `GameConfig.scatter_paytable`.
 * Both are added into `win_data.totalWin`, which becomes the book
 * `payoutMultiplier`. Display amount = that multiplier × current bet.
 *
 * Wild (id 9) does not pay on its own. Accessories (ids 5–8) share one row.
 */
export type PaytableMultipliers = Readonly<Record<number, number>>;

export const SEVEN_ID = 1;
export const LIPS_ID = 2;
export const PARFUME_ID = 3;
export const ROSE_ID = 4;
export const GLASS_ID = 5;
export const LIPSTICK_ID = 6;
export const GOBLET_ID = 7;
export const HEELS_ID = 8;
export const WILD_ID = 9;
export const DOLLAR_SCATTER_ID = 10;
export const STAR_SCATTER_ID = 11;

export const ACCESSORY_IDS = [
  GLASS_ID,
  LIPSTICK_ID,
  GOBLET_ID,
  HEELS_ID,
] as const;

/** `game_config.py` `paytable` — seven / lips / parfume / rose / accessories. */
const LINE_PAYTABLE: Readonly<Record<number, PaytableMultipliers>> = {
  [SEVEN_ID]: { 5: 500, 4: 25, 3: 5, 2: 1 },
  [LIPS_ID]: { 5: 70, 4: 12, 3: 4 },
  [PARFUME_ID]: { 5: 70, 4: 12, 3: 4 },
  [ROSE_ID]: { 5: 20, 4: 4, 3: 2 },
  [GLASS_ID]: { 5: 15, 4: 3, 3: 1 },
  [LIPSTICK_ID]: { 5: 15, 4: 3, 3: 1 },
  [GOBLET_ID]: { 5: 15, 4: 3, 3: 1 },
  [HEELS_ID]: { 5: 15, 4: 3, 3: 1 },
};

export const SCATTER_FREE_SPINS: Readonly<Record<number, number>> = { 3: 5, 4: 10, 5: 15 };

/** Only stars have a scatter cash payout. Boxes award free spins. */
const SCATTER_PAYTABLE: Readonly<Record<number, PaytableMultipliers>> = {
  [STAR_SCATTER_ID]: { 3: 20 },
};

export const PAYTABLE: Readonly<Record<number, PaytableMultipliers>> = {
  ...LINE_PAYTABLE,
  ...SCATTER_PAYTABLE,
};

export function paytableAmount(multiplier: number, betAmount: number): number {
  return multiplier * betAmount;
}

export function payoutsForSymbol(
  symbolId: number,
  betAmount: number,
): Array<{ count: number; value: number }> {
  const row = PAYTABLE[symbolId];
  if (!row) return [];
  return Object.entries(row)
    .map(([count, multiplier]) => ({
      count: Number(count),
      value: paytableAmount(multiplier, betAmount),
    }))
    .sort((a, b) => b.count - a.count);
}
