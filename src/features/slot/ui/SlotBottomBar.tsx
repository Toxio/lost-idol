import { SettingsModal } from '@/features/settings/SettingsModal';
import { locale } from '@/utils/i18n';
import { Menu, Minus, Plus, Info, Settings } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useTime } from "react-timer-hook";
import balanceIcon from "@/assets/buttons/balance.webp";
import betBackImg from "@/assets/buttons/bet/bet_back.webp";
import menuIcon from "@/assets/buttons/menu.webp";
import { play as playSound } from "@/audio/soundManager";
import { QuickSound } from './QuickSound';
import { t } from "@/utils/i18n";
import { CurrencyAmount } from "@/components/CurrencyAmount";
import { indexOfBetLevel } from "@/api/rgs";
import { BetMenu } from "./BetMenu";

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
  costMultiplier?: number;
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
  costMultiplier = 1,
  quickBets,
  disabled,
  onBetChange,
}: SlotBottomBarProps) {
  const { hours, minutes } = useTime();
  const currentTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  const [betMenuOpen, setBetMenuOpen] = useState(false);
  const betAnchor = useRef<HTMLButtonElement>(null);
  const betMenuId = useId();
  const closeBetMenu = useCallback(() => setBetMenuOpen(false), []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRoot = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!dropdownOpen) return;
    const outside = (event: PointerEvent) => { if (!menuRoot.current?.contains(event.target as Node)) setDropdownOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setDropdownOpen(false); menuRoot.current?.querySelector('button')?.focus(); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [dropdownOpen]);

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
        <div className="smp-bottom-bar-left" ref={menuRoot} style={{ position: 'relative' }}>
          <button
            type="button"
            className="smp-bottom-menu"
            aria-label="Menu"
            aria-expanded={dropdownOpen}
            onClick={() => {
              playSound("ui_button");
              setDropdownOpen(open => !open);
            }}
          >
            <img src={menuIcon} alt="" draggable={false} /><Menu className="smp-desktop-icon" aria-hidden="true" />
          </button>
          {dropdownOpen && <div className="game-menu-popover">
            <button type="button" onClick={() => { playSound('ui_button'); setDropdownOpen(false); setMenuOpen(true); }}><Info size={22} />{locale === 'ru' ? 'Инфо' : 'Info'}</button>
            <button type="button" onClick={() => { playSound('ui_button'); setDropdownOpen(false); setSettingsOpen(true); }}><Settings size={22} />{locale === 'ru' ? 'Настройки' : 'Settings'}</button>
          </div>}
        </div>

        <div className="smp-bottom-bar-right">
          <QuickSound />
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
              onClick={(event) => {
                if (!disabled) {
                  playSound("ui_button");
                  betAnchor.current = event.currentTarget;
                  setBetMenuOpen(open => !open);
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
                onClick={(event) => {
                  if (!disabled) {
                    playSound("ui_button");
                    betAnchor.current = event.currentTarget;
                  setBetMenuOpen(open => !open);
                  }
                }}
                disabled={disabled}
                aria-expanded={betMenuOpen && !disabled}
                aria-controls={betMenuOpen ? betMenuId : undefined}
                data-smp-bet-button
                aria-label={t("info_ctrl_bet_label")}
              >
                <span className="smp-desktop-bet-label">{t("bet_title")}</span>
                <CurrencyAmount
                  value={betAmount * costMultiplier}
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

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
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

      {betMenuOpen && !disabled && (
        <BetMenu
          id={betMenuId}
          anchor={betAnchor}
          quickBets={quickBets}
          currentBet={betAmount}
          costMultiplier={costMultiplier}
          currency={currency}
          precision={precision}
          onSelect={onBetChange}
          onClose={closeBetMenu}
        />
      )}
    </>
  );
}
