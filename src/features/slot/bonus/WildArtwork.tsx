import { useId } from 'react';
import sheet from '@/assets/symbols/lost-idol/monkey/monkey-wait-v4.webp';

/** Chest-beating pose from the actual game animation, shared by feature previews. */
export function WildArtwork({ className }: { className?: string }) {
  const clipId = useId();
  return <svg className={className} viewBox="768 0 256 256" role="img" aria-label="Wild" style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }}>
    <defs><clipPath id={clipId}><rect x="768" y="0" width="256" height="256" /></clipPath></defs>
    <image href={sheet} width="1024" height="1024" clipPath={`url(#${clipId})`} />
  </svg>;
}
