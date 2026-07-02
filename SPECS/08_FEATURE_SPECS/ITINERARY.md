# 08 · Feature Spec — ITINERARY

> Especificación de la feature central: el **itinerario editable**. Cubre todos los casos de uso (CRUD
> de días y pins, reordenar, ver detalle), el formulario de día, el flujo de agregar pin, el empty
> state, la lógica de colores, la persistencia, y las estrategias de export/sync para v2. Se puede
> leer solo.

Contexto: el itinerario reemplaza al PDF de viaje. El usuario crea **días** (con nombre, fecha, zona,
descripción) y dentro de cada uno agrega **lugares** (pins) sobre el mapa. Cada día tiene su color;
los pins se ven sobre el mapa (esquemático o real). Todo persiste localmente. Tipos en
[DATA_MODEL §4](../06_DATA_MODEL.md).

---

## 1. Casos de uso (flujo detallado)

### 1.1 Crear día
1. Desde la lista (o el empty state) el usuario toca **"+ Agregar día"** (FAB en mobile).
2. Se abre `DayFormSheet` en modo `create`.
3. Completa **nombre** (requerido) y, opcionalmente, fecha, zona (chip de barrio) y descripción.
4. **Guardar:** se crea un `Day` con `id`, `color` asignado (§5), `order` = último+1, `createdAt`,
   `pins: []`. Se persiste. El sheet se cierra (o pasa a mostrar el día para agregarle lugares).
5. Validación: sin nombre → error inline; no se guarda.

### 1.2 Editar día
1. En un `DayListItem`, tocar **editar** (⋯).
2. `DayFormSheet` en modo `edit` con campos precargados.
3. Cambiar campos → **Guardar** → actualiza el `Day`, persiste, refleja en lista y mapa.
4. Cambiar la **zona** de un día actualiza el conteo que ven los paneles de Barrios (§Conexión en
   [BARRIOS §4](BARRIOS.md)).

### 1.3 Eliminar día (con confirmación)
1. Desde el editor, **"Eliminar día"**, o acción de borrar en el ítem.
2. `ConfirmDialog`: *"¿Eliminar 'Día X'? Se borrarán también sus N lugares. No se puede deshacer."*
3. Confirmar → se eliminan el día y **sus pins**; desaparecen de lista y mapa; se persiste; toast breve.
4. Cancelar → no pasa nada.

### 1.4 Reordenar días
`[DECISIÓN TOMADA]` **Drag & drop por handle (☰) + botones subir/bajar como fallback accesible.**
Motivo: el drag es natural en mobile; los botones garantizan accesibilidad por teclado/lectores.
1. Mantener presionado el handle ☰ → el ítem se "levanta" (elevación + escala).
2. Arrastrar sobre otra posición → los demás se corren; soltar fija el nuevo orden.
3. Se recalcula el `order` de todos los días y se persiste.
4. **Los colores NO cambian** al reordenar (ver §5, decisión de color por creación).

### 1.5 Agregar pin
Ver flujo completo en §3.

### 1.6 Editar pin
1. Tap en un pin del mapa → `PinPopover` → **Editar**.
2. `PinFormSheet` en modo `edit`: cambiar nombre, nota, o **reubicar** (vuelve al modo colocar).
3. Guardar → actualiza el `Pin` (incluidas ambas coords si se reubicó), persiste, refleja en mapa.

### 1.7 Eliminar pin
1. Desde `PinPopover` o `PinFormSheet`, **Eliminar**.
2. Confirmación ligera (*"¿Eliminar 'Katz's Deli'?"*) → quita el pin del día y del mapa; persiste.

### 1.8 Ver detalle de un pin en el mapa
1. Tap en un pin → `PinPopover` con: nombre, nota, día al que pertenece (con su color), acciones.
2. En desktop, hover sobre el pin muestra tooltip con el nombre; click abre el popover.

### 1.9 Enfocar un día en el mapa
- Tocar un `DayListItem` (o su indicador) setea `focusedDayId`: el mapa muestra **solo** los pins de
  ese día; el resto se atenúa/oculta. Volver a tocar (o "ver todos") limpia el foco.

---

## 2. Formulario de día (`DayFormSheet`)

