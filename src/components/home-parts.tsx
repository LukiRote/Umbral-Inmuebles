"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { href } from "@/i18n/config";
import type { Development } from "@/data/developments";
import { zoneById } from "@/data/zones";
import { gsap, introDelay, MOTION_OK } from "@/lib/gsap";
import { Price } from "./property-bits";
import { useDict, useLang } from "./providers";
import { TLink } from "./tlink";

/* -------------------------------------------------------------------------- */
/* Threshold: a doorway-shaped window that opens to the full screen.          */
/* -------------------------------------------------------------------------- */

export function Threshold({ src, kicker, a, b }: { src: string; kicker: string; a: string; b: string }) {
  const section = useRef<HTMLElement>(null);
  const door = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);

  // The words always sit on the paper, never on the photo: beside the door on wide
  // screens, above it on phones. They leave before the door opens over them.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add({ wide: `(min-width: 768px) and ${MOTION_OK}`, narrow: `(max-width: 767px) and ${MOTION_OK}` }, (ctx) => {
      const wide = ctx.conditions!.wide;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: "top top", end: "+=180%", pin: true, scrub: 1 },
      });
      tl.fromTo(
        door.current,
        { clipPath: wide ? "inset(14% 36% 6% 36% round 600px 600px 0px 0px)" : "inset(36% 8% 5% 8% round 400px 400px 0px 0px)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: "power2.inOut" },
        0,
      )
        .fromTo(img.current, { scale: 1.45 }, { scale: 1, ease: "power2.inOut" }, 0)
        .to(left.current, wide ? { xPercent: -40, autoAlpha: 0, ease: "power2.in", duration: 0.45 } : { yPercent: -60, autoAlpha: 0, duration: 0.3 }, 0)
        .to(right.current, wide ? { xPercent: 40, autoAlpha: 0, ease: "power2.in", duration: 0.45 } : { yPercent: -60, autoAlpha: 0, duration: 0.3 }, 0);
    });
    return () => mm.revert();
  }, []);

  const [a1, ...aRest] = a.split(" ");
  const [b1, ...bRest] = b.split(" ");

  return (
    <section ref={section} aria-label={`${a} ${b}`} className="relative h-[100svh] overflow-hidden bg-paper">
      <div
        ref={door}
        className="absolute inset-0 [clip-path:inset(36%_8%_5%_8%_round_400px_400px_0px_0px)] md:[clip-path:inset(14%_36%_6%_36%_round_600px_600px_0px_0px)]"
      >
        <div ref={img} className="absolute inset-0">
          <Image src={src} alt="" fill sizes="100vw" className="object-cover" />
        </div>
      </div>
      <p className="kicker absolute top-[5%] left-1/2 -translate-x-1/2 md:top-[6%]">{kicker}</p>
      <h2 className="display pointer-events-none absolute inset-x-0 top-[11%] flex flex-col items-center gap-1 px-[var(--gutter)] text-center text-[clamp(2.4rem,11vw,3.6rem)] md:top-1/2 md:-translate-y-1/2 md:flex-row md:items-center md:justify-between md:text-[clamp(2.6rem,5.6vw,6.5rem)]">
        <span ref={left} className="block md:w-[30vw] md:text-left">
          {a1} <br className="max-md:hidden" />
          {aRest.join(" ")}
        </span>
        <span ref={right} className="italic-accent block md:w-[30vw] md:text-right">
          {b1} <br className="max-md:hidden" />
          {bRest.join(" ")}
        </span>
      </h2>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Developments list: rows with a photo that follows the pointer.             */
/* -------------------------------------------------------------------------- */

export function DevList({ items }: { items: Development[] }) {
  const lang = useLang();
  const d = useDict();
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  // The last hovered row keeps its photo and price on screen while the frame fades out.
  const [shown, setShown] = useState(0);
  const enter = (k: number) => {
    setActive(k);
    setShown(k);
  };

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = float.current!;
    // Sits just to the right of the pointer so it never covers the name being read.
    gsap.set(el, { yPercent: -50 });
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const move = (e: PointerEvent) => {
      x(e.clientX + 28);
      y(e.clientY);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    gsap.to(float.current, { autoAlpha: active === null ? 0 : 1, scale: active === null ? 0.94 : 1, duration: 0.45, ease: "power3.out" });
  }, [active]);

  return (
    <div onPointerLeave={() => setActive(null)}>
      <ul className="border-t border-paper/20">
        {items.map((dev, k) => {
          const zone = zoneById(dev.zone);
          const date = new Date(`${dev.delivery}-01T12:00:00`).toLocaleDateString(lang === "es" ? "es-AR" : "en-US", { month: "long", year: "numeric" });
          return (
            <li key={dev.slug} className="border-b border-paper/20">
              <TLink
                href={href(lang, `/desarrollos/${dev.slug}`)}
                onPointerEnter={() => enter(k)}
                onFocus={() => enter(k)}
                onBlur={() => setActive(null)}
                className="group grid items-end gap-4 py-8 md:grid-cols-12 md:py-10"
              >
                <div className="relative aspect-[16/10] overflow-hidden md:hidden">
                  <Image src={dev.cover} alt="" fill sizes="100vw" className="object-cover" />
                </div>
                <span className="kicker text-paper/50 md:col-span-1">0{k + 1}</span>
                <span className="display text-[clamp(2.6rem,5.4vw,6rem)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-4 md:col-span-6">
                  {dev.name}
                </span>
                <span className="text-sm text-paper/70 md:col-span-2">{zone.name}</span>
                <span className="text-sm text-paper/70 md:col-span-2">
                  {d.dev.delivery} {date}
                </span>
                <span className="flex items-center gap-3 md:col-span-1 md:justify-end">
                  <span className="text-sm tabular-nums">{dev.progress}%</span>
                </span>
              </TLink>
            </li>
          );
        })}
      </ul>
      <div
        ref={float}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-30 hidden w-[13vw] max-w-[210px] min-w-[160px] bg-paper p-1.5 text-ink opacity-0 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.6)] md:block"
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {items.map((dev, k) => (
            <Image
              key={dev.slug}
              src={dev.cover}
              alt=""
              fill
              sizes="210px"
              className={`object-cover transition-opacity duration-400 ${shown === k ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
        <p className="px-1 pt-2 pb-1 text-[0.7rem] leading-tight">
          <span className="eyebrow text-muted">{d.common.from} </span>
          <Price usd={Math.min(...items[shown].units.map((u) => u.priceUsd))} className="font-semibold" />
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero image: opens upward on load, then drifts slower than the page.        */
/* -------------------------------------------------------------------------- */

export function HeroImage({ src, alt }: { src: string; alt: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({ delay: introDelay() + 0.1 })
        .fromTo(frame.current, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut" })
        .from(inner.current, { scale: 1.4, duration: 2.4, ease: "expo.out" }, 0.3);
      gsap.to(inner.current, { yPercent: 12, ease: "none", scrollTrigger: { trigger: frame.current, start: "top top", end: "bottom top", scrub: true } });
    });
    return () => mm.revert();
  }, []);
  return (
    <div ref={frame} className="absolute inset-0 overflow-hidden bg-sand">
      <div ref={inner} className="absolute -inset-y-[8%] inset-x-0">
        <Image src={src} alt={alt} fill loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" />
      </div>
    </div>
  );
}
