import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { getDictionary, hasLocale, locales } from "@/i18n";
import { Providers } from "@/components/providers";
import { Shell } from "@/components/shell";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RefreshOnLoad } from "@/components/motion";
import "../globals.css";

const serif = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["300", "400", "500"], style: ["italic", "normal"] });
const sans = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: "variable" });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    title: { default: meta.title, template: "%s — Umbral" },
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, type: "website", locale: lang === "es" ? "es_AR" : "en_US" },
    alternates: { languages: { es: "/es", en: "/en" } },
    robots: { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#f4efe8" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh">
        <Providers lang={lang}>
          <Shell>
            <Header />
            <main id="main">{children}</main>
            <Footer lang={lang} />
          </Shell>
          <RefreshOnLoad />
        </Providers>
      </body>
    </html>
  );
}
