// Itinerario real del viaje (16–24 jul 2026) — fuente: prototipo de Claude Design + ITINERARIO.md
export interface Place {
  id: string;
  name: string;
  type: string;
  time: string;
  lat: number;
  lng: number;
  note: string;
  transit: string;
}

export interface Day {
  n: number;
  dateLabel: string;
  title: string;
  color: string;
  places: Place[];
}

/** Place enriquecido con la info de su día (para mapa, búsqueda y detalle). */
export interface Stop extends Place {
  day: number;
  color: string;
  dateLabel: string;
  dayTitle: string;
  stop: number;
}

export const DAYS: Day[] = [
  { n: 1, dateLabel: 'Jue 16 Jul', title: 'Llegada + Midtown', color: '#FF9500', places: [
    { id: 'd1s1', name: 'Columbus Circle', type: 'Punto de interés', time: '12:00', lat: 40.7681, lng: -73.9819, note: 'La esquina del hotel y la entrada suroeste a Central Park.', transit: 'Salís del hotel, 2 cuadras caminando.' },
    { id: 'd1s2', name: 'The Plaza Hotel', type: 'Punto de interés', time: '12:30', lat: 40.7645, lng: -73.9744, note: 'Hotel icónico frente a Central Park.', transit: 'Caminando por 5th Ave, 6 min.' },
    { id: 'd1s3', name: 'Rockefeller Center', type: 'Punto de interés', time: '13:30', lat: 40.7587, lng: -73.9787, note: 'Plaza, tiendas y el edificio GE.', transit: 'Bajando por 5th Ave, 12 min.' },
    { id: 'd1s4', name: 'Magnolia Bakery', type: 'Comida', time: '15:00', lat: 40.7607, lng: -73.9787, note: 'Merienda: probá el banana pudding.', transit: 'Dentro de Rockefeller Center.' },
    { id: 'd1s5', name: 'Times Square', type: 'Punto de interés', time: '20:00', lat: 40.758, lng: -73.9855, note: 'De noche las luces son el show.', transit: 'Caminando 8 min por Broadway.' },
    { id: 'd1s6', name: 'Whole Foods (Columbus Circle)', type: 'Compras', time: '21:30', lat: 40.7683, lng: -73.9829, note: 'Súper para abastecerse antes de volver.', transit: 'Vuelta al hotel, 2 cuadras.' },
  ] },
  { n: 2, dateLabel: 'Vie 17 Jul', title: 'Estatua de la Libertad + Downtown', color: '#FF3B30', places: [
    { id: 'd2s1', name: 'Staten Island Ferry', type: 'Transporte', time: '09:00', lat: 40.7013, lng: -74.0132, note: 'Gratis; la Estatua de la Libertad se ve desde el barco.', transit: 'Subte 1 hasta South Ferry o R/W hasta Whitehall.' },
    { id: 'd2s2', name: 'Battery Park', type: 'Parque', time: '10:00', lat: 40.7033, lng: -74.017, note: 'Vistas a la bahía al bajar del ferry.', transit: 'Caminando desde la terminal.' },
    { id: 'd2s3', name: 'Charging Bull & Fearless Girl', type: 'Punto de interés', time: '10:30', lat: 40.7056, lng: -74.0134, note: 'Las estatuas del distrito financiero.', transit: 'Caminando 5 min.' },
    { id: 'd2s4', name: 'Wall Street & NYSE', type: 'Punto de interés', time: '11:00', lat: 40.7069, lng: -74.009, note: 'La Bolsa de Nueva York y Trinity Church cerca.', transit: 'Caminando por Broadway.' },
    { id: 'd2s5', name: '9/11 Memorial', type: 'Punto de interés', time: '12:30', lat: 40.7115, lng: -74.0134, note: 'Las fuentes y el Survival Tree.', transit: 'Caminando 8 min al norte.' },
    { id: 'd2s6', name: 'Oculus', type: 'Compras', time: '13:30', lat: 40.7118, lng: -74.011, note: 'La estación-shopping de Calatrava.', transit: 'Al lado del memorial.' },
    { id: 'd2s7', name: 'One World Observatory', type: 'Mirador', time: '14:30', lat: 40.7133, lng: -74.0134, note: 'Mirador del edificio más alto del hemisferio. Reservá online.', transit: 'Caminando, entrada por el WTC.' },
    { id: 'd2s8', name: 'South Street Seaport', type: 'Punto de interés', time: '17:00', lat: 40.7061, lng: -74.0029, note: 'Muelle histórico y atardecer sobre el East River.', transit: 'Caminando hacia el este, 12 min.' },
  ] },
  { n: 3, dateLabel: 'Sáb 18 Jul', title: 'Central Park + The Met + Harlem', color: '#34C759', places: [
    { id: 'd3s1', name: 'Central Park — The Mall & Bethesda', type: 'Parque', time: '10:00', lat: 40.7718, lng: -73.9718, note: 'El corazón del parque: la alameda y la terraza.', transit: 'Subte B/C hasta 72 St.' },
    { id: 'd3s2', name: 'Bow Bridge', type: 'Punto de interés', time: '11:00', lat: 40.7757, lng: -73.9718, note: 'El puente más fotografiado del parque.', transit: 'Caminando dentro del parque.' },
    { id: 'd3s3', name: 'Barney Greengrass', type: 'Comida', time: '13:00', lat: 40.7876, lng: -73.9772, note: 'Clásico del Upper West Side (o Le Pain Quotidien).', transit: 'Caminando al UWS.' },
    { id: 'd3s4', name: 'The Met', type: 'Museo', time: '15:00', lat: 40.7794, lng: -73.9632, note: 'Metropolitan Museum of Art.', transit: 'Cruzando el parque hacia el UES.' },
    { id: 'd3s5', name: 'Harlem — Misa Gospel', type: 'Punto de interés', time: '18:00', lat: 40.802, lng: -73.949, note: 'Reservá horario con anticipación.', transit: 'Subte 2/3 hasta 116 St.' },
    { id: 'd3s6', name: 'Marcus Garvey Park', type: 'Parque', time: '19:30', lat: 40.8046, lng: -73.9443, note: 'Las casas históricas de Mt Morris.', transit: 'Caminando por Malcolm X Blvd.' },
  ] },
  { n: 4, dateLabel: 'Dom 19 Jul', title: 'Final del Mundial 2026', color: '#007AFF', places: [
    { id: 'd4s1', name: 'Penn Station', type: 'Transporte', time: '13:00', lat: 40.7506, lng: -73.9935, note: 'NJ Transit al estadio (~40 min). Sacá tickets con anticipación y salí con MUCHO tiempo.', transit: 'Subte 1/2/3 o A/C/E hasta 34 St.' },
    { id: 'd4s2', name: 'MetLife Stadium', type: 'Punto de interés', time: '16:00', lat: 40.8135, lng: -74.0745, note: 'La Final del Mundial 2026. Sin entradas: FIFA Fan Fest o un bar con pantalla.', transit: 'NJ Transit desde Penn Station.' },
    { id: 'd4s3', name: 'Times Square (festejo)', type: 'Punto de interés', time: '23:00', lat: 40.758, lng: -73.9855, note: 'Si gana Argentina, el punto de encuentro del festejo.', transit: 'NJ Transit de vuelta + subte.' },
  ] },
  { n: 5, dateLabel: 'Lun 20 Jul', title: 'Midtown East + SUMMIT', color: '#AF52DE', places: [
    { id: 'd5s1', name: 'Grand Central Terminal', type: 'Punto de interés', time: '10:00', lat: 40.7527, lng: -73.9772, note: 'El hall principal es imperdible.', transit: 'Subte 4/5/6/7 o S.' },
    { id: 'd5s2', name: 'Chrysler Building', type: 'Punto de interés', time: '10:40', lat: 40.7516, lng: -73.9755, note: 'Art déco, mejor visto desde afuera.', transit: 'Caminando, 3 min.' },
    { id: 'd5s3', name: 'NYPL & Bryant Park', type: 'Punto de interés', time: '11:15', lat: 40.7534, lng: -73.9827, note: 'La biblioteca pública y el parque detrás.', transit: 'Caminando por 42 St.' },
    { id: 'd5s4', name: 'Empire State Building', type: 'Punto de interés', time: '12:00', lat: 40.7484, lng: -73.9857, note: 'Foto desde afuera (subimos al SUMMIT).', transit: 'Caminando por 5th Ave.' },
    { id: 'd5s5', name: 'SUMMIT One Vanderbilt', type: 'Mirador', time: '14:00', lat: 40.7527, lng: -73.9787, note: 'Reservado. El mirador de espejos.', transit: 'Al lado de Grand Central.' },
    { id: 'd5s6', name: "St. Patrick's Cathedral", type: 'Punto de interés', time: '16:00', lat: 40.7585, lng: -73.976, note: 'Catedral neogótica sobre 5th Ave.', transit: 'Caminando por 5th Ave.' },
    { id: 'd5s7', name: 'Nintendo NY', type: 'Compras', time: '16:45', lat: 40.7593, lng: -73.9787, note: 'La tienda en Rockefeller Plaza.', transit: 'Caminando, 5 min.' },
    { id: 'd5s8', name: 'Broadway — Show', type: 'Show', time: '20:00', lat: 40.759, lng: -73.9845, note: 'Show a definir en el Theater District.', transit: 'Caminando a Times Square.' },
  ] },
  { n: 6, dateLabel: 'Mar 21 Jul', title: 'Brooklyn', color: '#FF2D55', places: [
    { id: 'd6s1', name: 'Brooklyn Bridge', type: 'Punto de interés', time: '10:00', lat: 40.7061, lng: -73.9969, note: 'Cruzalo caminando de Manhattan a Brooklyn.', transit: 'Subte 4/5/6 hasta Brooklyn Bridge–City Hall.' },
    { id: 'd6s2', name: 'DUMBO — Washington St', type: 'Punto de interés', time: '11:00', lat: 40.7038, lng: -73.9899, note: 'La foto clásica del puente de Manhattan.', transit: 'Caminando al bajar el puente.' },
    { id: 'd6s3', name: 'Time Out Market', type: 'Comida', time: '13:00', lat: 40.7022, lng: -73.9903, note: 'Almuerzo con vista en Empire Stores.', transit: 'Caminando, en DUMBO.' },
    { id: 'd6s4', name: 'Brooklyn Bridge Park', type: 'Parque', time: '14:30', lat: 40.7003, lng: -73.9967, note: 'Muelles y skyline de Manhattan.', transit: 'Caminando por la ribera.' },
    { id: 'd6s5', name: 'Domino Park (Williamsburg)', type: 'Parque', time: '16:30', lat: 40.7143, lng: -73.9679, note: 'Ribera renovada y buena onda.', transit: 'Ferry o subte L hasta Bedford Av.' },
    { id: 'd6s6', name: 'Brooklyn Heights Promenade', type: 'Mirador', time: '18:00', lat: 40.6968, lng: -73.9977, note: 'Atardecer sobre Manhattan.', transit: 'Caminando por Brooklyn Heights.' },
  ] },
  { n: 7, dateLabel: 'Mié 22 Jul', title: 'High Line + Chelsea + SoHo', color: '#00C7BE', places: [
    { id: 'd7s1', name: 'The Edge (Hudson Yards)', type: 'Mirador', time: '10:00', lat: 40.7539, lng: -74.0011, note: 'Mirador con piso de vidrio.', transit: 'Subte 7 hasta 34 St–Hudson Yards.' },
    { id: 'd7s2', name: 'Vessel', type: 'Punto de interés', time: '10:40', lat: 40.7538, lng: -74.0021, note: 'La escultura panal.', transit: 'Al lado del Edge.' },
    { id: 'd7s3', name: 'High Line', type: 'Parque', time: '11:15', lat: 40.748, lng: -74.0048, note: 'Parque elevado; caminala hacia el sur.', transit: 'Entrada en 34 St.' },
    { id: 'd7s4', name: 'Chelsea Market', type: 'Comida', time: '12:30', lat: 40.7424, lng: -74.0061, note: 'Mercado gastronómico cubierto.', transit: 'Bajando por la High Line.' },
    { id: 'd7s5', name: 'Little Island', type: 'Parque', time: '13:30', lat: 40.742, lng: -74.0106, note: 'El parque flotante sobre el Hudson.', transit: 'Caminando, 5 min.' },
    { id: 'd7s6', name: 'SoHo', type: 'Compras', time: '15:00', lat: 40.7233, lng: -74.003, note: 'Compras y arquitectura de hierro fundido.', transit: 'Subte C/E hasta Spring St.' },
    { id: 'd7s7', name: 'Little Italy & Chinatown', type: 'Punto de interés', time: '17:00', lat: 40.7191, lng: -73.9973, note: 'Dos barrios llenos de vida, uno al lado del otro.', transit: 'Caminando hacia el sur.' },
    { id: 'd7s8', name: "Joe's Pizza", type: 'Comida', time: '19:30', lat: 40.7305, lng: -74.0021, note: 'La pizza de Spider-Man en el West Village.', transit: 'Caminando al West Village.' },
    { id: 'd7s9', name: 'Village Vanguard', type: 'Show', time: '21:00', lat: 40.7364, lng: -74.0016, note: 'Jazz en vivo (o Smalls, a la vuelta).', transit: 'Caminando, 4 min.' },
  ] },
  { n: 8, dateLabel: 'Jue 23 Jul', title: 'MoMA + Top of the Rock', color: '#5856D6', places: [
    { id: 'd8s1', name: 'MoMA', type: 'Museo', time: '14:00', lat: 40.7614, lng: -73.9776, note: 'Museo de Arte Moderno. Mañana libre de colchón.', transit: 'Subte E/M hasta 5 Av–53 St.' },
    { id: 'd8s2', name: 'Top of the Rock', type: 'Mirador', time: '19:30', lat: 40.7593, lng: -73.979, note: 'Atardecer sobre Manhattan (reservado).', transit: 'Caminando a Rockefeller Center.' },
  ] },
  { n: 9, dateLabel: 'Vie 24 Jul', title: 'Check-out → Miami', color: '#A2845E', places: [
    { id: 'd9s1', name: 'Hotel — Check-out', type: 'Punto de interés', time: '12:00', lat: 40.7648, lng: -73.9827, note: 'Check-out 12:00 y última vuelta por el barrio.', transit: 'En el hotel (1717 Broadway).' },
    { id: 'd9s2', name: 'JFK Airport', type: 'Transporte', time: '17:00', lat: 40.6413, lng: -73.7781, note: 'Vuelo DELTA 1414 a Miami, 19:55.', transit: 'AirTrain + subte, o taxi.' },
  ] },
];

export const TRIP_TITLE = 'Nueva York';
export const TRIP_SUBTITLE = '16 – 24 jul 2026 · 9 días';

export const BOROUGH_LEGEND = [
  { label: 'Manhattan', color: '#007AFF' },
  { label: 'Brooklyn', color: '#FF9500' },
  { label: 'Queens', color: '#34C759' },
  { label: 'Bronx', color: '#AF52DE' },
  { label: 'Staten I.', color: '#FF3B30' },
];

let _all: Stop[] | null = null;
export function allStops(): Stop[] {
  if (!_all) {
    _all = [];
    for (const d of DAYS) {
      d.places.forEach((p, i) => {
        _all!.push({ ...p, day: d.n, color: d.color, dateLabel: d.dateLabel, dayTitle: d.title, stop: i + 1 });
      });
    }
  }
  return _all;
}

export const stopById = (id: string): Stop | undefined => allStops().find((s) => s.id === id);
