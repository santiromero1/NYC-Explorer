# 08 · Feature Spec — BARRIOS

> Especificación de la sección **Barrios**: el contenido editorial **completo** de los 13 barrios de
> Manhattan (nombre, vibe, descripción, 4-6 spots, tip práctico y color), y el comportamiento del
> panel de información en mobile y desktop, incluyendo la conexión con el itinerario. Se puede leer solo.

Contexto: en esta sección el usuario ve Manhattan dividido en zonas de color; al tocar una, se abre un
panel con la personalidad del barrio y qué visitar. El objetivo es que alguien que nunca fue a NY
entienda qué es cada zona y en qué se diferencian.

---

## 1. Contenido editorial de los 13 barrios

> Todo el contenido en español; los nombres propios de lugares se dejan en inglés (como se los conoce
> en NY). Los colores corresponden al [Design Spec §2.4](../03_DESIGN_SPEC.md).

---

### 1. Financial District (FiDi) · `#4E7FD4`
**Vibe:** El origen de la ciudad: rascacielos, historia y Wall Street en la punta sur.

**Descripción:** Es donde nació Nueva York y donde late su corazón financiero. Cañones de edificios
altísimos entre calles angostas y torcidas (acá la grilla todavía no existe), que de día hierven de
oficinistas y de noche quedan sorprendentemente tranquilos. Combina lo más nuevo (One World Trade) con
lo más antiguo de la isla.

**Spots:**
- **One World Observatory** — El mirador en el edificio más alto del hemisferio; vistas de 360°.
- **9/11 Memorial & Museum** — Las dos fuentes en las huellas de las Torres Gemelas; sobrio y potente.
- **Charging Bull & Fearless Girl** — El toro de bronce y la nena; la foto clásica de Wall Street.
- **Stone Street** — Callecita empedrada peatonal con bares; la cara relajada del barrio.
- **Staten Island Ferry** — El ferry gratis que pasa al lado de la Estatua de la Libertad.
- **Battery Park** — Parque en la punta sur, mirando la bahía y la Estatua.

**Tip:** Ideal para arrancar temprano un día; tomá el Staten Island Ferry (gratis) para ver la Estatua
de la Libertad sin pagar el tour.

---

### 2. TriBeCa · `#6C5CE0`
**Vibe:** Lofts industriales, calles adoquinadas y lujo discreto.

**Descripción:** *Triangle Below Canal.* Antiguos depósitos convertidos en lofts carísimos donde viven
celebridades que buscan pasar desapercibidas. Es tranquilo, elegante y menos turístico que sus vecinos,
con excelentes restaurantes y una escala urbana más humana.

**Spots:**
- **Greenwich Street** — Calles adoquinadas con edificios de hierro fundido; puro encanto.
- **Tribeca Film Festival** — El festival fundado por De Niro (según la época del año).
- **Washington Market Park** — Un parquecito de barrio, verde y tranquilo.
- **Restaurantes de autor** — Zona fuerte de gastronomía top (reservar con tiempo).
- **The Odeon** — Brasserie ochentosa icónica, un clásico del barrio.

**Tip:** No hay "atracciones" fuertes: vení a caminar sin rumbo y comer bien. Perfecto para un almuerzo
tranquilo entre downtown y SoHo.

---

### 3. SoHo · `#A44FD0`
**Vibe:** Compras, arte y la mayor concentración de arquitectura cast-iron del mundo.

**Descripción:** *South of Houston.* Calles adoquinadas flanqueadas por edificios de hierro fundido con
escaleras de incendio, hoy tomadas por locales de diseño, marcas y galerías. Fue el barrio de los
artistas en los 70; ahora es un shopping a cielo abierto con estilo. Se camina y se mira todo el tiempo.

**Spots:**
- **Broadway (tramo SoHo)** — La calle comercial principal, de marcas masivas a boutiques.
- **Greene & Mercer Street** — Las cuadras más lindas de cast-iron y adoquines.
- **The Little Singer Building** — Joya de arquitectura de principios del siglo XX.
- **Galerías de arte** — Repartidas por el barrio; herencia de su pasado bohemio.
- **Cafés y brunch** — Zona ideal para parar a comer entre vidriera y vidriera.

**Tip:** Andá entre semana o temprano el finde; los sábados a la tarde las veredas se llenan. Cuidado
con los adoquines si vas con calzado incómodo.

---

### 4. Greenwich Village · `#2BB4A6`
**Vibe:** Bohemio, arbolado y de calles torcidas que rompen la grilla.

