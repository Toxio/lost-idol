/** Cap retina scale: 2× is sharp enough for sprites/Spine; 3×+ mostly costs GPU fill. */
const MAX_RENDERER_RESOLUTION = 2;

export function getRendererResolution(): number {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, MAX_RENDERER_RESOLUTION);
}
