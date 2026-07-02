# 07 · Component Spec — NYC Explorer

> Inventario completo de componentes de la app, organizado en árbol: **Layout → Pages/Secciones →
> Features → UI primitives**. Por cada componente: responsabilidad (qué hace y qué NO), props,
> estado interno, eventos, comportamiento mobile vs desktop, e hijos. Los props se listan en tablas
> (sin código; los tipos referenciados están en [06_DATA_MODEL.md](06_DATA_MODEL.md)). Se puede leer solo.

Convención de props: `nombre: tipo` — tipos con `?` son opcionales. Los tipos complejos
(`Neighborhood`, `Day`, `Pin`, `MapMode`, `AppSection`…) están definidos en el Data Model.

---

## 1. Árbol general

```
App
├── AppShell
│   ├── MapContainer                    (features/map) ── SIEMPRE montado
│   │   ├── SchematicMap | RealMap
│   │   └── overlays: NeighborhoodsLayer · GridLayer · PinsLayer
│   ├── MapModeToggle                   (SegmentedControl)
│   ├── SectionOutlet                   (renderiza la sección activa)
│   │   ├── NeighborhoodsSection
│   │   ├── GridSection
│   │   └── ItinerarySection
│   ├── BottomNav          (mobile) | SidebarNav (desktop)
│   └── ToastHost
└── (providers: store, theme)
```
Nota clave: **el mapa vive en el shell, no dentro de cada sección.** Las secciones son capas de UI
(paneles/sheets/overlays) sobre un mapa persistente. Así se preserva el viewport al cambiar de sección.

---

## 2. Layout

### `App`
- **Responsabilidad:** montar providers (stores, tema), y el `AppShell`. Detectar disponibilidad de
  `localStorage` al iniciar. NO contiene lógica de UI.
- **Props:** ninguna.
- **Estado:** ninguno (los stores son externos).
- **Eventos:** —.
- **Mobile/Desktop:** igual.
- **Hijos:** `AppShell`.

### `AppShell`
- **Responsabilidad:** layout raíz. Decide disposición según breakpoint; hospeda el mapa persistente,
  el toggle de mapa, la navegación y el outlet de secciones. NO conoce el contenido de cada sección.
- **Props:** ninguna (lee del store).
- **Estado interno:** breakpoint actual (via `useMediaQuery`).
- **Eventos:** —.
- **Mobile:** mapa full-screen; `BottomNav` abajo; toggle flotante arriba-derecha; secciones como
  bottom sheets sobre el mapa.
- **Desktop:** grid de dos columnas — `SidebarNav`+contenido a la izquierda (~380px), mapa a la derecha.
- **Hijos:** `MapContainer`, `MapModeToggle`, `SectionOutlet`, `BottomNav`/`SidebarNav`, `ToastHost`.

### `SectionOutlet`
- **Responsabilidad:** renderizar la sección activa según `activeSection` del store.
- **Props:** ninguna (lee `activeSection`).
- **Estado:** —.
- **Eventos:** —.
- **Hijos:** una de `NeighborhoodsSection` · `GridSection` · `ItinerarySection`.

---

## 3. Mapa (features/map) — el subárbol más complejo

### `MapContainer`
- **Responsabilidad:** única autoridad sobre qué renderer de mapa está montado (esquemático vs real).
  Gestiona el crossfade entre modos. Provee el viewport y hospeda los overlays. NO dibuja overlays él
  mismo (los delega). NO conoce el contenido editorial.
- **Props:** ninguna (lee `mapMode`, `viewport`, selección del store).
- **Estado interno:** estado de transición (fade), instancia lazy de MapLibre.
- **Eventos emitidos (al store):** `onViewportChange(viewport)`, `onMapTap(geo, svg)` (usado en modo
  colocar pin y para selección de barrio).
- **Mobile/Desktop:** igual; en desktop el mapa ocupa la columna derecha.
- **Hijos:** `SchematicMap` **o** `RealMap`, + `NeighborhoodsLayer`, `GridLayer`, `PinsLayer`.

### `SchematicMap`
- **Responsabilidad:** renderizar el SVG de Manhattan (silueta + agua) y proveer el sistema de coords
  del `viewBox`. Manejar pan/zoom táctil del SVG. NO dibuja barrios/grid/pins (eso son overlays).
- **Props:**

  | Prop | Tipo | Descripción |
  |---|---|---|
  | `viewport` | `MapViewport` | Centro/zoom lógico a aplicar. |
  | `onViewportChange` | `(v: MapViewport) => void` | Emite pan/zoom. |
  | `onTap` | `(p: SvgPoint, geo: GeoPoint) => void` | Tap en el lienzo. |
  | `children` | `ReactNode` | Overlays a renderizar dentro del SVG. |

