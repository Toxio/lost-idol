import { getGameUrlParams } from "./getGameUrlParams";

export const DEFAULT_CURRENCY_PRECISION = 2;

/** RGS wallet amounts: `1_000_000` = `$1.00`. */
export const API_AMOUNT_SCALE = 1_000_000;
/** Math-book amounts: `100` = `$1.00` at unit bet. */
export const BOOK_AMOUNT_SCALE = 100;

export type CurrencyPlacement = "prefix" | "suffix";

export interface CurrencyDisplay {
  code: string;
  symbol: string;
  decimals: number;
  /** Stake: suffix symbols are separated by a space (`10.00 KR`). Prefix has no space (`$10.00`). */
  placement: CurrencyPlacement;
}

type CurrencyMeta = {
  symbol: string;
  decimals: number;
  placement: CurrencyPlacement;
};

const PREFIX = (symbol: string, decimals: number): CurrencyMeta => ({
  symbol,
  decimals,
  placement: "prefix",
});
const SUFFIX = (symbol: string, decimals: number): CurrencyMeta => ({
  symbol,
  decimals,
  placement: "suffix",
});

/** Stake Engine display table (symbol, decimals, prefix vs suffix). */
const CURRENCY_META: Record<string, CurrencyMeta> = {
  USD: PREFIX("$", 2),
  CAD: PREFIX("CA$", 2),
  JPY: PREFIX("¥", 0),
  EUR: PREFIX("€", 2),
  RUB: PREFIX("₽", 2),
  CNY: PREFIX("CN¥", 2),
  PHP: PREFIX("₱", 2),
  INR: PREFIX("₹", 2),
  IDR: PREFIX("Rp", 0),
  KRW: PREFIX("₩", 0),
  BRL: PREFIX("R$", 2),
  MXN: PREFIX("MX$", 2),
  DKK: SUFFIX("KR", 2),
  PLN: SUFFIX("zł", 2),
  VND: SUFFIX("₫", 0),
  TRY: PREFIX("₺", 2),
  CLP: SUFFIX("CLP", 0),
  ARS: SUFFIX("ARS", 2),
  PEN: PREFIX("S/", 2),
  NGN: PREFIX("₦", 2),
  SAR: SUFFIX("SAR", 2),
  ILS: SUFFIX("ILS", 2),
  AED: SUFFIX("AED", 2),
  TWD: PREFIX("NT$", 2),
  NOK: PREFIX("kr", 2),
  KWD: PREFIX("KD", 2),
  JOD: PREFIX("JD", 2),
  CRC: PREFIX("₡", 2),
  TND: SUFFIX("TND", 2),
  SGD: PREFIX("SG$", 2),
  MYR: PREFIX("RM", 2),
  OMR: SUFFIX("OMR", 2),
  QAR: SUFFIX("QAR", 2),
  BHD: PREFIX("BD", 2),
  PKR: PREFIX("Rs", 2),
  EGP: SUFFIX("ج.م", 2),
  NZD: PREFIX("NZ$", 2),
  BOB: PREFIX("Bs", 2),
  GHS: PREFIX("GH₵", 2),
  KES: PREFIX("KSh", 2),
  MAD: PREFIX("MAD", 2),
  BAM: PREFIX("KM", 2),
  ISK: PREFIX("kr", 2),
  TZS: PREFIX("TSh", 2),
  UGX: PREFIX("USh", 2),
  XOF: PREFIX("CFA", 2),
  XGC: SUFFIX("GC", 2),
  XSC: SUFFIX("SC", 2),
  XEC: SUFFIX("SC", 2),
};

export function apiAmountToDisplay(apiAmount: number): number {
  return apiAmount / API_AMOUNT_SCALE;
}

export function displayAmountToApi(displayAmount: number): number {
  return Math.round(displayAmount * API_AMOUNT_SCALE);
}

/**
 * Book event amounts are bet-independent hundredths of a unit.
 * `100` at a $2 stake → `$2.00` displayed.
 */
