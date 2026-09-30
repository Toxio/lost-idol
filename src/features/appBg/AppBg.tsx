import { useEffect, useRef, useState } from 'react';

import landscapePoster from '@/assets/background/landscape.webp';
import landscapeWebm from '@/assets/background/landscape.webm?url';
import landscapeMp4 from '@/assets/background/landscape.mp4?url';
import portraitPoster from '@/assets/background/portrait.webp';
import portraitWebm from '@/assets/background/portrait.webm?url';
import portraitMp4 from '@/assets/background/portrait.mp4?url';

const PORTRAIT_QUERY = '(orientation: portrait)';
const backgrounds = {
  landscape: { poster: landscapePoster, webm: landscapeWebm, mp4: landscapeMp4 },
  portrait: { poster: portraitPoster, webm: portraitWebm, mp4: portraitMp4 },
};

export function AppBg() {
  const [portrait, setPortrait] = useState(() => window.matchMedia(PORTRAIT_QUERY).matches);
  const videoRef = useRef<HTMLVideoElement>(null);
  const orientation = portrait ? 'portrait' : 'landscape';
  const background = backgrounds[orientation];

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
  }, [orientation]);

  return (
    <div className="app-bg" aria-hidden="true">
      <img className="app-bg__poster" src={background.poster} alt="" />
      <video
        key={orientation}
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={background.poster}
      >
        <source src={background.webm} type="video/webm" />
        <source src={background.mp4} type="video/mp4" />
      </video>
    </div>
  );
}
