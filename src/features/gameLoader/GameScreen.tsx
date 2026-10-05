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
  return (
    <div className={`app-page${hidden ? ' app-page--loading' : ''}`}>
      <BonusBackground active={hub.bonus.phase !== 'idle'}>
        {(transitionComplete) => <main className="main-screen">
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
    </div>
  );
}
