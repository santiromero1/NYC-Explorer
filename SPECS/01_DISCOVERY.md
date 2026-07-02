# 01 · Discovery — NYC Explorer

> Documento de descubrimiento. Define con precisión **qué problema** resolvemos, **para quién**,
> qué oportunidades vimos y qué **decisiones de producto** ya tomamos y por qué. Es la base
> conceptual sobre la que se apoyan el PRD y el diseño. Se puede leer solo.

---

## 1. Problem statement

Una familia viaja a Nueva York por primera vez. Para organizarse arma un **itinerario en un PDF
o documento de texto**: una lista de días, cada uno con lugares, notas sueltas y a veces horarios.
Es el método clásico y funciona a medias. Tiene tres problemas concretos:

**Problema 1 — El plan no es geográfico.**
El PDF dice "Día 3: MoMA, luego Central Park, luego Times Square", pero no muestra *dónde* queda
cada cosa ni si el orden tiene sentido caminando. La familia termina abriendo Google Maps aparte,
buscando cada lugar uno por uno, y perdiendo la noción del conjunto del día. No hay una sola vista
que diga "esto es tu día 3, y así se ve en el mapa".

**Problema 2 — No se entiende la ciudad.**
Nueva York confunde al visitante primerizo de dos maneras:
- **Los barrios** tienen personalidades muy distintas (SoHo no es el Village, que no es Harlem) y
  saber en qué zona estás cambia qué esperás encontrar. El PDF no lo explica.
- **El sistema de calles** es una grilla numerada con reglas propias (streets vs. avenues,
  uptown/downtown, Broadway en diagonal, la 5th como divisoria, el caos debajo de la 14th). Una
  dirección como "corner of W 23rd St & 7th Ave" es indescifrable para quien no entiende la lógica.

**Problema 3 — Editar en el momento es incómodo.**
Ya en el viaje, cansados y caminando, reordenar un día o mover un lugar en un PDF desde el celular
es tedioso. El plan queda congelado y la familia improvisa por fuera, perdiendo el registro.

### Por qué las herramientas existentes no alcanzan

| Herramienta | Qué hace bien | Por qué no alcanza |
|---|---|---|
| **PDF / Google Docs** | Portable, editable en casa, familiar | No es geográfico, no enseña la ciudad, incómodo de editar en el celular |
| **Google Maps** | Ubicación precisa, navegación | No explica *cómo está organizada* la ciudad; "guardar lugares" es una lista plana sin estructura de días ni contexto de barrio |
| **Guías online / blogs** | Contenido rico de barrios | Estáticas, no se conectan con *tu* itinerario ni con un mapa propio |
| **Apps de viaje (Wanderlog, TripIt…)** | Itinerarios estructurados | Sobran features, piden cuenta, son genéricas para cualquier ciudad y no enseñan la grilla ni la personalidad de los barrios de NY |

NYC Explorer no compite con ninguna a full: toma **la porción exacta** que a esta familia le falta
—un itinerario visual sobre un mapa propio + entender la ciudad— y lo hace simple.

---

## 2. User persona principal

### "La familia" — viajeros primerizos a NYC

> No es una persona sola: es un grupo familiar que comparte un mismo plan. El diseño asume un
> usuario que consulta desde el celular, mayormente el organizador del viaje, pero pensado para
> que cualquiera de la familia lo entienda.

**Contexto**
- Viajan a Nueva York por primera (o de las primeras) vez.
- Arman el itinerario **antes** de viajar, con calma, desde casa.
- Durante el viaje lo consultan **en el celular**, caminando, con posible mala señal en el subte
  o roaming limitado.
- No son técnicos; esperan que la app sea obvia, sin manual.
- Español como idioma; el destino y los nombres de lugares están en inglés.

**Objetivos (jobs to be done)**
1. Tener el plan de cada día claro y a mano.
2. Ver en un mapa dónde queda cada lugar y cómo se agrupan por día.
3. Entender la ciudad lo suficiente para orientarse solos (leer una dirección, saber en qué barrio están).
4. Poder ajustar el plan sobre la marcha sin romper nada.
5. No depender de tener buena conexión para ver su itinerario.

