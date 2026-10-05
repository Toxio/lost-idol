import multiplierStone from '@/assets/symbols/lost-idol/multiplier-stone/sheet.webp';
import collectorSmoke from '@/assets/reel/collector-smoke.webp';
import {
  glassImg,
  gobletImg,
  heelsImg,
  lipsImg,
  lipstickImg,
  parfumeImg,
  roseImg,
  scatterImg,
  sevenImg,
  starImg,
  wildImg,
} from '@/assets/symbols/images';

const ALL_HTML_IMAGES: string[] = [
  collectorSmoke,
  multiplierStone,
  glassImg,
  gobletImg,
  heelsImg,
  lipsImg,
  lipstickImg,
  parfumeImg,
  roseImg,
  scatterImg,
  sevenImg,
  starImg,
  wildImg,
];

let cached: Promise<void> | null = null;

/** Preloads all HTML <img> assets into the browser cache. Safe to call multiple times. */
export function preloadHtmlImages(): Promise<void> {
  if (cached) return cached;
  cached = Promise.all(
    ALL_HTML_IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        }),
    ),
  ).then(() => undefined);
  return cached;
}
