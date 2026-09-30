import { RgsError } from "./errors";
import type {
  AuthenticateResponse,
  EndRoundResponse,
  EventResponse,
  JurisdictionFlags,
  PlayParams,
  PlayResponse,
  ReplayParams,
  ReplayResponse,
  RgsClient,
  RgsRound,
} from "./types";
import { DEFAULT_JURISDICTION } from "./types";

export type HttpRgsClientOptions = {
  sessionID: string;
  rgsUrl: string;
  lang?: string;
  protocol?: "http" | "https";
};

export function resolveRgsBaseUrl(
  rgsUrl: string,
  protocol: "http" | "https" = "https",
): string {
  const trimmed = rgsUrl.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${protocol}://${trimmed}`;
}

function asRound(value: unknown): RgsRound | null {
  if (!value || typeof value !== "object") return null;
  const rec = value as Record<string, unknown>;
  return {
    betID: rec.betID as number | undefined,
    id: rec.id as number | string | undefined,
    amount: rec.amount as number | undefined,
    payout: rec.payout as number | undefined,
    payoutMultiplier: rec.payoutMultiplier as number | undefined,
    active: Boolean(rec.active),
    mode: typeof rec.mode === "string" ? rec.mode : "base",
    event: typeof rec.event === "string" ? rec.event : undefined,
    state: rec.state,
  };
}

function parseJurisdiction(raw: unknown): JurisdictionFlags {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_JURISDICTION };
  const rec = raw as Record<string, unknown>;
  return {
    socialCasino: Boolean(rec.socialCasino),
    disabledFullscreen: Boolean(rec.disabledFullscreen),
    disabledTurbo: Boolean(rec.disabledTurbo),
    disabledSuperTurbo: Boolean(rec.disabledSuperTurbo),
    disabledAutoplay: Boolean(rec.disabledAutoplay),
    disabledSlamstop: Boolean(rec.disabledSlamstop),
    disabledSpacebar: Boolean(rec.disabledSpacebar),
    disabledBuyFeature: Boolean(rec.disabledBuyFeature),
    displayNetPosition: Boolean(rec.displayNetPosition),
    displayRTP: Boolean(rec.displayRTP),
    displaySessionTimer: Boolean(rec.displaySessionTimer),
    minimumRoundDuration: Number(rec.minimumRoundDuration) || 0,
  };
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function assertOk(response: Response, body: unknown): void {
  if (response.status >= 200 && response.status < 300) return;
  throw RgsError.fromResponse(response.status, body);
}

export function createHttpRgsClient(options: HttpRgsClientOptions): RgsClient {
  const baseUrl = resolveRgsBaseUrl(options.rgsUrl, options.protocol);
  const sessionID = options.sessionID;
  const lang = options.lang ?? "en";

  async function post<T>(
    path: string,
    body: Record<string, unknown>,
  ): Promise<T> {
    const response = await fetch(`${baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    const data = await parseBody(response);
    assertOk(response, data);
    return data as T;
  }

  return {
    async authenticate(): Promise<AuthenticateResponse> {
      const data = await post<Record<string, unknown>>("/wallet/authenticate", {
        sessionID,
        language: lang,
      });
      const configRaw = (data.config ?? {}) as Record<string, unknown>;
      return {
        balance: (data.balance ?? {
          amount: 0,
          currency: "USD",
        }) as AuthenticateResponse["balance"],
        config: {
          minBet: Number(configRaw.minBet) || 0,
          maxBet: Number(configRaw.maxBet) || 0,
          stepBet: Number(configRaw.stepBet) || Number(configRaw.minStep) || 0,
          defaultBetLevel: Number(configRaw.defaultBetLevel) || 0,
          betLevels: Array.isArray(configRaw.betLevels)
            ? configRaw.betLevels.map((level) => Number(level) || 0)
            : [],
        },
        jurisdictionFlags: parseJurisdiction(configRaw.jurisdiction),
        round: asRound(data.round),
      };
    },

    async play(params: PlayParams): Promise<PlayResponse> {
      const data = await post<Record<string, unknown>>("/wallet/play", {
        sessionID,
        amount: params.amount,
        mode: params.mode,
      });
      const round = asRound(data.round);
      if (!round)
        throw new RgsError("ERR_VAL", 400, "Play response missing round");
      return {
        balance: (data.balance ?? {
          amount: 0,
          currency: "USD",
        }) as PlayResponse["balance"],
        round,
      };
    },

    async endRound(): Promise<EndRoundResponse> {
      const data = await post<Record<string, unknown>>("/wallet/end-round", {
        sessionID,
      });
      return {
        balance: (data.balance ?? {
          amount: 0,
          currency: "USD",
        }) as EndRoundResponse["balance"],
      };
    },

    async event(eventValue: string): Promise<EventResponse> {
      const data = await post<Record<string, unknown>>("/bet/event", {
        sessionID,
        event: eventValue,
      });
      return { event: String(data.event ?? eventValue) };
    },

    async fetchReplay(params: ReplayParams): Promise<ReplayResponse> {
      const path = `/bet/replay/${encodeURIComponent(params.game)}/${encodeURIComponent(params.version)}/${encodeURIComponent(params.mode)}/${encodeURIComponent(params.event)}`;
      const query = `?language=${encodeURIComponent(params.language ?? lang)}`;
      const response = await fetch(`${baseUrl}${path}${query}`, { signal: AbortSignal.timeout(15000) });
      const data = await parseBody(response);
      assertOk(response, data);
      const rec = (data ?? {}) as Record<string, unknown>;
      return {
        payoutMultiplier: Number(rec.payoutMultiplier) || 0,
        costMultiplier: Number(rec.costMultiplier) || 0,
        state: rec.state,
      };
    },
  };
}
