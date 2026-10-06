import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { t } from '@/utils/i18n';
import { play } from '@/audio/soundManager';
import { CurrencyAmount } from '@/components/CurrencyAmount';
import './BetMenu.css';
import './AutoplayMenu.css';

interface Props {
  id: string;
  anchor: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  quickBets: number[];
  currentBet: number;
  costMultiplier?: number;
  currency: string;
  precision: number;
  onSelect: (amount: number) => void;
}

export function BetMenu({ id, anchor, onClose, quickBets, currentBet, currency, precision, onSelect, costMultiplier = 1 }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 8, top: 8 });
  useLayoutEffect(() => {
    const button = anchor.current;
    const menu = panel.current;
    if (!button || !menu) return;
    const bounds = button.getBoundingClientRect();
    const above = bounds.top - 18;
    const below = window.innerHeight - bounds.bottom - 18;
    const placeAbove = above >= below;
    menu.style.maxHeight = `${Math.max(80, placeAbove ? above : below)}px`;
    setPosition({
      left: Math.max(8, Math.min(bounds.right - menu.offsetWidth, window.innerWidth - menu.offsetWidth - 8)),
      top: placeAbove ? Math.max(8, bounds.top - menu.offsetHeight - 10) : bounds.bottom + 10,
    });
    const selected = menu.querySelector<HTMLButtonElement>('[aria-pressed="true"]') ?? menu.querySelector<HTMLButtonElement>('button');
    selected?.focus({ preventScroll: true });
    selected?.scrollIntoView({ block: 'nearest' });
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

  return createPortal(<div ref={panel} id={id} className="smp-autoplay-menu smp-bet-menu" role="group" aria-labelledby={`${id}-title`} style={position}>
    <span id={`${id}-title`} className="smp-autoplay-menu__title">{t('bet_title')}</span>
    <div className="smp-autoplay-menu__counts smp-bet-menu__options">
      {quickBets.map(amount => <button key={amount} type="button" aria-pressed={amount === currentBet} onClick={() => {
        play('ui_button');
        onSelect(amount);
        onClose();
        anchor.current?.focus();
      }}><CurrencyAmount value={amount * costMultiplier} currency={currency} precision={Number.isInteger(amount * costMultiplier) ? 0 : precision + (costMultiplier !== 1 ? 1 : 0)} fitToWidth /></button>)}
    </div>
  </div>, document.body);
}
