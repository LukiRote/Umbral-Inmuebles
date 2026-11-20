import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/i18n";
import { photos } from "@/data/site";
import { Appraisal } from "@/components/appraisal";
import { RevealImage } from "@/components/motion";
import { PageIntro } from "@/components/page-intro";

export async function generateMetadata({ params }: PageProps<"/[lang]/tasaciones">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).appraisal.title } : {};
}

export default async function AppraisalPage({ params }: PageProps<"/[lang]/tasaciones">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <>
      <PageIntro kicker={d.home.appraisalKicker} lines={[d.appraisal.title]} intro={d.appraisal.intro} />
      <section aria-label={d.appraisal.title} className="pb-[clamp(6rem,12vw,10rem)]">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Appraisal />
          </div>
          <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <RevealImage src={photos.aboutB} alt="" sizes="30vw" className="sticky top-28 aspect-[3/4]" parallax={6} />
          </div>
        </div>
      </section>
    </>
  );
}
