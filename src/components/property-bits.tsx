"use client";

import Image from "next/image";
import { useRef } from "react";
import { href, type Locale } from "@/i18n/config";
import type { Property } from "@/data/properties";
import { zoneById } from "@/data/zones";
import { gsap } from "@/lib/gsap";
import { useDict, useFavorites, useLang, useMoney, useMounted } from "./providers";
import { TLink } from "./tlink";

export function Price({ usd, monthly = false, className = "" }: { usd: number; monthly?: boolean; className?: string }) {
  const money = useMoney();
  const d = useDict();
  return (
    <span className={className}>
      {money(usd)}
      {monthly && <span className="ml-1 text-[0.8em] opacity-60">{d.common.perMonth}</span>}
    </span>
  );
}

export function FavButton({ slug, className = "", tone = "dark" }: { slug: string; className?: string; tone?: "dark" | "light" }) {
  const { has, toggle } = useFavorites();
  const d = useDict();
  const mounted = useMounted();
  const icon = useRef<SVGSVGElement>(null);
  const on = mounted && has(slug);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? d.common.removeFav : d.common.addFav}
      title={on ? d.common.removeFav : d.common.addFav}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
        gsap.fromTo(icon.current, { scale: 0.6 }, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.35)" });
      }}
      className={`grid h-11 w-11 place-items-center rounded-full backdrop-blur-md transition-colors duration-300 ${
        tone === "light" ? "bg-paper/80 text-ink hover:bg-paper" : "bg-ink/85 text-paper hover:bg-ink"
      } ${className}`}
    >
      <svg ref={icon} viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
      </svg>
    </button>
  );
}

export function specLine(p: Property, d: ReturnType<typeof useDict>) {
  const parts = [`${p.area} ${d.common.m2}`];
  if (p.bedrooms) parts.push(`${p.bedrooms} ${d.common.bedrooms.toLowerCase()}`);
  else parts.push(`${p.rooms} ${d.common.rooms.toLowerCase()}`);
  parts.push(`${p.baths} ${d.common.baths.toLowerCase()}`);
  return parts.join(" · ");
}

export function PropertyCard({ p, index, sizes = "(min-width: 1024px) 33vw, 100vw", ratio = "aspect-[4/5]" }: { p: Property; index?: number; sizes?: string; ratio?: string }) {
  const lang = useLang();
  const d = useDict();
  const zone = zoneById(p.zone);
  return (
    <article className="group relative">
      <TLink href={href(lang, `/propiedades/${p.slug}`)} className="block transition-transform duration-500 ease-out hover:-translate-y-0.5">
        <div className={`zoom relative overflow-hidden bg-sand ${ratio}`}>
          <div data-h-img className="absolute inset-0">
            <Image src={p.cover} alt={`${p.title}, ${zone.name}`} fill sizes={sizes} className="object-cover" />
          </div>
          <span className="eyebrow absolute top-4 left-4 rounded-full bg-paper/85 px-3 py-1.5 text-ink backdrop-blur-md">
            {p.operation === "venta" ? d.common.sale : d.common.rent}
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            {index !== undefined && <span className="kicker mr-2">({String(index + 1).padStart(2, "0")})</span>}
            <h3 className="display inline text-[clamp(1.6rem,2.2vw,2.2rem)] leading-none">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">
              {zone.name}, {zone.city[lang as Locale]} · {d.types[p.type]}
            </p>
          </div>
          <Price usd={p.priceUsd} monthly={p.operation === "alquiler"} className="shrink-0 pt-1 text-right text-sm font-semibold tracking-wide" />
        </div>
        <p className="mt-3 border-t border-line pt-3 text-[0.82rem] tracking-wide text-ink-2">{specLine(p, d)}</p>
      </TLink>
      <FavButton slug={p.slug} className="absolute top-3 right-3" tone="light" />
    </article>
  );
}
