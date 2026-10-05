import { lazy, Suspense, useEffect, useState } from 'react';
import './App.css';

import { play as playSound } from './audio/soundManager';
import { ConnectionLostModal, SessionExpiredModal } from './features/slot/modals';
import { useGameLoader } from './features/gameLoader/useGameLoader';
import { SplashScreen } from './features/splash/SplashScreen';

const GameScreen = lazy(() =>
  import('./features/gameLoader/GameScreen').then((module) => ({
    default: module.GameScreen,
  })),
);

/** Avoid flashing Connection Lost during brief SignalR reconnects. */
const CONNECTION_LOST_DELAY_MS = 2500;

function App() {
  const {
    splashVisible,
    loadError,
    loadProgress,
    bundleReady,
    hub,
    spinSpeed,
    setSpinSpeed,
    onAssetsLoaded,
    onRegisterInsufficientFunds,
  } = useGameLoader();

  const connectionIssue = hub.status === 'disconnected' || hub.status === 'error';
  const [connectionLost, setConnectionLost] = useState(false);
  const sessionExpired = hub.status === 'session_expired';

  useEffect(() => {
    const delay = connectionIssue && hub.status !== 'error' ? CONNECTION_LOST_DELAY_MS : 0;
    const timer = window.setTimeout(() => setConnectionLost(connectionIssue), delay);
    return () => window.clearTimeout(timer);
  }, [connectionIssue, hub.status]);

  useEffect(() => {
    if (connectionLost) playSound('error_dialog');
  }, [connectionLost]);

  return (
    <>
      <SplashScreen progress={loadProgress} visible={splashVisible} error={loadError} />
      {bundleReady ? (
        <Suspense fallback={null}>
          <GameScreen
            hidden={splashVisible}
            hub={hub}
            spinSpeed={spinSpeed}
            onSpinSpeedChange={setSpinSpeed}
            onAssetsLoaded={onAssetsLoaded}
            onRegisterInsufficientFunds={onRegisterInsufficientFunds}
          />
        </Suspense>
      ) : null}

      <ConnectionLostModal elevated open={connectionLost} onClose={() => {}} />
      <SessionExpiredModal elevated open={sessionExpired} onClose={() => {}} />
    </>
  );
}

export default App;
