import { useLayoutEffect, useRef } from 'react';
import sheet from '@/assets/symbols/lost-idol/gold-satchel/sheet-v2.webp';
import animation from '@/assets/symbols/lost-idol/gold-satchel/symbol-fixed-body.json';

export const TREASURY_CHEST_OPEN_MS = 560;

const attachments = animation.skins[0].attachments.symbol;
const pose = (index: number) => {
  const frame = attachments[`frame${index}` as keyof typeof attachments];
  return {
    backgroundPosition: `${(index % 4) * 100 / 3}% ${Math.floor(index / 4) * 100 / 3}%`,
    transform: `translate(${frame.x / 256 * 100}%, ${-frame.y / 256 * 100}%)`,
  };
};
// Use the same clipping boundary and frame offsets as the reel's Spine animation.
const clip = (vertices: number[]) => `polygon(${Array.from({ length: vertices.length / 2 }, (_, i) =>
  `${(vertices[i * 2] + 128) / 256 * 100}% ${(128 - vertices[i * 2 + 1]) / 256 * 100}%`).join(',')})`;
const lidClip = clip(animation.skins[0].attachments.lidMask.clip.vertices);
const bodyClip = clip(animation.skins[0].attachments.bodyMask.clip.vertices);

export function TreasuryChestArt({ open, opening }: { open: boolean; opening: boolean }) {
  const lid = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (!opening || !lid.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Start with the first opening pose; step per frame, not across the whole animation.
    const playback = lid.current.animate(Array.from({ length: 9 }, (_, i) => ({ ...pose(i + 2), offset: i / 8, easing: 'steps(1, end)' })),
      { duration: TREASURY_CHEST_OPEN_MS, easing: 'linear', fill: 'forwards' });
    return () => playback.cancel();
  }, [opening]);
  return <span className="treasury-chest-art" aria-hidden="true">
    <span className="treasury-chest-clip" style={{ clipPath: lidClip }}>
      <span ref={lid} className="treasury-chest-layer" style={{ backgroundImage: `url(${sheet})`, ...pose(open ? 10 : 0) }} />
    </span>
    <span className="treasury-chest-clip" style={{ clipPath: bodyClip }}>
      <span className="treasury-chest-layer" style={{ backgroundImage: `url(${sheet})` }} />
    </span>
  </span>;
}
