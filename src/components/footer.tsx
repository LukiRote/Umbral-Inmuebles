import { getDictionary, href, type Locale } from "@/i18n";
import { contact } from "@/data/site";
import { Split } from "./motion";
import { TLink } from "./tlink";

export function Footer({ lang }: { lang: Locale }) {
  const d = getDictionary(lang);
  const explore = [
    { path: "/propiedades", label: d.nav.properties },
    { path: "/desarrollos", label: d.nav.developments },
    { path: "/tasaciones", label: d.nav.appraisal },
    { path: "/favoritos", label: d.nav.favorites },
  ];
  const studio = [
    { path: "/nosotros", label: d.nav.about },
    { path: "/contacto", label: d.nav.contact },
  ];
  return (
    <footer className="relative overflow-hidden bg-ink pt-24 text-paper">
      <div className="wrap grid gap-12 pb-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="display text-[clamp(2.2rem,4.5vw,4rem)]">
            {d.footer.tagline.split(". ")[0]}.
            <br />
            <span className="italic-accent">{d.footer.tagline.split(". ")[1]}</span>
          </p>
        </div>
        <nav aria-label={d.footer.explore} className="md:col-span-2 md:col-start-7">
          <p className="eyebrow mb-5 text-paper/50">{d.footer.explore}</p>
          <ul className="space-y-1">
            {explore.map((l) => (
              <li key={l.path}>
                <TLink href={href(lang, l.path)} className="ulink inline-block py-1.5 text-paper/90">
                  {l.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={d.footer.studio} className="md:col-span-2">
          <p className="eyebrow mb-5 text-paper/50">{d.footer.studio}</p>
          <ul className="space-y-1">
            {studio.map((l) => (
              <li key={l.path}>
                <TLink href={href(lang, l.path)} className="ulink inline-block py-1.5 text-paper/90">
                  {l.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-2">
          <p className="eyebrow mb-5 text-paper/50">{d.contact.office}</p>
          <p className="text-paper/90">{contact.office[lang]}</p>
          <a href={`mailto:${contact.email}`} className="ulink mt-2 inline-block py-1.5 text-paper/90">
            {contact.email}
          </a>
        </div>
      </div>

      <div className="wrap" aria-hidden>
        <Split by="chars" stagger={0.05} className="display -mb-[0.12em] text-center text-[clamp(4rem,18.5vw,22rem)] leading-[0.8] tracking-[-0.04em] whitespace-nowrap">
          Umbral
        </Split>
      </div>

      <div className="relative border-t border-paper/15 bg-ink">
        <div className="wrap flex flex-col gap-3 py-6 text-[0.78rem] text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>{d.footer.disclaimer}</p>
          <p>{d.footer.credits}</p>
        </div>
      </div>
    </footer>
  );
}
