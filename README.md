# NYC Explorer

> Explorá Nueva York visualmente y armá tu itinerario de viaje editable, desde el celular.

**NYC Explorer** es una web app mobile-first para entender cómo está organizada Nueva York
(barrios, sistema de calles y grilla) y planificar un viaje día por día, con lugares marcados
sobre un mapa. Ofrece dos vistas del mapa —un mapa **esquemático** estilizado y un mapa **real**—
y un itinerario que persiste localmente. Está pensada para quien visita la ciudad por primera vez
y quiere algo que Google Maps no da: entender *la ciudad*, no solo *dónde está cada punto*.

---

## Qué hace

- **Barrios** — Manhattan dividido en sus 13 zonas principales. Tocás una zona y ves su
  personalidad, qué esperar y sus spots clave.
- **Calles y Grid** — explica visualmente el sistema de grilla de NYC (streets numeradas,
  avenidas, Broadway diagonal, la 5th como divisoria este/oeste, el caos debajo de la 14th).
- **Itinerario** — creás días, agregás lugares con pins en el mapa, editás, reordenás y borrás.
  Todo se guarda en el navegador y sigue ahí cuando volvés.
- **Dos mapas** — esquemático (dark, minimalista, conceptual) y real (MapLibre GL). Alternás
  cuando querés; todos los features funcionan en ambos.
- **Mobile-first & PWA** — instalable en el home screen, funciona con mala conexión.

---

## Stack (resumen)

| Capa | Elección |
|---|---|
| Framework | Vite + React + TypeScript |
| Mapa real | MapLibre GL (tiles CARTO dark, sin API key) |
| Mapa esquemático | SVG propio |
| Estado | Zustand + persistencia en localStorage |
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
| 08 | [Feature Specs](SPECS/08_FEATURE_SPECS/) | [Map Core](SPECS/08_FEATURE_SPECS/MAP_CORE.md) · [Barrios](SPECS/08_FEATURE_SPECS/BARRIOS.md) · [Grid](SPECS/08_FEATURE_SPECS/GRID.md) · [Itinerary](SPECS/08_FEATURE_SPECS/ITINERARY.md) |
| 09 | [Testing Spec](SPECS/09_TESTING_SPEC.md) | Estrategia de testing por capa, casos críticos |
| 10 | [Deployment](SPECS/10_DEPLOYMENT.md) | Deploy, CI, PWA, env vars, checklist de go-live |

---

## Estado del proyecto

🟢 **MVP en desarrollo** — primera versión funcional deployada en Vercel; iterando sobre lo construido.

## Alcance

- **Solo Nueva York**, con foco en **Manhattan**.
- **MVP sin backend ni autenticación**: el itinerario vive en `localStorage`.
- No es un reemplazo de Google Maps para navegación turn-by-turn.
