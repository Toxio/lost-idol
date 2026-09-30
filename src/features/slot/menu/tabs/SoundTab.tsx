import { useSoundSettings } from '@/hooks/useSoundSettings';
import { t } from '@/utils/i18n';
import './SoundTab.css';

function formatVolumePercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function SoundTab() {
  const { muted, musicVolume, effectsVolume, setMusicVolume, setEffectsVolume, setMuted } =
    useSoundSettings();

  return (
    <div className="smp-sound">
      {muted && (
        <button
          type="button"
          className="smp-sound-muted-banner"
          onClick={() => setMuted(false)}
          aria-label={t('sound_muted_unmute')}
        >
          {t('sound_muted_banner')}
        </button>
      )}

      <div className="smp-sound-row">
        <label className="smp-sound-label" htmlFor="smp-sound-music">
          {t('sound_music_label')}
        </label>
        <div className="smp-sound-control">
          <input
            id="smp-sound-music"
            type="range"
            className="smp-sound-slider"
            min={0}
            max={100}
            step={1}
            value={Math.round(musicVolume * 100)}
            onChange={(e) => setMusicVolume(Number(e.target.value) / 100)}
            disabled={muted}
            aria-valuetext={`${t('sound_music_label')} ${formatVolumePercent(musicVolume)}`}
          />
          <span className="smp-sound-value">{formatVolumePercent(musicVolume)}</span>
        </div>
      </div>

      <div className="smp-sound-row">
        <label className="smp-sound-label" htmlFor="smp-sound-effects">
          {t('sound_effects_label')}
        </label>
        <div className="smp-sound-control">
          <input
            id="smp-sound-effects"
            type="range"
            className="smp-sound-slider"
            min={0}
            max={100}
            step={1}
            value={Math.round(effectsVolume * 100)}
            onChange={(e) => setEffectsVolume(Number(e.target.value) / 100)}
            disabled={muted}
            aria-valuetext={`${t('sound_effects_label')} ${formatVolumePercent(effectsVolume)}`}
          />
          <span className="smp-sound-value">{formatVolumePercent(effectsVolume)}</span>
        </div>
      </div>
    </div>
  );
}
