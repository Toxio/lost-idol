import { useEffect } from 'react';
import { setBackgroundMusic, stopBackgroundMusic } from '@/audio/soundManager';

/** Owns the looping game theme; mute and volume remain in soundManager. */
export function useGameSounds(bonusActive: boolean): void {
  useEffect(() => {
    setBackgroundMusic(bonusActive ? 'bonus_game' : 'main');
    return () => stopBackgroundMusic();
  }, [bonusActive]);
}
