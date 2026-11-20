"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, introDelay, MOTION_OK } from "@/lib/gsap";
import { Split } from "./motion";

/**
 * Detail page opener: the name set huge over a small photo window.
 * Scrolling opens the window to the full screen while the name lifts away.
 */
export function DetailHero({ title, src, alt, meta, back }: { title: string; src: string; alt: string; meta: React.ReactNode; back?: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLDivElement>(null);
  const info = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({ delay: introDelay() })
        .fromTo(win.current, { clipPath: "inset(50% 50% 50% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" })
        .from(img.current, { scale: 1.6, duration: 2.2, ease: "expo.out" }, 0.2)
        .from(info.current, { y: 30, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, 0.8);

      const tl = gsap.timeline({ scrollTrigger: { trigger: section.current, start: "top top", end: "+=120%", scrub: 1, pin: true } });
      tl.to(win.current, { width: "100vw", height: "100svh", ease: "power2.inOut" }, 0)
        .to(name.current, { yPercent: -60, autoAlpha: 0, ease: "power2.in" }, 0)
        .to(info.current, { autoAlpha: 0, ease: "power1.in" }, 0);
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative grid h-[100svh] place-items-center overflow-hidden">
      <div ref={win} className="absolute top-1/2 left-1/2 h-[46svh] w-[min(34vw,520px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-sand max-md:w-[70vw]">
        <div ref={img} className="absolute inset-0">
          <Image src={src} alt={alt} fill loading="eager" fetchPriority="high" sizes="100vw" className="object-cover" />
        </div>
      </div>
      <div ref={name} className="relative z-10 w-full px-[var(--gutter)] text-center text-paper mix-blend-difference">
        <Split as="h1" by="chars" onLoad stagger={0.04} delay={0.3} className="display text-[clamp(3.2rem,13vw,14rem)] leading-[0.82]">
          {title}
        </Split>
      </div>
      <div ref={info} className="absolute inset-x-0 bottom-0 z-10">
        <div className="wrap flex flex-wrap items-end justify-between gap-4 pb-8">
          {back}
          {meta}
        </div>
      </div>
    </section>
  );
}
