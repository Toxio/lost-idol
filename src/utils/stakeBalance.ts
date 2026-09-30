/**
 * Money available for the next stake before the Spin request flies: wallet + last spin `Win`
 * shown in UI when backend still sends `balance` without that win credited (common interim state).
 */
export function spendableBalanceForStake(balance: number, pendingWinAmount: number | null): number {
  const safeBalance = Number.isFinite(balance) ? balance : 0;
  const isValidPendingWin =
    pendingWinAmount !== null && Number.isFinite(pendingWinAmount) && pendingWinAmount > 0;
  const pendingWin = isValidPendingWin ? pendingWinAmount : 0;
  return safeBalance + pendingWin;
}

/**
 * True if stake is valid (>0) and does not exceed the effective budget (`balance`, or balance from {@link spendableBalanceForStake}).
 */
export function canAffordStake(bet: number, stakeBudget: number): boolean {
  const stakeCents = Math.round(bet * 100);
  const balanceCents = Math.round(stakeBudget * 100);
  if (!Number.isFinite(stakeCents) || !Number.isFinite(balanceCents)) return false;
  if (stakeCents <= 0) return false;
  return stakeCents <= balanceCents;
}
