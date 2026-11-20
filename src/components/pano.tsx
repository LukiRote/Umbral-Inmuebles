"use client";

import "@photo-sphere-viewer/core/index.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDict } from "./providers";

/** 360° tour: a poster with a start button; the WebGL viewer loads only when asked for. */
export function Pano({ src, poster, title }: { src: string; poster: string; title: string }) {
  const d = useDict();
  const box = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let viewer: { destroy(): void } | undefined;
    let cancelled = false;
    import("@photo-sphere-viewer/core").then(({ Viewer }) => {
      if (cancelled || !box.current) return;
      viewer = new Viewer({
        container: box.current,
        panorama: src,
        caption: title,
        defaultZoomLvl: 20,
        mousewheelCtrlKey: true,
        navbar: ["zoom", "move", "caption", "fullscreen"],
      });
      // A slow turn on load, so it's obvious the picture can move.
      (viewer as unknown as { animate(o: object): void }).animate({ yaw: "60deg", pitch: "-4deg", zoom: 25, speed: "4rpm" });
    });
    return () => {
      cancelled = true;
      viewer?.destroy();
    };
  }, [started, src, title]);

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink max-md:aspect-[4/5]">
      {started ? (
        <div ref={box} className="absolute inset-0" />
      ) : (
        <>
          <Image src={poster} alt="" fill sizes="100vw" className="object-cover opacity-70" />
          <div className="absolute inset-0 grid place-items-center">
            <button type="button" onClick={() => setStarted(true)} className="btn btn-light bg-ink/40 backdrop-blur-md">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <ellipse cx="12" cy="12" rx="9" ry="4" />
                <path d="M12 3a4 9 0 0 1 0 18a4 9 0 0 1 0-18" />
              </svg>
              {d.property.tourCta}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
