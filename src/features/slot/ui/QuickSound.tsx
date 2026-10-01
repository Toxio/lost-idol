import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { useSoundSettings } from '@/hooks/useSoundSettings';

export function QuickSound() {
  const { muted, setMuted, musicVolume, effectsVolume, setMusicVolume, setEffectsVolume } = useSoundSettings();
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const lastVolume = useRef(0.5);
  const id = useId();
  const volume = Math.max(musicVolume, effectsVolume);
  const silent = muted || volume === 0;
  const changeVolume = (value: number) => {
    if (value > 0) lastVolume.current = value;
    setMusicVolume(value);
    setEffectsVolume(value);
    setMuted(value === 0);
  };
  const toggle = () => {
    if (silent) changeVolume(volume || lastVolume.current);
    else setMuted(true);
  };

  useEffect(() => {
    if (!position) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panel.current?.contains(target) && !trigger.current?.contains(target)) setPosition(null);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setPosition(null); trigger.current?.focus(); }
    };
    const close = () => setPosition(null);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', key);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', key);
      window.removeEventListener('resize', close);
    };
  }, [position]);

  return <>
    <button ref={trigger} type="button" className="smp-bottom-sound-btn smp-quick-sound"
      aria-label={position ? 'Close sound controls' : 'Open sound controls'} aria-pressed={silent}
      aria-expanded={Boolean(position)} aria-controls={position ? id : undefined}
      onClick={() => {
        if (position) {
          setPosition(null);
          return;
        }
        toggle();
        const bounds = trigger.current!.getBoundingClientRect();
        const width = Math.min(280, window.innerWidth - 16);
        setPosition({ left: Math.max(8, Math.min(bounds.x + bounds.width / 2 - width / 2, window.innerWidth - width - 8)), top: Math.max(8, bounds.top - 68) });
      }}>
      {silent ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
    </button>
    {position && createPortal(<div ref={panel} id={id} role="group" aria-label="Sound volume"
      className="smp-volume-popover" data-muted={silent} style={position}>
      <button type="button" onClick={toggle} aria-label={silent ? 'Unmute sound' : 'Mute sound'} aria-pressed={silent}>
        {silent ? <VolumeX size={22} /> : <Volume2 size={22} />}
      </button>
      <input type="range" min="0" max="100" step="1" aria-label="Master volume"
        value={Math.round(volume * 100)} onChange={event => changeVolume(Number(event.target.value) / 100)} />
      <output>{Math.round(volume * 100)}</output>
    </div>, document.body)}
  </>;
}
