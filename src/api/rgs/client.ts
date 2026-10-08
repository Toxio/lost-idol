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

// Share only in-flight authentication across StrictMode remounts/client instances.
// Completed responses are not cached: reconnect must get fresh wallet state.
const pendingAuthentications = new Map<string, Promise<unknown>>();

export function createHttpRgsClient(options: HttpRgsClientOptions): RgsClient {
  const baseUrl = resolveRgsBaseUrl(options.rgsUrl, options.protocol);
  const sessionID = options.sessionID;
  const lang = options.lang ?? "en";

  // Conservative client-side pacing, not an asserted engine rate limit.
  // Keep settlement and the following play from arriving in a burst.
  let requestTail: Promise<unknown> = Promise.resolve();
  let lastRequestAt = -Infinity;
  function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
    const authKey = path === '/wallet/authenticate'
      ? JSON.stringify([baseUrl, sessionID, lang]) : null;
    const pending = authKey ? pendingAuthentications.get(authKey) : undefined;
    if (pending) return pending as Promise<T>;
    const request = requestTail.then(async () => {
      const delay = Math.max(0, 1000 - (performance.now() - lastRequestAt));
      if (delay) await new Promise(resolve => setTimeout(resolve, delay));
      lastRequestAt = performance.now();
      return send<T>(path, body);
    });
    if (authKey) {
      pendingAuthentications.set(authKey, request);
      const clear = () => { pendingAuthentications.delete(authKey); };
      void request.then(clear, clear);
    }
    requestTail = request.catch(() => undefined);
    return request;
  }

  async function send<T>(
    path: string,
    body: Record<string, unknown>,
  ): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
    } catch (error) {
      // A failed play may already have been accepted: never retry a wager here.
      const timeout = error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name);
      throw new RgsError(timeout ? "REQUEST_TIMEOUT" : "NETWORK_REQUEST_FAILED", 0);
    }
    let data: unknown;
    try {
      data = await parseBody(response);
    } catch {
      throw new RgsError("RESPONSE_READ_FAILED", response.status);
    }
    assertOk(response, data);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new RgsError("INVALID_RESPONSE_BODY", response.status);
    }
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
