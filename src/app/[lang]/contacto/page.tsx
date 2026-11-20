import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/i18n";
import { contact, photos } from "@/data/site";
import { LeadForm } from "@/components/lead-form";
import { MapView } from "@/components/map-view";
import { RevealImage, Rise } from "@/components/motion";
import { PageIntro } from "@/components/page-intro";

export async function generateMetadata({ params }: PageProps<"/[lang]/contacto">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).contact.title } : {};
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contacto">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  const c = d.contact;

  return (
    <>
      <PageIntro kicker={`(${c.title})`} lines={c.heroLines} intro={c.intro} />

      <section aria-label={c.title} className="pb-[clamp(6rem,12vw,10rem)]">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <LeadForm reasons={c.reasons} />
          </div>
          <Rise as="dl" className="grid content-start gap-8 lg:col-span-4 lg:col-start-9">
            <div className="border-t border-ink pt-4">
              <dt className="field-label">{c.email}</dt>
              <dd className="mt-2">
                <a href={`mailto:${contact.email}`} className="ulink italic-accent text-[clamp(1.6rem,2.4vw,2.2rem)]">
                  {contact.email}
                </a>
              </dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="field-label">{c.office}</dt>
              <dd className="mt-2 text-lg">{contact.office[lang]}</dd>
            </div>
            <div className="border-t border-line pt-4">
              <dt className="field-label">{c.hours}</dt>
              <dd className="mt-2 text-lg">{contact.hours[lang]}</dd>
            </div>
          </Rise>
        </div>
      </section>

      <section aria-label={c.office} className="grid lg:grid-cols-2">
        <RevealImage src={photos.contact} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="min-h-[60svh]" parallax={6} from="left" />
        <MapView label={c.office} className="min-h-[60svh] w-full" circle={{ lat: contact.officeCenter[0], lng: contact.officeCenter[1], radius: 350 }} zoom={15} />
      </section>
    </>
  );
}
