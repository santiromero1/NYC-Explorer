// Bottom sheet mobile con snaps peek/half/full, drag por handle, swipe-down para cerrar
// (Design Spec §8.2). En desktop, el contenido se renderiza dentro del sidebar (App.tsx).
import { useEffect, useRef, useState, type ReactNode } from 'react';

export type Snap = 'peek' | 'half' | 'full';

const SNAP_VH: Record<Snap, number> = { peek: 32, half: 55, full: 88 };

interface SheetProps {
  open: boolean;
  onClose?: () => void;
  initialSnap?: Snap;
  /** Si false, el sheet no muestra backdrop y el mapa sigue interactivo. */
  modal?: boolean;
  children: ReactNode;
}

export function Sheet({ open, onClose, initialSnap = 'half', modal = false, children }: SheetProps) {
  const [snap, setSnap] = useState<Snap>(initialSnap);
  const [dragY, setDragY] = useState(0); // desplazamiento en vivo durante el drag (px)
  const dragState = useRef<{ startY: number; startHeight: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setSnap(initialSnap);
  }, [open, initialSnap]);

  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const heightVh = SNAP_VH[snap];

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = {
      startY: e.clientY,
      startHeight: (heightVh / 100) * window.innerHeight,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    setDragY(e.clientY - dragState.current.startY);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const endHeight = dragState.current.startHeight - (e.clientY - dragState.current.startY);
    const endVh = (endHeight / window.innerHeight) * 100;
    dragState.current = null;
    setDragY(0);
    // cerrar si quedó muy abajo
    if (endVh < 20 && onClose) {
      onClose();
      return;
    }
    // snap al más cercano
    const entries = Object.entries(SNAP_VH) as [Snap, number][];
    let best: Snap = 'half';
    let bestDist = Infinity;
    for (const [name, vh] of entries) {
      const d = Math.abs(vh - endVh);
      if (d < bestDist) {
        bestDist = d;
        best = name;
      }
    }
    setSnap(best);
  };

  const liveHeight = dragState.current
    ? Math.max(80, dragState.current.startHeight - dragY)
    : undefined;

  return (
    <>
      {modal && <div className="sheet-backdrop" onClick={onClose} />}
      <div
        ref={ref}
        className="sheet"
        role="dialog"
        aria-modal={modal}
        style={{
          height: liveHeight !== undefined ? `${liveHeight}px` : `${heightVh}vh`,
          transition: dragState.current ? 'none' : 'height var(--duration-base) var(--ease-in)',
        }}
      >
        <div
          className="sheet-handle-area"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="sheet-handle" />
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </>
  );
}
