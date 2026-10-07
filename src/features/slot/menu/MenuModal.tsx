import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Gem, BookOpen, X } from "lucide-react";
import { play as playSound } from "@/audio/soundManager";
import { useBackdropDismiss } from "@/hooks/useBackdropDismiss";
import { t } from "@/utils/i18n";
import { InfoTab } from "./tabs/InfoTab";
import { PaytableTab } from "./tabs/PaytableTab";
import "./MenuModal.css";

type MenuTab = "paytable" | "info";

const TABS: Array<{ id: MenuTab; icon: ReactNode }> = [
  { id: "paytable", icon: <Gem size={18} /> },
  { id: "info", icon: <BookOpen size={18} /> },
];

const TAB_LABEL_KEYS: Record<MenuTab, Parameters<typeof t>[0]> = {
  paytable: "menu_paytable",
  info: "menu_info",
};

interface MenuModalProps {
  onClose: () => void;
  minBet: number;
  maxBet: number;
  currency: string;
  precision: number;
  betAmount: number;
}

export function MenuModal({
  onClose,
  minBet,
  maxBet,
  currency,
  precision,
  betAmount,
}: MenuModalProps) {
  const [activeTab, setActiveTab] = useState<MenuTab>("paytable");
  const { onBackdropClick, stopDialogPropagation } =
    useBackdropDismiss(onClose);

  return createPortal(
    <div
      className="smp-menu-backdrop"
      role="presentation"
      onClick={onBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="smp-menu-dialog"
        onMouseDown={stopDialogPropagation}
        onClick={stopDialogPropagation}
      >
        <nav className="smp-menu-sidebar" aria-label="Menu tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`smp-menu-tab${activeTab === tab.id ? " smp-menu-tab--active" : ""}`}
              onClick={() => {
                playSound("ui_button");
                setActiveTab(tab.id);
              }}
              aria-pressed={activeTab === tab.id}
            >
              <span className="smp-menu-tab__icon" aria-hidden="true">
                {tab.icon}
              </span>
              {t(TAB_LABEL_KEYS[tab.id])}
            </button>
          ))}
        </nav>

        <div className="smp-menu-content">
          <div className="smp-menu-content-header">
            <button
              type="button"
              className="smp-menu-close"
              onClick={() => {
                playSound("ui_button");
                onClose();
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          <div className="smp-menu-content-body">
            {activeTab === "paytable" && (
              <PaytableTab
                betAmount={betAmount}
                currency={currency}
                precision={precision}
              />
            )}
            {activeTab === "info" && (
              <InfoTab
                minBet={minBet}
                maxBet={maxBet}
                currency={currency}
                precision={precision}
              />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
