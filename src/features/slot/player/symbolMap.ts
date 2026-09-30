/**
 * Math-book symbol names → numeric ids used by the Pixi reels.
 *
 * Math `game_config.py` serializes symbols as the same numeric ids (`"1"`…`"11"`).
 * Named aliases keep mock books and older events working.
 */
const SYMBOL_NAME_TO_ID: Record<string, number> = {
  '1': 1,
  H1: 1,
  SEVEN: 1,
  '2': 2,
  H2: 2,
  LIPS: 2,
  '3': 3,
  H3: 3,
  PARFUME: 3,
  '4': 4,
  H4: 4,
  ROSE: 4,
  '5': 5,
  L1: 5,
  GLASS: 5,
  '6': 6,
  L2: 6,
  LIPSTICK: 6,
  '7': 7,
  L3: 7,
  GOBLET: 7,
  '8': 8,
  L4: 8,
  HEELS: 8,
  '9': 9,
  W: 9,
  WILD: 9,
  '10': 10,
  S: 10,
  SCATTER: 10,
  BOX: 10,
  '11': 11,
  S2: 11,
  STAR: 11,
};

const SYMBOL_ID_TO_NAME: Record<number, string> = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: '11',
};

export const REEL_COUNT = 5;
export const ROW_COUNT = 3;
export const EMPTY_EXPANDING_WILD: number[] = [0, 0, 0, 0, 0];

export function symbolNameToId(name: unknown): number {
  if (typeof name === 'number' && Number.isFinite(name)) return name;
  if (typeof name !== 'string') return 1;
  const trimmed = name.trim();
  const asNumber = Number(trimmed);
  if (Number.isFinite(asNumber) && asNumber > 0) return asNumber;
  return SYMBOL_NAME_TO_ID[trimmed.toUpperCase()] ?? 1;
}

export function symbolIdToName(id: number): string {
  return SYMBOL_ID_TO_NAME[id] ?? '1';
}

export function createDefaultMatrix(): number[][] {
  return [
    [1, 5, 8],
    [3, 7, 2],
    [11, 4, 6],
    [2, 9, 3],
    [7, 1, 4],
  ];
}
