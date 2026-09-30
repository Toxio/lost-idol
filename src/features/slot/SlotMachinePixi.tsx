import { REEL_GRID, REEL_COUNT } from "./reels/constants";
import { t } from "@/utils/i18n";
import { BuyBonusModal } from "./bonus/BuyBonusModal";
import { BonusFeature } from "./bonus/BonusFeature";
import { Application } from "@pixi/react";
import type { Application as PixiApplication } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";

import homeBtnUrl from "@/assets/buttons/home_btn.webp";
import { play as playSound } from "@/audio/soundManager";
import type { SlotSessionState } from "@/hooks/useRgsSession";
import { useAutoplay } from "@/hooks/useAutoplay";
import { useGameSounds } from "@/hooks/useGameSounds";
import { useResponsiveCanvas } from "@/hooks/useResponsiveCanvas";
import { useSpaceKeyForSpin } from "@/hooks/useSpaceKeyForSpin";
import { CurrencyAmount } from "@/components/CurrencyAmount";
import { getRendererResolution } from "@/utils/rendererResolution";
import { getGameUrlParams } from "@/utils/getGameUrlParams";
import { canAffordStake } from "@/utils/stakeBalance";
import { AutoplayStoppedModal, InsufficientFundsModal } from "./modals";
import { SlotBottomBar } from "./ui/SlotBottomBar";
import "./ui/SlotBottomBar.css";
import { SlotLogo } from "./ui/SlotLogo";
import "./ui/SlotLogo.css";
import { SlotSideControls } from "./ui/SlotSideControls";
import { ReplayControls } from "./ui/ReplayControls";
import "./ui/SlotSideControls.css";
import { SlotReels } from "./reels";
import { TestModal } from "./test/TestModal";

export interface SlotMachinePixiProps {
  hub: SlotSessionState;
  bonusIntroReady?: boolean;
  spinSpeed: 1 | 2 | 3;
  onSpinSpeedChange: (speed: 1 | 2 | 3) => void;
  onAssetsLoaded?: () => void;
  onRegisterInsufficientFunds?: (handler: () => void) => void;
}

