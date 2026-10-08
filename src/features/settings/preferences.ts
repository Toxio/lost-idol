import { useSyncExternalStore } from 'react';
const key = 'lost-idol-preferences';
const defaults = { powerSaving: false, skipWelcome: false };
let state = defaults;
try { const saved = JSON.parse(localStorage.getItem(key) || '{}'); state = { powerSaving: saved.powerSaving === true, skipWelcome: saved.skipWelcome === true }; } catch { /* Storage may be unavailable. */ }
const listeners = new Set<() => void>();
export function setPreference(name: keyof typeof defaults, value: boolean) {
  state = { ...state, [name]: value };
  try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* Keep the session setting. */ }
  listeners.forEach(listener => listener());
}
export function usePreferences() {
  return useSyncExternalStore((listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; }, () => state);
}
