import bonusFixture from "@/api/rgs/bonusFixture.json";
import { boardToMatrix } from "@/features/slot/player/bookEvents";
import type { ForceSpinPreset, WinLine } from "@/hooks/useRgsSession";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function buildMatrix(overrides: (number | null)[][]): number[][] {
  const FILLERS = [7, 6, 11, 3, 4, 5, 2, 7, 3, 11];
  let fi = 0;
  const fill = () => FILLERS[fi++ % FILLERS.length];
  return Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 3 }, (_, row) => overrides[r]?.[row] ?? fill()),
  );
}

function wl(
  symbol: number,
  line: number,
  count: number,
  winAmount: number,
): WinLine {
  return { symbol, line, count, winAmount };
}

/** Payline 1 = middle row — five matches so each symbol’s win-Spine can play. */
function winAnimMidRowFive(symbol: number, winAmount: number): ForceSpinPreset {
  return {
    matrix: buildMatrix([
      [7, symbol, 4],
      [6, symbol, 3],
      [11, symbol, 5],
      [2, symbol, 7],
      [4, symbol, 6],
    ]),
    winLines: [wl(symbol, 1, 5, winAmount)],
    winAmount,
  };
}

// ─── Win-Spine preview (built after `TestPreset`; appended to TEST_PRESETS) ──

export interface TestPreset {
  id: string;
  label: string;
  subtitle: string;
  badge: string;
  iconSymbol?: number;
  badgeColor: string;
  rewardLabel?: string;
  preset: ForceSpinPreset;
}

const WIN_SPINE_ANIM_PRESETS: TestPreset[] = [
  {
    id: "win-anim-seven",
    label: "Win anim · Idol",
    subtitle: "Spine · Line 1 · ×5",
    iconSymbol: 1,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: winAnimMidRowFive(1, 100),
  },
  {
    id: "win-anim-lips",
    label: "Win anim · Treasure",
    subtitle: "Spine · Line 1 · ×5",
    iconSymbol: 2,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: winAnimMidRowFive(2, 95),
  },
  {
    id: "win-anim-parfume",
    label: "Win anim · Serpent Key",
    subtitle: "Spine · Line 1 · ×5",
    iconSymbol: 3,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: winAnimMidRowFive(3, 92),
  },
  {
    id: "win-anim-rose",
    label: "Win anim · Torch",
    subtitle: "Spine · Line 1 · ×5",
    iconSymbol: 4,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: winAnimMidRowFive(4, 88),
  },
  {
    id: "win-anim-glass",
    label: "Win anim · Compass",
    subtitle: "Spine · Line 1 · ×5",
    iconSymbol: 5,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: winAnimMidRowFive(5, 80),
  },
  {
    id: "win-anim-lipstick",
    label: "Win anim · Machete",
    subtitle: "Spine · Line 1 · ×5",
    iconSymbol: 6,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: winAnimMidRowFive(6, 85),
  },
  {
    id: "win-anim-goblet",
    label: "Win anim · Chalice",
    subtitle: "Spine · Line 1 · ×5",
    iconSymbol: 7,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: winAnimMidRowFive(7, 82),
  },
  {
    id: "win-anim-heels",
    label: "Win anim · Map",
    subtitle: "Spine · Line 1 · ×5",
    iconSymbol: 8,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: winAnimMidRowFive(8, 90),
  },
  {
    id: "win-anim-wild",
    label: "Win anim · Monkey Wild",
    subtitle: "Spine · Line 1 · ×5 · expand",
    iconSymbol: 9,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: {
      matrix: buildMatrix([
        [7, 1, 4],
        [9, 2, 3],
        [11, 9, 5],
        [2, 7, 9],
        [4, 5, 6],
      ]),
      winLines: [wl(9, 1, 5, 120)],
      winAmount: 120,
      expandingWild: [0, 9, 9, 9, 0],
    },
  },
  {
    id: "win-anim-scatter",
    label: "Win anim · Bonus",
    subtitle: "Spine · Line 1 · ×5",
    iconSymbol: 10,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: winAnimMidRowFive(10, 150),
  },
  {
    id: "win-anim-star",
    label: "Win anim · Scatter",
    subtitle: "Spine · Line 1 · ×5",
    iconSymbol: 11,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: winAnimMidRowFive(11, 40),
  },
];

// ─── Presets ─────────────────────────────────────────────────────────────────

