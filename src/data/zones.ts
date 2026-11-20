import type { L } from "@/i18n/config";

export type Region = "caba" | "norte" | "costa" | "patagonia" | "cuyo";

export interface Zone {
  id: string;
  name: string;
  city: L;
  region: Region;
  /** Neighbourhood centre, used only to place the approximate map circle. */
  center: [number, number];
}

export const regions: Record<Region, L> = {
  caba: { es: "Ciudad de Buenos Aires", en: "Buenos Aires City" },
  norte: { es: "Zona Norte", en: "North suburbs" },
  costa: { es: "Costa Atlántica", en: "Atlantic coast" },
  patagonia: { es: "Patagonia", en: "Patagonia" },
  cuyo: { es: "Mendoza", en: "Mendoza" },
};

export const zones: Zone[] = [
  { id: "palermo-chico", name: "Palermo Chico", city: { es: "Buenos Aires", en: "Buenos Aires" }, region: "caba", center: [-34.5795, -58.4045] },
  { id: "palermo-soho", name: "Palermo Soho", city: { es: "Buenos Aires", en: "Buenos Aires" }, region: "caba", center: [-34.5888, -58.4302] },
  { id: "palermo-hollywood", name: "Palermo Hollywood", city: { es: "Buenos Aires", en: "Buenos Aires" }, region: "caba", center: [-34.5826, -58.4372] },
  { id: "retiro", name: "Retiro", city: { es: "Buenos Aires", en: "Buenos Aires" }, region: "caba", center: [-34.5925, -58.3818] },
  { id: "catalinas", name: "Catalinas", city: { es: "Buenos Aires", en: "Buenos Aires" }, region: "caba", center: [-34.5968, -58.3705] },
  { id: "belgrano", name: "Belgrano R", city: { es: "Buenos Aires", en: "Buenos Aires" }, region: "caba", center: [-34.5688, -58.4652] },
  { id: "nunez", name: "Núñez", city: { es: "Buenos Aires", en: "Buenos Aires" }, region: "caba", center: [-34.5452, -58.4598] },
  { id: "san-isidro", name: "San Isidro", city: { es: "Provincia de Buenos Aires", en: "Buenos Aires Province" }, region: "norte", center: [-34.4722, -58.5138] },
  { id: "nordelta", name: "Nordelta", city: { es: "Tigre", en: "Tigre" }, region: "norte", center: [-34.4062, -58.6398] },
  { id: "tigre", name: "Tigre", city: { es: "Provincia de Buenos Aires", en: "Buenos Aires Province" }, region: "norte", center: [-34.4205, -58.5795] },
  { id: "carilo", name: "Cariló", city: { es: "Pinamar", en: "Pinamar" }, region: "costa", center: [-37.1632, -56.8958] },
  { id: "bariloche", name: "Arelauquen", city: { es: "Bariloche", en: "Bariloche" }, region: "patagonia", center: [-41.1605, -71.3498] },
  { id: "chacras", name: "Chacras de Coria", city: { es: "Mendoza", en: "Mendoza" }, region: "cuyo", center: [-32.9852, -68.8748] },
];

export const zoneById = (id: string) => zones.find((z) => z.id === id)!;
