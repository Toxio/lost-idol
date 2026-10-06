import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { t } from '@/utils/i18n';
import { play } from '@/audio/soundManager';
import { type AutoplayStartOptions } from '../modals/autoplaySettings';
import './AutoplayMenu.css';

interface Props {
  id: string;
  anchor: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onStart: (options: AutoplayStartOptions) => void;
}

export function AutoplayMenu({ id, anchor, onClose, onStart }: Props) {
  const [count, setCount] = useState(50);
  const [rules, setRules] = useState(false);
  const [stopFree, setStopFree] = useState(false);
  const [stopTreasury, setStopTreasury] = useState(false);
  const [loss, setLoss] = useState<number | null>(null);
  const [win, setWin] = useState<number | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 8, top: 8 });
  useLayoutEffect(() => {
    const button = anchor.current;
    const menu = panel.current;
    if (!button || !menu) return;
    const bounds = button.getBoundingClientRect();
    setPosition({ left: Math.max(8, Math.min(bounds.right - menu.offsetWidth, window.innerWidth - menu.offsetWidth - 8)), top: Math.max(8, bounds.top - menu.offsetHeight - 10) });
  }, [anchor, rules]);
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

  const toggle = (label: string, value: boolean, change: (v: boolean) => void) => <button type="button" className="smp-autoplay-menu__bonus" role="switch" aria-checked={value} onClick={() => { play('ui_button'); change(!value); }}><span>{label}</span><span className="smp-autoplay-menu__toggle" aria-hidden="true" /></button>;
  const limits = (label: string, values: number[], selected: number | null, change: (v: number | null) => void) => <fieldset className="smp-autoplay-menu__limits"><legend>{label}</legend><div className="smp-autoplay-menu__counts">{[null, ...values].map(value => <button type="button" key={value ?? 'off'} aria-pressed={selected === value} onClick={() => change(value)}>{value === null ? t('autospin_off') : `×${value}`}</button>)}</div></fieldset>;
  return createPortal(<div ref={panel} id={id} className="smp-autoplay-menu" role="group" aria-labelledby={`${id}-title`} style={position}>
    <span id={`${id}-title`} className="smp-autoplay-menu__title">{t('autospin_title')}</span>
    <div className="smp-autoplay-menu__counts smp-autoplay-menu__rounds">
      {[10, 25, 50, 100, 250, 500, 1000, 0].map(value => <button key={value} type="button" aria-pressed={count === value} onClick={() => { play('ui_button'); setCount(value); }}>{value || '∞'}</button>)}
    </div>
    {toggle(t('autospin_rules'), rules, setRules)}
    {rules && <div>
      {limits(t('autospin_loss_limit'), [10, 25, 50, 100], loss, setLoss)}
      {limits(t('autospin_win_limit'), [50, 100, 500, 1000], win, setWin)}
      {toggle(t('autospin_stop_free'), stopFree, setStopFree)}
      {toggle(t('autospin_stop_treasury'), stopTreasury, setStopTreasury)}
    </div>}
    <button type="button" className="smp-autoplay-menu__start" onClick={() => {
      play('ui_button'); onClose(); anchor.current?.focus();
      onStart({ count, stopAfterWin: false, stopOnWinAmount: null, stopOnLossAmount: null,
        stopOnFreeSpins: rules && stopFree, stopOnTreasury: rules && stopTreasury,
        lossMultiplier: rules ? loss : null, winMultiplier: rules ? win : null });
    }}>{t('autospin_start')}</button>
  </div>, document.body);
}