| Campo | Tipo | Requerido | Placeholder / default | Validación |
|---|---|---|---|---|
| **Nombre** | texto | **Sí** | "Día 1 - Downtown" | No vacío; máx ~60 chars |
| **Fecha** | date (ISO) | No | (vacío) | Fecha válida; opcional |
| **Zona principal** | chips de barrio (uno) | No | (ninguno) | Debe ser un `NeighborhoodId` válido |
| **Descripción** | textarea | No | "Qué planeamos hacer este día…" | máx ~500 chars |

- **Zona:** se elige tocando un chip entre los 13 barrios (con su color). Deseleccionable.
- **Teclado mobile:** el sheet se eleva para no quedar tapado por el teclado (`useKeyboardInset`).
- **Acciones:** `Cancelar` (secondary) · `Guardar` (primary). En `edit`, además `Eliminar día` (danger).
- **Feedback:** al guardar, toast breve y cierre; error inline bajo el campo Nombre si falta.

---

## 3. Flujo para agregar un pin

`[DECISIÓN TOMADA para MVP]` **Tap en el mapa** (colocar y arrastrar el marcador). Búsqueda por nombre
(geocoding) es `[v2]`. Motivo: sin backend ni API key, colocar el pin a mano es lo más simple y funciona
igual en esquemático y real; para un viaje familiar, ubicar "más o menos acá" alcanza.

**Flujo:**
1. En un día (o su detalle), tocar **"+ Agregar lugar"**.
2. La app entra en **modo colocar pin** (`isPlacingPin = true`): el sheet se colapsa a `peek`, aparece
   `PlacePinBanner` arriba: *"Tocá el mapa para marcar el lugar"* + `Cancelar`.
3. El usuario **toca el mapa** en la posición deseada → aparece un **marcador provisional** con el
   color del día, **arrastrable** para ajustar.
   - El tap se convierte a `{geo, svg}` según el modo activo (ver [MAP_CORE §8](MAP_CORE.md)).
4. Se abre `PinFormSheet` (modo `create`): **nombre** (requerido), **nota** (opcional), y un indicador
   *"✓ Ubicación marcada"* con opción **"Reubicar"** (vuelve al paso 3).
5. **Guardar lugar:** se crea el `Pin` con ambas coordenadas, `dayId`, `order` = último+1 del día,
   `createdAt`. Se persiste; el pin queda fijo en el mapa; aparece en la lista de lugares del día.
6. **Cancelar** en cualquier punto → no se crea nada; el marcador provisional desaparece;
   `isPlacingPin = false`.

**Estados/errores:** guardar sin nombre → error inline. Si el usuario cambia de sección o de modo de
mapa durante el modo colocar, el marcador provisional se conserva mientras `isPlacingPin` siga activo.

`[v2] Búsqueda por nombre:` un campo de búsqueda geocodifica el lugar (proveedor a definir) y coloca el
pin automáticamente; el usuario ajusta si hace falta. Convive con el tap manual.

---

## 4. Empty state
- Con **cero días** (primer uso o itinerario vaciado): `ItineraryEmptyState` con ilustración, texto
  *"Todavía no tenés días. Armá tu primer día para empezar tu viaje"* y CTA **"+ Agregar día"** (primary).
- Con **días pero un día sin lugares**: el detalle del día muestra *"Este día todavía no tiene lugares"*
  + **"+ Agregar lugar"**.
- El empty state es la única "guía" de arranque (no hay onboarding; ver [UX_FLOWS §1](../04_UX_FLOWS.md)).

---

## 5. Lógica de colores de los días

`[DECISIÓN TOMADA]` **Paleta predefinida asignada por orden de creación** (Design Spec §2.5).

- El día número **N creado** recibe `color-day-((k) mod 10) + 1`, donde `k` = cantidad de días creados
  antes. Es decir, se asignan en orden 1→10 y luego se repite el ciclo.
- El color se guarda en `Day.color` al crear y **no cambia** al reordenar ni al borrar otros días
  (el color pertenece al día, no a su posición). Esto evita que el mapa "recoloree" pins ya conocidos.
