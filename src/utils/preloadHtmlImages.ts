import autoSpinImg from '@/assets/buttons/auto_spin.webp';
import balanceImg from '@/assets/buttons/balance.webp';
import betImg from '@/assets/buttons/bet.webp';
import betBackImg from '@/assets/buttons/bet/bet_back.webp';
import menuImg from '@/assets/buttons/menu.webp';
import spinImg from '@/assets/buttons/spin.webp';
import spinArrowsImg from '@/assets/buttons/spin_arrows.webp';
import spinStopImg from '@/assets/buttons/spin_stop.webp';
import turboImg from '@/assets/buttons/turbo.webp';
import turbo1Img from '@/assets/buttons/turbo1.webp';
import turbo2Img from '@/assets/buttons/turbo2.webp';
import logoLandImg from '@/assets/logo/logo_land.webp';
import logoPortImg from '@/assets/logo/logo_port.webp';
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
  autoSpinImg,
  balanceImg,
  betImg,
  betBackImg,
  menuImg,
  spinImg,
  spinArrowsImg,
  spinStopImg,
  turboImg,
  turbo1Img,
  turbo2Img,
  logoLandImg,
  logoPortImg,
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
