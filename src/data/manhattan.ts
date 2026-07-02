// Silueta estilizada de la isla de Manhattan para el mapa esquemático.
// Polígono suave dentro de x:40-360, y:40-860 (MAP_CORE §1-2).
import type { SvgPoint } from '../types';

export const ISLAND_OUTLINE: SvgPoint[] = [
  // Punta norte (Harlem / Inwood simplificado)
  { x: 150, y: 42 },
  { x: 250, y: 42 },
  { x: 300, y: 52 },
  { x: 330, y: 90 },
  // Costa este bajando
  { x: 345, y: 160 },
  { x: 352, y: 260 },
  { x: 350, y: 360 },
  { x: 342, y: 460 },
  { x: 338, y: 560 },
  { x: 336, y: 640 },
  { x: 330, y: 700 },
  { x: 318, y: 760 },
  // Punta sur (Battery)
  { x: 290, y: 820 },
  { x: 250, y: 852 },
  { x: 210, y: 860 },
  { x: 180, y: 852 },
  { x: 158, y: 828 },
  // Costa oeste subiendo (Hudson)
  { x: 118, y: 760 },
  { x: 100, y: 690 },
  { x: 92, y: 620 },
  { x: 82, y: 540 },
  { x: 72, y: 450 },
  { x: 64, y: 360 },
  { x: 60, y: 260 },
  { x: 66, y: 160 },
  { x: 84, y: 90 },
  { x: 110, y: 55 },
];

export function polygonToPath(points: SvgPoint[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z';
}
