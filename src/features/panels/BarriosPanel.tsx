// Modo Barrios: navegación jerárquica NYC (5 boroughs) -> zonas de Manhattan -> barrios.
import { useEffect, useRef } from 'react';
import { useTripStore } from '../../store/useTripStore';
import {
  boroughs,
  boroughById,
  manhattanZones,
  zoneById,
  zoneBarrios,
  neighborhoodByName,
  type Region,
} from '../../data/geo';
import type { Stop } from '../../data/itinerary';
import { ChevronLeftIcon, XIcon } from '../../components/icons';

function BackCrumb({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="crumb-back" onClick={onClick}>
      <ChevronLeftIcon />
      {label}
    </button>
  );
}

/** Filas de "Tus paradas acá": saltan al lugar dentro del itinerario. */
function StopRows({ stops }: { stops: Stop[] }) {
  const setMode = useTripStore((s) => s.setMode);
  const selectPlace = useTripStore((s) => s.selectPlace);
  if (!stops.length) return null;
  return (
    <>
      <div className="box-label stops-label">Tus paradas acá</div>
      {stops.map((s) => (
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
          <span className="nb-stop-meta">{s.extra ? 'Extras' : `Día ${s.day}`}</span>
        </div>
      ))}
    </>
  );
}

/** Ficha de un borough o una zona (mismo look que la ficha de barrio). */
function RegionCard({ region, onClose }: { region: Region; onClose?: () => void }) {
  return (
    <article className="nb-card" key={region.id}>
      <div className="nb-card-head">
        <span className="nb-dot lg" style={{ background: region.color }} />
        <h2 className="nb-name">{region.name}</h2>
        {onClose && (
          <button className="nb-close" aria-label="Cerrar" onClick={onClose}>
            <XIcon />
          </button>
        )}
      </div>
      <p className="nb-desc">{region.desc}</p>
      {region.see.length > 0 && (
        <div className="see-box">
          <div className="box-label">Qué ver</div>
          <div className="see-text">{region.see.join(' · ')}</div>
        </div>
      )}
      <StopRows stops={region.stops} />
    </article>
  );
}

function NbDetail() {
  const selNb = useTripStore((s) => s.selNb);
  const selectNb = useTripStore((s) => s.selectNb);
  const setMode = useTripStore((s) => s.setMode);
  const selectPlace = useTripStore((s) => s.selectPlace);
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

/** Nivel 1: los 5 boroughs. */
function CityList() {
  const selectBoro = useTripStore((s) => s.selectBoro);
  return (
    <div className="panel-section">
      <h2 className="section-title">Nueva York · 5 boroughs</h2>
      <p className="section-hint">Tocá un borough (en la lista o el mapa). Manhattan abre sus 5 zonas.</p>
      {boroughs().map((b) => (
        <div className="nb-row" key={b.id} onClick={() => selectBoro(b.id)}>
          <span className="nb-dot" style={{ background: b.color, boxShadow: `0 0 0 3px ${b.color}33` }} />
          <div className="nb-row-text">
            <div className="nb-row-name">{b.name}</div>
            <div className="nb-row-blurb">{b.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Ficha de un borough sin subdivisión (Bronx, Queens, Brooklyn, Staten Island). */
function BoroView({ boroId }: { boroId: string }) {
  const selectBoro = useTripStore((s) => s.selectBoro);
  const boro = boroughById(boroId);
  if (!boro) return null;
  return (
    <div className="panel-section">
      <BackCrumb label="Nueva York" onClick={() => selectBoro(null)} />
      <RegionCard region={boro} onClose={() => selectBoro(null)} />
    </div>
  );
}

/** Nivel 2: las 5 zonas de Manhattan. */
function ZonesList() {
  const selectBoro = useTripStore((s) => s.selectBoro);
  const selectZone = useTripStore((s) => s.selectZone);
  return (
    <div className="panel-section">
      <BackCrumb label="Nueva York" onClick={() => selectBoro(null)} />
      <h2 className="section-title">Zonas de Manhattan</h2>
      <p className="section-hint">Tocá una zona para ver sus barrios.</p>
      {manhattanZones().map((z) => (
        <div className="nb-row" key={z.id} onClick={() => selectZone(z.id)}>
          <span className="nb-dot" style={{ background: z.color, boxShadow: `0 0 0 3px ${z.color}33` }} />
          <div className="nb-row-text">
            <div className="nb-row-name">{z.name}</div>
            <div className="nb-row-blurb">{z.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Nivel 3: una zona con sus barrios. */
function ZoneView({ zoneId }: { zoneId: string }) {
  const selectZone = useTripStore((s) => s.selectZone);
  const selectNb = useTripStore((s) => s.selectNb);
  const selNb = useTripStore((s) => s.selNb);
  const zone = zoneById(zoneId);
  if (!zone) return null;
  const list = zoneBarrios(zoneId);
  return (
    <>
      <div className="panel-section">
        <BackCrumb label="Zonas de Manhattan" onClick={() => selectZone(null)} />
      </div>
      <NbDetail />
      {!selNb && <RegionCard region={zone} />}
      <div className="panel-section">
        <h2 className="section-title">Barrios de {zone.name}</h2>
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

export function BarriosPanel() {
  const selBoro = useTripStore((s) => s.selBoro);
  const selZone = useTripStore((s) => s.selZone);
  const ref = useRef<HTMLDivElement>(null);

  // al cambiar de nivel, la lista arranca desde arriba
  useEffect(() => {
    ref.current?.closest('.panel-scroll')?.scrollTo({ top: 0 });
  }, [selBoro, selZone]);

  let view;
  if (!selBoro) view = <CityList />;
  else if (selBoro !== 'manhattan') view = <BoroView boroId={selBoro} />;
  else if (!selZone) view = <ZonesList />;
  else view = <ZoneView zoneId={selZone} />;

  return <div ref={ref}>{view}</div>;
}
