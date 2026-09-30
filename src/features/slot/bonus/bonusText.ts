import { t } from "@/utils/i18n";

/** Uses the same locale and social-game overrides as the rest of the interface. */
export const bonusText = {
  title: t("bonus_title"),
  intro: t("bonus_intro"),
  rules: `${t("paytable_dollar_note")} ${t("bonus_intro")} ${t("bonus_limits")}`,
  start: t("bonus_start"),
  done: t("bonus_done"),
  collect: t("bonus_collect"),
  win: t("bonus_win"),
  wildMultipliers: t("bonus_wild_multipliers"),
};
