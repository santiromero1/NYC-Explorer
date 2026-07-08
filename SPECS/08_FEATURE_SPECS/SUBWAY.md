# Feature: Subway (v2)

Modo "Subway" del segmented control. Muestra la red real de subte sobre el basemap claro.

## Datos

- `src/data/geo/subway-lines.json` — LineStrings de data.ny.gov (s692-irgq), simplificadas
  (Douglas-Peucker tol 0.0004) y con color oficial MTA resuelto por ruta en build time.
- `src/data/geo/subway-stations.json` — estaciones (39hk-dx4f), dedupe por lat/lng a 4 decimales,
  propiedades `name` y `lines`.
- Empaquetados por `scripts/fetch-geo.mjs`; sin fetch en runtime.

## Mapa

- Capa `subway-lines`: line 3.4px, opacidad 0.85, color por feature, caps redondeados.
- Capa `subway-stations`: círculos 4px `#333` con borde blanco 1.5px.
- Tap en estación → popup chico "Nombre · líneas" (cursor pointer en hover desktop).
- Encadre del modo: bounds de Manhattan con padding según layout.

## Panel

1. Título "Subway de Nueva York" + hint de colores.
2. Leyenda: 9 filas (barra 30×10px color MTA, rutas, avenida troncal).
3. "Estación más cercana a cada parada": lista de las 50 paradas con su estación
   (distancia euclídea con lng corregido ×0.76, precalculada). Tap → modo Itinerario
   con la parada seleccionada.

## Overlay

En modo Itinerario, el pill "Subway" de la barra Capas superpone ambas capas
sin cambiar el panel (color activo `#FF6319`).
