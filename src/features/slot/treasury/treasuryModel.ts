/** Engine cash rewards are converted to bet multiples at the book boundary. */
export type TreasuryReward = { kind: 'cash' | 'multiplier'; value: number };
export const DEMO_REWARDS: readonly TreasuryReward[] = [
  { kind: 'cash', value: 4 },
  { kind: 'multiplier', value: 2 },
  { kind: 'cash', value: 6 },
];
export function treasuryTotal(rewards: readonly TreasuryReward[]) {
  const cash = rewards.reduce((sum, r) => sum + (r.kind === 'cash' ? r.value : 0), 0);
  const multiplier = rewards.findLast(r => r.kind === 'multiplier')?.value ?? 1;
  return { cash, multiplier, total: cash * multiplier };
}
export function validTreasuryPicks(value: unknown): value is number[] {
  return Array.isArray(value) && value.length <= 3 && new Set(value).size === value.length
    && value.every(i => Number.isInteger(i) && i >= 0 && i < 6);
}

export type TreasuryAward = { rewards: TreasuryReward[]; amount: number; uncappedAmount: number };
export type TreasurySession = TreasuryAward & { id: string; bet: number };
export function decodeTreasury(event: Record<string, unknown>): TreasuryAward {
  const positions = event.positions;
  if (!Array.isArray(positions) || positions.length !== 3 || new Set(positions.map(p => p?.reel)).size !== 3 || positions.some(p => !p || ![1, 2, 3].includes(p.reel) || !Number.isInteger(p.row) || p.row < 0 || p.row > 2)) throw new Error('Invalid treasury positions');
  const rewards = event.rewards;
  if (!Array.isArray(rewards) || rewards.length !== 3) throw new Error('Invalid treasury rewards');
  const setMultiplier = event.multiplierMode === 'set';
  if (event.multiplierMode !== undefined && !setMultiplier) throw new Error('Invalid treasury multiplier mode');
  if (setMultiplier && rewards.filter(r => r?.kind === 'multiplier').length > 1) throw new Error('Multiple treasury multipliers');
  let legacyMultiplier = 1;
  const decoded = rewards.map((r: TreasuryReward) => {
    if (!r || !['cash', 'multiplier'].includes(r.kind) || !Number.isSafeInteger(r.value) || r.value <= 0 || (r.kind === 'multiplier' && (setMultiplier ? ![2, 3, 5, 10].includes(r.value) : r.value !== 1))) throw new Error('Invalid treasury reward');
    return { kind: r.kind, value: r.kind === 'cash' ? r.value / 100 : setMultiplier ? r.value : ++legacyMultiplier };
  });
  const raw = Math.round(treasuryTotal(decoded).total * 100);
  if (!decoded.some(r => r.kind === 'cash') || event.uncappedAmount !== raw || !Number.isSafeInteger(event.amount) || Number(event.amount) <= 0 || Number(event.amount) > raw) throw new Error('Invalid treasury total');
  return { rewards: decoded, amount: Number(event.amount) / 100, uncappedAmount: raw / 100 };
}
