import { Menu, Minus, Plus, Volume2, VolumeX } from "lucide-react";
import { lazy, Suspense, useState, type ReactNode } from "react";
import { useTime } from "react-timer-hook";
import balanceIcon from "@/assets/buttons/balance.webp";
import betBackImg from "@/assets/buttons/bet/bet_back.webp";
import menuIcon from "@/assets/buttons/menu.webp";
import { play as playSound } from "@/audio/soundManager";
import { useSoundSettings } from "@/hooks/useSoundSettings";
import { t } from "@/utils/i18n";
import { CurrencyAmount } from "@/components/CurrencyAmount";
import { indexOfBetLevel } from "@/api/rgs";
import { BetSettingsModal } from "../modals";

const MenuModal = lazy(() =>
  import("../menu").then((m) => ({ default: m.MenuModal })),
);

interface SlotBottomBarProps {
  controls?: ReactNode;
  balance: number;
  currency: string;
  precision: number;
  winAmount: number | null;
  betAmount: number;
  quickBets: number[];
  disabled: boolean;
  onBetChange: (amount: number) => void;
}

export function SlotBottomBar({
  controls,
  balance,
  currency,
  precision,
  winAmount,
  betAmount,
  quickBets,
  disabled,
  onBetChange,
}: SlotBottomBarProps) {
  const { muted, toggleMute } = useSoundSettings();
  const { hours, minutes } = useTime();
  const currentTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const betIndex = indexOfBetLevel(quickBets, betAmount);
  const canDecrease = betIndex > 0;
  const canIncrease = betIndex < quickBets.length - 1;
  const hasWin = winAmount !== null && winAmount > 0;

  const changeBet = (nextIndex: number) => {
    const next = quickBets[nextIndex];
    if (next === undefined) return;
    playSound("ui_button");
    onBetChange(next);
  };

  return (
    <>
      <div className="smp-bottom-bar">
        <div className="smp-bottom-bar-left">
          <button
            type="button"
            className="smp-bottom-menu"
            aria-label="Menu"
            onClick={() => {
              playSound("ui_button");
              setMenuOpen(true);
            }}
          >
            <img src={menuIcon} alt="" draggable={false} /><Menu className="smp-desktop-icon" aria-hidden="true" />
          </button>
        </div>

        <div className="smp-bottom-bar-right">
          <button
            type="button"
            className="smp-bottom-sound-btn smp-quick-sound"
            onClick={() => {
              playSound("ui_button");
              toggleMute();
            }}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            aria-pressed={muted}
          >
            {muted ? <VolumeX aria-hidden="true" /> : <Volume2 aria-hidden="true" />}
          </button>
          <span
            className="smp-bottom-clock smp-bottom-clock--desktop"
            aria-hidden="true"
          >
            {currentTime}
          </span>
        </div>

        <span
          className="smp-bottom-clock smp-bottom-clock--mobile"
          aria-label="Current time"
        >
          {currentTime}
        </span>

        <div className="smp-bottom-bar-core">
          <div className="smp-bottom-balance">
            <button
              type="button"
              className="smp-bottom-balance-icon-btn"
              onClick={() => {
                if (!disabled) {
                  playSound("ui_button");
                  setModalOpen(true);
                }
              }}
              disabled={disabled}
              aria-label={t("info_ctrl_bet_label")}
            >
              <img
                className="smp-bottom-balance-icon"
                src={balanceIcon}
                alt=""
                draggable={false}
              />
            </button>
            <div className="smp-bottom-balance-text">
              <span className="smp-bottom-label">{t("footer_balance")}</span>
              <span className="smp-bottom-value">
                <CurrencyAmount
                  value={balance}
                  currency={currency}
                  precision={precision}
                  trimZeros
                />
              </span>
            </div>
          </div>

          <div className="smp-bottom-win">
            <span className="smp-bottom-win-label">{t("footer_win")}</span>
            <span
              className={`smp-bottom-win-value${hasWin ? " smp-bottom-win-value--active" : ""}`}
            >
              {hasWin && (
                <CurrencyAmount
                  value={winAmount!}
                  currency={currency}
                  precision={precision}
                  trimZeros
                />
              )}
            </span>
          </div>

          <div className="smp-bottom-bet">
            <img
              className="smp-bottom-bet-bg"
              src={betBackImg}
              alt=""
              draggable={false}
              aria-hidden
            />
            <div className="smp-bottom-bet-inner">
              <button
                type="button"
                className="smp-bottom-bet-arrow smp-bottom-bet-arrow--prev"
                onClick={() => changeBet(betIndex - 1)}
                disabled={!canDecrease || disabled}
                aria-label={`${t("bet_title")} −`}
              ><Minus aria-hidden="true" /></button>
              <button
                type="button"
                className="smp-bottom-bet-amount smp-bottom-bet-amount--clickable"
                onClick={() => {
                  if (!disabled) {
                    playSound("ui_button");
                    setModalOpen(true);
                  }
                }}
                disabled={disabled}
                data-smp-bet-button
                aria-label={t("info_ctrl_bet_label")}
              >
                <span className="smp-desktop-bet-label">{t("bet_title")}</span>
                <CurrencyAmount
                  value={betAmount}
                  currency={currency}
                  precision={precision}
                  fitToWidth
                />
              </button>
              <button
                type="button"
                className="smp-bottom-bet-arrow smp-bottom-bet-arrow--next"
                onClick={() => changeBet(betIndex + 1)}
                disabled={!canIncrease || disabled}
                aria-label={`${t("bet_title")} +`}
              ><Plus aria-hidden="true" /></button>
            </div>
          </div>
        </div>
        {controls}
      </div>

      {menuOpen && (
        <Suspense fallback={null}>
          <MenuModal
            onClose={() => setMenuOpen(false)}
            minBet={quickBets[0] ?? 0}
            maxBet={quickBets[quickBets.length - 1] ?? 0}
            currency={currency}
            precision={precision}
            betAmount={betAmount}
          />
        </Suspense>
      )}

      {modalOpen && (
        <BetSettingsModal
          quickBets={quickBets}
          currentBet={betAmount}
          currency={currency}
          precision={precision}
          onConfirm={onBetChange}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
