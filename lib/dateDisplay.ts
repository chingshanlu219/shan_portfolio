export type SeasonLang = "en" | "zh" | "fr" | "es";

const SEASON_LABELS: Record<string, Record<SeasonLang, string>> = {
  spring: { en: "Spring", zh: "春", fr: "Printemps", es: "Primavera" },
  summer: { en: "Summer", zh: "夏", fr: "Été", es: "Verano" },
  fall: { en: "Fall", zh: "秋", fr: "Automne", es: "Otoño" },
  winter: { en: "Winter", zh: "冬", fr: "Hiver", es: "Invierno" },
};

/** Map i18n language code to season display language */
export function getSeasonLang(language: string): SeasonLang {
  if (language.startsWith("zh")) return "zh";
  if (language === "fr") return "fr";
  if (language === "es") return "es";
  return "en";
}

/** Format year and season for display. e.g. "2024 Spring" or "2024 春" or "2024 Printemps" */
export function formatYearSeason(
  year: number | null | undefined,
  season: string | null | undefined,
  lang: SeasonLang = "en"
): string {
  const parts: string[] = [];
  if (year != null) parts.push(String(year));
  if (season && SEASON_LABELS[season]?.[lang]) {
    parts.push(SEASON_LABELS[season][lang]);
  } else if (season && SEASON_LABELS[season]) {
    parts.push(SEASON_LABELS[season].en); // fallback
  }
  return parts.join(" ") || "";
}
