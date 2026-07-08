// Bottom sheet mobile con 3 posiciones (full / mid / peek), arrastrable desde el
// handle y el header. Física: umbral de 6px para distinguir tap de drag,
// amortiguación en los extremos y snap por velocidad (flick) o cercanía.
import { useEffect, useRef, type ReactNode } from 'react';
import { useTripStore, type SheetSnap } from '../store/useTripStore';

const EASE = 'transform 340ms cubic-bezier(0.32, 0.72, 0, 1)';
const FLICK = 0.4; // px/ms

export function BottomSheet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const snap = useTripStore((s) => s.snap);
  const snapRef = useRef<SheetSnap>(snap);

  function offsets(): Record<SheetSnap, number> {
    const H = ref.current?.getBoundingClientRect().height || Math.round(window.innerHeight * 0.9);
    const ih = window.innerHeight;
    return { full: 0, mid: Math.round(H - ih * 0.46), peek: Math.max(0, H - 92) };
  }
  function apply(name: SheetSnap, animate: boolean) {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.style.transition = animate && !reduced ? EASE : 'none';
    el.style.transform = `translateY(${offsets()[name]}px)`;
  }

  useEffect(() => {
    snapRef.current = snap;
    apply(snap, true);
  }, [snap]);

  useEffect(() => {
    apply(snapRef.current, false);
    const onResize = () => apply(snapRef.current, false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pid = -1;
    let startY = 0;
    let curOffset = 0;
    let dragging = false;
    let dragY: number | null = null;
    let prevY = 0;
    let prevT = 0;
    let vel = 0;

    const onDown = (e: PointerEvent) => {
      if (pid !== -1) return; // multi-touch: ignorar dedos extra
      if (!(e.target as Element).closest?.('[data-sheet-drag]')) return;
      pid = e.pointerId;
      startY = prevY = e.clientY;
      prevT = performance.now();
      vel = 0;
      curOffset = offsets()[snapRef.current];
      dragging = false;
      dragY = null;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      const dy = e.clientY - startY;
      if (!dragging) {
        if (Math.abs(dy) < 6) return;
        dragging = true;
        el.style.transition = 'none';
        try {
          el.setPointerCapture(pid); // los clicks post-drag no llegan a los botones
        } catch {
          /* pointer ya liberado */
        }
      }
      e.preventDefault();
      const o = offsets();
      let y = curOffset + dy;
      // amortiguación: pasado el límite, el sheet se mueve cada vez menos
      if (y < o.full) y = y / 3;
      else if (y > o.peek) y = o.peek + (y - o.peek) / 3;
      el.style.transform = `translateY(${y}px)`;
      const now = performance.now();
      if (now - prevT > 4) {
        vel = (e.clientY - prevY) / (now - prevT);
        prevY = e.clientY;
        prevT = now;
      }
      dragY = y;
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      pid = -1;
      if (!dragging || dragY == null) return; // fue un tap
      const o = offsets();
      const order: SheetSnap[] = ['full', 'mid', 'peek'];
      let target: SheetSnap;
      if (Math.abs(vel) > FLICK) {
        // flick: ir a la siguiente posición en la dirección del gesto
        const going = vel > 0 ? order.filter((s) => o[s] > dragY! - 1) : order.filter((s) => o[s] < dragY! + 1).reverse();
        target = going[0] ?? (vel > 0 ? 'peek' : 'full');
      } else {
        target = order.reduce((best, s) => (Math.abs(o[s] - dragY!) < Math.abs(o[best] - dragY!) ? s : best), 'mid' as SheetSnap);
      }
      apply(target, true);
      useTripStore.getState().setSnap(target);
    };

    el.addEventListener('pointerdown', onDown);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="sheet" ref={ref}>
      <div className="sheet-grab" data-sheet-drag>
        <div className="sheet-handle" />
      </div>
      {children}
    </div>
  );
}
