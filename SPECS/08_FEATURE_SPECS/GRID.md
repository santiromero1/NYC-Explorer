# 08 · Feature Spec — GRID

> Especificación de la sección **Calles y Grid**: la lista de calles y avenidas a mostrar (con su
> posición en el SVG y su posición geográfica real), cómo se representa Broadway en diagonal, el
> contenido completo del panel educativo, el comportamiento en mobile y el overlay sobre el mapa real.
> Se puede leer solo.

Contexto: el sistema de grilla de Manhattan desorienta a los visitantes. Esta sección lo explica
visualmente (líneas sobre el mapa) y con texto (panel educativo), para que después el usuario pueda
leer cualquier dirección de NY y ubicarse.

Referencias de coordenadas: el SVG usa `viewBox 0 0 400 900` (norte arriba, `y` chico = norte). La
proyección geo↔SVG y los bounds están en [MAP_CORE §1 y §7](MAP_CORE.md).

---

## 1. Calles (streets) a mostrar

Las streets corren **este-oeste** (crosstown). El número **sube hacia el norte** (`y` decreciente en
el SVG). Se muestran como líneas horizontales con etiqueta a la izquierda. Valores SVG aproximados
(ajustables); `geoLat` es la latitud real aproximada.

| Calle | number | svgY | geoLat | Importancia |
|---|---|---|---|---|
| Houston St (límite de la grilla) | 0* | 660 | 40.726 | key |
| 14th St | 14 | 560 | 40.737 | key |
| 23rd St | 23 | 500 | 40.744 | key |
| 34th St | 34 | 430 | 40.750 | key |
| 42nd St | 42 | 380 | 40.756 | key |
| 57th St | 57 | 300 | 40.765 | key |
| 59th St (borde sur de Central Park) | 59 | 290 | 40.767 | key |
| 72nd St | 72 | 235 | 40.778 | secondary |
| 86th St | 86 | 175 | 40.785 | secondary |
| 96th St | 96 | 140 | 40.792 | secondary |
| 110th St (borde norte de Central Park) | 110 | 95 | 40.800 | key |
| 125th St (Harlem) | 125 | 55 | 40.810 | key |

\* Houston St no es numerada pero es la frontera clave: **debajo de ella la grilla desaparece**. Se
muestra etiquetada como referencia del "fin de la grilla".

Regla de visibilidad: en zoom bajo solo se dibujan las `key`; al acercar aparecen las `secondary`
(declutter, ver [MAP_CORE §3](MAP_CORE.md)).

---

## 2. Avenidas a mostrar

Las avenidas corren **norte-sur**. Se muestran como líneas verticales con etiqueta arriba. `geoLng` es
la longitud real aproximada. De este (derecha) a oeste (izquierda):

| Avenida | svgX | geoLng | Importancia | Nota |
|---|---|---|---|---|
| 1st Ave | 320 | -73.972 | secondary | Extremo este |
| 3rd Ave | 295 | -73.978 | secondary | |
| Lexington Ave | 280 | -73.981 | secondary | |
| Park Ave | 265 | -73.983 | key | Ancha, con cantero central |
| Madison Ave | 250 | -73.985 | secondary | |
| **5th Ave** | 230 | -73.990 | **key** | **Divide East / West** (ver §4 y panel) |
| 6th Ave (Ave of the Americas) | 205 | -73.995 | secondary | |
| 7th Ave | 185 | -73.998 | key | Cruza Times Square |
| 8th Ave | 165 | -74.001 | secondary | |
| Broadway | (diagonal) | (diagonal) | key | Excepción, ver §3 |
| Columbus / 9th Ave | 145 | -74.004 | secondary | Cambia de nombre según zona |
| Amsterdam / 10th Ave | 120 | -74.008 | secondary | |
| West End / 11th Ave | 100 | -74.011 | secondary | Extremo oeste |

Nota: al sur de la 8th aproximadamente, y en el Village/Downtown, la numeración de avenidas se altera
(hay Aves A, B, C, D en el East Village). Eso se explica en el panel, no se dibuja en detalle en MVP.

---

## 3. Broadway (la diagonal)

Broadway es **la excepción**: no sigue la grilla, cruza la isla en diagonal de noroeste a sureste,
generando plazas donde corta las avenidas (Times Square en la 7th, Herald Square en la 6th, Union
Square, Madison Square/Flatiron en la 5th).

- **En el SVG:** se dibuja como una **polilínea** (`BroadwayLine.svgPath`) que baja en diagonal
  cruzando el ancho de la isla, con quiebres suaves en los puntos de las plazas. Trazo distintivo
  (color de acento tenue o línea punteada/gruesa) y etiqueta "Broadway" repetida a lo largo.
- **En el mapa real:** se dibuja como capa `line` desde `BroadwayLine.geoPath` (polilínea lng/lat que
  sigue el trazado real de Broadway), resaltada por encima del resto del grid.
- **Puntos notables a marcar** (etiquetas sobre la diagonal): Times Square (~42nd & 7th), Herald Square
  (~34th & 6th), Flatiron/Madison Sq (~23rd & 5th), Union Square (~14th). Estos anclan la explicación
  de "por qué hay plazas triangulares".

```
   SVG (esquemático) — Broadway en diagonal:
     NORTE
      \
       \____ (Columbus Circle, ~59th)
        \
         \  Times Square (~42nd & 7th)
          \
           \ Herald Sq (~34th & 6th)
            \
             \ Flatiron (~23rd & 5th)
              \
               \ Union Sq (~14th)
                \____ sigue hacia downtown
     SUR
```

---

## 4. Contenido completo del panel educativo

