# 05 · Technical Architecture — NYC Explorer

> Decisiones de stack con justificación, estructura de carpetas, organización del estado,
> arquitectura del mapa (esquemático + real conviviendo), estrategia de overlays, persistencia,
> performance mobile y diagrama de arquitectura. Es el plano técnico. Se puede leer solo.
>
> Recordatorio de alcance: **app personal** para la familia, no producción masiva. Ante la duda,
> gana la opción más simple y de menor mantenimiento.

---

## 1. Stack elegido (con justificación)

| Capa | Elección | Por qué | Alternativas descartadas |
|---|---|---|---|
| **Framework / build** | **Vite + React + TypeScript** | SPA 100% client-side: no hay backend ni SEO crítico, así que SSR es innecesario. Vite da dev server instantáneo, HMR rápido, y un build estático ideal para Vercel. React tiene el ecosistema de mapas y componentes más maduro. TS previene errores en el modelo de datos del itinerario. | **Next.js:** SSR/App Router es overkill sin backend; agrega complejidad. **SvelteKit:** más liviano pero ecosistema de mapas/libs menor. |
| **Lenguaje** | **TypeScript** (strict) | El itinerario y las coordenadas son propensos a errores; los tipos del [Data Model](06_DATA_MODEL.md) son el contrato. | JS plano: sin red de seguridad. |
| **Estilos** | **CSS Modules + design tokens en CSS variables** (`@layer` para orden) | Suficiente para el tamaño del proyecto, sin runtime, tokens del [Design Spec](03_DESIGN_SPEC.md) como CSS vars. Cero costo en bundle. `[DECISIÓN PENDIENTE]` — ver §9. | **Tailwind:** válido y rápido, evaluado en §9. **CSS-in-JS runtime:** agrega peso, malo para mobile. |
| **Estado global** | **Zustand** + middleware `persist` | API mínima, sin boilerplate, persistencia a `localStorage` casi gratis con el middleware `persist`. Perfecto para el `AppState`. | **Redux:** demasiado ceremonial. **Context puro:** re-renders y persistencia manual. |
| **Estado local/formularios** | **React state / hooks** (+ `react-hook-form` si crece) | Los formularios de día/pin son chicos; hooks alcanzan. | Librerías pesadas de forms innecesarias en MVP. |
| **Mapa esquemático** | **SVG propio** (React components) | Control total del estilo dark/minimalista, liviano, funciona offline, animable con CSS. | Canvas: menos accesible y más código para hit-testing. |
| **Mapa real** | **MapLibre GL JS** (via `react-map-gl` o wrapper propio) | Open source, WebGL, **sin API key**, estilo dark customizable, overlays vectoriales (barrios, grid, pins) nativos con GeoJSON. | **Mapbox GL:** requiere token y tiene límites. **Leaflet:** raster, sin WebGL, overlays menos potentes. **Google Maps:** de pago, difícil de coherenciar con dark. |
| **Tiles del mapa real** | Proveedor de tiles vectoriales **gratuito** con estilo dark | Sin costo ni key para uso personal. `[DECISIÓN PENDIENTE]` proveedor exacto — ver §10 y [DEPLOYMENT](10_DEPLOYMENT.md). | — |
| **Persistencia MVP** | **localStorage** (via Zustand `persist`) | Sin backend, sin cuentas; el payload del itinerario es chico. | IndexedDB: más potente pero innecesario para el tamaño. |
| **Persistencia v2** | **Supabase** (Postgres + Auth) | Cuando se quiera sync entre los celulares de la familia. Migración desde localStorage documentada en §8. | Firebase: válido; Supabase se eligió por Postgres/SQL y DX. |
| **PWA / offline** | **vite-plugin-pwa** (Workbox) | Genera manifest + service worker con precache del app shell y contenido estático. | SW a mano: más error-prone. |
| **Routing** | **React Router** (o estado de sección sin URL) | 3 secciones → puede resolverse con estado global. Si se quiere deep-linking/atrás nativo, React Router con rutas `/barrios`, `/grid`, `/itinerario`. `[DECISIÓN PENDIENTE]` — ver §11. | — |
| **Iconos** | **Lucide** (tree-shakeable) | Set lineal consistente (ver Design Spec §11). | — |
| **Testing** | **Vitest** + **React Testing Library** + **Playwright** | Ver [Testing Spec](09_TESTING_SPEC.md). | — |
| **Deploy** | **Vercel** | Deploy estático trivial, preview por commit, gratis, PWA-friendly. Ver [DEPLOYMENT](10_DEPLOYMENT.md). | Netlify/Cloudflare Pages: equivalentes; Vercel pedido explícitamente. |

