// Capa de datos geo empaquetados (sin fetch en runtime): barrios reales de Manhattan,
// líneas y estaciones de subway, y el grid de avenidas/calles para orientarse.
import nbJson from './geo/neighborhoods.json';
import subLinesJson from './geo/subway-lines.json';
import subStationsJson from './geo/subway-stations.json';
import { allStops, type Stop } from './itinerary';

// ---- Tipos mínimos de GeoJSON que usamos
export interface NbProps {
  name: string;
  color: string | null;
  desc: string | null;
  see: string[] | null;
  major: boolean;
  center: [number, number];
}
interface Feature<G, P> {
  type: 'Feature';
  properties: P;
  geometry: G;
}
type MultiPolygon = { type: 'MultiPolygon'; coordinates: number[][][][] };
type LineString = { type: 'LineString'; coordinates: number[][] };
type Point = { type: 'Point'; coordinates: number[] };
interface FC<F> {
  type: 'FeatureCollection';
  features: F[];
}

export const NB_FC = nbJson as FC<Feature<MultiPolygon, NbProps>>;
export const SUBWAY_LINES_FC = subLinesJson as FC<Feature<LineString, { route: string; color: string }>>;
export const SUBWAY_STATIONS_FC = subStationsJson as FC<Feature<Point, { name: string; lines: string }>>;

function hashColor(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return `hsl(${h}, 55%, 62%)`;
}

export function nbColor(p: NbProps): string {
  return p.color ?? hashColor(p.name);
}

// ---- point-in-polygon (ray casting) sobre MultiPolygon [lng,lat]
function pointInMultiPolygon(lng: number, lat: number, mp: MultiPolygon): boolean {
  for (const poly of mp.coordinates) {
    const ring = poly[0]; // anillo exterior
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    if (inside) return true;
  }
  return false;
}

export interface Neighborhood {
  name: string;
  color: string;
  desc: string;
  see: string[];
  major: boolean;
  center: [number, number];
  bounds: [[number, number], [number, number]];
  stops: Stop[];
}

function featureBounds(mp: MultiPolygon): [[number, number], [number, number]] {
  let w = Infinity, s = Infinity, e = -Infinity, n = -Infinity;
  for (const poly of mp.coordinates)
    for (const ring of poly)
      for (const [x, y] of ring) {
        if (x < w) w = x;
        if (x > e) e = x;
        if (y < s) s = y;
        if (y > n) n = y;
      }
  return [
    [w, s],
    [e, n],
  ];
}

function ringCount(mp: MultiPolygon): number {
  return mp.coordinates.reduce((s, poly) => s + poly[0].length, 0);
}

let _hoods: Neighborhood[] | null = null;
/**
 * Barrios con sus paradas asignadas, FUSIONADOS por nombre (el dataset de NTAs
 * trae varios polígonos para un mismo barrio, ej. East Harlem norte/sur).
 * Orden: major primero, alfabético.
 */
export function neighborhoods(): Neighborhood[] {
  if (_hoods) return _hoods;
  const byName = new Map<string, { nb: Neighborhood; biggest: number }>();
  for (const f of NB_FC.features) {
    const p = f.properties;
    const b = featureBounds(f.geometry);
    const size = ringCount(f.geometry);
    const prev = byName.get(p.name);
    if (!prev) {
      byName.set(p.name, {
        nb: {
          name: p.name,
          color: nbColor(p),
          desc: p.desc ?? 'Barrio de Manhattan.',
          see: p.see ?? [],
          major: p.major,
          center: p.center,
          bounds: b,
          stops: [],
        },
        biggest: size,
      });
    } else {
      const nb = prev.nb;
      nb.bounds = [
        [Math.min(nb.bounds[0][0], b[0][0]), Math.min(nb.bounds[0][1], b[0][1])],
        [Math.max(nb.bounds[1][0], b[1][0]), Math.max(nb.bounds[1][1], b[1][1])],
      ];
      if (size > prev.biggest) {
        prev.biggest = size;
        nb.center = p.center;
      }
    }
  }
  for (const stop of allStops()) {
    const f = NB_FC.features.find((ft) => pointInMultiPolygon(stop.lng, stop.lat, ft.geometry));
    if (f) byName.get(f.properties.name)?.nb.stops.push(stop);
  }
  _hoods = [...byName.values()]
    .map((e) => e.nb)
    .sort((a, b) => Number(b.major) - Number(a.major) || a.name.localeCompare(b.name));
  return _hoods;
}

