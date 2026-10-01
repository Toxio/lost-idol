import './SplashScreen.css';
import splashLogoUrl from '@/assets/splash screen/mad-horses.webp';

export interface SplashScreenProps {
  progress: number;
  visible: boolean;
}

export function SplashScreen({ progress, visible }: SplashScreenProps) {
  const percentage = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <div className={`splash-screen${visible ? '' : ' splash-screen--hidden'}`}
      aria-hidden={!visible} aria-busy={visible} aria-label="Loading game">
      <div className="splash-screen__content">
        <img className="splash-screen__logo" src={splashLogoUrl} alt="Mad Horses" draggable={false} />
        <div className="splash-screen__loading">
          <div className="splash-screen__caption"><span>{percentage}%</span></div>
          <div className="splash-screen__progress" role="progressbar" aria-label="Loading game"
            aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
            <div className="splash-screen__progress-fill" style={{ transform: `scaleX(${percentage / 100})` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
