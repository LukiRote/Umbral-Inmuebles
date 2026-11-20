"use client";

import Image from "next/image";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { DESKTOP, gsap, introDelay, MOTION_OK, ScrollTrigger, SplitText } from "@/lib/gsap";

/* -------------------------------------------------------------------------- */
/* Split heading: lines/words rise out of a mask, on load or when scrolled to. */
/* -------------------------------------------------------------------------- */

export function Split({
  as: Tag = "div",
  children,
  className,
  onLoad = false,
  by = "words",
  stagger = 0.06,
  delay = 0,
  id,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  onLoad?: boolean;
  by?: "words" | "chars" | "lines";
  stagger?: number;
  delay?: number;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const split = SplitText.create(el, {
        type: by === "chars" ? "lines,words,chars" : by === "words" ? "lines,words" : "lines",
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          return gsap.from(self[by], {
            yPercent: 115,
            rotate: by === "chars" ? 6 : 2,
            duration: 1.4,
            stagger,
            ease: "expo.out",
            delay: onLoad ? introDelay() + delay : delay,
            scrollTrigger: onLoad ? undefined : { trigger: el, start: "top 88%", once: true },
          });
        },
      });
      return () => split.revert();
    });
    return () => mm.revert();
  }, [by, onLoad, stagger, delay]);
  return (
    <Tag ref={ref} id={id} className={className} data-split>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* Image that opens from a clipped band and settles from a slight zoom.       */
/* -------------------------------------------------------------------------- */

export function RevealImage({
  src,
  alt,
  sizes = "100vw",
  className = "",
  imgClassName = "",
  priority = false,
  onLoad = false,
  parallax = 0,
  from = "bottom",
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  onLoad?: boolean;
  parallax?: number;
  from?: "bottom" | "center" | "left";
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const clip = { bottom: "inset(100% 0% 0% 0%)", center: "inset(18% 18% 18% 18%)", left: "inset(0% 100% 0% 0%)" }[from];
      const tl = gsap.timeline({
        delay: onLoad ? introDelay() + 0.2 : 0,
        scrollTrigger: onLoad ? undefined : { trigger: frame.current, start: "top 90%", once: true },
      });
      tl.fromTo(frame.current, { clipPath: clip }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }).from(
        inner.current,
        { scale: 1.35, duration: 2, ease: "expo.out" },
        0.15,
      );
      if (parallax) {
        gsap.fromTo(
          inner.current,
          { yPercent: -parallax },
          { yPercent: parallax, ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      }
    });
    return () => mm.revert();
  }, [from, onLoad, parallax]);
  return (
    <div ref={frame} className={`${/\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative"} overflow-hidden bg-sand ${className}`}>
      <div ref={inner} className={`absolute ${parallax ? "-inset-y-[12%] inset-x-0" : "inset-0"}`}>
        <Image src={src} alt={alt} fill sizes={sizes} loading={priority ? "eager" : undefined} className={`object-cover ${imgClassName}`} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Paragraph whose words light up one by one while it scrolls through.        */
/* -------------------------------------------------------------------------- */

export function WordLight({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const words = ref.current!.querySelectorAll("span");
      gsap.fromTo(
        words,
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 45%", scrub: true } },
      );
    });
    return () => mm.revert();
  }, []);
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i}>{w} </span>
      ))}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Pinned section whose track slides sideways while the page scrolls down.    */
/* Desktop only; on phones and with reduced motion the track simply wraps.    */
/* -------------------------------------------------------------------------- */

export function HorizontalTrack({
  children,
  className = "",
  trackClassName = "",
  prevLabel,
  nextLabel,
}: {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const section = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const barWrap = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const scrollByCard = (dir: number) => scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.6, behavior: "smooth" });

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      // Pinned mode: the page scroll drives the track, so native sideways scrolling and the arrows step aside.
      gsap.set(scroller.current, { overflowX: "hidden" });
      gsap.set(controls.current, { display: "none" });
      gsap.set(barWrap.current, { display: "block" });
      const distance = () => track.current!.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
        },
      });
      // Cards inside skew slightly with scroll speed for a sense of weight.
      const cards = track.current!.querySelectorAll<HTMLElement>("[data-h-card]");
      cards.forEach((card) => {
        gsap.from(card.querySelector("[data-h-img]"), {
          scale: 1.25,
          ease: "none",
          scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, []);
  return (
    <div ref={section} className={`relative overflow-hidden ${className}`}>
      {/* Without the pinned animation (reduced motion) the strip scrolls sideways by itself. */}
      <div ref={scroller} className="overflow-x-auto scroll-px-[var(--gutter)] [scrollbar-color:var(--color-ink)_transparent] [scrollbar-width:thin] lg:snap-x lg:snap-mandatory">
        <div ref={track} className={`flex w-max flex-nowrap max-lg:w-full max-lg:flex-col lg:[&>*]:snap-start ${trackClassName}`}>
          {children}
        </div>
      </div>
      <div ref={controls} className="absolute right-[var(--gutter)] bottom-6 hidden gap-2 lg:flex">
        <button type="button" onClick={() => scrollByCard(-1)} aria-label={prevLabel} className="btn h-12 w-12 px-0">
          ←
        </button>
        <button type="button" onClick={() => scrollByCard(1)} aria-label={nextLabel} className="btn h-12 w-12 px-0">
          →
        </button>
      </div>
      <div ref={barWrap} className="absolute inset-x-[var(--gutter)] bottom-8 hidden h-px bg-ink/15">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-ink" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Number that counts up the first time it is seen.                           */
/* -------------------------------------------------------------------------- */

export function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const el = ref.current;
      if (!el) return;
      const o = { n: 0 };
      gsap.to(o, {
        n: value,
        duration: 2.2,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(o.n)}${suffix}`;
        },
        // Restore the real number if the tween is reverted mid-way.
        onInterrupt: () => {
          el.textContent = `${value}${suffix}`;
        },
      });
      return () => {
        el.textContent = `${value}${suffix}`;
      };
    });
    return () => mm.revert();
  }, [value, suffix]);
  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Pulls its child gently toward the pointer.                                 */
/* -------------------------------------------------------------------------- */

export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [strength]);
  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Children rise in sequence when the group enters the viewport.              */
/* -------------------------------------------------------------------------- */

export function Rise({ children, className = "", stagger = 0.08, onLoad = false, as: Tag = "div" }: { children: ReactNode; className?: string; stagger?: number; onLoad?: boolean; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(ref.current!.children, {
        y: 48,
        autoAlpha: 0,
        duration: 1.3,
        stagger,
        ease: "expo.out",
        delay: onLoad ? introDelay() + 0.35 : 0,
        scrollTrigger: onLoad ? undefined : { trigger: ref.current, start: "top 88%", once: true },
      });
    });
    return () => mm.revert();
  }, [stagger, onLoad]);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* Moves its content sideways as the page scrolls (for oversized words).      */
/* -------------------------------------------------------------------------- */

export function Drift({ children, amount = 20, className = "" }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        ref.current,
        { xPercent: amount },
        { xPercent: -amount, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });
    return () => mm.revert();
  }, [amount]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Recalculate every trigger once images and fonts have settled. */
export function RefreshOnLoad() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);
  return null;
}
