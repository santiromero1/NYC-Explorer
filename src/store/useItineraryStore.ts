// Store del itinerario — única puerta a los datos (ARCHITECTURE §3, ITINERARY.md §6)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Day, GeoPoint, NeighborhoodId, Pin, SvgPoint } from '../types';
import { dayColorForIndex, generateId } from '../lib/utils';

export interface DayInput {
  name: string;
  date?: string;
  neighborhoodId?: NeighborhoodId;
  description?: string;
}

export interface PinInput {
  name: string;
  note?: string;
  svg: SvgPoint;
  geo: GeoPoint;
}

interface ItineraryState {
  days: Day[];
  createdCount: number; // base para asignar color por orden de creación
  updatedAt: number;
  addDay: (data: DayInput) => Day;
  updateDay: (id: string, patch: Partial<DayInput>) => void;
  deleteDay: (id: string) => void;
  moveDay: (id: string, direction: -1 | 1) => void;
  addPin: (dayId: string, data: PinInput) => Pin;
  updatePin: (pinId: string, patch: Partial<PinInput>) => void;
  deletePin: (pinId: string) => void;
}

/** Detecta si localStorage está disponible (incógnito / bloqueado). */
export const storageAvailable = (() => {
  try {
    const k = '__nyc_test__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
})();

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set, get) => ({
      days: [],
      createdCount: 0,
      updatedAt: 0,

      addDay: (data) => {
        const { days, createdCount } = get();
        const day: Day = {
          id: generateId(),
          name: data.name.trim(),
          date: data.date || undefined,
          neighborhoodId: data.neighborhoodId,
          description: data.description?.trim() || undefined,
          color: dayColorForIndex(createdCount),
          order: days.length,
          pins: [],
          createdAt: Date.now(),
        };
        set({ days: [...days, day], createdCount: createdCount + 1, updatedAt: Date.now() });
        return day;
      },

      updateDay: (id, patch) =>
        set((s) => ({
          days: s.days.map((d) =>
            d.id === id
              ? {
                  ...d,
                  ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
                  ...(patch.date !== undefined ? { date: patch.date || undefined } : {}),
                  ...(patch.neighborhoodId !== undefined
                    ? { neighborhoodId: patch.neighborhoodId }
                    : {}),
                  ...(patch.description !== undefined
                    ? { description: patch.description?.trim() || undefined }
                    : {}),
                }
              : d,
          ),
          updatedAt: Date.now(),
        })),

      deleteDay: (id) =>
        set((s) => ({
          days: s.days
            .filter((d) => d.id !== id)
            .map((d, i) => ({ ...d, order: i })),
          updatedAt: Date.now(),
        })),

      moveDay: (id, direction) =>
        set((s) => {
          const idx = s.days.findIndex((d) => d.id === id);
          const target = idx + direction;
          if (idx < 0 || target < 0 || target >= s.days.length) return s;
          const days = [...s.days];
          [days[idx], days[target]] = [days[target], days[idx]];
          return { days: days.map((d, i) => ({ ...d, order: i })), updatedAt: Date.now() };
        }),

      addPin: (dayId, data) => {
        const pin: Pin = {
          id: generateId(),
          dayId,
          name: data.name.trim(),
          note: data.note?.trim() || undefined,
          svg: data.svg,
          geo: data.geo,
          order: get().days.find((d) => d.id === dayId)?.pins.length ?? 0,
          createdAt: Date.now(),
        };
        set((s) => ({
          days: s.days.map((d) => (d.id === dayId ? { ...d, pins: [...d.pins, pin] } : d)),
          updatedAt: Date.now(),
        }));
        return pin;
      },

      updatePin: (pinId, patch) =>
        set((s) => ({
          days: s.days.map((d) => ({
            ...d,
            pins: d.pins.map((p) =>
              p.id === pinId
                ? {
                    ...p,
                    ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
                    ...(patch.note !== undefined ? { note: patch.note?.trim() || undefined } : {}),
                    ...(patch.svg !== undefined ? { svg: patch.svg } : {}),
                    ...(patch.geo !== undefined ? { geo: patch.geo } : {}),
                  }
                : p,
            ),
          })),
          updatedAt: Date.now(),
        })),

      deletePin: (pinId) =>
        set((s) => ({
          days: s.days.map((d) => ({
            ...d,
            pins: d.pins.filter((p) => p.id !== pinId).map((p, i) => ({ ...p, order: i })),
          })),
          updatedAt: Date.now(),
        })),
    }),
    {
      name: 'nyc-explorer:itinerary:v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ days: s.days, createdCount: s.createdCount, updatedAt: s.updatedAt }),
    },
  ),
);

/** Busca un pin por id en todos los días. */
export function findPin(days: Day[], pinId: string): { pin: Pin; day: Day } | null {
  for (const day of days) {
    const pin = day.pins.find((p) => p.id === pinId);
    if (pin) return { pin, day };
  }
  return null;
}
