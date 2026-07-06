// Shell de la app — layout mobile (mapa + sheets + bottom nav) y desktop (sidebar + mapa)
// UX_FLOWS §0, Design Spec §6, COMPONENT_SPEC §2
import { useEffect } from 'react';
import { AppSection } from './types';
import { useAppStore } from './store/useAppStore';
import { useItineraryStore, findPin, storageAvailable } from './store/useItineraryStore';
import { useItineraryUi } from './features/itinerary/useItineraryUi';
import { useIsDesktop } from './hooks/useMediaQuery';
import { MapContainer } from './features/map/MapContainer';
import { NeighborhoodPanel } from './features/neighborhoods/NeighborhoodPanel';
import { GridPanel } from './features/grid/GridPanel';
import { ItineraryPanel } from './features/itinerary/ItineraryPanel';
import { Sheet } from './components/Sheet';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ToastHost, toast } from './components/Toast';
import { NEIGHBORHOOD_BY_ID } from './data/neighborhoods';
import {
  GridIcon,
  ListIcon,
  MapIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from './components/icons';

const SECTIONS: { id: AppSection; label: string; Icon: typeof MapIcon }[] = [
  { id: AppSection.Neighborhoods, label: 'Barrios', Icon: MapIcon },
  { id: AppSection.Grid, label: 'Grid', Icon: GridIcon },
  { id: AppSection.Itinerary, label: 'Itinerario', Icon: ListIcon },
];

export default function App() {
  const isDesktop = useIsDesktop();
  const activeSection = useAppStore((s) => s.activeSection);
  const setSection = useAppStore((s) => s.setSection);
  const selectedNeighborhoodId = useAppStore((s) => s.selectedNeighborhoodId);
  const selectNeighborhood = useAppStore((s) => s.selectNeighborhood);
  const placing = useAppStore((s) => s.placing);
  const provisional = useAppStore((s) => s.provisional);
  const cancelPlacing = useAppStore((s) => s.cancelPlacing);
  const hasSeenIntroHint = useAppStore((s) => s.hasSeenIntroHint);
  const markIntroHintSeen = useAppStore((s) => s.markIntroHintSeen);

  // Hint de primer uso (UX_FLOWS §1) + aviso de storage + itinerario de ejemplo
  useEffect(() => {
    useItineraryStore.getState().applySeed();
    if (!storageAvailable) {
      toast('Tus cambios no se van a guardar en este dispositivo', 'warning', 6000);
    }
    if (!hasSeenIntroHint) {
      toast('Tocá una zona del mapa para explorarla', 'default', 3500);
      markIntroHintSeen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedHood = selectedNeighborhoodId
    ? NEIGHBORHOOD_BY_ID.get(selectedNeighborhoodId)
    : undefined;

  const sectionContent = (() => {
    switch (activeSection) {
      case AppSection.Neighborhoods:
        return selectedHood ? (
          <NeighborhoodPanel neighborhood={selectedHood} onClose={() => selectNeighborhood(null)} />
        ) : isDesktop ? (
          <div className="empty-state">
            <div className="icon" aria-hidden>
              🏙️
            </div>
            <h2 className="text-h2">Explorá los barrios</h2>
            <p className="text-body">
              Tocá una zona del mapa para conocer su personalidad, sus spots y un tip práctico.
            </p>
          </div>
        ) : null;
      case AppSection.Grid:
        return <GridPanel />;
      case AppSection.Itinerary:
        return <ItineraryPanel />;
    }
  })();

  // En mobile, el sheet del itinerario se oculta durante el modo "tocá el mapa"
  const hidePanelForPlacing = placing !== null && provisional === null;

  return (
    <div className="app">
      {isDesktop && (
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="brand-dot" />
            <span className="brand-name">NYC Explorer</span>
          </div>
          <nav className="sidebar-tabs" aria-label="Secciones">
            {SECTIONS.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`side-tab ${activeSection === id ? 'active' : ''}`}
                onClick={() => setSection(id)}
              >
                <Icon />
                {label}
              </button>
            ))}
          </nav>
          <div className="sidebar-content desktop-panel">{sectionContent}</div>
        </aside>
      )}

      <div className="app-main">
        <MapContainer />

        {/* Banner del modo colocar pin (UX_FLOWS §9) */}
        {hidePanelForPlacing && (
          <div className="place-banner">
            <MapPinIcon style={{ width: 18, height: 18, color: 'var(--color-accent)' }} />
            <span>Tocá el mapa para marcar el lugar</span>
            <button className="btn btn-icon" style={{ width: 36, height: 36, minHeight: 36 }} aria-label="Cancelar" onClick={cancelPlacing}>
              <XIcon />
            </button>
          </div>
        )}

        {/* FAB agregar día (mobile, sección itinerario) */}
        {!isDesktop && activeSection === AppSection.Itinerary && !placing && (
          <FabAddDay />
        )}

        <PinPopoverHost />

        {/* Sheets mobile por sección */}
        {!isDesktop && activeSection === AppSection.Neighborhoods && (
          <Sheet
            open={!!selectedHood}
            onClose={() => selectNeighborhood(null)}
            initialSnap="half"
          >
            {sectionContent}
          </Sheet>
        )}
        {!isDesktop && activeSection === AppSection.Grid && (
          <Sheet open initialSnap="peek">
            {sectionContent}
          </Sheet>
        )}
        {!isDesktop && activeSection === AppSection.Itinerary && (
          <Sheet open={!hidePanelForPlacing} initialSnap="half">
            {sectionContent}
          </Sheet>
        )}
      </div>

      {!isDesktop && (
        <nav className="bottom-nav" aria-label="Secciones">
          {SECTIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={activeSection === id ? 'active' : ''}
              aria-current={activeSection === id}
              onClick={() => setSection(id)}
            >
              <Icon />
              <span className="text-caption">{label}</span>
            </button>
          ))}
        </nav>
      )}

      <ConfirmHost />
      <ToastHost />
    </div>
  );
}

