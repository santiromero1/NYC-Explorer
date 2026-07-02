# 06 · Data Model — NYC Explorer

> Todas las estructuras de datos del sistema, como tipos TypeScript con su descripción. **Es el
> único spec donde se permite código, y solo tipos** (interfaces/types/enums), no implementación.
> Estos tipos son el contrato entre el estado, la persistencia y los componentes. Se puede leer solo.

Convenciones:
- IDs como `string` (ULIDs/UUIDs generados en cliente).
- Coordenadas SVG en unidades del `viewBox` del mapa esquemático (ver [MAP_CORE](08_FEATURE_SPECS/MAP_CORE.md)).
- Coordenadas geográficas como `{ lng, lat }` (orden lng-lat, consistente con MapLibre/GeoJSON).
- Fechas como `string` ISO `YYYY-MM-DD` (sin hora; el itinerario es por día).

---

## 1. Tipos de coordenadas y geometría

```ts
/** Punto en el sistema de coordenadas del SVG esquemático (unidades del viewBox). */
export interface SvgPoint {
  x: number;
  y: number;
}

/** Punto geográfico real. Orden lng-lat para alinear con MapLibre/GeoJSON. */
export interface GeoPoint {
  lng: number;
  lat: number;
}

/** Caja geográfica (bounds). Usada para los bounds de Manhattan y de cada barrio. */
export interface GeoBounds {
  /** Esquina noroeste (top-left en pantalla). */
  northWest: GeoPoint;
  /** Esquina sureste (bottom-right en pantalla). */
  southEast: GeoPoint;
}

/**
 * Forma de un barrio en el SVG esquemático.
 * - 'rect': se describe con x, y, width, height (rectángulo redondeado).
 * - 'polygon': lista de puntos para formas irregulares (ej. Central Park, isla).
 */
export type SvgShape =
  | { kind: 'rect'; x: number; y: number; width: number; height: number; radius?: number }
  | { kind: 'polygon'; points: SvgPoint[] };
```

---

## 2. Barrios (`Neighborhood`)

Datos **estáticos** (no cambian en runtime; viven en `src/data/neighborhoods.ts`).

```ts
/** Un spot destacado dentro de un barrio. */
export interface Spot {
  /** Nombre del lugar, en inglés (como se conoce en NY). Ej: "Katz's Delicatessen". */
  name: string;
  /** Descripción breve (1 oración) de por qué vale la pena. En español. */
  description: string;
  /**
   * Ubicación geográfica aproximada del spot (opcional en MVP).
   * Sirve para, en v2, sugerir agregarlo como pin al itinerario.
   */
  geo?: GeoPoint;
}

/** Identificadores estables de los 13 barrios del MVP. */
export type NeighborhoodId =
  | 'fidi'          // Financial District
  | 'tribeca'
  | 'soho'
  | 'greenwich-village'
  | 'east-village'
  | 'lower-east-side'
  | 'chelsea'
  | 'flatiron'      // Flatiron / Union Square
  | 'midtown'
  | 'upper-west-side'
  | 'upper-east-side'
  | 'central-park'
  | 'harlem';

/** Un barrio de Manhattan con su contenido editorial y su representación en ambos mapas. */
export interface Neighborhood {
  id: NeighborhoodId;
  /** Nombre visible, en inglés. Ej: "Greenwich Village". */
  name: string;
  /** Slug URL-safe (coincide con id en el MVP). */
  slug: string;
  /** Personalidad en una línea. En español. Ej: "Bohemio, arbolado y de calles torcidas". */
  vibe: string;
  /** Descripción de 2-3 oraciones. En español. */
  description: string;
  /** 4-6 spots clave. */
  spots: Spot[];
  /** Tip práctico (1 línea): mejor momento, cómo llegar, o dato útil. En español. */
  tip: string;
  /** Color propio del barrio (hex), del Design Spec §2.4. Ej: "#A44FD0". */
  color: string;
  /** Forma en el SVG esquemático. */
  svgShape: SvgShape;
  /** Punto para anclar la etiqueta de nombre en el SVG. */
  svgLabelAnchor: SvgPoint;
  /** Bounds geográficos reales, para dibujar el barrio sobre el mapa real. */
  geoBounds: GeoBounds;
  /**
   * (Opcional) Polígono geográfico más fiel para el mapa real. Si está, se usa en vez de geoBounds
   * para el fill. Lista de puntos que cierran el polígono.
   */
  geoPolygon?: GeoPoint[];
}
```

---

## 3. Grid: calles y avenidas (`Street`, `Avenue`, `Broadway`)

Datos **estáticos** (`src/data/grid.ts`). Ver contenido completo en [GRID](08_FEATURE_SPECS/GRID.md).

