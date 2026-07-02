// Contenido del panel del itinerario: lista de días, empty state y formularios
// (ITINERARY.md §1-5). El contenedor (Sheet mobile / sidebar desktop) lo decide App.
import { AppSection } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useItineraryStore, findPin } from '../../store/useItineraryStore';
import { useItineraryUi } from './useItineraryUi';
import { DayForm } from './DayForm';
import { PinForm } from './PinForm';
import { DayCard } from './DayCard';
import { PlusIcon } from '../../components/icons';
import { toast } from '../../components/Toast';

export function ItineraryPanel() {
  const days = useItineraryStore((s) => s.days);
  const addDay = useItineraryStore((s) => s.addDay);
  const updateDay = useItineraryStore((s) => s.updateDay);
  const moveDay = useItineraryStore((s) => s.moveDay);
  const addPin = useItineraryStore((s) => s.addPin);
  const updatePin = useItineraryStore((s) => s.updatePin);

  const focusedDayId = useAppStore((s) => s.focusedDayId);
  const setFocusedDay = useAppStore((s) => s.setFocusedDay);
  const placing = useAppStore((s) => s.placing);
  const provisional = useAppStore((s) => s.provisional);
  const startPlacing = useAppStore((s) => s.startPlacing);
  const cancelPlacing = useAppStore((s) => s.cancelPlacing);
  const setProvisional = useAppStore((s) => s.setProvisional);
  const setPlacingDraft = useAppStore((s) => s.setPlacingDraft);
  const setSection = useAppStore((s) => s.setSection);

  const view = useItineraryUi((s) => s.view);
  const setView = useItineraryUi((s) => s.setView);
  const setConfirm = useItineraryUi((s) => s.setConfirm);

  // --- Formulario de pin durante el modo colocar (con ubicación ya marcada) ---
  if (placing && provisional) {
    const day = days.find((d) => d.id === placing.dayId);
    if (!day) return null;
    return (
      <PinForm
        mode={placing.editingPinId ? 'edit' : 'create'}
        initialName={placing.draft.name}
        initialNote={placing.draft.note}
        dayColor={day.color}
        dayName={day.name}
        hasLocation
        onRelocate={(draft) => {
          // vuelve al modo tap preservando lo escrito (ITINERARY §3.4)
          setPlacingDraft(draft);
          setProvisional(null);
        }}
        onSubmit={({ name, note }) => {
          if (placing.editingPinId) {
            updatePin(placing.editingPinId, {
              name,
              note,
              svg: provisional.svg,
              geo: provisional.geo,
            });
            toast('Lugar actualizado');
          } else {
            addPin(placing.dayId, { name, note, svg: provisional.svg, geo: provisional.geo });
            toast('Lugar agregado');
          }
          cancelPlacing();
          setView({ type: 'list' });
        }}
        onCancel={() => {
          cancelPlacing();
          setView({ type: 'list' });
        }}
      />
    );
  }

  // --- Formulario de día ---
  if (view.type === 'dayForm') {
    const editing = view.dayId ? days.find((d) => d.id === view.dayId) : undefined;
    return (
      <DayForm
        mode={editing ? 'edit' : 'create'}
        initialDay={editing}
        onSubmit={(data) => {
          if (editing) {
            updateDay(editing.id, data);
            toast('Día actualizado');
          } else {
            addDay(data);
            toast('Día creado');
          }
          setView({ type: 'list' });
        }}
        onDelete={editing ? () => setConfirm({ kind: 'day', id: editing.id }) : undefined}
        onCancel={() => setView({ type: 'list' })}
      />
    );
  }

  // --- Edición de un pin existente (nombre/nota, con opción de reubicar) ---
  if (view.type === 'pinEdit') {
    const found = findPin(days, view.pinId);
    if (!found) {
      setView({ type: 'list' });
      return null;
    }
    const { pin, day } = found;
    return (
      <PinForm
        mode="edit"
        initialName={pin.name}
        initialNote={pin.note ?? ''}
        dayColor={day.color}
        dayName={day.name}
        hasLocation
        onRelocate={(draft) => {
          startPlacing({ dayId: day.id, editingPinId: pin.id, draft });
          setView({ type: 'list' });
        }}
        onSubmit={({ name, note }) => {
          updatePin(pin.id, { name, note });
          toast('Lugar actualizado');
          setView({ type: 'list' });
        }}
        onCancel={() => setView({ type: 'list' })}
      />
    );
  }

  // --- Empty state (UX_FLOWS §6) ---
  if (days.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon" aria-hidden>
          🗽
        </div>
        <h2 className="text-h2">Todavía no tenés días</h2>
        <p className="text-body">Armá tu primer día para empezar a planear tu viaje.</p>
        <button className="btn btn-primary" onClick={() => setView({ type: 'dayForm' })}>
          <PlusIcon style={{ width: 18, height: 18 }} />
          Agregar día
        </button>
      </div>
    );
  }

  // --- Lista de días ---
  return (
    <div>
      <div className="sheet-title-row">
        <h1 className="text-h1">Itinerario</h1>
        <button
          className="btn btn-primary btn-sm"
          style={{ minHeight: 40 }}
          onClick={() => setView({ type: 'dayForm' })}
        >
          <PlusIcon style={{ width: 16, height: 16 }} />
          Día
        </button>
      </div>
      {focusedDayId && (
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 12, color: 'var(--color-accent)' }}
          onClick={() => setFocusedDay(null)}
        >
          Mostrando solo un día — ver todos
        </button>
      )}
      {days.map((day, i) => (
        <DayCard
          key={day.id}
          day={day}
          isFocused={focusedDayId === day.id}
          isFirst={i === 0}
          isLast={i === days.length - 1}
          onFocus={() => setFocusedDay(focusedDayId === day.id ? null : day.id)}
          onEdit={() => setView({ type: 'dayForm', dayId: day.id })}
          onMoveUp={() => moveDay(day.id, -1)}
          onMoveDown={() => moveDay(day.id, 1)}
          onAddPin={() => {
            startPlacing({ dayId: day.id, draft: { name: '', note: '' } });
            setSection(AppSection.Itinerary);
          }}
          onEditPin={(pinId) => setView({ type: 'pinEdit', pinId })}
          onDeletePin={(pinId) => setConfirm({ kind: 'pin', id: pinId })}
        />
      ))}
    </div>
  );
}
