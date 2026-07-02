// Datos del Grid — SPECS/08_FEATURE_SPECS/GRID.md
import type { GridConcept, GridData } from '../types';

export const GRID: GridData = {
  streets: [
    { label: 'Houston St', number: 0, svgY: 660, geoLat: 40.726, importance: 'key' },
    { label: '14th St', number: 14, svgY: 560, geoLat: 40.737, importance: 'key' },
    { label: '23rd St', number: 23, svgY: 500, geoLat: 40.744, importance: 'key' },
    { label: '34th St', number: 34, svgY: 430, geoLat: 40.75, importance: 'key' },
    { label: '42nd St', number: 42, svgY: 380, geoLat: 40.756, importance: 'key' },
    { label: '57th St', number: 57, svgY: 300, geoLat: 40.765, importance: 'key' },
    { label: '59th St', number: 59, svgY: 290, geoLat: 40.767, importance: 'key' },
    { label: '72nd St', number: 72, svgY: 235, geoLat: 40.778, importance: 'secondary' },
    { label: '86th St', number: 86, svgY: 175, geoLat: 40.785, importance: 'secondary' },
    { label: '96th St', number: 96, svgY: 140, geoLat: 40.792, importance: 'secondary' },
    { label: '110th St', number: 110, svgY: 95, geoLat: 40.8, importance: 'key' },
    { label: '125th St', number: 125, svgY: 55, geoLat: 40.81, importance: 'key' },
  ],
  avenues: [
    { label: '1st Ave', svgX: 320, geoLng: -73.972, importance: 'secondary' },
    { label: '3rd Ave', svgX: 295, geoLng: -73.978, importance: 'secondary' },
    { label: 'Lexington Ave', svgX: 280, geoLng: -73.981, importance: 'secondary' },
    { label: 'Park Ave', svgX: 265, geoLng: -73.983, importance: 'key' },
    { label: 'Madison Ave', svgX: 250, geoLng: -73.985, importance: 'secondary' },
    { label: '5th Ave', svgX: 230, geoLng: -73.99, importance: 'key' },
    { label: '6th Ave', svgX: 205, geoLng: -73.995, importance: 'secondary' },
    { label: '7th Ave', svgX: 185, geoLng: -73.998, importance: 'key' },
    { label: '8th Ave', svgX: 165, geoLng: -74.001, importance: 'secondary' },
    { label: '9th Ave', svgX: 145, geoLng: -74.004, importance: 'secondary' },
    { label: '10th Ave', svgX: 120, geoLng: -74.008, importance: 'secondary' },
    { label: '11th Ave', svgX: 100, geoLng: -74.011, importance: 'secondary' },
  ],
  broadway: {
    label: 'Broadway',
    // Estilizada en el SVG: baja en diagonal por la isla con quiebres en las plazas
    svgPath: [
      { x: 140, y: 55 },
      { x: 150, y: 170 },
      { x: 162, y: 290 }, // Columbus Circle (59th)
      { x: 185, y: 380 }, // Times Square (42nd & 7th)
      { x: 205, y: 430 }, // Herald Square (34th & 6th)
      { x: 230, y: 500 }, // Flatiron (23rd & 5th)
      { x: 240, y: 560 }, // Union Square (14th)
      { x: 215, y: 660 },
      { x: 195, y: 780 },
      { x: 190, y: 850 },
    ],
    // Trazado geográfico aproximado (plazas reales)
    geoPath: [
      { lng: -73.9587, lat: 40.814 }, // 125th
      { lng: -73.9641, lat: 40.8075 }, // 116th (Columbia)
      { lng: -73.9722, lat: 40.7938 }, // 96th
      { lng: -73.9819, lat: 40.7785 }, // 72nd
      { lng: -73.9819, lat: 40.7681 }, // Columbus Circle
      { lng: -73.9855, lat: 40.758 }, // Times Square
      { lng: -73.9877, lat: 40.7497 }, // Herald Square
      { lng: -73.9897, lat: 40.7411 }, // Flatiron
      { lng: -73.9911, lat: 40.7359 }, // Union Square
      { lng: -74.0006, lat: 40.7205 }, // Canal
      { lng: -74.0064, lat: 40.7128 }, // City Hall
      { lng: -74.0132, lat: 40.7048 }, // Bowling Green
    ],
  },
};

