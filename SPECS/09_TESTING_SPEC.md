# 09 · Testing Spec — NYC Explorer

> Estrategia de testing por capa y herramienta, tests unitarios / integración / E2E, testing en mobile,
> accesibilidad (WCAG 2.1 AA) y la lista de casos críticos que no pueden fallar antes de un deploy.
> Se puede leer solo.
>
> Recordatorio de alcance: **app personal**. El testing es proporcional: foco fuerte en lo que
> **no se puede perder** (el itinerario) y en los **flujos que se usan en el viaje**; sin obsesión por
> cobertura del 100% ni testear datos estáticos triviales.

---

## 1. Estrategia por capa

| Capa | Qué se testea | Herramienta |
|---|---|---|
| **Unitaria** | Lógica pura: CRUD del itinerario, asignación de color de día, validaciones, proyección geo↔SVG, serialización/migración de localStorage | **Vitest** |
| **Integración** | Componentes con estado: formularios de día/pin, lista de días (reordenar), panel de barrio, toggle de mapa, overlays leyendo del store | **Vitest + React Testing Library** |
| **E2E** | Flujos completos de usuario en un navegador real, mobile viewport | **Playwright** |
| **Accesibilidad** | Auditoría WCAG en páginas/estados clave | **axe** (via `@axe-core/playwright`) + revisión manual de teclado |
| **Estático** | Tipos y lint | **tsc** (strict) + **ESLint** en CI |

Pirámide: **muchos** unitarios (baratos, rápidos), **algunos** de integración (los componentes con
estado real), **pocos** E2E (los flujos críticos). No se testean: datos editoriales estáticos
(contenido de barrios/grid), estilos puros.

---

## 2. Tests unitarios

### 2.1 Lógica del itinerario (prioridad máxima — es lo que no se puede perder)
- **CRUD de días:** crear (asigna id/color/order/createdAt), editar (preserva id/color), eliminar
  (quita también sus pins), reordenar (recalcula `order`, **no** cambia colores).
- **CRUD de pins:** agregar a un día (order correcto), editar (incl. reubicar → actualiza ambas coords),
  eliminar. Eliminar un día elimina sus pins en cascada.
- **Validaciones:** nombre de día requerido; nombre de pin requerido; límites de longitud.
- **Color de día:** el día N recibe el color esperado por orden de creación; ciclo tras 10; estable ante
  reorden/borrado.

### 2.2 Persistencia
- Serializar → deserializar un `Itinerary` produce el mismo objeto (round-trip).
- Hidratación desde una clave inexistente → estado vacío (empty state).
- Hidratación desde una versión vieja → corre `migrate` y no pierde datos.
- localStorage no disponible (mock que lanza) → store en memoria + flag `storageUnavailable`.
- Cuota excedida (mock que lanza en `setItem`) → no rompe; estado en memoria intacto.

### 2.3 Utils del mapa
- `geoToSvg` / `svgToGeo`: round-trip dentro de tolerancia; puntos de los bounds mapean a las esquinas
  esperadas del viewBox; la latitud mayor da `y` menor (eje invertido).
- Equivalencia de zoom esquemático↔real dentro de rango razonable.

---

## 3. Tests de integración

- **`DayFormSheet`:** submit sin nombre muestra error y no llama `onSubmit`; submit válido llama
  `onSubmit` con los datos correctos; modo edit precarga campos; seleccionar/deseleccionar zona.
- **`PinFormSheet`:** validación de nombre; "Reubicar" dispara el modo colocar; guardar incluye coords.
- **`DayList`:** reordenar por botones subir/bajar cambia el orden en el store; el color de cada día no
  cambia tras reordenar.
- **`NeighborhoodPanel`:** muestra vibe/descripcion/spots/tip; el badge de "N días acá" refleja el store;
  cambiar de barrio reemplaza el contenido.
- **`MapModeToggle`:** cambia `mapMode`; los overlays (mock) reciben el nuevo modo; la selección de barrio
  y los pins se preservan al cambiar de modo.
- **Overlays ↔ store:** seleccionar un barrio en un overlay setea `selectedNeighborhoodId`; enfocar un
  día filtra los pins visibles.

---

## 4. Tests E2E (flujos críticos)

Ejecutados en Playwright con viewport mobile por defecto (ver §5). Cada uno es un "no puede fallar":

1. **Crear itinerario desde cero:** abrir app → empty state → crear Día 1 (con nombre) → aparece en la
   lista con color.
2. **Agregar un pin:** en Día 1 → "Agregar lugar" → tocar el mapa → completar nombre → guardar → el pin
   aparece en el mapa y en la lista del día.
3. **Persistencia:** crear día + pin → recargar la página → el itinerario sigue ahí (día, pin, nombres).
4. **Cambiar modo de mapa:** con un barrio seleccionado y pins cargados → pasar de esquemático a real →
   el barrio sigue seleccionado y los pins se ven → volver a esquemático → todo se conserva.