- **Alternativas evaluadas (y descartadas para MVP):**
  - *Color por posición:* reordenar recolorearía todo → confunde ("el pin rojo ahora es azul"). Descartada.
  - *Generado por matiz (golden angle HSL):* útil solo si hay >10 días; se deja como fallback: si se
    superan los 10 días, en vez de repetir se puede generar un matiz nuevo distanciado. Opcional.
  - *Elegido por el usuario:* más control pero más fricción; se mueve a **`[v2]`**.
- **Colisión con >10 días:** por defecto se repite el ciclo de 10 (aceptable para un viaje típico). Si se
  quiere evitar repetición, aplicar el fallback por matiz. Documentado como detalle menor.

---

## 6. Persistencia

`[MVP]` **localStorage** vía Zustand `persist` (ver [ARCHITECTURE §8](../05_TECHNICAL_ARCHITECTURE.md) y
[DATA_MODEL §6](../06_DATA_MODEL.md)).

- **Qué se guarda:** el `Itinerary` completo (días + pins anidados + `schemaVersion` + `updatedAt`),
  bajo la clave `nyc-explorer:itinerary:v1`. Las preferencias de UI van en otra clave separada.
- **Cuándo se guarda:** **auto-save en cada cambio** (el middleware serializa tras cada mutación del
  store). No hay botón "guardar" global; crear/editar/borrar ya persiste. Motivo: cero riesgo de perder
  cambios, sin fricción. (Para inputs de texto, la escritura al store ocurre al confirmar el formulario,
  no en cada tecla, para no serializar en exceso.)
- **Si localStorage no está disponible** (incógnito / bloqueado): la app funciona **en memoria** y
  muestra el banner `color-warning` *"Tus cambios no se van a guardar en este dispositivo"*
  ([UX_FLOWS §14](../04_UX_FLOWS.md)). No se bloquea el uso.
- **Si localStorage se llena** (cuota, muy improbable dado el tamaño): la escritura falla; se muestra
  toast `color-danger`, el estado en memoria se conserva, y se sugiere liberar espacio. En la práctica un
  itinerario de viaje familiar pesa muy por debajo del límite (~5MB).
- **Migraciones:** `persist` usa `version` + `migrate` para evolucionar el esquema sin perder datos
  viejos ([DATA_MODEL §6](../06_DATA_MODEL.md)).

---

## 7. Exportar / compartir itinerario `[v2]`

Opciones posibles (a decidir en v2):
- **Exportar a PDF** — cierra el círculo con el formato original; una vista imprimible del itinerario
  (días + lugares + notas). Buena para llevar impreso o mandar a la familia.
- **Exportar JSON** — respaldo/portabilidad de los datos (reimportable en otro dispositivo).
- **Link compartible** — requiere backend (Supabase) para hospedar el itinerario y generar una URL de
  solo lectura. Depende de la sync (§8).
- **Compartir nativo** (Web Share API) — pasar el PDF/link por WhatsApp/mail desde el celular.

---

## 8. Sincronización con cuenta de usuario `[v2]`

Objetivo: que los distintos celulares de la familia vean y editen **el mismo** itinerario. Backend:
Supabase ([DATA_MODEL §7](../06_DATA_MODEL.md)).

**Flujo de migración localStorage → nube:**
1. El usuario crea cuenta / inicia sesión (Supabase Auth).
2. La app detecta un itinerario local existente y ofrece **"Subir este itinerario a tu cuenta"**.
3. Al aceptar: se crea una fila `itineraries` y se insertan `days`/`pins` mapeando 1:1 desde los tipos
   del MVP (reutilizando los IDs de cliente como PKs → idempotente ante reintentos).
4. A partir de ahí, la app es **local-first con sync en background**: escribe local y sincroniza; ante
   conflicto, **última escritura gana** por `updatedAt` (suficiente para uso familiar).
5. Otros dispositivos, al iniciar sesión, descargan el itinerario y quedan en sync.

**Diseño MVP que lo habilita:** el store es la **única** puerta a los datos del itinerario; agregar una
capa de sync detrás del store no toca los componentes ni la UI. Por eso el MVP ya deja el camino listo
sin sobre-ingeniería.

---

**Anterior:** [GRID.md](GRID.md) · **Siguiente:** [../09_TESTING_SPEC.md](../09_TESTING_SPEC.md)
