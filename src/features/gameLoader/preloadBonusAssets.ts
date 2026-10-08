import { preloadBonusMusic } from '@/audio/soundManager';
import treasuryWall from '@/assets/treasury/temple-wall-selected.webp';

let pending: Promise<void> | null = null;

/** Optional resources never block the primary loading screen. */
export function preloadBonusAssets(): Promise<void> {
  if (pending) return pending;
  preloadBonusMusic();
  pending = Promise.all([
    import('../slot/treasury/TreasuryFeature'),
    new Promise<void>(resolve => {
      const image = new Image();
      image.onload = () => resolve();
      image.onerror = () => resolve();
      image.src = treasuryWall;
    }),
  ]).then(() => undefined).catch(() => { pending = null; });
  return pending;
}