Cada concepto es un `GridConcept` (título + explicación + ejemplo opcional; ver
[DATA_MODEL §3](../06_DATA_MODEL.md)). Texto final en español, listo para usar:

**1. Qué es una Street (calle)**
Las *streets* son las calles numeradas que cruzan la isla de **este a oeste** (de río a río). Su
número **crece hacia el norte**: la 42nd St está más al norte que la 23rd St. Cuanto más alto el
número, más "arriba" en el mapa.
*Ejemplo:* "42nd Street" queda al norte de "34th Street".

**2. Qué es una Avenue (avenida)**
Las *avenues* son las grandes arterias que recorren la isla de **norte a sur** (a lo largo). Están
numeradas de este a oeste: la 1st Ave está al este, la 11th Ave al oeste. Son más anchas y largas que
las streets.
*Ejemplo:* "5th Avenue" corre de punta a punta de la isla, de norte a sur.

**3. Uptown y Downtown**
En Nueva York no se dice "norte/sur", se dice **uptown** (hacia el norte, números que suben) y
**downtown** (hacia el sur, números que bajan). Si vas del 20 al 50, vas *uptown*; del 50 al 20,
*downtown*. Los subtes y la gente hablan así todo el tiempo.
*Ejemplo:* "El museo está uptown" = está hacia el norte.

**4. Crosstown**
Moverse de **este a oeste** (o al revés), o sea a lo ancho de la isla, es ir *crosstown*. Es el
movimiento perpendicular a uptown/downtown. Suele ser el trayecto más lento (menos subtes crosstown).
*Ejemplo:* "Un bus crosstown" cruza la isla de lado a lado.

**5. La 5th Avenue divide Este y Oeste**
La **Quinta Avenida** es la línea que parte la isla en **East Side** y **West Side**. Por eso las
direcciones llevan "E" o "W": *West 42nd St* está al oeste de la 5th; *East 42nd St*, al este. La
numeración de las casas empieza en 1 sobre la 5th y crece hacia cada lado.
*Ejemplo:* "W 23rd St" está del lado oeste; "E 23rd St", del este.

**6. Cómo leer una dirección**
Una dirección típica cruza una **street** con una **avenue**. "W 23rd St & 7th Ave" significa: la calle
23, del lado oeste, a la altura de la 7ma avenida. Con eso ya sabés el punto exacto: subís/bajás por el
número de calle y te corrés por la avenida.
*Ejemplo:* "Meet me at 34th & 8th" = esquina de la calle 34 y la 8va avenida.

**7. Broadway, la excepción diagonal**
Casi todo es una grilla ordenada… menos **Broadway**, que cruza la isla en **diagonal**. Donde Broadway
corta una avenida se forman plazas famosas: **Times Square** (con la 7th), **Herald Square** (con la
6th), **Madison Square/Flatiron** (con la 5th) y **Union Square** (con la 4th/Park). Por eso hay
edificios triangulares como el Flatiron.
*Ejemplo:* Times Square existe porque Broadway cruza la 7th Ave en la calle 42.

**8. Debajo de la 14th, la grilla desaparece**
Al **sur de Houston St / la calle 14** (Village, SoHo, Chinatown, Financial District) la ciudad es más
vieja que la grilla: las calles tienen **nombres, no números**, y se cruzan en ángulos raros. Ahí es
normal perderse; conviene usar el mapa real y guiarse por nombres (Bleecker, Prince, Wall St…).
*Ejemplo:* En el Village, "West 4th St" llega a cruzarse con "West 10th St" (¡rompe toda lógica!).

---

## 5. Cómo se ve en mobile (espacio limitado, texto largo)

- El panel educativo es **largo**; en mobile vive en un `BottomSheet` (Design Spec §8.2) con snaps
  `peek → full`.
- En `peek` (~35%) se ve el título "Cómo funciona la grilla" + el primer concepto; el mapa con el
  overlay queda visible arriba.
- Al subir a `full` (~90%), los 8 conceptos se leen con **scroll interno** del sheet; cada concepto es
  una tarjeta o bloque separado por divisores, con el ejemplo destacado (`text-body-sm`, color de acento
  tenue).
- El usuario puede **colapsar** el panel para mirar el mapa mientras piensa, sin perder el overlay.
- Las etiquetas de calles/avenidas sobre el mapa usan `text-caption` con halo para legibilidad; con
  declutter por zoom para no saturar la pantalla chica.

**Desktop:** el panel educativo se muestra en el **sidebar izquierdo**, siempre visible, en columna de
lectura (máx ~68ch), mientras el overlay del grid se ve sobre el mapa a la derecha.

---

## 6. El overlay del grid sobre el mapa real

- Se dibuja como **capas vectoriales de MapLibre** alimentadas por GeoJSON derivado de `GridData` (no se
  dependen de las etiquetas propias de los tiles, que podrían no coincidir con el estilo dark):
  - **Streets:** líneas horizontales a la `geoLat` de cada calle, con `symbol` para la etiqueta.
  - **Avenues:** líneas a la `geoLng` de cada avenida, con etiqueta.
  - **Broadway:** capa `line` resaltada siguiendo `broadway.geoPath`, por encima del resto.
- Estilo coherente con el esquemático: mismos colores/pesos de línea, mismas etiquetas, para que
  cambiar de modo no confunda. Las `key` siempre visibles; `secondary` según zoom.
- El overlay se activa solo en la **sección Grid**; en Barrios e Itinerario está oculto (aunque el mapa
  real muestre sus propias calles).
- Sobre el **esquemático**, las mismas líneas se dibujan como `<line>`/`<polyline>` + `<text>` en el SVG.

---

**Anterior:** [BARRIOS.md](BARRIOS.md) · **Siguiente:** [ITINERARY.md](ITINERARY.md)
