"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

export type MapPoint = { id: string; lat: number; lng: number; label: string; popup?: string };

/**
 * Leaflet on OpenStreetMap tiles, toned to the site palette in CSS. Wheel zoom stays off so the map never traps page scroll.
 * `circle` draws an approximate area instead of pins (property pages never show an exact spot).
 */
export function MapView({
  points = [],
  circle,
  zoom = 14,
  className = "",
  label,
}: {
  points?: MapPoint[];
  circle?: { lat: number; lng: number; radius: number };
  zoom?: number;
  className?: string;
  label: string;
}) {
  const el = useRef<HTMLDivElement>(null);
  const key = JSON.stringify([points, circle, zoom]);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        className: "umbral-tiles",
      }).addTo(map);

      if (circle) {
        L.circle([circle.lat, circle.lng], { radius: circle.radius, color: "#1a1714", weight: 1, fillColor: "#9c6447", fillOpacity: 0.18 }).addTo(map);
        map.setView([circle.lat, circle.lng], zoom);
      }
      if (points.length) {
        const markers = points.map((p) => {
          const m = L.marker([p.lat, p.lng], {
            icon: L.divIcon({ className: "", html: `<div class="umbral-pin">${p.label}</div>`, iconSize: [0, 0] }),
            keyboard: true,
            title: p.label,
          });
          if (p.popup) m.bindPopup(p.popup, { closeButton: false, offset: [0, -12] });
          return m.addTo(map!);
        });
        if (!circle) {
          if (points.length === 1) map.setView([points[0].lat, points[0].lng], zoom);
          else map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [60, 60], maxZoom: 13 });
        }
      }
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return <div ref={el} role="region" aria-label={label} className={`isolate z-0 bg-paper-2 ${className}`} />;
}
