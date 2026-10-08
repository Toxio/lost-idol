import { useGameSounds } from '@/hooks/useGameSounds';
import { usePreferences } from '../settings/preferences';
import { useCallback, useEffect, useState } from 'react';
import { WelcomeScreen } from '../welcome/WelcomeScreen';
import { BonusBackground } from '@/features/appBg/BonusBackground';
import type { SlotSessionState } from '@/hooks/useRgsSession';
import { SlotMachinePixi } from '@/features/slot/SlotMachinePixi';

export type GameScreenProps = {
  hidden?: boolean;
  hub: SlotSessionState;
  spinSpeed: 1 | 2;
  onSpinSpeedChange: (speed: 1 | 2) => void;
  onAssetsLoaded?: () => void;
  onRegisterInsufficientFunds?: (handler: () => void) => void;
};

export function GameScreen({
  hidden = false,
  hub,
  spinSpeed,
  onSpinSpeedChange,
  onAssetsLoaded,
  onRegisterInsufficientFunds,
}: GameScreenProps) {
  useEffect(() => {
    if (hidden) return;
    const timer = window.setTimeout(() => {
      void import('./preloadBonusAssets').then(module => module.preloadBonusAssets()).catch(() => undefined);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [hidden]);
  const { skipWelcome } = usePreferences();
  const [entered, setEntered] = useState(false);
  const enter = useCallback(() => setEntered(true), []);
  const showGame = entered || skipWelcome || hub.replay;
  useGameSounds(showGame && hub.bonus.phase !== 'idle', !hidden);
  return (
    <div className={`app-page${hidden ? ' app-page--loading' : ''}`}>
      <BonusBackground mediaReady={!hidden} active={hub.bonus.phase !== 'idle'}>
        {(transitionComplete) => <main className="main-screen" inert={!showGame} style={!showGame ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}>
        <SlotMachinePixi
          hub={hub}
          bonusIntroReady={transitionComplete}
          spinSpeed={spinSpeed}
          onSpinSpeedChange={onSpinSpeedChange}
          onAssetsLoaded={onAssetsLoaded}
          onRegisterInsufficientFunds={onRegisterInsufficientFunds}
        />
      </main>}
      </BonusBackground>
      {!hidden && !showGame && <WelcomeScreen onContinue={enter} />}
    </div>
  );
}
