import { FlaskConical, Grid2X2, Trophy, X } from "lucide-react";
import { sevenImg, lipsImg, parfumeImg, roseImg, glassImg, lipstickImg, gobletImg, heelsImg, wildImg, scatterImg, starImg } from "@/assets/symbols/images";
const testSymbolImages: Record<number, string> = { 1: sevenImg, 2: lipsImg, 3: parfumeImg, 4: roseImg, 5: glassImg, 6: lipstickImg, 7: gobletImg, 8: heelsImg, 9: wildImg, 10: scatterImg, 11: starImg };
import "./TestModal.css";
import type { ForceSpinPreset } from "@/hooks/useRgsSession";
import { TEST_PRESETS } from "./testPresets";

interface TestModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (preset: ForceSpinPreset) => void;
  disabled: boolean;
}

export function TestModal({
  open,
  onClose,
  onSelect,
  disabled,
}: TestModalProps) {
  if (!open) return null;

  function handleSelect(preset: ForceSpinPreset) {
    onSelect(preset);
    onClose();
  }

  return (
    <div className="smp-tm-backdrop" onClick={onClose}>
      <div className="smp-tm-panel" onClick={(e) => e.stopPropagation()}>
        <div className="smp-tm-header">
          <span className="smp-tm-title"><FlaskConical size={20} aria-hidden="true" /> Test Results</span>
          <button className="smp-tm-close" onClick={onClose} aria-label="Close">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <p className="smp-tm-hint">
          Force the next spin result — no server call, no balance deducted.
        </p>

        <div className="smp-tm-grid">
          {TEST_PRESETS.map((p) => (
            <button
              key={p.id}
              className="smp-tm-card"
              disabled={disabled}
              onClick={() => handleSelect(p.preset)}
            >
              <span
                className="smp-tm-card-badge"
                style={{ color: p.badgeColor }}
              >
                {p.iconSymbol ? <img className="smp-tm-symbol" src={testSymbolImages[p.iconSymbol]} alt="" draggable={false} /> : p.id === "showcase" ? <Grid2X2 size={32} aria-hidden="true" /> : <Trophy size={32} aria-hidden="true" />}
                <span>{p.badge}</span>
              </span>
              <span className="smp-tm-card-label">{p.label}</span>
              <span className="smp-tm-card-sub">{p.subtitle}</span>
              {(p.rewardLabel || p.preset.winAmount > 0) && (
                <span
                  className="smp-tm-card-win"
                  style={{ color: p.badgeColor }}
                >
                  {p.rewardLabel ?? `+${p.preset.winAmount}`}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
