// Polígonos geográficos reales (aproximados) de los 13 barrios para el mapa real.
// Siguen la inclinación real de la isla (~29° NE), a diferencia de los rects del esquemático.
// Orden de puntos: anillo abierto (el render cierra el polígono repitiendo el primero).
import type { GeoPoint, NeighborhoodId } from '../types';

export const HOOD_GEO: Record<NeighborhoodId, GeoPoint[]> = {
  // Sur de Chambers St hasta la punta de la isla
  fidi: [
    { lng: -74.0186, lat: 40.705 },
    { lng: -74.017, lat: 40.7003 },
    { lng: -74.007, lat: 40.7 },
    { lng: -73.9985, lat: 40.708 },
    { lng: -74.002, lat: 40.7145 },
    { lng: -74.0135, lat: 40.716 },
  ],
  // Chambers -> Canal, al oeste de Broadway
  tribeca: [
    { lng: -74.0135, lat: 40.716 },
    { lng: -74.0055, lat: 40.7148 },
    { lng: -74.001, lat: 40.719 },
    { lng: -74.011, lat: 40.7228 },
  ],
  // Canal -> Houston, 6th Ave -> Lafayette
  soho: [
    { lng: -74.006, lat: 40.7222 },
    { lng: -73.9985, lat: 40.7195 },
    { lng: -73.9948, lat: 40.7254 },
    { lng: -74.0027, lat: 40.7282 },
  ],
  // Houston -> puentes, Bowery -> East River
  'lower-east-side': [
    { lng: -73.9929, lat: 40.7248 },
    { lng: -73.9737, lat: 40.7183 },
    { lng: -73.9855, lat: 40.7095 },
    { lng: -73.997, lat: 40.715 },
  ],
  // Houston -> 14th, Hudson -> Broadway (incluye West Village)
  'greenwich-village': [
    { lng: -74.0107, lat: 40.7287 },
    { lng: -73.9948, lat: 40.7254 },
    { lng: -73.9915, lat: 40.731 },
    { lng: -73.9907, lat: 40.7355 },
    { lng: -74.0093, lat: 40.7405 },
  ],
  // Houston -> 14th, Bowery/4th Ave -> East River
  'east-village': [
    { lng: -73.9929, lat: 40.7248 },
    { lng: -73.9737, lat: 40.7183 },
    { lng: -73.973, lat: 40.73 },
    { lng: -73.9895, lat: 40.735 },
  ],
  // 14th -> 34th, Hudson -> 6th Ave
  chelsea: [
    { lng: -74.0093, lat: 40.7405 },
    { lng: -73.9962, lat: 40.7374 },
    { lng: -73.9877, lat: 40.7497 },
    { lng: -74.0016, lat: 40.7556 },
  ],
  // 14th -> 30th, 6th Ave -> Park Ave South
  flatiron: [
    { lng: -73.9962, lat: 40.7374 },
    { lng: -73.9884, lat: 40.7342 },
    { lng: -73.9828, lat: 40.7443 },
    { lng: -73.9902, lat: 40.7473 },
  ],
  // 34th -> 59th, de río a río
  midtown: [
    { lng: -74.0016, lat: 40.7556 },
    { lng: -73.9718, lat: 40.7438 },
    { lng: -73.9605, lat: 40.7585 },
    { lng: -73.9928, lat: 40.7731 },
  ],
  // El rectángulo real del parque (59th–110th, 5th–CPW)
  'central-park': [
    { lng: -73.9819, lat: 40.7681 },
    { lng: -73.973, lat: 40.7644 },
    { lng: -73.9498, lat: 40.7966 },
    { lng: -73.9584, lat: 40.8003 },
  ],
  // 59th -> 110th, Hudson -> Central Park West
  'upper-west-side': [
    { lng: -73.9928, lat: 40.7731 },
    { lng: -73.9819, lat: 40.7681 },
    { lng: -73.9584, lat: 40.8003 },
    { lng: -73.9679, lat: 40.8027 },
  ],
  // 59th -> 110th, 5th Ave -> East River
  'upper-east-side': [
    { lng: -73.973, lat: 40.7644 },
    { lng: -73.9605, lat: 40.7585 },
    { lng: -73.9365, lat: 40.7895 },
    { lng: -73.9498, lat: 40.7966 },
  ],
  // 110th hacia el norte (el borde sur bordea la punta del parque)
  harlem: [
    { lng: -73.9679, lat: 40.8027 },
    { lng: -73.9584, lat: 40.8003 },
    { lng: -73.9498, lat: 40.7966 },
    { lng: -73.9365, lat: 40.7895 },
    { lng: -73.9295, lat: 40.801 },
    { lng: -73.954, lat: 40.8195 },
  ],
};

/** Centroide simple del polígono (promedio de vértices) — ancla de la etiqueta. */
export function hoodGeoCentroid(id: NeighborhoodId): GeoPoint {
  const pts = HOOD_GEO[id];
  const sum = pts.reduce((a, p) => ({ lng: a.lng + p.lng, lat: a.lat + p.lat }), {
    lng: 0,
    lat: 0,
  });
  return { lng: sum.lng / pts.length, lat: sum.lat / pts.length };
}
