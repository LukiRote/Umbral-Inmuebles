import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/i18n";
import { FavoritesList } from "@/components/favorites-list";
import { PageIntro } from "@/components/page-intro";

export async function generateMetadata({ params }: PageProps<"/[lang]/favoritos">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).favorites.title } : {};
}

export default async function FavoritesPage({ params }: PageProps<"/[lang]/favoritos">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <>
      <PageIntro kicker="(♡)" lines={[d.favorites.title]} intro={d.favorites.intro} />
      <section aria-label={d.favorites.title} className="wrap pb-32">
        <FavoritesList />
      </section>
    </>
  );
}
