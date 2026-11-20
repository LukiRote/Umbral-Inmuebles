"use client";

import { href } from "@/i18n/config";
import { LogoMark } from "@/components/logo";
import { useDict, useLang } from "@/components/providers";
import { TLink } from "@/components/tlink";

export default function NotFound() {
  const d = useDict();
  const lang = useLang();
  return (
    <section className="grid min-h-[100svh] place-items-center pt-[var(--header)] text-center">
      <div className="wrap flex flex-col items-center">
        <LogoMark className="h-24 w-auto text-ink/30" />
        <h1 className="display mt-10 max-w-4xl text-[clamp(2.6rem,6vw,6rem)]">{d.notFound.title}</h1>
        <p className="lede mt-6">{d.notFound.text}</p>
        <TLink href={href(lang)} className="btn btn-solid mt-10">
          {d.notFound.cta}
        </TLink>
      </div>
    </section>
  );
}
