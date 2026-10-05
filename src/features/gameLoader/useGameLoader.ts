import { useCallback, useEffect, useRef, useState } from 'react';

import { useRgsSession } from '@/hooks/useRgsSession';
import {
  ASSETS_PROGRESS_WEIGHT,
  BUNDLE_PROGRESS_WEIGHT,
  CONNECTION_PROGRESS_WEIGHT,
  SPLASH_COMPLETE_DELAY_MS,
} from './gameLoaderConfig';

export function useGameLoader() {
  const [splashVisible, setSplashVisible] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [bundleReady, setBundleReady] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [spinSpeed, setSpinSpeed] = useState<1 | 2>(1);
  const insufficientFundsRef = useRef<() => void>(() => {});

  const hub = useRgsSession({
    onInsufficientFunds: () => insufficientFundsRef.current(),
  });

  useEffect(() => {
    const failed = () => setLoadError(true);
    window.addEventListener('game-assets-error', failed);
    return () => window.removeEventListener('game-assets-error', failed);
  }, []);

  useEffect(() => {
    if (assetsLoaded) { setLoadError(false); return; }
    const timer = window.setTimeout(() => setLoadError(true), 60000);
    return () => window.clearTimeout(timer);
  }, [assetsLoaded]);

  const connectionSettled =
    hub.status === 'ready' ||
    hub.status === 'error' ||
    hub.status === 'disconnected';

  useEffect(() => {
    let cancelled = false;

    void import('./GameScreen').then(() => {
      if (cancelled) return;
      setBundleReady(true);
    }).catch(() => { if (!cancelled) setLoadError(true); });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const bundlePart = bundleReady ? BUNDLE_PROGRESS_WEIGHT : 0;
    const connectionPart = connectionSettled ? CONNECTION_PROGRESS_WEIGHT : 0;
    const assetsPart = assetsLoaded ? ASSETS_PROGRESS_WEIGHT : 0;
    setLoadProgress(bundlePart + connectionPart + assetsPart);
  }, [bundleReady, connectionSettled, assetsLoaded]);

  useEffect(() => {
    if (!bundleReady || !connectionSettled || !assetsLoaded) return;

    const timer = window.setTimeout(() => {
      setSplashVisible(false);
    }, SPLASH_COMPLETE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [bundleReady, connectionSettled, assetsLoaded]);

  const onAssetsLoaded = useCallback(() => {
    setAssetsLoaded(true);
  }, []);

  const consumePendingRound = hub.consumePendingRound;
  const connectionStatus = hub.status;
  const replay = hub.replay;

  useEffect(() => {
    if (!assetsLoaded || connectionStatus !== 'ready') return;
    // In replay mode the round is gated behind the user pressing "Play"
    // (Stake Bet Replay UX requirement) — the ReplayControls component
    // triggers consumePendingRound on click.
    if (replay) return;
    consumePendingRound();
  }, [assetsLoaded, connectionStatus, consumePendingRound, replay]);

  const onRegisterInsufficientFunds = useCallback((handler: () => void) => {
    insufficientFundsRef.current = handler;
  }, []);

  return {
    splashVisible,
    loadError,
    loadProgress,
    bundleReady,
    hub,
    spinSpeed,
    setSpinSpeed,
    onAssetsLoaded,
    onRegisterInsufficientFunds,
  };
}
