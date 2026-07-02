# 04 · UX Flows — NYC Explorer

> Flujos de usuario completos, descritos en texto y diagramas ASCII, siempre **mobile-first (390px)**
> primero y desktop después. Incluye los estados de UI necesarios (empty, loading, error,
> confirmación). Es el guion de cómo se usa la app. Se puede leer solo.

Convención de los diagramas: `[ ]` pantalla/estado · `( )` acción del usuario · `-->` transición ·
`▸` bottom sheet · `⌂` mapa.

---

## 0. Layout general (referencia mobile)

```
┌─────────────────────────────┐  390px
│  ⌂  MAPA (esquemático/real) │
│                             │
│        [Manhattan]          │
│                   ┌───────┐ │  ← toggle mapa (Esquemático/Real)
│                   │Esq|Real│ │
│                   └───────┘ │
│                       (+)   │  ← FAB (solo en Itinerario)
│                             │
├─────────────────────────────┤
│  🗺 Barrios  # Grid  📋 Itin │  ← bottom nav (3 secciones)
└─────────────────────────────┘
```
Los paneles de contenido aparecen como bottom sheet ▸ que sube desde abajo tapando parte del mapa.

---

## 1. Primer uso

**Decisión: sin onboarding tutorial.** La app se abre directo al mapa. El "onboarding" es la propia
claridad de la UI + los empty states. Razón: es de uso personal y de baja fricción; un tutorial sería
ruido. Solo se muestra, la primera vez, un **hint no bloqueante** sobre el toggle de mapa.

```
(abre la app por primera vez)
   -->
[ Sección: Barrios · Mapa esquemático · Manhattan con 13 zonas ]
   · Hint efímero (3s, descartable): "Tocá una zona para explorarla"
   · Toggle de mapa visible arriba a la derecha
   · Bottom nav abajo
```

Estado inicial por defecto:
- **Sección:** Barrios.
- **Modo de mapa:** `[DECISIÓN TOMADA]` **Esquemático** por defecto. Motivo: es liviano (no depende de
  red ni WebGL), transmite la identidad de la app, y es el mejor primer contacto para "entender la ciudad".
  El usuario puede pasar a real cuando quiera.

---

## 2. Explorar barrios

```
[ Barrios · mapa ]
   (tap en zona "SoHo")
   --> zona SoHo se resalta, resto se atenúa
   --> ▸ sube bottom sheet (snap: half)
        ┌─────────────────────────┐
        │ ▬ (handle)              │
        │ SoHo                    │  h1 + color del barrio
        │ "Compras, arte y cast-  │  vibe (1 línea)
        │  iron architecture"     │
        │ ─────────────────────── │
        │ Descripción (2-3 líneas)│
        │ Spots:                  │
        │  • Spot 1 — desc        │
        │  • Spot 2 — desc        │
        │  ...                    │
        │ 💡 Tip: ...             │
        │ [Badge: 1 día acá]      │  ← si hay días del itinerario en SoHo
        └─────────────────────────┘
   (swipe down / tap backdrop / X) --> cierra sheet, zona vuelve a normal
   (tap en otra zona "Chelsea") --> sheet reemplaza contenido por Chelsea (sin cerrar)
```

**Desktop:** en vez de bottom sheet, el contenido del barrio aparece en el **sidebar izquierdo**;
la zona se resalta en el mapa a la derecha. Tocar otra zona cambia el contenido del sidebar.

Estados: si un barrio no tuviera spots cargados (no debería pasar en MVP), el bloque de spots se
oculta en vez de mostrarse vacío.

---

## 3. Cambiar modo de mapa (esquemático ↔ real)

```
[ cualquier sección · mapa esquemático ]
   (tap segmento "Real")
   --> transición 320ms (crossfade)
   --> mapa real (MapLibre) centrado en la misma zona/zoom aproximado
   --> se preserva: sección activa, barrio seleccionado, día enfocado, pins, overlay de grid
   (tap segmento "Esquemático")
   --> vuelve al esquemático preservando el mismo contexto
```

Loading: si el mapa real tarda en cargar tiles (primera vez / red lenta), se muestra un skeleton
oscuro con spinner `color-accent` sobre el área del mapa; el resto de la UI sigue usable.
Error/offline: si los tiles no cargan (sin red), se muestra un aviso discreto
*"Mapa real no disponible sin conexión — usá el esquemático"* y se ofrece volver al esquemático.

---

## 4. Cambiar de sección (Barrios → Grid → Itinerario)