export function bookAmountToDisplay(bookAmount: number, betAmount = 1): number {
  return (bookAmount / BOOK_AMOUNT_SCALE) * betAmount;
}

export function getCurrencyDisplay(
  currencyCode?: string | null,
): CurrencyDisplay {
  const code = currencyCode?.trim().toUpperCase() || "USD";
  const meta = CURRENCY_META[code];
  if (meta) return { code, ...meta };
  return {
    code,
    symbol: code,
    decimals: DEFAULT_CURRENCY_PRECISION,
    placement: "suffix",
  };
}

export function decimalsForCurrency(currencyCode?: string | null): number {
  return getCurrencyDisplay(currencyCode).decimals;
}

/** Decimal places for monetary amounts from InitialState `Precision`. */
export function normalizeCurrencyPrecision(raw: unknown): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return DEFAULT_CURRENCY_PRECISION;
  return Math.min(8, Math.floor(n));
}

/** Format a monetary amount using backend currency precision. */
export function formatAmount(
  value: number,
  precision = DEFAULT_CURRENCY_PRECISION,
): string {
  const safe = Number.isFinite(value) ? value : 0;
  const minimum = normalizeCurrencyPrecision(precision);
  // RGS uses millionths. Preserve fractional payouts without floating-point tails.
  const exact = safe.toFixed(Math.max(minimum, 6));
  const trimmed = exact.replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  const decimals = trimmed.split('.')[1]?.length ?? 0;
  return safe.toFixed(Math.max(minimum, decimals));
}

/**
 * Round to exactly `precision` decimals, keeping trailing zeros (`124.200209` → `124.20`,
 * `124` → `124.00`).
 *
 * Wallet amounts arrive in millionths, so the raw value carries sub-cent digits that must not
 * reach the player — unlike {@link formatAmount}, which deliberately preserves them for stakes.
 * Rounds to the same cent as `canAffordStake`, so display and affordability never disagree.
 */
export function formatFixedAmount(
  value: number,
  precision = DEFAULT_CURRENCY_PRECISION,
): string {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toFixed(normalizeCurrencyPrecision(precision));
}

/**
 * {@link formatFixedAmount} with the fractional part dropped when it rounds to zero
 * (`124.200209` → `124.20`, `124` → `124`, `124.5` → `124.50`). Used for balance and win
 * readouts, where a bare `$124` reads cleaner than `$124.00`.
 */
export function formatTrimmedAmount(
  value: number,
  precision = DEFAULT_CURRENCY_PRECISION,
): string {
  const fixed = formatFixedAmount(value, precision);
  const [whole, fraction] = fixed.split(".");
  return fraction === undefined || Number(fraction) !== 0 ? fixed : whole;
}

function withCurrencySymbol(amount: string, display: CurrencyDisplay): string {
  if (display.placement === "suffix") return `${amount} ${display.symbol}`;
  return `${display.symbol}${amount}`;
}

/** Full Stake money string: `$10.00` or `10.00 KR`. */
export function formatMoney(
  value: number,
  currencyCode?: string | null,
  precision?: number,
): string {
  const display = getCurrencyDisplay(currencyCode);
  return withCurrencySymbol(
    formatAmount(value, precision ?? display.decimals),
    display,
  );
}

/** Money string using {@link formatFixedAmount}: `$10.00`, `$10.50`. */
export function formatFixedMoney(
  value: number,
  currencyCode?: string | null,
  precision?: number,
): string {
  const display = getCurrencyDisplay(currencyCode);
  return withCurrencySymbol(
    formatFixedAmount(value, precision ?? display.decimals),
    display,
  );
}

export function resolveCurrencyCode(serverCode?: string | null): string {
  const fromUrl = getGameUrlParams().currency;
  if (getGameUrlParams().replay && fromUrl) return fromUrl;
  const fromServer = serverCode?.trim();
  return fromServer ? fromServer.toUpperCase() : "USD";
}

/** Symbol for a currency code (e.g. EUR → €, CAD → CA$). */
export function getCurrencySymbol(currencyCode: string): string {
  return getCurrencyDisplay(currencyCode).symbol;
}
