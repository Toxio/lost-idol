export type RgsLanguage =
  | "ar"
  | "de"
  | "en"
  | "es"
  | "fi"
  | "fr"
  | "hi"
  | "id"
  | "ja"
  | "ko"
  | "po"
  | "pt"
  | "ru"
  | "tr"
  | "vi"
  | "zh";

export type RgsCurrency =
  | "USD"
  | "CAD"
  | "JPY"
  | "EUR"
  | "RUB"
  | "CNY"
  | "PHP"
  | "INR"
  | "IDR"
  | "KRW"
  | "BRL"
  | "MXN"
  | "DKK"
  | "PLN"
  | "VND"
  | "TRY"
  | "CLP"
  | "ARS"
  | "PEN"
  | "NGN"
  | "SAR"
  | "ILS"
  | "AED"
  | "TWD"
  | "NOK"
  | "KWD"
  | "JOD"
  | "CRC"
  | "TND"
  | "SGD"
  | "MYR"
  | "OMR"
  | "QAR"
  | "BHD"
  | "PKR"
  | "EGP"
  | "NZD"
  | "BOB"
  | "GHS"
  | "KES"
  | "MAD"
  | "BAM"
  | "ISK"
  | "TZS"
  | "UGX"
  | "XOF"
  | "XGC"
  | "XSC"
  | "XEC";

export type RgsBalance = {
  amount: number;
  currency: string;
};

export type JurisdictionFlags = {
  socialCasino: boolean;
  disabledFullscreen: boolean;
  disabledTurbo: boolean;
  disabledSuperTurbo: boolean;
  disabledAutoplay: boolean;
  disabledSlamstop: boolean;
  disabledSpacebar: boolean;
  disabledBuyFeature: boolean;
  displayNetPosition: boolean;
  displayRTP: boolean;
  displaySessionTimer: boolean;
  minimumRoundDuration: number;
};

export type AuthenticateConfig = {
  minBet: number;
  maxBet: number;
  stepBet: number;
  defaultBetLevel: number;
  betLevels: number[];
};

/** RGS round. `state` is the math book (or a wrapper around `events`). */
export type RgsRound = {
  betID?: number;
  id?: number | string;
  amount?: number;
  payout?: number;
  payoutMultiplier?: number;
  active: boolean;
  mode: string;
  event?: string;
  state: unknown;
};

export type AuthenticateResponse = {
  balance: RgsBalance;
  config: AuthenticateConfig;
  jurisdictionFlags: JurisdictionFlags;
  round: RgsRound | null;
};

export type PlayResponse = {
  balance: RgsBalance;
  round: RgsRound;
};

export type EndRoundResponse = {
  balance: RgsBalance;
};

export type EventResponse = {
  event: string;
};

export type ReplayResponse = {
  payoutMultiplier: number;
  costMultiplier: number;
  state: unknown;
};

export type PlayParams = {
  amount: number;
  mode: string;
};

export type ReplayParams = {
  game: string;
  version: string;
  mode: string;
  event: string;
  /** Optional per-request language override; falls back to the client's `lang`. */
  language?: string;
};

export const DEFAULT_JURISDICTION: JurisdictionFlags = {
  socialCasino: false,
  disabledFullscreen: false,
  disabledTurbo: false,
  disabledSuperTurbo: false,
  disabledAutoplay: false,
  disabledSlamstop: false,
  disabledSpacebar: false,
  disabledBuyFeature: false,
  displayNetPosition: false,
  displayRTP: false,
  displaySessionTimer: false,
  minimumRoundDuration: 0,
};

export const DEFAULT_BET_MODE = "base";

export interface RgsClient {
  authenticate: () => Promise<AuthenticateResponse>;
  play: (params: PlayParams) => Promise<PlayResponse>;
  endRound: () => Promise<EndRoundResponse>;
  event: (eventValue: string) => Promise<EventResponse>;
  fetchReplay: (params: ReplayParams) => Promise<ReplayResponse>;
}
