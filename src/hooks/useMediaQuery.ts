import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
  );
}

/** true en desktop (sidebar); false en mobile/tablet (sheets + bottom nav). */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
