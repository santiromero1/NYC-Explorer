# 00 · Project Overview — NYC Explorer

> Documento raíz. Da la visión del producto, el problema que resuelve, para quién es, qué
> entra en el MVP y qué queda para después, cómo sabemos si funcionó, e índice a todos los
> demás specs. Si sólo vas a leer un archivo, leé este.

> ⚠️ **Rediseño v2 (jul 2026).** La app fue rediseñada para ser fiel al proyecto de
> Claude Design ("Mapa interactivo de Nueva York"): una sola pantalla con mapa claro
> (CARTO Positron) + sheet arrastrable con 4 modos (Barrios/Calles/Subway/Itinerario),
> itinerario real de solo lectura, datos geo reales empaquetados y foto por parada.
> Ver **[11_REDESIGN_V2.md](11_REDESIGN_V2.md)** y **DESIGN.md** (raíz): superseden lo
> que contradigan de este documento y de los specs 02–08 (p. ej. el mapa esquemático
> y el itinerario editable ya no existen).

---

## 1. Qué es NYC Explorer

Una web app **mobile-first** para explorar Nueva York visualmente y convertir un itinerario de
viaje en algo **interactivo y geográfico**, en lugar de un PDF plano. Combina tres cosas:

1. Un mapa de Manhattan que se puede ver de dos formas —**esquemático** (estilizado, conceptual)
   y **real** (MapLibre GL, calles reales)—.
2. Contenido educativo para **entender la ciudad**: qué es cada barrio y cómo funciona el sistema
   de calles/grilla.
3. Un **itinerario editable** día por día, con lugares marcados como pins sobre el mapa, que
   persiste en el navegador.

---

## 2. El problema que resuelve

Cuando una familia viaja a Nueva York por primera vez, arma su plan en un **PDF o documento de
texto**: una lista de días con lugares, notas y horarios. Ese formato tiene tres problemas:

- **No es geográfico.** Leés "Día 3: SoHo, luego Village, luego Chelsea" pero no *ves* dónde
  queda cada cosa ni si el recorrido tiene sentido espacial.
- **No enseña la ciudad.** No te ayuda a entender qué es SoHo, en qué se diferencia del Village,
  ni cómo leer una dirección de NY (que confunde muchísimo la primera vez).
- **Es rígido de editar en el momento.** En pleno viaje, reordenar un día o mover un lugar en un
  PDF es incómodo desde el celular.

Google Maps resuelve "dónde queda X" pero no te explica *cómo está organizada la ciudad* ni te
da un cuaderno de viaje visual y propio. NYC Explorer llena ese hueco puntual.

> **Nota de alcance.** Esto es una herramienta **personal**, para el uso del autor y su familia
> en su viaje. No es un producto para distribución masiva. Todas las decisiones de este spec
> priorizan simplicidad, bajo mantenimiento y utilidad real por sobre escala, monetización o
> métricas de adopción.

---

## 3. Usuario objetivo

**Primario: el autor y su familia**, viajando a Nueva York por primera (o primeras) vez/veces.

- Usan la app **desde el celular**, tanto planificando desde casa como caminando por la ciudad.
- Tienen distintos niveles de familiaridad con NYC (de cero a "vi películas").
- Quieren un plan claro pero **flexible**, que puedan retocar en el momento.
- No son necesariamente técnicos: la app tiene que ser obvia, sin tutoriales.

Persona detallada en [01_DISCOVERY.md](01_DISCOVERY.md).

---

## 4. Las tres secciones

| Sección | Qué hace | Prioridad |
|---|---|---|
| **Barrios** | Manhattan dividido en 13 zonas interactivas. Tap → panel con vibe, descripción, spots y un tip. | Núcleo |
| **Calles y Grid** | Explica el sistema de grilla (streets, avenidas, Broadway, 5th Ave, la 14th). Overlay + panel educativo. | Núcleo |
| **Itinerario** | Crear/editar/reordenar/borrar días y pins sobre el mapa. Persiste local. **La feature más importante.** | **Crítica** |

Las tres funcionan sobre **dos modos de mapa** (esquemático ↔ real) que el usuario alterna.

---

## 5. Alcance del MVP vs. v2

### `[MVP]` — lo que hace falta para usar en el viaje

