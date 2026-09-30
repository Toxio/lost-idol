/** Fixed Pixi design resolution. */
export const DESIGN_WIDTH = 1641;
export const DESIGN_HEIGHT = 1022;

/** Inner opening of the Lost Idol frame after nine-slice layout. */
export const REEL_GRID = { x: 150 / DESIGN_WIDTH, y: 110 / DESIGN_HEIGHT, w: (DESIGN_WIDTH - 300) / DESIGN_WIDTH, h: (DESIGN_HEIGHT - 210) / DESIGN_HEIGHT } as const;

/** Shorter mask vs grid height so spinning symbols/blur don’t paint over the bottom frame. */
export const REEL_MASK_BOTTOM_PAD_FRAC = 0.012;

export const REEL_COUNT = 5;
export const VISIBLE_ROWS = 3;
/** Virtual loop length (must be > VISIBLE_ROWS + 1). */
export const REEL_SIZE = 10;

/** 1 = normal (~2.6s), 2 = fast (~1.25s), 3 = turbo (very short). */
export type SpinSpeedLevel = 1 | 2 | 3;

export interface SpinSpeedPreset {
  minSpin: number;
  stopBase: number;
  stopStep: number;
  reelVelocity: number;
  /** Post-stop column bounce — disabled on turbo (level 3). */
  settleBounce: boolean;
}

export const SPIN_SPEED_PRESETS: Record<SpinSpeedLevel, SpinSpeedPreset> = {
  1: { minSpin: 700, stopBase: 600, stopStep: 360, reelVelocity: 22, settleBounce: true },
  2: { minSpin: 320, stopBase: 295, stopStep: 170, reelVelocity: 34, settleBounce: true },
  3: { minSpin: 100, stopBase: 90, stopStep: 65, reelVelocity: 52, settleBounce: false },
};

export function getSpinSpeedPreset(level: SpinSpeedLevel): SpinSpeedPreset {
  return SPIN_SPEED_PRESETS[level];
}

/** Approximate reel stop duration (min spin + staggered column stops). */
export function spinDurationMs(level: SpinSpeedLevel): number {
  const p = getSpinSpeedPreset(level);
  return p.minSpin + p.stopBase + (REEL_COUNT - 1) * p.stopStep;
}

/**
 * Blank pause (ms) between consecutive win lines.
 * Show duration comes from the Spine animation so the timer advances on loop boundaries.
 */
export const LINE_DELAY_MS = 300;

/** Scatter wins have no payline overlay — cycle timing uses this instead of line Spine duration. */
export const SCATTER_WIN_SHOW_MS = 1500;

/** Post-stop bounce on the whole reel column — half a symbol cell down, then back. */
export const REEL_SETTLE_BOUNCE = {
  durationMs: 200,
  /** Downward travel as fraction of one cell height (0.5 = half turn). */
  dropFrac: 0.15,
} as const;

/**
 * reel_stop fires at (column stop duration − lead). Independent of stopStep, so sounds
 * can be earlier without shrinking the gap between consecutive column sounds.
 */
export const REEL_STOP_SOUND_LEAD_MS = 90;

/** Early tap-stop: column stagger and sound lead (shorter tweens). */
export const REEL_FAST_STOP = {
  baseMs: 90,
  stepMs: 40,
  soundLeadMs: 28,
} as const;
