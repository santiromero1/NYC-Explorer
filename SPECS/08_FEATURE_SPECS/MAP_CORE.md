# 08 · Feature Spec — MAP_CORE

> Especificación técnica del núcleo del mapa: sistema de coordenadas del esquemático, coordenadas de
> cada barrio, pan/zoom táctil, librería del mapa real, switch entre modos, sincronización de
> overlays, posicionamiento de pins y accesibilidad. Es la base sobre la que se apoyan Barrios, Grid
> e Itinerario. Se puede leer solo.

Contexto mínimo: NYC Explorer muestra Manhattan de dos formas — un **mapa esquemático** (SVG propio,
estilizado) y un **mapa real** (MapLibre GL) — que el usuario alterna. Todos los overlays (barrios,
grid, pins) deben verse en ambos.

---

## 1. Sistema de coordenadas del mapa esquemático

- **viewBox:** `0 0 400 900` (unidades lógicas; ratio ~1:2.25, alto/angosto como Manhattan).
  Todo dato SVG (barrios, grid, pins) se expresa en estas unidades, independientes de los px reales
  de pantalla. El SVG escala al contenedor con `preserveAspectRatio="xMidYMid meet"`.
- **Orientación:** norte = arriba (y menor = más al norte). Ojo: en geografía la latitud **crece**
  hacia el norte, pero en SVG la `y` **crece hacia abajo**; la proyección (§7) invierte el eje Y.
- **Origen:** `(0,0)` esquina superior-izquierda. La isla se dibuja centrada con márgenes para el agua.
- **Franjas de agua:** Hudson a la izquierda (`x` ~0–40) y East River a la derecha (`x` ~360–400),
  como rectángulos `#12202E`. La isla ocupa aproximadamente `x: 40–360`.

Manhattan real va de ~sur (Battery, lat ~40.700) a ~norte (Harlem/Washington Heights límite del MVP,
lat ~40.820). Ese rango se mapea al alto del viewBox (`y: 40–860`, dejando aire arriba/abajo).

---

## 2. Coordenadas aproximadas de cada barrio en el SVG

Rectángulos redondeados (salvo Central Park y silueta, que pueden ser polígonos). Valores en unidades
del viewBox `400×900`, de sur (abajo, `y` alto) a norte (arriba, `y` bajo). Son **aproximados y
ajustables** en implementación; lo importante es el orden relativo y que no se solapen.

| Barrio | id | x | y | w | h | Notas |
|---|---|---|---|---|---|---|
| Financial District | `fidi` | 150 | 780 | 120 | 80 | Punta sur de la isla |
| TriBeCa | `tribeca` | 120 | 710 | 90 | 70 | Sobre FiDi, lado oeste |
| Lower East Side | `lower-east-side` | 230 | 690 | 100 | 90 | Sureste |
| SoHo | `soho` | 140 | 650 | 100 | 65 | |
| Greenwich Village | `greenwich-village` | 110 | 580 | 130 | 75 | Incluye West Village |
| East Village | `east-village` | 240 | 600 | 90 | 70 | Este del Village |
| Chelsea | `chelsea` | 90 | 490 | 110 | 90 | Oeste |
| Flatiron / Union Sq | `flatiron` | 205 | 500 | 110 | 80 | Centro-este |
| Midtown | `midtown` | 110 | 360 | 200 | 130 | Ancho, centro de la isla |
| Central Park | `central-park` | 150 | 180 | 120 | 175 | Polígono verde vertical |
| Upper West Side | `upper-west-side` | 70 | 170 | 80 | 185 | Oeste del parque |
| Upper East Side | `upper-east-side` | 270 | 170 | 80 | 185 | Este del parque |
| Harlem | `harlem` | 110 | 60 | 200 | 110 | Norte, arriba del parque |

Disposición (esquema ASCII, norte arriba):

```
                 y bajo (NORTE)
        ┌───────────────────────────┐
        │          HARLEM           │
   ┌────┤────────────┬──────────────┤────┐
   │ U  │            │              │ U  │
   │ W  │  CENTRAL   │   (parque)   │ E  │
   │ S  │   PARK     │              │ S  │
   ├────┴────────────┴──────────────┴────┤
   │              MIDTOWN                │
   ├──────────────┬──────────────────────┤
   │   CHELSEA    │   FLATIRON/UNION SQ  │
   ├──────────┬───┴───────┬──────────────┤
   │ GREENWICH VILLAGE     │ EAST VILLAGE│
   ├───────────┬───────────┴─────┬───────┤
   │   SOHO    │                 │  LES  │
   ├───────────┤   TRIBECA       ├───────┘
   │  TRIBECA  │                 │
   └───────────┴─────────────────┘
        │      FINANCIAL DISTRICT   │
        └───────────────────────────┘
                 y alto (SUR)
   [Hudson a la izq]        [East River a la der]
```

