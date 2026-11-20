import { notFound } from "next/navigation";
import { getDictionary, hasLocale, href } from "@/i18n";
import { properties } from "@/data/properties";
import { developments } from "@/data/developments";
import { photos, testimonials } from "@/data/site";
import { Drift, HorizontalTrack, Magnetic, RevealImage, Rise, Split, WordLight } from "@/components/motion";
import { DevList, HeroImage, Threshold } from "@/components/home-parts";
import { PropertyCard } from "@/components/property-bits";
import { TLink } from "@/components/tlink";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  const h = d.home;
  const featured = properties.filter((p) => p.featured);

  return (
    <>
      {/* 1 — Hero */}
      <section className="relative min-h-[100svh] pt-[var(--header)]">
        <div className="wrap relative grid min-h-[calc(100svh-var(--header))] grid-cols-12 gap-x-6 pb-8 max-lg:gap-y-8">
          <div className="relative col-span-12 aspect-[4/5] lg:absolute lg:top-0 lg:right-[var(--gutter)] lg:bottom-8 lg:aspect-auto lg:w-[34%]">
            <HeroImage src={photos.hero} alt="" />
          </div>

          <h1 className="display relative z-10 col-span-12 self-center text-[clamp(3.6rem,12.5vw,13.5rem)] max-lg:order-first max-lg:pt-6 lg:pt-10 lg:text-paper lg:mix-blend-difference">
            <Split as="span" by="chars" onLoad stagger={0.035} className="block">
              {h.heroLines[0]}
            </Split>
            <Split as="span" by="chars" onLoad stagger={0.035} delay={0.15} className="italic-accent block pl-[14vw] lowercase">
              {h.heroLines[1]}
            </Split>
            <Split as="span" by="chars" onLoad stagger={0.035} delay={0.3} className="block">
              {h.heroLines[2]}
            </Split>
          </h1>

          <Rise onLoad className="relative z-10 col-span-12 grid gap-6 self-end sm:grid-cols-2 lg:col-span-7 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
            <p className="lede max-w-md">{h.heroIntro}</p>
            <div className="flex flex-col items-start gap-6">
              <p className="eyebrow max-w-[16rem] leading-relaxed text-muted">{h.heroFact}</p>
              <Magnetic>
                <TLink href={href(lang, "/propiedades")} className="btn btn-solid">
                  {h.heroCta} <span aria-hidden>→</span>
                </TLink>
              </Magnetic>
            </div>
          </Rise>
        </div>
      </section>

      {/* 2 — Threshold moment */}
      <Threshold src={photos.threshold} kicker={h.thresholdKicker} a={h.thresholdA} b={h.thresholdB} />

      {/* 3 — Manifesto */}
      <section className="py-[clamp(5rem,10vw,9rem)]">
        <div className="wrap grid grid-cols-12 items-center gap-x-6 gap-y-12">
          <p className="kicker col-span-12 self-start lg:col-span-2">{h.manifestoKicker}</p>
          <div className="col-span-12 lg:col-span-6">
            <WordLight text={h.manifesto} className="font-display font-medium text-[clamp(1.7rem,3.1vw,3.3rem)] leading-[1.12] tracking-[-0.02em]" />
            <TLink href={href(lang, "/nosotros")} className="ulink eyebrow mt-10 inline-block py-2">
              {h.manifestoLink} →
            </TLink>
          </div>
          {/* Two photos overlapped: the small one sits framed on the corner of the big one. */}
          <div className="relative col-span-12 grid grid-cols-2 gap-4 lg:col-span-3 lg:col-start-10 lg:block lg:pb-14">
            <RevealImage src={photos.manifestoA} alt="" sizes="(min-width: 1024px) 24vw, 50vw" className="aspect-[4/5]" parallax={8} />
            <div className="lg:absolute lg:bottom-0 lg:-left-[42%] lg:w-[60%] lg:border-[6px] lg:border-paper">
              <RevealImage src={photos.manifestoB} alt="" sizes="(min-width: 1024px) 16vw, 50vw" className="aspect-[4/5] lg:aspect-square" />
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Featured, sideways */}
      <section aria-labelledby="featured-title" className="bg-paper-2">
        <HorizontalTrack prevLabel={d.common.prev} nextLabel={d.common.next} trackClassName="items-stretch gap-[4vw] px-[var(--gutter)] py-[clamp(4rem,9vw,8rem)] lg:h-[100svh] lg:items-start lg:pt-[14svh] lg:pb-0">
          <div className="flex shrink-0 flex-col justify-between gap-10 lg:h-[72vh] lg:w-[34vw]">
            <div>
              <p className="kicker">{h.featuredKicker}</p>
              <Split as="h2" id="featured-title" className="display mt-4 text-[clamp(2.8rem,4vw,5rem)]">
                {h.featuredTitle}
              </Split>
            </div>
            <p className="lede max-w-sm">{d.catalog.intro}</p>
          </div>
          {featured.map((p, k) => (
            <div key={p.slug} data-h-card className="shrink-0 lg:w-[30vw]">
              <PropertyCard p={p} index={k} sizes="(min-width: 1024px) 30vw, 100vw" ratio="aspect-[4/5] lg:aspect-auto lg:h-[54vh]" />
            </div>
          ))}
          <div className="flex shrink-0 items-center justify-center lg:w-[28vw]">
            <TLink
              href={href(lang, "/propiedades")}
              className="group grid aspect-square w-full max-w-[22rem] place-items-center rounded-full border border-ink text-center transition-colors duration-700 hover:bg-ink hover:text-paper max-lg:max-w-[16rem]"
            >
              <span className="display px-8 text-[clamp(1.6rem,2.4vw,2.6rem)]">
                {h.featuredEnd}
                <span className="mt-3 block text-base transition-transform duration-700 group-hover:translate-x-2">→</span>
              </span>
            </TLink>
          </div>
        </HorizontalTrack>
      </section>

      {/* 5 — Values */}
      <section aria-labelledby="values-title" className="overflow-hidden bg-fog py-[clamp(5rem,10vw,9rem)]">
        <div className="wrap">
          <p id="values-title" className="kicker">
            {h.valuesKicker}
          </p>
        </div>
        <ol className="mt-10">
          {h.values.map((v, k) => (
            <li key={v.word} className="border-t border-ink/15 py-8 last:border-b md:py-10">
              <div className="wrap grid items-center gap-6 md:grid-cols-12">
                <span className="kicker md:col-span-1">0{k + 1}</span>
                <Drift amount={k % 2 ? -6 : 6} className="md:col-span-7">
                  <span className="display block text-[clamp(3.4rem,11vw,12rem)] whitespace-nowrap">{v.word}</span>
                </Drift>
                <p className="lede max-w-sm md:col-span-4 md:justify-self-end">{v.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 6 — Developments */}
      <section aria-labelledby="dev-title" className="bg-ink py-[clamp(5rem,10vw,9rem)] text-paper">
        <div className="wrap">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="kicker text-paper/60">{h.devKicker}</p>
              <Split as="h2" id="dev-title" className="display mt-4 text-[clamp(3rem,7vw,7.5rem)]">
                {h.devTitle}
              </Split>
            </div>
            <div className="max-w-sm">
              <p className="text-paper/75">{h.devText}</p>
              <TLink href={href(lang, "/desarrollos")} className="btn btn-light mt-6">
                {d.nav.developments} <span aria-hidden>→</span>
              </TLink>
            </div>
          </div>
          <DevList items={developments} />
        </div>
      </section>

      {/* 7 — Testimonials */}
      <section aria-labelledby="quotes-title" className="py-[clamp(6rem,12vw,11rem)]">
        <div className="wrap">
          <p className="kicker">{h.testimonialsKicker}</p>
          <Split as="h2" id="quotes-title" className="display mt-4 max-w-5xl text-[clamp(2.6rem,5.5vw,6rem)]">
            {h.testimonialsTitle}
          </Split>
          <Rise className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8" stagger={0.14}>
            {testimonials.map((t) => (
              <figure key={t.who.es} className="flex flex-col justify-between gap-8 border-t border-ink pt-8">
                <blockquote className="italic-accent text-[clamp(1.6rem,2.2vw,2.2rem)] leading-[1.2]">“{t.quote[lang]}”</blockquote>
                <figcaption className="eyebrow text-muted">{t.who[lang]}</figcaption>
              </figure>
            ))}
          </Rise>
        </div>
      </section>

      {/* 8 — Valuation call */}
      <section aria-labelledby="appraisal-title" className="bg-paper-2">
        <div className="grid min-h-[100svh] lg:grid-cols-2">
          <RevealImage src={photos.appraisal} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="min-h-[60vh] lg:min-h-full" parallax={8} from="left" />
          <div className="flex flex-col justify-center px-[var(--gutter)] py-20 lg:px-[6vw]">
            <p className="kicker">{h.appraisalKicker}</p>
            <Split as="h2" id="appraisal-title" className="display mt-4 text-[clamp(3rem,5.8vw,6.5rem)]">
              {h.appraisalTitle}
            </Split>
            <p className="lede mt-8 max-w-md">{h.appraisalText}</p>
            <div className="mt-10">
              <Magnetic>
                <TLink href={href(lang, "/tasaciones")} className="btn btn-solid">
                  {h.appraisalCta} <span aria-hidden>→</span>
                </TLink>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
