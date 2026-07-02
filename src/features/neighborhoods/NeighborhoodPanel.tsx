// Panel de info de un barrio — BARRIOS.md §2
import type { Neighborhood } from '../../types';
import { useItineraryStore } from '../../store/useItineraryStore';
import { LightbulbIcon, XIcon } from '../../components/icons';

interface Props {
  neighborhood: Neighborhood;
  onClose: () => void;
}

export function NeighborhoodPanel({ neighborhood: n, onClose }: Props) {
  const days = useItineraryStore((s) => s.days);
  const daysHere = days.filter((d) => d.neighborhoodId === n.id).length;

  return (
    <div>
      <div className="sheet-title-row">
        <div className="hood-header" style={{ marginBottom: 0 }}>
          <div className="hood-color-bar" style={{ background: n.color }} />
          <h1 className="text-h1">{n.name}</h1>
        </div>
        <button className="btn btn-icon" aria-label="Cerrar" onClick={onClose}>
          <XIcon />
        </button>
      </div>

      <p className="hood-vibe text-body">{n.vibe}</p>
      <p className="hood-desc text-body">{n.description}</p>

      <div className="text-overline" style={{ color: 'var(--color-text-secondary)' }}>
        Spots clave
      </div>
      <ul className="spot-list">
        {n.spots.map((spot) => (
          <li key={spot.name}>
            <span className="spot-bullet" style={{ background: n.color }} />
            <div>
              <span className="spot-name text-body">{spot.name}</span>
              <span className="spot-desc"> — {spot.description}</span>
            </div>
          </li>
        ))}
      </ul>

      <div className="hood-tip">
        <LightbulbIcon style={{ width: 18, height: 18, flexShrink: 0, color: 'var(--color-accent)' }} />
        <span>{n.tip}</span>
      </div>

      {daysHere > 0 && (
        <span className="badge">
          {daysHere === 1 ? 'Tenés 1 día en esta zona' : `Tenés ${daysHere} días en esta zona`}
        </span>
      )}
    </div>
  );
}
