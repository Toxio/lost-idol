import { CurrencyAmount } from '@/components/CurrencyAmount';
import { Modal } from '@/components/modal';
import { play as playSound } from '@/audio/soundManager';
import { t } from '@/utils/i18n';
import './ReplayControls.css';

export interface ReplayControlsProps {
  status: 'loading' | 'ready' | 'playing' | 'finished' | 'error';
  spinning: boolean;
  onPlay: () => void;
  onPlayAgain: () => void;
  mode: string;
  betAmount: number;
  costMultiplier: number;
  payoutMultiplier: number;
  winAmount: number | null;
  currency: string;
  precision: number;
}

/**
 * Bet Replay UI per Stake ACP UX. States:
 * - loading / error / ready — full-screen `<Modal>` with round summary + Start Replay.
 * - playing / spinning — nothing rendered (reels/winlines fully visible).
 * - finished — compact "Play Again" pill anchored to the bottom.
 */
export function ReplayControls({
  status,
  spinning,
  onPlay,
  onPlayAgain,
  mode,
  betAmount,
  costMultiplier,
  payoutMultiplier,
  winAmount,
  currency,
  precision,
}: ReplayControlsProps) {
  if (status === 'playing' || spinning) return null;

  if (status === 'finished') {
    return (
      <div className="replay-again-bar" role="region" aria-label={t('replay_title')}>
        <button
          type="button"
          className="smp-modal-action replay-again-bar__btn"
          onClick={() => { playSound('ui_button'); onPlayAgain(); }}
        >
          {t('replay_play_again')}
        </button>
      </div>
    );
  }

  const cost = Math.max(1, costMultiplier || 1);
  const totalBet = betAmount * cost;
  const total = winAmount != null ? winAmount : betAmount * (payoutMultiplier || 0);
  const modeLabel = (mode || 'base').replace(/_/g, ' ').toUpperCase();

  return (
    <Modal
      badge={t('replay_badge')}
      title={t('replay_title')}
      size="narrow"
      className="replay-modal"
      ariaLabel={t('replay_title')}
      onClose={() => {}}
    >
      <div className="replay-modal__card">
        <div className="replay-modal__row">
          <span className="replay-modal__label">{t('replay_mode_label')}</span>
          <span className="replay-modal__value replay-modal__value--accent">{modeLabel}</span>
        </div>

        <div className="replay-modal__divider" />

        <div className="replay-modal__row">
          <span className="replay-modal__label">{t('replay_base_bet')}</span>
          <span className="replay-modal__value replay-modal__value--accent">
            <CurrencyAmount value={betAmount} currency={currency} precision={precision} />
          </span>
        </div>

        <div className="replay-modal__row">
          <span className="replay-modal__label">{t('replay_cost_multiplier')}</span>
          <span className="replay-modal__value replay-modal__value--accent">{cost}x</span>
        </div>

        <div className="replay-modal__row replay-modal__row--highlight">
          <span className="replay-modal__label">{t('replay_total_bet_cost')}</span>
          <span className="replay-modal__value replay-modal__value--accent">
            <CurrencyAmount value={totalBet} currency={currency} precision={precision} />
          </span>
        </div>

        <div className="replay-modal__divider" />

        <div className="replay-modal__row">
          <span className="replay-modal__label">{t('replay_payout_multiplier')}</span>
          <span className="replay-modal__value replay-modal__value--win">
            {(payoutMultiplier ?? 0)}x
          </span>
        </div>

        <div className="replay-modal__row replay-modal__row--highlight">
          <span className="replay-modal__label">{t('replay_total_win')}</span>
          <span className="replay-modal__value replay-modal__value--win">
            <CurrencyAmount value={total} currency={currency} precision={precision} trimZeros />
          </span>
        </div>
      </div>

      {status === 'loading' && (
        <p className="replay-modal__status" role="status" aria-live="polite">
          {t('replay_loading')}
        </p>
      )}
      {status === 'error' && (
        <p className="replay-modal__status replay-modal__status--error" role="alert">
          {t('replay_error')}
        </p>
      )}
      {status === 'ready' && (
        <button
          type="button"
          className="smp-modal-action"
          onClick={() => { playSound('ui_button'); onPlay(); }}
        >
          {t('replay_start')}
        </button>
      )}

      <p className="replay-modal__disclaimer">{t('replay_disclaimer')}</p>
    </Modal>
  );
}
