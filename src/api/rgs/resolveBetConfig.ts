import { apiAmountToDisplay } from "@/utils/currency";
import type { AuthenticateConfig } from "./types";


export type ResolvedBetConfig = {
  /** Display-unit ladder the player may select (sorted, unique). */
  betLevels: number[];
  defaultBet: number;
  minBet: number;
  maxBet: number;
};

function toApiInt(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return Math.round(value);
}

function alignsWithStep(amount: number, step: number): boolean {
  if (!step) return true;
  return amount % step === 0;
}

function inRange(amount: number, min: number, max: number): boolean {
  if (min && amount < min) return false;
  if (max && amount > max) return false;
  return true;
}

/** Smallest amount ≥ minBet that is on `step` and ≤ maxBet. */
function firstValid(min: number, max: number, step: number): number {
  if (!min) return 0;
  if (!step) return max && min > max ? 0 : min;
  const start = Math.ceil(min / step) * step;
  if (max && start > max) return 0;
  return start;
}

/** Largest amount ≤ maxBet that is on `step` and ≥ minBet. */
function lastValid(min: number, max: number, step: number): number {
  if (!max) return firstValid(min, max, step);
  if (!step) return min && max < min ? 0 : max;
  const end = Math.floor(max / step) * step;
  if (min && end < min) return 0;
  return end;
}

function uniqueSorted(values: number[]): number[] {
  return [...new Set(values.filter((n) => n > 0))].sort((a, b) => a - b);
}

function nearest(levels: number[], amount: number): number {
  if (!levels.length) return amount;
  let best = levels[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const level of levels) {
    const dist = Math.abs(level - amount);
    if (dist < bestDist) {
      bestDist = dist;
      best = level;
    }
  }
  return best;
}

function generateStepped(min: number, max: number, step: number): number[] {
  if (!min) return max ? [max] : [];
  if (!max || max < min) return [min];
  if (!step) return uniqueSorted([min, max]);
  const count = Math.floor((max - min) / step) + 1;
  if (count < 1) return [min];
  if (count > 100000) throw new Error("RGS must provide betLevels for large bet ranges");
  const levels: number[] = [];
  for (let n = min; n <= max; n += step) levels.push(n);
  return levels;
}

/**
 * Build a play-safe bet ladder from RGS `authenticate` config.
 * Levels stay in [minBet, maxBet], on `stepBet`, using the RGS list exactly when supplied.
 * Default is clamped and snapped so JPY-style sessions cannot start below minBet.
 */
export function resolveBetConfig(
  config: AuthenticateConfig,
): ResolvedBetConfig {
  const minBet = toApiInt(config.minBet);
  const maxBet = toApiInt(config.maxBet);
  const stepBet = toApiInt(config.stepBet);
  const lo = firstValid(minBet, maxBet, stepBet);
  const hi = lastValid(minBet, maxBet, stepBet);

  let levels = (config.betLevels ?? [])
    .map(toApiInt)
    .filter(
      (n) =>
        n > 0 &&
        inRange(n, lo || minBet, hi || maxBet) &&
        alignsWithStep(n, stepBet),
    );

  const fromRgs = uniqueSorted(levels);
  if (!fromRgs.length) {
    levels = generateStepped(lo || minBet, hi || maxBet, stepBet);
  }
  if (!fromRgs.length) {
    if (lo) levels.push(lo);
    if (hi) levels.push(hi);
  }

  const fallback = uniqueSorted(levels)[0] ?? lo ?? minBet;
  let defaultBet = toApiInt(config.defaultBetLevel) || fallback;
  if (stepBet) defaultBet = Math.round(defaultBet / stepBet) * stepBet;
  if (lo && defaultBet < lo) defaultBet = lo;
  if (hi && defaultBet > hi) defaultBet = hi;
  if (!fromRgs.length && defaultBet > 0) levels.push(defaultBet);

  levels = uniqueSorted(levels);
  if (levels.length) defaultBet = nearest(levels, defaultBet);

  const displayLevels = levels.map(apiAmountToDisplay);
  return {
    betLevels: displayLevels,
    defaultBet: apiAmountToDisplay(defaultBet || fallback),
    minBet: displayLevels[0] ?? 0,
    maxBet: displayLevels[displayLevels.length - 1] ?? 0,
  };
}

/** Index of `amount` in a display-unit ladder (exact, then nearest). */
export function indexOfBetLevel(levels: number[], amount: number): number {
  if (!levels.length) return 0;
  const exact = levels.indexOf(amount);
  if (exact >= 0) return exact;
  return levels.indexOf(nearest(levels, amount));
}

export function snapToBetLevel(levels: number[], amount: number): number {
  if (!levels.length) return amount;
  return nearest(levels, amount);
}
