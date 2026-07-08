# NY Explorer

> El mapa del viaje familiar a Nueva York (16–24 jul 2026): itinerario, barrios, grid y subway.

**NY Explorer** es una PWA mobile-first con una sola pantalla: el mapa real de la ciudad
siempre de fondo (estilo claro iOS) y un bottom sheet arrastrable —sidebar en desktop— con
cuatro modos. El diseño replica fielmente el prototipo de Claude Design
("Mapa interactivo de Nueva York").

---

## Qué hace

- **Itinerario** — el viaje real, día por día, con pines numerados por color de día,
  foto real de cada parada, "cómo llegar", buscador, marcado de visitado y notas
  (persisten en el navegador). De solo lectura por diseño.
- **Barrios** — los barrios reales de Manhattan (NYC Open Data) coloreados sobre el mapa,
  con descripción, qué ver y tus paradas dentro de cada uno.
- **Calles** — el grid explicado: avenidas azules N–S, calles naranjas E–O, Broadway diagonal.
- **Subway** — líneas y estaciones reales con los colores oficiales MTA, leyenda y la
  estación más cercana a cada parada.
- **Capas** — en Itinerario podés superponer Barrios/Calles/Subway sobre los pines.
- **Offline-friendly** — datos geo y fotos empaquetados; tiles cacheados por el service worker.

---

## Stack (resumen)

| Capa | Elección |
|---|---|
| Framework | Vite + React + TypeScript |
| Mapa | MapLibre GL + basemap CARTO Positron (sin API key) |
| Datos geo | GeoJSON empaquetados (`scripts/fetch-geo.mjs`, NYC Open Data / data.ny.gov) |
| Fotos | Wikimedia, 1 por parada (`scripts/fetch-photos.mjs`) |
| Estado | Zustand; visitado/notas en localStorage |
| Estilos | CSS plano con design tokens (CSS variables) |
| PWA | vite-plugin-pwa (Workbox) |
| Deploy | Vercel |

La justificación detallada de cada decisión está en
[SPECS/05_TECHNICAL_ARCHITECTURE.md](SPECS/05_TECHNICAL_ARCHITECTURE.md).

---

## Cómo correr el proyecto localmente

Requisitos: Node 20+.

```bash
# Instalar dependencias
npm install

# Levantar el entorno de desarrollo (http://localhost:5173)
npm run dev

# Build de producción (typecheck + bundle en dist/)
npm run build

# Servir el build de producción localmente (con PWA/service worker)
npm run preview

# Regenerar los íconos PWA
npm run icons
```

---

## Documentación (SPECS)

Este proyecto sigue **Spec-Driven Design**: primero se documenta todo en detalle, se revisa,
y recién después se programa. Todos los specs están en [`SPECS/`](SPECS/).

| # | Documento | De qué trata |
|---|---|---|
| 00 | [Project Overview](SPECS/00_PROJECT_OVERVIEW.md) | Visión, problema, usuario, MVP vs v2, métricas, índice |
| 01 | [Discovery](SPECS/01_DISCOVERY.md) | Problem statement, persona, oportunidades, decisiones tomadas |
| 02 | [PRD](SPECS/02_PRD.md) | Features, user stories, criterios de aceptación, priorización, riesgos |
| 03 | [Design Spec](SPECS/03_DESIGN_SPEC.md) | Sistema de diseño: colores, tipografía, espaciado, componentes |
| 04 | [UX Flows](SPECS/04_UX_FLOWS.md) | Flujos de usuario completos y estados de UI |
| 05 | [Technical Architecture](SPECS/05_TECHNICAL_ARCHITECTURE.md) | Stack, estructura, estado, arquitectura del mapa, performance |
| 06 | [Data Model](SPECS/06_DATA_MODEL.md) | Tipos TypeScript de todas las estructuras de datos |
| 07 | [Component Spec](SPECS/07_COMPONENT_SPEC.md) | Inventario de componentes en árbol |
| 08 | [Feature Specs](SPECS/08_FEATURE_SPECS/) | [Map Core](SPECS/08_FEATURE_SPECS/MAP_CORE.md) · [Barrios](SPECS/08_FEATURE_SPECS/BARRIOS.md) · [Grid](SPECS/08_FEATURE_SPECS/GRID.md) · [Itinerary](SPECS/08_FEATURE_SPECS/ITINERARY.md) · [Subway](SPECS/08_FEATURE_SPECS/SUBWAY.md) |
| 09 | [Testing Spec](SPECS/09_TESTING_SPEC.md) | Estrategia de testing por capa, casos críticos |
| 10 | [Deployment](SPECS/10_DEPLOYMENT.md) | Deploy, CI, PWA, env vars, checklist de go-live |
| 11 | [Redesign v2](SPECS/11_REDESIGN_V2.md) | **El rediseño actual** (Claude Design): qué cambió y qué supersede |

El sistema de diseño vigente está en [DESIGN.md](DESIGN.md) y el contexto de producto en
[PRODUCT.md](PRODUCT.md).

---

## Estado del proyecto

🟢 **MVP en desarrollo** — primera versión funcional deployada en Vercel; iterando sobre lo construido.

## Alcance

- **Solo Nueva York**, con foco en **Manhattan**.
- **MVP sin backend ni autenticación**: el itinerario vive en `localStorage`.
- No es un reemplazo de Google Maps para navegación turn-by-turn.