export const neighborhoodByName = (name: string) => neighborhoods().find((n) => n.name === name);

// ---- Estación de subway más cercana a cada parada
let _nearest: Map<string, string> | null = null;
export function nearestStations(): Map<string, string> {
  if (_nearest) return _nearest;
  _nearest = new Map();
  const stations = SUBWAY_STATIONS_FC.features;
  for (const p of allStops()) {
    let best: string | null = null;
    let bd = Infinity;
    for (const s of stations) {
      const [lng, lat] = s.geometry.coordinates;
      const dy = lat - p.lat;
      const dx = (lng - p.lng) * 0.76;
      const d = dy * dy + dx * dx;
      if (d < bd) {
        bd = d;
        best = s.properties.name;
      }
    }
    if (best) _nearest.set(p.id, best);
  }
  return _nearest;
}

// ---- Colores MTA y leyenda del subway (mismos datos que el prototipo)
export const SUBWAY_LEGEND = [
  { label: '1 · 2 · 3', color: '#EE352E', note: 'Broadway–7 Av (rojo)' },
  { label: '4 · 5 · 6', color: '#00933C', note: 'Lexington Av (verde)' },
  { label: '7', color: '#B933AD', note: 'Flushing (violeta)' },
  { label: 'A · C · E', color: '#2850AD', note: '8 Av (azul)' },
  { label: 'B · D · F · M', color: '#FF6319', note: '6 Av (naranja)' },
  { label: 'N · Q · R · W', color: '#FCCC0A', note: 'Broadway (amarillo)' },
  { label: 'L', color: '#A7A9AC', note: '14 St crosstown (gris)' },
  { label: 'J · Z', color: '#996633', note: 'Nassau St (marrón)' },
  { label: 'G', color: '#6CBE45', note: 'Crosstown Brooklyn/Queens' },
];

// ---- Grid de Manhattan para la capa "Calles" (aproximado, para orientación)
export interface GridLine {
  name: string;
  line: [number, number][]; // [lat,lng] como el prototipo
  diag?: boolean;
}
export const CALLES: { avenues: GridLine[]; streets: GridLine[] } = {
  avenues: [
    { name: '8 Av', line: [[40.7395, -74.002], [40.795, -73.9665]] },
    { name: '7 Av', line: [[40.7355, -73.9995], [40.79, -73.964]] },
    { name: 'Broadway', line: [[40.7085, -74.0135], [40.748, -73.9885], [40.769, -73.982], [40.788, -73.9755]], diag: true },
    { name: '5 Av', line: [[40.7345, -73.9925], [40.791, -73.9565]] },
    { name: 'Madison Av', line: [[40.7385, -73.9865], [40.794, -73.952]] },
    { name: 'Park Av', line: [[40.7375, -73.988], [40.797, -73.951]] },
    { name: 'Lexington Av', line: [[40.737, -73.9855], [40.792, -73.948]] },
    { name: '3 Av', line: [[40.7355, -73.9835], [40.795, -73.947]] },
    { name: '2 Av', line: [[40.734, -73.981], [40.7925, -73.945]] },
    { name: '1 Av', line: [[40.733, -73.979], [40.79, -73.943]] },
  ],
  streets: [
    { name: '14 St', line: [[40.7405, -74.0055], [40.7315, -73.9755]] },
    { name: '23 St', line: [[40.7475, -74.0025], [40.7385, -73.9725]] },
    { name: '34 St', line: [[40.754, -73.999], [40.745, -73.9695]] },
    { name: '42 St', line: [[40.76, -73.9955], [40.751, -73.966]] },
    { name: '57 St', line: [[40.769, -73.9905], [40.76, -73.961]] },
    { name: '72 St', line: [[40.779, -73.9875], [40.77, -73.9585]] },
    { name: '86 St', line: [[40.787, -73.982], [40.7785, -73.954]] },
  ],
};
