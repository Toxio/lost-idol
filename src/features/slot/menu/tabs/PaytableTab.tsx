import { formatMoney } from "@/utils/currency";
import { t } from "@/utils/i18n";
import {
  ACCESSORY_IDS,
  DOLLAR_SCATTER_ID,
  LIPS_ID,
  PARFUME_ID,
  ROSE_ID,
  SEVEN_ID,
  STAR_SCATTER_ID,
  WILD_ID,
  payoutsForSymbol,
  SCATTER_FREE_SPINS,
} from "@/config/paytable";
import {
  glassImg,
  gobletImg,
  heelsImg,
  lipsImg,
  lipstickImg,
  parfumeImg,
  roseImg,
  scatterImg,
  sevenImg,
  starImg,
} from "@/assets/symbols/images";
import wildImg from "@/assets/bonus-buy/leaping-monkey.webp";
import "./PaytableTab.css";

const SYMBOL_IMAGE: Record<number, string> = {
  1: sevenImg,
  2: lipsImg,
  3: parfumeImg,
  4: roseImg,
  5: glassImg,
  6: lipstickImg,
  7: gobletImg,
  8: heelsImg,
  9: wildImg,
  10: scatterImg,
  11: starImg,
};

const BOTTOM_LINE_IDS = [SEVEN_ID, PARFUME_ID, ROSE_ID] as const;

interface PaytableTabProps {
  betAmount: number;
  currency: string;
  precision: number;
}

interface Payout {
  count: number;
  value: number;
}

function PayoutLine({
  count,
  value,
  precision,
  currency,
}: Payout & { precision: number; currency: string }) {
  return (
    <div className="smp-pt-payout-line">
      <span className="smp-pt-payout-mult">{count}×</span>
      <span className="smp-pt-payout-val">
        {formatMoney(value, currency, precision)}
      </span>
    </div>
  );
}

export function PaytableTab({
  betAmount,
  currency,
  precision,
}: PaytableTabProps) {
  const starPayouts = payoutsForSymbol(STAR_SCATTER_ID, betAmount);
  const accessoryPayouts = payoutsForSymbol(ACCESSORY_IDS[0], betAmount);

  return (
    <div className="smp-pt">
      <div className="smp-pt-specials">
        <div className="smp-pt-special-card">
          <div className="smp-pt-special-body">
            <img src={SYMBOL_IMAGE[LIPS_ID]} alt={t('paytable_treasury_title')} className="smp-pt-special-img" draggable={false} />
            <div className="smp-pt-special-info">
              <div className="smp-pt-special-tag">{t('paytable_treasury_title')}</div>
              <div className="smp-pt-payout-line"><span className="smp-pt-payout-mult">3</span><span className="smp-pt-payout-val">{t('paytable_treasury_status')}</span></div>
            </div>
          </div>
          <p className="smp-pt-special-note">{t('paytable_treasury_note')}</p>

        </div>
        <div className="smp-pt-special-card">
          <div className="smp-pt-special-body">
            <img
              src={SYMBOL_IMAGE[STAR_SCATTER_ID]}
              alt="Scarab SCATTER"
              className="smp-pt-special-img"
              draggable={false}
            />
            <div className="smp-pt-special-info">
              <div className="smp-pt-special-tag">{t("paytable_scatter")}</div>
              <div className="smp-pt-special-payouts">
                {starPayouts.map((p) => (
                  <PayoutLine
                    key={p.count}
                    {...p}
                    precision={precision}
                    currency={currency}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="smp-pt-special-note">{t("paytable_star_note")}</p>
        </div>

        <div className="smp-pt-special-card smp-pt-special-card--wild">
          <div className="smp-pt-wild-body">
            <img
              src={SYMBOL_IMAGE[WILD_ID]}
              alt="Wild"
              className="smp-pt-wild-img"
              draggable={false}
            />
            <div
              className="smp-pt-wild-multipliers"
              aria-label={t("bonus_wild_multipliers")}
            >
              {[1, 20].map((mult) => (
                <span key={mult} className="smp-pt-wild-mult">
                  ×{mult}
                </span>
              ))}
            </div>
          </div>
          <p className="smp-pt-special-note">{t("paytable_wild_note")}</p>
          <p className="smp-pt-special-note">{t("bonus_intro")}</p>
        </div>

        <div className="smp-pt-special-card">
          <div className="smp-pt-special-body">
            <img
              src={SYMBOL_IMAGE[DOLLAR_SCATTER_ID]}
              alt="BONUS"
              className="smp-pt-special-img"
              draggable={false}
            />
            <div className="smp-pt-special-info">
              <div className="smp-pt-special-tag">BONUS</div>
              <div className="smp-pt-special-payouts">
                {Object.entries(SCATTER_FREE_SPINS).map(([count, spins]) => (
                  <div className="smp-pt-payout-line" key={count}>
                    <span className="smp-pt-payout-mult">{count}×</span>
                    <span className="smp-pt-payout-val">{spins} {t("bonus_title")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="smp-pt-special-note">{t("paytable_dollar_note")}</p>
        </div>
      </div>

      <div className="smp-pt-grid">
        {BOTTOM_LINE_IDS.map((id) => {
          const payouts = payoutsForSymbol(id, betAmount);
          const img = SYMBOL_IMAGE[id];
          return (
            <div key={id} className="smp-pt-card">
              <img
                src={img}
                alt=""
                className="smp-pt-card-img"
                draggable={false}
              />
              <div className="smp-pt-card-payouts">
                {payouts.map((p) => (
                  <PayoutLine
                    key={p.count}
                    {...p}
                    precision={precision}
                    currency={currency}
                  />
                ))}
              </div>
            </div>
          );
        })}

        <div className="smp-pt-card">
          <div className="smp-pt-accessories" aria-label="Accessories">
            {ACCESSORY_IDS.map((id) => (
              <img
                key={id}
                src={SYMBOL_IMAGE[id]}
                alt=""
                className="smp-pt-accessory-img"
                draggable={false}
              />
            ))}
          </div>
          <div className="smp-pt-card-payouts">
            {accessoryPayouts.map((p) => (
              <PayoutLine
                key={p.count}
                {...p}
                precision={precision}
                currency={currency}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
