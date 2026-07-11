// Estado global de la app: modo, día activo, selección, capas, visitados y notas.
// visited/notes persisten en localStorage (claves compartidas con el prototipo).
import { create } from 'zustand';

export type Mode = 'barrios' | 'calles' | 'subway' | 'itinerario';
export type SheetSnap = 'peek' | 'mid' | 'full';

const VISITED_KEY = 'nyc_visited';
const NOTES_KEY = 'nyc_notes';

function readJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || '') as T;
  } catch {
    return fallback;
  }
}
function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage lleno o bloqueado: la app sigue */
  }
}

interface TripState {
  mode: Mode;
  activeDay: number | 'all';
  query: string;
  selId: string | null;
  selNb: string | null;
  ovBarrios: boolean;
  ovCalles: boolean;
  ovSubway: boolean;
  /** Grupos de líneas de subway ocultos, por color de troncal (leyenda). */
  subwayOff: Record<string, boolean>;
  visited: Record<string, boolean>;
  notes: Record<string, string>;
  /** Snap pedido del sheet mobile; el sheet lo aplica y lo actualiza al arrastrar. */
  snap: SheetSnap;
  /** Contador que dispara un re-encuadre del mapa (FAB centrar). */
  recenterTick: number;

  setMode: (m: Mode) => void;
  setActiveDay: (d: number | 'all') => void;
  setQuery: (q: string) => void;
  selectPlace: (id: string | null) => void;
  selectNb: (name: string | null) => void;
  toggleOverlay: (k: 'barrios' | 'calles' | 'subway') => void;
  toggleSubwayGroup: (color: string) => void;
  showAllSubway: () => void;
  toggleVisited: (id: string) => void;
  setNote: (id: string, text: string) => void;
  setSnap: (s: SheetSnap) => void;
  recenter: () => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  mode: 'itinerario',
  activeDay: 'all',
  query: '',
  selId: null,
  selNb: null,
  ovBarrios: false,
  ovCalles: false,
  ovSubway: false,
  subwayOff: {},
  visited: readJson(VISITED_KEY, {}),
  notes: readJson(NOTES_KEY, {}),
  snap: 'mid',
  recenterTick: 0,

  setMode: (mode) =>
    set({ mode, selNb: null, ...(mode !== 'itinerario' ? { selId: null } : null) }),
  setActiveDay: (activeDay) => set({ activeDay }),
  setQuery: (query) => set({ query }),
  // al cerrar el detalle, el sheet vuelve a media altura (como el prototipo)
  selectPlace: (selId) => set(selId ? { selId, snap: 'full' } : { selId, snap: 'mid' }),
  selectNb: (selNb) => set(selNb ? { selNb, snap: 'full' } : { selNb }),
  toggleOverlay: (k) => {
    const key = { barrios: 'ovBarrios', calles: 'ovCalles', subway: 'ovSubway' }[k] as
      | 'ovBarrios'
      | 'ovCalles'
      | 'ovSubway';
    set({ [key]: !get()[key] } as Partial<TripState>);
  },
  toggleSubwayGroup: (color) => {
    const subwayOff = { ...get().subwayOff, [color]: !get().subwayOff[color] };
    if (!subwayOff[color]) delete subwayOff[color];
    set({ subwayOff });
  },
  showAllSubway: () => set({ subwayOff: {} }),
  toggleVisited: (id) => {
    const visited = { ...get().visited, [id]: !get().visited[id] };
    writeJson(VISITED_KEY, visited);
    set({ visited });
  },
  setNote: (id, text) => {
    const notes = { ...get().notes, [id]: text };
    writeJson(NOTES_KEY, notes);
    set({ notes });
  },
  setSnap: (snap) => set({ snap }),
  recenter: () => set({ recenterTick: get().recenterTick + 1 }),
}));
