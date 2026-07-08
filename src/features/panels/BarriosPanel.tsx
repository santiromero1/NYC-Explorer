// Modo Barrios: detalle del barrio seleccionado + lista de barrios de Manhattan.
import { useEffect, useRef } from 'react';
import { useTripStore } from '../../store/useTripStore';
import { neighborhoods, neighborhoodByName } from '../../data/geo';
import { XIcon } from '../../components/icons';

function NbDetail() {
  const selNb = useTripStore((s) => s.selNb);
  const selectNb = useTripStore((s) => s.selectNb);
  const selectPlace = useTripStore((s) => s.selectPlace);
  const setMode = useTripStore((s) => s.setMode);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (selNb) ref.current?.closest('.panel-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selNb]);

  if (!selNb) return null;
  const nb = neighborhoodByName(selNb);
  if (!nb) return null;

  return (
    <article className="nb-card" key={nb.name} ref={ref}>
      <div className="nb-card-head">
        <span className="nb-dot lg" style={{ background: nb.color }} />
        <h2 className="nb-name">{nb.name}</h2>
        <button className="nb-close" aria-label="Cerrar barrio" onClick={() => selectNb(null)}>
          <XIcon />
        </button>
      </div>
      <p className="nb-desc">{nb.desc}</p>
      {nb.see.length > 0 && (
        <div className="see-box">
          <div className="box-label">Qué ver</div>
          <div className="see-text">{nb.see.join(' · ')}</div>
        </div>
      )}
      {nb.stops.length > 0 && (
        <>
          <div className="box-label stops-label">Tus paradas acá</div>
          {nb.stops.map((s) => (
            <div
              className="nb-stop-row"
              key={s.id}
              onClick={() => {
                setMode('itinerario');
                selectPlace(s.id);
              }}
            >
              <span className="dot" style={{ background: s.color }} />
              <div className="nb-stop-name">{s.name}</div>
              <span className="nb-stop-meta">Día {s.day}</span>
            </div>
          ))}
        </>
      )}
    </article>
  );
}

export function BarriosPanel() {
  const selectNb = useTripStore((s) => s.selectNb);
  const list = neighborhoods().filter((n) => n.major);

  return (
    <>
      <NbDetail />
      <div className="panel-section">
        <h2 className="section-title">Barrios de Manhattan</h2>
        <p className="section-hint">Tocá un barrio (en la lista o el mapa) para ver info y tus paradas.</p>
        {list.map((n) => (
          <div className="nb-row" key={n.name} onClick={() => selectNb(n.name)}>
            <span className="nb-dot" style={{ background: n.color, boxShadow: `0 0 0 3px ${n.color}33` }} />
            <div className="nb-row-text">
              <div className="nb-row-name">{n.name}</div>
              <div className="nb-row-blurb">{n.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