- **Estado interno:** transform actual (pan/zoom), gesto en curso.
- **Mobile:** pinch-zoom y drag-pan táctiles. **Desktop:** scroll-zoom + drag + botones +/−.
- **Hijos:** los overlays (como `<g>` dentro del SVG).

### `RealMap`
- **Responsabilidad:** montar MapLibre GL con estilo dark, sincronizar su viewport con el store,
  exponer conversión de eventos a `{geo, svg}`. Cargar tiles. NO dibuja overlays con React (usa capas
  MapLibre alimentadas por los overlays).
- **Props:** mismos que `SchematicMap` + `styleUrl: string`.
- **Estado interno:** instancia del mapa, estado de carga de tiles.
- **Eventos:** `onViewportChange`, `onTap`, `onTilesError` (sin red).
- **Mobile/Desktop:** gestos nativos de MapLibre en ambos; en desktop además scroll-zoom.
- **Hijos:** overlays montados como capas/markers de MapLibre.

### `NeighborhoodsLayer`
- **Responsabilidad:** dibujar los 13 barrios sobre el mapa activo y manejar su selección visual.
  NO abre el panel (emite el evento; la sección decide).
- **Props:**

  | Prop | Tipo | Descripción |
  |---|---|---|
  | `mapMode` | `MapMode` | Para elegir render SVG vs GeoJSON. |
  | `neighborhoods` | `Neighborhood[]` | Datos estáticos. |
  | `selectedId` | `NeighborhoodId \| null` | Barrio resaltado. |
  | `interactive` | `boolean` | true solo en la sección Barrios. |
  | `onSelect` | `(id: NeighborhoodId) => void` | Tap en un barrio. |

- **Estado:** —.
- **Mobile/Desktop:** igual; etiquetas con declutter por zoom.
- **Hijos:** —.

### `GridLayer`
- **Responsabilidad:** dibujar streets/avenidas/Broadway con etiquetas sobre el mapa activo. Solo
  visible en la sección Grid. NO contiene el panel educativo.
- **Props:** `mapMode`, `grid: GridData`, `visible: boolean`.
- **Estado:** —.
- **Mobile/Desktop:** en zoom bajo muestra solo calles `key`; al acercar, agrega `secondary`.
- **Hijos:** —.

### `PinsLayer`
- **Responsabilidad:** dibujar los pins del itinerario sobre el mapa (color por día), manejar tap en
  pin y el marcador provisional en modo colocar. NO edita datos (emite eventos).
- **Props:**

  | Prop | Tipo | Descripción |
  |---|---|---|
  | `mapMode` | `MapMode` | Render SVG vs marcador MapLibre. |
  | `days` | `Day[]` | Días con sus pins. |
  | `focusedDayId` | `string \| null` | Si set, solo muestra pins de ese día. |
  | `isPlacingPin` | `boolean` | Muestra marcador provisional arrastrable. |
  | `onPinTap` | `(pinId: string) => void` | Tap en un pin existente. |
  | `onProvisionalMove` | `(geo, svg) => void` | Reubicación del marcador provisional. |

- **Estado interno:** posición del marcador provisional mientras se coloca.
- **Mobile/Desktop:** targets de pin ≥ 44px; en desktop hover muestra tooltip con el nombre.
- **Hijos:** —.

### `MapModeToggle` (usa `SegmentedControl`)
- **Responsabilidad:** cambiar `mapMode` en el store. Dos segmentos: Esquemático / Real.
- **Props:** `value: MapMode`, `onChange: (m: MapMode) => void`.
- **Mobile:** flotante arriba-derecha, tamaño pulgar. **Desktop:** arriba-derecha del área de mapa.

---

## 4. Sección Barrios (features/neighborhoods)

### `NeighborhoodsSection`
- **Responsabilidad:** orquestar la exploración de barrios: activa la interactividad del
  `NeighborhoodsLayer`, y muestra el panel del barrio seleccionado.
- **Props:** ninguna (lee/escribe `selectedNeighborhoodId`).
- **Estado:** snap del sheet.
- **Eventos:** al seleccionar un barrio, setea `selectedNeighborhoodId`.
- **Mobile:** `NeighborhoodPanel` dentro de un `BottomSheet`. **Desktop:** panel en el sidebar.
- **Hijos:** `NeighborhoodPanel` (+ `BottomSheet` en mobile).

### `NeighborhoodPanel`
- **Responsabilidad:** mostrar el contenido de un barrio (nombre, vibe, descripción, spots, tip, y
  badge de días del itinerario en esa zona). NO maneja el mapa.
- **Props:**

  | Prop | Tipo | Descripción |
  |---|---|---|
  | `neighborhood` | `Neighborhood` | Barrio a mostrar. |
  | `daysInNeighborhood` | `number` | Cuántos días del itinerario tienen esta zona. |
  | `onClose` | `() => void` | Cerrar el panel. |