export const TEST_PRESETS: TestPreset[] = [
  ...WIN_SPINE_ANIM_PRESETS,
  {
    id: "star-bot",
    label: "5× Scatter",
    subtitle: "Line 3 · Bottom row",
    iconSymbol: 11,
    badge: "×5",
    badgeColor: "#d8c18a",
    preset: {
      matrix: buildMatrix([
        [7, 2, 11],
        [6, 4, 11],
        [5, 1, 11],
        [3, 7, 11],
        [2, 6, 11],
      ]),
      winLines: [wl(11, 3, 5, 40)],
      winAmount: 40,
    },
  },
  {
    id: "glass-3",
    label: "3× Compass",
    subtitle: "Line 3 · Bottom row",
    iconSymbol: 5,
    badge: "×3",
    badgeColor: "#d8c18a",
    preset: {
      matrix: buildMatrix([
        [6, 2, 5],
        [7, 4, 5],
        [11, 1, 5],
        [1, 4, 7],
        [3, 2, 8],
      ]),
      winLines: [wl(5, 3, 3, 10)],
      winAmount: 10,
    },
  },
  {
    id: "lips-3",
    label: "3× Treasure",
    subtitle: "Line 1 · Small win",
    iconSymbol: 2,
    badge: "×3",
    badgeColor: "#d8c18a",
    preset: {
      matrix: buildMatrix([
        [4, 2, 1],
        [5, 2, 11],
        [7, 2, 6],
        [3, 11, 4],
        [1, 5, 3],
      ]),
      winLines: [wl(2, 1, 3, 8)],
      winAmount: 8,
    },
  },
  {
    id: "seven-v",
    label: "V-Shape Idol",
    subtitle: "Line 4 · V pattern",
    iconSymbol: 1,
    badge: "V",
    badgeColor: "#d8c18a",
    preset: {
      // Line 4 = rows [0,1,2,1,0]
      matrix: buildMatrix([
        [1, 5, 11],
        [7, 1, 3],
        [2, 4, 1],
        [11, 1, 5],
        [1, 7, 2],
      ]),
      winLines: [wl(1, 4, 5, 100)],
      winAmount: 100,
    },
  },
  {
    id: "all-sevens",
    label: "Full Board Idols",
    subtitle: "Lines 1–10 · Max win",
    iconSymbol: 1,
    badge: "ALL",
    badgeColor: "#d8c18a",
    preset: {
      matrix: buildMatrix([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ]),
      winLines: [
        wl(1, 1, 5, 100),
        wl(1, 2, 5, 100),
        wl(1, 3, 5, 100),
        wl(1, 4, 5, 100),
        wl(1, 5, 5, 100),
        wl(1, 6, 5, 100),
        wl(1, 7, 5, 100),
        wl(1, 8, 5, 100),
        wl(1, 9, 5, 100),
        wl(1, 10, 5, 100),
      ],
      winAmount: 1000,
    },
  },
  {
    id: "showcase",
    label: "All Symbols",
    subtitle: "Every symbol visible",
    badge: "show",
    badgeColor: "#d8c18a",
    preset: {
      matrix: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 9, 11],
        [1, 2, 3],
        [4, 5, 6],
      ],
      winLines: [],
      winAmount: 0,
      expandingWild: [0, 0, 0, 0, 0],
    },
  },
  {
    id: "seven-3-wild-col2",
    label: "3× Idol + Monkey Wild",
    subtitle: "Line 1 · Monkey Wild in 2nd column",
    iconSymbol: 1,
    badge: "×3",
    badgeColor: "#d8c18a",
    preset: {
      // Middle row (line 1): seven | wild | seven | … — three-of-a-kind with substitute on column 2.
      matrix: buildMatrix([
        [11, 1, 7],
        [9, 4, 6],
        [8, 1, 5],
        [3, 11, 4],
        [2, 7, 11],
      ]),
      winLines: [wl(1, 1, 3, 15)],
      winAmount: 15,
      expandingWild: [0, 9, 0, 0, 0],
    },
  },
  {
    id: "wild-3-line1",
    label: "3× Monkey Wild + Treasure row",
    subtitle: "Line 1 · Triple wild · Line 2 · Treasure ×5 (top)",
    iconSymbol: 9,
    badge: "×3",
    badgeColor: "#d8c18a",
    preset: {
      matrix: buildMatrix([
        [2, 3, 11],
        [9, 2, 6],
        [2, 9, 3],
        [2, 7, 9],
        [2, 8, 11],
      ]),
      winLines: [wl(2, 2, 5, 60)],
      winAmount: 95,
      expandingWild: [0, 9, 9, 9, 0],
    },
  },
  {
    id: "big-win-20x",
    label: "BIG WIN",
    subtitle: "20× · 3 win lines + banner",
    badge: "20×",
    badgeColor: "#d8c18a",
    preset: {
      matrix: buildMatrix([
        [1, 7, 11],
        [1, 7, 11],
        [1, 7, 11],
        [1, 7, 11],
        [1, 7, 11],
      ]),
      winLines: [
        wl(7, 1, 5, 100),
        wl(1, 2, 5, 60),
        wl(11, 3, 5, 40),
      ],
      winAmount: 200,
      odd: 20,
    },
  },
  {
    id: "mega-win-50x",
    label: "MEGA WIN",
    subtitle: "50× · 3 win lines + banner",
    badge: "50×",
    badgeColor: "#d8c18a",
    preset: {
      matrix: buildMatrix([
        [1, 7, 11],
        [1, 7, 11],
        [1, 7, 11],
        [1, 7, 11],
        [1, 7, 11],
      ]),
      winLines: [
        wl(7, 1, 5, 250),
        wl(1, 2, 5, 150),
        wl(11, 3, 5, 100),
      ],
      winAmount: 500,
      odd: 50,
    },
  },
  {
    id: "super-win-100x",
    label: "SUPER WIN",
    subtitle: "100× · 3 win lines + banner",
    badge: "100×",
    badgeColor: "#d8c18a",
    preset: {
      matrix: buildMatrix([
        [1, 7, 11],
        [1, 7, 11],
        [1, 7, 11],
        [1, 7, 11],
        [1, 7, 11],
      ]),
      winLines: [
        wl(7, 1, 5, 500),
        wl(1, 2, 5, 300),
        wl(11, 3, 5, 200),
      ],
      winAmount: 1000,
      odd: 100,
    },
  },
  {
    id: "scatter-3-line0",
    label: "3× Bonus + Free Spins",
    subtitle: "Full bonus round · current bet · no wallet changes",
    iconSymbol: 10,
    badge: "×3",
    badgeColor: "#d8c18a",
    rewardLabel: "5 Free Spins",
    preset: {
      book: bonusFixture,
      matrix: boardToMatrix(bonusFixture.events[0].board)!,
      winLines: [],
      winAmount: 0,
      odd: 0,
    },
  },
];
