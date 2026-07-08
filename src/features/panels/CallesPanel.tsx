// Modo Calles: explicación del grid de Manhattan.
export function CallesPanel() {
  return (
    <div className="panel-section">
      <h2 className="section-title">Cómo funciona el grid</h2>
      <p className="calles-intro">
        Manhattan es una cuadrícula. Las <b className="av">avenidas</b> (líneas gruesas azules) van norte–sur; las{' '}
        <b className="st">calles</b> (finas naranjas) van este–oeste y están numeradas: suben hacia el norte (uptown) y
        bajan hacia el sur (downtown).
      </p>
      <div className="calles-legend">
        <div className="calles-legend-row">
          <span className="legend-av" />
          <span>Avenidas (N–S): 1ª a 12ª, más Park, Madison, Lexington y Broadway (diagonal).</span>
        </div>
        <div className="calles-legend-row">
          <span className="legend-st" />
          <span>Calles (E–O): numeradas. La 5th Ave divide Este y Oeste (ej. E 42 vs W 42).</span>
        </div>
      </div>
      <div className="tip-box">
        Tip: 20 cuadras (calles) ≈ 1 milla ≈ 1,6 km. La cuadra entre avenidas es bastante más larga que entre calles.
      </div>
    </div>
  );
}
