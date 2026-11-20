export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export type L = Record<Locale, string>;

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Pick the string for the current locale from a bilingual field. */
export const tr = (lang: Locale, value: L) => value[lang];

/** Localised path: href("en", "/propiedades") -> "/en/propiedades". */
export const href = (lang: Locale, path = "") => `/${lang}${path === "/" ? "" : path}`;
