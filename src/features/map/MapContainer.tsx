// Hospeda el mapa de la app. MapLibre se carga lazy (chunk separado) para no
// penalizar el arranque; mientras tanto se muestra un spinner.
import { Suspense, lazy } from 'react';

const RealMap = lazy(() => import('./RealMap').then((m) => ({ default: m.RealMap })));

export function MapContainer() {
  return (
    <div className="map-area">
      <Suspense
        fallback={
          <div className="map-loading">
            <div className="spinner" aria-label="Cargando mapa" />
          </div>
        }
      >
        <RealMap />
      </Suspense>
    </div>
  );
}
