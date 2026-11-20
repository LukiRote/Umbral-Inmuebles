import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, href } from "@/i18n";
import { properties, propertyBySlug } from "@/data/properties";
import { zoneById } from "@/data/zones";
import { DetailHero } from "@/components/detail-hero";
import { Gallery } from "@/components/gallery";
import { LeadForm } from "@/components/lead-form";
import { MapView } from "@/components/map-view";
import { RevealImage, Rise, Split } from "@/components/motion";
import { Pano } from "@/components/pano";
import { FavButton, Price, PropertyCard } from "@/components/property-bits";
import { TLink } from "@/components/tlink";

// Every slug is prerendered below; an unknown slug just blocks and 404s.
export const instant = false;

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/propiedades/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = propertyBySlug(slug);
  if (!p || !hasLocale(lang)) return {};
  return { title: p.title, description: p.summary[lang] };
}

export default async function PropertyPage({ params }: PageProps<"/[lang]/propiedades/[slug]">) {
  const { lang, slug } = await params;
  const p = propertyBySlug(slug);
  if (!p || !hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  const zone = zoneById(p.zone);
  const monthly = p.operation === "alquiler";

  const facts = [
    { k: d.common.area, v: `${p.area} ${d.common.m2}` },
    p.lot ? { k: d.common.lot, v: `${p.lot.toLocaleString(lang === "es" ? "es-AR" : "en-US")} ${d.common.m2}` } : null,
    { k: d.common.rooms, v: p.rooms },
    p.bedrooms ? { k: d.common.bedrooms, v: p.bedrooms } : null,
    { k: d.common.baths, v: p.baths },
    p.garages ? { k: d.common.garages, v: p.garages } : null,
    { k: d.common.year, v: p.year },
    { k: d.common.orientation, v: p.orientation[lang] },
  ].filter(Boolean) as { k: string; v: string | number }[];

  const similar = properties
    .filter((o) => o.slug !== p.slug)
    .sort((a, b) => Number(b.operation === p.operation) + Number(b.type === p.type) - (Number(a.operation === p.operation) + Number(a.type === p.type)))
    .slice(0, 3);

  return (
    <>
      <DetailHero
        title={p.title}
        src={p.cover}
        alt={`${p.title}, ${zone.name}`}
        back={
          <TLink href={href(lang, "/propiedades")} className="ulink eyebrow py-2">
            ← {d.catalog.title}
          </TLink>
        }
        meta={
          <p className="eyebrow text-right leading-relaxed">
            {zone.name}, {zone.city[lang]} · {d.types[p.type]} · {monthly ? d.common.rent : d.common.sale}
          </p>
        }
      />

      {/* Key facts */}
      <section aria-label={d.property.features} className="border-b border-line">
        <div className="wrap grid gap-10 py-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <p className="kicker">{monthly ? d.common.rent : d.common.sale}</p>
            <Price usd={p.priceUsd} monthly={monthly} className="display num mt-3 block text-[clamp(2.4rem,4.2vw,4.4rem)]" />
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#consulta" className="btn btn-solid">
                {d.property.enquiryTitle} <span aria-hidden>↓</span>
              </a>
              <FavButton slug={p.slug} />
            </div>
          </div>
          <Rise as="dl" className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:col-span-8" stagger={0.05}>
            {facts.map((f) => (
              <div key={f.k} className="border-t border-line pt-3">
                <dt className="field-label">{f.k}</dt>
                <dd className="mt-1 text-lg">{f.v}</dd>
              </div>
            ))}
          </Rise>
        </div>
      </section>

      {/* Chapter one */}
      <section aria-labelledby="ch1" className="py-[clamp(6rem,12vw,11rem)]">
        <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-6">
            <p className="kicker">
              ({d.common.chapter} 1) — {d.property.chapterOne}
            </p>
            <Split as="h2" id="ch1" className="display mt-6 text-[clamp(2.6rem,5vw,5.5rem)]">
              {p.tagline[lang]}
            </Split>
            <p className="lede mt-10 max-w-xl">{p.summary[lang]}</p>
            <p className="mt-6 max-w-xl leading-relaxed text-ink-2">{p.story[lang]}</p>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <RevealImage src={p.gallery[0]} alt="" sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[3/4]" parallax={8} />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section aria-labelledby="gal" className="pb-[clamp(6rem,12vw,11rem)]">
        <div className="wrap">
          <h2 id="gal" className="kicker mb-8">
            ({d.property.gallery})
          </h2>
          <Gallery photos={[p.cover, ...p.gallery.slice(1)]} title={p.title} />
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="feat" className="bg-paper-2 py-[clamp(5rem,10vw,9rem)]">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <Split as="h2" id="feat" className="display text-[clamp(2.6rem,5vw,5.5rem)] lg:col-span-4">
            {d.property.features}
          </Split>
          <Rise as="ol" className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8" stagger={0.06}>
            {p.features.map((f, k) => (
              <li key={k} className="flex gap-6 border-t border-ink/15 py-6">
                <span className="kicker">0{k + 1}</span>
                <span className="text-lg">{f[lang]}</span>
              </li>
            ))}
          </Rise>
        </div>
      </section>

      {/* 360 tour */}
      {p.pano && (
        <section aria-labelledby="tour" className="bg-ink py-[clamp(5rem,10vw,9rem)] text-paper">
          <div className="wrap">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="kicker text-paper/60">{d.property.tourKicker}</p>
                <Split as="h2" id="tour" className="display mt-4 text-[clamp(2.6rem,5.5vw,6rem)]">
                  {d.property.tourTitle}
                </Split>
              </div>
              <p className="max-w-xs text-paper/70">{d.property.tourText}</p>
            </div>
            <Pano src={p.pano} poster={p.gallery[0]} title={p.title} />
          </div>
        </section>
      )}

      {/* Chapter two */}
      <section aria-labelledby="ch2" className="py-[clamp(6rem,12vw,11rem)]">
        <div className="wrap grid grid-cols-12 gap-x-6 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <p className="kicker">
              ({d.common.chapter} 2) — {d.property.chapterTwo}
            </p>
            <Split as="h2" id="ch2" className="display mt-6 text-[clamp(2.6rem,5vw,5.5rem)]">
              {zone.name}
            </Split>
            <p className="lede mt-8">{p.place[lang]}</p>
            <dl className="mt-10">
              {p.distances.map((x) => (
                <div key={x.label.es} className="flex justify-between gap-6 border-t border-line py-4 last:border-b">
                  <dt>{x.label[lang]}</dt>
                  <dd className="text-muted">{x.value[lang]}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <MapView
              label={d.property.location}
              className="aspect-[4/5] w-full max-md:aspect-square"
              circle={{ lat: zone.center[0] + p.offset[0], lng: zone.center[1] + p.offset[1], radius: 450 }}
              zoom={14}
            />
            <p className="mt-4 text-sm text-muted">{d.property.approx}</p>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="consulta" aria-labelledby="enq" className="scroll-mt-20 bg-ink py-[clamp(5rem,10vw,9rem)] text-paper">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="kicker text-paper/60">{d.property.enquiryKicker}</p>
            <Split as="h2" id="enq" className="display mt-4 text-[clamp(2.6rem,5vw,5.5rem)]">
              {d.property.enquiryTitle}
            </Split>
            <p className="mt-8 max-w-sm text-paper/70">{d.property.enquiryText}</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <LeadForm tone="dark" subject={p.title} defaultMessage={d.property.enquiryDefault(p.title)} />
          </div>
        </div>
      </section>

      {/* Similar */}
      <section aria-labelledby="sim" className="py-[clamp(6rem,12vw,10rem)]">
        <div className="wrap">
          <Split as="h2" id="sim" className="display mb-14 text-[clamp(2.4rem,4.5vw,4.8rem)]">
            {d.property.similar}
          </Split>
          <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((o) => (
              <PropertyCard key={o.slug} p={o} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
