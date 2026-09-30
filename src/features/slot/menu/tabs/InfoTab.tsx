import bonusBuys from "@/config/bonusBuys.json";
import { bonusText } from "../../bonus/bonusText";
import line13Img from "@/assets/playtable/1-3_line.webp";
import line45Img from "@/assets/playtable/4-5_line.webp";
import line67Img from "@/assets/playtable/6-7_line.webp";
import line89Img from "@/assets/playtable/8-9_line.webp";
import line10Img from "@/assets/playtable/10_line.webp";
import spinImg from "@/assets/buttons/spin.webp";
import spinArrowsImg from "@/assets/buttons/spin_arrows.webp";
import autoSpinImg from "@/assets/buttons/auto_spin.webp";
import betImg from "@/assets/buttons/bet.webp";
import menuImg from "@/assets/buttons/menu.webp";
import soundOnImg from "@/assets/buttons/sound_on.webp";
import turboMaxImg from "@/assets/buttons/turbo.webp";
import balanceImg from "@/assets/buttons/balance.webp";
import { t } from "@/utils/i18n";
import { formatMoney } from "@/utils/currency";
import "./InfoTab.css";

const PAYLINES = [line13Img, line45Img, line67Img, line89Img, line10Img];

const CONTROLS = [
  {
    id: "spin",
    img: spinImg,
    labelKey: "info_ctrl_spin_label",
    descKey: "info_ctrl_spin_desc",
  },
  {
    id: "autospin",
    img: autoSpinImg,
    labelKey: "info_ctrl_autospin_label",
    descKey: "info_ctrl_autospin_desc",
  },
  {
    id: "speed",
    img: turboMaxImg,
    labelKey: "info_ctrl_speed_label",
    descKey: "info_ctrl_speed_desc",
  },
  {
    id: "bet",
    img: betImg,
    labelKey: "info_ctrl_bet_label",
    descKey: "info_ctrl_bet_desc",
  },
  {
    id: "menu",
    img: menuImg,
    labelKey: "info_ctrl_menu_label",
    descKey: "info_ctrl_menu_desc",
  },
  {
    id: "sound",
    img: soundOnImg,
    labelKey: "info_ctrl_sound_label",
    descKey: "info_ctrl_sound_desc",
  },
  {
    id: "balance",
    img: balanceImg,
    labelKey: "info_balance_label",
    descKey: "info_balance_desc",
  },
] as const;

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
          {PAYLINES.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Line diagram ${i + 1}`}
              draggable={false}
              className="smp-info-line-img"
            />
          ))}
        </div>
        <p className="smp-info-body">{t("info_paylines_body_1")}</p>
        <p className="smp-info-body">{t("info_paylines_body_2")}</p>
        <p className="smp-info-body">{t("info_paylines_body_3")}</p>
      </section>

      <section className="smp-info-section">
        <h3 className="smp-info-section-title">{t("info_controls_title")}</h3>
        <div className="smp-info-controls">
          {CONTROLS.map(({ id, img, labelKey, descKey }) => (
            <div key={id} className="smp-info-control-row">
              {id === "spin" ? (
                <span
                  className="smp-info-control-icon smp-info-control-icon--spin"
                  aria-hidden
                >
                  <img
                    src={img}
                    alt=""
                    draggable={false}
                    className="smp-info-control-icon__base"
                  />
                  <span className="smp-info-control-icon__arrows-wrap">
                    <img
                      src={spinArrowsImg}
                      alt=""
                      draggable={false}
                      className="smp-info-control-icon__arrows"
                    />
                  </span>
                </span>
              ) : (
                <span className={`smp-info-control-icon smp-info-control-icon--${id}`} aria-hidden>
                  <img src={img} alt="" draggable={false} />
                  {id === "bet" && <span className="smp-info-control-bet-arrows">‹<span>›</span></span>}
                </span>
              )}
              <p className="smp-info-body">
                <strong>{t(labelKey)}</strong> – {t(descKey)}
              </p>
            </div>
          ))}
        </div>
        <p className="smp-info-body"><strong className="smp-info-bonus-button">{t("buy_bonus_title")}</strong> – {t("info_ctrl_bonus_desc")}</p>
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
        <h3 className="smp-info-section-title">{bonusText.title}</h3>
        <p className="smp-info-body">{bonusText.rules}</p>
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
