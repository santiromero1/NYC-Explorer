// Overlay de pins del itinerario en el esquemático — MAP_CORE §8
// Los pins se contra-escalan (scale 1/s) para mantener tamaño visual constante.
import { useRef } from 'react';
import { AppSection } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import { useItineraryStore } from '../../../store/useItineraryStore';
import { svgToGeo } from '../projection';

/** Forma del marcador (gota) — idéntica en ambos mapas para coherencia visual. */
export function PinShape({ color, size = 30 }: { color: string; size?: number }) {
  const s = size / 24;
  return (
    <g transform={`scale(${s}) translate(-12, -22)`}>
      <path
        d="M12 0C6.5 0 2 4.5 2 10c0 7 10 12 10 12s10-5 10-12C22 4.5 17.5 0 12 0z"
        fill={color}
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={1.2}
      />
      <circle cx={12} cy={9.5} r={3.4} fill="rgba(13,17,23,0.85)" />
    </g>
  );
}

export function PinsSvg({ scale }: { scale: number }) {
  const activeSection = useAppStore((s) => s.activeSection);
  const focusedDayId = useAppStore((s) => s.focusedDayId);
  const placing = useAppStore((s) => s.placing);
  const provisional = useAppStore((s) => s.provisional);
  const setProvisional = useAppStore((s) => s.setProvisional);
  const selectPin = useAppStore((s) => s.selectPin);
  const days = useItineraryStore((s) => s.days);

  const dragging = useRef(false);

  if (activeSection !== AppSection.Itinerary) return null;

  const inv = 1 / scale;
  const visibleDays = focusedDayId ? days.filter((d) => d.id === focusedDayId) : days;

  return (
    <g>
      {visibleDays.map((day) =>
        day.pins.map((pin) => (
          <g
            key={pin.id}
            className="pin-marker"
            transform={`translate(${pin.svg.x},${pin.svg.y}) scale(${inv})`}
            role="button"
            aria-label={`Lugar ${pin.name}, ${day.name}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              selectPin(pin.id);
            }}
          >
            {/* target táctil generoso */}
            <circle r={20} fill="transparent" />
            <PinShape color={day.color} />
          </g>
        )),
      )}

      {/* Marcador provisional (modo colocar), arrastrable */}
      {placing && provisional && (
        <g
          className="pin-marker"
          transform={`translate(${provisional.svg.x},${provisional.svg.y}) scale(${inv})`}
          onPointerDown={(e) => {
            e.stopPropagation();
            dragging.current = true;
            (e.currentTarget as SVGGElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!dragging.current) return;
            e.stopPropagation();
            // Convertir client -> coords de contenido con el CTM del grupo padre
            // (incluye viewport del SVG + transform de pan/zoom del mapa).
            const parent = (e.currentTarget as SVGGElement).parentNode as SVGGElement;
            const ctm = parent.getScreenCTM();
            if (!ctm) return;
            const inv = ctm.inverse();
            const content = {
              x: inv.a * e.clientX + inv.c * e.clientY + inv.e,
              y: inv.b * e.clientX + inv.d * e.clientY + inv.f,
            };
            setProvisional({ svg: content, geo: svgToGeo(content) });
          }}
          onPointerUp={(e) => {
            dragging.current = false;
            e.stopPropagation();
          }}
        >
          <circle r={26} fill="transparent" />
          <circle r={16} fill="none" stroke="#F7C948" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.8}>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
          </circle>
          <PinShape color="#F7C948" size={34} />
        </g>
      )}
    </g>
  );
}
