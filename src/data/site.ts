import type { L } from "@/i18n/config";

/** Fictional exchange rate used by the USD/ARS switch. */
export const ARS_PER_USD = 1480;

export const contact = {
  email: "hola@umbral.example",
  office: { es: "Palermo Soho, Buenos Aires", en: "Palermo Soho, Buenos Aires" } satisfies L,
  officeCenter: [-34.5888, -58.4302] as [number, number],
  hours: { es: "Lunes a viernes, 10 a 19 h · Sábados con cita", en: "Monday to Friday, 10 am to 7 pm · Saturdays by appointment" } satisfies L,
};

export const photos = {
  hero: "photo-1787088988806-7ec503692b85",
  threshold: "photo-1756706718604-ef4af3970e33",
  manifestoA: "photo-1633354747567-e0682586f082",
  manifestoB: "photo-1687075197041-91fba1013e1d",
  appraisal: "photo-1523217582562-09d0def993a6",
  closing: "photo-1721815693498-cc28507c0ba2",
  about: "photo-1776893471287-5a88c2e0743c",
  aboutB: "photo-1778166166309-d61053ea331c",
  contact: "photo-1628012209120-d9db7abf7eab",
};

export const team: { name: string; role: L; focus: L }[] = [
  { name: "Inés Lavalle", role: { es: "Fundadora y directora", en: "Founder and director" }, focus: { es: "Residencial premium", en: "Prime residential" } },
  { name: "Tomás Quirno", role: { es: "Desarrollos", en: "Developments" }, focus: { es: "Obra y preventa", en: "Construction and pre-sales" } },
  { name: "Julieta Ferrer", role: { es: "Ventas", en: "Sales" }, focus: { es: "Zona Norte y Costa", en: "North suburbs and coast" } },
  { name: "Bruno Sarmiento", role: { es: "Comercial", en: "Commercial" }, focus: { es: "Oficinas y locales", en: "Offices and retail" } },
  { name: "Camila Ortúzar", role: { es: "Alquileres", en: "Lettings" }, focus: { es: "Ciudad de Buenos Aires", en: "Buenos Aires City" } },
  { name: "Martín Iriarte", role: { es: "Tasaciones", en: "Valuations" }, focus: { es: "Datos de cierre y mercado", en: "Closing data and market" } },
];

export const testimonials: { quote: L; who: L }[] = [
  {
    quote: {
      es: "Vimos once casas en un año. Con Umbral vimos tres, y la tercera fue la nuestra.",
      en: "We saw eleven houses in a year. With Umbral we saw three, and the third was ours.",
    },
    who: { es: "Sofía y Mateo · compraron en San Isidro", en: "Sofía and Mateo · bought in San Isidro" },
  },
  {
    quote: {
      es: "Vendieron el departamento de mi madre sin un solo cartel en el balcón. Todavía lo agradezco.",
      en: "They sold my mother's apartment without a single sign on the balcony. I'm still grateful.",
    },
    who: { es: "Laura P. · vendió en Retiro", en: "Laura P. · sold in Retiro" },
  },
  {
    quote: {
      es: "Compré en pozo desde Madrid. Cada mes recibía el informe de obra con fotos, sin tener que pedirlo.",
      en: "I bought off-plan from Madrid. Every month the site report arrived with photos, without my asking.",
    },
    who: { es: "Diego R. · invirtió en Solar Núñez", en: "Diego R. · invested in Solar Núñez" },
  },
];

/** Fictional USD per m² by zone, used by the valuation estimate. */
export const pricePerM2: Record<string, number> = {
  "palermo-chico": 3600,
  "palermo-soho": 3100,
  "palermo-hollywood": 3000,
  retiro: 3200,
  catalinas: 2600,
  belgrano: 2900,
  nunez: 2800,
  "san-isidro": 2400,
  nordelta: 2300,
  tigre: 2000,
  carilo: 2300,
  bariloche: 3100,
  chacras: 1900,
};
