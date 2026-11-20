import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, href } from "@/i18n";
import { developmentBySlug, developments } from "@/data/developments";
import { zoneById } from "@/data/zones";
import { DetailHero } from "@/components/detail-hero";
import { Progress, UnitsTable } from "@/components/dev-parts";
import { Gallery } from "@/components/gallery";
import { LeadForm } from "@/components/lead-form";
import { MapView } from "@/components/map-view";
import { Rise, Split } from "@/components/motion";
import { Price } from "@/components/property-bits";
import { TLink } from "@/components/tlink";

// Every slug is prerendered below; an unknown slug just blocks and 404s.
export const instant = false;

export function generateStaticParams() {
  return developments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/desarrollos/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const dev = developmentBySlug(slug);
  if (!dev || !hasLocale(lang)) return {};
  return { title: dev.name, description: dev.summary[lang] };
}

export default async function DevelopmentPage({ params }: PageProps<"/[lang]/desarrollos/[slug]">) {
  const { lang, slug } = await params;
  const dev = developmentBySlug(slug);
  if (!dev || !hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  const zone = zoneById(dev.zone);
  const date = new Date(`${dev.delivery}-01T12:00:00`).toLocaleDateString(lang === "es" ? "es-AR" : "en-US", { month: "long", year: "numeric" });
  const from = Math.min(...dev.units.map((u) => u.priceUsd));
  const available = dev.units.filter((u) => u.status === "disponible").length;

  return (
    <>
      <DetailHero
        title={dev.name}
        src={dev.cover}
        alt={`${dev.name}, ${zone.name}`}
        back={
          <TLink href={href(lang, "/desarrollos")} className="ulink eyebrow py-2">
            ← {d.dev.title}
          </TLink>
        }
        meta={
          <p className="eyebrow text-right leading-relaxed">
            {zone.name}, {zone.city[lang]} · {d.dev.delivery} {date}
          </p>
        }
      />

      {/* Summary + numbers */}
      <section aria-labelledby="dev-sum" className="py-[clamp(6rem,12vw,11rem)]">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="kicker">({d.dev.architect}: {dev.architect})</p>
            <Split as="h2" id="dev-sum" className="display mt-6 text-[clamp(2.6rem,5vw,5.5rem)]">
              {dev.tagline[lang]}
            </Split>
            <p className="lede mt-10 max-w-2xl">{dev.summary[lang]}</p>
            <p className="mt-6 max-w-2xl leading-relaxed text-ink-2">{dev.story[lang]}</p>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-9">
            <div className="border-t border-ink pt-4">
              <p className="field-label">{d.common.from}</p>
              <Price usd={from} className="display num mt-2 block text-[clamp(2.2rem,3.4vw,3.6rem)]" />
            </div>
            <Progress value={dev.progress} label={d.dev.progress} />
            <dl className="grid grid-cols-2 gap-6">
              <div className="border-t border-line pt-3">
                <dt className="field-label">{d.dev.delivery}</dt>
                <dd className="mt-1 first-letter:uppercase">{date}</dd>
              </div>
              <div className="border-t border-line pt-3">
                <dt className="field-label">{d.dev.units}</dt>
                <dd className="mt-1">
                  {dev.units.length} · {d.dev.available(available)}
                </dd>
              </div>
            </dl>
            <a href="#consulta" className="btn btn-solid self-start">
              {d.dev.enquiryTitle} <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stages */}
      <section aria-labelledby="stages" className="bg-ink py-[clamp(5rem,10vw,9rem)] text-paper">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Split as="h2" id="stages" className="display text-[clamp(2.6rem,5vw,5.5rem)]">
              {d.dev.stages}
            </Split>
            <p className="mt-8 max-w-sm text-paper/70">{d.home.devText}</p>
          </div>
          <Rise className="grid gap-10 lg:col-span-7 lg:col-start-6" stagger={0.1}>
            {dev.stages.map((s, k) => (
              <div key={k} className="grid grid-cols-[3rem_1fr] items-start gap-4">
                <span className="kicker text-paper/50">0{k + 1}</span>
                <div>
                  <p className="display mb-4 text-[clamp(1.6rem,2.4vw,2.4rem)]">{s.name[lang]}</p>
                  <Progress value={s.done} label={s.name[lang]} tone="light" />
                </div>
              </div>
            ))}
          </Rise>
        </div>
      </section>

      {/* Gallery */}
      <section aria-labelledby="dev-gal" className="py-[clamp(6rem,12vw,10rem)]">
        <div className="wrap">
          <h2 id="dev-gal" className="kicker mb-8">
            ({d.property.gallery})
          </h2>
          <Gallery photos={[dev.cover, ...dev.gallery]} title={dev.name} />
        </div>
      </section>

      {/* Units */}
      <section aria-labelledby="units" className="bg-paper-2 py-[clamp(5rem,10vw,9rem)]">
        <div className="wrap">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Split as="h2" id="units" className="display text-[clamp(2.6rem,5.5vw,6rem)]">
              {d.dev.units}
            </Split>
            <div className="max-w-sm">
              <p className="field-label">{d.dev.financing}</p>
              <p className="mt-2 leading-relaxed">{dev.financing[lang]}</p>
            </div>
          </div>
          <UnitsTable units={dev.units} />
        </div>
      </section>

      {/* Features + location */}
      <section aria-labelledby="dev-place" className="py-[clamp(6rem,12vw,11rem)]">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Split as="h2" id="dev-place" className="display text-[clamp(2.6rem,5vw,5.5rem)]">
              {zone.name}
            </Split>
            <Rise as="ol" className="mt-10" stagger={0.06}>
              {dev.features.map((f, k) => (
                <li key={k} className="flex gap-6 border-t border-line py-5 last:border-b">
                  <span className="kicker">0{k + 1}</span>
                  <span className="text-lg">{f[lang]}</span>
                </li>
              ))}
            </Rise>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <MapView
              label={d.property.location}
              className="aspect-[4/5] w-full max-md:aspect-square lg:sticky lg:top-24"
              circle={{ lat: zone.center[0] + dev.offset[0], lng: zone.center[1] + dev.offset[1], radius: 500 }}
              zoom={14}
            />
            <p className="mt-4 text-sm text-muted">{d.property.approx}</p>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="consulta" aria-labelledby="dev-enq" className="scroll-mt-20 bg-ink py-[clamp(5rem,10vw,9rem)] text-paper">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker text-paper/60">{d.property.enquiryKicker}</p>
            <Split as="h2" id="dev-enq" className="display mt-4 text-[clamp(2.6rem,5vw,5.5rem)]">
              {d.dev.enquiryTitle}
            </Split>
            <p className="mt-8 max-w-sm text-paper/70">{d.property.enquiryText}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <LeadForm tone="dark" subject={dev.name} defaultMessage={d.dev.enquiryDefault(dev.name)} />
          </div>
        </div>
      </section>
    </>
  );
}