La **silueta de la isla** (`manhattan-shape.ts`) es un polígono suave que sirve de fondo/recorte;
los barrios se dibujan encima. Central Park se dibuja como zona verde entre UWS y UES.

---

## 3. Pan y zoom táctil en el mapa esquemático

Se implementa sobre un `<g>` contenedor con un `transform` (`translate` + `scale`); no se re-renderiza
el contenido en cada frame.

- **Pan:** arrastre de un dedo (touch) / drag con mouse (desktop). Se limita a los bounds del contenido
  (no se puede sacar la isla de vista por completo — clamp).
- **Zoom:**
  - **Mobile:** pinch de dos dedos; el punto focal del pinch se mantiene bajo los dedos.
  - **Desktop:** rueda del mouse (zoom hacia el cursor) + botones `+`/`−`.
  - Límites: `minZoom` (isla entera visible) a `maxZoom` (~4–5x para ver detalle de calles).
- **Doble tap:** zoom-in por pasos, centrado en el punto tocado.
- **Inercia:** opcional; si complica, se omite (uso personal, no crítico).
- **Rendimiento:** el `transform` se aplica vía CSS/atributo en el `<g>`; `will-change: transform`
  durante el gesto. Ver [ARCHITECTURE §12](../05_TECHNICAL_ARCHITECTURE.md).
- **Estado:** el viewport (centro/zoom lógico) se refleja en el store para preservarse entre secciones
  y aproximarse al pasar a modo real.

---

## 4. Librería del mapa real y por qué

**MapLibre GL JS.** Motivos (detallado en [ARCHITECTURE §1](../05_TECHNICAL_ARCHITECTURE.md)):
- **Open source y sin API key** → cero costo/fricción para uso personal.
- **WebGL** → pan/zoom fluido y rotación; buen desempeño mobile.
- **Overlays vectoriales nativos** → barrios (fill+line), grid (line+symbol) y pins (markers/symbols)
  se alimentan con **GeoJSON**, misma fuente conceptual que el esquemático.
- **Estilo dark customizable** → coherencia con el Design Spec.

Integración en React vía `react-map-gl` (wrapper de MapLibre) o un wrapper propio delgado; se
**lazy-loadea** al primer uso del modo real (no penaliza el arranque).

`[DECISIÓN PENDIENTE]` proveedor de tiles/estilo dark gratuito — ver
[ARCHITECTURE §10](../05_TECHNICAL_ARCHITECTURE.md) y [DEPLOYMENT](../10_DEPLOYMENT.md).

---

## 5. Switch entre esquemático y real

- **Quién decide:** `MapContainer` lee `mapMode` del store y monta un renderer u otro.
- **Transición:** crossfade de `duration-slow` (320ms). El renderer entrante se monta detrás, sube
  opacidad; el saliente baja y se desmonta (o se oculta si conviene mantener la instancia de MapLibre
  viva para no re-inicializar WebGL).
- **Qué persiste entre modos:**
  - **Viewport aproximado:** el centro geográfico y un zoom equivalente. Como los sistemas de zoom no
    son idénticos, se mapea el zoom lógico del esquemático a un zoom de MapLibre por una tabla/fórmula
    de equivalencia (aproximada; suficiente para uso personal).
  - **Selección de barrio** (`selectedNeighborhoodId`), **día enfocado** (`focusedDayId`), **overlay de
    grid** activo, y **todos los pins**. Viven en el store, así que el cambio de modo no los pierde.
- **Primera vez a modo real:** se dispara la carga lazy de MapLibre + tiles (loading state; UX Flows §3).

---

## 6. Sincronización de overlays entre modos

Regla de oro: **los overlays leen del store, no del renderer.** Ambos mapas se suscriben al mismo
estado y dibujan la misma verdad. Así:

- Seleccionar **SoHo** en esquemático setea `selectedNeighborhoodId='soho'`. Al cambiar a real, el
  `NeighborhoodsLayer` del mapa real lee ese id y resalta SoHo. Sin lógica duplicada.