**Descripción:** El "Village" es el alma romántica de Manhattan: casas bajas de ladrillo, calles con
nombre (no número) que se cruzan en ángulos raros, y una historia de poetas, músicos y contracultura.
Incluye el West Village, aún más pintoresco y residencial. Es de los mejores lugares para simplemente
pasear.

**Spots:**
- **Washington Square Park** — El arco, la fuente, músicos callejeros y ajedrez; el corazón del barrio.
- **Bleecker Street** — Cafés, tiendas y locales históricos de música folk.
- **Stonewall Inn** — Cuna del movimiento LGBTQ+; monumento nacional.
- **Comedy Cellar** — Club de comedia legendario (reservar).
- **West Village (calles residenciales)** — Perry, Bedford, Grove: las cuadras más fotogénicas.
- **Friends building** — El edificio de la serie, en Grove & Bedford.

**Tip:** Es el barrio para perderse a propósito. Acá la grilla no aplica, así que dejá el mapa y caminá;
al atardecer es mágico.

---

### 5. East Village · `#E87B3C`
**Vibe:** Alternativo, joven y con historia punk; el barrio que nunca se aburguesó del todo.

**Descripción:** Al este del Village, más crudo y energético. Fue epicentro del punk y sigue teniendo
bares dive, tiendas de vinilos, tatuajes y una vida nocturna intensa. Muy multicultural, con fuerte
presencia de comida japonesa, ucraniana y de todo el mundo. Barato (para NY) y auténtico.

**Spots:**
- **St. Marks Place** — La cuadra más icónica: tatuajes, vinilos, comida y contracultura.
- **Tompkins Square Park** — Plaza histórica de protestas y conciertos.
- **"Little Tokyo" (E 9th–10th)** — Alta concentración de ramen, izakayas y tiendas japonesas.
- **McSorley's Old Ale House** — Uno de los bares más viejos de la ciudad (1854).
- **Bares y música en vivo** — La noche del barrio; algo para cada gusto.

**Tip:** Es un barrio de noche. Vení a cenar algo étnico y quedate a tomar algo; para ramen, evitá la
hora pico (colas largas en los más famosos).

---

### 6. Lower East Side (LES) · `#D64F57`
**Vibe:** Inmigrante e histórico de día, nocturno y de moda de noche.

**Descripción:** El barrio donde desembarcaron oleadas de inmigrantes (judíos, italianos, chinos) y que
conserva ese ADN en sus delis, sinagogas y museos. Hoy convive con galerías, bares de moda y una escena
nocturna fuerte. Un choque delicioso entre lo viejo y lo cool.

**Spots:**
- **Katz's Delicatessen** — El pastrami sandwich más famoso del mundo (y la escena de *Cuando Harry
  conoció a Sally*).
- **Tenement Museum** — Museo en un conventillo real; cuenta la vida de los inmigrantes.
- **Essex Market** — Mercado gastronómico cubierto, ideal para picar.
- **The New Museum** — Arte contemporáneo en un edificio llamativo sobre Bowery.
- **Bares de coctelería** — El barrio pisa fuerte en la noche.

**Tip:** Almorzá en Katz's (llegá temprano, no pierdas el ticket que te dan al entrar) y bajá la comida
caminando por Orchard Street mirando vidrieras.

---

### 7. Chelsea · `#47AEE0`
**Vibe:** Galerías de arte, el High Line y un mercado gourmet en pleno auge.

**Descripción:** Antiguo distrito industrial del oeste reconvertido en la meca del arte contemporáneo,
con cientos de galerías. Lo cruza el High Line, un parque elevado sobre vías de tren en desuso. Barrio
moderno, con mucho movimiento gastronómico y una vida gay histórica y vibrante.

**Spots:**
- **The High Line** — Parque lineal elevado; se camina entre plantas, arte y vistas del río.
- **Chelsea Market** — Mercado gastronómico gigante en una ex fábrica de galletitas Oreo.
- **Galerías (W 20s–W 25s)** — La mayor concentración de galerías de arte de la ciudad, gratis.
- **Little Island** — Parque-isla flotante sobre el Hudson, futurista y gratis.
- **The Vessel / Hudson Yards** — El complejo nuevo y su estructura panal (extremo norte).

**Tip:** Combiná High Line + Chelsea Market en un mismo recorrido: bajás del parque directo al mercado
para comer. Andá el High Line temprano o al atardecer para esquivar el gentío.

---

### 8. Flatiron / Union Square · `#66C05A`
**Vibe:** El edificio triangular más famoso, plazas con vida y mercado de productores.

