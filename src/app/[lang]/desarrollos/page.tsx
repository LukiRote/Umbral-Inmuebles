import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, href } from "@/i18n";
import { developments } from "@/data/developments";
import { zoneById } from "@/data/zones";
import { Progress } from "@/components/dev-parts";
import { RevealImage, Split } from "@/components/motion";
import { PageIntro } from "@/components/page-intro";
import { Price } from "@/components/property-bits";
import { TLink } from "@/components/tlink";

export async function generateMetadata({ params }: PageProps<"/[lang]/desarrollos">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).dev.title } : {};
}

export default async function DevelopmentsPage({ params }: PageProps<"/[lang]/desarrollos">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  const locale = lang === "es" ? "es-AR" : "en-US";

  return (
    <>
      <PageIntro kicker={d.home.devKicker} lines={[d.dev.title]} intro={d.dev.intro} />
      <div className="pb-[clamp(5rem,10vw,9rem)]">
        {developments.map((dev, k) => {
          const zone = zoneById(dev.zone);
          const available = dev.units.filter((u) => u.status === "disponible").length;
          const date = new Date(`${dev.delivery}-01T12:00:00`).toLocaleDateString(locale, { month: "long", year: "numeric" });
          const flip = k % 2 === 1;
          return (
            <article key={dev.slug} aria-labelledby={`dev-${dev.slug}`} className="border-t border-line py-[clamp(4rem,8vw,7rem)]">
              <div className="wrap grid items-center gap-10 lg:grid-cols-12">
                <TLink
                  href={href(lang, `/desarrollos/${dev.slug}`)}
                  aria-label={`${d.common.seeDevelopment}: ${dev.name}`}
                  className={`zoom block lg:col-span-7 ${flip ? "lg:order-2 lg:col-start-6" : ""}`}
                >
                  <RevealImage src={dev.cover} alt={`${dev.name}, ${zone.name}`} sizes="(min-width: 1024px) 58vw, 100vw" className="aspect-[4/3]" parallax={7} from={flip ? "left" : "bottom"} />
                </TLink>
                <div className={`lg:col-span-4 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9"}`}>
                  <p className="kicker">
                    (0{k + 1}) {zone.name}, {zone.city[lang]}
                  </p>
                  <Split as="h2" id={`dev-${dev.slug}`} className="display mt-4 text-[clamp(3rem,6vw,6.5rem)]">
                    {dev.name}
                  </Split>
                  <p className="lede mt-6">{dev.tagline[lang]}</p>
                  <dl className="mt-8 grid grid-cols-2 gap-6">
                    <div className="border-t border-line pt-3">
                      <dt className="field-label">{d.dev.delivery}</dt>
                      <dd className="mt-1 first-letter:uppercase">{date}</dd>
                    </div>
                    <div className="border-t border-line pt-3">
                      <dt className="field-label">{d.common.from}</dt>
                      <dd className="mt-1 font-semibold">
                        <Price usd={Math.min(...dev.units.map((u) => u.priceUsd))} />
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <Progress value={dev.progress} label={d.dev.progress} />
                    </div>
                  </dl>
                  <div className="mt-10 flex flex-wrap items-center gap-6">
                    <TLink href={href(lang, `/desarrollos/${dev.slug}`)} className="btn btn-solid">
                      {d.common.seeDevelopment} <span aria-hidden>→</span>
                    </TLink>
                    <span className="text-sm text-muted">{d.dev.available(available)}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
