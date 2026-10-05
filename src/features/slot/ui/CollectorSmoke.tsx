import { useEffect, useState, type CSSProperties } from 'react';
import sheet from '@/assets/reel/collector-smoke.webp';

export function CollectorSmoke({ style, delay = 0 }: { style: CSSProperties; delay?: number }) {
  const [frame, setFrame] = useState(-1);
  useEffect(() => {
    let request = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const elapsed = now - start;
      setFrame(elapsed < 0 || elapsed >= 1200 ? -1 : Math.min(15, Math.floor(elapsed / 75)));
      if (elapsed < 1200) request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(request);
  }, [delay]);
  return <div aria-hidden="true" className="smp-collector-smoke" style={{ ...style,
    opacity: frame < 0 ? 0 : 1,
    backgroundImage: `url(${sheet})`,
    backgroundPosition: `${(Math.max(0, frame) % 4) * 100 / 3}% ${Math.floor(Math.max(0, frame) / 4) * 100 / 3}%`,
  }} />;
}
