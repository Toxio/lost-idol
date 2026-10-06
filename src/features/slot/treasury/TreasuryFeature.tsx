import type { TreasurySession } from './treasuryModel';
import { GameNumberGlyphs, GameMoneyGlyphs } from '../ui/WildMultiplier';
import { useCallback, useEffect, useRef, useState } from 'react';
import frameUrl from '@/assets/reel/lost-idol-frame.webp';
import chestSheet from '@/assets/symbols/lost-idol/gold-satchel/sheet.webp';
import { getGameUrlParams } from '@/utils/getGameUrlParams';
import { formatMoney } from '@/utils/currency';
import { t, locale } from '@/utils/i18n';
import { play } from '@/audio/soundManager';
import { treasuryTotal, validTreasuryPicks } from './treasuryModel';
import { CollectorSmoke } from '../ui/CollectorSmoke';
import { REEL_GRID } from '../reels/constants';
import './TreasuryPreview.css';

export type TreasuryProgress = { id: string; revealed: number; cash: number; multiplier: number; amount: number };
function restore(storage: string): number[] {
  try { const value: unknown = JSON.parse(sessionStorage.getItem(storage) ?? '[]'); return validTreasuryPicks(value) ? value : []; }
  catch { return []; }
}

/** Mounted only after the first complete win presentation; the reel scene stays intact underneath. */
export function TreasuryFeature({ onClose, award, onProgress, currency, precision, autoPick = false }: {
  autoPick?: boolean;
  currency: string; precision: number;
  onClose: () => void; award: TreasurySession; onProgress: (value: TreasuryProgress) => void;
}) {
  const [countdown, setCountdown] = useState(5);
  const manualPick = useRef(true);
  const storage = `lost-idol-treasury-${award.id}`;
  const [picks, setPicks] = useState(() => restore(storage));
  const [opening, setOpening] = useState<number | null>(null);
  const [phase, setPhase] = useState<'enter' | 'choose' | 'exit'>('enter');
  const [covered, setCovered] = useState(false);
  const lock = useRef(false);
  const region = useRef<HTMLElement>(null);
  const ru = (getGameUrlParams().lang || getGameUrlParams().culture).startsWith('ru');
  const revealed = opening === null ? picks.length : picks.length - 1;
  const { cash, multiplier, total } = treasuryTotal(award.rewards.slice(0, revealed));
  const done = revealed === 3;
  const instruction = t(done ? 'treasury_collected' : 'treasury_open_chests').toLocaleUpperCase();
  useEffect(() => {
    onProgress({ id: award.id, revealed, cash, multiplier, amount: (done ? award.amount : total) * award.bet });
  }, [award.id, award.amount, award.bet, revealed, cash, multiplier, total, done, onProgress]);
  useEffect(() => {
    if (phase === 'choose') {
      region.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus({ preventScroll: true });
      return;
    }
    const swap = window.setTimeout(() => setCovered(phase === 'enter'), 450);
    const end = window.setTimeout(() => { if (phase === 'enter') setPhase('choose'); else onClose(); }, 1200);
    return () => { window.clearTimeout(swap); window.clearTimeout(end); };
  }, [phase, onClose]);
  useEffect(() => {
    if (opening === null) return;
    const timer = window.setTimeout(() => { setOpening(null); lock.current = false; }, 1100);
    return () => window.clearTimeout(timer);
  }, [opening]);
  useEffect(() => {
    if (!done || phase !== 'choose') return;
    const timer = window.setTimeout(() => setPhase('exit'), 2200);
    return () => window.clearTimeout(timer);
  }, [done, phase]);
  const choose = useCallback((index: number, automatic = false) => {
    if (phase !== 'choose' || lock.current || picks.length >= 3 || picks.includes(index)) return;
    manualPick.current = !automatic;
    lock.current = true;
    const next = [...picks, index];
    try { sessionStorage.setItem(storage, JSON.stringify(next)); } catch { /* Optional persistence. */ }
    setPicks(next); setOpening(index); play('ui_button');
  }, [phase, picks, storage]);
  useEffect(() => {
    if (!autoPick || phase !== 'choose' || opening !== null || done) return;
    let remaining = manualPick.current ? 5 : 1;
    const initial = window.setTimeout(() => setCountdown(remaining), 0);
    const timer = window.setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        window.clearInterval(timer);
        const available = Array.from({ length: 6 }, (_, i) => i).filter(i => !picks.includes(i));
        choose(available[Math.floor(Math.random() * available.length)], true);
      }
    }, 1000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [autoPick, phase, opening, done, picks, choose]);
  return <><section className="treasury-reel" ref={region} aria-label={ru ? 'Сокровищница' : 'Treasury'}
    style={{ left: `${REEL_GRID.x * 100}%`, top: `${REEL_GRID.y * 100}%`, width: `${REEL_GRID.w * 100}%`, height: `${REEL_GRID.h * 100}%` }}>
    {covered && <div className="treasury-reel-surface">
      <p className="treasury-instruction" aria-live="polite">{locale === 'en' ? <GameNumberGlyphs className="treasury-instruction-glyphs" text={instruction} /> : instruction}</p>
      {autoPick && !done && phase === 'choose' && <p className="treasury-auto-pick">{opening !== null ? t('treasury_auto_opening') : t('treasury_auto_pick').replace('{seconds}', String(countdown))}</p>}
      <div className="treasury-chests">
        {Array.from({ length: 6 }, (_, index) => {
          const order = picks.indexOf(index);
          const open = order >= 0;
          const reward = open ? award.rewards[order] : null;
          const visible = open && opening !== index;
          return <button key={index} className={`treasury-chest${open ? ' is-open' : ''}${opening === index ? ' is-opening' : ''}`}
            disabled={phase !== 'choose' || open || opening !== null || done} onClick={() => choose(index)}
            aria-label={`${ru ? 'Сундук' : 'Chest'} ${index + 1}${visible && reward ? `: ${reward.kind === 'cash' ? formatMoney(reward.value * award.bet, currency, precision) : `×${reward.value}`}` : ''}`}>
            <span className="treasury-chest-art" style={{ backgroundImage: `url(${chestSheet})` }} />
            <span className={`treasury-reward${visible ? ' is-visible' : ''}`}>
              {reward && (reward.kind === 'cash'
                ? <GameMoneyGlyphs value={reward.value * award.bet} currency={currency} precision={precision} />
                : <GameNumberGlyphs className="treasury-reward-glyphs" text={`X${reward.value}`} label={`×${reward.value}`} />)}
            </span>
          </button>;
        })}
      </div>
    </div>}
    {phase !== 'choose' && <div key={phase} className="treasury-transition">
      <CollectorSmoke style={{ left: '50%', top: '50%', width: '150%', height: '180%' }} />
    </div>}
  </section>
    {covered && <div className="treasury-frame" aria-hidden="true" style={{ borderImageSource: `url(${frameUrl})` }} />}
  </>;
}
