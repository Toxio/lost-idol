import { useState, type ReactNode } from 'react';
import { AppBg } from './AppBg';
import { BonusTransition } from './BonusTransition';

/** Change the background under the transition, once per entry/exit (not per spin). */
export function BonusBackground({ active, children }: { active: boolean; children: (transitionComplete: boolean) => ReactNode }) {
  const [scene, setScene] = useState({ target: active, visible: active, moving: false, id: 0 });
  if (scene.target !== active) {
    setScene({ ...scene, target: active, moving: true, id: scene.id + 1 });
  }
  const id = scene.id;
  return <>
    <AppBg bonus={scene.visible} />
    {children(!scene.moving && scene.target === active)}
    {scene.id > 0 && <BonusTransition active={scene.moving} entering={scene.target} transitionId={id}
      onCovered={() => setScene(current => current.id === id ? { ...current, visible: current.target } : current)}
      onComplete={() => setScene(current => current.id === id ? { ...current, visible: current.target, moving: false } : current)}
    />}
  </>;
}
