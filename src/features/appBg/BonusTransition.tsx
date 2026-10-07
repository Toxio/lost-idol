import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import portalUrl from '@/assets/transition/bonus-portal.webp';
import portalVideoUrl from '@/assets/transition/bonus-portal.mp4';
import portalReverseUrl from '@/assets/transition/bonus-portal-reverse.mp4';
import portalReversePoster from '@/assets/transition/bonus-portal-reverse.webp';
import { continueBonusDoorSound, play, stop } from '@/audio/soundManager';
import './BonusTransition.css';

type Props = { active: boolean; entering: boolean; transitionId: number; onCovered: () => void; onComplete: () => void };

export function BonusTransition(props: Props) {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const callbacks = useRef(props);
  const finishPlayback = useRef<() => void>(() => {});
  useEffect(() => { callbacks.current = props; }, [props]);
  useEffect(() => {
    if (!props.active) return;
    continueBonusDoorSound();
    const previous = document.activeElement as HTMLElement | null;
    container.current?.focus();
    const blockKeys = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    document.addEventListener('keydown', blockKeys, true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const playVideo = !reduced;
    let complete = false;
    let covered = false;
    const cover = () => {
      if (covered || complete) return;
      covered = true;
      callbacks.current.onCovered();
    };
    const finish = () => {
      if (complete) return;
      cover();
      complete = true;
      callbacks.current.onComplete();
    };
    finishPlayback.current = finish;
    const coverTimer = window.setTimeout(cover, 150);
    // A media failure must never block access to the bonus intro.
    const fallbackTimer = window.setTimeout(finish, playVideo ? 15000 : 450);
    const media = video.current;
    let shinePlayed = false;
    const playPortalShine = () => {
      // Follow video time so buffering cannot trigger the accent early.
      if (!props.entering || complete || shinePlayed || !media || media.currentTime < 3.3) return;
      shinePlayed = true;
      stop('bonus_portal_shine');
      play('bonus_portal_shine');
    };
    media?.addEventListener('timeupdate', playPortalShine);
    if (playVideo && media) {
      media.currentTime = 0;
      void media.play().catch(finish);
    }
    return () => {
      complete = true;
      finishPlayback.current = () => {};
      media?.removeEventListener('timeupdate', playPortalShine);
      media?.pause();
      window.clearTimeout(coverTimer);
      window.clearTimeout(fallbackTimer);
      document.removeEventListener('keydown', blockKeys, true);
      if (previous?.isConnected) previous.focus();
    };
  }, [props.active, props.entering, props.transitionId]);

  return createPortal(
    <div ref={container} className={`bonus-transition${props.active ? '' : ' bonus-transition--hidden'}`} tabIndex={-1} aria-label="Bonus transition">
      <div key={props.transitionId} className={`bonus-transition__scene${props.entering ? '' : ' bonus-transition__scene--return'}`}>
        <video ref={video} className="bonus-transition__portal" src={props.entering ? portalVideoUrl : portalReverseUrl} poster={props.entering ? portalUrl : portalReversePoster}
          muted playsInline preload="auto" onEnded={() => finishPlayback.current()} onError={() => finishPlayback.current()} />
      </div>
    </div>, document.body,
  );
}
