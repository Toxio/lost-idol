import { t } from "@/utils/i18n";
import { useState } from "react";
import clsx from "clsx";
import { play as playSound } from "@/audio/soundManager";
import autoSpinImg from "@/assets/buttons/auto_spin.webp";
import spinImg from "@/assets/buttons/spin.webp";
import spinArrowsImg from "@/assets/buttons/spin_arrows.webp";
import spinStopImg from "@/assets/buttons/spin_stop.webp";
import turbo1Img from "@/assets/buttons/turbo1.webp";
import turbo2Img from "@/assets/buttons/turbo2.webp";
import turboMaxImg from "@/assets/buttons/turbo.webp";
import {
  AutoSpinModal,
  DEFAULT_AUTOPLAY_SETTINGS,
  type AutoplaySettingsState,
  type AutoplayStartOptions,
} from "../modals";

interface SlotSideControlsProps {
  bonusGame?: boolean;
  spinning: boolean;
  controlsDisabled: boolean;
  spinSpeed: 1 | 2 | 3;
  autoSpinActive: boolean;
  autoSpinRemaining: number | null;
  autoplayDisabled?: boolean;
  turboDisabled?: boolean;
  insufficientFunds: boolean;
  currency: string;
  onSpin: () => void;
  onAutoSpinStart: (options: AutoplayStartOptions) => void;
  onAutoSpinStop: () => void;
  onSpeedCycle: () => void;
  onBuyBonus?: () => void;
}

const SPEED_LABELS: Record<1 | 2 | 3, string> = {
  1: "Normal speed (~2.6 s)",
  2: "Fast speed (~1.25 s)",
  3: "Maximum turbo speed",
};

const TURBO_ICONS: Record<1 | 2 | 3, string> = {
  1: turbo1Img,
  2: turbo2Img,
  3: turboMaxImg,
};

export function SlotSideControls({
  bonusGame = false,
  spinning,
  controlsDisabled,
  spinSpeed,
  autoSpinActive,
  autoSpinRemaining,
  autoplayDisabled = false,
  turboDisabled = false,
  insufficientFunds,
  currency,
  onSpin,
  onAutoSpinStart,
  onAutoSpinStop,
  onSpeedCycle,
  onBuyBonus,
}: SlotSideControlsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [autoplaySettings, setAutoplaySettings] =
    useState<AutoplaySettingsState>(DEFAULT_AUTOPLAY_SETTINGS);
  const spinDisabled = controlsDisabled && !spinning;
  const spinShowStop = spinning || autoSpinActive;

  const handleAutoSpinClick = () => {
    playSound("ui_button");
    if (autoSpinActive) {
      onAutoSpinStop();
    } else {
      setModalOpen(true);
    }
  };

  const badge =
    autoSpinActive && autoSpinRemaining !== null
      ? String(autoSpinRemaining)
      : autoSpinActive
        ? "∞"
        : null;

  return (
    <div className="smp-side-controls" aria-label="Game controls">
      {onBuyBonus && <button type="button" className="smp-buy-bonus-button" disabled={controlsDisabled || autoSpinActive || spinning} onClick={onBuyBonus}><span className="smp-buy-bonus-label">{t('buy_bonus_title')}</span></button>}
      <button
        type="button"
        className={clsx(
          "smp-side-btn",
          "smp-side-btn--spin",
          insufficientFunds && "smp-side-btn--insufficient",
          spinShowStop && "smp-side-btn--stopping",
        )}
        data-smp-spin-button
        onClick={onSpin}
        disabled={spinDisabled || autoSpinActive}
        aria-label={spinShowStop ? "Stop spin" : "Spin"}
      >
        <img
          className="smp-side-btn__base"
          src={spinImg}
          alt=""
          draggable={false}
        />
        {spinShowStop ? (
          <span className="smp-side-btn__stop-wrap" aria-hidden>
            <img
              className="smp-side-btn__stop"
              src={spinStopImg}
              alt=""
              draggable={false}
            />
          </span>
        ) : (
          <span className="smp-side-btn__arrows-wrap" aria-hidden>
            <img
              className="smp-side-btn__arrows"
              src={spinArrowsImg}
              alt=""
              draggable={false}
            />
          </span>
        )}
      </button>

      <div className="smp-side-controls__secondary">
        <button
          type="button"
          className={clsx(
            "smp-side-btn",
            "smp-side-btn--small",
            "smp-side-btn--autospin",
            autoSpinActive && "smp-side-btn--active",
          )}
          onClick={handleAutoSpinClick}
          disabled={bonusGame || (controlsDisabled && !autoSpinActive) || autoplayDisabled}
          aria-label={autoSpinActive ? `Stop autoplay · ${badge === "∞" ? "Unlimited spins" : `${badge} spins remaining`}` : "Start auto spin"}
          aria-pressed={autoSpinActive}
        >
          {autoSpinActive ? (
            <>
              <img
                className="smp-side-btn__base"
                src={spinImg}
                alt=""
                draggable={false}
              />
              <span className="smp-side-btn__autospin-square" aria-hidden="true">
                <span className="smp-side-btn__autospin-count">{badge}</span>
              </span>
            </>
          ) : (
            <img src={autoSpinImg} alt="" draggable={false} />
          )}
        </button>

        <button
          type="button"
          className="smp-side-btn smp-side-btn--small"
          onClick={() => {
            playSound("ui_button");
            onSpeedCycle();
          }}
          disabled={(!bonusGame && !autoSpinActive && controlsDisabled) || turboDisabled}
          aria-label={`Speed: ${SPEED_LABELS[spinSpeed]}. Click to change.`}
          aria-pressed={spinSpeed > 1}
          title={SPEED_LABELS[spinSpeed]}
        >
          <img src={TURBO_ICONS[spinSpeed]} alt="" draggable={false} />
        </button>
      </div>

      {modalOpen && (
        <AutoSpinModal
          settings={autoplaySettings}
          onSettingsChange={setAutoplaySettings}
          onStart={onAutoSpinStart}
          onClose={() => setModalOpen(false)}
          currency={currency}
        />
      )}
    </div>
  );
}
