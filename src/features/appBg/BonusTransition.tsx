import { Application } from 'pixi.js';
import { Spine } from '@esotericsoftware/spine-pixi-v8';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ensureTransitionLoaded, TRANSITION_ATLAS, TRANSITION_SKELETON } from '@/animation/transitionSpine';
import { getRendererResolution } from '@/utils/rendererResolution';
import './BonusTransition.css';

type Props = { active: boolean; transitionId: number; onCovered: () => void; onComplete: () => void };

/** Keep the transition renderer independent from the background and reels. */
export function BonusTransition(props: Props) {
  const container = useRef<HTMLDivElement>(null);
  const callbacks = useRef(props);
  const restart = useRef<(() => void) | null>(null);
  useEffect(() => { callbacks.current = props; }, [props]);
  useEffect(() => {
    if (props.active) restart.current?.();
  }, [props.active, props.transitionId]);
  useEffect(() => {
    if (!props.active) return;
    const previous = document.activeElement as HTMLElement | null;
    container.current?.focus();
    const blockKeys = (event: KeyboardEvent) => { event.preventDefault(); event.stopImmediatePropagation(); };
    document.addEventListener('keydown', blockKeys, true);
    const fallback = window.setTimeout(() => {
      callbacks.current.onCovered();
      callbacks.current.onComplete();
    }, 10000);
    return () => {
      window.clearTimeout(fallback);
      document.removeEventListener('keydown', blockKeys, true);
      if (previous?.isConnected) previous.focus();
    };
  }, [props.active, props.transitionId]);
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    const app = new Application();
    let ready = false;
    let cancelled = false;
    let covered = false;
    let completed = false;
    let elapsed = 0;
    let orientation = '';
    let spine: Spine | null = null;
    const finish = () => {
      if (cancelled || completed) return;
      completed = true;
      if (ready) app.stop();
      if (!covered) callbacks.current.onCovered();
      callbacks.current.onComplete();
    };
    const layout = () => {
      if (!ready) return;
      app.renderer.resize(host.clientWidth, host.clientHeight);
      if (!spine) return;
      const portrait = app.screen.height > app.screen.width;
      const clip = portrait ? 'port' : 'land';
      if (clip !== orientation) {
        orientation = clip;
        const entry = spine.state.setAnimation(0, clip, false);
        entry.trackTime = elapsed;
        spine.update(0);
      }
      spine.scale.set(Math.max(app.screen.width / (portrait ? 1400 : 2500),
                               app.screen.height / (portrait ? 2500 : 1400)));
      spine.position.set(app.screen.width / 2, app.screen.height / 2);
    };
    const tick = () => {
      if (!spine || completed) return;
      const delta = app.ticker.deltaMS / 1000;
      if (elapsed + delta >= 2) { finish(); return; }
      elapsed += delta;
      spine.update(delta);
      if (!covered && elapsed >= 0.85) {
        covered = true;
        host.dataset.phase = 'covered';
        callbacks.current.onCovered();
      }
    };
    const resize = new ResizeObserver(layout);
    resize.observe(host);
    restart.current = () => {
      if (!spine) return;
      host.dataset.phase = 'entering';
      elapsed = 0;
      covered = false;
      completed = false;
      orientation = '';
      spine.skeleton.setToSetupPose();
      layout();
      app.start();
    };
    void (async () => {
      await app.init({ autoStart: false, sharedTicker: false, backgroundAlpha: 0, antialias: true, resolution: getRendererResolution() });
      ready = true;
      if (cancelled) { app.destroy({ removeView: true, releaseGlobalResources: false }, { children: true }); return; }
      host.appendChild(app.canvas);
      await ensureTransitionLoaded();
      if (cancelled) return;
      spine = Spine.from({ skeleton: TRANSITION_SKELETON, atlas: TRANSITION_ATLAS });
      spine.autoUpdate = false;
      layout();
      app.stage.addChild(spine);
      app.ticker.add(tick);
      if (callbacks.current.active) restart.current?.();
      else app.stop();
    })().catch(finish);
    return () => {
      cancelled = true;
      restart.current = null;
      resize.disconnect();
      if (ready) {
        app.stop();
        app.ticker.remove(tick);
        spine?.destroy({ children: true });
        app.destroy({ removeView: true, releaseGlobalResources: false }, { children: true });
      }
    };
  }, []);
  return createPortal(<div ref={container} className={`bonus-transition${props.active ? '' : ' bonus-transition--hidden'}`} tabIndex={-1} />, document.body);
}
