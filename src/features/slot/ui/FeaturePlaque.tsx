import type { TreasuryProgress } from '../treasury/TreasuryFeature';
import { formatTrimmedAmount } from '@/utils/currency';
import { t } from '@/utils/i18n';
import type { BonusState } from '@/hooks/useRgsSession';
import type { CollectorAction } from '../player/bookEvents';
import { bonusText } from '../bonus/bonusText';
import plaque from '@/assets/reel/lost-idol-feature-plaque.webp';
import './FeaturePlaque.css';
import type { WinLine } from '@/api/gameTypes';
import { wildRoundFormula } from '../player/wildRoundFormula';

export function FeaturePlaque({ bonus, collector, precision, pending, winLines, treasury }: {
  treasury?: TreasuryProgress | null;
  bonus: BonusState; collector: CollectorAction | null; precision: number;
  pending: boolean;
  winLines: WinLine[];
}) {
  const inBonus = bonus.phase !== 'idle';
  const active = Boolean(treasury) || inBonus || Boolean(collector?.totalRespins);
  const level = bonus.total >= 15 ? 3 : bonus.total >= 10 ? 2 : 1;
  const formula = collector && !pending ? wildRoundFormula(collector, winLines) : null;
  const format = (value: number) => Number(value.toFixed(Math.max(precision, 2))).toString();
  return <div className="smp-feature-plaque" role="status" aria-live="polite">
    <img src={plaque} alt="" draggable={false} />
    {active && <div className="smp-feature-plaque__content">
      <div className="smp-feature-plaque__section">
        <span>{treasury ? t('paytable_treasury_title') : inBonus ? `BONUS LEVEL ${level}` : 'WILD ROUNDS'}</span>
        <strong aria-label={inBonus ? `${bonusText.title}: ${bonus.current} / ${bonus.total}` : undefined}>
          {treasury ? treasury.revealed : inBonus ? bonus.current : collector?.respin}
          <small> / {treasury ? 3 : inBonus ? bonus.total : collector?.totalRespins}</small>
        </strong>
      </div>
      <div className="smp-feature-plaque__section">
        <span>{treasury ? (treasury.revealed > 0 && treasury.multiplier > 1 ? `${t('treasury_multiplier')} ×${treasury.multiplier}` : t('treasury_win').toLocaleUpperCase()) : inBonus ? 'ROUND WIN' : 'WILD ROUND WIN'}</span>
        <strong className="smp-feature-plaque__formula">{treasury ? formatTrimmedAmount(treasury.amount, precision).replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '') : formula && formula.total > 0 ? `${formula.multiplier} × ${format(formula.base)}${formula.other > 0 ? ` + ${format(formula.other)}` : ''} = ${format(formula.total)}` : '—'}</strong>
      </div>
    </div>}
  </div>;
}