---

## 2. Estructura de carpetas

```
nyc-explorer/
├── public/
│   ├── manifest.webmanifest
│   ├── icons/                 # íconos PWA (192, 512, maskable)
│   └── data/                  # (opcional) GeoJSON de barrios/grid si se sirve estático
├── src/
│   ├── main.tsx               # entry
│   ├── App.tsx                # shell: layout + nav + router de secciones
│   │
│   ├── app/                   # configuración transversal
│   │   ├── router.tsx
│   │   └── theme.css          # design tokens (CSS variables)
│   │
│   ├── store/                 # estado global (Zustand)
│   │   ├── useAppStore.ts     # AppState: sección, modo mapa, selección
│   │   ├── useItineraryStore.ts # itinerario (días, pins) + persist
│   │   └── persistence.ts     # serialización / migraciones de localStorage
│   │
│   ├── data/                  # datos ESTÁTICOS (contenido)
│   │   ├── neighborhoods.ts   # los 13 barrios (contenido + coords SVG + bounds geo)
│   │   ├── grid.ts            # streets, avenues, Broadway (SVG + geo)
│   │   └── manhattan-shape.ts # silueta de la isla para el SVG
│   │
│   ├── features/
│   │   ├── map/               # NÚCLEO DEL MAPA (ver §5 y MAP_CORE.md)
│   │   │   ├── MapContainer.tsx      # decide esquemático vs real, hospeda overlays
│   │   │   ├── SchematicMap.tsx      # SVG de Manhattan
│   │   │   ├── RealMap.tsx           # MapLibre GL
│   │   │   ├── overlays/
│   │   │   │   ├── NeighborhoodsLayer.tsx
│   │   │   │   ├── GridLayer.tsx
│   │   │   │   └── PinsLayer.tsx
│   │   │   ├── projection.ts         # geo <-> SVG (fuente única de verdad)
│   │   │   └── useMapViewport.ts     # pan/zoom compartido conceptualmente
│   │   ├── neighborhoods/     # sección Barrios (panel, sheet)
│   │   ├── grid/              # sección Grid (panel educativo)
│   │   └── itinerary/         # sección Itinerario (lista, formularios, pins)
│   │
│   ├── components/            # UI primitives (Design Spec §8)
│   │   ├── Button.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── Input.tsx / Textarea.tsx / DateField.tsx / Select.tsx
│   │   ├── Chip.tsx / Badge.tsx
│   │   ├── SegmentedControl.tsx
│   │   ├── BottomNav.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── Toast.tsx
│   │
│   ├── hooks/                 # hooks reutilizables (useMediaQuery, useKeyboardInset...)
│   ├── lib/                   # utils puros (colores de día, ids, validaciones)
│   └── types/                 # tipos compartidos (re-export del Data Model)
│
├── tests/                     # e2e (Playwright)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Organización del estado

Tres ámbitos, con una regla simple: **global** lo que cruza secciones o persiste; **local** lo efímero
de un componente; **server** no existe en MVP.

| Ámbito | Qué vive ahí | Dónde |
|---|---|---|
| **Global — App** | `activeSection`, `mapMode`, `selectedNeighborhoodId`, `focusedDayId`, `isPlacingPin` | `useAppStore` (Zustand). Parte se persiste (sección, modo). |
| **Global — Itinerario** | `Itinerary` completo (días + pins) | `useItineraryStore` (Zustand + `persist` a localStorage) |
| **Local** | Estado de formularios abiertos, snap del sheet, hover, marcador provisional al colocar pin | React state en el componente |
| **Derivado** | Pins visibles según día enfocado, color de un día, "cuántos días en tal barrio" | selectores/`useMemo`, no se guarda |
| **Server** | — (nada en MVP; en v2, Supabase como fuente de verdad sincronizada) | — |

Los datos **estáticos** (barrios, grid, silueta) NO son estado: son módulos importados de `src/data/`,
inmutables, empaquetados en el bundle (disponibles offline).

---

## 4. Diagrama de arquitectura (ASCII)

```
┌───────────────────────────────────────────────────────────────┐
│                          App shell (React)                     │
│  ┌──────────────┐   ┌───────────────────────────────────────┐ │
│  │  BottomNav   │   │            MapContainer               │ │
│  │ Barrios/Grid │   │   ┌─────────────┐  ┌───────────────┐  │ │
│  │  /Itinerario │   │   │ SchematicMap│  │   RealMap     │  │ │
│  └──────┬───────┘   │   │   (SVG)     │  │ (MapLibre GL) │  │ │
│         │           │   └─────┬───────┘  └──────┬────────┘  │ │
│         │           │         │  overlays sobre │           │ │
│         │           │   ┌─────┴─────────────────┴────────┐  │ │
│         │           │   │  Neighborhoods | Grid | Pins   │  │ │
│         │           │   └───────────────┬────────────────┘  │ │
│         │           └───────────────────┼───────────────────┘ │
│         │                               │                     │
│  ┌──────┴───────────────────────────────┴───────────────────┐ │
│  │                    Stores (Zustand)                       │ │
│  │   useAppStore  (sección, mapMode, selección)              │ │
│  │   useItineraryStore  (días + pins)  ──persist──┐          │ │
│  └────────────────────────────────────────────────┼─────────┘ │
│                                                    │           │
│  ┌──────────────────────┐   ┌─────────────────┐    │           │
│  │  Static data (bundle)│   │  projection.ts  │    │           │
│  │  neighborhoods/grid  │   │  geo <-> SVG    │    │           │
│  └──────────────────────┘   └─────────────────┘    │           │
└────────────────────────────────────────────────────┼──────────┘
                                                      │
                              ┌───────────────────────┴─────────┐
                              │   localStorage (MVP)            │
                              │   [v2] Supabase (Postgres+Auth) │
                              └─────────────────────────────────┘
        (offline: service worker precachea app shell + static data + SVG)
        (mapa real: tiles desde proveedor externo — solo con red)
