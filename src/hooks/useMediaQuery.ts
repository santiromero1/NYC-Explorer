import { useSyncExternalStore } from 'react';

// Breakpoint del diseño: >= 980px es desktop (sidebar), abajo es mobile (sheet)
const QUERY = '(min-width: 980px)';

export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(QUERY);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia(QUERY).matches,
  );
}
