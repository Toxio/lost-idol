import { useEffect, useState, type ReactNode } from 'react';
import { AppBg } from './AppBg';
import { BonusTransition } from './BonusTransition';
import { usePreferences } from '../settings/preferences';

import bonusVideo from '@/assets/background/bonus.mp4?url';
import portalVideo from '@/assets/transition/bonus-portal.mp4?url';
import returnVideo from '@/assets/transition/bonus-portal-reverse.mp4?url';

/** Change the background under the transition, once per entry/exit (not per spin). */
export function BonusBackground({ active, children, mediaReady = true }: { active: boolean; mediaReady?: boolean; children: (transitionComplete: boolean) => ReactNode }) {
  const { powerSaving } = usePreferences();
  useEffect(() => {
    if (!mediaReady) return;
    const controller = new AbortController();
    // Optional media never participates in the game's loading progress.
    const timer = window.setTimeout(() => {
      void (async () => {
        for (const url of powerSaving ? [portalVideo] : [bonusVideo, portalVideo, returnVideo]) {
          if (controller.signal.aborted) return;
          try {
            const response = await fetch(url, { signal: controller.signal, cache: 'force-cache' });
            if (response.ok) await response.blob();
          } catch { /* Playback retains its poster/error fallback. */ }
        }
      })();
    }, 500);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [mediaReady, powerSaving]);
  const skipReturn = powerSaving && !active;
  const [scene, setScene] = useState({ target: active, visible: active, moving: false, id: 0 });
  if (scene.target !== active) {
    setScene({ ...scene, target: active, visible: skipReturn ? active : scene.visible, moving: !skipReturn, id: scene.id + 1 });
  }
  if (skipReturn && scene.target === active && scene.moving) {
    setScene({ ...scene, visible: active, moving: false });
  }
  const id = scene.id;
  return <>
    <AppBg bonus={scene.visible} mediaReady={mediaReady} />
    {children(!scene.moving && scene.target === active)}
    {mediaReady && scene.id > 0 && !skipReturn && <BonusTransition active={scene.moving} entering={scene.target} transitionId={id}
      onCovered={() => setScene(current => current.id === id ? { ...current, visible: current.target } : current)}
      onComplete={() => setScene(current => current.id === id ? { ...current, visible: current.target, moving: false } : current)}
    />}
  </>;
}
