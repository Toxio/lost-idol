import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/modal';
import { t } from '@/utils/i18n';
import { formatMoney } from '@/utils/currency';
import { indexOfBetLevel } from '@/api/rgs';
import { play as playSound } from '@/audio/soundManager';
import plans from '@/config/bonusBuys.json';
import wildImg from '@/assets/bonus-buy/leaping-monkey.webp';
import fs1 from '@/assets/bonus-buy/portal-5.webp';
import fs2 from '@/assets/bonus-buy/portal-10.webp';
import fs3 from '@/assets/bonus-buy/portal-15.webp';
import './BuyBonusModal.css';

const freeSpinArt: Record<number, string> = { 5: fs1, 10: fs2, 15: fs3 };

export function BuyBonusModal({ bet, bets, balance, currency, precision, onClose, onBuy, onBetChange }: {
  bet: number; bets: number[]; balance: number; currency: string; precision: number;
  onBetChange: (stake: number) => void;
  onClose: () => void; onBuy: (mode: string, stake: number) => void;
}) {
  const stake = bet;
  const [selected, setSelected] = useState(0);
  const submitted = useRef(false);
  const [confirmation, setConfirmation] = useState<{ mode: string; stake: number; cost: number; currency: string } | null>(null);
  const closeDialog = useCallback(() => {
    if (confirmation) setConfirmation(null);
    else onClose();
  }, [confirmation, onClose]);
  const plan = plans[selected];
  const total = Math.round(stake * plan.cost * 1e6) / 1e6;
  const affordable = total <= balance;
  const index = indexOfBetLevel(bets, stake);
  const money = (amount: number) => formatMoney(amount, currency, Number.isInteger(amount) ? 0 : precision);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>('.buy-bonus-modal [role="dialog"]');
    dialog?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeDialog(); }
      if (event.key !== 'Tab' || !dialog) return;
      const buttons = [...dialog.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
      const first = buttons[0], last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [closeDialog]);

  const step = (offset: number) => {
    const next = bets[index + offset];
    if (next === undefined) return;
    playSound('ui_button'); onBetChange(next);
  };

  if (confirmation) {
    const confirmedPlan = plans.find((item) => item.mode === confirmation.mode);
    const confirmedTotal = Math.round(confirmation.stake * confirmation.cost * 1e6) / 1e6;
    const valid = confirmedPlan && confirmedPlan.cost === confirmation.cost
      && confirmation.stake === stake && confirmation.currency === currency
      && bets.includes(confirmation.stake) && confirmedTotal <= balance;
    return <Modal title={t('buy_bonus_confirm')} className="buy-bonus-modal buy-bonus-confirmation" size="narrow" onClose={closeDialog}>
      <div className="buy-bonus-confirmation__summary">
        <strong>{confirmedPlan?.kind === 'wild_spin' ? t('wild_spin_title') : `${confirmedPlan?.spins} ${t('bonus_title')}`}</strong>
        <div>{t('bet_title')}: {money(confirmation.stake)} × {confirmation.cost}</div>
        <div>{t('buy_bonus_cost')}: <strong>{money(confirmedTotal)}</strong></div>
      </div>
      {!valid && <p role="status">{t('insufficient_title')}</p>}
      <div className="buy-bonus-confirmation__actions">
        <button type="button" className="smp-modal-action" onClick={closeDialog}>{t('autoplay_stopped_cancel')}</button>
        <button type="button" className="smp-modal-action" disabled={!valid} onClick={() => {
          if (!valid || submitted.current) return;
          submitted.current = true;
          playSound('ui_button');
          onBuy(confirmation.mode, confirmation.stake);
        }}>{t('buy_bonus_confirm')}</button>
      </div>
    </Modal>;
  }

  return <Modal title={t('buy_bonus_title')} className="buy-bonus-modal" onClose={onClose}>
    <div className="buy-bonus-content">
      <div className="buy-bonus-cards" role="group" aria-label={t('buy_bonus_title')}>
        {plans.map((item, i) => <button type="button" key={item.mode} className="buy-bonus-card"
          aria-pressed={i === selected} onClick={() => { playSound('ui_button'); setSelected(i); }}>
          <div className={`buy-bonus-art${item.kind === 'free_spins' ? ' buy-bonus-art--portal' : ''}`}>
            <img src={item.kind === 'free_spins' ? freeSpinArt[item.spins] : wildImg} alt="" draggable={false} />
          </div>
          <div className="buy-bonus-card-copy">
            <strong>{item.kind === 'wild_spin' ? 'WILD' : item.spins}</strong>
            <span>{t(item.kind === 'wild_spin' ? 'wild_spin_title' : 'bonus_title')}</span>
            <b>{money(stake * item.cost)}</b>
          </div>
        </button>)}
      </div>
      <p className="buy-bonus-rules">{t(plan.kind === 'wild_spin' ? 'wild_spin_rules' : 'buy_bonus_rules')}</p>
    </div>
    <div className="buy-bonus-stake">
      <button type="button" disabled={index <= 0} onClick={() => step(-1)} aria-label={`${t('bet_title')} −`}><span className="buy-bonus-step-icon" aria-hidden="true" /></button>
      <div><span>{t('bet_title')}</span><strong>{money(stake)}</strong></div>
      <button type="button" disabled={index >= bets.length - 1} onClick={() => step(1)} aria-label={`${t('bet_title')} +`}><span className="buy-bonus-step-icon buy-bonus-step-icon--plus" aria-hidden="true" /></button>
    </div>
    {!affordable && <p className="buy-bonus-error" role="status">{t('insufficient_title')}</p>}
    <div className="buy-bonus-actions">
      <button type="button" className="smp-modal-action buy-bonus-submit" disabled={!affordable || !bets.length}
        onClick={() => {
          playSound('ui_button');
          if (submitted.current || !affordable) return;
          if (plan.cost > 2) {
            setConfirmation({ mode: plan.mode, stake, cost: plan.cost, currency });
            return;
          }
          submitted.current = true; onBuy(plan.mode, stake);
        }}>{t('buy_bonus_action')} · {money(total)}</button>
    </div>
  </Modal>;
}
