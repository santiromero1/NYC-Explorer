// Toasts efímeros (UX_FLOWS §14) — store mínimo + host
import { create } from 'zustand';

interface ToastItem {
  id: number;
  message: string;
  variant?: 'default' | 'warning';
}

interface ToastState {
  toasts: ToastItem[];
  show: (message: string, variant?: ToastItem['variant'], durationMs?: number) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, variant = 'default', durationMs = 2200) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
    setTimeout(() => get().dismiss(id), durationMs);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (message: string, variant?: ToastItem['variant'], durationMs?: number) =>
  useToastStore.getState().show(message, variant, durationMs);

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  if (toasts.length === 0) return null;
  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.variant === 'warning' ? 'warning' : ''}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
