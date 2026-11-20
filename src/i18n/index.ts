import { es } from "./es";
import { en } from "./en";
import type { Locale } from "./config";

export * from "./config";
export type { Dict } from "./es";

const dictionaries = { es, en };

export const getDictionary = (lang: Locale) => dictionaries[lang];
