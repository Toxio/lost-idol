import { Modal } from "@/components/modal";
import { play as playSound } from "@/audio/soundManager";
import { t } from "@/utils/i18n";
import {
  autoplayStartOptionsFromSettings,
  SPIN_OPTIONS,
  STOP_VALUE_MAX,
  STOP_VALUE_MIN,
  STOP_VALUE_STEP,
  type AutoplayStartOptions,
  type AutoplaySettingsState,
} from "./autoplaySettings";
import { formatMoney } from "@/utils/currency";
import "./AutoSpinModal.css";

const incStop = (v: number) => Math.min(v + STOP_VALUE_STEP, STOP_VALUE_MAX);
const decStop = (v: number) => Math.max(v - STOP_VALUE_STEP, STOP_VALUE_MIN);

interface AutoSpinModalProps {
  settings: AutoplaySettingsState;
  onSettingsChange: (next: AutoplaySettingsState) => void;
  onStart: (options: AutoplayStartOptions) => void;
  onClose: () => void;
  currency: string;
}

export function AutoSpinModal({
  settings,
  onSettingsChange,
  onStart,
  onClose,
  currency,
}: AutoSpinModalProps) {
  const update = (patch: Partial<AutoplaySettingsState>) =>
    onSettingsChange({ ...settings, ...patch });
  const click = (fn: () => void) => () => {
    playSound("ui_button");
    fn();
  };

  const handleStart = () => {
    playSound("ui_button");
    onStart(autoplayStartOptionsFromSettings(settings));
    onClose();
  };

  return (
    <Modal
      title={t("autospin_title")}
      className="smp-asm-modal"
      onClose={onClose}
    >
      <div className="smp-asm-section">
        <div className="smp-asm-spins-grid">
          {SPIN_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`smp-asm-spin-option${settings.count === opt ? " smp-asm-spin-option--selected" : ""}`}
              onClick={click(() => update({ count: opt }))}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="smp-asm-section">
        <span className="smp-asm-section-label">
          {t("autospin_stop_label")}
        </span>

        <div className="smp-asm-row">
          <button
            type="button"
            className="smp-asm-row-main"
            onClick={click(() =>
              update({ stopAfterWin: !settings.stopAfterWin }),
            )}
            aria-pressed={settings.stopAfterWin}
          >
            <span className="smp-asm-row-label">
              {t("autospin_stop_after_win")}
            </span>
          </button>
          <button
            type="button"
            className={`smp-asm-switch${settings.stopAfterWin ? " smp-asm-switch--on" : ""}`}
            onClick={click(() =>
              update({ stopAfterWin: !settings.stopAfterWin }),
            )}
            aria-label={t("autospin_stop_after_win")}
            aria-pressed={settings.stopAfterWin}
          >
            <span className="smp-asm-switch-thumb" />
          </button>
        </div>

        <ValueConditionRow
          enabled={settings.winStopEnabled}
          value={settings.winStopValue}
          label={t("autospin_stop_win_reaches")}
          onToggle={() => update({ winStopEnabled: !settings.winStopEnabled })}
          onDec={() => update({ winStopValue: decStop(settings.winStopValue) })}
          onInc={() => update({ winStopValue: incStop(settings.winStopValue) })}
          min={STOP_VALUE_MIN}
          max={STOP_VALUE_MAX}
          currency={currency}
        />

        <ValueConditionRow
          enabled={settings.lossStopEnabled}
          value={settings.lossStopValue}
          label={t("autospin_stop_loss")}
          onToggle={() =>
            update({ lossStopEnabled: !settings.lossStopEnabled })
          }
          onDec={() =>
            update({ lossStopValue: decStop(settings.lossStopValue) })
          }
          onInc={() =>
            update({ lossStopValue: incStop(settings.lossStopValue) })
          }
          min={STOP_VALUE_MIN}
          max={STOP_VALUE_MAX}
          currency={currency}
        />
      </div>

      <button type="button" className="smp-modal-action" onClick={handleStart}>
        {t("autospin_start")}
      </button>
    </Modal>
  );
}

interface ValueConditionRowProps {
  enabled: boolean;
  value: number;
  label: string;
  onToggle: () => void;
  onDec: () => void;
  onInc: () => void;
  min: number;
  max: number;
  currency: string;
}

function ValueConditionRow({
  enabled,
  value,
  label,
  onToggle,
  onDec,
  onInc,
  min,
  max,
  currency,
}: ValueConditionRowProps) {
  const click = (fn: () => void) => () => {
    playSound("ui_button");
    fn();
  };
  return (
    <div className="smp-asm-row">
      <button
        type="button"
        className="smp-asm-row-main"
        onClick={click(onToggle)}
        aria-pressed={enabled}
      >
        <span className="smp-asm-row-label">{label}</span>
      </button>
      <div className="smp-asm-counter">
        <button
          type="button"
          className="smp-asm-counter-btn"
          onClick={click(onDec)}
          disabled={value <= min}
          aria-label="Decrease"
        >
          −
        </button>
        <span className="smp-asm-counter-value">
          {formatMoney(value, currency)}
        </span>
        <button
          type="button"
          className="smp-asm-counter-btn"
          onClick={click(onInc)}
          disabled={value >= max}
          aria-label="Increase"
        >
          +
        </button>
      </div>
      <button
        type="button"
        className={`smp-asm-switch${enabled ? " smp-asm-switch--on" : ""}`}
        onClick={click(onToggle)}
        aria-label={label}
        aria-pressed={enabled}
      >
        <span className="smp-asm-switch-thumb" />
      </button>
    </div>
  );
}
