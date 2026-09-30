import { useCallback, useSyncExternalStore } from 'react';
import {
  getEffectsVolume,
  getMusicVolume,
  getMuted,
  setEffectsVolume,
  setMusicVolume,
  setMuted,
  subscribe,
} from '@/audio/soundManager';

/**
 * React binding for the module-level sound store.
 * All callers share the same state — change in one place is reflected everywhere.
 */
export function useSoundSettings() {
  const muted = useSyncExternalStore(subscribe, getMuted, getMuted);
  const musicVolume = useSyncExternalStore(subscribe, getMusicVolume, getMusicVolume);
  const effectsVolume = useSyncExternalStore(subscribe, getEffectsVolume, getEffectsVolume);

  const toggleMute = useCallback(() => setMuted(!getMuted()), []);

  return {
    muted,
    toggleMute,
    setMuted,
    musicVolume,
    setMusicVolume,
    effectsVolume,
    setEffectsVolume,
  };
}