```
[ Barrios ] --(tap "Grid")--> [ Grid ] --(tap "Itinerario")--> [ Itinerario ]
```
- El **estado del mapa se preserva** entre secciones (posición, zoom, modo).
- Cambiar de sección **cierra** cualquier bottom sheet abierto de la sección anterior.
- La sección activa se marca en la bottom nav (`color-accent`).
- Cada sección activa/desactiva sus overlays: Barrios (zonas interactivas), Grid (líneas + panel),
  Itinerario (pins + FAB).

**Desktop:** las tres secciones son ítems del sidebar; el mapa permanece a la derecha.

---

## 5. Modo Grid: overlay + panel educativo

```
[ Grid ]
   --> sobre el mapa aparecen: streets clave (horizontales), avenidas (verticales),
       Broadway (diagonal) con etiquetas
   --> ▸ bottom sheet (snap: peek) con el panel educativo, expandible a full
        ┌─────────────────────────┐
        │ Cómo funciona la grilla │
        │ • Streets vs Avenues    │
        │ • Uptown / Downtown     │
        │ • Crosstown             │
        │ • Cómo leer una dirección│
        │ • La 5th Ave divide E/O │
        │ • Debajo de la 14th...  │
        └─────────────────────────┘
   (scroll dentro del sheet para leer todo)
   (colapsar a peek) --> se ve más mapa, panel queda accesible abajo
```

Mobile: el panel es largo; se lee en snap `full` con scroll interno. En `peek` solo se ve el título
y el primer concepto. Desktop: el panel educativo vive en el sidebar, siempre visible, con el mapa
mostrando el overlay a la derecha.

---

## 6. Itinerario vacío → primer día → primer lugar

```
[ Itinerario · vacío ]  (EMPTY STATE)
   ┌─────────────────────────┐
   │        📋 (ilustración) │
   │  Todavía no tenés días  │
   │  Armá tu primer día para│
   │  empezar tu viaje       │
   │   [ + Agregar día ]     │  ← CTA primary
   └─────────────────────────┘
   (tap "Agregar día")
   --> ▸ sheet "Nuevo día" (formulario)
        Nombre*      [__________]
        Fecha        [ 📅 ______]
        Zona         [ chips: SoHo · Chelsea · ... ]
        Descripción  [__________]
        [ Cancelar ]  [ Guardar ]
   (Guardar sin nombre) --> error inline "El nombre es obligatorio"
   (Guardar ok)
   --> día creado (color-day-1), aparece en la lista del itinerario
   --> ▸ sheet muestra el día con lista de lugares vacía + [ + Agregar lugar ]
   (tap "Agregar lugar")
   --> flujo de agregar pin (ver §9)
```

---

## 7. Editar un día existente

```
[ Itinerario · lista de días ]
   (tap "⋯" o "editar" en el Día 2)
   --> ▸ sheet "Editar día" con los campos precargados
        Nombre       [ Día 2 - Downtown ]
        Fecha        [ 12/03 ]
        Zona         [ chip SoHo activo ]
        Descripción  [ ... ]
        [ Eliminar día ]        [ Cancelar ] [ Guardar ]
   (edita campos) (Guardar) --> cambios reflejados + persistidos
```
El botón "Eliminar día" dentro del editor dispara el flujo de §8.

---

## 8. Eliminar un día (con confirmación)

```
(tap "Eliminar día")
   --> [ Diálogo de confirmación ]
        ┌─────────────────────────┐
        │ ¿Eliminar "Día 2"?      │
        │ Se borrarán también sus │
        │ 3 lugares. No se puede  │
        │ deshacer.               │
        │   [ Cancelar ] [Eliminar]│  ← Eliminar = botón Danger
        └─────────────────────────┘
   (Cancelar) --> vuelve al editor
   (Eliminar) --> día + sus pins desaparecen de lista y mapa, se persiste,
                  toast breve "Día eliminado"
```

---

## 9. Agregar un pin al mapa (flujo completo)

`[DECISIÓN TOMADA para MVP]` **Tap en el mapa** (colocar/arrastrar marcador). La búsqueda por nombre
(geocoding) es `[v2]`. Motivo: sin backend ni API key, colocar el pin a mano sobre el mapa es lo más
simple y funciona igual en esquemático y real.

