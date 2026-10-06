import artwork from '@/assets/buttons/buy-bonus-jade.webp';
import { formatMoney } from '@/utils/currency';
import { t } from '@/utils/i18n';
import { play } from '@/audio/soundManager';
export function BonusBoostButton({enabled, disabled, onToggle, cost, currency, precision, desktop = false}: {
  enabled: boolean; disabled: boolean; onToggle: () => void; cost: number; currency: string; precision: number; desktop?: boolean;
}) {
  const label = t('boost_title');
  const description = t('boost_rules');
  return <button type="button" className={`smp-buy-bonus-button smp-boost-button${desktop ? ' smp-boost-button--desktop' : ''}`} disabled={disabled} role="switch" aria-checked={enabled} aria-label={`${label}. ${description}`} title={description} onClick={() => { play('ui_button'); onToggle(); }}>
    <img className="smp-buy-bonus-artwork" src={artwork} alt="" />
    <span className="smp-buy-bonus-label"><span className="smp-boost-title">{desktop ? label.split(/\s+/).map((word, index) => <span className="smp-desktop-button-line" key={index}>{word}</span>) : label}</span><small>{formatMoney(cost, currency, precision + 1)}</small><span className="smp-boost-switch" aria-hidden="true"><span className="smp-boost-switch-track"><span /></span>{enabled ? 'ON' : 'OFF'}</span></span>
  </button>;
}
