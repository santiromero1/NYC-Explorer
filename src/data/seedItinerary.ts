// Itinerario REAL del viaje — NYC 16→24 de julio 2026 (del planner familiar).
// SEED_VERSION: al subirla, la app reemplaza el itinerario guardado por esta versión
// (ver useItineraryStore.applySeed). Fuente legible: ITINERARIO.md / ITINERARIO.pdf.
import type { GeoPoint, NeighborhoodId } from '../types';

export const SEED_VERSION = 2;

export interface SeedPin {
  name: string;
  note?: string;
  geo: GeoPoint;
}

export interface SeedDay {
  name: string;
  date: string;
  neighborhoodId?: NeighborhoodId;
  description?: string;
  pins: SeedPin[];
}

export const SEED_DAYS: SeedDay[] = [
  {
    name: 'Día 1 · Llegada + Midtown',
    date: '2026-07-16',
    neighborhoodId: 'midtown',
    description:
      'Aterrizamos en JFK 9:10 (LATAM 2468). Hotel: Courtyard Marriott, 1717 Broadway — check-in 15:00. Día suave por el barrio y Times Square de noche.',
    pins: [
      { name: 'Columbus Circle', note: 'La esquina del hotel (1717 Broadway).', geo: { lng: -73.9819, lat: 40.7681 } },
      { name: 'Plaza Hotel', geo: { lng: -73.9744, lat: 40.7644 } },
      { name: '5th Avenue', note: 'Caminata bajando hacia Rockefeller.', geo: { lng: -73.9745, lat: 40.762 } },
      { name: 'Rockefeller Center', geo: { lng: -73.9787, lat: 40.7587 } },
      { name: 'Magnolia Bakery', note: 'Merienda.', geo: { lng: -73.98, lat: 40.7601 } },
      { name: 'Times Square', note: 'De noche: las luces son el show.', geo: { lng: -73.9855, lat: 40.758 } },
      { name: 'Whole Foods Market', note: 'Súper para abastecerse (Columbus Circle).', geo: { lng: -73.983, lat: 40.7686 } },
    ],
  },
  {
    name: 'Día 2 · Estatua de la Libertad + Downtown',
    date: '2026-07-17',
    neighborhoodId: 'fidi',
    description: 'Todo Lower Manhattan a pie. Ferry 9:00 desde Whitehall.',
    pins: [
      { name: 'Staten Island Ferry (9:00)', note: 'Subte hasta Whitehall Terminal. Gratis: la Estatua se ve desde el barco.', geo: { lng: -74.0132, lat: 40.7013 } },
      { name: 'Battery Park', geo: { lng: -74.017, lat: 40.7033 } },
      { name: 'Charging Bull', note: 'Y Fearless Girl.', geo: { lng: -74.0134, lat: 40.7056 } },
      { name: 'NYSE', note: 'La Bolsa de Nueva York.', geo: { lng: -74.0113, lat: 40.7069 } },
      { name: 'Wall Street', geo: { lng: -74.0091, lat: 40.706 } },
      { name: 'Trinity Church', geo: { lng: -74.012, lat: 40.7081 } },
      { name: "St. Paul's Chapel", geo: { lng: -74.0091, lat: 40.7113 } },
      { name: 'City Hall', geo: { lng: -74.006, lat: 40.7128 } },
      { name: '9/11 Memorial', note: 'Ver el Survival Tree.', geo: { lng: -74.0134, lat: 40.7115 } },
      { name: 'Oculus', geo: { lng: -74.0113, lat: 40.7115 } },
      { name: 'Brookfield Place', geo: { lng: -74.0158, lat: 40.713 } },
      { name: 'One World Observatory', note: 'OWO — el mirador.', geo: { lng: -74.0132, lat: 40.713 } },
      { name: 'South Street Seaport', geo: { lng: -74.0035, lat: 40.7063 } },
    ],
  },
  {
    name: 'Día 3 · Central Park + The Met + Harlem',
    date: '2026-07-18',
    neighborhoodId: 'central-park',
    description: 'Mañana en el parque, almuerzo clásico del UWS, tarde de museo y Harlem.',
    pins: [
      { name: 'Central Park', note: 'Bethesda Terrace, Bow Bridge, The Mall.', geo: { lng: -73.9711, lat: 40.774 } },
      { name: 'Barney Greengrass', note: 'Almuerzo (alt.: Le Pain Quotidien).', geo: { lng: -73.9752, lat: 40.7885 } },
      { name: 'The Met', geo: { lng: -73.9632, lat: 40.7794 } },
      { name: 'Harlem · misa gospel', note: 'Averiguar horario/reserva.', geo: { lng: -73.9405, lat: 40.8155 } },
      { name: 'Mt Morris Park', note: 'Las casas históricas.', geo: { lng: -73.944, lat: 40.8046 } },
      { name: 'Malcolm X Blvd', geo: { lng: -73.9448, lat: 40.8082 } },
    ],
  },
  {
    name: 'Día 4 · ⚽ FINAL DEL MUNDIAL',
    date: '2026-07-19',
    neighborhoodId: 'midtown',
    description:
      'El día entero para la Final en MetLife Stadium (NJ). Sin entradas: FIFA Fan Fest o bar con pantalla grande. Si gana Argentina: Times Square 🇦🇷',
    pins: [
      { name: 'Penn Station · NJ Transit', note: 'Tren a MetLife (~40 min). Tickets en la app y salir con MUCHO tiempo.', geo: { lng: -73.9936, lat: 40.7506 } },
    ],
  },
  {
    name: 'Día 5 · Midtown East + SUMMIT',
    date: '2026-07-20',
    neighborhoodId: 'midtown',
    description: 'Los clásicos de Midtown East. SUMMIT reservado 14:00. Broadway a la noche.',
    pins: [
      { name: 'Grand Central Terminal', geo: { lng: -73.9772, lat: 40.7527 } },
      { name: 'Chrysler Building', geo: { lng: -73.9755, lat: 40.7516 } },
      { name: 'Biblioteca Pública de NY', geo: { lng: -73.9822, lat: 40.7532 } },
      { name: 'Bryant Park', geo: { lng: -73.9832, lat: 40.7536 } },
      { name: 'Empire State', note: 'Foto desde afuera.', geo: { lng: -73.9857, lat: 40.7484 } },
      { name: 'SUMMIT One Vanderbilt', note: 'Reservado 14:00.', geo: { lng: -73.9787, lat: 40.7527 } },
      { name: "St. Patrick's Cathedral", geo: { lng: -73.976, lat: 40.7585 } },
      { name: 'Nintendo World', note: 'Rockefeller Plaza.', geo: { lng: -73.9797, lat: 40.7576 } },
      { name: 'Broadway · show', note: 'Show a definir.', geo: { lng: -73.985, lat: 40.759 } },
    ],
  },
  {
    name: 'Día 6 · Brooklyn',
    date: '2026-07-21',
    description: 'Cruce del puente, DUMBO y tarde por los parques del río hasta Williamsburg.',
    pins: [
      { name: 'Brooklyn Bridge (cruce)', note: 'Subte a City Hall y vuelta caminando.', geo: { lng: -73.9969, lat: 40.7061 } },
      { name: 'DUMBO', geo: { lng: -73.9891, lat: 40.7033 } },
      { name: 'Washington Street', note: 'La foto clásica con el puente.', geo: { lng: -73.9894, lat: 40.7024 } },
      { name: 'Empire Fulton Ferry Park', geo: { lng: -73.9926, lat: 40.7043 } },
      { name: 'Time Out Market', note: 'Almuerzo.', geo: { lng: -73.9905, lat: 40.7033 } },
      { name: 'Manhattan Bridge Lookout', note: 'Caminar.', geo: { lng: -73.9861, lat: 40.6997 } },
      { name: 'Brooklyn Bridge Park', geo: { lng: -73.9967, lat: 40.7003 } },
      { name: 'Williamsburg · Domino Park', note: 'Ferry, subte o bici.', geo: { lng: -73.9674, lat: 40.7142 } },
      { name: 'Brooklyn Heights Promenade', geo: { lng: -73.9968, lat: 40.6963 } },
    ],
  },
  {
    name: 'Día 7 · High Line + Chelsea + SoHo',
    date: '2026-07-22',
    neighborhoodId: 'chelsea',
    description:
      'De Hudson Yards hacia el sur por el High Line, y tarde de barrios: SoHo, Nolita, Little Italy y Chinatown.',
    pins: [
      { name: 'The Edge', note: 'El mirador de Hudson Yards.', geo: { lng: -74.0022, lat: 40.7538 } },
      { name: 'Vessel', geo: { lng: -74.0009, lat: 40.7536 } },
      { name: 'High Line', note: 'Caminarla hacia el sur.', geo: { lng: -74.0048, lat: 40.748 } },
      { name: 'Chelsea Market', geo: { lng: -74.006, lat: 40.742 } },
      { name: 'Little Island', geo: { lng: -74.01, lat: 40.742 } },
      { name: 'Meatpacking District', geo: { lng: -74.0078, lat: 40.7398 } },
      { name: 'SoHo', note: 'Lindo para compras.', geo: { lng: -73.999, lat: 40.7233 } },
      { name: 'NoHo', geo: { lng: -73.9925, lat: 40.728 } },
      { name: 'Nolita', geo: { lng: -73.9955, lat: 40.7223 } },
      { name: 'Little Italy', geo: { lng: -73.9973, lat: 40.7191 } },
      { name: 'Chinatown', geo: { lng: -73.997, lat: 40.7158 } },
      { name: 'Columbus Park', geo: { lng: -73.9998, lat: 40.7146 } },
      { name: "Joe's Pizza", note: 'La de Spider-Man. Alt.: Emily (burger) a 2 cuadras.', geo: { lng: -74.0021, lat: 40.7305 } },
      { name: 'Jazz en vivo', note: 'Smalls o Village Vanguard.', geo: { lng: -74.0023, lat: 40.7343 } },
    ],
  },
  {
    name: 'Día 8 · MoMA + Top of the Rock',
    date: '2026-07-23',
    neighborhoodId: 'midtown',
    description: 'Mañana libre — colchón para pendientes y compras.',
    pins: [
      { name: 'MoMA', geo: { lng: -73.9776, lat: 40.7614 } },
      { name: 'Top of the Rock', note: '19:30 — atardecer sobre Manhattan.', geo: { lng: -73.9787, lat: 40.7593 } },
    ],
  },
  {
    name: 'Día 9 · Check-out → Miami ✈️',
    date: '2026-07-24',
    neighborhoodId: 'midtown',
    description:
      'Check-out 12:00 y última vuelta. DELTA 1414 · JFK 19:55 → FLL 23:25. En Miami: Sixt + Marseilles Hotel (Collins Ave).',
    pins: [
      { name: 'Hotel · check-out', note: 'Check-out 12:00. Dejar valijas si hace falta.', geo: { lng: -73.9826, lat: 40.7649 } },
    ],
  },
];
