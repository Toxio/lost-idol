/** Server symbol index for the wild substitute. */
export const WILD_SERVER_IDX = 9;

/** Server symbol indices that count as scatter (drives `scatter_win` sound + Spine choice). */
export const SCATTER_SERVER_INDICES = [10, 11] as const;

export function isWildMatrixSymbol(serverIdx: number): boolean {
  return serverIdx === WILD_SERVER_IDX;
}

/** Cell counts toward a line win when it matches the combo symbol or wild substitutes. */
export function isWinLineMatrixSymbol(matrixIdx: number, comboSymbol: number): boolean {
  return matrixIdx === comboSymbol || isWildMatrixSymbol(matrixIdx);
}

export function isScatterSymbol(animIdx: number): boolean {
  return (SCATTER_SERVER_INDICES as readonly number[]).includes(animIdx);
}