export function SlotMachinePixi({
  hub,
  bonusIntroReady = true,
  spinSpeed,
  onSpinSpeedChange,
  onAssetsLoaded,
  onRegisterInsufficientFunds,
}: SlotMachinePixiProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PixiApplication | null>(null);
  const [buyBonusOpen, setBuyBonusOpen] = useState(false);
  const closeBuyBonus = useCallback(() => setBuyBonusOpen(false), []);
  const [testOpen, setTestOpen] = useState(false);
  const [insufficientModalOpen, setInsufficientModalOpen] = useState(false);
  const [stopSignal, setStopSignal] = useState(0);

  const exitUrl = getGameUrlParams().exitUrl;

  const showInsufficientFunds = useCallback(
    () => setInsufficientModalOpen(true),
    [],
  );

  useEffect(() => {
    onRegisterInsufficientFunds?.(showInsufficientFunds);
  }, [onRegisterInsufficientFunds, showInsufficientFunds]);

  const {
    roundBusy,
    bonus,
    continueBonus,
    handleWinPresentationComplete,
    status,
    balance,
    currency,
    precision,
    quickBets,
    betAmount,
    setBetAmount,
    spinning,
    matrix,
    targetMatrix,
    winAmount,
    winLines,
    expandingWild,
    spinOdd,
    jurisdiction,
    replay,
    replayMode,
    replayCostMultiplier,
    replayPayoutMultiplier,
    replayReady,
    replayFinished,
    spin,
    buyBonus,
    forceSpin,
    handleSpinComplete,
    consumePendingRound,
    replayAgain,
  } = hub;

  const [presentedWinAmount, setPresentedWinAmount] = useState<number | null>(
    null,
  );
  if (spinning && presentedWinAmount !== null) {
    setPresentedWinAmount(null);
  }

  const displayedWinAmount = spinning
    ? null
    : bonus.total > 0
      ? winAmount
      : winLines.length > 0
        ? presentedWinAmount
        : winAmount != null && winAmount > 0
          ? winAmount
          : null;
  const stakePool = balance;
  const cannotAffordBet = !canAffordStake(betAmount, stakePool);
  const hasWin = displayedWinAmount !== null && displayedWinAmount > 0;

  const requestStopSpin = useCallback(() => {
    if (!spinning || jurisdiction.disabledSlamstop) return;
    setStopSignal((n) => n + 1);
  }, [spinning, jurisdiction.disabledSlamstop]);

  const handleSpinClick = useCallback(() => {
    if (spinning) {
      playSound("ui_button");
      requestStopSpin();
      return;
    }
    if (roundBusy) return;
    if (cannotAffordBet) {
      showInsufficientFunds();
      return;
    }
    playSound("ui_button");
    playSound("spin_button");
    void spin();
  }, [
    spinning,
    roundBusy,
    requestStopSpin,
    cannotAffordBet,
    showInsufficientFunds,
    spin,
  ]);

  const handleTestPanelClick = useCallback(() => {
    if (cannotAffordBet) {
      showInsufficientFunds();
      return;
    }
    setTestOpen(true);
  }, [cannotAffordBet, showInsufficientFunds]);

  const maxSpeed: 1 | 2 | 3 = jurisdiction.disabledTurbo
    ? 1
    : jurisdiction.disabledSuperTurbo
      ? 2
      : 3;
  const bonusActive = bonus.phase !== "idle";
  useGameSounds(bonusActive);
  const bonusSpeed = Math.min(maxSpeed, spinSpeed) as 1 | 2 | 3;

  const handleSpeedCycle = useCallback(() => {
    const current = bonusActive ? bonusSpeed : spinSpeed;
    const next = current >= maxSpeed ? 1 : ((current + 1) as 1 | 2 | 3);
    onSpinSpeedChange(next as 1 | 2 | 3);
  }, [
    spinSpeed,
    bonusActive,
    bonusSpeed,
    onSpinSpeedChange,
    maxSpeed,
  ]);

  const connectionLost = status === "disconnected" || status === "error";
  const controlsDisabled = status !== "ready" || replay || roundBusy;

  const autoplay = useAutoplay({
    spinning: spinning || roundBusy,
    status,
    winAmount,
    winLines: bonus.total > 0 ? [] : winLines,
    betAmount,
    cannotAffordBet,
    connectionLost,
    spin,
    onSpinSpeedChange,
    showInsufficientFunds,
  });

  useEffect(() => {
    if (!spinning || autoplay.autoSpin) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest("button")) return;
      requestStopSpin();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [spinning, autoplay.autoSpin, requestStopSpin]);

  useSpaceKeyForSpin({
    disabled: jurisdiction.disabledSpacebar,
  });

  const handleAssetsLoaded = useCallback(() => {
    onAssetsLoaded?.();
  }, [onAssetsLoaded]);

  useResponsiveCanvas({ containerRef, appRef });

  return (
    <>
      {buyBonusOpen && !roundBusy && !replay && !jurisdiction.disabledBuyFeature && <BuyBonusModal
        bet={betAmount} onBetChange={setBetAmount} bets={quickBets} balance={balance} currency={currency} precision={precision}
        onClose={closeBuyBonus} onBuy={(mode, stake) => { setBuyBonusOpen(false); void buyBonus(mode, stake); }}
      />}
      <div className={`smp-wrapper${bonusActive ? " smp-wrapper--bonus" : ""}`}>
        <div className="smp-stage-grid">
          <div className="smp-logo-col">
            {!replay && !bonusActive && !jurisdiction.disabledBuyFeature && (
              <button
                type="button"
                className="smp-buy-bonus-button smp-buy-bonus-button--desktop"
                disabled={controlsDisabled || spinning || autoplay.autoSpinEnabled}
                onClick={() => { playSound("ui_button"); setBuyBonusOpen(true); }}
              >
                <span className="smp-buy-bonus-label">{t("buy_bonus_title")}</span>
              </button>
            )}
          </div>

          <div className="smp-reels-col">
            <SlotLogo />
            <BonusFeature
              introReady={bonusIntroReady}
              bonus={spinning ? { ...bonus, wildMultipliers: [] } : bonus}
              currency={currency}
              precision={precision}
              onContinue={continueBonus}
            />
            <div ref={containerRef} className="smp-canvas">
              <Application
                resizeTo={containerRef}
                antialias
                resolution={getRendererResolution()}
                backgroundAlpha={0}
                onInit={(app) => {
                  appRef.current = app;
                  const el = containerRef.current;
                  if (!el) return;
                  const w = Math.round(el.clientWidth);
                  const h = Math.round(el.clientHeight);
                  if (w > 0 && h > 0) app.renderer.resize(w, h);
                }}
              >
                <SlotReels
                  spinSpeed={bonusActive ? bonusSpeed : spinSpeed}
                  spinning={spinning}
                  targetMatrix={targetMatrix}
                  matrix={matrix}
                  winLines={spinning ? [] : winLines}
                  expandingWild={spinning ? [0, 0, 0, 0, 0] : expandingWild}
                  spinOdd={spinning ? null : spinOdd}
                  winAmount={winAmount}
                  currency={currency}
                  precision={precision}
                  onSpinComplete={handleSpinComplete}
                  onWinCycleDone={() => {
                    handleWinPresentationComplete();
                    if (!roundBusy) autoplay.onWinCycleDone();
                  }}
                  onPresentedWinChange={setPresentedWinAmount}
                  onAssetsLoaded={handleAssetsLoaded}
                  stopSignal={stopSignal}
                  autoAdvance={autoplay.autoSpinEnabled || roundBusy}
                />
              </Application>
              {!spinning && bonus.wildMultipliers.map((multiplier, col) => {
                // Show whenever the reel expanded a wild — every expansion gets
                // a label (×1 is math's baseline, still shown for consistency).
                if (!expandingWild[col] || !Number.isFinite(multiplier) || multiplier < 1) return null;
                return <span key={col} className="smp-wild-multiplier"
                  style={{ left: `${(REEL_GRID.x + (col + 0.5) * REEL_GRID.w / REEL_COUNT) * 100}%` }}>
                  ×{multiplier}
                </span>;
              })}
            </div>
            <div
              className={`smp-mobile-win${hasWin ? " smp-mobile-win--active" : ""}`}
            >
              <span className="smp-mobile-win__label">WIN</span>
              <span className="smp-mobile-win__value">
                <span aria-hidden={!hasWin}>
                  <CurrencyAmount
                    value={hasWin ? displayedWinAmount! : 0}
                    currency={currency}
                    precision={precision}
                    trimZeros
                  />
                </span>
              </span>
            </div>
          </div>

          {!replay && (
            <SlotSideControls
              bonusGame={bonusActive}
              spinning={spinning}
              controlsDisabled={controlsDisabled}
              spinSpeed={bonusActive ? bonusSpeed : spinSpeed}
              autoSpinActive={!bonusActive && autoplay.autoSpinEnabled}
              autoSpinRemaining={autoplay.autoSpinRemaining}
              autoplayDisabled={jurisdiction.disabledAutoplay}
              turboDisabled={jurisdiction.disabledTurbo}
              insufficientFunds={!bonusActive && cannotAffordBet}
              currency={currency}
              onSpin={handleSpinClick}
              onAutoSpinStart={autoplay.start}
              onAutoSpinStop={autoplay.stop}
              onSpeedCycle={handleSpeedCycle}
              onBuyBonus={bonusActive || jurisdiction.disabledBuyFeature ? undefined : () => setBuyBonusOpen(true)}
            />
          )}
        </div>
      </div>

      {!replay && (
        <div className="smp-stage-footer">
          <SlotBottomBar
            balance={balance}
            currency={currency}
            precision={precision}
            winAmount={displayedWinAmount}
            betAmount={betAmount}
            quickBets={quickBets}
            disabled={roundBusy || spinning || autoplay.autoSpin}
            onBetChange={setBetAmount}
          />
        </div>
      )}

      {replay && (
        <ReplayControls
          status={
            status === "error"
              ? "error"
              : status !== "ready"
                ? "loading"
                : spinning || roundBusy
                  ? "playing"
                  : replayFinished
                    ? "finished"
                    : replayReady
                      ? "ready"
                      : "loading"
          }
          spinning={spinning}
          onPlay={consumePendingRound}
          onPlayAgain={replayAgain}
          mode={replayMode}
          costMultiplier={replayCostMultiplier}
          payoutMultiplier={replayPayoutMultiplier}
          betAmount={betAmount}
          winAmount={displayedWinAmount}
          currency={currency}
          precision={precision}
        />
      )}

      {__TEST_TOOLS_ENABLED__ && (
        <button
          type="button"
          className="smp-test-btn-fixed"
          onClick={handleTestPanelClick}
          disabled={spinning || roundBusy}
          aria-label="Open test preset panel"
          title="Open test preset panel"
        >
          🧪
        </button>
      )}

      {exitUrl && (
        <button
          type="button"
          className="smp-home-btn-fixed"
          onClick={() => {
            window.location.href = exitUrl;
          }}
          aria-label="Exit game"
          title="Exit game"
        >
          <img src={homeBtnUrl} alt="" aria-hidden="true" />
        </button>
      )}

      <AutoplayStoppedModal
        open={autoplay.autoplayStoppedOpen}
        count={autoplay.lastAutoSpinCount}
        onClose={autoplay.closeAutoplayStoppedModal}
        onRepeat={() => {
          autoplay.closeAutoplayStoppedModal();
          autoplay.repeatLast();
        }}
      />

      <InsufficientFundsModal
        open={insufficientModalOpen}
        onClose={() => setInsufficientModalOpen(false)}
      />

      {__TEST_TOOLS_ENABLED__ && (
        <TestModal
          open={testOpen}
          onClose={() => setTestOpen(false)}
          onSelect={forceSpin}
          disabled={spinning || roundBusy}
        />
      )}
    </>
  );
}
