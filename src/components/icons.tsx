// Íconos inline de la app (trazo simple, look iOS)
import type { SVGProps } from 'react';

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" width={16} height={16} aria-hidden {...p}>
    <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="2" />
    <path d="M13 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const XIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 14 14" fill="none" width={12} height={12} aria-hidden {...p}>
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const RecenterIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" width={22} height={22} aria-hidden {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="3.5" fill="currentColor" />
  </svg>
);