**Descripción:** El punto donde Broadway cruza en diagonal y crea el icónico Flatiron Building, con
forma de plancha. Alrededor, un barrio de oficinas, comercios y dos plazas muy vivas —Union Square y
Madison Square— con ferias, food halls y mucho movimiento peatonal.

**Spots:**
- **Flatiron Building** — El rascacielos triangular de 1902; la foto obligada.
- **Union Square** — Plaza con el Greenmarket (mercado de productores) los días de feria.
- **Madison Square Park** — Parque verde y el Shake Shack original.
- **Eataly** — Templo italiano de comida y productos gourmet.
- **Strand Bookstore** — Librería mítica, "18 millas de libros" (borde con el Village).

**Tip:** Si hay Greenmarket en Union Square (mié/vie/sáb), pasá a probar productos locales. El Shake
Shack original está en Madison Square Park: ícono de la hamburguesa neoyorquina.

---

### 9. Midtown · `#E86AA6`
**Vibe:** El Nueva York de las postales: rascacielos, Times Square y luces por todos lados.

**Descripción:** El centro turístico y comercial de Manhattan, denso e intenso. Acá están los íconos
que todo el mundo reconoce: Times Square, el Empire State, los teatros de Broadway, la Quinta Avenida.
Caótico, luminoso y agotador, pero de visita obligada al menos una vez.

**Spots:**
- **Times Square** — El cruce iluminado más famoso del planeta; abrumador, ir de noche.
- **Empire State Building** — El rascacielos art déco y su mirador clásico.
- **Rockefeller Center & Top of the Rock** — Mirador con la mejor vista del Empire y Central Park.
- **Bryant Park** — Oasis verde detrás de la Biblioteca Pública; pista de patinaje en invierno.
- **Broadway (teatros)** — El distrito de los musicales; comprar entradas con anticipación.
- **Grand Central Terminal** — Estación monumental con su techo estrellado.

**Tip:** Times Square se ve de noche (las luces son el show) pero es un caos de gente: no comas ahí y
cuidá tus cosas. Para vistas, Top of the Rock le gana al Empire porque *ves* el Empire y el parque.

---

### 10. Upper West Side · `#8DBF3F`
**Vibe:** Residencial, culto y familiar, entre Central Park y el río.

**Descripción:** Barrio elegante y tranquilo al oeste del parque, de edificios señoriales, familias y
vida cultural. Hogar de instituciones enormes como el Lincoln Center y el Museo de Historia Natural.
Es el "Nueva York para vivir", verde y con menos frenesí que Midtown.

**Spots:**
- **American Museum of Natural History** — El museo de los dinosaurios y el planetario (el de *Una noche
  en el museo*).
- **Lincoln Center** — El gran complejo de ópera, ballet y música clásica.
- **Central Park (lado oeste)** — Acceso directo al parque; Strawberry Fields (homenaje a Lennon).
- **The Dakota** — El edificio donde vivió (y murió) John Lennon.
- **Zabar's** — Deli-mercado gourmet institución del barrio.

**Tip:** Un día ideal: museo por la mañana y cruzar a Central Park por la tarde. Strawberry Fields queda
justo enfrente del Dakota, a pasos del parque.

---

### 11. Upper East Side · `#C79A3E`
**Vibe:** Elegancia clásica, la Milla de los Museos y viejo dinero.

**Descripción:** El barrio más aristocrático de Manhattan, de edificios señoriales, boutiques de lujo y
la concentración de museos más importante de la ciudad, la Museum Mile, sobre la Quinta Avenida. Sobrio,
prolijo y caro; el Nueva York de las películas de la alta sociedad.

**Spots:**
- **The Met (Metropolitan Museum of Art)** — Uno de los mejores museos del mundo; se necesita medio día.
- **Guggenheim** — El museo en espiral de Frank Lloyd Wright, obra de arte en sí mismo.
- **Museum Mile (5th Ave)** — El Met, Guggenheim, Neue Galerie y más, en fila.
- **Madison Avenue** — La calle de las boutiques de lujo.
- **Central Park (lado este)** — El reservorio y sus senderos para correr.

**Tip:** El Met es enorme: elegí 2-3 alas y no intentes verlo todo. Combinalo con una caminata por
Central Park, que tenés al lado.

---

### 12. Central Park · `#3E9D57`
**Vibe:** El pulmón verde de la ciudad; 340 hectáreas para respirar entre rascacielos.

**Descripción:** El parque más famoso del mundo, un rectángulo gigante de bosques, lagos, prados y
senderos en pleno centro de Manhattan. Diseñado en el siglo XIX, es el escape de los neoyorquinos y el
escenario de mil películas. Se puede recorrer a pie, en bici o en bote.

