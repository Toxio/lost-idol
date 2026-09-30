import {
  SetupPoseBoundsProvider,
  Spine,
} from "@esotericsoftware/spine-pixi-v8";
import { Assets, Text, TextStyle, type Ticker } from "pixi.js";
import { GAME_FONT_FAMILY } from "@/config/typography";
import { formatFixedMoney } from "@/utils/currency";

import bigWinAtlasUrl from "@/assets/big-win/big_win.atlas.txt?url";
import bigWinJsonUrl from "@/assets/big-win/big_win.json?url";
import bigWinPngUrl from "@/assets/big-win/big_win.webp?url";
import bigWinPng2Url from "@/assets/big-win/big_win_2.webp?url";
import bigWinShineAtlasUrl from "@/assets/big-win/big_win_shine.atlas.txt?url";
import bigWinShineJsonUrl from "@/assets/big-win/big_win_shine.json?url";
import bigWinShinePngUrl from "@/assets/big-win/big_win_shine.webp?url";

export const BIG_WIN_SKEL_ALIAS = "bigWinSpineJson";
export const BIG_WIN_ATLAS_ALIAS = "bigWinSpineAtlas";
export const BIG_WIN_SHINE_SKEL_ALIAS = "bigWinShineSpineJson";
export const BIG_WIN_SHINE_ATLAS_ALIAS = "bigWinShineSpineAtlas";

let registered = false;

export function registerBigWinSpineAssets(): void {
  if (registered) return;
  Assets.add({ alias: BIG_WIN_SKEL_ALIAS, src: bigWinJsonUrl });
  Assets.add({
    alias: BIG_WIN_ATLAS_ALIAS,
    src: bigWinAtlasUrl,
    parser: "spineTextureAtlasLoader",
    data: {
      images: {
        "big_win.webp": bigWinPngUrl,
        "big_win_2.webp": bigWinPng2Url,
      },
    },
  });
  Assets.add({ alias: BIG_WIN_SHINE_SKEL_ALIAS, src: bigWinShineJsonUrl });
  Assets.add({
    alias: BIG_WIN_SHINE_ATLAS_ALIAS,
    src: bigWinShineAtlasUrl,
    parser: "spineTextureAtlasLoader",
    data: {
      images: {
        "big_win_shine.webp": bigWinShinePngUrl,
      },
    },
  });
  registered = true;
}

let loadPromise: Promise<void> | null = null;

export function ensureBigWinSpineLoaded(): Promise<void> {
  registerBigWinSpineAssets();
  if (!loadPromise) {
    loadPromise = Assets.load([
      BIG_WIN_SKEL_ALIAS,
      BIG_WIN_ATLAS_ALIAS,
      BIG_WIN_SHINE_SKEL_ALIAS,
      BIG_WIN_SHINE_ATLAS_ALIAS,
    ]).then(() => undefined);
  }
  return loadPromise;
}

/** Spine clips: `big` = BIG WIN, `mega` = MEGA WIN, `super` = SUPER WIN. */
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

export type CreateBigWinSpineOptions = {
  ticker?: Ticker;
  loop?: boolean;
  animation: BigWinAnimationName;
};

export function createBigWinSpine(options: CreateBigWinSpineOptions): Spine {
  const spine = Spine.from({
    skeleton: BIG_WIN_SKEL_ALIAS,
    atlas: BIG_WIN_ATLAS_ALIAS,
    boundsProvider: new SetupPoseBoundsProvider(),
    ticker: options.ticker,
  });
  spine.state.setAnimation(0, options.animation, options.loop ?? false);
  spine.update(0);
  return spine;
}

/** Background shine / particles — single clip `anim`, used for BIG, MEGA, and SUPER. */
export type CreateBigWinShineSpineOptions = {
  ticker?: Ticker;
  loop?: boolean;
};

export function createBigWinShineSpine(
  options?: CreateBigWinShineSpineOptions,
): Spine {
  const spine = Spine.from({
    skeleton: BIG_WIN_SHINE_SKEL_ALIAS,
    atlas: BIG_WIN_SHINE_ATLAS_ALIAS,
    boundsProvider: new SetupPoseBoundsProvider(),
    ticker: options?.ticker,
  });
  spine.state.setAnimation(0, "anim", options?.loop ?? true);
  spine.update(0);
  return spine;
}

/** Scale multiplier applied after fitting to viewport. */
const BIG_WIN_VISUAL_SCALE = 1.6;

/** Extra scale for the animated shine so it wraps banner + win amount label. */
const BIG_WIN_SHINE_VISUAL_SCALE = 2;

/** Padding around banner + win amount label when fitting the shine background. */
const BIG_WIN_SHINE_PAD_X_FRAC = 0.06;
const BIG_WIN_SHINE_PAD_Y_FRAC = 0.045;

/** Base vertical anchor (fraction of screen height) before top padding. */
const BIG_WIN_ANCHOR_Y_FRAC = 0.38;
/** Push celebration down — extra space from the top, as a fraction of screen height. */
const BIG_WIN_TOP_PADDING_FRAC = 0.1;

