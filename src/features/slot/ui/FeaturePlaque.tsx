import type { BonusState } from '@/hooks/useRgsSession';
import type { CollectorAction } from '../player/bookEvents';
import { bonusText } from '../bonus/bonusText';
import plaque from '@/assets/reel/lost-idol-feature-plaque.webp';
import './FeaturePlaque.css';
import type { WinLine } from '@/api/gameTypes';
import { wildRoundFormula } from '../player/wildRoundFormula';

export function FeaturePlaque({ bonus, collector, precision, pending, winLines }: {
  bonus: BonusState; collector: CollectorAction | null; precision: number;
  pending: boolean;
  winLines: WinLine[];
}) {
  const inBonus = bonus.phase !== 'idle';
  const active = inBonus || Boolean(collector?.totalRespins);
  const level = bonus.total >= 15 ? 3 : bonus.total >= 10 ? 2 : 1;
  const formula = collector && !pending ? wildRoundFormula(collector, winLines) : null;
  const format = (value: number) => Number(value.toFixed(Math.max(precision, 2))).toString();
  return <div className="smp-feature-plaque" role="status" aria-live="polite">
    <img src={plaque} alt="" draggable={false} />
    {active && <div className="smp-feature-plaque__content">
      <div className="smp-feature-plaque__section">
        <span>{inBonus ? `BONUS LEVEL ${level}` : 'WILD ROUNDS'}</span>
        <strong aria-label={inBonus ? `${bonusText.title}: ${bonus.current} / ${bonus.total}` : undefined}>
          {inBonus ? bonus.current : collector?.respin}
          <small> / {inBonus ? bonus.total : collector?.totalRespins}</small>
        </strong>
      </div>
      <div className="smp-feature-plaque__section">
        <span>{inBonus ? 'ROUND WIN' : 'WILD ROUND WIN'}</span>
        <strong className="smp-feature-plaque__formula">{formula && formula.total > 0 ? `${formula.multiplier} × ${format(formula.base)}${formula.other > 0 ? ` + ${format(formula.other)}` : ''} = ${format(formula.total)}` : '—'}</strong>
      </div>
    </div>}
  </div>;
}