```

---

## 5. Arquitectura del mapa (esquemático + real conviviendo)

El principio central: **un único modelo lógico de "lo que hay en el mapa"** (barrios, grid, pins),
y **dos renderers** que lo dibujan. La selección/estado vive en los stores, no en cada mapa.

```
                        useAppStore / useItineraryStore
                                     │
                                     ▼
                              MapContainer
                (lee mapMode → decide qué renderer montar)
                    │                              │
          mapMode = 'schematic'          mapMode = 'real'
                    ▼                              ▼
            SchematicMap (SVG)                RealMap (MapLibre)
                    │                              │
                    └──────── overlays ────────────┘
              (mismos datos, distinto sistema de coords)
        Neighborhoods / Grid / Pins se dibujan en:
          - SVG: usando coords SVG (projection.geoToSvg si hace falta)
          - Real: usando coords geográficas (lng/lat) como GeoJSON
```

- **`MapContainer`** es el único que sabe qué modo está activo. Monta uno u otro renderer y les pasa
  los overlays. Al cambiar de modo hace un **crossfade** (Design Spec §7, `duration-slow`).
- **`projection.ts`** es la **fuente única de verdad** de la correspondencia geo ↔ SVG (ver §7 y
  [MAP_CORE.md](08_FEATURE_SPECS/MAP_CORE.md)). Todo dato tiene *ambas* representaciones cuando
  aplica (los barrios y el grid las traen precalculadas en `src/data/`; los pins guardan ambas).

## 6. Renderizado de overlays sobre ambos mapas

Cada overlay (Neighborhoods, Grid, Pins) es un componente que recibe el `mapMode` (o se monta dentro
del renderer correspondiente) y dibuja según el sistema de coordenadas:

| Overlay | En esquemático (SVG) | En real (MapLibre) |
|---|---|---|
| **Neighborhoods** | `<path>`/`<rect>` con coords SVG del barrio | capa `fill`+`line` desde GeoJSON de bounds geográficos |
| **Grid** | `<line>` + `<text>` con coords SVG | capa `line` + `symbol` desde GeoJSON de calles/avenidas |
| **Pins** | `<g>` marcador en `(x,y)` SVG del pin | `Marker`/`symbol` en `(lng,lat)` del pin |

La **selección** (barrio activo, día enfocado) se lee del store y ambos renderers reaccionan igual:
resaltan la misma entidad. Así, seleccionar SoHo en esquemático y cambiar a real muestra SoHo
resaltado sin lógica duplicada.

## 7. Coordenadas y proyección

- El mapa esquemático define un **`viewBox`** fijo (dimensiones lógicas, ej. `0 0 400 900`) — ver
  [MAP_CORE.md](08_FEATURE_SPECS/MAP_CORE.md).
- Se definen los **bounds geográficos reales** de Manhattan (lat/lng NO/SE).
- `projection.ts` expone `geoToSvg(lng,lat) → {x,y}` y `svgToGeo(x,y) → {lng,lat}` mediante
  interpolación lineal entre los bounds geográficos y el viewBox. Es aproximada (Manhattan es chico;
  la distorsión es tolerable para uso personal) y **suficiente** para posicionar pins colocados a mano.
- Los pins guardan **ambas** coordenadas al crearse (según el modo en que se colocaron, se deriva la
  otra con la proyección), garantizando que se vean en los dos mapas.

---

## 8. Persistencia

### `[MVP]` localStorage

- El `useItineraryStore` usa el middleware **`persist`** de Zustand con una `key` versionada
  (`nyc-explorer:itinerary:v1`).
- Se guarda en **cada cambio** (el middleware serializa el estado tras cada mutación). Simple y sin
  perder datos; el payload es chico.
- Se persiste también parte del `useAppStore` (sección activa, modo de mapa) para restaurar la vista.
- **Migraciones:** el `persist` soporta `version` + `migrate` para evolucionar el esquema sin romper
  datos viejos. El schema exacto está en [06_DATA_MODEL.md](06_DATA_MODEL.md).
- **Fallo de storage** (incógnito/lleno/bloqueado): se detecta al iniciar; la app sigue funcionando
  **en memoria** y muestra el aviso `color-warning` (UX Flows §14). No se pierde la sesión activa.

### `[v2]` Sync a la nube (Supabase)

```
localStorage (local-first)  ──►  al crear cuenta:
   1. sube el itinerario local a Supabase (tablas del Data Model §Supabase)
   2. marca el dispositivo como sincronizado
   3. en adelante: local-first con sync en background (última escritura gana, por timestamp)
   4. otros dispositivos de la familia leen el mismo itinerario al loguearse
