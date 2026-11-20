"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { RevealImage } from "./motion";
import { useDict } from "./providers";

/** Editorial photo grid; any photo opens a full-screen viewer with arrows and keyboard control. */
export function Gallery({ photos, title }: { photos: string[]; title: string }) {
  const d = useDict();
  const dialog = useRef<HTMLDialogElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const n = photos.length;

  const show = useCallback(
    (next: number, dir = 1) => {
      const k = (next + n) % n;
      gsap.fromTo(img.current, { xPercent: 6 * dir, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out" });
      setI(k);
    },
    [n],
  );

  const open = (k: number) => {
    setI(k);
    dialog.current?.showModal();
    window.__lenis?.stop();
    gsap.fromTo(dialog.current, { clipPath: "inset(50% 0% 50% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" });
  };
  const close = () => dialog.current?.close();

  useEffect(() => {
    const el = dialog.current!;
    const onClose = () => window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => {
      if (!el.open) return;
      if (e.key === "ArrowRight") show(i + 1, 1);
      if (e.key === "ArrowLeft") show(i - 1, -1);
    };
    el.addEventListener("close", onClose);
    window.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("close", onClose);
      window.removeEventListener("keydown", onKey);
    };
  }, [i, show]);

  // Layout: one wide frame, then pairs; tall/wide alternate for rhythm.
  const shapes = ["md:col-span-12 aspect-[16/9]", "md:col-span-5 aspect-[4/5]", "md:col-span-7 aspect-[4/3] md:mt-24", "md:col-span-7 aspect-[4/3]", "md:col-span-5 aspect-[4/5] md:-mt-16"];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-12 md:gap-6">
        {photos.map((src, k) => (
          <button
            key={src}
            type="button"
            onClick={() => open(k)}
            aria-label={`${title} — ${d.property.photo(k + 1, n)}`}
            className={`zoom group relative block w-full text-left ${shapes[k % shapes.length]} max-md:aspect-[4/3]`}
          >
            <RevealImage src={src} alt="" sizes="(min-width: 768px) 60vw, 100vw" className="absolute inset-0" parallax={k === 0 ? 6 : 0} />
          </button>
        ))}
      </div>

      <dialog
        ref={dialog}
        aria-label={`${title} — ${d.property.gallery}`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-ink p-0 text-paper backdrop:bg-ink/80"
        onClick={(e) => e.target === dialog.current && close()}
      >
        <div className="flex h-full flex-col">
          <div className="wrap flex h-[var(--header)] shrink-0 items-center justify-between">
            <span className="eyebrow text-paper/70" aria-live="polite">
              {d.property.photo(i + 1, n)}
            </span>
            <button type="button" onClick={close} className="eyebrow ulink min-h-11 px-2">
              {d.property.galleryClose} ✕
            </button>
          </div>
          <div className="relative flex-1">
            <div ref={img} className="absolute inset-x-[var(--gutter)] inset-y-0">
              <Image src={photos[i]} alt={`${title} — ${d.property.photo(i + 1, n)}`} fill sizes="100vw" className="object-contain" />
            </div>
          </div>
          <div className="wrap flex h-24 shrink-0 items-center justify-between">
            <button type="button" onClick={() => show(i - 1, -1)} className="btn btn-light">
              ← {d.common.prev}
            </button>
            <button type="button" onClick={() => show(i + 1, 1)} className="btn btn-light">
              {d.common.next} →
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
