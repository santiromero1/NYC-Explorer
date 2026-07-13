// Modo Itinerario: tarjeta de detalle de la parada seleccionada + lista por día.
import { useEffect, useRef, useState } from 'react';
import { useTripStore } from '../../store/useTripStore';
import { DAYS, stopById, type Day, type Place } from '../../data/itinerary';
import { XIcon } from '../../components/icons';

function DetailCard() {
  const selId = useTripStore((s) => s.selId);
  const visited = useTripStore((s) => s.visited);
  const notes = useTripStore((s) => s.notes);
  const toggleVisited = useTripStore((s) => s.toggleVisited);
  const setNote = useTripStore((s) => s.setNote);
  const selectPlace = useTripStore((s) => s.selectPlace);
  const [brokenPhoto, setBrokenPhoto] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

  // la tarjeta vive arriba del scroll: al seleccionar, subir para que se vea
  useEffect(() => {
    if (selId) ref.current?.closest('.panel-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selId]);

  if (!selId) return null;
  const sel = stopById(selId);
  if (!sel) return null;
  const isVisited = !!visited[sel.id];

  return (
    <article className="detail-card" key={sel.id} ref={ref}>
      <div
        className="detail-banner"
        style={{ background: `linear-gradient(135deg, ${sel.color}22, ${sel.color}0d), repeating-linear-gradient(45deg, #f4f4f7, #f4f4f7 11px, #ececf1 11px, #ececf1 22px)` }}
      >
        {brokenPhoto !== sel.id && (
          <img
            className="detail-photo"
            src={`/photos/${sel.id}.jpg`}
            alt={sel.name}
            loading="lazy"
            onError={() => setBrokenPhoto(sel.id)}
          />
        )}
        {brokenPhoto === sel.id && <span className="detail-placeholder">Foto del lugar</span>}
        <button className="detail-close" aria-label="Cerrar detalle" onClick={() => selectPlace(null)}>
          <XIcon />
        </button>
      </div>
      <div className="detail-body">
        <div className="detail-meta-row">
          <span className="stop-badge" style={{ background: sel.color }}>
            {sel.kind === 'food' ? '🍴' : sel.stop}
          </span>
          <span className="detail-day">
            {sel.extra ? 'Extras · si sobra tiempo' : `Día ${sel.day} · ${sel.dateLabel}`}
          </span>
        </div>
        <h2 className="detail-name">{sel.name}</h2>
        <div className="detail-type-row">
          <span className="dot" style={{ background: sel.color }} />
          <span>{sel.type}</span>
          <span className="sep">·</span>
          <span>{sel.time}</span>
          {sel.optional && (
            <>
              <span className="sep">·</span>
              <span className="opt-tag">Opcional</span>
            </>
          )}
        </div>
        <p className="detail-note">{sel.note}</p>

        <div className="transit-box">
          <div className="transit-badge">M</div>
          <div>
            <div className="box-label">Cómo llegar</div>
            <div className="transit-text">{sel.transit}</div>
          </div>
        </div>

        <button className={`visit-btn ${isVisited ? 'visited' : ''}`} onClick={() => toggleVisited(sel.id)}>
          {isVisited ? '✓ Visitado' : 'Marcar como visitado'}
        </button>

        <div className="notes-block">
          <div className="box-label">Tus notas</div>
          <textarea
            className="notes-input"
            value={notes[sel.id] ?? ''}
            onChange={(e) => setNote(sel.id, e.target.value)}
            placeholder="Agregá recordatorios, reservas, horarios…"
          />
        </div>
      </div>
    </article>
  );
}

function PlaceRow({ p, day, badge }: { p: Place; day: Day; badge: string | number }) {
  const selId = useTripStore((s) => s.selId);
  const visited = useTripStore((s) => s.visited);
  const selectPlace = useTripStore((s) => s.selectPlace);
  const isVisited = !!visited[p.id];
  const isFood = typeof badge === 'string';
  return (
    <div className={`place-row ${selId === p.id ? 'selected' : ''}`} onClick={() => selectPlace(p.id)}>
      <span
        className={`place-badge ${isFood ? 'food' : ''}`}
        style={isFood ? { color: day.color, borderColor: isVisited ? '#c7c7cc' : `${day.color}66` } : { background: isVisited ? '#c7c7cc' : day.color }}
      >
        {isVisited ? '✓' : badge}
      </span>
      <div className="place-text">
        <div className={`place-name ${isVisited ? 'visited' : ''}`}>
          {p.name}
          {p.optional && <span className="opt-tag">Opcional</span>}
        </div>
        <div className="place-meta">
          {p.type} · {p.time}
        </div>
      </div>
      <span className="chevron">›</span>
    </div>
  );
}

export function ItinerarioPanel() {
  const activeDay = useTripStore((s) => s.activeDay);
  const setActiveDay = useTripStore((s) => s.setActiveDay);

  const days = DAYS.filter((d) => activeDay === 'all' || d.n === activeDay);

  return (
    <>
      <DetailCard />
      {days.map((d) => (
        <section className="day-section" key={d.n}>
          <div className="day-header" onClick={() => setActiveDay(d.n)}>
            <span className="day-dot" style={{ background: d.color, boxShadow: `0 0 0 3px ${d.color}22` }} />
            <div className="day-header-text">
              <div className="day-title">{d.extra ? 'Extras' : `Día ${d.n} · ${d.dateLabel}`}</div>
              <div className="day-subtitle">{d.title}</div>
            </div>
            <span className="day-count">{d.places.length}</span>
          </div>
          {d.places.map((p, i) => (
            <div key={p.id}>
              {p.block && p.block !== d.places[i - 1]?.block && <div className="block-label">{p.block}</div>}
              <PlaceRow p={p} day={d} badge={i + 1} />
            </div>
          ))}
          {(d.food?.length ?? 0) > 0 && (
            <>
              <div className="block-label food">Para comer</div>
              {d.food!.map((p) => (
                <PlaceRow key={p.id} p={p} day={d} badge="🍴" />
              ))}
            </>
          )}
        </section>
      ))}
    </>
  );
}
