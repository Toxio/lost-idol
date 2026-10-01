import { useMemo } from "react";
import { Modal } from "@/components/modal";
import { CurrencyAmount } from "@/components/CurrencyAmount";
import { play as playSound } from "@/audio/soundManager";
import { indexOfBetLevel, snapToBetLevel } from "@/api/rgs";
import { t } from "@/utils/i18n";
import "./BetSettingsModal.css";

interface BetSettingsModalProps {
  quickBets: number[];
  currentBet: number;
  currency: string;
  precision: number;
  onConfirm: (amount: number) => void;
  onClose: () => void;
}

export function BetSettingsModal({
  quickBets,
  currentBet,
  currency,
  precision,
  onConfirm,
  onClose,
}: BetSettingsModalProps) {
  const selected = quickBets.length
    ? snapToBetLevel(quickBets, currentBet)
    : currentBet;
  const index = useMemo(
    () => indexOfBetLevel(quickBets, selected),
    [quickBets, selected],
  );
  const lastIndex = Math.max(quickBets.length - 1, 0);
  const canDecrease = index > 0;
  const canIncrease = index < lastIndex;

  const selectAt = (nextIndex: number, withSound = false) => {
    const next = quickBets[nextIndex];
    if (next === undefined) return;
    if (withSound) playSound("ui_button");
    onConfirm(next);
  };

  return (
    <Modal
      title={t("bet_title")}
      size="narrow"
      className="smp-bsm-modal"
      onClose={onClose}
    >
      <div className="smp-bsm">
        <div className="smp-bsm-stepper">
          <button
            type="button"
            className="smp-bsm-step"
            onClick={() => selectAt(index - 1, true)}
            disabled={!canDecrease}
            aria-label={`${t("bet_title")} −`}
          >
            −
          </button>
          <div className="smp-bsm-amount" aria-live="polite">
            <CurrencyAmount
              value={selected}
              currency={currency}
              precision={Number.isInteger(selected) ? 0 : precision}
              fitToWidth
            />
          </div>
          <button
            type="button"
            className="smp-bsm-step"
            onClick={() => selectAt(index + 1, true)}
            disabled={!canIncrease}
            aria-label={`${t("bet_title")} +`}
          >
            +
          </button>
        </div>

        <div className="smp-bsm-options" role="group" aria-label={t("bet_title")}>
          {quickBets.map((amount, betIndex) => (
            <button
              key={amount}
              type="button"
              className="smp-bsm-option"
              aria-pressed={amount === selected}
              onClick={() => selectAt(betIndex, true)}
            >
              <CurrencyAmount
                value={amount}
                currency={currency}
                precision={Number.isInteger(amount) ? 0 : precision}
                fitToWidth
              />
            </button>
          ))}
        </div>
      </div>

    </Modal>
  );
}
