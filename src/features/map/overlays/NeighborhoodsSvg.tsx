// Overlay de barrios en el mapa esquemático — Design Spec §2.4 y §9
import { AppSection } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import { NEIGHBORHOODS } from '../../../data/neighborhoods';

export function NeighborhoodsSvg() {
  const activeSection = useAppStore((s) => s.activeSection);
  const selectedId = useAppStore((s) => s.selectedNeighborhoodId);
  const inBarrios = activeSection === AppSection.Neighborhoods;

  return (
    <g>
      {NEIGHBORHOODS.map((n) => {
        if (n.svgShape.kind !== 'rect') return null;
        const r = n.svgShape;
        const isSelected = selectedId === n.id;
        const isDimmed = inBarrios && selectedId !== null && !isSelected;
        // Fuera de Barrios, las zonas quedan como contexto tenue
        const fillOpacity = !inBarrios ? 0.10 : isSelected ? 0.6 : isDimmed ? 0.15 : 0.35;
        const strokeOpacity = !inBarrios ? 0.35 : isDimmed ? 0.3 : 1;

        return (
          <g key={n.id} className="hood-zone" role={inBarrios ? 'button' : undefined}>
            {isSelected && (
              <rect
                x={r.x - 3}
                y={r.y - 3}
                width={r.width + 6}
                height={r.height + 6}
                rx={(r.radius ?? 10) + 3}
                fill="none"
                stroke={n.color}
                strokeWidth={1.5}
                opacity={0.45}
              />
            )}
            <rect
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              rx={r.radius ?? 10}
              fill={n.color}
              fillOpacity={fillOpacity}
              stroke={n.color}
              strokeOpacity={strokeOpacity}
              strokeWidth={1.5}
            />
            {!isDimmed && (
              <text
                className="hood-label"
                x={n.svgLabelAnchor.x}
                y={n.svgLabelAnchor.y}
                fontSize={n.svgShape.width < 100 ? 10 : 12}
                opacity={inBarrios ? 1 : 0.5}
              >
                {n.name}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
