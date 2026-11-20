"use client";

import { useEffect, useRef, useState } from "react";
import type { Unit, UnitStatus } from "@/data/developments";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { Price } from "./property-bits";
import { useDict, useLang } from "./providers";

/** Thin bar that fills to `value`% the first time it is seen. */
export function Progress({ value, label, tone = "dark" }: { value: number; label: string; tone?: "dark" | "light" }) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(bar.current, { scaleX: 0, duration: 2, ease: "expo.out", scrollTrigger: { trigger: bar.current, start: "top 92%", once: true } });
    });
    return () => mm.revert();
  }, []);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className={`field-label ${tone === "light" ? "text-paper/60" : ""}`}>{label}</span>
        <span className="tabular-nums">{value}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`mt-3 h-[3px] w-full ${tone === "light" ? "bg-paper/20" : "bg-ink/10"}`}
      >
        <div ref={bar} className={`h-full origin-left ${tone === "light" ? "bg-paper" : "bg-ink"}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function UnitsTable({ units }: { units: Unit[] }) {
  const d = useDict();
  const lang = useLang();
  const [filter, setFilter] = useState<UnitStatus | "">("");
  const rows = units.filter((u) => !filter || u.status === filter);
  const dot: Record<UnitStatus, string> = { disponible: "bg-olive", reservada: "bg-clay", vendida: "bg-ink/30" };

  return (
    <div>
      <div role="group" aria-label={d.dev.statusCol} className="mb-8 flex flex-wrap gap-2">
        {(["", "disponible", "reservada", "vendida"] as const).map((s) => (
          <button
            key={s || "all"}
            type="button"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
            className={`min-h-11 rounded-full border px-5 text-[0.72rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-300 ${
              filter === s ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink"
            }`}
          >
            {s ? d.status[s] : d.dev.all}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="field-label border-b border-ink">
              <th scope="col" className="py-3 font-medium">{d.dev.unit}</th>
              <th scope="col" className="py-3 font-medium">{d.dev.level}</th>
              <th scope="col" className="py-3 font-medium">{d.dev.rooms}</th>
              <th scope="col" className="py-3 font-medium">{d.dev.area}</th>
              <th scope="col" className="py-3 font-medium">{d.dev.outdoor}</th>
              <th scope="col" className="py-3 font-medium">{d.dev.price}</th>
              <th scope="col" className="py-3 font-medium">{d.dev.statusCol}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className={`border-b border-line transition-colors hover:bg-paper-2 ${u.status === "vendida" ? "text-muted" : ""}`}>
                <th scope="row" className="num py-5 text-2xl font-light">{u.id}</th>
                <td className="py-5">{u.level[lang]}</td>
                <td className="py-5">{u.rooms}</td>
                <td className="py-5">{u.area} m²</td>
                <td className="py-5">{u.outdoor} m²</td>
                <td className="py-5 font-semibold">{u.status === "vendida" ? "—" : <Price usd={u.priceUsd} />}</td>
                <td className="py-5">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <span className={`h-2 w-2 rounded-full ${dot[u.status]}`} aria-hidden />
                    {d.status[u.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