```
El diseño MVP ya deja el camino listo: el store es la única puerta a los datos, así que agregar una
capa de sync detrás no toca los componentes. Detalle en [ITINERARY.md](08_FEATURE_SPECS/ITINERARY.md).

---

## 9. `[DECISIÓN PENDIENTE]` Estilos: CSS Modules vs Tailwind

| Opción | Pros | Contras |
|---|---|---|
| **CSS Modules + CSS vars** (propuesta) | Cero runtime, tokens nativos, sin dependencia, fácil de leer | Más verboso, hay que nombrar clases |
| **Tailwind CSS** | Rápido de escribir, consistencia por utilidades, purga a CSS mínimo | Curva/lectura de className largos; tokens custom requieren config |

Recomendación: **CSS Modules + design tokens** por simplicidad y control del look dark cuidado. Se
puede revisitar si la velocidad de desarrollo lo pide. **A confirmar antes de codear.**

## 10. `[DECISIÓN PENDIENTE]` Proveedor de tiles del mapa real

MapLibre necesita un `style`/tiles. Opciones gratuitas para uso personal: estilos demo de MapLibre,
proveedores con free tier (ej. estilos OSM dark), o tiles auto-servidos (overkill). Se elige uno con
free tier holgado y estilo dark; documentado en [DEPLOYMENT §env vars](10_DEPLOYMENT.md). El
esquemático **no** depende de esto, así que no es bloqueante para el MVP.

## 11. `[DECISIÓN PENDIENTE]` Routing

- **Opción A (simple):** sección en el estado global, sin URL. Menos código; "atrás" del navegador no
  cambia de sección.
- **Opción B (recomendada):** React Router con `/barrios`, `/grid`, `/itinerario` (+ `?map=real`).
  Habilita deep-linking, botón atrás nativo y compartir una vista. Poco costo. **A confirmar.**

---

## 12. Consideraciones de performance mobile

- **Esquemático como default:** liviano, sin WebGL ni red; primer render inmediato.
- **MapLibre lazy-loaded:** se importa dinámicamente al pasar por primera vez a modo real, para no
  cargar WebGL ni tiles si el usuario no lo usa.
- **SVG optimizado:** número de nodos acotado; etiquetas con *declutter* por zoom; `will-change` solo
  en lo animado; evitar re-render del SVG entero en cada pan (transform en un grupo contenedor).
- **Selectores memoizados** en Zustand para no re-renderizar overlays que no cambian.
- **Pins:** si crecieran mucho (no es el caso en un viaje familiar), agrupar; en MVP se dibujan directo.
- **Bundle:** code-splitting por sección; MapLibre en su propio chunk; Inter self-hosted con `font-display: swap`.
- **Imágenes/íconos:** SVG inline o sprite; sin imágenes pesadas en MVP.
- **Reduced motion:** respetar `prefers-reduced-motion` (Design Spec §7).
- **Presupuesto orientativo:** JS inicial (sin MapLibre) < ~200KB gzip; mapa real se paga solo si se usa.

---

**Anterior:** [04_UX_FLOWS.md](04_UX_FLOWS.md) · **Siguiente:** [06_DATA_MODEL.md](06_DATA_MODEL.md)
