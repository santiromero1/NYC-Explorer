// Formulario de crear/editar lugar (pin) — ITINERARY.md §3
import { useState } from 'react';
import { MapPinIcon } from '../../components/icons';

interface Props {
  mode: 'create' | 'edit';
  initialName?: string;
  initialNote?: string;
  dayColor: string;
  dayName: string;
  /** Si está, muestra "✓ Ubicación marcada" + botón Reubicar. */
  hasLocation: boolean;
  /** Recibe el borrador actual para preservarlo al volver al modo colocar. */
  onRelocate?: (draft: { name: string; note: string }) => void;
  onSubmit: (data: { name: string; note: string }) => void;
  onCancel: () => void;
}

export function PinForm({
  mode,
  initialName = '',
  initialNote = '',
  dayColor,
  dayName,
  hasLocation,
  onRelocate,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialName);
  const [note, setNote] = useState(initialNote);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    if (!name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    onSubmit({ name, note });
  };

  return (
    <div>
      <h2 className="text-h2" style={{ marginBottom: 4 }}>
        {mode === 'create' ? 'Nuevo lugar' : 'Editar lugar'}
      </h2>
      <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>
        <span className="chip-dot" style={{ background: dayColor, display: 'inline-block', width: 8, height: 8, borderRadius: 99, marginRight: 6 }} />
        {dayName}
      </p>

      <div className={`field ${error ? 'has-error' : ''}`}>
        <label htmlFor="pin-name">Nombre *</label>
        <input
          id="pin-name"
          type="text"
          value={name}
          maxLength={80}
          placeholder="Katz's Deli"
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          autoFocus
        />
        {error && <span className="field-error">{error}</span>}
      </div>

      <div className="field">
        <label htmlFor="pin-note">Nota</label>
        <textarea
          id="pin-note"
          value={note}
          maxLength={300}
          placeholder="Llegar temprano, hay cola…"
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {hasLocation && (
        <div
          className="text-body-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: 'var(--color-success)',
            marginBottom: 8,
          }}
        >
          <MapPinIcon style={{ width: 16, height: 16 }} />
          <span>Ubicación marcada en el mapa</span>
          {onRelocate && (
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginLeft: 'auto', color: 'var(--color-accent)' }}
              onClick={() => onRelocate({ name, note })}
            >
              Reubicar
            </button>
          )}
        </div>
      )}

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={submit}>
          Guardar lugar
        </button>
      </div>
    </div>
  );
}
