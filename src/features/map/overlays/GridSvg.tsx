// Overlay del grid (streets, avenues, Broadway) en el esquemático — GRID.md
import { AppSection } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import { GRID, BROADWAY_SQUARES } from '../../../data/grid';

const LINE_COLOR = '#8B949E';
const KEY_COLOR = '#E6EDF3';
const BROADWAY_COLOR = '#F7C948';

export function GridSvg() {
  const visible = useAppStore((s) => s.activeSection === AppSection.Grid);
  if (!visible) return null;

  return (
    <g pointerEvents="none">
      {/* Streets: líneas horizontales */}
      {GRID.streets.map((st) => {
        const isKey = st.importance === 'key';
        return (
          <g key={st.label}>
            <line
              x1={55}
              y1={st.svgY}
              x2={345}
              y2={st.svgY}
              stroke={isKey ? KEY_COLOR : LINE_COLOR}
              strokeWidth={isKey ? 1.2 : 0.7}
              strokeOpacity={isKey ? 0.55 : 0.35}
              strokeDasharray={isKey ? undefined : '4 4'}
            />
            <text className="grid-label" x={58} y={st.svgY - 4} fontSize={10}>
              {st.label}
            </text>
          </g>
        );
      })}

      {/* Avenues: líneas verticales */}
      {GRID.avenues.map((av) => {
        const isKey = av.importance === 'key';
        return (
          <g key={av.label}>
            <line
              x1={av.svgX}
              y1={70}
              x2={av.svgX}
              y2={840}
              stroke={isKey ? KEY_COLOR : LINE_COLOR}
              strokeWidth={isKey ? 1.2 : 0.7}
              strokeOpacity={isKey ? 0.5 : 0.28}
              strokeDasharray={isKey ? undefined : '4 4'}
            />
            <text
              className="grid-label"
              x={av.svgX}
              y={78}
              fontSize={9}
              textAnchor="middle"
              transform={`rotate(-90 ${av.svgX} 78)`}
              style={{ textAnchor: 'end' }}
            >
              {av.label}
            </text>
          </g>
        );
      })}

      {/* Broadway: la diagonal */}
      <polyline
        points={GRID.broadway.svgPath.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={BROADWAY_COLOR}
        strokeWidth={2.5}
        strokeOpacity={0.85}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <text
        className="grid-label"
        x={158}
        y={240}
        fontSize={11}
        fill={BROADWAY_COLOR}
        transform="rotate(80 158 240)"
      >
        BROADWAY
      </text>

      {/* Plazas donde Broadway corta avenidas */}
      {BROADWAY_SQUARES.map((sq) => {
        const pt = GRID.broadway.svgPath.find((p) => p.y === sq.svgY);
        if (!pt) return null;
        return (
          <g key={sq.label}>
            <circle cx={pt.x} cy={pt.y} r={4} fill={BROADWAY_COLOR} />
            <circle cx={pt.x} cy={pt.y} r={7} fill="none" stroke={BROADWAY_COLOR} strokeOpacity={0.4} />
            <text className="grid-label" x={pt.x + 12} y={pt.y + 3} fontSize={9} fill={BROADWAY_COLOR}>
              {sq.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