/** FAB "+ día" — abre el formulario de crear día. */
function FabAddDay() {
  const setView = useItineraryUi((s) => s.setView);
  return (
    <button className="fab" aria-label="Agregar día" onClick={() => setView({ type: 'dayForm' })}>
      <PlusIcon />
    </button>
  );
}

/** Popover de detalle de pin (UX_FLOWS §10). */
function PinPopoverHost() {
  const selectedPinId = useAppStore((s) => s.selectedPinId);
  const selectPin = useAppStore((s) => s.selectPin);
  const days = useItineraryStore((s) => s.days);
  const setView = useItineraryUi((s) => s.setView);
  const setConfirm = useItineraryUi((s) => s.setConfirm);

  if (!selectedPinId) return null;
  const found = findPin(days, selectedPinId);
  if (!found) return null;
  const { pin, day } = found;

  return (
    <div className="pin-popover" role="dialog" aria-label={`Detalle de ${pin.name}`}>
      <div className="pin-popover-header">
        <span className="pin-dot" style={{ background: day.color, width: 10, height: 10 }} />
        <h3 className="text-h3">{pin.name}</h3>
        <button
          className="btn btn-icon"
          style={{ marginLeft: 'auto', width: 32, height: 32, minHeight: 32 }}
          aria-label="Cerrar"
          onClick={() => selectPin(null)}
        >
          <XIcon />
        </button>
      </div>
      <div className="pin-popover-day">{day.name}</div>
      {pin.note && <p className="pin-popover-note">{pin.note}</p>}
      <div className="pin-popover-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            selectPin(null);
            setView({ type: 'pinEdit', pinId: pin.id });
          }}
        >
          <PencilIcon style={{ width: 14, height: 14 }} />
          Editar
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            selectPin(null);
            setConfirm({ kind: 'pin', id: pin.id });
          }}
        >
          <TrashIcon style={{ width: 14, height: 14 }} />
          Eliminar
        </button>
      </div>
    </div>
  );
}

/** Diálogos de confirmación de borrado (UX_FLOWS §8, §14). */
function ConfirmHost() {
  const confirm = useItineraryUi((s) => s.confirm);
  const setConfirm = useItineraryUi((s) => s.setConfirm);
  const setView = useItineraryUi((s) => s.setView);
  const days = useItineraryStore((s) => s.days);
  const deleteDay = useItineraryStore((s) => s.deleteDay);
  const deletePin = useItineraryStore((s) => s.deletePin);
  const setFocusedDay = useAppStore((s) => s.setFocusedDay);
  const focusedDayId = useAppStore((s) => s.focusedDayId);

  if (!confirm) return null;

  if (confirm.kind === 'day') {
    const day = days.find((d) => d.id === confirm.id);
    if (!day) return null;
    const n = day.pins.length;
    return (
      <ConfirmDialog
        open
        title={`¿Eliminar "${day.name}"?`}
        message={
          n > 0
            ? `Se ${n === 1 ? 'borrará también su lugar' : `borrarán también sus ${n} lugares`}. No se puede deshacer.`
            : 'No se puede deshacer.'
        }
        confirmLabel="Eliminar"
        onConfirm={() => {
          deleteDay(day.id);
          if (focusedDayId === day.id) setFocusedDay(null);
          setConfirm(null);
          setView({ type: 'list' });
          toast('Día eliminado');
        }}
        onCancel={() => setConfirm(null)}
      />
    );
  }

  const found = findPin(days, confirm.id);
  if (!found) return null;
  return (
    <ConfirmDialog
      open
      title={`¿Eliminar "${found.pin.name}"?`}
      message="Se quitará del mapa y del día. No se puede deshacer."
      confirmLabel="Eliminar"
      onConfirm={() => {
        deletePin(found.pin.id);
        setConfirm(null);
        toast('Lugar eliminado');
      }}
      onCancel={() => setConfirm(null)}
    />
  );
}
