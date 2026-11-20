"use client";

import { href } from "@/i18n/config";
import { properties } from "@/data/properties";
import { PropertyCard } from "./property-bits";
import { useDict, useFavorites, useLang, useMounted } from "./providers";
import { TLink } from "./tlink";

export function FavoritesList() {
  const d = useDict();
  const lang = useLang();
  const mounted = useMounted();
  const { favs } = useFavorites();
  const list = properties.filter((p) => favs.includes(p.slug));

  if (!mounted) return <div className="h-[40vh]" />;
  if (!list.length) {
    return (
      <div className="border-t border-line py-24 text-center">
        <p className="display text-[clamp(2rem,4vw,3.5rem)]">{d.favorites.empty}</p>
        <TLink href={href(lang, "/propiedades")} className="btn btn-solid mt-10">
          {d.favorites.emptyCta} <span aria-hidden>→</span>
        </TLink>
      </div>
    );
  }
  return (
    <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((p) => (
        <PropertyCard key={p.slug} p={p} />
      ))}
    </div>
  );
}
