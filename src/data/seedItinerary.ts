// Itinerario de ejemplo precargado — basado en la guía real del viaje (NYC, 15-23 julio 2026).
// Se carga una sola vez si el itinerario está vacío; el usuario lo edita/borra libremente.
import type { GeoPoint, NeighborhoodId } from '../types';

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
    name: 'Día 1 · Llegada + primer contacto',
    date: '2026-07-15',
    neighborhoodId: 'midtown',
    description:
      'Check-in (zona Midtown/Chelsea). Times Square, 5ta Avenida y las luces de la ciudad de noche.',
    pins: [
      { name: 'Times Square', note: 'Caótico pero imprescindible. De noche es otra cosa.', geo: { lng: -73.9855, lat: 40.758 } },
      { name: "St. Patrick's Cathedral", geo: { lng: -73.976, lat: 40.7585 } },
      { name: 'Rockefeller Center', geo: { lng: -73.9787, lat: 40.7587 } },
      { name: 'Apple Store 5th Ave', note: 'El cubo de vidrio, abierto 24/7. Comprar en Miami (7% tax).', geo: { lng: -73.9737, lat: 40.7639 } },
      { name: 'Bryant Park', note: 'Para respirar un poco.', geo: { lng: -73.9832, lat: 40.7536 } },
      { name: 'Shake Shack (Madison Sq)', note: 'El original (2004). Burger de bienvenida.', geo: { lng: -73.9882, lat: 40.7415 } },
      { name: "Ellen's Stardust Diner", note: 'Los mozos cantan Broadway. Fun para la primera noche.', geo: { lng: -73.9849, lat: 40.7607 } },
    ],
  },
  {
    name: 'Día 2 · Lower Manhattan + Brooklyn',
    date: '2026-07-16',
    neighborhoodId: 'fidi',
    description:
      'Estatua de la Libertad temprano (reservar en statuecruises.com), 9/11 Memorial, Wall St y cruce del Brooklyn Bridge a DUMBO.',
    pins: [
      { name: 'Battery Park · Ferry Estatua', note: 'Statue Cruises 8am. Reservar 2-4 semanas antes.', geo: { lng: -74.017, lat: 40.7033 } },
      { name: '9/11 Memorial & Museum', note: 'Reservar entrada online.', geo: { lng: -74.0134, lat: 40.7115 } },
      { name: 'Charging Bull & Fearless Girl', geo: { lng: -74.0134, lat: 40.7056 } },
      { name: 'Brooklyn Bridge', note: 'Cruzar a pie (~40 min). Vistas espectaculares.', geo: { lng: -74.0039, lat: 40.7127 } },
      { name: 'DUMBO', note: 'La foto clásica en Washington St.', geo: { lng: -73.9891, lat: 40.7033 } },
      { name: "Grimaldi's / Juliana's", note: 'La pizza clásica de Brooklyn, debajo del puente.', geo: { lng: -73.9932, lat: 40.7026 } },
    ],
  },
  {
    name: 'Día 3 · Central Park + The Met',
    date: '2026-07-17',
    neighborhoodId: 'central-park',
    description:
      'Mañana en el parque (entrar por la 72nd), tarde en el Met, el tram de Spider-Man y cena en Carbone (Resy, 3-4 semanas antes).',
    pins: [
      { name: 'Bethesda Fountain & Terrace', geo: { lng: -73.9711, lat: 40.774 } },
      { name: 'Bow Bridge', note: 'El puente romántico. Foto clásica.', geo: { lng: -73.9718, lat: 40.7756 } },
      { name: 'Strawberry Fields', note: 'Homenaje a Lennon, frente al Dakota.', geo: { lng: -73.9754, lat: 40.7756 } },
      { name: 'Roosevelt Island Tramway', note: 'El cable car de Spider-Man (2002). $2.90 con OMNY.', geo: { lng: -73.9642, lat: 40.7615 } },
      { name: 'The Met', note: 'Mínimo 2-3 hs: ala egipcia, arte europeo. Roof Garden en verano.', geo: { lng: -73.9632, lat: 40.7794 } },
      { name: 'Carbone', note: 'Italian-American icónico. Reservar vía Resy.', geo: { lng: -74.0003, lat: 40.7284 } },
    ],
  },
  {
    name: 'Día 4 · MoMA + High Line + Broadway',
    date: '2026-07-18',
    neighborhoodId: 'chelsea',
    description:
      'MoMA a la mañana, High Line + Chelsea Market al mediodía. Llegan los amigos → atardecer en Top of the Rock y a la noche Broadway (TodayTix).',
    pins: [
      { name: 'MoMA', note: 'Van Gogh, Picasso, Warhol. Reservar online, 2-3 hs.', geo: { lng: -73.9776, lat: 40.7614 } },
      { name: 'High Line', note: 'Bajar desde la 34 hasta la 14.', geo: { lng: -74.0023, lat: 40.753 } },
      { name: 'Chelsea Market', note: 'Almuerzo. Ex fábrica de Oreo.', geo: { lng: -74.006, lat: 40.742 } },
      { name: 'Top of the Rock', note: 'Atardecer ~7-8pm: ves el Empire y el parque.', geo: { lng: -73.9787, lat: 40.7593 } },
      { name: 'TKTS Times Square', note: 'Descuentos el día del show (sin garantía).', geo: { lng: -73.9855, lat: 40.759 } },
    ],
  },
  {
    name: 'Día 5 · FINAL DEL MUNDIAL 🏆',
    date: '2026-07-19',
    neighborhoodId: 'midtown',
    description:
      'MetLife Stadium (NJ Transit desde Penn Station — sacar tickets en la app YA). Sin entradas: FIFA Fan Fest o bar en Hell\'s Kitchen. Si gana Argentina: Times Square → Meatpacking/LES.',
    pins: [
      { name: 'Penn Station · NJ Transit', note: 'Salir con MUCHO tiempo. ~40 min a MetLife.', geo: { lng: -73.9936, lat: 40.7506 } },
      { name: 'Bryant Park · Fan Fest', note: 'Candidato fuerte a FIFA Fan Fest. Seguir fifa.com.', geo: { lng: -73.9832, lat: 40.7536 } },
      { name: "Hell's Kitchen", note: 'Bares con pantalla grande. Llegar 2+ hs antes.', geo: { lng: -73.9918, lat: 40.763 } },
      { name: 'Times Square (festejo)', note: 'El caos colectivo si gana Argentina.', geo: { lng: -73.9855, lat: 40.758 } },
      { name: 'Meatpacking District', note: 'La noche larga: discotecas y glamour.', geo: { lng: -74.0078, lat: 40.7398 } },
    ],
  },
  {
    name: 'Día 6 · SoHo + Village + jazz',
    date: '2026-07-20',
    neighborhoodId: 'greenwich-village',
    description:
      'Brunch tardío y merecido, streetwear y vinilos en SoHo, Washington Square y noche de jazz en el Village (Smalls, el favorito de los músicos).',
    pins: [
      { name: "Sadelle's", note: 'Smoked salmon tower. Brunch de nivel.', geo: { lng: -74.0009, lat: 40.7249 } },
      { name: 'Supreme (274 Lafayette)', note: 'La tienda madre. Drops los jueves.', geo: { lng: -73.9959, lat: 40.7245 } },
      { name: 'The Strand', note: '18 millas de libros. La bolsa naranja es souvenir.', geo: { lng: -73.9909, lat: 40.7333 } },
      { name: 'Washington Square Park', note: 'Músicos callejeros, ajedrez, ambiente bohemio.', geo: { lng: -73.9973, lat: 40.7308 } },
      { name: 'Flatiron Building', note: 'El Daily Bugle de Spider-Man. Foto desde la mediana.', geo: { lng: -73.9897, lat: 40.7411 } },
      { name: 'Smalls Jazz Club', note: 'Cover ~$25, hasta las 4am. El más auténtico.', geo: { lng: -74.0023, lat: 40.7343 } },
      { name: 'Village Vanguard', note: 'Histórico, sagrado. Reservar.', geo: { lng: -74.0018, lat: 40.7359 } },
    ],
  },
  {
    name: 'Día 7 · Brooklyn + Coney Island',
    date: '2026-07-21',
    description:
      'Williamsburg: donuts, vinilos y vintage. Subway (D/N/F/Q) a Coney Island: Nathan\'s + Cyclone (queda fuera de este mapa 😉). Cena: Peter Luger.',
    pins: [
      { name: 'Peter Pan Donut', note: 'Donuts clásicas de Brooklyn desde 1950.', geo: { lng: -73.9538, lat: 40.7295 } },
      { name: 'Rough Trade NYC', note: 'El mejor disquero de la ciudad. Fuerte en electrónica.', geo: { lng: -73.9584, lat: 40.7203 } },
      { name: "Beacon's Closet", note: 'Vintage curado de primera.', geo: { lng: -73.9557, lat: 40.7228 } },
      { name: 'Peter Luger', note: 'El steakhouse legendario (1887). SOLO EFECTIVO. Reservar semanas antes.', geo: { lng: -73.9625, lat: 40.7099 } },
    ],
  },
  {
    name: 'Día 8 · Hudson Yards + shopping',
    date: '2026-07-22',
    neighborhoodId: 'chelsea',
    description:
      'The Edge y The Vessel a la mañana, gran tarde de shopping (sneakers, cómics, electrónica) y última noche: Balthazar + rooftop 230 Fifth.',
    pins: [
      { name: 'The Edge', note: 'Piso 100, plataforma al aire libre. Reservar online.', geo: { lng: -74.0022, lat: 40.7538 } },
      { name: 'B&H Photo Video', note: 'Electrónica, audio pro, cámaras.', geo: { lng: -73.9972, lat: 40.7532 } },
      { name: 'Stadium Goods', note: 'Sneakers raras y colecciones premium.', geo: { lng: -74.0009, lat: 40.7192 } },
      { name: 'Forbidden Planet', note: 'Cómics y merch de Spider-Man. El mejor de NY.', geo: { lng: -73.9911, lat: 40.7334 } },
      { name: 'Balthazar', note: 'Brasserie francesa clásica. Reservar con anticipación.', geo: { lng: -73.998, lat: 40.7227 } },
      { name: '230 Fifth Rooftop', note: 'Vista directa al Empire State de noche. El cierre perfecto.', geo: { lng: -73.9879, lat: 40.7442 } },
    ],
  },
  {
    name: 'Día 9 · Último mañana → Miami ✈️',
    date: '2026-07-23',
    neighborhoodId: 'lower-east-side',
    description:
      'Despedida con pastrami o bagel en mano y vuelo a Miami (Apple en Brickell o Aventura, 7% tax).',
    pins: [
      { name: "Katz's Delicatessen", note: 'Pastrami icónico desde 1888. No perder el ticket de entrada.', geo: { lng: -73.9874, lat: 40.7223 } },
      { name: 'Russ & Daughters', note: 'Bagels y lox desde 1914.', geo: { lng: -73.9883, lat: 40.7227 } },
    ],
  },
];
