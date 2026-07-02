// Única autoridad sobre qué renderer de mapa está montado — ARCHITECTURE §5, MAP_CORE §5
import { Suspense, lazy } from 'react';
import { MapMode } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { SchematicMap } from './SchematicMap';

// MapLibre se carga lazy: no penaliza el arranque si no se usa (ARCHITECTURE §12)
const RealMap = lazy(() => import('./RealMap').then((m) => ({ default: m.RealMap })));

export function MapContainer() {
  const mapMode = useAppStore((s) => s.mapMode);

  return (
    <div className="map-area">
      {mapMode === MapMode.Schematic ? (
        <SchematicMap />
      ) : (
        <Suspense
          fallback={
            <div className="map-loading">
              <div className="spinner" aria-label="Cargando mapa" />
            </div>
          }
        >
          <RealMap />
        </Suspense>
      )}
    </div>
  );
}
