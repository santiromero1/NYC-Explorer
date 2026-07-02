// Estado de UI del itinerario (vista activa, confirmaciones) — desacopla FAB/popover del panel
import { create } from 'zustand';

export type ItineraryView =
  | { type: 'list' }
  | { type: 'dayForm'; dayId?: string }
  | { type: 'pinEdit'; pinId: string };

export type ConfirmTarget = { kind: 'day'; id: string } | { kind: 'pin'; id: string } | null;

interface ItineraryUiState {
  view: ItineraryView;
  confirm: ConfirmTarget;
  setView: (v: ItineraryView) => void;
  setConfirm: (c: ConfirmTarget) => void;
}

export const useItineraryUi = create<ItineraryUiState>((set) => ({
  view: { type: 'list' },
  confirm: null,
  setView: (view) => set({ view }),
  setConfirm: (confirm) => set({ confirm }),
}));
