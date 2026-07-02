// Panel educativo del Grid — GRID.md §4-5
import { GRID_CONCEPTS } from '../../data/grid';

export function GridPanel() {
  return (
    <div>
      <h1 className="text-h1" style={{ marginBottom: 4 }}>
        Cómo funciona la grilla
      </h1>
      <p className="text-body-sm" style={{ color: 'var(--color-text-secondary)', marginBottom: 8 }}>
        Después de leer esto vas a poder entender cualquier dirección de Nueva York.
      </p>
      {GRID_CONCEPTS.map((c, i) => (
        <div className="concept" key={c.title}>
          <h3 className="text-h3">
            <span className="num">{i + 1}</span>
            {c.title}
          </h3>
          <p>{c.body}</p>
          {c.example && <span className="example">{c.example}</span>}
        </div>
      ))}
    </div>
  );
}
