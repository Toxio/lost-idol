import { RotateCw, Square, Zap } from "lucide-react";
import { t } from "@/utils/i18n";
import { useCallback, useId, useRef, useState } from "react";
import clsx from "clsx";
import buyBonusButtonImg from "@/assets/buttons/buy-bonus-jade.webp";
import { play as playSound } from "@/audio/soundManager";
import autoSpinImg from "@/assets/buttons/auto_spin.webp";
import spinImg from "@/assets/buttons/spin.webp";
import spinArrowsImg from "@/assets/buttons/spin_arrows.webp";
import spinStopImg from "@/assets/buttons/spin_stop.webp";
import type { AutoplayStartOptions } from "../modals";
import { AutoplayMenu } from './AutoplayMenu';

interface SlotSideControlsProps {
  bonusGame?: boolean;
  spinning: boolean;
  controlsDisabled: boolean;
  spinSpeed: 1 | 2;
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

const SPEED_LABELS: Record<1 | 2, string> = {
  1: "Normal speed",
  2: "Fast speed",
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
  onSpin,
  onAutoSpinStart,
  onAutoSpinStop,
  onSpeedCycle,
  onBuyBonus,
}: SlotSideControlsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const autoSpinButton = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const spinDisabled = controlsDisabled && !spinning;
  const spinShowStop = spinning || autoSpinActive;

  const handleAutoSpinClick = () => {
    playSound("ui_button");
    if (autoSpinActive) {
      onAutoSpinStop();
    } else {
      setMenuOpen(open => !open);
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
      {onBuyBonus && <button type="button" className="smp-buy-bonus-button" disabled={controlsDisabled || autoSpinActive || spinning} onClick={onBuyBonus}>
        <img className="smp-buy-bonus-artwork" src={buyBonusButtonImg} alt="" draggable={false} />
        <span className="smp-buy-bonus-label">{t('buy_bonus_title')}</span>
      </button>}
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
        {spinShowStop ? <Square className="smp-desktop-icon" aria-hidden="true" /> : <RotateCw className="smp-desktop-icon" aria-hidden="true" />}
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
          ref={autoSpinButton}
          aria-expanded={menuOpen && !controlsDisabled && !bonusGame && !autoplayDisabled && !autoSpinActive}
          aria-controls={menuOpen ? menuId : undefined}
          onClick={handleAutoSpinClick}
          disabled={bonusGame || (controlsDisabled && !autoSpinActive) || autoplayDisabled}
          aria-label={autoSpinActive ? `Stop autoplay · ${badge === "∞" ? "Unlimited spins" : `${badge} spins remaining`}` : "Start auto spin"}
          aria-pressed={autoSpinActive}
        >
          {!autoSpinActive && (
            <svg className="smp-desktop-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12a11.5 11.5 0 0 1 21-3M26 4v5h-5" />
              <path d="M27 20A11.5 11.5 0 0 1 6 23M6 28v-5h5" />
              <path d="m12.5 21 3.5-10 3.5 10M14 17h4" strokeWidth="1.6" />
            </svg>
          )}
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
          className="smp-side-btn smp-side-btn--small smp-side-btn--speed"
          onClick={() => {
            playSound("ui_button");
            onSpeedCycle();
          }}
          disabled={(!bonusGame && !autoSpinActive && controlsDisabled) || turboDisabled}
          aria-label={`Speed: ${SPEED_LABELS[spinSpeed]}. Click to change.`}
          aria-pressed={spinSpeed > 1}
          title={SPEED_LABELS[spinSpeed]}
        >
          <Zap className="smp-speed-icon" aria-hidden="true" />
        </button>
      </div>

      {menuOpen && !controlsDisabled && !bonusGame && !autoplayDisabled && !autoSpinActive && (
        <AutoplayMenu id={menuId} anchor={autoSpinButton} onClose={closeMenu} onStart={onAutoSpinStart} />
      )}
    </div>
  );
}
