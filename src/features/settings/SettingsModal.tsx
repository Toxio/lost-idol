import { useEffect } from 'react';
import { Modal } from '@/components/modal';
import { locale } from '@/utils/i18n';
import { play } from '@/audio/soundManager';
import { setPreference, usePreferences } from './preferences';
import './Settings.css';
export function SettingsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);
  const settings = usePreferences();
  const ru = locale === 'ru';
  return <Modal title={ru ? 'Настройки' : 'Settings'} onClose={onClose}>
    <div className="game-settings">
      {([
        ['powerSaving', ru ? 'Энергосбережение' : 'Power saving', ru ? 'Статичный фон вместо видео — меньше расход батареи.' : 'Use a still background to reduce battery usage.'],
        ['skipWelcome', ru ? 'Пропускать заставку' : 'Skip intro', ru ? 'Открывать игру сразу после загрузки.' : 'Go straight to the game after loading.'],
      ] as const).map(([key, title, description]) => <button key={key} type="button" className="game-setting" role="switch" aria-checked={settings[key]} onClick={() => { play('ui_button'); setPreference(key, !settings[key]); }}>
        <span><strong>{title}</strong><small>{description}</small></span><span className="game-setting-switch" aria-hidden="true"><i /></span>
      </button>)}
    </div>
  </Modal>;
}
