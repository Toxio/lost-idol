import { t } from "@/utils/i18n";
import { createPortal } from "react-dom";
import { scatterImg } from "@/assets/symbols/images";
import { play as playSound } from "@/audio/soundManager";
import "@/components/modal/Modal.css";
import type { BonusState } from "@/hooks/useRgsSession";
import { CurrencyAmount } from "@/components/CurrencyAmount";
import { bonusText } from "./bonusText";
import "./BonusFeature.css";

export function BonusFeature({
  bonus,
  introReady = true,
  currency,
  precision,
  onContinue,
}: {
  bonus: BonusState;
  introReady?: boolean;
  currency: string;
  precision: number;
  onContinue: () => void;
}) {
  if (bonus.phase === "idle") return null;
  const modal = (bonus.phase === "intro" && introReady) || bonus.phase === "summary";
  return (
    <>
      <div className="bonus-status" role="status">
        <div className="bonus-status__section">
          <span className="bonus-status__label">{bonusText.title}</span>
          <strong className="bonus-status__value">
            {bonus.current}
            <span className="bonus-status__total"> / {bonus.total}</span>
          </strong>
        </div>
        <div className="bonus-status__section">
          <span className="bonus-status__label">{bonusText.win}</span>
          <strong className="bonus-status__value">
            <CurrencyAmount
              value={bonus.totalWin}
              currency={currency}
              precision={precision}
              trimZeros
            />
          </strong>
        </div>
      </div>
      {modal &&
        createPortal(
          <div className="smp-modal-backdrop bonus-backdrop">
            <section
              className={`smp-modal-dialog bonus-dialog${bonus.phase === "intro" ? " bonus-dialog--intro" : ""}`}
              role="dialog"
              aria-modal="true"
              aria-labelledby="bonus-heading"
            >
              <img
                className="bonus-dialog__symbol"
                src={scatterImg}
                alt=""
                aria-hidden="true"
                draggable={false}
              />
              <h2 id="bonus-heading" className="smp-modal-title">
                {bonus.phase === "intro" ? bonusText.title : bonusText.done}
              </h2>
              {bonus.phase === "intro" ? (
                <>
                  <div className="bonus-dialog__number">{bonus.total}</div>
                  <p className="smp-modal-subtitle bonus-dialog__description">
                    {bonus.purchased ? t("buy_bonus_rules") : `${bonusText.intro} ${t("bonus_limits")}`}
                  </p>
                </>
              ) : (
                <>
                  <p className="bonus-dialog__label">{bonusText.win}</p>
                  <div className="bonus-dialog__number">
                    <CurrencyAmount
                      value={bonus.totalWin}
                      currency={currency}
                      precision={precision}
                      trimZeros
                    />
                  </div>
                </>
              )}
              <button
                type="button"
                className="smp-modal-action"
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Tab") event.preventDefault();
                }}
                onClick={() => {
                  playSound("ui_button");
                  onContinue();
                }}
              >
                {bonus.phase === "intro" ? bonusText.start : bonusText.collect}
              </button>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}
