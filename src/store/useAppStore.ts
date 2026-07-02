// Estado global de la app — sección, modo de mapa, selección, modo colocar pin
// (ARCHITECTURE §3, DATA_MODEL §5). Prefs persistidas en clave separada.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppSection } from '../types';
import type { GeoPoint, MapViewport, NeighborhoodId, SvgPoint } from '../types';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '../features/map/projection';

export interface ProvisionalPoint {
  svg: SvgPoint;
  geo: GeoPoint;
}

/** Estado del flujo de colocar/reubicar un pin. */
export interface PlacingState {
  dayId: string;
  editingPinId?: string; // si está, es una reubicación de un pin existente
  draft: { name: string; note: string }; // se preserva al reubicar
}

interface AppState {
  activeSection: AppSection;
  selectedNeighborhoodId: NeighborhoodId | null;
  focusedDayId: string | null;
  selectedPinId: string | null;
  placing: PlacingState | null;
  provisional: ProvisionalPoint | null;
  viewport: MapViewport;
  hasSeenIntroHint: boolean;

  setSection: (s: AppSection) => void;
  selectNeighborhood: (id: NeighborhoodId | null) => void;
  setFocusedDay: (id: string | null) => void;
  selectPin: (id: string | null) => void;
  startPlacing: (p: PlacingState) => void;
  setProvisional: (p: ProvisionalPoint | null) => void;
  cancelPlacing: () => void;
  setPlacingDraft: (draft: { name: string; note: string }) => void;
  setViewport: (v: MapViewport) => void;
  markIntroHintSeen: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeSection: AppSection.Neighborhoods,
      selectedNeighborhoodId: null,
      focusedDayId: null,
      selectedPinId: null,
      placing: null,
      provisional: null,
      viewport: { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM },
      hasSeenIntroHint: false,

      setSection: (s) =>
        set({
          activeSection: s,
          // Cambiar de sección cierra paneles contextuales (UX_FLOWS §4)
          selectedPinId: null,
          ...(s !== AppSection.Neighborhoods ? { selectedNeighborhoodId: null } : {}),
        }),
      selectNeighborhood: (id) => set({ selectedNeighborhoodId: id }),
      setFocusedDay: (id) => set({ focusedDayId: id }),
      selectPin: (id) => set({ selectedPinId: id }),
      startPlacing: (p) => set({ placing: p, provisional: null, selectedPinId: null }),
      setProvisional: (p) => set({ provisional: p }),
      cancelPlacing: () => set({ placing: null, provisional: null }),
      setPlacingDraft: (draft) =>
        set((s) => (s.placing ? { placing: { ...s.placing, draft } } : s)),
      setViewport: (v) => set({ viewport: v }),
      markIntroHintSeen: () => set({ hasSeenIntroHint: true }),
    }),
    {
      name: 'nyc-explorer:prefs:v1',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        activeSection: s.activeSection,
        hasSeenIntroHint: s.hasSeenIntroHint,
      }),
    },
  ),
);
