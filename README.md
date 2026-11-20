# Umbral — inmobiliaria de lujo silencioso (ficticia)

Pieza de portafolio: sitio de una inmobiliaria boutique **inventada**. Las propiedades, precios, personas y testimonios son ficticios.

## Stack

- Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind CSS 4
- GSAP (ScrollTrigger, SplitText) + Lenis para el scroll suave y las animaciones
- Leaflet con teselas de OpenStreetMap (sin API key)
- Photo Sphere Viewer para los recorridos 360°

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000 → redirige a /es o /en
npm run build
```

## Qué incluye

- `/es` y `/en`: textos en `src/i18n/{es,en}.ts`; datos bilingües en `src/data/`.
- Moneda USD/ARS en la cabecera (cotización ficticia en `src/data/site.ts`, se guarda en el navegador).
- Favoritos guardados en el navegador (`/favoritos`).
- Catálogo con filtros en la URL (operación, tipo, zona, precio, dormitorios, orden) y vista de mapa.
- Ficha de propiedad: galería con visor, recorrido 360° (dos propiedades), mapa con zona aproximada y consulta.
- Desarrollos en pozo: avance de obra, etapas, tabla de unidades filtrable y financiación.
- Tasación en 4 pasos con rango estimado (valores por m² ficticios).
- Transición de página "puertas", cursor propio, títulos que suben letra por letra, sección horizontal fijada.
- Con `prefers-reduced-motion: reduce` el sitio se muestra sin animaciones.

## Formularios por mail

Sin variables de entorno los formularios validan y responden en **modo demo** (no envían nada).
Para recibirlos por mail con [Resend](https://resend.com), copiá `.env.example` a `.env.local` (o cargalas en Vercel):

```
RESEND_API_KEY=...
LEADS_TO=tu-correo@dominio.com
LEADS_FROM="Umbral <hola@tu-dominio.com>"   # opcional, dominio verificado en Resend
```

## Créditos

- Fotografías: [Unsplash](https://unsplash.com) (licencia Unsplash), servidas desde su CDN.
- Panoramas 360°: [Poly Haven](https://polyhaven.com) `hotel_room` y `lebombo` (CC0), en `public/pano`.
- Mapas: © OpenStreetMap contributors.
- Tipografías: Bodoni Moda, Cormorant Garamond y Manrope (Google Fonts).
