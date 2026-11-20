"use client";

import { useEffect, useId, useRef, useState } from "react";
import { sendLead } from "@/app/actions";
import { href } from "@/i18n/config";
import type { PropertyType } from "@/data/properties";
import { pricePerM2 } from "@/data/site";
import { regions, zones, type Region } from "@/data/zones";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { Price } from "./property-bits";
import { useDict, useLang } from "./providers";
import { TLink } from "./tlink";

type Goal = "vender" | "alquilar" | "saber";
type Age = "nueva" | "reciente" | "media" | "antigua";
type Cond = "excelente" | "bueno" | "reciclar";
type Extra = "cochera" | "pileta" | "exterior" | "vista" | "amenities";

const ageF: Record<Age, number> = { nueva: 1.12, reciente: 1.05, media: 0.95, antigua: 0.85 };
const condF: Record<Cond, number> = { excelente: 1.08, bueno: 1, reciclar: 0.82 };
const typeF: Record<PropertyType, number> = { casa: 1, departamento: 1, comercial: 0.95, chacra: 0.7 };
const extraF: Record<Extra, number> = { cochera: 0.03, pileta: 0.05, exterior: 0.04, vista: 0.04, amenities: 0.02 };

export function Appraisal() {
  const d = useDict();
  const lang = useLang();
  const a = d.appraisal;
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal>("vender");
  const [type, setType] = useState<PropertyType>("casa");
  const [zone, setZone] = useState("");
  const [area, setArea] = useState("");
  const [rooms, setRooms] = useState("3");
  const [age, setAge] = useState<Age>("reciente");
  const [cond, setCond] = useState<Cond>("bueno");
  const [extras, setExtras] = useState<Extra[]>([]);
  const [error, setError] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ low: number; high: number; rent: boolean; demo: boolean } | null>(null);

  const total = a.steps.length;

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from(panel.current!.children, { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" });
    });
    return () => mm.revert();
  }, [step, result]);

  const estimate = () => {
    const m2 = Number(area);
    let v = (pricePerM2[zone] ?? 2400) * m2 * ageF[age] * condF[cond] * typeF[type];
    v *= 1 + extras.reduce((s, e) => s + extraF[e], 0);
    const rent = goal === "alquilar";
    if (rent) v *= 0.0035;
    const round = rent ? 50 : 5000;
    return { low: Math.round((v * 0.93) / round) * round, high: Math.round((v * 1.07) / round) * round, rent };
  };

  const next = () => {
    if (step === 1) {
      const e: Record<string, string> = {};
      if (!zone) e.zone = a.zone;
      if (!(Number(area) >= 20)) e.area = a.area;
      setError(e);
      if (Object.keys(e).length) return;
    }
    setStep((s) => Math.min(s + 1, total - 1));
  };

  const submit = async (form: FormData) => {
    const est = estimate();
    form.set("lang", lang);
    form.set("subject", `${a.title} · ${zones.find((z) => z.id === zone)?.name ?? ""}`);
    form.set(
      "message",
      [`${a.goal} ${a.goals[goal]}`, `${a.type}: ${d.types[type]}`, `${a.zone}: ${zone}`, `${a.area}: ${area}`, `${a.rooms}: ${rooms}`, `${a.age}: ${a.ages[age]}`, `${a.condition}: ${a.conditions[cond]}`, `${a.extras}: ${extras.map((x) => a.extraItems[x]).join(", ") || "—"}`, `USD ${est.low}–${est.high}`].join("\n"),
    );
    setSending(true);
    const res = await sendLead({ status: "idle" }, form);
    setSending(false);
    if (res.status === "error") {
      setError({ name: res.errors?.name ?? "", email: res.errors?.email ?? "", form: res.errors?.form ?? "" });
      return;
    }
    setError({});
    setResult({ ...est, demo: !!res.demo });
  };

  const restart = () => {
    setResult(null);
    setStep(0);
  };

  const chip = (on: boolean) =>
    `min-h-12 rounded-full border px-6 text-sm transition-colors duration-300 ${on ? "border-ink bg-ink text-paper" : "border-ink/25 hover:border-ink"}`;
  const byRegion = (Object.keys(regions) as Region[]).map((r) => ({ r, zs: zones.filter((z) => z.region === r) }));

  if (result) {
    return (
      <div ref={panel} role="status" className="border-t border-ink pt-10">
        <p className="kicker">{a.resultKicker}</p>
        <p className="field-label mt-6">{result.rent ? a.resultRent : a.resultTitle}</p>
        <p className="display num mt-3 text-[clamp(2.2rem,5vw,5rem)]">
          <Price usd={result.low} /> <span className="italic-accent">—</span> <Price usd={result.high} />
        </p>
        <p className="mt-6 max-w-xl text-muted">{a.resultNote}</p>
        <p className="mt-2 max-w-xl text-sm text-muted">{result.demo ? d.form.demo : d.form.success}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <TLink href={href(lang, "/contacto")} className="btn btn-solid">
            {a.resultCta} <span aria-hidden>→</span>
          </TLink>
          <button type="button" onClick={restart} className="btn">
            {a.restart}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step < total - 1) next();
        else void submit(new FormData(e.currentTarget));
      }}
    >
      {/* Step indicator */}
      <ol className="mb-14 grid grid-cols-4 gap-3" aria-label={a.step(step + 1, total)}>
        {a.steps.map((s, k) => (
          <li key={s} aria-current={k === step ? "step" : undefined}>
            <span className={`block h-[3px] origin-left transition-[background-color] duration-700 ${k <= step ? "bg-ink" : "bg-ink/12"}`} />
            <span className={`mt-3 block text-[0.72rem] tracking-[0.12em] uppercase max-sm:sr-only ${k === step ? "text-ink" : "text-muted"}`}>{s}</span>
          </li>
        ))}
      </ol>
      <p className="kicker mb-8">({a.step(step + 1, total)})</p>

      <div ref={panel} className="grid gap-12">
        {step === 0 && (
          <>
            <fieldset>
              <legend className="display mb-6 text-[clamp(1.8rem,3vw,2.8rem)]">{a.goal}</legend>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(a.goals) as Goal[]).map((g) => (
                  <button key={g} type="button" aria-pressed={goal === g} onClick={() => setGoal(g)} className={chip(goal === g)}>
                    {a.goals[g]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="display mb-6 text-[clamp(1.8rem,3vw,2.8rem)]">{a.type}</legend>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(d.types) as PropertyType[]).map((t) => (
                  <button key={t} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={chip(type === t)}>
                    {d.types[t]}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 1 && (
          <div className="grid gap-10 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <label htmlFor={`${id}-zone`} className="field-label">
                {a.zone}
              </label>
              <select id={`${id}-zone`} value={zone} onChange={(e) => setZone(e.target.value)} aria-invalid={!!error.zone} className="field appearance-none">
                <option value="">—</option>
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
              {error.zone && <p className="mt-2 text-sm text-clay">{error.zone} ✕</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-area`} className="field-label">
                {a.area}
              </label>
              <input id={`${id}-area`} type="number" inputMode="numeric" min={20} value={area} onChange={(e) => setArea(e.target.value)} aria-invalid={!!error.area} className="field" />
              {error.area && <p className="mt-2 text-sm text-clay">{error.area} ≥ 20</p>}
            </div>
            <div>
              <label htmlFor={`${id}-rooms`} className="field-label">
                {a.rooms}
              </label>
              <select id={`${id}-rooms`} value={rooms} onChange={(e) => setRooms(e.target.value)} className="field appearance-none">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n}>{n === 7 ? "7+" : n}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <>
            <fieldset>
              <legend className="field-label mb-4">{a.age}</legend>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(a.ages) as Age[]).map((g) => (
                  <button key={g} type="button" aria-pressed={age === g} onClick={() => setAge(g)} className={chip(age === g)}>
                    {a.ages[g]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="field-label mb-4">{a.condition}</legend>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(a.conditions) as Cond[]).map((c) => (
                  <button key={c} type="button" aria-pressed={cond === c} onClick={() => setCond(c)} className={chip(cond === c)}>
                    {a.conditions[c]}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="field-label mb-4">{a.extras}</legend>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(a.extraItems) as Extra[]).map((x) => {
                  const on = extras.includes(x);
                  return (
                    <button key={x} type="button" aria-pressed={on} onClick={() => setExtras((e) => (on ? e.filter((y) => y !== x) : [...e, x]))} className={chip(on)}>
                      {on ? "✓ " : "+ "}
                      {a.extraItems[x]}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </>
        )}

        {step === 3 && (
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-name`} className="field-label">
                {d.form.name}
              </label>
              <input id={`${id}-name`} name="name" autoComplete="name" aria-invalid={!!error.name} className="field" />
              {error.name && <p className="mt-2 text-sm text-clay">{error.name}</p>}
            </div>
            <div>
              <label htmlFor={`${id}-email`} className="field-label">
                {d.form.email}
              </label>
              <input id={`${id}-email`} name="email" type="email" autoComplete="email" aria-invalid={!!error.email} className="field" />
              {error.email && <p className="mt-2 text-sm text-clay">{error.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-phone`} className="field-label">
                {d.form.phone}
              </label>
              <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" className="field" />
            </div>
            <p className="text-sm text-muted sm:col-span-2">{d.form.privacy}</p>
            {error.form && <p className="text-sm text-clay sm:col-span-2">{error.form}</p>}
          </div>
        )}
      </div>

      <div className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-8">
        <button type="button" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0} className="btn disabled:invisible">
          ← {d.common.back}
        </button>
        {step < total - 1 ? (
          <button type="button" onClick={next} className="btn btn-solid">
            {d.common.next} <span aria-hidden>→</span>
          </button>
        ) : (
          <button type="submit" disabled={sending} className="btn btn-solid disabled:opacity-60">
            {sending ? d.form.sending : d.appraisal.resultTitle} <span aria-hidden>→</span>
          </button>
        )}
      </div>
    </form>
  );
}
