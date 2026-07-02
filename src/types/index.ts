// Tipos del sistema — SPECS/06_DATA_MODEL.md

export interface SvgPoint {
  x: number;
  y: number;
}

export interface GeoPoint {
  lng: number;
  lat: number;
}

export type SvgShape =
  | { kind: 'rect'; x: number; y: number; width: number; height: number; radius?: number }
  | { kind: 'polygon'; points: SvgPoint[] };

export interface Spot {
  name: string;
  description: string;
}

export type NeighborhoodId =
  | 'fidi'
  | 'tribeca'
  | 'soho'
  | 'greenwich-village'
  | 'east-village'
  | 'lower-east-side'
  | 'chelsea'
  | 'flatiron'
  | 'midtown'
  | 'upper-west-side'
  | 'upper-east-side'
  | 'central-park'
  | 'harlem';

export interface Neighborhood {
  id: NeighborhoodId;
  name: string;
  vibe: string;
  description: string;
  spots: Spot[];
  tip: string;
  color: string;
  svgShape: SvgShape;
  svgLabelAnchor: SvgPoint;
}

export type GridImportance = 'key' | 'secondary';

export interface Street {
  label: string;
  number: number;
  svgY: number;
  geoLat: number;
  importance: GridImportance;
}

export interface Avenue {
  label: string;
  svgX: number;
  geoLng: number;
  importance: GridImportance;
}

export interface BroadwayLine {
  label: 'Broadway';
  svgPath: SvgPoint[];
  geoPath: GeoPoint[];
}

export interface GridData {
  streets: Street[];
  avenues: Avenue[];
  broadway: BroadwayLine;
}

export interface GridConcept {
  title: string;
  body: string;
  example?: string;
}

export interface Pin {
  id: string;
  dayId: string;
  name: string;
  note?: string;
  svg: SvgPoint;
  geo: GeoPoint;
  order: number;
  createdAt: number;
}

export interface Day {
  id: string;
  name: string;
  date?: string;
  neighborhoodId?: NeighborhoodId;
  description?: string;
  color: string;
  order: number;
  pins: Pin[];
  createdAt: number;
}

export enum AppSection {
  Neighborhoods = 'barrios',
  Grid = 'grid',
  Itinerary = 'itinerario',
}

export enum MapMode {
  Schematic = 'schematic',
  Real = 'real',
}

export interface MapViewport {
  center: GeoPoint;
  zoom: number;
}