- Enfocar el **Día 3** filtra pins en ambos modos igual.
- Activar el **Grid** en una sección se ve en los dos mapas.

Cada overlay implementa dos caminos de render (SVG vs GeoJSON/MapLibre) pero **una sola fuente de
datos y de selección**. Ver [COMPONENT_SPEC §3](../07_COMPONENT_SPEC.md).

---

## 7. Proyección geo ↔ SVG

`projection.ts` es la **fuente única de verdad**. Se definen los bounds geográficos de Manhattan
(MVP, hasta Harlem):

```
Bounds (aprox):
  norte  lat ≈ 40.820   → svg y ≈ 40   (arriba)
  sur    lat ≈ 40.700   → svg y ≈ 860  (abajo)
  oeste  lng ≈ -74.020  → svg x ≈ 40   (izquierda)
  este   lng ≈ -73.930  → svg x ≈ 360  (derecha)
```

- `geoToSvg(lng, lat)`: interpolación lineal —
  `x = map(lng, oesteLng, esteLng, 40, 360)`,
  `y = map(lat, norteLat, surLat, 40, 860)` (nótese: lat mayor → y menor).
- `svgToGeo(x, y)`: la inversa.
- **Precisión:** aproximación lineal (ignora la curvatura y la ligera rotación real de la grilla de
  Manhattan). Para una isla tan chica y para pins colocados a mano, el error es visualmente tolerable
  y **aceptado explícitamente** dado el alcance personal. No se usa para navegación.
- Los barrios y el grid en `src/data/` traen **ambas** representaciones precalculadas (más fieles que
  la proyección lineal); la proyección se usa sobre todo para **pins** colocados por el usuario.

---

## 8. Posicionamiento de pins en ambos mapas

- Al **colocar** un pin (UX Flows §9): el usuario toca el mapa activo.
  - Si está en **esquemático**: el tap da `SvgPoint`; se deriva `GeoPoint` con `svgToGeo`.
  - Si está en **real**: el tap da `GeoPoint` (lng/lat de MapLibre); se deriva `SvgPoint` con `geoToSvg`.
  - Se guardan **ambas** coordenadas en el `Pin` (Data Model §4). Así el pin se dibuja correctamente
    sin importar el modo en que se vea después.
- **Render:**
  - Esquemático: marcador SVG en `(pin.svg.x, pin.svg.y)`, color del día.
  - Real: `Marker`/symbol de MapLibre en `(pin.geo.lng, pin.geo.lat)`, mismo color y forma.
- **Forma del marcador:** idéntica en ambos (pin/gota con relleno del color del día y borde claro),
  para que el cambio de modo no "salte" visualmente. Target táctil ≥44px.
- **Colisión/legibilidad:** en MVP se dibujan directos (un viaje familiar tiene pocos pins). Clustering
  queda para backlog.

---

## 9. Accesibilidad del mapa

- **Alternativa textual:** el itinerario y los barrios son plenamente usables **sin** el mapa: la lista
  de días/pins (Itinerario) y el panel de barrios contienen toda la información en texto. El mapa es un
  refuerzo visual, no la única vía.
- **Barrios:** cada zona interactiva es un elemento focusable con `role="button"` y `aria-label` (ej.
  "Barrio SoHo, tocar para ver detalle"). Navegables con Tab; Enter/Espacio seleccionan.
- **Pins:** cada pin focusable con `aria-label` ("Lugar Katz's Deli, Día 1"). Enter abre el popover.
- **Toggle de mapa y controles de zoom:** botones reales con label; operables por teclado.
- **Modo colocar pin:** como tocar el mapa es difícil sin visión, se ofrece (a11y) la alternativa de
  no depender solo del tap — en MVP, el banner explica; `[v2]` búsqueda por nombre lo resuelve mejor.
- **Contraste:** colores de barrio/día validados sobre el fondo dark; etiquetas con sombra/halo para
  legibilidad. Cumplir WCAG 2.1 AA en texto (ver [TESTING §a11y](../09_TESTING_SPEC.md)).
- **Reduced motion:** el crossfade y el zoom respetan `prefers-reduced-motion` (transiciones mínimas).
- **Foco visible:** anillo `color-accent` en todo elemento del mapa focusable.

---

**Anterior:** [07_COMPONENT_SPEC.md](../07_COMPONENT_SPEC.md) · **Siguiente:** [BARRIOS.md](BARRIOS.md)
