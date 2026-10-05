import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { t } from '@/utils/i18n';
import { play } from '@/audio/soundManager';
import { SPIN_OPTIONS, type AutoplayStartOptions } from '../modals/autoplaySettings';
import './AutoplayMenu.css';

interface Props {
  id: string;
  anchor: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onStart: (options: AutoplayStartOptions) => void;
}

export function AutoplayMenu({ id, anchor, onClose, onStart }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 8, top: 8 });
  useLayoutEffect(() => {
    const button = anchor.current;
    const menu = panel.current;
    if (!button || !menu) return;
    const bounds = button.getBoundingClientRect();
    setPosition({
      left: Math.max(8, Math.min(bounds.right - menu.offsetWidth, window.innerWidth - menu.offsetWidth - 8)),
      top: Math.max(8, bounds.top - menu.offsetHeight - 10),
    });
    menu.querySelector<HTMLButtonElement>('button')?.focus();
    const outside = (event: PointerEvent) => {
      if (!menu.contains(event.target as Node) && !button.contains(event.target as Node)) onClose();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onClose(); button.focus(); }
    };
    const focus = (event: FocusEvent) => {
      if (!menu.contains(event.target as Node) && !button.contains(event.target as Node)) onClose();
    };
    window.addEventListener('resize', onClose);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', key);
    document.addEventListener('focusin', focus);
    return () => {
      window.removeEventListener('resize', onClose);
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', key);
      document.removeEventListener('focusin', focus);
    };
  }, [anchor, onClose]);

  return createPortal(<div ref={panel} id={id} className="smp-autoplay-menu" role="group" aria-labelledby={`${id}-title`} style={position}>
    <span id={`${id}-title`} className="smp-autoplay-menu__title">{t('autospin_title')}</span>
    <div className="smp-autoplay-menu__counts">
      {SPIN_OPTIONS.map(count => <button key={count} type="button" aria-label={`${t('autospin_start')}: ${count}`} onClick={() => {
        play('ui_button');
        onClose();
        anchor.current?.focus();
        onStart({ count, stopAfterWin: false, stopOnWinAmount: null, stopOnLossAmount: null });
      }}>{count}</button>)}
    </div>
  </div>, document.body);
}
