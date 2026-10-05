import bonusBuys from "@/config/bonusBuys.json";
import { bonusText } from "../../bonus/bonusText";
import { RotateCw, Zap, Menu, Volume2, Coins } from 'lucide-react';
import { getPaylineForLineId } from '@/config/paylines';
import { t } from "@/utils/i18n";
import { formatMoney } from "@/utils/currency";
import "./InfoTab.css";

const CONTROLS = [
  { id: 'spin', icon: RotateCw, labelKey: 'info_ctrl_spin_label', descKey: 'info_ctrl_spin_desc' },
  { id: 'autospin', icon: RotateCw, labelKey: 'info_ctrl_autospin_label', descKey: 'info_ctrl_autospin_desc' },
  { id: 'speed', icon: Zap, labelKey: 'info_ctrl_speed_label', descKey: 'info_ctrl_speed_desc' },
  { id: 'bet', icon: Coins, labelKey: 'info_ctrl_bet_label', descKey: 'info_ctrl_bet_desc' },
  { id: 'menu', icon: Menu, labelKey: 'info_ctrl_menu_label', descKey: 'info_ctrl_menu_desc' },
  { id: 'sound', icon: Volume2, labelKey: 'info_ctrl_sound_label', descKey: 'info_ctrl_sound_desc' },
] as const;

function PaylineDiagram({ line }: { line: number }) {
  const rows = getPaylineForLineId(line);
  if (!rows) return null;
  return <figure className="smp-info-payline">
    <figcaption>{line}</figcaption>
    <svg viewBox="0 0 170 104" role="img" aria-label={`${t('info_paylines_title')} ${line}`}>
      {Array.from({ length: 15 }, (_, cell) => {
        const col = cell % 5, row = Math.floor(cell / 5);
        return <rect key={cell} x={5 + col * 33} y={5 + row * 33} width="28" height="28" rx="5"
          fill={rows[col] === row ? '#28553b' : '#10251f'} stroke={rows[col] === row ? '#b8ce83' : '#355045'} />;
      })}
      <polyline points={rows.map((row, col) => `${19 + col * 33},${19 + row * 33}`).join(' ')} fill="none" stroke="#f2d482" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {rows.map((row, col) => <circle key={col} cx={19 + col * 33} cy={19 + row * 33} r="3.5" fill="#fff0b5" />)}
    </svg>
  </figure>;
}

interface InfoTabProps {
  minBet: number;
  maxBet: number;
  currency: string;
  precision: number;
}

