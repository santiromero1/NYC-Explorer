// Modo Subway: leyenda de líneas por color + estación más cercana a cada parada.
import { useTripStore } from '../../store/useTripStore';
import { SUBWAY_LEGEND, nearestStations } from '../../data/geo';
import { allStops } from '../../data/itinerary';

export function SubwayPanel() {
  const selectPlace = useTripStore((s) => s.selectPlace);
  const setMode = useTripStore((s) => s.setMode);
  const nearest = nearestStations();

  return (
    <div className="panel-section">
      <h2 className="section-title">Subway de Nueva York</h2>
      <p className="section-hint">
        Cada línea tiene un color según la avenida por la que corre. Los puntos son estaciones (tocá para ver el
        nombre).
      </p>
      {SUBWAY_LEGEND.map((l) => (
        <div className="subway-legend-row" key={l.label}>
          <span className="subway-bar" style={{ background: l.color }} />
          <div className="subway-label">{l.label}</div>
          <div className="subway-note">{l.note}</div>
        </div>
      ))}
      <div className="box-label stops-label">Estación más cercana a cada parada</div>
      {allStops().map((s) => (
        <div
          className="subway-stop-row"
          key={s.id}
          onClick={() => {
            setMode('itinerario');
            selectPlace(s.id);
          }}
        >
          <span className="dot" style={{ background: s.color }} />
          <div className="subway-stop-name">{s.name}</div>
          <span className="subway-station">{nearest.get(s.id) ?? '—'}</span>
        </div>
      ))}
    </div>
  );
}
