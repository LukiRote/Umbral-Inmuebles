import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, href } from "@/i18n";
import { photos, team } from "@/data/site";
import { Counter, Magnetic, RevealImage, Rise, Split, WordLight } from "@/components/motion";
import { PageIntro } from "@/components/page-intro";
import { TLink } from "@/components/tlink";

export async function generateMetadata({ params }: PageProps<"/[lang]/nosotros">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).about.title } : {};
}

export default async function AboutPage({ params }: PageProps<"/[lang]/nosotros">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  const a = d.about;

  return (
    <>
      <PageIntro kicker={`(${a.title})`} lines={a.heroLines} intro={a.intro} />

      <RevealImage src={photos.about} alt="" priority sizes="100vw" className="h-[88svh] w-full" parallax={10} />

      {/* Story */}
      <section aria-labelledby="story" className="py-[clamp(6rem,12vw,11rem)]">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="story" className="kicker lg:col-span-3">
            {a.storyKicker}
          </h2>
          <div className="lg:col-span-8 lg:col-start-5">
            <WordLight text={a.story[0]} className="font-display font-medium text-[clamp(1.7rem,3vw,3.1rem)] leading-[1.14] tracking-[-0.02em]" />
            <p className="lede mt-12 max-w-2xl">{a.story[1]}</p>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section aria-labelledby="numbers" className="border-y border-line bg-paper-2 py-[clamp(4rem,8vw,7rem)]">
        <div className="wrap">
          <h2 id="numbers" className="kicker mb-12">
            {a.numbersKicker}
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {a.numbers.map((n) => (
              <div key={n.label} className="flex flex-col-reverse justify-end border-t border-ink pt-5">
                <dt className="mt-3 text-muted">{n.label}</dt>
                <dd className="num text-[clamp(3.4rem,7vw,7.5rem)] leading-none">
                  <Counter value={n.value} suffix={n.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Method: cards that stack as you scroll */}
      <section aria-labelledby="method" className="py-[clamp(6rem,12vw,11rem)]">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="kicker">{a.processKicker}</p>
              <Split as="h2" id="method" className="display mt-4 text-[clamp(2.8rem,5.5vw,6rem)]">
                {a.processTitle}
              </Split>
            </div>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {a.process.map((s, k) => (
              <li
                key={s.title}
                className="sticky mb-6 flex min-h-[46svh] flex-col justify-between gap-10 border border-ink/10 bg-sand p-8 shadow-[0_-20px_40px_-30px_rgb(26_23_20/0.35)] md:p-12"
                style={{ top: `calc(var(--header) + ${k * 1.5}rem)` }}
              >
                <span className="num text-[clamp(4rem,9vw,8rem)] leading-none text-ink/20">0{k + 1}</span>
                <div>
                  <p className="display text-[clamp(2.2rem,4vw,3.8rem)]">{s.title}</p>
                  <p className="lede mt-4 max-w-md">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section aria-labelledby="team" className="bg-ink py-[clamp(5rem,10vw,9rem)] text-paper">
        <div className="wrap">
          <p className="kicker text-paper/60">{a.teamKicker}</p>
          <Split as="h2" id="team" className="display mt-4 mb-14 text-[clamp(2.8rem,6vw,6.5rem)]">
            {a.teamTitle}
          </Split>
          <Rise as="ul" className="border-t border-paper/20" stagger={0.06}>
            {team.map((p) => (
              <li key={p.name} className="group relative overflow-hidden border-b border-paper/20">
                <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100" />
                <div className="relative grid gap-2 py-7 transition-colors duration-500 group-hover:text-ink md:grid-cols-12 md:items-baseline">
                  <span className="display text-[clamp(2rem,4vw,3.6rem)] md:col-span-6">{p.name}</span>
                  <span className="md:col-span-3">{p.role[lang]}</span>
                  <span className="text-paper/60 transition-colors duration-500 group-hover:text-muted md:col-span-3 md:text-right">{p.focus[lang]}</span>
                </div>
              </li>
            ))}
          </Rise>
        </div>
      </section>

      {/* Close */}
      <section className="grid min-h-[80svh] place-items-center py-24 text-center">
        <div className="wrap">
          <Split as="p" by="chars" className="display text-[clamp(4rem,15vw,16rem)]">
            {a.cta}
          </Split>
          <Magnetic className="mt-10">
            <TLink href={href(lang, "/contacto")} className="btn btn-solid">
              {d.nav.contact} <span aria-hidden>→</span>
            </TLink>
          </Magnetic>
        </div>
      </section>
    </>
  );
}