**Frustraciones actuales**
- "Tengo el plan en un PDF pero no sé si el día 3 me hace cruzar la ciudad tres veces."
- "No entiendo las direcciones de acá, me pierdo con los números."
- "Guardé un montón de pins en Google Maps pero es un desorden, no sé cuáles son de qué día."
- "Quiero cambiar algo del plan desde el celu y es un bajón editar el documento."
- "No sé bien qué onda tiene cada barrio ni cuál me conviene visitar."

**Cómo mide el éxito la persona**
- Abre la app en vez del PDF durante el viaje.
- Se orienta en la ciudad con más confianza.
- El plan sigue estando ahí y actualizado hasta el final del viaje.

---

## 3. Oportunidades identificadas

1. **Unir plan + mapa en una sola vista.** El diferencial más fuerte: ver el itinerario
   *geográficamente*, no como lista. Cada día como un conjunto de pins de un color sobre el mapa.
2. **Enseñar la ciudad, no solo ubicarla.** El contenido de barrios y la explicación de la grilla
   convierten la app en algo que Google Maps no es: una herramienta para *comprender* NYC.
3. **Dos lentes del mismo mapa.** El mapa esquemático ayuda a entender la estructura sin ruido; el
   real ayuda a ubicarse con precisión. Alternar entre ambos cubre las dos necesidades sin elegir una.
4. **Mobile-first real y offline.** Al ser para usar caminando, priorizar el celular y que funcione
   sin señal es una ventaja concreta sobre un PDF en la nube o una web pesada.
5. **Cero fricción de entrada.** Sin login, sin backend, sin onboarding: se abre y ya sirve. Encaja
   perfecto con que es de uso personal.

---

## 4. Decisiones de producto ya tomadas (y por qué)

| Decisión | Motivo |
|---|---|
| **Foco solo en Manhattan** | Es donde la familia va a pasar la mayoría del tiempo y donde la grilla y los barrios cuentan la historia más clara. Ampliar diluye el esfuerzo. |
| **Sin autenticación ni backend en el MVP** | Es personal. `localStorage` alcanza y elimina toda la complejidad de cuentas, servidores y privacidad. |
| **Itinerario editable como feature central** | Es lo que reemplaza al PDF; el resto (barrios, grid) es soporte para entender el plan. |
| **Dos modos de mapa** | Responden a dos necesidades reales (entender vs. ubicar). Ninguno solo alcanza. |
| **Contenido de barrios y grid estático** | No hace falta que sea dinámico; los datos de la ciudad casi no cambian. Simplifica todo. |
| **Español** | La app es para la familia; el contenido y la UI van en su idioma. |
| **Mobile-first + PWA instalable** | Se usa caminando, desde el celular; instalarla como app la hace sentir nativa y accesible offline. |
| **Deploy en Vercel** | Deploy estático trivial, gratis, con preview por commit y buen soporte PWA. |
| **Diseño cuidado (dark, amarillo taxi)** | Es un requisito explícito: que sea lindo de usar. El deleite importa aunque sea personal. |

### `[DECISIÓN PENDIENTE]` a resolver en specs posteriores
- **Modo de mapa por defecto** al abrir la app (esquemático vs. real) — se decide en
  [04_UX_FLOWS.md](04_UX_FLOWS.md) y [08_FEATURE_SPECS/MAP_CORE.md](08_FEATURE_SPECS/MAP_CORE.md).
- **Cómo se agrega un pin** (tap en el mapa / búsqueda / ambos) — se decide en
  [08_FEATURE_SPECS/ITINERARY.md](08_FEATURE_SPECS/ITINERARY.md).

---

## 5. Principios de diseño del producto

Guían todas las decisiones posteriores. Ante una duda, ganan estos principios:

1. **Simple antes que completo.** Es una app personal; cada feature tiene que ganarse su lugar.
2. **Geográfico antes que textual.** Cuando se pueda mostrar algo en el mapa, se muestra en el mapa.
3. **Mobile primero, siempre.** Se diseña para 390px y después se adapta a desktop.
4. **Funciona sin señal.** El itinerario y el mapa esquemático nunca dependen de la red.
5. **Cero fricción.** Sin login, sin pasos previos; se abre y sirve.
6. **Lindo importa.** El cuidado visual es parte del producto, no un extra.

---

**Anterior:** [00_PROJECT_OVERVIEW.md](00_PROJECT_OVERVIEW.md) · **Siguiente:** [02_PRD.md](02_PRD.md)