**Spots:**
- **Bethesda Terrace & Fountain** — La terraza y fuente más icónicas del parque.
- **Bow Bridge** — El puente romántico sobre el lago; foto clásica.
- **Bethesda / The Lake** — Alquiler de botes de remo en Loeb Boathouse.
- **Belvedere Castle** — Castillito con vistas al parque.
- **The Mall & Literary Walk** — La alameda arbolada de olmos.
- **Sheep Meadow** — El prado para tirarse al sol con vista al skyline.

**Tip:** Entrá por la zona sur (Midtown) o desde el UWS/UES según tu día. Con poco tiempo, el circuito
Bethesda → Bow Bridge → The Mall concentra lo más lindo en una caminata corta.

---

### 13. Harlem · `#E0553B`
**Vibe:** Corazón de la cultura afroamericana: música, soul food e historia viva.

**Descripción:** Al norte del parque, Harlem es cuna del jazz, el gospel y el Renacimiento de Harlem.
Barrio con identidad fuerte, brownstones históricos, iglesias con coros los domingos y una escena
gastronómica de soul food auténtica. Menos turístico, más real.

**Spots:**
- **Apollo Theater** — El teatro legendario donde debutaron leyendas del soul y el jazz.
- **Coros de gospel (domingos)** — Misas con música en vivo (ir con respeto, algunas requieren reserva).
- **Sylvia's** — Restaurante icónico de soul food.
- **Marcus Garvey Park** — Parque histórico del barrio.
- **125th Street** — La arteria comercial y cultural principal.

**Tip:** El plan estrella es un domingo de gospel + brunch de soul food. Averiguá horarios de las
iglesias con anticipación; muchas piden reserva o tienen cupos para visitantes.

---

## 2. Comportamiento del panel de info

### Mobile (390px) — bottom sheet
- Al tocar una zona, sube un **bottom sheet** desde abajo (Design Spec §8.2), snap inicial `half`.
- **Contenido, en orden:** handle · nombre del barrio (con su color) · vibe · divisor · descripción ·
  lista de spots · tip (con ícono 💡) · badge de conexión con el itinerario (si aplica, §4).
- **Altura/scroll:** en `half` se ve el encabezado + primeros spots; el usuario sube a `full` (90%)
  para leer todo con **scroll interno**. El mapa nunca se tapa del todo (queda una franja arriba).
- **Gestos para cerrar:** swipe-down sobre el handle, tap en el backdrop, o botón X. Al cerrar, la zona
  vuelve a su estado normal (deja de estar seleccionada).
- **Color:** el nombre y una barra/acento del panel usan el `color` del barrio para reforzar identidad.

### Desktop (≥1280px) — panel lateral
- El contenido aparece en el **sidebar izquierdo** (no como sheet). El mapa, a la derecha, resalta la
  zona seleccionada. No hay handle ni gestos de arrastre; se cierra con X o seleccionando otra zona.
- Tablet (768px): puede usar un **panel lateral derecho** (~360px) que no tapa el mapa; comportamiento
  intermedio (ver Design Spec §6).

---

## 3. Qué pasa al tocar otro barrio con uno abierto
- El panel **no se cierra y se reabre**: reemplaza su contenido por el nuevo barrio con una transición
  suave (fade/slide de contenido, `duration-base`).
- La selección visual del mapa cambia: la zona anterior vuelve a normal, la nueva se resalta y las demás
  se atenúan (Design Spec §2.4).
- El snap del sheet se mantiene (si estaba en `full`, sigue en `full`).

## 4. Conexión con el itinerario
- Si el itinerario tiene días cuya **zona principal** (`Day.neighborhoodId`) es ese barrio, el panel
  muestra un **badge**: *"Tenés N día(s) en esta zona"* (Design Spec §8.4), en `color-accent-subtle`.
- `[v2]` el badge es accionable: lleva al día correspondiente en la sección Itinerario.
- El conteo se calcula en runtime desde el store (dato derivado; ver [ARCHITECTURE §3](../05_TECHNICAL_ARCHITECTURE.md)).

## 5. Animaciones y transiciones
- **Apertura del sheet:** slide-up `duration-base` (220ms), easing de entrada.
- **Resalte de zona:** transición de opacidad/glow `duration-base`.
- **Cambio de contenido entre barrios:** crossfade del contenido del panel.
- **Cierre:** slide-down + des-resalte.
- Todo respeta `prefers-reduced-motion` (reduce a fades cortos / sin animación).

---

**Anterior:** [MAP_CORE.md](MAP_CORE.md) · **Siguiente:** [GRID.md](GRID.md)
