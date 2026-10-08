import { isRgsError } from './errors';

let lastFailure = '';
/** Only stage/status/code are exposed; never wallet payloads or session tokens. */
export function recordRgsFailure(stage: string, error: unknown) {
  const code = isRgsError(error) ? `${error.status}/${error.code}`
    : error instanceof Error ? error.name : 'UnknownError';
  lastFailure = `${stage}: ${code.replace(/[^a-zA-Z0-9_ /-]/g, '').slice(0, 80)}`;
  console.error('[Lost Idol]', lastFailure);
}
export function getRgsFailure() { return lastFailure; }
