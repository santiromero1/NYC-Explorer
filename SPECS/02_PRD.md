# 02 · PRD — NYC Explorer

> Product Requirements Document. Lista todas las features con user stories y **criterios de
> aceptación verificables**, la tabla de priorización (MVP / v2 / backlog), los non-goals y los
> riesgos. Es el contrato de "qué construimos". Se puede leer solo.

Formato de user story: *Como [usuario] quiero [acción] para [beneficio]*.
Etiquetas de alcance: `[MVP]` · `[v2]` · `[backlog]`.

---

## 1. Épicas

| Épica | Descripción |
|---|---|
| **E1 · Mapa base** | El mapa de Manhattan, en dos modos (esquemático y real), con pan/zoom. |
| **E2 · Barrios** | Explorar los 13 barrios y su contenido. |
| **E3 · Grid** | Entender el sistema de calles con overlay + panel educativo. |
| **E4 · Itinerario** | Crear y editar el plan de viaje día por día con pins. |
| **E5 · Plataforma** | Persistencia, offline, PWA, navegación general. |

---

## 2. Features y user stories

### E1 · Mapa base

**F1.1 — Ver Manhattan en mapa esquemático** `[MVP]`
> Como viajero quiero ver Manhattan como un mapa estilizado y simple para entender la forma y las
> zonas de la ciudad sin el ruido de un mapa real.

Criterios de aceptación:
- Al abrir la app se ve Manhattan representado en SVG con sus 13 zonas diferenciadas por color.
- El mapa ocupa la mayor parte de la pantalla (mobile).
- Se puede hacer **pan** (arrastrar) y **zoom** (pinch en mobile, scroll/botones en desktop).
- El mapa es legible a 390px de ancho sin scroll horizontal de página.

**F1.2 — Ver el mapa real** `[MVP]`
> Como viajero quiero ver el mapa real de Manhattan para ubicar con precisión dónde está cada cosa.

Criterios de aceptación:
- Existe un modo "mapa real" con tiles de MapLibre GL centrado en Manhattan.
- El estilo del mapa real es coherente con el dark mode de la app.
- Pan y zoom táctiles funcionan de forma nativa.
- No requiere API key ni login.

**F1.3 — Alternar entre modo esquemático y real** `[MVP]`
> Como viajero quiero cambiar entre el mapa esquemático y el real para elegir la vista que me sirve
> según lo que estoy haciendo.

Criterios de aceptación:
- Hay un control visible y accesible con el pulgar para cambiar de modo.
- Al cambiar de modo se **preserva el contexto**: el barrio o día seleccionado sigue seleccionado.
- Los pins del itinerario, el barrio seleccionado y el overlay de grid se ven en **ambos** modos.
- El cambio de modo es fluido (sin recarga de página).

---

### E2 · Barrios

**F2.1 — Explorar un barrio** `[MVP]`
> Como viajero quiero tocar una zona del mapa para ver qué barrio es y qué ofrece.

Criterios de aceptación:
- Al tocar una zona, esa zona se resalta como "seleccionada".
- Aparece un panel (bottom sheet en mobile) con: **nombre**, **vibe** (una línea), **descripción**
  (2–3 oraciones), **lista de 4–6 spots** con mini-descripción, y **un tip práctico**.
- El panel se puede cerrar con gesto (swipe down) o botón, y con backdrop tap.
- Tocar otra zona con un panel abierto reemplaza el contenido por el nuevo barrio.

**F2.2 — Ver todos los barrios de un vistazo** `[MVP]`
> Como viajero quiero distinguir visualmente los barrios en el mapa para tener un mapa mental de la ciudad.

Criterios de aceptación:
- Cada barrio tiene un color propio consistente (definido en el Design Spec).
- El barrio muestra su nombre (etiqueta) cuando el zoom lo permite.

**F2.3 — Conexión barrio ↔ itinerario** `[MVP]`
> Como viajero quiero ver si tengo días planificados en un barrio para conectar lo que aprendo con mi plan.

Criterios de aceptación:
- Si el itinerario tiene días cuya "zona principal" es ese barrio, el panel del barrio lo indica
  (ej.: "Tenés 2 días en esta zona").
- `[v2]` Desde ahí se puede saltar al día correspondiente.

---

### E3 · Grid (Calles)

**F3.1 — Activar el overlay del grid** `[MVP]`
> Como viajero quiero ver las calles y avenidas clave superpuestas para entender la grilla.

Criterios de aceptación:
- En la sección Grid se dibujan sobre el mapa: streets numeradas clave, avenidas principales y
  Broadway en diagonal.
- Cada línea tiene su etiqueta legible (ej.: "42nd St", "5th Ave").
- El overlay funciona en modo esquemático **y** en modo real.

**F3.2 — Leer el panel educativo** `[MVP]`
> Como viajero quiero una explicación clara del sistema de calles para poder leer cualquier dirección de NY.