/** Tick-up duration bounds for the win amount counter. */
const BIG_WIN_AMOUNT_TICK_MIN_MS = 1400;
const BIG_WIN_AMOUNT_TICK_MAX_MS = 3200;
const BIG_WIN_AMOUNT_TICK_PER_UNIT_MS = 2.5;

function bigWinCenterY(screenH: number): number {
  return screenH * (BIG_WIN_ANCHOR_Y_FRAC + BIG_WIN_TOP_PADDING_FRAC);
}

function spineScreenBounds(spine: Spine): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  spine.update(0);
  const lb = spine.getLocalBounds();
  const s = spine.scale.x;
  const left = spine.x + lb.x * s;
  const top = spine.y + lb.y * s;
  const right = left + lb.width * s;
  const bottom = top + lb.height * s;
  return { top, bottom, left, right };
}

function textScreenBounds(label: Text): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  const left = label.x - label.width * label.scale.x * label.anchor.x;
  const top = label.y - label.height * label.scale.y * label.anchor.y;
  const right = left + label.width * label.scale.x;
  const bottom = top + label.height * label.scale.y;
  return { top, bottom, left, right };
}

function mergeBounds(
  a: { top: number; bottom: number; left: number; right: number },
  b: { top: number; bottom: number; left: number; right: number },
): { top: number; bottom: number; left: number; right: number } {
  return {
    top: Math.min(a.top, b.top),
    bottom: Math.max(a.bottom, b.bottom),
    left: Math.min(a.left, b.left),
    right: Math.max(a.right, b.right),
  };
}

/** Fit the celebration banner roughly in the upper–middle viewport. */
export function layoutBigWinSpine(
  spine: Spine,
  screenW: number,
  screenH: number,
): void {
  if (
    !Number.isFinite(screenW) ||
    !Number.isFinite(screenH) ||
    screenW <= 0 ||
    screenH <= 0
  ) {
    return;
  }
  spine.update(0);
  const lb = spine.getLocalBounds();
  const bw = lb.width > 0 ? lb.width : 1;
  const bh = lb.height > 0 ? lb.height : 1;
  const targetW = screenW * 0.68;
  const targetH = screenH * 0.28;
  const s = Math.min(targetW / bw, targetH / bh) * BIG_WIN_VISUAL_SCALE;
  spine.scale.set(s);
  const cy = bigWinCenterY(screenH);
  spine.position.set(
    screenW / 2 - (lb.x + bw / 2) * s,
    cy - (lb.y + bh / 2) * s,
  );
}

/** Wider / taller fit so the glow sits behind the banner and win amount label. */
export function layoutBigWinShineSpine(
  spine: Spine,
  screenW: number,
  screenH: number,
  content?: { banner: Spine; amountLabel?: Text | null },
): void {
  if (
    !Number.isFinite(screenW) ||
    !Number.isFinite(screenH) ||
    screenW <= 0 ||
    screenH <= 0
  ) {
    return;
  }
  spine.update(0);
  const lb = spine.getLocalBounds();
  const bw = lb.width > 0 ? lb.width : 1;
  const bh = lb.height > 0 ? lb.height : 1;

  let targetW = screenW * 0.9;
  let targetH = screenH * 0.48;
  let cy = bigWinCenterY(screenH);

  if (content?.banner) {
    let bounds = spineScreenBounds(content.banner);
    if (content.amountLabel) {
      bounds = mergeBounds(bounds, textScreenBounds(content.amountLabel));
    }
    const padX = screenW * BIG_WIN_SHINE_PAD_X_FRAC;
    const padY = screenH * BIG_WIN_SHINE_PAD_Y_FRAC;
    targetW = bounds.right - bounds.left + padX * 2;
    targetH = bounds.bottom - bounds.top + padY * 2;
    cy = (bounds.top + bounds.bottom) / 2;
  }

  const s = Math.min(targetW / bw, targetH / bh) * BIG_WIN_SHINE_VISUAL_SCALE;
  spine.scale.set(s);
  spine.position.set(
    screenW / 2 - (lb.x + bw / 2) * s,
    cy - (lb.y + bh / 2) * s,
  );
}

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

/** Place the win amount label centered under the celebration banner. */
export function layoutBigWinAmountLabel(
  label: Text,
  bannerSpine: Spine,
  screenW: number,
  screenH: number,
  options?: {
    measureAmount?: number;
    precision?: number;
    currency?: string;
  },
): void {
  if (
    !Number.isFinite(screenW) ||
    !Number.isFinite(screenH) ||
    screenW <= 0 ||
    screenH <= 0
  ) {
    return;
  }
  const precision = options?.precision ?? 2;
  const currency = options?.currency ?? "";
  label.style.fontSize = Math.max(30, Math.min(76, screenW * 0.072));
  label.anchor.set(0.5, 0);
  const bounds = bannerSpine.getBounds();
  label.position.set(screenW / 2, bounds.y + bounds.height);
  label.text = formatBigWinAmount(
    options?.measureAmount ?? 0,
    precision,
    currency,
  );
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
  label: Text,
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