5. **Eliminar día con confirmación:** eliminar → aparece diálogo → confirmar → el día y sus pins
   desaparecen de lista y mapa; recargar confirma que no volvieron.
6. **Explorar barrio:** sección Barrios → tocar SoHo → panel con contenido → cerrar → tocar Chelsea →
   panel cambia de contenido.
7. **Navegación entre secciones:** Barrios → Grid → Itinerario preserva el estado del mapa; el overlay de
   grid aparece solo en Grid.
8. **Reordenar días:** con 3 días → mover el Día 3 al principio → el orden persiste tras recargar; los
   colores no cambiaron.

---

## 5. Testing en mobile

- **Viewports a testear en E2E:** 390×844 (iPhone base, principal), 360×800 (Android chico), y 768×1024
  (tablet) para validar el layout intermedio. Desktop 1280+ como control secundario.
- **Touch events:** Playwright con `hasTouch: true`; simular tap (colocar pin, seleccionar barrio),
  swipe-down (cerrar bottom sheet) y drag (reordenar días, arrastrar marcador provisional).
- **Teclado móvil:** verificar que al enfocar un input dentro de un bottom sheet, el sheet se eleva y el
  campo queda visible (no tapado por el teclado).
- **Safe areas:** validar que bottom nav y sheets respetan el área segura (no se testea automático;
  chequeo manual en dispositivo/simulador).
- **Offline (E2E):** con la PWA cacheada, cortar la red (Playwright `context.setOffline(true)`) → el
  itinerario y el mapa esquemático siguen funcionando; el mapa real muestra el aviso de "sin conexión".

---

## 6. Accesibilidad (WCAG 2.1 AA mínimo)

Auditorías a correr:
- **axe automatizado** sobre cada estado clave: mapa (Barrios), panel de barrio abierto, sección Grid con
  panel, Itinerario (empty, con días, formularios abiertos, diálogo de confirmación).
- **Navegación por teclado (manual):** Tab recorre nav, controles del mapa, zonas de barrio y pins en
  orden lógico; Enter/Espacio activan; Esc cierra sheets/diálogos; el foco se atrapa dentro de
  diálogos/sheets modales y vuelve al disparador al cerrar.
- **Foco visible:** anillo `color-accent` presente en todos los interactivos (Design Spec §7).
- **Contraste:** texto cumple AA (≥4.5:1 normal, ≥3:1 grande) sobre el fondo dark; validar colores de
  barrio/día usados detrás de texto o con halo cuando hagan de etiqueta.
- **Alternativa textual del mapa:** verificar que el itinerario y los barrios son usables sin el mapa
  (toda la info está en las listas/paneles); `aria-label` en zonas y pins ([MAP_CORE §9](08_FEATURE_SPECS/MAP_CORE.md)).
- **Reduced motion:** con `prefers-reduced-motion` activo, las transiciones se reducen y nada depende de
  animación para entenderse.
- **Formularios:** labels asociados, mensajes de error con `aria-describedby`, estados de error no solo
  por color.

---

## 7. Lista de test cases críticos (gate de deploy)

**Ninguno de estos puede fallar antes de un deploy a producción:**

| # | Caso | Por qué es crítico |
|---|---|---|
| C1 | Crear día + pin y **recargar**: los datos persisten | Es la promesa central (reemplaza al PDF) |
| C2 | Eliminar día pide confirmación y borra en cascada sus pins | Pérdida de datos accidental |
| C3 | El color de un día **no cambia** al reordenar/borrar otros | Coherencia visual del mapa |
| C4 | Cambiar de modo de mapa preserva selección, foco y pins | Feature diferencial (dos mapas) |
| C5 | Con localStorage no disponible, la app **no crashea** y avisa | Robustez en incógnito |
| C6 | Offline: itinerario + mapa esquemático funcionan sin red | Requisito de uso caminando |
| C7 | La app **instala como PWA** y abre en standalone | Requisito explícito del usuario |
| C8 | Sin errores de `tsc` (strict) ni de ESLint | Base de calidad |
| C9 | axe sin violaciones críticas en los estados clave | Accesibilidad mínima |
| C10 | Agregar pin coloca el marcador donde se tocó, en ambos modos | Correctitud de la proyección |

Estos casos están cubiertos por la combinación de E2E (§4), integración (§3) y unitarios (§2), y se
corren en CI antes de permitir el merge/deploy (ver [DEPLOYMENT §CI](10_DEPLOYMENT.md)).

---

**Anterior:** [08_FEATURE_SPECS/ITINERARY.md](08_FEATURE_SPECS/ITINERARY.md) · **Siguiente:** [10_DEPLOYMENT.md](10_DEPLOYMENT.md)