// Plazas donde Broadway corta avenidas (puntos notables sobre la diagonal)
export const BROADWAY_SQUARES: { label: string; svgY: number }[] = [
  { label: 'Times Sq', svgY: 380 },
  { label: 'Herald Sq', svgY: 430 },
  { label: 'Flatiron', svgY: 500 },
  { label: 'Union Sq', svgY: 560 },
];

// Panel educativo — GRID.md §4 (contenido completo)
export const GRID_CONCEPTS: GridConcept[] = [
  {
    title: 'Qué es una Street (calle)',
    body: 'Las streets son las calles numeradas que cruzan la isla de este a oeste (de río a río). Su número crece hacia el norte: la 42nd St está más al norte que la 23rd St. Cuanto más alto el número, más "arriba" en el mapa.',
    example: '"42nd Street" queda al norte de "34th Street".',
  },
  {
    title: 'Qué es una Avenue (avenida)',
    body: 'Las avenues son las grandes arterias que recorren la isla de norte a sur (a lo largo). Están numeradas de este a oeste: la 1st Ave está al este, la 11th Ave al oeste. Son más anchas y largas que las streets.',
    example: '"5th Avenue" corre de punta a punta de la isla, de norte a sur.',
  },
  {
    title: 'Uptown y Downtown',
    body: 'En Nueva York no se dice "norte/sur": se dice uptown (hacia el norte, números que suben) y downtown (hacia el sur, números que bajan). Si vas del 20 al 50, vas uptown; del 50 al 20, downtown. Los subtes y la gente hablan así todo el tiempo.',
    example: '"El museo está uptown" = está hacia el norte.',
  },
  {
    title: 'Crosstown',
    body: 'Moverse de este a oeste (o al revés), o sea a lo ancho de la isla, es ir crosstown. Es el movimiento perpendicular a uptown/downtown. Suele ser el trayecto más lento (hay menos subtes crosstown).',
    example: 'Un "bus crosstown" cruza la isla de lado a lado.',
  },
  {
    title: 'La 5th Avenue divide Este y Oeste',
    body: 'La Quinta Avenida es la línea que parte la isla en East Side y West Side. Por eso las direcciones llevan "E" o "W": West 42nd St está al oeste de la 5th; East 42nd St, al este. La numeración de las casas empieza en 1 sobre la 5th y crece hacia cada lado.',
    example: '"W 23rd St" está del lado oeste; "E 23rd St", del este.',
  },
  {
    title: 'Cómo leer una dirección',
    body: 'Una dirección típica cruza una street con una avenue. "W 23rd St & 7th Ave" significa: la calle 23, del lado oeste, a la altura de la 7ma avenida. Con eso ya sabés el punto exacto: subís/bajás por el número de calle y te corrés por la avenida.',
    example: '"Meet me at 34th & 8th" = esquina de la calle 34 y la 8va avenida.',
  },
  {
    title: 'Broadway, la excepción diagonal',
    body: 'Casi todo es una grilla ordenada… menos Broadway, que cruza la isla en diagonal. Donde Broadway corta una avenida se forman plazas famosas: Times Square (con la 7th), Herald Square (con la 6th), Madison Square/Flatiron (con la 5th) y Union Square. Por eso hay edificios triangulares como el Flatiron.',
    example: 'Times Square existe porque Broadway cruza la 7th Ave en la calle 42.',
  },
  {
    title: 'Debajo de la 14th, la grilla desaparece',
    body: 'Al sur de Houston St / la calle 14 (Village, SoHo, Chinatown, Financial District) la ciudad es más vieja que la grilla: las calles tienen nombres, no números, y se cruzan en ángulos raros. Ahí es normal perderse; conviene usar el mapa real y guiarse por nombres (Bleecker, Prince, Wall St…).',
    example: 'En el Village, "West 4th St" llega a cruzarse con "West 10th St" (¡rompe toda lógica!).',
  },
];
