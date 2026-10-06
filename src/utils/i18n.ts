import { ar } from "@/locales/ar";
import { de } from "@/locales/de";
import { en, type TranslationKey } from "@/locales/en";
import { es } from "@/locales/es";
import { fi } from "@/locales/fi";
import { fr } from "@/locales/fr";
import { hi } from "@/locales/hi";
import { id } from "@/locales/id";
import { ja } from "@/locales/ja";
import { ko } from "@/locales/ko";
import { po } from "@/locales/po";
import { pt } from "@/locales/pt";
import { ru } from "@/locales/ru";
import { tr } from "@/locales/tr";
import { vi } from "@/locales/vi";
import { zh } from "@/locales/zh";
import { sweeps_en } from "@/locales/sweeps_en";
import { getGameUrlParams } from "./getGameUrlParams";

/** Stake Engine `?lang=` codes. `pl` is an ISO alias for Stake's `po` (Polish). */
const LOCALES: Record<string, Record<TranslationKey, string>> = {
  ar,
  de,
  en,
  es,
  fi,
  fr,
  hi,
  id,
  ja,
  ko,
  po,
  pl: po,
  pt,
  ru,
  tr,
  zh,
  vi,
};

/** Sweeps (US social-casino) overrides, applied when `?social=true`.
 *  A partial override — missing keys fall through to the normal locale. */
const SWEEPS_OVERRIDES: Record<string, Partial<Record<TranslationKey, string>>> = {
  en: sweeps_en,
};

function resolveLocale(): string {
  const params = getGameUrlParams();
  if (params.social) return "en";
  const lang = (params.lang || params.culture).toLowerCase().split("-")[0];
  return LOCALES[lang] ? lang : "en";
}

export const locale = resolveLocale();
const params = getGameUrlParams();
const base = LOCALES[locale] ?? en;
const overrides = params.social ? SWEEPS_OVERRIDES[locale] ?? SWEEPS_OVERRIDES.en : null;
const translations: Record<TranslationKey, string> = overrides
  ? { ...base, ...overrides }
  : base;

export function t(key: TranslationKey): string {
  return translations[key] ?? en[key];
}
