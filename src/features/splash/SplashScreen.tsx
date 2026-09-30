import './SplashScreen.css';

import splashBgUrl from '@/assets/splash screen/bg.webp';
import splashLineUrl from '@/assets/splash screen/line.webp';
import splashLogoUrl from '@/assets/splash screen/logo_pigoo.webp';

export interface SplashScreenProps {
  progress: number;
  visible: boolean;
}

export function SplashScreen({ progress, visible }: SplashScreenProps) {
  const clampedProgress = Math.min(1, Math.max(0, progress));

  return (
    <div
      className={`splash-screen${visible ? '' : ' splash-screen--hidden'}`}
      aria-hidden={!visible}
      aria-busy={visible}
      role="status"
      aria-label="Loading game"
    >
      <img className="splash-screen__bg" src={splashBgUrl} alt="" draggable={false} />

      <div className="splash-screen__content">
        <img
          className="splash-screen__logo"
          src={splashLogoUrl}
          alt="Pigoo Games"
          draggable={false}
        />

        <div className="splash-screen__progress" aria-hidden="true">
          <img
            className="splash-screen__progress-track"
            src={splashLineUrl}
            alt=""
            draggable={false}
          />
          <div
            className="splash-screen__progress-fill"
            style={{ transform: `scaleX(${clampedProgress})` }}
          >
            <img src={splashLineUrl} alt="" draggable={false} />
          </div>
        </div>
      </div>

    </div>
  );
}
