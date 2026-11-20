"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { href } from "@/i18n/config";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Logo } from "./logo";
import { useCurrency, useDict, useFavorites, useLang, useMounted } from "./providers";
import { TLink } from "./tlink";

export function Header() {
  const lang = useLang();
  const d = useDict();
  const pathname = usePathname();
  const [currency, setCurrency] = useCurrency();
  const { favs } = useFavorites();
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [solid, setSolid] = useState(false);

  const links = [
    { path: "/propiedades", label: d.nav.properties },
    { path: "/desarrollos", label: d.nav.developments },
    { path: "/tasaciones", label: d.nav.appraisal },
    { path: "/nosotros", label: d.nav.about },
    { path: "/contacto", label: d.nav.contact },
  ];
  const other = lang === "es" ? "en" : "es";
  const switchHref = pathname.replace(/^\/(es|en)(?=\/|$)/, `/${other}`);

  // Hide while scrolling down, come back on the way up.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setSolid(y > 40);
        if (open) return;
        gsap.to(bar.current, { yPercent: self.direction === 1 && y > 200 ? -110 : 0, duration: 0.6, ease: "expo.out", overwrite: "auto" });
      },
    });
    return () => st.kill();
  }, [open]);

  // Full-screen menu.
  useEffect(() => {
    const el = panel.current!;
    const items = el.querySelectorAll("[data-menu-item]");
    if (open) {
      window.__lenis?.stop();
      gsap.set(el, { display: "flex" });
      gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" });
      gsap.fromTo(items, { yPercent: 120 }, { yPercent: 0, duration: 1.1, stagger: 0.06, ease: "expo.out", delay: 0.35 });
    } else {
      window.__lenis?.start();
      gsap.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut", onComplete: () => void gsap.set(el, { display: "none" }) });
    }
  }, [open]);

  // Close the menu when the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (p: string) => pathname.startsWith(href(lang, p));

  return (
    <>
      <a href="#main" className="sr-only z-[200] rounded bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        {d.nav.skip}
      </a>
      <header
        ref={bar}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
          open ? "text-paper" : solid ? "bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : ""
        }`}
      >
        <div className="wrap flex h-[var(--header)] items-center justify-between gap-6">
          <TLink href={href(lang)} aria-label="Umbral" className="relative z-10 shrink-0">
            <Logo />
          </TLink>

          <nav aria-label={d.nav.menu} className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <TLink
                key={l.path}
                href={href(lang, l.path)}
                className={`ulink py-2 text-[0.78rem] font-medium tracking-[0.14em] uppercase ${isActive(l.path) ? "bg-[length:100%_1px]" : ""}`}
              >
                {l.label}
              </TLink>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-1 sm:gap-3">
            <div role="group" aria-label={d.common.currency} title={d.common.rateNote} className="hidden items-center rounded-full border border-current/25 p-0.5 text-[0.7rem] font-semibold tracking-[0.1em] sm:flex">
              {(["USD", "ARS"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={mounted && currency === c}
                  onClick={() => setCurrency(c)}
                  className={`min-h-9 rounded-full px-3 transition-colors duration-300 ${mounted && currency === c ? (open ? "bg-paper text-ink" : "bg-ink text-paper") : "hover:bg-current/10"}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <TLink
              href={switchHref}
              hrefLang={other}
              aria-label={`${d.common.language}: ${other.toUpperCase()}`}
              className="grid min-h-11 min-w-11 place-items-center text-[0.72rem] font-semibold tracking-[0.14em] uppercase"
            >
              {other}
            </TLink>
            <TLink href={href(lang, "/favoritos")} aria-label={`${d.nav.favorites} (${mounted ? favs.length : 0})`} className="relative grid min-h-11 min-w-11 place-items-center">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill={mounted && favs.length ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
              </svg>
              {mounted && favs.length > 0 && (
                <span className="absolute top-1 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[0.6rem] font-bold text-paper">{favs.length}</span>
              )}
            </TLink>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex min-h-11 items-center gap-3 pl-2 text-[0.75rem] font-medium tracking-[0.14em] uppercase lg:hidden"
            >
              {open ? d.nav.close : d.nav.menu}
              <span className="relative block h-3 w-6" aria-hidden>
                <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "top-1.5 rotate-45" : "top-0.5"}`} />
                <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "top-1.5 -rotate-45" : "top-2.5"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div ref={panel} id="site-menu" className="fixed inset-0 z-40 hidden flex-col justify-between bg-ink px-[var(--gutter)] pt-28 pb-10 text-paper">
        <nav aria-label={d.nav.menu} className="flex flex-col gap-1">
          {[{ path: "/", label: d.nav.home }, ...links].map((l, i) => (
            <div key={l.path} className="overflow-hidden">
              <TLink href={href(lang, l.path)} data-menu-item className="flex items-baseline gap-4 py-1">
                <span className="w-6 text-xs text-paper/50">0{i + 1}</span>
                <span className="display text-[clamp(2.6rem,11vw,5rem)]">{l.label}</span>
              </TLink>
            </div>
          ))}
        </nav>
        <div className="flex items-center justify-between gap-4 border-t border-paper/20 pt-6">
          <div role="group" aria-label={d.common.currency} className="flex rounded-full border border-paper/30 p-0.5 text-xs font-semibold tracking-[0.1em]">
            {(["USD", "ARS"] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={mounted && currency === c}
                onClick={() => setCurrency(c)}
                className={`min-h-11 rounded-full px-4 ${mounted && currency === c ? "bg-paper text-ink" : ""}`}
              >
                {c}
              </button>
            ))}
          </div>
          <span className="kicker text-paper/60">{d.footer.tagline}</span>
        </div>
      </div>
    </>
  );
}