- **Estado:** —.
- **Mobile:** título con color del barrio; contenido scrolleable; se cierra con swipe/X/backdrop.
- **Desktop:** mismo contenido en el sidebar; sin handle de arrastre.
- **Hijos:** `SpotList`, `Badge`.

### `SpotList`
- **Responsabilidad:** renderizar la lista de spots del barrio (nombre + descripción).
- **Props:** `spots: Spot[]`.
- **Hijos:** —.

---

## 5. Sección Grid (features/grid)

### `GridSection`
- **Responsabilidad:** activar el `GridLayer` (visible) y mostrar el panel educativo.
- **Props:** ninguna.
- **Estado:** snap del sheet.
- **Mobile:** `GridEducationPanel` en `BottomSheet` (peek→full). **Desktop:** en sidebar, siempre visible.
- **Hijos:** `GridEducationPanel` (+ `BottomSheet` en mobile).

### `GridEducationPanel`
- **Responsabilidad:** mostrar los conceptos del sistema de calles (lista de `GridConcept`).
- **Props:** `concepts: GridConcept[]`.
- **Estado:** —.
- **Mobile:** texto scrolleable dentro del sheet. **Desktop:** columna de lectura (máx ~68ch).
- **Hijos:** —.

---

## 6. Sección Itinerario (features/itinerary)

### `ItinerarySection`
- **Responsabilidad:** orquestar el CRUD del itinerario: lista de días, empty state, FAB, y
  coordinación del modo colocar pin. Es la sección más rica.
- **Props:** ninguna (usa `useItineraryStore` y `useAppStore`).
- **Estado interno:** qué sheet/formulario está abierto; día en edición.
- **Eventos:** dispara acciones del store (crear/editar/eliminar/reordenar día y pin).
- **Mobile:** lista de días en `BottomSheet`; `FAB` "+"; formularios en sheets. **Desktop:** lista y
  formularios en el sidebar; el mapa queda libre para colocar pins.
- **Hijos:** `ItineraryEmptyState`, `DayList`, `DayFormSheet`, `PinFormSheet`, `PinPopover`,
  `PlacePinBanner`, `ConfirmDialog`, `Fab`.

### `ItineraryEmptyState`
- **Responsabilidad:** mostrar el estado vacío con CTA para crear el primer día.
- **Props:** `onCreateFirstDay: () => void`.
- **Hijos:** `Button`.

### `DayList`
- **Responsabilidad:** listar los días (ordenados), permitir reordenar, y expandir un día para ver
  sus lugares. NO edita campos (delega a `DayFormSheet`).
- **Props:**

  | Prop | Tipo | Descripción |
  |---|---|---|
  | `days` | `Day[]` | Días ordenados. |
  | `focusedDayId` | `string \| null` | Día enfocado en el mapa. |
  | `onFocusDay` | `(id: string) => void` | Enfocar/desenfocar día. |
  | `onEditDay` | `(id: string) => void` | Abrir editor. |
  | `onReorder` | `(fromIndex, toIndex) => void` | Nuevo orden. |
  | `onAddPin` | `(dayId: string) => void` | Iniciar colocar pin. |

- **Estado interno:** ítem en arrastre.
- **Mobile:** drag por handle ☰ + botones subir/bajar (fallback). Cada día muestra su color, nombre,
  fecha y contador de lugares. **Desktop:** igual, con hover.
- **Hijos:** `DayListItem`, `PinListItem`.

### `DayListItem`
- **Responsabilidad:** representar un día en la lista (color, nombre, fecha, zona, nº de lugares) y sus
  acciones (enfocar, editar, agregar lugar, expandir).
- **Props:** `day: Day`, `isFocused: boolean`, callbacks (`onFocus`, `onEdit`, `onAddPin`, `onToggleExpand`).
- **Hijos:** lista de `PinListItem` al expandir.

### `PinListItem`
- **Responsabilidad:** representar un lugar dentro de un día (nombre, nota) con acciones editar/eliminar.
- **Props:** `pin: Pin`, `onEdit`, `onDelete`.
- **Hijos:** —.

### `DayFormSheet`
- **Responsabilidad:** formulario de crear/editar día. Valida (nombre requerido). NO persiste directo
  (emite `onSubmit`; el store persiste).
- **Props:**

  | Prop | Tipo | Descripción |
  |---|---|---|
  | `mode` | `'create' \| 'edit'` | Determina título y datos iniciales. |
  | `initialDay?` | `Day` | Datos precargados en edición. |
  | `onSubmit` | `(data) => void` | Guardar. |
  | `onDelete?` | `() => void` | Solo en edit; abre confirmación. |
  | `onCancel` | `() => void` | Cerrar sin guardar. |

