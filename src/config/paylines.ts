/**
 * Row index per reel for each payline id from the server (`Line` on win entries).
 * Rows: 0 = top, 1 = middle, 2 = bottom (matches matrix[i][row] in API).
 *
 * Lines 1–10 match the game’s published 5×3 payline diagram (10 lines).
 */
const PAYLINES: Record<number, readonly [number, number, number, number, number]> = {
  1: [1, 1, 1, 1, 1],
  2: [0, 0, 0, 0, 0],
  3: [2, 2, 2, 2, 2],
  4: [0, 1, 2, 1, 0],
  5: [2, 1, 0, 1, 2],
  6: [0, 0, 1, 2, 2],
  7: [2, 2, 1, 0, 0],
  8: [1, 2, 2, 2, 1],
  9: [1, 0, 0, 0, 1],
  10: [0, 1, 1, 1, 0],
};

/** Server sends `Line: 0` for scatter (any-reel-position) wins. */
export const SCATTER_WIN_LINE_ID = 0;

export function isScatterWinLine(lineId: number): boolean {
  return lineId === SCATTER_WIN_LINE_ID;
}

export interface MatrixCell {
  col: number;
  row: number;
}

/**
 * Scatter wins: first `maxCount` matches left→right, top→bottom within each reel.
 * Rows: 0 = top, 1 = middle, 2 = bottom (matches `matrix[reel][row]`).
 */
export function findMatrixCellsForSymbol(
  matrix: number[][],
  serverSymbol: number,
  maxCount: number,
): MatrixCell[] {
  const cells: MatrixCell[] = [];
  for (let col = 0; col < matrix.length && col < 5 && cells.length < maxCount; col++) {
    for (let row = 0; row < 3; row++) {
      if (matrix[col]?.[row] === serverSymbol) {
        cells.push({ col, row });
        break;
      }
    }
  }
  return cells;
}

/** Returns 5 row indices for `lineId`, or `null` if unknown. */
export function getPaylineForLineId(lineId: number): number[] | null {
  const p = PAYLINES[lineId];
  return p ? [...p] : null;
}
