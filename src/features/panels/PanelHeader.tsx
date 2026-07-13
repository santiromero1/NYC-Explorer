// Header del sheet/sidebar: título, leyenda de boroughs, segmented control,
// buscador con resultados, chips de días y barra de capas.
import { useTripStore, type Mode } from '../../store/useTripStore';
import { allStops, BOROUGH_LEGEND, DAYS, TRIP_SUBTITLE, TRIP_TITLE } from '../../data/itinerary';
import { SearchIcon, XIcon } from '../../components/icons';

const MODES: { key: Mode; label: string }[] = [
  { key: 'barrios', label: 'Barrios' },
  { key: 'calles', label: 'Calles' },
  { key: 'subway', label: 'Subway' },
  { key: 'itinerario', label: 'Itinerario' },
];

const OVERLAYS: { key: 'barrios' | 'calles' | 'subway'; label: string; color: string }[] = [
  { key: 'barrios', label: 'Barrios', color: '#34C759' },
  { key: 'calles', label: 'Calles', color: '#0A84FF' },
  { key: 'subway', label: 'Subway', color: '#FF6319' },
];

export function PanelHeader({ dragZone }: { dragZone?: boolean }) {
  const mode = useTripStore((s) => s.mode);
  const setMode = useTripStore((s) => s.setMode);
  const activeDay = useTripStore((s) => s.activeDay);
  const setActiveDay = useTripStore((s) => s.setActiveDay);
  const query = useTripStore((s) => s.query);
  const setQuery = useTripStore((s) => s.setQuery);
  const selectPlace = useTripStore((s) => s.selectPlace);
  const ovBarrios = useTripStore((s) => s.ovBarrios);
  const ovCalles = useTripStore((s) => s.ovCalles);
  const ovSubway = useTripStore((s) => s.ovSubway);
  const ov = { barrios: ovBarrios, calles: ovCalles, subway: ovSubway };
  const toggleOverlay = useTripStore((s) => s.toggleOverlay);

  const isItinerario = mode === 'itinerario';
  const q = query.trim().toLowerCase();
  const results = q
    ? allStops()
        .filter((p) => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q))
        .slice(0, 8)
    : [];

  return (
    <header className="panel-header" data-sheet-drag={dragZone || undefined}>
      <div className="title-row">
        <div>
          <h1 className="trip-title">{TRIP_TITLE}</h1>
          <div className="trip-subtitle">{TRIP_SUBTITLE}</div>
        </div>
        {isItinerario && (
          <div className="borough-legend" aria-hidden>
            {BOROUGH_LEGEND.map((b) => (
              <div className="borough-item" key={b.label}>
                <span className="borough-dot" style={{ background: b.color }} />
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="segmented" role="tablist" aria-label="Modo del mapa">
        {MODES.map((m) => (
          <button
            key={m.key}
            role="tab"
            aria-selected={mode === m.key}
            className={`segment ${mode === m.key ? 'active' : ''}`}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode !== 'barrios' && (
        <div className="search-wrap">
          <SearchIcon className="search-icon" />
          <input
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar un lugar"
            aria-label="Buscar un lugar"
          />
          {query.length > 0 && (
            <button className="search-clear" aria-label="Borrar búsqueda" onClick={() => setQuery('')}>
              <XIcon />
            </button>
          )}
          {results.length > 0 && (
            <div className="search-results">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="search-result"
                  onClick={() => {
                    setQuery('');
                    selectPlace(r.id);
                  }}
                >
                  <span className="dot" style={{ background: r.color }} />
                  <div className="search-result-text">
                    <div className="name">{r.name}</div>
                    <div className="meta">
                      {r.extra ? 'Extras' : `Día ${r.day}`} · {r.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isItinerario && (
        <div className="chips" role="tablist" aria-label="Filtrar por día">
          <button
            className={`chip ${activeDay === 'all' ? 'active' : ''}`}
            style={activeDay === 'all' ? { background: '#1c1c1e', boxShadow: '0 2px 8px rgba(0,0,0,.2)' } : undefined}
            onClick={() => setActiveDay('all')}
          >
            Todo el viaje
          </button>
          {DAYS.map((d) => {
            const active = activeDay === d.n;
            return (
              <button
                key={d.n}
                className={`chip ${active ? 'active' : ''}`}
                style={active ? { background: d.color, boxShadow: `0 2px 8px ${d.color}55` } : undefined}
                onClick={() => setActiveDay(d.n)}
              >
                {d.extra ? 'Extras' : `Día ${d.n}`}
              </button>
            );
          })}
        </div>
      )}

      {isItinerario && (
        <div className="overlay-bar">
          <span className="overlay-label">Capas</span>
          {OVERLAYS.map((o) => (
            <button
              key={o.key}
              className={`overlay-pill ${ov[o.key] ? 'on' : ''}`}
              style={ov[o.key] ? { background: o.color } : undefined}
              aria-pressed={ov[o.key]}
              onClick={() => toggleOverlay(o.key)}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
