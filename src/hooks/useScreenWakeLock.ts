import { useEffect } from 'react';

/**
 * Keeps the screen awake while `active` (autoplay). No-op if the API is missing
 * or the OS denies the lock. Re-requests after the tab becomes visible again —
 * the sentinel is released automatically when the page is hidden.
 */
export function useScreenWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return;
    }

    let cancelled = false;
    let sentinel: WakeLockSentinel | null = null;

    const request = async () => {
      if (cancelled || sentinel || document.visibilityState !== 'visible') return;
      try {
        const next = await navigator.wakeLock.request('screen');
        if (cancelled || document.visibilityState !== 'visible') {
          void next.release();
          return;
        }
        next.addEventListener('release', () => {
          if (sentinel === next) sentinel = null;
        });
        sentinel = next;
      } catch {
        /* NotAllowedError / battery saver / insecure context — play without lock */
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') void request();
    };

    void request();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      void sentinel?.release();
      sentinel = null;
    };
  }, [active]);
}
