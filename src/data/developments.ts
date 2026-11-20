import type { L } from "@/i18n/config";

export type UnitStatus = "disponible" | "reservada" | "vendida";

export interface Unit {
  id: string;
  level: L;
  rooms: number;
  area: number;
  outdoor: number;
  priceUsd: number;
  status: UnitStatus;
}

export interface Development {
  slug: string;
  name: string;
  zone: string;
  units: Unit[];
  /** ISO month of the handover date. */
  delivery: string;
  progress: number;
  cover: string;
  gallery: string[];
  offset: [number, number];
  architect: string;
  tagline: L;
  summary: L;
  story: L;
  features: L[];
  stages: { name: L; done: number }[];
  financing: L;
}

const stages = (a: number, b: number, c: number, d: number) => [
  { name: { es: "Excavación y fundaciones", en: "Excavation and foundations" }, done: a },
  { name: { es: "Estructura", en: "Structure" }, done: b },
  { name: { es: "Cerramientos e instalaciones", en: "Envelope and services" }, done: c },
  { name: { es: "Terminaciones", en: "Finishes" }, done: d },
];

export const developments: Development[] = [
  {
    slug: "solar-nunez",
    name: "Solar Núñez",
    zone: "nunez",
    delivery: "2028-12",
    progress: 34,
    cover: "photo-1605267143746-999bf61d0d08",
    gallery: ["photo-1592276040264-e10344a6a10e", "photo-1644221150167-fb4fafa7f411", "photo-1722349676286-e2b912de06dd"],
    offset: [0.001, 0.002],
    architect: "Estudio Ferrán Iturbe",
    tagline: { es: "Catorce casas apiladas, cada una con su jardín", en: "Fourteen stacked homes, each with its own garden" },
    summary: {
      es: "Edificio de seis pisos con catorce unidades de dos a cuatro ambientes. Todas tienen terraza plantada de al menos 20 m² y orientación norte.",
      en: "A six-storey building with fourteen two- to four-room units. Every one has a planted terrace of at least 20 m² and faces north.",
    },
    story: {
      es: "Las losas se escalonan hacia el norte para que ninguna terraza quede a la sombra de la de arriba. La fachada es de ladrillo de máquina color arena y carpinterías de aluminio bronce.",
      en: "The floor slabs step back to the north so no terrace sits in the shadow of the one above. The facade is sand-coloured machine brick with bronze aluminium frames.",
    },
    features: [
      { es: "Terrazas plantadas con riego por goteo", en: "Planted terraces with drip irrigation" },
      { es: "Pileta y solárium en la azotea", en: "Rooftop pool and sun deck" },
      { es: "Cocheras con carga para autos eléctricos", en: "Parking with EV charging" },
      { es: "Bicicletero cubierto", en: "Covered bike store" },
    ],
    stages: stages(100, 70, 10, 0),
    financing: {
      es: "Anticipo del 35% y saldo en 36 cuotas en pesos ajustadas por índice de la construcción.",
      en: "35% deposit and the balance in 36 peso instalments indexed to construction costs.",
    },
    units: [
      { id: "1A", level: { es: "Piso 1", en: "Level 1" }, rooms: 2, area: 58, outdoor: 22, priceUsd: 310000, status: "vendida" },
      { id: "1B", level: { es: "Piso 1", en: "Level 1" }, rooms: 3, area: 84, outdoor: 31, priceUsd: 425000, status: "disponible" },
      { id: "2A", level: { es: "Piso 2", en: "Level 2" }, rooms: 2, area: 58, outdoor: 22, priceUsd: 318000, status: "reservada" },
      { id: "2B", level: { es: "Piso 2", en: "Level 2" }, rooms: 3, area: 84, outdoor: 31, priceUsd: 436000, status: "disponible" },
      { id: "3A", level: { es: "Piso 3", en: "Level 3" }, rooms: 3, area: 90, outdoor: 28, priceUsd: 458000, status: "disponible" },
      { id: "4A", level: { es: "Piso 4", en: "Level 4" }, rooms: 4, area: 118, outdoor: 40, priceUsd: 612000, status: "vendida" },
      { id: "5A", level: { es: "Piso 5", en: "Level 5" }, rooms: 4, area: 122, outdoor: 44, priceUsd: 648000, status: "disponible" },
      { id: "PH", level: { es: "Piso 6", en: "Level 6" }, rooms: 4, area: 140, outdoor: 96, priceUsd: 890000, status: "reservada" },
    ],
  },
  {
    slug: "ribera-tigre",
    name: "Ribera",
    zone: "tigre",
    delivery: "2027-06",
    progress: 68,
    cover: "photo-1781795290283-893dd050eeb3",
    gallery: ["photo-1613490493576-7fde63acd811", "photo-1613553507747-5f8d62ad5904", "photo-1644221150186-5d785a471f44"],
    offset: [0.002, -0.002],
    architect: "Mora Sánchez Arquitectas",
    tagline: { es: "Nueve casas con los pies en el río", en: "Nine houses with their feet in the river" },
    summary: {
      es: "Conjunto de nueve casas de tres y cuatro dormitorios sobre el río Luján, cada una con muelle propio y jardín al agua.",
      en: "A group of nine three- and four-bedroom houses on the Luján river, each with its own jetty and waterfront garden.",
    },
    story: {
      es: "Las casas se elevan un metro sobre el terreno natural para convivir con las crecidas. Debajo pasa el viento; arriba, todo es madera, vidrio y vista al agua.",
      en: "The houses sit a metre above natural ground to live with the floods. Wind passes beneath; above, everything is timber, glass and water views.",
    },
    features: [
      { es: "Muelle privado por unidad", en: "Private jetty for every house" },
      { es: "Guardería náutica compartida", en: "Shared boat storage" },
      { es: "Construcción elevada sobre pilotes", en: "Raised construction on piles" },
      { es: "Seguridad con control de acceso", en: "Controlled-access security" },
    ],
    stages: stages(100, 100, 75, 20),
    financing: {
      es: "Anticipo del 50% y saldo en 18 cuotas en dólares sin interés hasta la entrega.",
      en: "50% deposit and the balance in 18 interest-free dollar instalments until handover.",
    },
    units: [
      { id: "Casa 1", level: { es: "Lote 1", en: "Plot 1" }, rooms: 5, area: 210, outdoor: 600, priceUsd: 540000, status: "vendida" },
      { id: "Casa 2", level: { es: "Lote 2", en: "Plot 2" }, rooms: 5, area: 210, outdoor: 640, priceUsd: 560000, status: "vendida" },
      { id: "Casa 3", level: { es: "Lote 3", en: "Plot 3" }, rooms: 6, area: 245, outdoor: 700, priceUsd: 640000, status: "reservada" },
      { id: "Casa 4", level: { es: "Lote 4", en: "Plot 4" }, rooms: 5, area: 210, outdoor: 610, priceUsd: 565000, status: "disponible" },
      { id: "Casa 5", level: { es: "Lote 5", en: "Plot 5" }, rooms: 6, area: 245, outdoor: 720, priceUsd: 655000, status: "disponible" },
      { id: "Casa 6", level: { es: "Lote 6", en: "Plot 6" }, rooms: 6, area: 260, outdoor: 820, priceUsd: 720000, status: "disponible" },
    ],
  },
  {
    slug: "medanos-carilo",
    name: "Médanos",
    zone: "carilo",
    delivery: "2028-03",
    progress: 21,
    cover: "photo-1761158494764-bbf2a2e2a70d",
    gallery: ["photo-1703782997446-fba282cbfce6", "photo-1794760741312-6204131ca627", "photo-1703782997454-8eb0d4d94e9c", "photo-1599707254554-027aeb4deacd"],
    offset: [-0.003, -0.002],
    architect: "Taller Bruno Aldao",
    tagline: { es: "Ocho casas escondidas entre pinos y arena", en: "Eight houses hidden among pines and sand" },
    summary: {
      es: "Ocho casas de madera en un lote de tres hectáreas de bosque, conectadas por pasarelas elevadas que no tocan el médano.",
      en: "Eight timber houses on three hectares of forest, linked by raised walkways that never touch the dune.",
    },
    story: {
      es: "No se talará ningún pino de más de veinte años. Las casas se ubicaron entre los árboles existentes y las pasarelas siguen el relieve natural del médano.",
      en: "No pine older than twenty years will be cut. The houses were placed between the existing trees, and the walkways follow the dune's natural shape.",
    },
    features: [
      { es: "Pasarelas elevadas de madera", en: "Raised timber walkways" },
      { es: "Pileta común entre los pinos", en: "Shared pool among the pines" },
      { es: "Estructura de madera laminada", en: "Glulam timber structure" },
      { es: "Mantenimiento del bosque incluido", en: "Forest upkeep included" },
    ],
    stages: stages(100, 30, 0, 0),
    financing: {
      es: "Anticipo del 30% y saldo en 30 cuotas en dólares. Precio de preventa hasta completar la estructura.",
      en: "30% deposit and the balance in 30 dollar instalments. Pre-sale prices until the structure is complete.",
    },
    units: [
      { id: "Pino", level: { es: "Sector A", en: "Sector A" }, rooms: 4, area: 160, outdoor: 900, priceUsd: 690000, status: "disponible" },
      { id: "Acacia", level: { es: "Sector A", en: "Sector A" }, rooms: 4, area: 160, outdoor: 950, priceUsd: 705000, status: "reservada" },
      { id: "Álamo", level: { es: "Sector B", en: "Sector B" }, rooms: 5, area: 195, outdoor: 1100, priceUsd: 820000, status: "disponible" },
      { id: "Ciprés", level: { es: "Sector B", en: "Sector B" }, rooms: 5, area: 195, outdoor: 1050, priceUsd: 810000, status: "disponible" },
      { id: "Tamarisco", level: { es: "Sector C", en: "Sector C" }, rooms: 6, area: 230, outdoor: 1400, priceUsd: 960000, status: "disponible" },
    ],
  },
];

export const developmentBySlug = (slug: string) => developments.find((d) => d.slug === slug);
