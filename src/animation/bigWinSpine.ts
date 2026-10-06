import { Text, TextStyle, type Ticker } from "pixi.js";
import { GAME_FONT_FAMILY } from "@/config/typography";
import { formatFixedMoney } from "@/utils/currency";

export type BigWinAnimationName = "big" | "mega" | "super";

/**
 * Total spin multiplier from the server (`Odd`). Thresholds: 20× / 50× / 100×.
 */
export function bigWinAnimationForOdd(odd: number): BigWinAnimationName | null {
  if (!Number.isFinite(odd) || odd < 20) return null;
  if (odd >= 100) return "super";
  if (odd >= 50) return "mega";
  return "big";
}

const BIG_WIN_AMOUNT_TICK_MIN_MS = 1400;
const BIG_WIN_AMOUNT_TICK_MAX_MS = 3200;
const BIG_WIN_AMOUNT_TICK_PER_UNIT_MS = 2.5;

export function formatBigWinAmount(
  amount: number,
  precision = 2,
  currency = "",
): string {
  if (!Number.isFinite(amount)) return "";
  return formatFixedMoney(Math.max(0, amount), currency || "USD", precision);
}

function bigWinAmountLabelStyle(): TextStyle {
  return new TextStyle({
    fontFamily: GAME_FONT_FAMILY,
    fontSize: 56,
    fontWeight: "700",
    fill: "#ffd54f",
    stroke: { color: "#5a3a00", width: 6, join: "round" },
    dropShadow: {
      alpha: 0.55,
      angle: Math.PI / 2,
      blur: 3,
      color: "#000000",
      distance: 4,
    },
  });
}

export function createBigWinAmountLabel(): Text {
  return new Text({
    text: formatBigWinAmount(0),
    style: bigWinAmountLabelStyle(),
  });
}

export type BigWinAmountTickUp = {
  stop: () => void;
};

/** Same bounded duration the tick-up itself uses — exposed so callers can size a hold period after it. */
export function bigWinAmountTickUpDurationMs(targetAmount: number): number {
  const safeTarget = Number.isFinite(targetAmount)
    ? Math.max(0, targetAmount)
    : 0;
  return Math.min(
    BIG_WIN_AMOUNT_TICK_MAX_MS,
    Math.max(
      BIG_WIN_AMOUNT_TICK_MIN_MS,
      safeTarget * BIG_WIN_AMOUNT_TICK_PER_UNIT_MS,
    ),
  );
}

export function startBigWinAmountTickUp(
  label: { text: string },
  targetAmount: number,
  ticker: Ticker,
  options?: {
    durationMs?: number;
    precision?: number;
    currency?: string;
  },
): BigWinAmountTickUp {
  const precision = options?.precision ?? 2;
  const currency = options?.currency ?? "";
  const safeTarget = Number.isFinite(targetAmount)
    ? Math.max(0, targetAmount)
    : 0;
  const durationMs = options?.durationMs ?? bigWinAmountTickUpDurationMs(safeTarget);

  let elapsed = 0;
  label.text = formatBigWinAmount(0, precision, currency);

  const onTick = () => {
    elapsed += ticker.deltaMS;
    const t = Math.min(1, elapsed / durationMs);
    const eased = 1 - (1 - t) ** 3;
    // Quantize animation frames, but keep the exact final payout (including sub-cent wins).
    const scale = 10 ** precision;
    const displayed = t >= 1 ? safeTarget : Math.floor(safeTarget * eased * scale) / scale;
    label.text = formatBigWinAmount(displayed, precision, currency);
    if (t >= 1) {
      ticker.remove(onTick);
    }
  };

  ticker.add(onTick);

  return {
    stop: () => ticker.remove(onTick),
  };
}
