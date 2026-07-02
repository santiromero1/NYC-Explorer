// Utilidades puras — ids, colores de día, formato de fecha
import type { Day } from '../types';

/** Paleta de colores de día (Design Spec §2.5), asignada por orden de creación. */
export const DAY_COLORS = [
  '#F7C948', // 1 amarillo taxi
  '#58A6FF', // 2 azul
  '#3FB950', // 3 verde
  '#FF7B72', // 4 coral
  '#BC8CFF', // 5 violeta
  '#FF9F43', // 6 naranja
  '#2DD4BF', // 7 turquesa
  '#F472B6', // 8 rosa
  '#A3E635', // 9 lima
  '#38BDF8', // 10 celeste
];

export function dayColorForIndex(createdCount: number): string {
  return DAY_COLORS[createdCount % DAY_COLORS.length];
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** "2026-03-12" -> "jue 12 mar" (es-AR, sin problemas de timezone). */
export function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return date
    .toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
    .replace(/\./g, '');
}

export function pinCountLabel(day: Day): string {
  const n = day.pins.length;
  return n === 1 ? '1 lugar' : `${n} lugares`;
}
