import { useEffect, useRef, useState } from 'react';

import landscapePoster from '@/assets/background/landscape.webp';
import landscapeWebm from '@/assets/background/landscape-loop.webm?url';
import landscapeMp4 from '@/assets/background/landscape-loop.mp4?url';
import portraitPoster from '@/assets/background/portrait.webp';
import portraitWebm from '@/assets/background/portrait.webm?url';
import portraitMp4 from '@/assets/background/portrait.mp4?url';

import bonusVideo from '@/assets/background/bonus.mp4?url';
import bonusDesktopPoster from '@/assets/background/bonus-desktop.webp';
import bonusMobilePoster from '@/assets/background/bonus-mobile.webp';

const PORTRAIT_QUERY = '(orientation: portrait)';
const backgrounds = {
  landscape: { poster: landscapePoster, webm: landscapeWebm, mp4: landscapeMp4 },
  portrait: { poster: portraitPoster, webm: portraitWebm, mp4: portraitMp4 },
};

export function AppBg({ bonus = false }: { bonus?: boolean }) {
  const [portrait, setPortrait] = useState(() => window.matchMedia(PORTRAIT_QUERY).matches);
  const videoRef = useRef<HTMLVideoElement>(null);
  const orientation = portrait ? 'portrait' : 'landscape';
  const background = backgrounds[orientation];
  const poster = bonus ? (portrait ? bonusMobilePoster : bonusDesktopPoster) : background.poster;

  useEffect(() => {
    const media = window.matchMedia(PORTRAIT_QUERY);
    const update = () => setPortrait(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const resume = () => {
      if (!document.hidden) void video.play().catch(() => undefined);
    };
    const updateVisibility = () => {
      if (document.hidden) video.pause();
      else resume();
    };
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    // Retry when the user interacts if the browser initially blocks autoplay.
    document.addEventListener('pointerdown', resume);
    return () => {
      document.removeEventListener('visibilitychange', updateVisibility);
      document.removeEventListener('pointerdown', resume);
      video.pause();
    };
  }, [orientation, bonus]);

  return (
    <div className="app-bg" aria-hidden="true">
      <img className="app-bg__poster" src={poster} alt="" />
      <video
        key={`${bonus ? "bonus" : "base"}-${orientation}`}
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
      >
        {!bonus && <source src={background.webm} type="video/webm" />}
        <source src={bonus ? bonusVideo : background.mp4} type="video/mp4" />
      </video>
    </div>
  );
}