Criterios de aceptación:
- Hay un panel con explicaciones de: qué es una street, qué es una avenue, uptown/downtown,
  crosstown, cómo leer una dirección, la 5th Ave como divisoria, y la excepción de la zona bajo la 14th.
- En mobile el texto es legible y scrolleable dentro del panel sin romper el layout.

---

### E4 · Itinerario

**F4.1 — Empty state e inicio** `[MVP]`
> Como viajero quiero que la primera vez me quede claro cómo empezar mi itinerario.

Criterios de aceptación:
- Con itinerario vacío se muestra un empty state con un CTA claro ("Agregá tu primer día").
- Crear el primer día es alcanzable en un tap desde el empty state.

**F4.2 — Crear un día** `[MVP]`
> Como viajero quiero crear un día con nombre, fecha, zona y descripción para estructurar mi viaje.

Criterios de aceptación:
- Formulario con: **nombre** (requerido), **fecha** (opcional), **zona principal** (opcional, elegible
  entre los 13 barrios), **descripción** (opcional).
- Al guardar, el día aparece en la lista del itinerario con su **color asignado automáticamente**.
- Validación: no se puede guardar un día sin nombre.

**F4.3 — Editar un día** `[MVP]`
> Como viajero quiero editar un día para corregir o ajustar el plan.

Criterios de aceptación:
- Se puede editar nombre, fecha, zona y descripción de un día existente.
- Los cambios se reflejan de inmediato y se persisten.

**F4.4 — Eliminar un día (con confirmación)** `[MVP]`
> Como viajero quiero borrar un día que ya no va, sin miedo a hacerlo por accidente.

Criterios de aceptación:
- Eliminar pide **confirmación explícita** que avisa que se borran también sus pins.
- Al confirmar, el día y sus pins desaparecen del mapa y de la lista, y se persiste.

**F4.5 — Reordenar días** `[MVP]`
> Como viajero quiero cambiar el orden de los días para ajustar la secuencia del viaje.

Criterios de aceptación:
- Se puede reordenar la lista de días (drag & drop o botones subir/bajar — ver Itinerary spec).
- El nuevo orden persiste.
- `[DECISIÓN PENDIENTE]` mecanismo de reorden (drag vs. botones) — resuelto en
  [08_FEATURE_SPECS/ITINERARY.md](08_FEATURE_SPECS/ITINERARY.md).

**F4.6 — Agregar un pin a un día** `[MVP]`
> Como viajero quiero marcar un lugar en el mapa dentro de un día para saber dónde ir.

Criterios de aceptación:
- Desde un día, se puede agregar un pin indicando nombre y ubicación en el mapa.
- El pin aparece sobre el mapa con el **color del día**.
- El pin se puede acompañar de una **nota opcional**.
- `[DECISIÓN PENDIENTE]` flujo de captura de ubicación (tap en mapa / búsqueda) — en Itinerary spec.

**F4.7 — Editar y eliminar un pin** `[MVP]`
> Como viajero quiero corregir o quitar un lugar marcado.

Criterios de aceptación:
- Se puede editar nombre, nota y ubicación de un pin.
- Se puede eliminar un pin (con confirmación ligera).
- Cambios persistidos y reflejados en el mapa al instante.

**F4.8 — Ver el itinerario sobre el mapa** `[MVP]`
> Como viajero quiero ver todos los pins de mis días sobre el mapa para entender el plan geográficamente.

Criterios de aceptación:
- Los pins de todos los días se ven en el mapa, cada día con su color.
- Se puede enfocar/filtrar por un día (ver solo sus pins) — ver Itinerary spec.
- Tocar un pin muestra su nombre y nota.

**F4.9 — Exportar / compartir itinerario** `[v2]`
> Como viajero quiero exportar o compartir mi itinerario para tenerlo fuera de la app o pasarlo a la familia.

**F4.10 — Búsqueda de lugares por nombre** `[v2]`
> Como viajero quiero buscar un lugar por nombre al agregar un pin para no tener que ubicarlo a mano.

---

### E5 · Plataforma

**F5.1 — Persistencia local** `[MVP]`
> Como viajero quiero que mi itinerario siga estando cuando cierro y vuelvo a abrir la app.

Criterios de aceptación:
- El itinerario se guarda en `localStorage` automáticamente ante cada cambio.
- Al reabrir la app, el itinerario, la sección y el modo de mapa se restauran.
- Si `localStorage` no está disponible, la app avisa que los cambios no se guardarán (ver UX Flows).

**F5.2 — Funcionamiento offline** `[MVP]`
> Como viajero quiero ver mi itinerario y el mapa esquemático sin conexión.

