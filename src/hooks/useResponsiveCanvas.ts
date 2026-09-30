import type { Application as PixiApplication } from 'pixi.js';
import { type RefObject, useEffect } from 'react';

interface UseResponsiveCanvasOptions {
  containerRef: RefObject<HTMLElement | null>;
  appRef: RefObject<PixiApplication | null>;
}

const IOS_ROTATION_SETTLE_MS = 300;

/**
 * Keeps the Pixi renderer size in sync with its container.
 * Reacts to container resize, window `orientationchange`, and `screen.orientation` change —
 * iOS Safari delays viewport updates after rotation, so we re-sync once it settles.
 */
export function useResponsiveCanvas({ containerRef, appRef }: UseResponsiveCanvasOptions) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncRendererSize = () => {
      const width = Math.round(container.clientWidth);
      const height = Math.round(container.clientHeight);
      if (width <= 0 || height <= 0) return;
      appRef.current?.renderer.resize(width, height);
    };

    const observer = new ResizeObserver(syncRendererSize);
    observer.observe(container);
    syncRendererSize();

    let orientationTimer: ReturnType<typeof setTimeout>;
    const onOrientationChange = () => {
      clearTimeout(orientationTimer);
      orientationTimer = setTimeout(syncRendererSize, IOS_ROTATION_SETTLE_MS);
    };
    window.addEventListener('orientationchange', onOrientationChange);
    screen.orientation?.addEventListener('change', onOrientationChange);

    return () => {
      observer.disconnect();
      clearTimeout(orientationTimer);
      window.removeEventListener('orientationchange', onOrientationChange);
      screen.orientation?.removeEventListener('change', onOrientationChange);
    };
  }, [containerRef, appRef]);
}
