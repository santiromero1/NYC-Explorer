// Geometría REAL del grid para el mapa real: la grilla de Manhattan está rotada ~29° NE,
// así que las streets/avenues se generan con anclas reales, no con lat/lng constantes.
import type { GeoPoint } from '../types';
import { GRID } from './grid';

export interface GeoLine {
  label: string;
  isKey: boolean;
  path: [GeoPoint, GeoPoint];
}

// Extremos reales de la 14th y la 110th (río a río) — las demás streets se interpolan.
const W14: GeoPoint = { lng: -74.0093, lat: 40.7405 };
const W110: GeoPoint = { lng: -73.9679, lat: 40.8027 };
const E14: GeoPoint = { lng: -73.973, lat: 40.73 };
const E110: GeoPoint = { lng: -73.9365, lat: 40.7895 };

function lerp(a: GeoPoint, b: GeoPoint, t: number): GeoPoint {
  return { lng: a.lng + (b.lng - a.lng) * t, lat: a.lat + (b.lat - a.lat) * t };
}

/** Recta de una street numerada, de río a río, siguiendo la inclinación real. */
export function streetGeoLine(streetNumber: number): [GeoPoint, GeoPoint] {
  const t = (streetNumber - 14) / (110 - 14);
  return [lerp(W14, W110, t), lerp(E14, E110, t)];
}

// Houston no es parte de la grilla: extremos reales explícitos.
const HOUSTON: [GeoPoint, GeoPoint] = [
  { lng: -74.0107, lat: 40.7287 },
  { lng: -73.9737, lat: 40.7183 },
];

export const STREET_GEO_LINES: GeoLine[] = GRID.streets.map((st) => ({
  label: st.label,
  isKey: st.importance === 'key',
  path: st.number === 0 ? HOUSTON : streetGeoLine(st.number),
}));

// Avenidas: ancla real en la 42nd St + dirección de la isla (por street).
// dir ≈ promedio de la pendiente de los rieles oeste y este.
const DIR_PER_STREET: GeoPoint = { lng: 4.06e-4, lat: 6.34e-4 };

interface AvenueDef {
  label: string;
  anchor42: GeoPoint; // posición en la 42nd St
  from: number; // street donde empieza
  to: number; // street donde termina
  isKey: boolean;
}

const AVENUES: AvenueDef[] = [
  { label: '1st Ave', anchor42: { lng: -73.9686, lat: 40.749 }, from: 1, to: 110, isKey: false },
  { label: '2nd Ave', anchor42: { lng: -73.9713, lat: 40.75 }, from: 1, to: 110, isKey: false },
  { label: '3rd Ave', anchor42: { lng: -73.974, lat: 40.7511 }, from: 1, to: 110, isKey: false },
  { label: 'Lexington Ave', anchor42: { lng: -73.9757, lat: 40.7518 }, from: 21, to: 110, isKey: false },
  { label: 'Park Ave', anchor42: { lng: -73.9772, lat: 40.7527 }, from: 14, to: 110, isKey: true },
  { label: 'Madison Ave', anchor42: { lng: -73.9797, lat: 40.7537 }, from: 23, to: 110, isKey: false },
  { label: '5th Ave', anchor42: { lng: -73.9819, lat: 40.7535 }, from: 8, to: 110, isKey: true },
  { label: '6th Ave', anchor42: { lng: -73.9841, lat: 40.7545 }, from: 8, to: 59, isKey: false },
  { label: '7th Ave', anchor42: { lng: -73.987, lat: 40.7555 }, from: 12, to: 59, isKey: true },
  { label: '8th Ave / CPW', anchor42: { lng: -73.9899, lat: 40.757 }, from: 14, to: 110, isKey: false },
  { label: '9th Ave / Columbus', anchor42: { lng: -73.9925, lat: 40.758 }, from: 14, to: 110, isKey: false },
  { label: '10th Ave / Amsterdam', anchor42: { lng: -73.995, lat: 40.7591 }, from: 14, to: 110, isKey: false },
  { label: '11th Ave / West End', anchor42: { lng: -73.9976, lat: 40.7602 }, from: 14, to: 107, isKey: false },
];

function avenuePoint(av: AvenueDef, street: number): GeoPoint {
  return {
    lng: av.anchor42.lng + (street - 42) * DIR_PER_STREET.lng,
    lat: av.anchor42.lat + (street - 42) * DIR_PER_STREET.lat,
  };
}

export const AVENUE_GEO_LINES: GeoLine[] = AVENUES.map((av) => ({
  label: av.label,
  isKey: av.isKey,
  path: [avenuePoint(av, av.from), avenuePoint(av, av.to)],
}));

/** Ángulo CSS (deg) para alinear una etiqueta con su línea en pantalla (Mercator conserva ángulos). */
export function lineAngleDeg([a, b]: [GeoPoint, GeoPoint]): number {
  const midLat = ((a.lat + b.lat) / 2) * (Math.PI / 180);
  const dx = (b.lng - a.lng) * Math.cos(midLat);
  const dy = b.lat - a.lat;
  return -(Math.atan2(dy, dx) * 180) / Math.PI;
}

/** Punto intermedio de una línea (para anclar etiquetas de avenidas, con stagger). */
export function linePointAt([a, b]: [GeoPoint, GeoPoint], t: number): GeoPoint {
  return lerp(a, b, t);
}
