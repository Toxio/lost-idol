export interface GameUrlParams {
  currency: string | null;
  /** Locale for Intl / i18n. Stake sends `lang`; legacy launchers sent `Culture`. */
  culture: string;
  /** ISO 639-1 from `?lang=` (Stake) or `?Culture=` (legacy). */
  lang: string;
  /** RGS session token (`?sessionID=`). */
  sessionID: string | null;
  /** RGS host, with or without protocol (`?rgs_url=`). */
  rgsUrl: string | null;
  device: 'desktop' | 'mobile' | null;
  /** ACP replay: `?replay=true`. */
  replay: boolean;
  replayGame: string | null;
  replayVersion: string | null;
  replayMode: string | null;
  replayEvent: string | null;
  /** Replay stake in API units, when provided. */
  replayAmount: number | null;
  /** URL to redirect to when the user clicks the home/exit button (`?exitUrl=…`). */
  exitUrl: string | null;
  /** Stake sends `?social=true` when the game runs in stake.us (US social casino mode).
   *  US jurisdiction prohibits gambling terms, so i18n uses `sweeps_<lang>` overrides. */
  social: boolean;
}

function readQueryParam(...names: string[]): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  for (const name of names) {
    const value = params.get(name)?.trim();
    if (value) return value;
  }
  return null;
}

export function getGameUrlParams(): GameUrlParams {
  const currency = readQueryParam('Currency', 'currency');
  const social = ['true', '1'].includes(readQueryParam('social', 'Social')?.toLowerCase() ?? '');
  const lang = (social ? 'en' : (
    readQueryParam('lang', 'Lang', 'Culture', 'culture') ?? 'en'
  )).toLowerCase();
  const deviceRaw = readQueryParam('device', 'Device')?.toLowerCase();
  const replayFlag = readQueryParam('replay', 'Replay')?.toLowerCase();
  const replayAmountRaw = readQueryParam('amount', 'Amount');
  const replayAmount = replayAmountRaw ? Number(replayAmountRaw) : NaN;

  return {
    currency: currency ? currency.toUpperCase() : null,
    culture: lang,
    lang: lang.split('-')[0],
    sessionID: readQueryParam('sessionID', 'sessionId', 'session_id'),
    rgsUrl: readQueryParam('rgs_url', 'rgsUrl', 'rgs-url'),
    device:
      deviceRaw === 'mobile' || deviceRaw === 'desktop' ? deviceRaw : null,
    replay: replayFlag === 'true' || replayFlag === '1',
    replayGame: readQueryParam('game', 'Game'),
    replayVersion: readQueryParam('version', 'Version'),
    replayMode: readQueryParam('mode', 'Mode'),
    replayEvent: readQueryParam('event', 'Event'),
    replayAmount: Number.isFinite(replayAmount) ? replayAmount : null,
    exitUrl: readQueryParam('exitUrl', 'ExitUrl', 'exit_url', 'exitURL'),
    social,
  };
}

export function isReplayMode(): boolean {
  const params = getGameUrlParams();
  return (
    params.replay &&
    Boolean(params.rgsUrl && params.replayGame && params.replayEvent)
  );
}

/** Development/test builds only: use mock RGS when no session is provided. */
export function shouldUseMockRgs(): boolean {
  if (!__TEST_TOOLS_ENABLED__) return false;
  const params = getGameUrlParams();
  if (params.replay) return false;
  return !params.sessionID || !params.rgsUrl;
}
