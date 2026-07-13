// Itinerario real del viaje (16–24 jul 2026) — fuente: ITINERARIO-NYC-2026.md (versión final)
export interface Place {
  id: string;
  name: string;
  type: string;
  time: string;
  lat: number;
  lng: number;
  note: string;
  transit: string;
  /** Bloque del día (Mañana / Tarde / Noche…). Se muestra como separador en la lista. */
  block?: string;
  /** Parada opcional / si sobra tiempo. */
  optional?: boolean;
}

export interface Day {
  n: number;
  dateLabel: string;
  title: string;
  color: string;
  /** Sección "Extras" sin día asignado (no entra en el encuadre de "Todo el viaje"). */
  extra?: boolean;
  places: Place[];
  /** Opciones para comer del día: pin en el mapa pero sin número de parada. */
  food?: Place[];
}

/** Place enriquecido con la info de su día (para mapa, búsqueda y detalle). */
export interface Stop extends Place {
  day: number;
  color: string;
  dateLabel: string;
  dayTitle: string;
  stop: number;
  kind: 'stop' | 'food';
  extra?: boolean;
}

export const DAYS: Day[] = [
  { n: 1, dateLabel: 'Jue 16 Jul', title: 'Llegada + Midtown', color: '#FF9500', places: [
    { id: 'd1s1', name: 'Columbus Circle', type: 'Punto de interés', time: '12:00', lat: 40.7681, lng: -73.9819, note: 'La esquina del hotel y la entrada suroeste a Central Park. Aterrizamos en JFK 9:10: dejar valijas (check-in 15:00) y día suave por el barrio.', transit: 'Salís del hotel, 2 cuadras caminando.', block: 'Mañana / Mediodía' },
    { id: 'd1s2', name: 'The Plaza Hotel', type: 'Punto de interés', time: '12:45', lat: 40.7645, lng: -73.9744, note: 'El hotel de Mi Pobre Angelito 2, frente a Central Park.', transit: 'Caminando por Central Park South, 8 min.', block: 'Mañana / Mediodía' },
    { id: 'd1s3', name: 'Apple Store 5th Ave', type: 'Compras', time: '13:15', lat: 40.7638, lng: -73.973, note: 'El cubo de vidrio. Cerca: Blue Box Café (Tiffany) y Le Café LV para un café con vista.', transit: 'Enfrente del Plaza, cruzando 5th Ave.', block: 'Mañana / Mediodía' },
    { id: 'd1s4', name: '590 Madison — Power of Togetherness', type: 'Punto de interés', time: '13:45', lat: 40.7623, lng: -73.9729, note: 'La escultura en el atrio del edificio IBM, bajando por la 5th Avenue.', transit: 'Caminando por 5th Ave / Madison, 3 min.', block: 'Mañana / Mediodía' },
    { id: 'd1s5', name: 'Rockefeller Center', type: 'Punto de interés', time: '14:15', lat: 40.7587, lng: -73.9787, note: 'La plaza y las tiendas. Fan Band de Bank of America por el Mundial.', transit: 'Bajando por 5th Ave, 10 min.', block: 'Mañana / Mediodía' },
    { id: 'd1s6', name: 'Nintendo NY', type: 'Compras', time: '15:00', lat: 40.758, lng: -73.9789, note: 'La tienda de dos pisos en Rockefeller Plaza.', transit: 'Dentro de Rockefeller Center.', block: 'Mañana / Mediodía' },
    { id: 'd1s7', name: 'Times Square', type: 'Punto de interés', time: '20:00', lat: 40.758, lng: -73.9855, note: 'De noche las luces son el show.', transit: 'Caminando 10 min por Broadway.', block: 'Tarde / Noche' },
    { id: 'd1s8', name: 'Whole Foods (Columbus Circle)', type: 'Compras', time: '21:30', lat: 40.7683, lng: -73.9829, note: 'Súper para abastecer el hotel.', transit: 'Vuelta al hotel, en el Deutsche Bank Center.', block: 'Tarde / Noche' },
  ], food: [
    { id: 'd1f1', name: 'Magnolia Bakery', type: 'Para comer', time: 'Merienda', lat: 40.7593, lng: -73.9806, note: 'Probá el banana pudding.', transit: 'Rockefeller Center, 6th Ave y W 49 St.' },
    { id: 'd1f2', name: 'Smith & Wollensky', type: 'Para comer', time: 'Cena', lat: 40.7553, lng: -73.9712, note: 'Steakhouse clásico neoyorquino.', transit: '3rd Ave y E 49 St.' },
    { id: 'd1f3', name: 'Burger Joint', type: 'Para comer', time: 'Cena', lat: 40.764, lng: -73.9781, note: 'Hamburguesería escondida detrás de una cortina en el lobby de un hotel.', transit: 'W 56 St, entre 6th y 7th Ave.' },
    { id: 'd1f4', name: 'Harry Cipriani', type: 'Para comer', time: 'Cena', lat: 40.7645, lng: -73.9718, note: 'Italiano elegante en el Sherry-Netherland.', transit: '5th Ave y E 59 St.' },
    { id: 'd1f5', name: 'The Halal Guys', type: 'Para comer', time: 'Callejera', lat: 40.7616, lng: -73.9797, note: 'El carrito original: pollo o gyro con arroz (o Adel’s Famous Halal, cerca).', transit: 'W 53 St y 6th Ave.' },
    { id: 'd1f6', name: "Gray's Papaya", type: 'Para comer', time: 'Panchos', lat: 40.7783, lng: -73.9818, note: 'Panchos icónicos, abierto hasta tarde.', transit: 'Broadway y W 72 St.' },
  ] },
  { n: 2, dateLabel: 'Vie 17 Jul', title: 'Estatua de la Libertad + Downtown', color: '#FF3B30', places: [
    { id: 'd2s1', name: 'Staten Island Ferry', type: 'Transporte', time: '09:00', lat: 40.7013, lng: -74.0132, note: 'Gratis: la Estatua de la Libertad se ve desde el barco. Ida y vuelta.', transit: 'Subte 1 hasta South Ferry o R/W hasta Whitehall.', block: 'Mañana' },
    { id: 'd2s2', name: 'Battery Park', type: 'Parque', time: '10:30', lat: 40.7033, lng: -74.017, note: 'Free tour de Civitatis a las 10:45 — llegar 10 min antes.', transit: 'Caminando desde la terminal del ferry.', block: 'Mañana' },
    { id: 'd2s3', name: 'Charging Bull & Fearless Girl', type: 'Punto de interés', time: '12:30', lat: 40.7056, lng: -74.0134, note: 'Las estatuas del distrito financiero.', transit: 'Caminando 5 min por Broadway.', block: 'Mañana' },
    { id: 'd2s4', name: 'Wall Street & NYSE', type: 'Punto de interés', time: '12:50', lat: 40.7069, lng: -74.0113, note: 'La Bolsa de Nueva York y el Federal Hall.', transit: 'Caminando 3 min.', block: 'Mañana' },
    { id: 'd2s5', name: 'Trinity Church', type: 'Punto de interés', time: '13:15', lat: 40.7081, lng: -74.012, note: 'La iglesia histórica al final de Wall St (tumba de Hamilton).', transit: 'Broadway y Wall St.', block: 'Mañana' },
    { id: 'd2s6', name: "St. Paul's Chapel", type: 'Punto de interés', time: '14:30', lat: 40.7113, lng: -74.0091, note: 'La capilla que sobrevivió al 11S, refugio de los rescatistas.', transit: 'Caminando por Broadway, 5 min.', block: 'Tarde' },
    { id: 'd2s7', name: 'City Hall', type: 'Punto de interés', time: '15:00', lat: 40.7128, lng: -74.006, note: 'La alcaldía y su parque.', transit: 'Caminando 3 min.', block: 'Tarde' },
    { id: 'd2s8', name: '9/11 Memorial', type: 'Punto de interés', time: '15:30', lat: 40.7115, lng: -74.0134, note: 'Las fuentes y el Survival Tree. Eataly enfrente para un café.', transit: 'Caminando 8 min hacia el oeste.', block: 'Tarde' },
    { id: 'd2s9', name: 'Oculus', type: 'Compras', time: '16:15', lat: 40.7118, lng: -74.011, note: 'La estación-shopping de Calatrava. Century 21 (outlet) enfrente, en Cortlandt St.', transit: 'Al lado del memorial.', block: 'Tarde' },
    { id: 'd2s10', name: 'Brookfield Place', type: 'Compras', time: '17:00', lat: 40.7136, lng: -74.0157, note: 'Shopping con vista al Hudson y patio de comidas.', transit: 'Cruzando por el Oculus, pasaje techado.', block: 'Tarde' },
    { id: 'd2s11', name: 'One World Observatory', type: 'Mirador', time: '17:45', lat: 40.7133, lng: -74.0134, note: 'Mirador del edificio más alto del hemisferio: reservá online. Cerca: Philip Williams (posters antiguos) en Warren St.', transit: 'Entrada por el World Trade Center.', block: 'Tarde' },
    { id: 'd2s12', name: 'South Street Seaport', type: 'Punto de interés', time: '19:00', lat: 40.7061, lng: -74.0029, note: 'Muelle histórico y atardecer sobre el East River.', transit: 'Caminando hacia el este, 12 min.', block: 'Tarde' },
  ], food: [
    { id: 'd2f1', name: 'Los Tacos No. 1 (Tribeca)', type: 'Para comer', time: 'Almuerzo', lat: 40.7146, lng: -74.0086, note: 'De los mejores tacos de la ciudad.', transit: 'Church St y Warren St.' },
    { id: 'd2f2', name: 'Eataly Downtown', type: 'Para comer', time: 'Merienda', lat: 40.7103, lng: -74.0122, note: 'Mercado italiano en el 4 World Trade Center.', transit: 'Frente al 9/11 Memorial.' },
    { id: 'd2f3', name: 'ITO', type: 'Para comer', time: 'Cena', lat: 40.7197, lng: -74.0103, note: 'Sushi omakase en Tribeca (reservar).', transit: 'Greenwich St y N Moore St.' },
  ] },
  { n: 3, dateLabel: 'Sáb 18 Jul', title: 'Central Park + The Met', color: '#34C759', places: [
    { id: 'd3s1', name: 'The Pond & Gapstow Bridge', type: 'Parque', time: '09:30', lat: 40.7658, lng: -73.9738, note: 'La esquina sureste del parque, con el skyline reflejado en el agua.', transit: 'Entrada por 5th Ave y 59 St (Grand Army Plaza).', block: 'Mañana — Central Park' },
    { id: 'd3s2', name: 'The Mall — Literary Walk', type: 'Parque', time: '10:00', lat: 40.7721, lng: -73.9708, note: 'La alameda de olmos con las estatuas de escritores.', transit: 'Caminando hacia el norte por el parque.', block: 'Mañana — Central Park' },
    { id: 'd3s3', name: 'Bethesda Terrace & Fountain', type: 'Punto de interés', time: '10:30', lat: 40.7739, lng: -73.9708, note: 'La terraza y la fuente del ángel. Cerca, en Conservatory Water, la estatua de Alicia en el País de las Maravillas.', transit: 'Al final de The Mall.', block: 'Mañana — Central Park' },
    { id: 'd3s4', name: 'Cherry Hill', type: 'Parque', time: '11:00', lat: 40.7743, lng: -73.9722, note: 'Mirador sobre The Lake, a pasos de Bethesda.', transit: 'Caminando 2 min.', block: 'Mañana — Central Park' },
    { id: 'd3s5', name: 'Bow Bridge', type: 'Punto de interés', time: '11:15', lat: 40.7757, lng: -73.9719, note: 'El puente más romántico y fotografiado del parque, sobre The Lake.', transit: 'Caminando 3 min.', block: 'Mañana — Central Park' },
    { id: 'd3s6', name: 'Strawberry Fields', type: 'Punto de interés', time: '11:45', lat: 40.7756, lng: -73.9748, note: 'El mosaico Imagine, homenaje a John Lennon.', transit: 'Caminando hacia el oeste, 5 min.', block: 'Mañana — Central Park' },
    { id: 'd3s7', name: 'The Dakota', type: 'Punto de interés', time: '12:00', lat: 40.7765, lng: -73.976, note: 'El edificio donde vivió John Lennon.', transit: 'Central Park West y W 72 St, saliendo del parque.', block: 'Mañana — Central Park' },
    { id: 'd3s8', name: 'Belvedere Castle', type: 'Mirador', time: '12:30', lat: 40.7794, lng: -73.9692, note: 'El castillito con vista a Turtle Pond y al Great Lawn.', transit: 'Volviendo al parque, 10 min hacia el norte.', block: 'Mañana — Central Park' },
    { id: 'd3s9', name: 'Turtle Pond & Shakespeare Garden', type: 'Parque', time: '12:50', lat: 40.7798, lng: -73.9697, note: 'Las tortugas del estanque y el jardín de flores.', transit: 'Al pie del castillo.', block: 'Mañana — Central Park' },
    { id: 'd3s10', name: 'Loeb Boathouse — botes', type: 'Punto de interés', time: '14:30', lat: 40.7753, lng: -73.9688, note: 'Alquiler de botes de remo en The Lake.', transit: 'Orilla este de The Lake.', block: 'Mañana — Central Park' },
    { id: 'd3s11', name: 'The Met', type: 'Museo', time: '15:00', lat: 40.7794, lng: -73.9632, note: 'Metropolitan Museum of Art.', transit: 'Saliendo del parque por 5th Ave y 82 St.', block: 'Tarde — Museos' },
    { id: 'd3s12', name: 'Guggenheim', type: 'Museo', time: '17:30', lat: 40.783, lng: -73.959, note: 'El espiral de Frank Lloyd Wright. Si quedan pilas después del Met.', transit: '5th Ave y E 89 St, 7 cuadras.', block: 'Tarde — Museos', optional: true },
    { id: 'd3s13', name: 'Museo de Historia Natural', type: 'Museo', time: '17:30', lat: 40.7813, lng: -73.974, note: 'Alternativa del otro lado del parque (el de Una Noche en el Museo).', transit: 'Cruzando el parque hacia el oeste.', block: 'Tarde — Museos', optional: true },
  ], food: [
    { id: 'd3f1', name: 'Barney Greengrass', type: 'Para comer', time: 'Almuerzo', lat: 40.7876, lng: -73.9755, note: 'Clásico judío del Upper West Side, desde 1908.', transit: 'Amsterdam Ave y W 86 St.' },
    { id: 'd3f2', name: 'Pastrami Queen', type: 'Para comer', time: 'Almuerzo', lat: 40.7743, lng: -73.9593, note: 'Pastrami kosher en el Upper East Side.', transit: 'Lexington Ave y E 78 St.' },
    { id: 'd3f3', name: 'Le Pain Quotidien', type: 'Para comer', time: 'Almuerzo', lat: 40.7705, lng: -73.9827, note: 'Opción liviana — sucursal cerca de Lincoln Center.', transit: 'W 62 St, entre Broadway y Columbus.' },
    { id: 'd3f4', name: 'Tavern on the Green', type: 'Para comer', time: 'Cena', lat: 40.7723, lng: -73.9778, note: 'El restaurante histórico dentro del parque.', transit: 'Central Park West y W 67 St.' },
  ] },
  { n: 4, dateLabel: 'Dom 19 Jul', title: 'Final del Mundial 2026', color: '#007AFF', places: [
    { id: 'd4s1', name: 'Penn Station', type: 'Transporte', time: '13:00', lat: 40.7506, lng: -73.9935, note: 'NJ Transit al estadio (~40 min). Sacá tickets en la app con anticipación y salí con MUCHO tiempo.', transit: 'Subte 1/2/3 o A/C/E hasta 34 St.' },
    { id: 'd4s2', name: 'MetLife Stadium', type: 'Punto de interés', time: '16:00', lat: 40.8135, lng: -74.0745, note: 'La Final del Mundial 2026. Sin entradas: FIFA Fan Fest o un bar con pantalla grande.', transit: 'NJ Transit desde Penn Station.' },
    { id: 'd4s3', name: 'Times Square (festejo)', type: 'Punto de interés', time: '23:00', lat: 40.758, lng: -73.9855, note: 'Si gana Argentina, el punto de encuentro del festejo.', transit: 'NJ Transit de vuelta + subte.' },
  ] },
  { n: 5, dateLabel: 'Lun 20 Jul', title: 'Midtown East + SUMMIT', color: '#AF52DE', places: [
    { id: 'd5s1', name: 'Grand Central Terminal', type: 'Punto de interés', time: '10:00', lat: 40.7527, lng: -73.9772, note: 'El hall principal es imperdible.', transit: 'Subte 4/5/6/7 o S hasta Grand Central.', block: 'Mañana' },
    { id: 'd5s2', name: 'Chrysler Building', type: 'Punto de interés', time: '10:40', lat: 40.7516, lng: -73.9755, note: 'Art déco, mejor visto desde afuera.', transit: 'Caminando, 3 min.', block: 'Mañana' },
    { id: 'd5s3', name: 'Biblioteca Pública (NYPL)', type: 'Punto de interés', time: '11:15', lat: 40.7532, lng: -73.9822, note: 'Los leones Patience y Fortitude y la sala de lectura Rose.', transit: 'Caminando por 42 St, 8 min.', block: 'Mañana' },
    { id: 'd5s4', name: 'Bryant Park', type: 'Parque', time: '11:45', lat: 40.7536, lng: -73.9832, note: 'El jardín detrás de la biblioteca.', transit: 'Detrás de la NYPL.', block: 'Mañana' },
    { id: 'd5s5', name: 'Empire State Building', type: 'Punto de interés', time: '12:15', lat: 40.7484, lng: -73.9857, note: 'Foto desde afuera (subimos al SUMMIT).', transit: 'Caminando por 5th Ave, 8 min.', block: 'Mañana' },
    { id: 'd5s6', name: "Macy's Herald Square", type: 'Compras', time: '12:45', lat: 40.7508, lng: -73.9893, note: 'La tienda por departamentos gigante.', transit: 'Caminando por 34 St, 5 min.', block: 'Mañana' },
    { id: 'd5s7', name: 'Buffalo Exchange', type: 'Compras', time: '13:15', lat: 40.7302, lng: -73.9856, note: 'Ropa de segunda mano en el East Village. Solo si dan los tiempos.', transit: 'Subte 6 hasta Astor Pl; E 11 St y 2nd Ave.', block: 'Mañana', optional: true },
    { id: 'd5s8', name: 'SUMMIT One Vanderbilt', type: 'Mirador', time: '14:00', lat: 40.7529, lng: -73.9786, note: 'Reservado 14:00. El mirador de espejos.', transit: 'Al lado de Grand Central.', block: 'Tarde' },
    { id: 'd5s9', name: "St. Patrick's Cathedral", type: 'Punto de interés', time: '16:00', lat: 40.7585, lng: -73.976, note: 'Catedral neogótica sobre 5th Ave.', transit: 'Caminando por 5th Ave, 8 min.', block: 'Tarde' },
    { id: 'd5s10', name: 'Wicked — Gershwin Theatre', type: 'Show', time: '19:00', lat: 40.7626, lng: -73.9845, note: 'Entradas por broadwaydirect. Llegar 30–40 min antes.', transit: 'W 51 St y Broadway.', block: 'Noche' },
  ], food: [
    { id: 'd5f1', name: "Joe's Pizza", type: 'Para comer', time: 'Para llevar', lat: 40.7541, lng: -73.9869, note: 'Porción clásica al paso.', transit: 'Broadway y W 40 St (también en Times Square).' },
  ] },
  { n: 6, dateLabel: 'Mar 21 Jul', title: 'Brooklyn', color: '#FF2D55', places: [
    { id: 'd6s1', name: 'Brooklyn Bridge', type: 'Punto de interés', time: '09:30', lat: 40.7061, lng: -73.9969, note: 'Cruzalo caminando de Manhattan a Brooklyn, temprano hay menos gente.', transit: 'Subte 4/5/6 hasta Brooklyn Bridge–City Hall.', block: 'Mañana' },
    { id: 'd6s2', name: 'DUMBO — Washington St', type: 'Punto de interés', time: '10:30', lat: 40.7033, lng: -73.9894, note: 'La foto clásica del puente de Manhattan. Caminá la zona hasta el Manhattan Bridge Lookout.', transit: 'Caminando al bajar del puente.', block: 'Mañana' },
    { id: 'd6s3', name: 'Empire Fulton Ferry Park', type: 'Parque', time: '11:15', lat: 40.7043, lng: -73.9927, note: 'El pasto entre los dos puentes, con el carrusel Jane’s.', transit: 'Caminando hacia el río.', block: 'Mañana' },
    { id: 'd6s4', name: 'Time Out Market', type: 'Comida', time: '12:30', lat: 40.7035, lng: -73.991, note: 'Patio gastronómico con rooftop en Empire Stores.', transit: 'Water St, en DUMBO.', block: 'Mañana' },
    { id: 'd6s5', name: 'Brooklyn Bridge Park', type: 'Parque', time: '14:00', lat: 40.7003, lng: -73.9967, note: 'Los muelles con el skyline de Manhattan enfrente.', transit: 'Caminando por la ribera.', block: 'Tarde' },
    { id: 'd6s6', name: 'Brooklyn Heights Promenade', type: 'Mirador', time: '15:00', lat: 40.6963, lng: -73.9967, note: 'La pasarela elevada con la mejor vista de Manhattan.', transit: 'Subiendo desde el parque, 10 min.', block: 'Tarde' },
    { id: 'd6s7', name: 'Williamsburg — Domino Park', type: 'Parque', time: '16:30', lat: 40.7143, lng: -73.9679, note: 'Ribera renovada bajo el puente de Williamsburg. Volver a Manhattan en ferry desde North Williamsburg.', transit: 'Ferry desde DUMBO o subte.', block: 'Tarde' },
  ], food: [
    { id: 'd6f1', name: "Grimaldi's Pizza", type: 'Para comer', time: 'Almuerzo', lat: 40.7025, lng: -73.9933, note: 'La pizzería a la leña de la fila eterna, bajo el puente.', transit: 'Front St, DUMBO.' },
    { id: 'd6f2', name: 'The River Café', type: 'Para comer', time: 'Cena', lat: 40.7038, lng: -73.9946, note: 'Formal, con vista al skyline (reservar).', transit: 'Water St, al pie del Brooklyn Bridge.' },
    { id: 'd6f3', name: 'Brooklyn Flea (DUMBO)', type: 'Para comer', time: 'Feria', lat: 40.7039, lng: -73.9882, note: 'Feria bajo el arco del puente de Manhattan — chequear día: suele ser solo los domingos.', transit: 'Pearl St y Anchorage Pl.' },
    { id: 'd6f4', name: "Frankel's Delicatessen", type: 'Para comer', time: 'Bagels', lat: 40.7239, lng: -73.9509, note: 'Bagels en Greenpoint, cerca de Williamsburg.', transit: 'Manhattan Ave, Greenpoint.' },
  ] },
  { n: 7, dateLabel: 'Mié 22 Jul', title: 'High Line + Chelsea + Harlem', color: '#00C7BE', places: [
    { id: 'd7s1', name: 'The Edge (Hudson Yards)', type: 'Mirador', time: '09:30', lat: 40.7539, lng: -74.0011, note: 'Mirador con piso de vidrio.', transit: 'Subte 7 hasta 34 St–Hudson Yards.', block: 'Mañana' },
    { id: 'd7s2', name: 'Vessel', type: 'Punto de interés', time: '10:15', lat: 40.7538, lng: -74.0021, note: 'La escultura panal.', transit: 'Al lado del Edge.', block: 'Mañana' },
    { id: 'd7s3', name: 'B&H Photo Video', type: 'Compras', time: '10:45', lat: 40.7532, lng: -73.9959, note: 'El mega local de tecnología y fotografía. Solo si interesa.', transit: '9th Ave y W 34 St.', block: 'Mañana', optional: true },
    { id: 'd7s4', name: 'High Line', type: 'Parque', time: '11:00', lat: 40.748, lng: -74.0048, note: 'El parque elevado sobre las vías: caminarlo hacia el sur.', transit: 'Entrada en 34 St / Hudson Yards.', block: 'Mañana' },
    { id: 'd7s5', name: 'Meatpacking District', type: 'Punto de interés', time: '12:15', lat: 40.7394, lng: -74.0059, note: 'Los adoquines y las boutiques al final de la High Line.', transit: 'Bajando de la High Line en Gansevoort St.', block: 'Mañana' },
    { id: 'd7s6', name: 'Little Island', type: 'Parque', time: '12:45', lat: 40.742, lng: -74.0106, note: 'El parque flotante sobre el Hudson.', transit: 'Caminando 5 min por el río.', block: 'Mañana' },
    { id: 'd7s7', name: 'Pier 57', type: 'Punto de interés', time: '13:30', lat: 40.7428, lng: -74.0086, note: 'Rooftop park gratuito y mercado gastronómico.', transit: 'Al lado de Little Island, entrada por W 15 St.', block: 'Mañana' },
    { id: 'd7s8', name: 'Starbucks Reserve Roastery', type: 'Punto de interés', time: '14:00', lat: 40.7417, lng: -74.0049, note: 'La tostaduría gigante de tres pisos.', transit: '9th Ave y W 15 St.', block: 'Mañana' },
    { id: 'd7s9', name: 'Chelsea Market', type: 'Comida', time: '14:15', lat: 40.7424, lng: -74.0061, note: 'Mercado gastronómico cubierto (tacos de Los Tacos No. 1).', transit: 'Enfrente del Starbucks Reserve.', block: 'Mañana' },
    { id: 'd7s10', name: 'Washington Square Park', type: 'Parque', time: '15:15', lat: 40.7308, lng: -73.9973, note: 'El arco y los músicos del Village.', transit: 'Subte A/C/E hasta W 4 St o caminando.', block: 'Tarde' },
    { id: 'd7s11', name: 'SoHo', type: 'Compras', time: '15:45', lat: 40.7233, lng: -74.003, note: 'Compras y arquitectura de hierro fundido.', transit: 'Caminando por LaGuardia Pl, 10 min.', block: 'Tarde' },
    { id: 'd7s12', name: 'Harlem — Misa Gospel', type: 'Punto de interés', time: '17:00', lat: 40.8055, lng: -73.9448, note: 'Reservada 17:00 (getyourguide) — la iglesia exacta según la reserva.', transit: 'Subte 2/3 hasta 116 o 125 St.', block: 'Tarde' },
    { id: 'd7s13', name: 'Mt Morris Park', type: 'Parque', time: '18:30', lat: 40.8046, lng: -73.9443, note: 'Las casas históricas del distrito Mount Morris y Malcolm X Blvd.', transit: 'Caminando por Malcolm X Blvd.', block: 'Tarde' },
    { id: 'd7s14', name: 'Birdland Jazz Club', type: 'Show', time: '21:00', lat: 40.7593, lng: -73.9899, note: 'Jazz en vivo (reservar). Alternativa: Village Vanguard.', transit: 'W 44 St, entre 8th y 9th Ave — cerca del hotel.', block: 'Noche' },
  ], food: [
    { id: 'd7f1', name: 'Mercado Little Spain', type: 'Para comer', time: 'Almuerzo', lat: 40.7536, lng: -74.0017, note: 'El mercado español de José Andrés en Hudson Yards.', transit: '10 Hudson Yards.' },
    { id: 'd7f2', name: 'Pastis', type: 'Para comer', time: 'Almuerzo', lat: 40.7394, lng: -74.0066, note: 'Bistró francés del Meatpacking. Alternativa: La Bonbonniere.', transit: 'Gansevoort St.' },
    { id: 'd7f3', name: 'Russ & Daughters', type: 'Para comer', time: 'Bagels', lat: 40.7226, lng: -73.988, note: 'La institución del Lower East Side, desde 1914.', transit: 'E Houston St y Orchard St.' },
    { id: 'd7f4', name: 'Popup Bagels', type: 'Para comer', time: 'Merienda', lat: 40.7278, lng: -74.0004, note: 'Bagels calientes para llevar.', transit: 'Thompson St, Greenwich Village.' },
  ] },
  { n: 8, dateLabel: 'Jue 23 Jul', title: 'SoHo + Chinatown + MoMA + Top of the Rock', color: '#5856D6', places: [
    { id: 'd8s1', name: 'SoHo — Earth Room & Broken Kilometer', type: 'Punto de interés', time: '09:30', lat: 40.725, lng: -74.0002, note: 'Dos instalaciones gratuitas de Walter De Maria (Wooster St y W Broadway) — ojo: suelen cerrar en verano. Compras: The RealReal (segunda mano).', transit: 'Subte C/E hasta Spring St.', block: 'Mañana' },
    { id: 'd8s2', name: 'NoHo', type: 'Punto de interés', time: '10:30', lat: 40.7269, lng: -73.9932, note: 'Broadway entre Houston y Astor Pl.', transit: 'Caminando por Houston, 8 min.', block: 'Mañana' },
    { id: 'd8s3', name: 'Nolita', type: 'Punto de interés', time: '11:00', lat: 40.7222, lng: -73.9957, note: 'Callecitas con boutiques y cafés.', transit: 'Bajando por Mulberry St.', block: 'Mañana' },
    { id: 'd8s4', name: 'Little Italy', type: 'Punto de interés', time: '11:30', lat: 40.7191, lng: -73.9973, note: 'Mulberry St y sus trattorias.', transit: 'Siguiendo Mulberry hacia el sur.', block: 'Mañana' },
    { id: 'd8s5', name: 'Charly García Corner', type: 'Punto de interés', time: '12:00', lat: 40.7177, lng: -74.0022, note: 'Walker St y Cortlandt Alley: la esquina de la tapa de Clics Modernos, hoy con cartel oficial.', transit: 'Caminando 8 min por Canal St.', block: 'Mañana' },
    { id: 'd8s6', name: 'Chinatown', type: 'Punto de interés', time: '12:30', lat: 40.7158, lng: -73.997, note: 'Mott St y alrededores. Hop Kee para comida china.', transit: 'Caminando por Canal / Mott St.', block: 'Mañana' },
    { id: 'd8s7', name: 'Columbus Park', type: 'Parque', time: '13:15', lat: 40.7149, lng: -73.9997, note: 'Los vecinos jugando mahjong y haciendo tai chi.', transit: 'Al final de Mott St.', block: 'Mañana' },
    { id: 'd8s8', name: 'MoMA', type: 'Museo', time: '14:30', lat: 40.7614, lng: -73.9776, note: 'Museum of Modern Art.', transit: 'Subte E/M hasta 5 Av–53 St.', block: 'Tarde' },
    { id: 'd8s9', name: 'Top of the Rock', type: 'Mirador', time: '19:30', lat: 40.7593, lng: -73.979, note: 'Atardecer sobre Manhattan (reservado 19:30).', transit: 'Caminando a Rockefeller Center.', block: 'Atardecer' },
  ], food: [
    { id: 'd8f1', name: "Katz's Delicatessen", type: 'Para comer', time: 'Almuerzo', lat: 40.7222, lng: -73.9874, note: 'El pastrami de When Harry Met Sally.', transit: 'E Houston St y Ludlow St.' },
    { id: 'd8f2', name: 'Hop Kee', type: 'Para comer', time: 'Almuerzo', lat: 40.7144, lng: -73.9985, note: 'Cantonés de sótano, clásico de Chinatown.', transit: 'Mott St.' },
    { id: 'd8f3', name: "Jack's Wife Freda", type: 'Para comer', time: 'Almuerzo', lat: 40.723, lng: -73.9967, note: 'Bistró mediterráneo, brunch famoso.', transit: 'Lafayette St, SoHo.' },
    { id: 'd8f4', name: "Eileen's Special Cheesecake", type: 'Para comer', time: 'Merienda', lat: 40.7218, lng: -73.9977, note: 'El cheesecake rival del de Junior’s.', transit: 'Cleveland Pl, Nolita.' },
    { id: 'd8f5', name: 'Hamburger America', type: 'Para comer', time: 'Almuerzo', lat: 40.7286, lng: -74.0023, note: 'Smash burgers clásicas (o Emily, la otra candidata).', transit: 'MacDougal St, SoHo.' },
    { id: 'd8f6', name: 'Levain Bakery (NoHo)', type: 'Para comer', time: 'Merienda', lat: 40.7256, lng: -73.9944, note: 'Las cookies gigantes.', transit: 'Lafayette St, NoHo.' },
    { id: 'd8f7', name: 'Carbone', type: 'Para comer', time: 'Cena', lat: 40.7283, lng: -74.0003, note: 'Ítalo-americano famoso — reserva muy difícil.', transit: 'Thompson St, Greenwich Village.' },
    { id: 'd8f8', name: 'Torrisi', type: 'Para comer', time: 'Cena', lat: 40.724, lng: -73.9956, note: 'Italiano fino de Major Food Group.', transit: 'Mulberry St, Nolita.' },
    { id: 'd8f9', name: 'Balthazar', type: 'Para comer', time: 'Cena', lat: 40.7226, lng: -73.9982, note: 'Brasserie francesa icónica de SoHo.', transit: 'Spring St y Crosby St.' },
    { id: 'd8f10', name: 'Estela', type: 'Para comer', time: 'Cena', lat: 40.7245, lng: -73.9945, note: 'Cocina de autor sobre Houston St.', transit: 'E Houston St, Nolita.' },
    { id: 'd8f11', name: 'Wildair', type: 'Para comer', time: 'Cena', lat: 40.7202, lng: -73.9887, note: 'Vinos naturales y platos para compartir.', transit: 'Orchard St, Lower East Side.' },
    { id: 'd8f12', name: 'Le French Diner', type: 'Para comer', time: 'Cena', lat: 40.7216, lng: -73.988, note: 'Francés diminuto del Lower East Side.', transit: 'Orchard St.' },
    { id: 'd8f13', name: '230 Fifth Rooftop', type: 'Para comer', time: 'Bar', lat: 40.744, lng: -73.988, note: 'Terraza con vista al Empire State.', transit: '5th Ave y W 27 St.' },
    { id: 'd8f14', name: 'Nubeluz', type: 'Para comer', time: 'Bar', lat: 40.7452, lng: -73.9887, note: 'Rooftop del Ritz-Carlton NoMad (reservar).', transit: 'W 28 St y Broadway.' },
    { id: 'd8f15', name: 'Double Chicken Please', type: 'Para comer', time: 'Cócteles', lat: 40.7196, lng: -73.9905, note: 'Uno de los mejores bares de cócteles del mundo.', transit: 'Allen St, Lower East Side.' },
    { id: 'd8f16', name: 'Back Room', type: 'Para comer', time: 'Cócteles', lat: 40.7185, lng: -73.9873, note: 'Speakeasy de la época de la ley seca.', transit: 'Norfolk St, Lower East Side.' },
  ] },
  { n: 9, dateLabel: 'Vie 24 Jul', title: 'Check-out → Miami', color: '#A2845E', places: [
    { id: 'd9s1', name: 'Hotel — Check-out', type: 'Punto de interés', time: '12:00', lat: 40.7648, lng: -73.9827, note: 'Check-out 12:00 y última vuelta por el barrio.', transit: 'En el hotel (1717 Broadway).' },
    { id: 'd9s2', name: 'JFK Airport', type: 'Transporte', time: '17:00', lat: 40.6413, lng: -73.7781, note: 'Vuelo DELTA 1414 a Fort Lauderdale, 19:55. En Miami: auto de Sixt + Marseilles Hotel.', transit: 'AirTrain + subte, o taxi.' },
  ] },
  { n: 10, dateLabel: 'Sin día asignado', title: 'Si sobra tiempo', color: '#8E8E93', extra: true, places: [
    { id: 'd10s1', name: 'Woodbury Common Outlets', type: 'Compras', time: 'Día entero', lat: 41.3157, lng: -74.1263, note: 'Outlets premium a ~1 hora de la ciudad.', transit: 'Bus Shortline desde Port Authority, o auto.' },
    { id: 'd10s2', name: 'Los Hamptons', type: 'Parque', time: 'Día entero', lat: 40.8843, lng: -72.3895, note: 'Día de playa en Long Island. Alquiler Hertz por día cerca del hotel.', transit: 'En auto ~2 h, o LIRR desde Penn Station.' },
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
      const base = { day: d.n, color: d.color, dateLabel: d.dateLabel, dayTitle: d.title, extra: d.extra };
      d.places.forEach((p, i) => {
        _all!.push({ ...p, ...base, stop: i + 1, kind: 'stop' });
      });
      (d.food ?? []).forEach((p) => {
        _all!.push({ ...p, ...base, stop: 0, kind: 'food' });
      });
    }
  }
  return _all;
}

export const stopById = (id: string): Stop | undefined => allStops().find((s) => s.id === id);
