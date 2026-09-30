export { createHttpRgsClient, resolveRgsBaseUrl } from "./client";
export { createMockRgsClient } from "./mockClient";
export {
  RgsError,
  RGS_ERROR,
  isInsufficientFundsError,
  isRgsError,
  isSessionError,
} from "./errors";
export { extractBook, bookFromUnknown, lastEventIndex } from "./parseRound";
export {
  resolveBetConfig,
  indexOfBetLevel,
  snapToBetLevel,
} from "./resolveBetConfig";
export type {
  AuthenticateConfig,
  AuthenticateResponse,
  EndRoundResponse,
  EventResponse,
  JurisdictionFlags,
  PlayParams,
  PlayResponse,
  ReplayParams,
  ReplayResponse,
  RgsBalance,
  RgsClient,
  RgsRound,
} from "./types";
export { DEFAULT_BET_MODE, DEFAULT_JURISDICTION } from "./types";