export function InfoTab({ minBet, maxBet, currency, precision }: InfoTabProps) {
  return (
    <div className="smp-info">
      <section className="smp-info-section">
        <h3 className="smp-info-section-title">{t("info_intro_title")}</h3>
        <p className="smp-info-body">{t("info_intro_body")}</p>
      </section>

      <section className="smp-info-section">
        <h3 className="smp-info-section-title">WILD</h3>
        <p className="smp-info-body">{t('paytable_wild_note')}</p>
      </section>
      <section className="smp-info-section">
        <h3 className="smp-info-section-title">{bonusText.title}</h3>
        <p className="smp-info-body">{bonusText.rules}</p>
      </section>
      <section className="smp-info-section">
        <h3 className="smp-info-section-title">{t('paytable_scatter')}</h3>
        <p className="smp-info-body">{t('paytable_star_note')}</p>
      </section>
      <section className="smp-info-section">
        <h3 className="smp-info-section-title">{t("buy_bonus_title")}</h3>
        {bonusBuys.map((plan) => <p className="smp-info-body" key={plan.mode}>
          {plan.kind === "wild_spin" ? t("wild_spin_title") : `${plan.spins} · ${t("bonus_title")}`} — {t("buy_bonus_cost")}: {plan.cost}× {t("bet_title")}
        </p>)}
        <p className="smp-info-body">{t("buy_bonus_rules")}</p>
        <p className="smp-info-body">{t("wild_spin_rules")}</p>
      </section>

      <section className="smp-info-section">
        <h3 className="smp-info-section-title">{t("info_howtobet_title")}</h3>
        <p className="smp-info-body">{t("info_howtobet_1")}</p>
      </section>

      <section className="smp-info-section">
        <h3 className="smp-info-section-title">{t("info_paylines_title")}</h3>
        <div className="smp-info-lines">
          {Array.from({ length: 10 }, (_, i) => <PaylineDiagram key={i + 1} line={i + 1} />)}
        </div>
        <p className="smp-info-body">{t("info_paylines_body_1")}</p>
        <p className="smp-info-body">{t("info_paylines_body_2")}</p>
        <p className="smp-info-body">{t("info_paylines_body_3")}</p>
      </section>

      <section className="smp-info-section">
        <h3 className="smp-info-section-title">{t("info_controls_title")}</h3>
        <div className="smp-info-controls">
          {CONTROLS.map(({ id, icon: Icon, labelKey, descKey }) => (
            <div key={id} className="smp-info-control-row">
              <span className="smp-info-control-glyph" aria-hidden="true">
                <Icon />{id === 'autospin' && <small>A</small>}
              </span>
              <p className="smp-info-body"><strong>{t(labelKey)}</strong><br />{t(descKey)}</p>
            </div>
          ))}
        </div>
        <p className="smp-info-body"><strong>{t("info_balance_label")}</strong> – {t("info_balance_desc")}</p>
        <p className="smp-info-body"><strong>{t("buy_bonus_title")}</strong> – {t("info_ctrl_bonus_desc")}</p>
        <p className="smp-info-body"><strong>{t("bonus_title")}</strong> – {t("info_ctrl_feature_desc")}</p>
        <p className="smp-info-body"><strong>{t("menu_info")}</strong> – {t("info_ctrl_windows_desc")}</p>
        <p className="smp-info-body"><strong>{t("replay_play")} / {t("replay_play_again")}</strong> – {t("info_ctrl_replay_desc")}</p>
      </section>

      <section className="smp-info-section">
        <h3 className="smp-info-section-title">{t("info_rules_title")}</h3>
        <ul className="smp-info-rules">
          <li>{t("info_rule_1")}</li>
          <li>{t("info_rule_2")}</li>
          <li>{t("info_rule_3")}</li>
          <li>{t("info_rule_4")}</li>
          <li>
            <strong>
              {t("info_rule_minbet")} {formatMoney(minBet, currency, precision)}
            </strong>
          </li>
          <li>
            <strong>
              {t("info_rule_maxbet")} {formatMoney(maxBet, currency, precision)}
            </strong>
          </li>
        </ul>
      </section>



      <section className="smp-info-section">
        <h3 className="smp-info-section-title">
          {t("info_interruptions_title")}
        </h3>
        <p className="smp-info-body">
          <strong>{t("info_recovery_label")}</strong>
          <br />
          {t("info_recovery_desc")}
        </p>
        <p className="smp-info-body">
          <strong>{t("info_cancellation_label")}</strong>
          <br />
          {t("info_cancellation_desc")}
        </p>
      </section>

      <section className="smp-info-section">
        <h3 className="smp-info-section-title">
          {t("info_responsible_title")}
        </h3>
        <p className="smp-info-body">
          <strong>{t("info_responsible_autoplay_label")}</strong>
          <br />
          {t("info_responsible_autoplay_desc")}
        </p>
      </section>

      <section className="smp-info-section">
        <h3 className="smp-info-section-title">{t("info_rtp_title")}</h3>
        <p className="smp-info-body">{t("info_rtp_body")}</p>
      </section>

      <section className="smp-info-section">
        <h3 className="smp-info-section-title">
          {t("info_disclaimer_title")}
        </h3>
        <p className="smp-info-body" style={{ whiteSpace: "pre-line" }}>
          {t("info_disclaimer_body")}
        </p>
      </section>
    </div>
  );
}
