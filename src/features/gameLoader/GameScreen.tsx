import { usePreferences } from '../settings/preferences';
import { useCallback, useState } from 'react';
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
  const { skipWelcome } = usePreferences();
  const [entered, setEntered] = useState(false);
  const enter = useCallback(() => setEntered(true), []);
  const showGame = entered || skipWelcome || hub.replay;
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
