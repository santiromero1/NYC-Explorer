// Proyección geo <-> SVG — fuente única de verdad (SPECS/08_FEATURE_SPECS/MAP_CORE.md §7)
// Interpolación lineal entre los bounds geográficos de Manhattan y el viewBox del esquemático.
import type { GeoPoint, SvgPoint } from '../../types';

export const VIEWBOX = { width: 400, height: 900 } as const;

// Bounds geográficos del MVP (hasta Harlem)
export const GEO_BOUNDS = {
  north: 40.82, // -> svg y 40
  south: 40.7, // -> svg y 860
  west: -74.02, // -> svg x 40
  east: -73.93, // -> svg x 360
} as const;

const SVG_BOUNDS = { top: 40, bottom: 860, left: 40, right: 360 } as const;

export function geoToSvg(geo: GeoPoint): SvgPoint {
  const x =
    SVG_BOUNDS.left +
    ((geo.lng - GEO_BOUNDS.west) / (GEO_BOUNDS.east - GEO_BOUNDS.west)) *
      (SVG_BOUNDS.right - SVG_BOUNDS.left);
  const y =
    SVG_BOUNDS.top +
    ((GEO_BOUNDS.north - geo.lat) / (GEO_BOUNDS.north - GEO_BOUNDS.south)) *
      (SVG_BOUNDS.bottom - SVG_BOUNDS.top);
  return { x, y };
}

export function svgToGeo(p: SvgPoint): GeoPoint {
  const lng =
    GEO_BOUNDS.west +
    ((p.x - SVG_BOUNDS.left) / (SVG_BOUNDS.right - SVG_BOUNDS.left)) *
      (GEO_BOUNDS.east - GEO_BOUNDS.west);
  const lat =
    GEO_BOUNDS.north -
    ((p.y - SVG_BOUNDS.top) / (SVG_BOUNDS.bottom - SVG_BOUNDS.top)) *
      (GEO_BOUNDS.north - GEO_BOUNDS.south);
  return { lng, lat };
}

// --- Equivalencia de zoom esquemático <-> real (MAP_CORE §5) ---
// 1 unidad svg vertical ≈ 16.26 m. mpp(z) = 156543*cos(lat)/2^z.
const METERS_PER_SVG_UNIT =
  ((GEO_BOUNDS.north - GEO_BOUNDS.south) * 111320) / (SVG_BOUNDS.bottom - SVG_BOUNDS.top);
const MPP_BASE = 156543.03 * Math.cos((40.76 * Math.PI) / 180); // m/px a zoom 0

/** Zoom MapLibre equivalente a una escala `s` del esquemático con `basePxPerUnit` px por unidad svg. */
export function scaleToZoom(s: number, basePxPerUnit: number): number {
  const mpp = METERS_PER_SVG_UNIT / (s * basePxPerUnit);
  return Math.log2(MPP_BASE / mpp);
}

/** Escala del esquemático equivalente a un zoom MapLibre. */
export function zoomToScale(zoom: number, basePxPerUnit: number): number {
  const mpp = MPP_BASE / Math.pow(2, zoom);
  return METERS_PER_SVG_UNIT / (mpp * basePxPerUnit);
}

/** Centro geográfico por defecto (centro del viewBox). */
export const DEFAULT_CENTER: GeoPoint = svgToGeo({ x: 200, y: 450 });
export const DEFAULT_ZOOM = 11.6;
