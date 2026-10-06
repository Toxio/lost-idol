import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Music2, Volume2, VolumeX } from 'lucide-react';
import { t } from '@/utils/i18n';
import { useSoundSettings } from '@/hooks/useSoundSettings';

export function QuickSound() {
  const { muted, setMuted, musicVolume, effectsVolume, setMusicVolume, setEffectsVolume } = useSoundSettings();
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const lastVolumes = useRef({ music: 0.5, effects: 0.5 });
  const id = useId();
  const silent = muted || (musicVolume === 0 && effectsVolume === 0);
  const changeVolume = (kind: 'music' | 'effects', value: number) => {
    if (value > 0) lastVolumes.current[kind] = value;
    (kind === 'music' ? setMusicVolume : setEffectsVolume)(value);
    if (value > 0 && muted) setMuted(false);
  };

  const toggleSound = () => {
    if (!silent) {
      setMuted(true);
      return;
    }
    if (musicVolume === 0 && effectsVolume === 0) {
      setMusicVolume(lastVolumes.current.music);
      setEffectsVolume(lastVolumes.current.effects);
    }
    setMuted(false);
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
        toggleSound();
        const bounds = trigger.current!.getBoundingClientRect();
        const width = Math.min(280, window.innerWidth - 16);
        setPosition({ left: Math.max(8, Math.min(bounds.x + bounds.width / 2 - width / 2, window.innerWidth - width - 8)), top: Math.max(8, bounds.top - 116) });
      }}>
      {silent ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
    </button>
    {position && createPortal(<div ref={panel} id={id} role="group" aria-label="Sound volume"
      className="smp-volume-popover" data-muted={silent} style={position}>
      {(['music', 'effects'] as const).map(kind => {
        const value = kind === 'music' ? musicVolume : effectsVolume;
        const label = t(kind === 'music' ? 'sound_music_label' : 'sound_effects_label');
        const off = muted || value === 0;
        return <div className="smp-volume-row" key={kind} data-muted={off}>
          <button type="button" title={label} aria-label={label} aria-pressed={!off}
            onClick={() => changeVolume(kind, off ? value || lastVolumes.current[kind] : 0)}>
            {kind === 'music' ? <Music2 size={22} aria-hidden="true" /> : off ? <VolumeX size={22} aria-hidden="true" /> : <Volume2 size={22} aria-hidden="true" />}
          </button>
          <input type="range" min="0" max="100" step="1" aria-label={label}
            aria-valuetext={`${Math.round(value * 100)}%`}
            value={Math.round(value * 100)} onChange={event => changeVolume(kind, Number(event.target.value) / 100)} />
          <output>{Math.round(value * 100)}</output>
        </div>;
      })}
    </div>, document.body)}
  </>;
}