- Mapa esquemático de Manhattan (SVG) con las 13 zonas.
- Mapa real (MapLibre GL) y switch entre ambos modos.
- Sección **Barrios**: contenido completo de los 13 barrios + panel de info (bottom sheet en mobile).
- Sección **Grid**: overlay de calles/avenidas/Broadway + panel educativo.
- Sección **Itinerario**: CRUD completo de días y pins, reordenar, color por día, pins en ambos mapas.
- **Persistencia en `localStorage`** (sin cuenta, sin backend).
- Funcionamiento **offline** del itinerario y del mapa esquemático.
- **PWA instalable** en el home screen del celular.
- Responsive: mobile primero, desktop usable.

### `[v2]` — deseable, no bloqueante para el viaje

- Cuenta de usuario + **sync a la nube (Supabase)** para compartir el itinerario entre dispositivos de la familia.
- **Exportar/compartir** el itinerario (link o PDF de vuelta, :) ).
- Búsqueda de lugares por nombre (geocoding) al agregar un pin.
- Más ciudades / más de Manhattan (los otros boroughs).
- Fotos por spot o por pin.

### Fuera de alcance (Non-goals)

- Navegación turn-by-turn (para eso está Google Maps).
- Reservas, precios, horarios en vivo, o cualquier dato dinámico de terceros.
- Autenticación en el MVP.
- Backend propio en el MVP.
- Otras ciudades además de NYC; dentro de NYC, foco en Manhattan.

---

## 6. Métricas de éxito

Al ser una herramienta personal, el éxito es **cualitativo y binario**: ¿la usamos en el viaje y
nos resultó mejor que el PDF? Aterrizado en señales concretas:

- ✅ El itinerario completo del viaje está cargado en la app antes de viajar.
- ✅ Durante el viaje, abrimos la app para consultar el plan del día (en vez del PDF).
- ✅ Editamos al menos un día/lugar **en el momento** desde el celular sin fricción.
- ✅ Entendemos una dirección de NY usando lo aprendido en la sección Grid.
- ✅ La app carga y funciona con mala señal / offline al menos para ver el itinerario.
- ✅ Cero pérdida de datos del itinerario entre sesiones.

No se miden: usuarios activos, retención, conversión, ni performance a escala.

---

## 7. Índice de specs

| # | Documento | Contenido |
|---|---|---|
| 00 | **Project Overview** (este archivo) | Visión, problema, usuario, MVP/v2, métricas |
| 01 | [Discovery](01_DISCOVERY.md) | Problem statement, persona, oportunidades, decisiones |
| 02 | [PRD](02_PRD.md) | Features, user stories, criterios de aceptación, priorización, riesgos |
| 03 | [Design Spec](03_DESIGN_SPEC.md) | Colores, tipografía, espaciado, breakpoints, componentes |
| 04 | [UX Flows](04_UX_FLOWS.md) | Flujos de usuario y estados de UI |
| 05 | [Technical Architecture](05_TECHNICAL_ARCHITECTURE.md) | Stack + justificación, estructura, estado, mapa, performance |
| 06 | [Data Model](06_DATA_MODEL.md) | Tipos TypeScript de todas las estructuras |
| 07 | [Component Spec](07_COMPONENT_SPEC.md) | Inventario de componentes en árbol |
| 08 | Feature Specs | [Map Core](08_FEATURE_SPECS/MAP_CORE.md) · [Barrios](08_FEATURE_SPECS/BARRIOS.md) · [Grid](08_FEATURE_SPECS/GRID.md) · [Itinerary](08_FEATURE_SPECS/ITINERARY.md) |
| 09 | [Testing Spec](09_TESTING_SPEC.md) | Estrategia de testing por capa, casos críticos |
| 10 | [Deployment](10_DEPLOYMENT.md) | Deploy, CI, PWA, env vars, checklist |

---

## 8. Decisiones tecnológicas (resumen)

Elegidas al inicio; justificación completa en [05_TECHNICAL_ARCHITECTURE.md](05_TECHNICAL_ARCHITECTURE.md).

| Decisión | Elección | Motivo corto |
|---|---|---|
| Framework | Vite + React + TS | SPA liviana, sin necesidad de SSR/backend, deploy trivial |
| Mapa real | MapLibre GL | Open source, sin API key, dark customizable, WebGL |
| Mapa esquemático | SVG propio | Control total del estilo, liviano, funciona offline |
| Estado | Zustand + localStorage | Simple, persistencia trivial, sin boilerplate |
| Idioma | Español | Es para la familia; contenido y UI en español |
| Deploy | (ver spec 10) | Estático, gratis, PWA-friendly |

---

**Siguiente:** [01_DISCOVERY.md](01_DISCOVERY.md) — el problema y la persona en profundidad.
