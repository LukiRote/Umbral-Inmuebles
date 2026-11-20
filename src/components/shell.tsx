"use client";

import Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { gsap, ScrollTrigger, transition } from "@/lib/gsap";
import { LogoMark } from "./logo";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const NavigateContext = createContext<(href: string) => void>(() => {});
export const useNavigate = () => useContext(NavigateContext);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Smooth scrolling plus the "threshold" page transition: two ink panels close like doors,
 * the route changes behind them, and they open on the new page.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const safety = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (reduced()) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  const open = useCallback(() => {
    window.clearTimeout(safety.current);
    window.__lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      gsap
        .timeline({
          onComplete: () => {
            busy.current = false;
            gsap.set([left.current, right.current, mark.current], { display: "none" });
          },
        })
        .to(mark.current, { autoAlpha: 0, y: -16, duration: 0.35, ease: "power2.in" })
        .to(left.current, { xPercent: -100, duration: 1, ease: "expo.inOut" }, 0.15)
        .to(right.current, { xPercent: 100, duration: 1, ease: "expo.inOut" }, 0.15);
    });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        if (url.search !== window.location.search) router.push(href, { scroll: false });
        else if (window.__lenis) window.__lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (reduced()) {
        router.push(href);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      transition.at = performance.now();
      gsap
        .timeline({ onComplete: () => router.push(href, { scroll: false }) })
        .set([left.current, right.current], { display: "block" })
        .set(mark.current, { display: "flex" })
        .fromTo(left.current, { xPercent: -100 }, { xPercent: 0, duration: 0.75, ease: "expo.inOut" }, 0)
        .fromTo(right.current, { xPercent: 100 }, { xPercent: 0, duration: 0.75, ease: "expo.inOut" }, 0)
        .fromTo(mark.current, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0.45);
      // If the route never changes (an error, a slow network), open the doors anyway.
      safety.current = window.setTimeout(open, 6000);
    },
    [router, open],
  );

  useEffect(() => {
    if (busy.current) open();
  }, [pathname, open]);

  return (
    <NavigateContext.Provider value={navigate}>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
        <div ref={left} className="absolute inset-y-0 left-0 hidden w-1/2 bg-ink" />
        <div ref={right} className="absolute inset-y-0 right-0 hidden w-1/2 bg-ink" />
        <div ref={mark} className="absolute inset-0 hidden flex-col items-center justify-center gap-4 text-paper">
          <LogoMark className="h-14 w-auto" />
          <span className="font-display font-medium text-3xl tracking-[0.2em] uppercase">Umbral</span>
        </div>
      </div>
    </NavigateContext.Provider>
  );
}
