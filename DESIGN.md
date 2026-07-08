# NY Explorer — Sistema de diseño (v2, rediseño Claude Design)

Fuente de verdad: prototipo `NY Explorer.dc.html` + screenshots en
`/Users/santiagoromero/Developer/Mapa interactivo de Nueva York/`.
Tokens implementados en `src/app/theme.css`.

## Color (look iOS claro)

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#e9edf0` | fondo del mapa/app |
| `--surface` | `#ffffff` | sheet, sidebar, cards |
| `--control` | `#efeff4` | segmented, chips, inputs |
| `--box` | `#f6f6f9` | cajas informativas (Cómo llegar, tips) |
| `--hairline` / `--border` | `#f2f2f7` / `#ececed` | separadores / bordes de card |
| `--text` | `#1c1c1e` | texto principal, botón visitar |
| `--text-secondary` | `#8e8e93` | subtítulos, metadatos |

Acentos: color por día del itinerario (`DAYS[].color`, paleta iOS), colores oficiales MTA
para subway, `#0A84FF`/`#FF9500` para avenidas/calles del grid.

## Tipografía

Stack del sistema: `-apple-system, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif`.
Escala: título 26/700 (ls -0.02em) · nombre de lugar 21/700 · headers de sección 15/700 ·
filas 14.5/600 · metadatos 12–13/500–600 · labels de caja 11/600 uppercase (ls 0.04em).

## Superficies y radios

Sheet 18px arriba · cards 16px · controles 11px · cajas 12px · pills 999px.
Sombras suaves: sheet `0 -8px 34px rgba(0,0,0,.16)`, cards `0 2px 14px rgba(0,0,0,.05)`.

## Mapa (el mapa ES parte del diseño)

- Basemap **CARTO Positron** vectorial (MapLibre GL); fallback raster `light_all`.
- Barrios: fill 26% + borde 1.5px del color del barrio; etiquetas uppercase 11px negras
  con halo blanco, una por barrio (major).
- Calles: avenidas azules 3.2px (Broadway diagonal 4px) al 50%; calles naranjas 1.6px
  punteadas al 65%; etiquetas de punta de línea con halo blanco.
- Subway: líneas 3.4px con color MTA; estaciones círculo 4px `#333` borde blanco.
- Pines: gota rotada 45° (30px, 40px seleccionada), color del día, borde blanco 2.5px,
  número de parada; visitada = gris `#a1a1a8` con ✓.

## Motion

- Sheet: `transform 340ms cubic-bezier(0.32, 0.72, 0, 1)` (curva de drawer iOS);
  drag con umbral 6px, amortiguación /3 en extremos, snap por flick (>0.4 px/ms) o cercanía.
- Presión en botones/chips: `scale(0.96–0.98)` 160ms ease-out.
- Cards de detalle: entrada `@starting-style` opacity 0 + translateY(8px), 240ms ease-out.
- Cámara del mapa: `easeTo`/`fitBounds` ~550ms.
- `prefers-reduced-motion`: sin transiciones ni animación de pines.

## Layout

- Mobile (<980px): sheet 90dvh con snaps full/mid(46%)/peek(92px); FAB centrar 46px
  arriba del sheet a la derecha.
- Desktop (≥980px): sidebar fija 380px izquierda; zoom control abajo a la derecha;
  chips en wrap.