```ts
/** Nivel de importancia para decidir qué se muestra según zoom / relevancia. */
export type GridImportance = 'key' | 'secondary';

/**
 * Una calle numerada (corre este-oeste / crosstown).
 * En el SVG es una línea horizontal a una `svgY` fija.
 */
export interface Street {
  /** Ej: "42nd St". */
  label: string;
  /** Número de la calle (42 para 42nd St). Para ordenar/etiquetar. */
  number: number;
  /** Posición vertical en el SVG (unidades del viewBox). */
  svgY: number;
  /** Latitud real aproximada de la calle (constante a lo largo de la calle). */
  geoLat: number;
  importance: GridImportance;
}

/**
 * Una avenida (corre norte-sur).
 * En el SVG es una línea vertical a una `svgX` fija.
 */
export interface Avenue {
  /** Ej: "5th Ave". */
  label: string;
  /** Posición horizontal en el SVG (unidades del viewBox). */
  svgX: number;
  /** Longitud real aproximada de la avenida (constante a lo largo). */
  geoLng: number;
  importance: GridImportance;
}

/**
 * Broadway: la excepción diagonal. Se describe como una polilínea, no como línea recta,
 * porque cruza la isla en diagonal (y quiebra en Times Square, etc.).
 */
export interface BroadwayLine {
  label: 'Broadway';
  /** Trazado en el SVG (polilínea de puntos). */
  svgPath: SvgPoint[];
  /** Trazado geográfico (polilínea de puntos lng/lat). */
  geoPath: GeoPoint[];
}

/** Conjunto completo de datos del grid. */
export interface GridData {
  streets: Street[];
  avenues: Avenue[];
  broadway: BroadwayLine;
}

/** Un concepto del panel educativo del Grid. */
export interface GridConcept {
  /** Título del concepto. Ej: "Streets vs. Avenues". */
  title: string;
  /** Explicación en español (1-3 oraciones). */
  body: string;
  /** (Opcional) Ejemplo concreto. Ej: "W 23rd St & 7th Ave". */
  example?: string;
}
```

---

## 4. Itinerario (`Itinerary`, `Day`, `Pin`)

Datos **de usuario** (mutables, persistidos). Viven en `useItineraryStore`.

```ts
/** Un lugar marcado en el mapa dentro de un día. */
export interface Pin {
  id: string;
  /** Día al que pertenece. */
  dayId: string;
  /** Nombre del lugar. Ej: "Katz's Deli". Requerido. */
  name: string;
  /** Nota opcional del usuario. */
  note?: string;
  /** Coordenada en el SVG esquemático. */
  svg: SvgPoint;
  /** Coordenada geográfica real. */
  geo: GeoPoint;
  /** Orden dentro del día (para listar en secuencia). */
  order: number;
  /** Timestamp de creación (epoch ms) — útil para orden estable y sync futuro. */
  createdAt: number;
}

/** Un día del itinerario. */
export interface Day {
  id: string;
  /** Nombre del día. Requerido. Ej: "Día 1 - Downtown". */
  name: string;
  /** Fecha ISO YYYY-MM-DD. Opcional. */
  date?: string;
  /** Zona principal del día (barrio). Opcional. */
  neighborhoodId?: NeighborhoodId;
  /** Descripción libre del día. Opcional. */
  description?: string;
  /** Color asignado (hex), de la paleta de días (Design Spec §2.5). */
  color: string;
  /** Posición del día en la secuencia del itinerario (0-based). */
  order: number;
  /** Pins del día. (También referenciables vía Pin.dayId; se guardan anidados aquí.) */
  pins: Pin[];
  /** Timestamp de creación (epoch ms). Base para asignar color por orden de creación. */
  createdAt: number;
}

/** El itinerario completo del usuario. */
export interface Itinerary {
  /** Lista ordenada de días. */
  days: Day[];
  /** Versión del esquema para migraciones de localStorage. */
  schemaVersion: number;
  /** Última modificación (epoch ms) — base para sync en v2. */
  updatedAt: number;
}
```

---

## 5. Estado global de la app (`AppState`, enums)

```ts
/** Las tres secciones de la app. */
export enum AppSection {
  Neighborhoods = 'barrios',
  Grid = 'grid',
  Itinerary = 'itinerario',
}

/** Modo de visualización del mapa. */
export enum MapMode {
  Schematic = 'schematic', // mapa esquemático (SVG)
  Real = 'real',           // mapa real (MapLibre)
}

/** Viewport lógico del mapa (compartido conceptualmente entre modos). */
export interface MapViewport {
  /** Centro geográfico. */
  center: GeoPoint;
  /** Nivel de zoom (escala; el esquemático lo interpreta a su manera). */
  zoom: number;
}

/** Estado global de la aplicación (no incluye el itinerario, que tiene su propio store). */
export interface AppState {
  activeSection: AppSection;
  mapMode: MapMode;
  /** Barrio seleccionado actualmente (o null). */
  selectedNeighborhoodId: NeighborhoodId | null;
  /** Día "enfocado" en el itinerario (para filtrar pins en el mapa), o null = todos. */
  focusedDayId: string | null;
  /** true mientras el usuario está en el flujo de colocar un pin. */
  isPlacingPin: boolean;
  /** Viewport actual del mapa (se preserva entre secciones y modos). */
  viewport: MapViewport;
}
```

