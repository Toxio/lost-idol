import { useEffect } from 'react';
import { setBackgroundMusic, stopBackgroundMusic } from '@/audio/soundManager';

/** Owns the looping game theme; mute and volume remain in soundManager. */
export function useGameSounds(bonusActive: boolean, ready = true): void {
  useEffect(() => {
    if (!ready) return;
    setBackgroundMusic(bonusActive ? 'bonus_game' : 'main');
    return () => stopBackgroundMusic();
  }, [bonusActive, ready]);
}
