# 11 · Rediseño v2 (jul 2026) — "el diseño de Claude Design"

> Este documento **supersede** las partes de los specs 02–08 que contradiga.
> Fuente de verdad visual/interacción: el proyecto de Claude Design en
> `/Users/santiagoromero/Developer/Mapa interactivo de Nueva York/`
> (prototipo `NY Explorer.dc.html` + screenshots). Sistema de diseño: `DESIGN.md` (raíz).

## Qué cambió respecto de v1

| Área | v1 | v2 |
| --- | --- | --- |
| Estructura | Bottom nav 3 secciones + 2 mapas (esquemático/real) | Una pantalla: mapa real siempre de fondo + sheet/sidebar con 4 modos |
| Modos | Barrios / Grid / Itinerario | **Barrios / Calles / Subway / Itinerario** (segmented control iOS) |
| Tema | Oscuro (#0D1117) | Claro iOS (#e9edf0 / blanco), basemap CARTO Positron |
| Itinerario | CRUD completo (días, pines, formularios) | **Solo lectura** (el viaje real 16–24 jul embebido); editable: visitado + notas |
| Barrios | 12 polígonos dibujados a mano | **NTAs reales de Manhattan** (NYC Open Data) empaquetados, fusionados por nombre |
| Subway | no existía | Líneas + estaciones reales (data.ny.gov) con colores MTA, leyenda y "estación más cercana" |
| Datos geo | inline en TS | GeoJSON descargados por `scripts/fetch-geo.mjs` a `src/data/geo/*.json` (sin fetch en runtime) |
| Fotos | no había | Foto real por parada (`scripts/fetch-photos.mjs` → `public/photos/<id>.jpg`, Wikimedia) |
| Sheet mobile | abría/cerraba por sección | **Persistente y arrastrable**: snaps full / mid (46%) / peek (92px), flick por velocidad |

## Arquitectura v2 (resumen)

```
src/
  App.tsx                     shell: MapView + FAB + (BottomSheet | sidebar)
  store/useTripStore.ts       zustand: mode, activeDay, query, selId, selNb,
                              overlays, visited/notes (localStorage), snap, recenter
  data/itinerary.ts           DAYS reales del viaje (fuente: prototipo + ITINERARIO.md)
  data/geo.ts                 barrios fusionados + stops, nearest station, CALLES, leyenda MTA
  data/geo/*.json             GeoJSON empaquetados (barrios, subway líneas/estaciones)
  features/map/MapView.tsx    MapLibre + Positron; capas nb/calles/subway/pines; fits
  features/panels/*           PanelHeader + panel por modo
  components/BottomSheet.tsx  drag con umbral, damping y snap por velocidad
```

## Reglas de interacción clave

- Seleccionar parada (mapa, lista o búsqueda) → detalle con foto, "Cómo llegar",
  visitado y notas; sheet a **full**; mapa centra con offset vertical en mobile.
- Cerrar detalle → sheet vuelve a **mid**.
- Chips de día filtran pines y re-encuadran; "Todo el viaje" muestra los 9 días.
- En Itinerario, la barra **Capas** superpone Barrios/Calles/Subway sin salir del modo.
- Tocar un barrio (mapa o lista, modo Barrios) → card con desc, "Qué ver" y
  "Tus paradas acá" (point-in-polygon precalculado).
- FAB ◎ re-encuadra según modo (Manhattan o día activo).

## Specs previos afectados

- `02_PRD.md` §CRUD itinerario → obsoleto (solo lectura).
- `03_DESIGN_SPEC.md` → reemplazado por `DESIGN.md` (raíz).
- `04_UX_FLOWS.md` flujos de crear/editar/borrar → eliminados; el resto se adapta a 4 modos.
- `06_DATA_MODEL.md` → el modelo editable queda; persisten solo `nyc_visited` y `nyc_notes`.
- `07_COMPONENT_SPEC.md` → componentes v1 (Sheet multi-instancia, Toast, ConfirmDialog,
  formularios) eliminados.
- `08_FEATURE_SPECS/GRID.md` → ahora es el modo "Calles" (mismas ideas, capa sobre mapa real).
