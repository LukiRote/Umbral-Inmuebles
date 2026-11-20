import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDictionary, hasLocale } from "@/i18n";
import { Catalog } from "@/components/catalog";
import { PageIntro } from "@/components/page-intro";

export async function generateMetadata({ params }: PageProps<"/[lang]/propiedades">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).catalog.title } : {};
}

export default async function PropertiesPage({ params }: PageProps<"/[lang]/propiedades">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <>
      <PageIntro kicker={`(${d.common.sale} · ${d.common.rent})`} lines={[d.catalog.title]} intro={d.catalog.intro} />
      <Suspense fallback={<div className="h-[60vh]" />}>
        <Catalog />
      </Suspense>
    </>
  );
}