```
[ Itinerario · Día 1 abierto ]  (tap "+ Agregar lugar")
   --> entra en MODO COLOCAR PIN
        · el sheet se colapsa a peek para dejar ver el mapa
        · banner arriba: "Tocá el mapa para marcar el lugar"  [Cancelar]
   (tap en el mapa en la posición deseada)
   --> aparece un marcador provisional (color del día) + se puede arrastrar para ajustar
   --> ▸ sheet "Nuevo lugar"
        Nombre*      [__________]   (ej.: "Katz's Deli")
        Nota         [__________]   (opcional)
        Ubicación    [ ✓ marcada en el mapa ]  (tap "reubicar" para volver a tocar)
        [ Cancelar ]  [ Guardar lugar ]
   (Guardar) --> pin queda fijo en el mapa con el color del día,
                 aparece en la lista de lugares del día, se persiste
```

Estados: si el usuario toca "Guardar" sin nombre → error inline. Si cancela en modo colocar → no se
crea nada y el marcador provisional desaparece.

**Desktop:** igual, pero el formulario del lugar aparece en el sidebar mientras el mapa queda libre
para el tap.

---

## 10. Ver detalle de un pin y editarlo/eliminarlo

```
[ mapa con pins ]
   (tap en un pin)
   --> popover/mini-sheet: nombre del lugar, nota, día al que pertenece
        [ Editar ]  [ Eliminar ]
   (Editar) --> sheet con campos (nombre, nota, reubicar) --> Guardar
   (Eliminar) --> confirmación ligera ("¿Eliminar 'Katz's Deli'?") --> quita el pin
```

---

## 11. Reordenar días

`[DECISIÓN PENDIENTE — resuelta en ITINERARY.md]`: se prevé **drag & drop** con un handle (☰) en cada
día, con **botones subir/bajar** como fallback accesible.

```
[ Itinerario · lista ]
   (mantener presionado el handle ☰ del Día 3)
   --> el ítem se "levanta" (elevación + escala)
   (arrastrar sobre el Día 1) --> los demás se corren
   (soltar) --> nuevo orden persiste; los colores de día NO cambian (el color es del día, no de su posición)
```
Nota de diseño: como el color se asigna por orden de **creación** y no de posición, reordenar no
recolorea los días. (Alternativa "color por posición" evaluada en ITINERARY.md.)

---

## 12. Cerrar y reabrir la app (persistencia)

```
(usuario cierra la app / pestaña / la mata)
   --> todo el itinerario + preferencias ya están en localStorage (guardado en cada cambio)
(reabre la app)
   --> [ loading breve mientras hidrata desde localStorage ]
   --> restaura: itinerario completo, sección activa, modo de mapa, (opcional) día enfocado
   --> el usuario ve exactamente lo que dejó
```
Si es la primera vez (sin datos guardados) → empty state del itinerario (§6).

---

## 13. Comportamiento offline

```
(app instalada como PWA / previamente cacheada)
(sin conexión)
   --> abre normalmente (app shell cacheada por el service worker)
   --> Itinerario: 100% funcional (lee/escribe localStorage)
   --> Mapa esquemático: 100% funcional (SVG local, sin red)
   --> Barrios y Grid: 100% funcional (contenido estático empaquetado)
   --> Mapa real: tiles no cargan --> aviso discreto + sugerencia de usar esquemático
   --> al volver la conexión, el mapa real vuelve a funcionar sin recargar
```

---

## 14. Catálogo de estados de UI

| Estado | Dónde aparece | Tratamiento |
|---|---|---|
| **Empty** | Itinerario sin días; día sin lugares | Ilustración + texto + CTA primario claro |
| **Loading** | Hidratación inicial; carga de tiles del mapa real | Skeleton oscuro / spinner `color-accent`; UI no bloqueada donde se pueda |
| **Error — sin red (mapa real)** | Al activar mapa real sin conexión | Aviso discreto no bloqueante + acción "volver a esquemático" |
| **Error — localStorage no disponible** | Modo incógnito / storage lleno / bloqueado | Banner `color-warning`: "Tus cambios no se van a guardar en este dispositivo" |
| **Error — storage lleno al guardar** | Escritura falla por cuota | Toast `color-danger` + no se pierde el estado en memoria; sugerir liberar espacio |
| **Confirmación destructiva** | Eliminar día / pin | Diálogo modal con botón Danger + Cancelar |
| **Success/feedback** | Tras guardar/eliminar | Toast breve (`color-success`/neutral), autodismiss ~2s |
| **Modo colocar pin** | Al agregar lugar | Banner superior con instrucción + Cancelar; sheet colapsado |

---

**Anterior:** [03_DESIGN_SPEC.md](03_DESIGN_SPEC.md) · **Siguiente:** [05_TECHNICAL_ARCHITECTURE.md](05_TECHNICAL_ARCHITECTURE.md)
