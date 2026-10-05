import type { BlurFilter, Container, Sprite } from "pixi.js";

import type { PaylineAnimation } from "@/animation/lineAnimation";
import type { WinLine } from "@/api/gameTypes";
import type { SpinSpeedLevel } from "./constants";

export interface WinCell {
  col: number;
  row: number;
  /** Paytable / combo symbol — drives win Spine animation. */
  animIdx: number;
  /** Settled matrix symbol at this cell — drives static sprite after animation. */
  matrixIdx: number;
}

/** One win highlight cycle — payline overlay optional (scatter has none). */
export interface WinHighlight {
  cells: WinCell[];
  paylineAnim: PaylineAnimation | null;
  showMs: number;
  /** Display-unit payout for this winning action. */
  winAmount: number;
}

export interface SlotSymbol {
  container: Container;
  sprite: Sprite;
  /** Alias currently assigned — used when restoring reel sprites on spin start. */
  alias: string;
}

export interface Reel {
  rc: Container;
  /** Symbol strip — bounced inside the fixed per-column mask. */
  stripCont: Container;
  symbols: SlotSymbol[];
  position: number;
  prevPos: number;
  blur: BlurFilter;
  stopping: boolean;
  /** Post-stop Y bounce on the symbol strip (clipped by the column mask). */
  settleBounce?: ReelSettleBounce;
}

export interface ReelSettleBounce {
  elapsedMs: number;
  duration: number;
  dropPx: number;
  onComplete?: () => void;
}

export interface ReelTween {
  reel: Reel;
  from: number;
  to: number;
  /** Accumulated ticker time since tween began (ms). Uses ticker deltaMS, not Date.now,
   * so mid-tween main-thread hitches (SignalR parsing on mobile) don't cause position jumps. */
  elapsedMs: number;
  duration: number;
  /** Absolute elapsed ms when reel_stop should fire for this column. */
  soundAtMs: number;
  ease: (t: number) => number;
  onDone?: () => void;
  soundFired?: boolean;
  /** Sharp overlay spines attached near reel stop — idempotent with onDone fallback. */
  overlayAttached?: boolean;
}

export interface SlotReelsProps {
  collectorOverlayVisible?: boolean;
  spinSpeed: SpinSpeedLevel;
  spinning: boolean;
  targetMatrix: number[][] | null;
  /** Settled matrix (5 reels × 3 rows) used to locate winning cells. */
  matrix: number[][];
  winLines: WinLine[];
  /** Per-column expanding-wild flags (length 5). Non-zero = wild animates in that column. */
  expandingWild: number[];
  /** Total spin multiplier (`Odd`); triggers BIG / MEGA / SUPER overlay at 20× / 50× / 100×. */
  spinOdd: number | null;
  /** Total win amount for the spin — shown under the big-win banner with tick-up. */
  winAmount: number | null;
  currency: string;
  precision: number;
  onSpinComplete: () => void;
  onWinCycleDone?: () => void;
  /** First-pass win meter: cumulative payout as each winning action is shown. */
  onPresentedWinChange?: (amount: number) => void;
  onAssetsLoaded?: () => void;
  /** Increment to request an early reel stop (spin button or screen tap). */
  stopSignal?: number;
  /**
   * The game advances on its own (autoplay running, or a bonus round with frames left), so
   * nobody will tap to dismiss the big-win banner — it self-dismisses after a hold instead.
   * In ordinary manual play this stays false and the banner waits for a click.
   */
  autoAdvance?: boolean;
}
