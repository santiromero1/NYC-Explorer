// Formulario de crear/editar día — ITINERARY.md §2
import { useState } from 'react';
import type { Day, NeighborhoodId } from '../../types';
import type { DayInput } from '../../store/useItineraryStore';
import { NEIGHBORHOODS } from '../../data/neighborhoods';

interface Props {
  mode: 'create' | 'edit';
  initialDay?: Day;
  onSubmit: (data: DayInput) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

export function DayForm({ mode, initialDay, onSubmit, onDelete, onCancel }: Props) {
  const [name, setName] = useState(initialDay?.name ?? '');
  const [date, setDate] = useState(initialDay?.date ?? '');
  const [neighborhoodId, setNeighborhoodId] = useState<NeighborhoodId | undefined>(
    initialDay?.neighborhoodId,
  );
  const [description, setDescription] = useState(initialDay?.description ?? '');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    onSubmit({ name, date: date || undefined, neighborhoodId, description });
  };

  return (
    <div>
      <h2 className="text-h2" style={{ marginBottom: 16 }}>
        {mode === 'create' ? 'Nuevo día' : 'Editar día'}
      </h2>

      <div className={`field ${error ? 'has-error' : ''}`}>
        <label htmlFor="day-name">Nombre *</label>
        <input
          id="day-name"
          type="text"
          value={name}
          maxLength={60}
          placeholder="Día 1 - Downtown"
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          autoFocus={mode === 'create'}
        />
        {error && <span className="field-error">{error}</span>}
      </div>

      <div className="field">
        <label htmlFor="day-date">Fecha</label>
        <input id="day-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="field">
        <label>Zona principal</label>
        <div className="chip-row">
          {NEIGHBORHOODS.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`chip ${neighborhoodId === n.id ? 'selected' : ''}`}
              style={neighborhoodId === n.id ? { color: n.color } : undefined}
              onClick={() => setNeighborhoodId(neighborhoodId === n.id ? undefined : n.id)}
            >
              <span className="chip-dot" style={{ background: n.color }} />
              {n.name}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="day-desc">Descripción</label>
        <textarea
          id="day-desc"
          value={description}
          maxLength={500}
          placeholder="Qué planeamos hacer este día…"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {mode === 'edit' && onDelete && (
        <button className="btn btn-danger" style={{ width: '100%' }} onClick={onDelete}>
          Eliminar día
        </button>
      )}

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={submit}>
          Guardar
        </button>
      </div>
    </div>
  );
}
