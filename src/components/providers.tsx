"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { getDictionary, type Locale } from "@/i18n";
import { ARS_PER_USD } from "@/data/site";

/* ---------- Language ---------- */

const LangContext = createContext<Locale>("es");
export const useLang = () => useContext(LangContext);
export const useDict = () => getDictionary(useContext(LangContext));

/* ---------- Small localStorage store (survives private mode by falling back to memory) ---------- */

function createStore<T>(key: string, fallback: T) {
  let value = fallback;
  let loaded = false;
  const listeners = new Set<() => void>();
  const load = () => {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) value = JSON.parse(raw) as T;
    } catch {}
  };
  return {
    get: () => (load(), value),
    getServer: () => fallback,
    set(next: T) {
      value = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

const currencyStore = createStore<"USD" | "ARS">("umbral:currency", "USD");
const favStore = createStore<string[]>("umbral:favorites", []);

export function useCurrency() {
  const currency = useSyncExternalStore(currencyStore.subscribe, currencyStore.get, currencyStore.getServer);
  return [currency, currencyStore.set] as const;
}

export function useFavorites() {
  const favs = useSyncExternalStore(favStore.subscribe, favStore.get, favStore.getServer);
  const toggle = useCallback((slug: string) => {
    const cur = favStore.get();
    favStore.set(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]);
  }, []);
  return { favs, toggle, has: (slug: string) => favs.includes(slug) };
}

/** Format a USD amount in the visitor's chosen currency. */
export function useMoney() {
  const lang = useLang();
  const [currency] = useCurrency();
  return useCallback(
    (usd: number) => {
      const locale = lang === "es" ? "es-AR" : "en-US";
      const amount = currency === "USD" ? usd : usd * ARS_PER_USD;
      const n = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount);
      return currency === "USD" ? `USD ${n}` : `ARS ${n}`;
    },
    [lang, currency],
  );
}

/** True once the component is mounted in the browser (for values that differ from the server render). */
const noop = () => () => {};
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function Providers({ lang, children }: { lang: Locale; children: React.ReactNode }) {
  const value = useMemo(() => lang, [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}
