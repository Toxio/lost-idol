/** Stake RGS wallet error codes. */
export const RGS_ERROR = {
  INVALID_REQUEST: 'ERR_VAL',
  INSUFFICIENT_BALANCE: 'ERR_IPB',
  INVALID_SESSION: 'ERR_IS',
  AUTH_EXPIRED: 'ERR_ATE',
  GAMBLING_LIMIT: 'ERR_GLE',
  INVALID_LOCATION: 'ERR_LOC',
  GENERAL: 'ERR_GEN',
  MAINTENANCE: 'ERR_MAINTENANCE',
} as const;

export type RgsErrorCode = (typeof RGS_ERROR)[keyof typeof RGS_ERROR] | string;

export class RgsError extends Error {
  readonly status: number;
  readonly code: RgsErrorCode;

  constructor(code: RgsErrorCode, status: number, message?: string) {
    super(message ?? code);
    this.name = 'RgsError';
    this.code = code;
    this.status = status;
  }

  static fromResponse(status: number, body: unknown): RgsError {
    const code =
      readErrorCode(body) ??
      (status >= 500 ? RGS_ERROR.GENERAL : RGS_ERROR.INVALID_REQUEST);
    const message = readErrorMessage(body) ?? code;
    return new RgsError(code, status, message);
  }
}

function readErrorCode(body: unknown): string | null {
  if (typeof body === 'string' && body.startsWith('ERR_')) return body;
  if (!body || typeof body !== 'object') return null;
  const rec = body as Record<string, unknown>;
  for (const key of ['code', 'error', 'errorCode', 'errorcode']) {
    const value = rec[key];
    if (typeof value === 'string' && value) return value;
  }
  return null;
}

function readErrorMessage(body: unknown): string | null {
  if (typeof body === 'string') return body;
  if (!body || typeof body !== 'object') return null;
  const rec = body as Record<string, unknown>;
  const message = rec.message ?? rec.msg;
  return typeof message === 'string' ? message : null;
}

export function isRgsError(error: unknown): error is RgsError {
  return error instanceof RgsError;
}

export function isInsufficientFundsError(error: unknown): boolean {
  return isRgsError(error) && error.code === RGS_ERROR.INSUFFICIENT_BALANCE;
}

export function isSessionError(error: unknown): boolean {
  if (!isRgsError(error)) return false;
  return (
    error.code === RGS_ERROR.INVALID_SESSION ||
    error.code === RGS_ERROR.AUTH_EXPIRED
  );
}