---

## 6. Persistencia en localStorage (schema)

El estado se serializa vía el middleware `persist` de Zustand. Se usan **dos claves**: una para el
itinerario (datos valiosos) y otra para preferencias de UI (recreables).

```ts
/** Clave: "nyc-explorer:itinerary:v1" */
export interface PersistedItinerary {
  /** Versión del esquema persistido. Debe coincidir con Itinerary.schemaVersion. */
  version: number;
  /** El itinerario completo. */
  state: {
    itinerary: Itinerary;
  };
}

/** Clave: "nyc-explorer:prefs:v1" — preferencias de UI, no críticas. */
export interface PersistedPrefs {
  version: number;
  state: {
    activeSection: AppSection;
    mapMode: MapMode;
    /** Última posición del mapa, para restaurar la vista. */
    viewport: MapViewport;
    /** Si ya se mostró el hint de primer uso. */
    hasSeenIntroHint: boolean;
  };
}
```

**Serialización / deserialización:**
- Al **guardar:** el store se serializa a JSON en cada cambio. Los `Pin` y `Day` son planos (sin
  funciones ni clases), así que `JSON.stringify` alcanza.
- Al **hidratar:** se parsea; si `version` no coincide, corre `migrate(persistedState, fromVersion)`
  para transformar al esquema actual.
- **Fallo:** si `localStorage` lanza (incógnito/lleno), el store queda solo en memoria y se emite un
  flag `storageUnavailable` que la UI usa para el aviso (UX Flows §14).
- **Tamaño:** un itinerario típico de viaje familiar (≤ ~15 días, ≤ ~150 pins) pesa muy por debajo del
  límite de ~5MB de localStorage. Sin riesgo real de cuota.

**Ejemplo de migración (forma, no implementación):**
```ts
type Migrate = (persisted: unknown, fromVersion: number) => PersistedItinerary['state'];
// v1 -> v2 (futuro): agregar campo, renombrar, etc., preservando datos existentes.
```

---

## 7. Schema de Supabase `[v2]`

Para sync a la nube entre dispositivos de la familia. Postgres. Definido como tipos que reflejan las
tablas (la DDL real se escribirá en v2). RLS: cada usuario ve solo sus filas.

```ts
/** Tabla: users (gestionada por Supabase Auth). */
export interface DbUser {
  id: string;            // uuid (auth.users.id)
  email: string;
  created_at: string;    // timestamptz
}

/** Tabla: itineraries — un itinerario por usuario (o varios, si se quiere multi-viaje). */
export interface DbItinerary {
  id: string;            // uuid, PK
  user_id: string;       // FK -> users.id
  title: string;         // ej: "NYC 2026"
  schema_version: number;
  created_at: string;    // timestamptz
  updated_at: string;    // timestamptz (base para "última escritura gana")
}

/** Tabla: days — FK a itineraries. */
export interface DbDay {
  id: string;            // uuid, PK
  itinerary_id: string;  // FK -> itineraries.id (ON DELETE CASCADE)
  name: string;
  date: string | null;   // date
  neighborhood_id: string | null; // texto (NeighborhoodId)
  description: string | null;
  color: string;         // hex
  order: number;         // int
  created_at: string;    // timestamptz
}

/** Tabla: pins — FK a days. */
export interface DbPin {
  id: string;            // uuid, PK
  day_id: string;        // FK -> days.id (ON DELETE CASCADE)
  name: string;
  note: string | null;
  svg_x: number;         // double precision
  svg_y: number;
  geo_lng: number;       // double precision
  geo_lat: number;
  order: number;         // int
  created_at: string;    // timestamptz
}
```

Relaciones: `users 1─N itineraries 1─N days 1─N pins`. Borrado en cascada.
Índices sugeridos: `days(itinerary_id, order)`, `pins(day_id, order)`.
RLS: políticas que filtran por `user_id = auth.uid()` a través de la cadena de FKs.

**Migración localStorage → Supabase (v2):** al crear cuenta, se toma el `Itinerary` de localStorage,
se crea una fila `itineraries` y se insertan `days`/`pins` mapeando 1:1 desde los tipos del MVP
(los IDs de cliente pueden reutilizarse como PKs para idempotencia).

---

**Anterior:** [05_TECHNICAL_ARCHITECTURE.md](05_TECHNICAL_ARCHITECTURE.md) · **Siguiente:** [07_COMPONENT_SPEC.md](07_COMPONENT_SPEC.md)
