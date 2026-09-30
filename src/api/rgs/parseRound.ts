import type { RgsRound } from '@/api/rgs/types';
import {
  isBook,
  isBookEvent,
  type Book,
  type BookEvent,
} from '@/features/slot/player/bookEvents';

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : null;
}

/** Pull a math book out of an RGS round. Shape varies slightly between SDK versions. */
export function extractBook(round: RgsRound | null | undefined): Book | null {
  if (!round) return null;

  const fromState = bookFromUnknown(round.state);
  if (fromState) {
    if (fromState.payoutMultiplier == null && round.payoutMultiplier != null) {
      return { ...fromState, payoutMultiplier: round.payoutMultiplier };
    }
    return fromState;
  }

  const roundRecord = asRecord(round);
  const directEvents = roundRecord?.events;
  if (Array.isArray(directEvents) && directEvents.every(isBookEvent)) {
    return {
      events: directEvents as BookEvent[],
      payoutMultiplier: round.payoutMultiplier,
      id: round.betID ?? round.id,
    };
  }

  return null;
}

export function bookFromUnknown(value: unknown): Book | null {
  if (isBook(value)) return value;
  if (Array.isArray(value) && value.every(isBookEvent)) {
    return { events: value as BookEvent[] };
  }
  const rec = asRecord(value);
  if (!rec) return null;
  if (Array.isArray(rec.events) && rec.events.every(isBookEvent)) {
    return rec as unknown as Book;
  }
  const nested = rec.book ?? rec.state;
  if (nested && nested !== value) return bookFromUnknown(nested);
  return null;
}

export function lastEventIndex(round: RgsRound | null | undefined): number {
  if (!round?.event) return 0;
  const parsed = Number(round.event);
  return Number.isFinite(parsed) ? parsed : 0;
}
