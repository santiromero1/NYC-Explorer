// Modo Subway: leyenda de líneas por color + estación más cercana a cada parada.
import { useTripStore } from '../../store/useTripStore';
import { SUBWAY_LEGEND, nearestStations } from '../../data/geo';
import { allStops } from '../../data/itinerary';

export function SubwayPanel() {
  const selectPlace = useTripStore((s) => s.selectPlace);
  const setMode = useTripStore((s) => s.setMode);
  const subwayOff = useTripStore((s) => s.subwayOff);
  const toggleSubwayGroup = useTripStore((s) => s.toggleSubwayGroup);
  const showAllSubway = useTripStore((s) => s.showAllSubway);
  const nearest = nearestStations();
  const someOff = SUBWAY_LEGEND.some((l) => subwayOff[l.color]);

  return (
    <div className="panel-section">
      <div className="section-title-row">
        <h2 className="section-title">Subway de Nueva York</h2>
        {someOff && (
          <button className="legend-reset" onClick={showAllSubway}>
            Mostrar todas
          </button>
        )}
      </div>
      <p className="section-hint">
        Cada línea tiene un color según la avenida por la que corre. Tocá una línea de la leyenda para mostrarla u
        ocultarla en el mapa.
      </p>
      {SUBWAY_LEGEND.map((l) => {
        const off = !!subwayOff[l.color];
        return (
          <button
            className={`subway-legend-row ${off ? 'off' : ''}`}
            key={l.label}
            aria-pressed={!off}
            onClick={() => toggleSubwayGroup(l.color)}
          >
            <span className="subway-bar" style={{ background: l.color }} />
            <div className="subway-label">{l.label}</div>
            <div className="subway-note">{l.note}</div>
            <span className="subway-state" aria-hidden>
              {off ? '' : '✓'}
            </span>
          </button>
        );
      })}
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
