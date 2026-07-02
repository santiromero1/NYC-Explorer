// Tarjeta de un día en la lista del itinerario — ITINERARY.md §1
import type { Day } from '../../types';
import { NEIGHBORHOOD_BY_ID } from '../../data/neighborhoods';
import { formatDate, pinCountLabel } from '../../lib/utils';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '../../components/icons';

interface Props {
  day: Day;
  isFocused: boolean;
  isFirst: boolean;
  isLast: boolean;
  onFocus: () => void;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddPin: () => void;
  onEditPin: (pinId: string) => void;
  onDeletePin: (pinId: string) => void;
}

export function DayCard({
  day,
  isFocused,
  isFirst,
  isLast,
  onFocus,
  onEdit,
  onMoveUp,
  onMoveDown,
  onAddPin,
  onEditPin,
  onDeletePin,
}: Props) {
  const zone = day.neighborhoodId ? NEIGHBORHOOD_BY_ID.get(day.neighborhoodId) : undefined;
  const date = formatDate(day.date);

  return (
    <div className={`day-card ${isFocused ? 'focused' : ''}`}>
      <div
        className="day-card-header"
        onClick={onFocus}
        role="button"
        aria-pressed={isFocused}
        aria-label={`${day.name}${isFocused ? ' (enfocado en el mapa)' : ''}`}
      >
        <span className="day-color" style={{ background: day.color }} />
        <div className="day-title-wrap">
          <div className="day-name">{day.name}</div>
          <div className="day-meta">
            {date && <span>{date}</span>}
            {zone && <span style={{ color: zone.color }}>{zone.name}</span>}
            <span>{pinCountLabel(day)}</span>
          </div>
        </div>
        <div className="day-actions" onClick={(e) => e.stopPropagation()}>
          <button className="btn btn-icon" aria-label="Subir día" onClick={onMoveUp} disabled={isFirst}>
            <ChevronUpIcon />
          </button>
          <button className="btn btn-icon" aria-label="Bajar día" onClick={onMoveDown} disabled={isLast}>
            <ChevronDownIcon />
          </button>
          <button className="btn btn-icon" aria-label={`Editar ${day.name}`} onClick={onEdit}>
            <PencilIcon />
          </button>
        </div>
      </div>

      <div className="day-body">
        {day.description && <p className="day-desc">{day.description}</p>}
        {day.pins.map((pin, i) => (
          <div className="pin-item" key={pin.id}>
            <span className="pin-num" style={{ background: day.color }}>
              {i + 1}
            </span>
            <div className="pin-item-name">
              {pin.name}
              {pin.note && <span className="pin-item-note">{pin.note}</span>}
            </div>
            <button
              className="btn btn-icon"
              style={{ width: 32, height: 32, minHeight: 32 }}
              aria-label={`Editar ${pin.name}`}
              onClick={() => onEditPin(pin.id)}
            >
              <PencilIcon style={{ width: 15, height: 15 }} />
            </button>
            <button
              className="btn btn-icon"
              style={{ width: 32, height: 32, minHeight: 32 }}
              aria-label={`Eliminar ${pin.name}`}
              onClick={() => onDeletePin(pin.id)}
            >
              <TrashIcon style={{ width: 15, height: 15 }} />
            </button>
          </div>
        ))}
        <button className="add-place-btn" onClick={onAddPin}>
          <PlusIcon />
          Agregar lugar
        </button>
      </div>
    </div>
  );
}