- **Estado interno:** valores del form, errores de validación.
- **Mobile:** en `BottomSheet`; se ajusta al teclado. Chips de zona (barrios). **Desktop:** en sidebar.
- **Hijos:** `Input`, `DateField`, `Chip` (zona), `Textarea`, `Button`.

### `PinFormSheet`
- **Responsabilidad:** formulario de crear/editar pin (nombre requerido, nota, reubicar). Coordina con
  el mapa para la ubicación.
- **Props:** `mode`, `initialPin?`, `dayColor: string`, `onSubmit`, `onRelocate: () => void`, `onCancel`.
- **Estado interno:** valores del form.
- **Mobile/Desktop:** análogo a `DayFormSheet`.
- **Hijos:** `Input`, `Textarea`, `Button`.

### `PlacePinBanner`
- **Responsabilidad:** banner superior durante el modo colocar pin ("Tocá el mapa…" + Cancelar).
- **Props:** `onCancel: () => void`.
- **Hijos:** `Button` (ghost).

### `PinPopover`
- **Responsabilidad:** al tocar un pin, mostrar nombre, nota, día, y acciones editar/eliminar.
- **Props:** `pin: Pin`, `dayName: string`, `onEdit`, `onDelete`, `onClose`.
- **Mobile:** mini-sheet o popover anclado. **Desktop:** popover junto al pin.
- **Hijos:** `Button`.

### `Fab`
- **Responsabilidad:** botón flotante "+" para agregar día (o lugar según contexto) en mobile.
- **Props:** `icon`, `label` (a11y), `onClick`.

---

## 7. UI primitives (components/)

Todos siguen el [Design Spec §8](03_DESIGN_SPEC.md). Responsabilidad = presentación + accesibilidad;
no contienen lógica de negocio.

| Componente | Props principales | Notas de comportamiento |
|---|---|---|
| `Button` | `variant` (primary/secondary/ghost/danger/icon), `size`, `loading?`, `disabled?`, `iconLeft?`, `onClick`, `children` | Altura táctil ≥44px; estados del Design Spec §7; `loading` deshabilita y muestra spinner. |
| `BottomSheet` | `open`, `snapPoints`, `initialSnap`, `onClose`, `children` | Handle de arrastre; swipe-down y backdrop cierran; respeta safe-area; scroll interno; se ajusta al teclado. Solo mobile/tablet. |
| `Input` | `label`, `value`, `onChange`, `placeholder?`, `error?`, `type?`, `inputMode?` | Label arriba; estado error con borde/mensaje `color-danger`. |
| `Textarea` | `label`, `value`, `onChange`, `rows?`, `maxLength?` | Autogrow opcional. |
| `DateField` | `label`, `value` (ISO), `onChange` | Usa date picker nativo del OS en mobile. |
| `Select` | `label`, `value`, `options`, `onChange` | En mobile, select nativo. |
| `Chip` | `label`, `selected?`, `color?`, `onClick` | Pill; para elegir zona o filtrar por día; muestra color. |
| `Badge` | `children`, `variant?` (subtle/solid), `color?` | Contadores/estado ("2 días acá"). |
| `SegmentedControl` | `options`, `value`, `onChange` | Indicador deslizante; usado por `MapModeToggle`. |
| `BottomNav` | `items` (3), `active`, `onChange` | Fija abajo (mobile/tablet); safe-area; activo en `color-accent`. |
| `SidebarNav` | `items` (3), `active`, `onChange` | Solo desktop; columna izquierda. |
| `ConfirmDialog` | `open`, `title`, `message`, `confirmLabel`, `variant` (danger), `onConfirm`, `onCancel` | Modal centrado; foco atrapado; Esc = cancelar. |
| `Toast` / `ToastHost` | `message`, `variant`, `duration?` | Autodismiss; cola de toasts; `aria-live`. |

---

## 8. Hooks y utilidades (referencia)

No son componentes pero forman parte del inventario:

- `useMediaQuery(query)` — breakpoint actual (mobile/tablet/desktop).
- `useKeyboardInset()` — alto del teclado en mobile para ajustar sheets.
- `useMapProjection()` — expone `geoToSvg`/`svgToGeo` (envuelve `projection.ts`).
- `lib/dayColor.ts` — asigna color de día por orden de creación (Design Spec §2.5).
- `lib/id.ts` — genera IDs de día/pin.
- `lib/validation.ts` — validaciones de formularios (nombre requerido, etc.).

---

**Anterior:** [06_DATA_MODEL.md](06_DATA_MODEL.md) · **Siguiente:** [08_FEATURE_SPECS/MAP_CORE.md](08_FEATURE_SPECS/MAP_CORE.md)
