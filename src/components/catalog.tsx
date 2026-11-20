"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { href } from "@/i18n/config";
import { properties, type Operation, type PropertyType } from "@/data/properties";
import { regions, zoneById, zones, type Region } from "@/data/zones";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { MapView } from "./map-view";
import { PropertyCard } from "./property-bits";
import { useDict, useFavorites, useLang, useMoney, useMounted } from "./providers";

const priceSteps: Record<Operation, number[]> = {
  venta: [500000, 800000, 1000000, 1500000, 2000000],
  alquiler: [3000, 4000, 5000, 7000],
};

export function Catalog() {
  const d = useDict();
  const lang = useLang();
  const money = useMoney();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const { favs } = useFavorites();
  const mounted = useMounted();
  const grid = useRef<HTMLDivElement>(null);
  const [showFilters, setShowFilters] = useState(false);

  const op = (sp.get("op") ?? "") as Operation | "";
  const type = (sp.get("tipo") ?? "") as PropertyType | "";
  const zone = sp.get("zona") ?? "";
  const max = Number(sp.get("max") ?? 0);
  const beds = Number(sp.get("dorm") ?? 0);
  const sort = sp.get("orden") ?? "new";
  const onlyFav = sp.get("fav") === "1";
  const view = sp.get("vista") === "mapa" ? "map" : "grid";

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "op") next.delete("max");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const list = useMemo(() => {
    const out = properties.filter(
      (p) =>
        (!op || p.operation === op) &&
        (!type || p.type === type) &&
        (!zone || p.zone === zone) &&
        (!max || p.priceUsd <= max) &&
        (!beds || p.bedrooms >= beds) &&
        (!onlyFav || (mounted && favs.includes(p.slug))),
    );
    if (sort === "asc") out.sort((a, b) => a.priceUsd - b.priceUsd);
    else if (sort === "desc") out.sort((a, b) => b.priceUsd - a.priceUsd);
    else out.sort((a, b) => b.year - a.year);
    return out;
  }, [op, type, zone, max, beds, sort, onlyFav, favs, mounted]);

  const signature = list.map((p) => p.slug).join(",") + view;
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      if (!grid.current) return;
      gsap.from(grid.current.children, { y: 60, autoAlpha: 0, duration: 1.1, stagger: 0.07, ease: "expo.out" });
    });
    return () => mm.revert();
  }, [signature]);

  const active = [op, type, zone, max, beds, onlyFav].filter(Boolean).length;
  const selectCls =
    "field appearance-none bg-[length:10px] bg-[right_0.25rem_center] bg-no-repeat pr-6 text-[0.95rem] bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%231a1714'/%3E%3C/svg%3E\")]";
  const byRegion = (Object.keys(regions) as Region[]).map((r) => ({ r, zs: zones.filter((z) => z.region === r) }));

  return (
    <>
      <div className="sticky top-0 z-20 border-y border-line bg-paper/90 backdrop-blur-md">
        <div className="wrap flex items-center justify-between gap-4 py-3 lg:hidden">
          <button type="button" onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters} aria-controls="filters" className="eyebrow flex min-h-11 items-center gap-2">
            {d.catalog.filters} {active > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[0.65rem] text-paper">{active}</span>}
          </button>
          <ViewToggle view={view} onChange={(v) => set("vista", v === "map" ? "mapa" : "")} />
        </div>
        <div id="filters" className={`wrap grid gap-x-6 gap-y-4 pb-5 sm:grid-cols-2 lg:grid lg:grid-cols-[repeat(6,minmax(0,1fr))_auto] lg:items-end lg:py-5 ${showFilters ? "grid" : "hidden"}`}>
          <label className="block">
            <span className="field-label">{d.catalog.operation}</span>
            <select value={op} onChange={(e) => set("op", e.target.value)} className={selectCls}>
              <option value="">{d.catalog.any}</option>
              <option value="venta">{d.common.sale}</option>
              <option value="alquiler">{d.common.rent}</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">{d.catalog.type}</span>
            <select value={type} onChange={(e) => set("tipo", e.target.value)} className={selectCls}>
              <option value="">{d.catalog.anyType}</option>
              {(Object.keys(d.types) as PropertyType[]).map((t) => (
                <option key={t} value={t}>
                  {d.types[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">{d.catalog.zone}</span>
            <select value={zone} onChange={(e) => set("zona", e.target.value)} className={selectCls}>
              <option value="">{d.catalog.any}</option>
              {byRegion.map(({ r, zs }) => (
                <optgroup key={r} label={regions[r][lang]}>
                  {zs.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">{d.catalog.price}</span>
            <select value={max || ""} onChange={(e) => set("max", e.target.value)} disabled={!op} className={`${selectCls} disabled:opacity-40`}>
              <option value="">{d.catalog.priceAny}</option>
              {op &&
                priceSteps[op].map((v) => (
                  <option key={v} value={v}>
                    {money(v)}
                  </option>
                ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">{d.catalog.bedrooms}</span>
            <select value={beds || ""} onChange={(e) => set("dorm", e.target.value)} className={selectCls}>
              <option value="">{d.catalog.anyType}</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">{d.catalog.sort}</span>
            <select value={sort} onChange={(e) => set("orden", e.target.value === "new" ? "" : e.target.value)} className={selectCls}>
              <option value="new">{d.catalog.sortNew}</option>
              <option value="asc">{d.catalog.sortAsc}</option>
              <option value="desc">{d.catalog.sortDesc}</option>
            </select>
          </label>
          <div className="hidden lg:block">
            <ViewToggle view={view} onChange={(v) => set("vista", v === "map" ? "mapa" : "")} />
          </div>
        </div>
      </div>

      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-8">
        <p className="kicker" aria-live="polite">
          ({d.catalog.results(list.length)})
        </p>
        <div className="flex items-center gap-6">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
            <input type="checkbox" checked={onlyFav} onChange={(e) => set("fav", e.target.checked ? "1" : "")} className="peer sr-only" />
            <span className="relative h-6 w-11 rounded-full border border-ink transition-colors peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-clay after:absolute after:top-0.5 after:left-0.5 after:h-[18px] after:w-[18px] after:rounded-full after:bg-ink after:transition-transform after:duration-500 peer-checked:after:translate-x-5 peer-checked:after:bg-paper" />
            {d.catalog.onlyFavs}
          </label>
          {active > 0 && (
            <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="ulink eyebrow min-h-11">
              {d.catalog.clear}
            </button>
          )}
        </div>
      </div>

      <div className="wrap pb-32">
        {list.length === 0 ? (
          <div className="border-t border-line py-24 text-center">
            <p className="display text-[clamp(2rem,4vw,3.5rem)]">{d.catalog.empty}</p>
            <button type="button" onClick={() => router.replace(pathname, { scroll: false })} className="btn mt-10">
              {d.catalog.clear}
            </button>
          </div>
        ) : view === "map" ? (
          <MapView
            label={d.catalog.map}
            className="h-[75vh] min-h-[480px] w-full"
            points={list.map((p) => {
              const z = zoneById(p.zone);
              return {
                id: p.slug,
                lat: z.center[0] + p.offset[0],
                lng: z.center[1] + p.offset[1],
                label: money(p.priceUsd),
                popup: `<a href="${href(lang, `/propiedades/${p.slug}`)}" style="display:block;color:inherit;text-decoration:none"><img src="https://images.unsplash.com/${p.cover}?w=480&q=70&auto=format&fit=crop" alt="" style="width:100%;aspect-ratio:3/2;object-fit:cover;display:block"/><div style="padding:12px 14px"><strong style="font-family:var(--font-display);font-weight:500;font-size:20px;text-transform:uppercase;letter-spacing:-.02em">${p.title}</strong><div style="font-size:12px;color:#6b635a;margin-top:4px">${z.name} · ${d.types[p.type]}</div></div></a>`,
              };
            })}
          />
        ) : (
          <div ref={grid} className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, k) => (
              <div key={p.slug} className={k % 3 === 1 ? "lg:mt-24" : ""}>
                <PropertyCard p={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ViewToggle({ view, onChange }: { view: "grid" | "map"; onChange: (v: "grid" | "map") => void }) {
  const d = useDict();
  return (
    <div role="group" aria-label={`${d.catalog.grid} / ${d.catalog.map}`} className="flex rounded-full border border-ink/25 p-0.5 text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
      {(["grid", "map"] as const).map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={view === v}
          onClick={() => onChange(v)}
          className={`min-h-10 rounded-full px-4 transition-colors duration-300 ${view === v ? "bg-ink text-paper" : "hover:bg-ink/5"}`}
        >
          {v === "grid" ? d.catalog.grid : d.catalog.map}
        </button>
      ))}
    </div>
  );
}
