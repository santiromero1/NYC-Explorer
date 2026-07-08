// Shell de la app: el mapa ocupa todo, con bottom sheet (mobile) o sidebar (desktop).
import { useTripStore } from './store/useTripStore';
import { useIsDesktop } from './hooks/useMediaQuery';
import { MapView } from './features/map/MapView';
import { BottomSheet } from './components/BottomSheet';
import { PanelHeader } from './features/panels/PanelHeader';
import { ItinerarioPanel } from './features/panels/ItinerarioPanel';
import { BarriosPanel } from './features/panels/BarriosPanel';
import { CallesPanel } from './features/panels/CallesPanel';
import { SubwayPanel } from './features/panels/SubwayPanel';
import { RecenterIcon } from './components/icons';

function PanelContent() {
  const mode = useTripStore((s) => s.mode);
  return (
    <div className="panel-scroll">
      {mode === 'itinerario' && <ItinerarioPanel />}
      {mode === 'barrios' && <BarriosPanel />}
      {mode === 'calles' && <CallesPanel />}
      {mode === 'subway' && <SubwayPanel />}
      <div className="map-attribution">Mapa © OpenStreetMap · CARTO</div>
    </div>
  );
}

export default function App() {
  const isDesktop = useIsDesktop();
  const recenter = useTripStore((s) => s.recenter);

  return (
    <div className="app">
      <MapView isDesktop={isDesktop} />

      <button className="fab-recenter" title="Centrar" aria-label="Centrar el mapa" onClick={recenter}>
        <RecenterIcon />
      </button>

      {isDesktop ? (
        <aside className="sidebar">
          <PanelHeader />
          <PanelContent />
        </aside>
      ) : (
        <BottomSheet>
          <PanelHeader dragZone />
          <PanelContent />
        </BottomSheet>
      )}
    </div>
  );
}