Criterios de aceptación:
- Con la app instalada/cacheada, abrir sin red muestra el itinerario y el mapa esquemático.
- El mapa real puede degradarse sin red (tiles no cargan) sin romper la app.

**F5.3 — PWA instalable** `[MVP]`
> Como viajero quiero instalar la app en el home screen del celular para abrirla como una app nativa.

Criterios de aceptación:
- Hay `manifest.json` con nombre, íconos, color de tema y `display: standalone`.
- El navegador ofrece "Agregar a inicio" en mobile.
- Abierta desde el ícono, arranca sin barra de navegador.

**F5.4 — Navegar entre las tres secciones** `[MVP]`
> Como viajero quiero moverme entre Barrios, Grid e Itinerario fácil con el pulgar.

Criterios de aceptación:
- Hay una navegación inferior (mobile) con las tres secciones, accesible con el pulgar.
- La sección activa se indica claramente.
- Cambiar de sección no pierde el estado del mapa (posición/zoom/modo).

---

## 3. Tabla de priorización

| Feature | MVP | v2 | Backlog |
|---|:---:|:---:|:---:|
| F1.1 Mapa esquemático | ✅ | | |
| F1.2 Mapa real | ✅ | | |
| F1.3 Alternar modos | ✅ | | |
| F2.1 Explorar barrio | ✅ | | |
| F2.2 Barrios de un vistazo | ✅ | | |
| F2.3 Conexión barrio↔itinerario | ✅ (indicador) | ✅ (salto) | |
| F3.1 Overlay grid | ✅ | | |
| F3.2 Panel educativo | ✅ | | |
| F4.1 Empty state | ✅ | | |
| F4.2 Crear día | ✅ | | |
| F4.3 Editar día | ✅ | | |
| F4.4 Eliminar día | ✅ | | |
| F4.5 Reordenar días | ✅ | | |
| F4.6 Agregar pin | ✅ | | |
| F4.7 Editar/eliminar pin | ✅ | | |
| F4.8 Ver itinerario en mapa | ✅ | | |
| F4.9 Exportar/compartir | | ✅ | |
| F4.10 Búsqueda de lugares | | ✅ | |
| F5.1 Persistencia local | ✅ | | |
| F5.2 Offline | ✅ | | |
| F5.3 PWA instalable | ✅ | | |
| F5.4 Navegación secciones | ✅ | | |
| Sync nube (Supabase) multi-dispositivo | | ✅ | |
| Fotos por spot/pin | | | ✅ |
| Otros boroughs / ciudades | | | ✅ |
| Horarios/tiempos por pin, ruta sugerida del día | | | ✅ |

---

## 4. Non-goals (explícitos)

- **No** navegación turn-by-turn (para eso, Google Maps).
- **No** autenticación ni cuentas en el MVP.
- **No** backend propio en el MVP.
- **No** datos dinámicos de terceros (precios, horarios en vivo, reservas).
- **No** otras ciudades; dentro de NYC, foco en Manhattan.
- **No** colaboración en tiempo real ni edición multiusuario simultánea.

---

## 5. Riesgos identificados

| # | Riesgo | Impacto | Mitigación |
|---|---|---|---|
| R1 | El mapa esquemático SVG queda "feo" o poco fiel y confunde en vez de ayudar | Alto (es diferencial) | Definir coordenadas y estilo con cuidado en MAP_CORE + DESIGN_SPEC; iterar visualmente |
| R2 | Sincronizar overlays (barrio/pin/grid) entre mapa SVG y real es complejo | Alto | Un único modelo de coordenadas lógico; capa de proyección que traduce a cada modo (ver MAP_CORE) |
| R3 | `localStorage` se llena o el usuario borra datos del navegador → pérdida del itinerario | Medio | Payload chico; avisar límites; export manual en v2; considerar recordatorio de respaldo |
| R4 | Performance del mapa real (WebGL) en celulares viejos | Medio | Mapa esquemático como default liviano; lazy-load de MapLibre; degradación elegante |
| R5 | Tiles gratuitos de MapLibre con límites de uso o caída del proveedor | Bajo (uso personal) | Elegir proveedor de tiles con free tier holgado; documentar alternativa; el esquemático no depende de red |
| R6 | Offline mal configurado (service worker) rompe actualizaciones o muestra versión vieja | Medio | Estrategia de cache clara en DEPLOYMENT; versionado del SW |
| R7 | Coordenadas geográficas de los pins mal proyectadas al SVG esquemático | Medio | Definir bounds geográficos exactos de Manhattan y fórmula de proyección en MAP_CORE |
| R8 | Sobre-ingeniería: agregar features que no se usan en el viaje | Medio | Principio "simple antes que completo"; respetar la tabla de priorización |

---

**Anterior:** [01_DISCOVERY.md](01_DISCOVERY.md) · **Siguiente:** [03_DESIGN_SPEC.md](03_DESIGN_SPEC.md)
