# 03 · Design Spec — NYC Explorer

> Sistema de diseño completo de la app: colores, tipografía, espaciado, breakpoints, colores de
> barrios y de días, estados de interacción, componentes base y estilo de ambos mapas. Todo pensado
> **mobile-first** (390px) y en **dark mode**. El color de acento es el amarillo taxi de NY (#F7C948).
> Este documento define *cómo se ve* la app; el *qué hace* está en el PRD. Se puede leer solo.

> **Nota:** los valores están dados como tokens nombrados. La implementación (CSS variables /
> tema de la librería de estilos) se define en la Architecture; acá solo se especifican los valores.

---

## 1. Principios visuales

1. **Dark, calmo, con un punto de energía.** Fondo profundo casi negro-azulado, superficies apenas
   más claras, y el amarillo taxi reservado para lo que importa (acciones, selección, marca).
2. **El mapa manda.** La UI es un marco discreto alrededor del mapa; nada compite con él.
3. **Color con significado.** Cada barrio y cada día tienen color propio; el color nunca es decorativo.
4. **Táctil y generoso.** Targets grandes (mín. 44×44px), espaciado amplio, esquinas redondeadas.
5. **Movimiento con propósito.** Transiciones cortas que explican de dónde viene y a dónde va algo.

---

## 2. Color

### 2.1 Tokens base (dark mode)

| Token | Hex | Uso |
|---|---|---|
| `color-bg` | `#0D1117` | Fondo raíz de la app |
| `color-bg-elevated` | `#010409` | Fondo aún más profundo (detrás de sheets, backdrops) |
| `color-surface` | `#161B22` | Superficie de paneles, cards, bottom sheets |
| `color-surface-raised` | `#1C2128` | Superficie elevada (inputs, chips, items sobre surface) |
| `color-surface-overlay` | `#21262D` | Hover sobre surface, estados raised |
| `color-border` | `#30363D` | Bordes y divisores |
| `color-border-muted` | `#21262D` | Divisores sutiles |
| `color-text` | `#E6EDF3` | Texto principal |
| `color-text-secondary` | `#8B949E` | Texto secundario / labels |
| `color-text-muted` | `#6E7681` | Texto deshabilitado / placeholders |
| `color-text-on-accent` | `#0D1117` | Texto sobre fondo amarillo |

### 2.2 Acento (amarillo taxi)

| Token | Hex | Uso |
|---|---|---|
| `color-accent` | `#F7C948` | Acción primaria, selección, marca |
| `color-accent-hover` | `#FFD75E` | Hover del acento |
| `color-accent-active` | `#E0B330` | Pressed/active del acento |
| `color-accent-subtle` | `#3A3418` | Fondo tenue con tinte del acento (badges, highlights) |
| `color-accent-border` | `#7A6A24` | Borde con tinte del acento |

### 2.3 Semánticos

| Token | Hex | Uso |
|---|---|---|
| `color-success` | `#3FB950` | Confirmaciones, guardado ok |
| `color-danger` | `#F85149` | Borrar, errores destructivos |
| `color-danger-subtle` | `#3D1A1A` | Fondo tenue de zona de peligro |
| `color-warning` | `#D29922` | Avisos (ej.: localStorage no disponible) |
| `color-info` | `#58A6FF` | Información neutral |

### 2.4 Colores de los barrios `[MVP]`

Cada uno de los 13 barrios tiene un color propio, estable, usado para su forma en el mapa, su
etiqueta y su panel. Elegidos para: (a) contrastar sobre `#0D1117`, (b) ser distinguibles entre sí,
y (c) que **barrios adyacentes no compartan un color parecido**. Saturación media para no cansar.

| Barrio | Token | Hex |
|---|---|---|
| Financial District | `color-hood-fidi` | `#4E7FD4` |
| TriBeCa | `color-hood-tribeca` | `#6C5CE0` |
| SoHo | `color-hood-soho` | `#A44FD0` |
| Greenwich Village | `color-hood-village` | `#2BB4A6` |
| East Village | `color-hood-eastvillage` | `#E87B3C` |
| Lower East Side | `color-hood-les` | `#D64F57` |
| Chelsea | `color-hood-chelsea` | `#47AEE0` |
| Flatiron / Union Square | `color-hood-flatiron` | `#66C05A` |
| Midtown | `color-hood-midtown` | `#E86AA6` |
| Upper West Side | `color-hood-uws` | `#8DBF3F` |
| Upper East Side | `color-hood-ues` | `#C79A3E` |
| Central Park | `color-hood-centralpark` | `#3E9D57` |
| Harlem | `color-hood-harlem` | `#E0553B` |

Reglas de aplicación:
- **Sin seleccionar:** relleno de la zona al ~35% de opacidad, borde al 100%.
- **Seleccionado:** relleno al ~60%, borde 100% + glow suave del mismo color.
- **Atenuado** (cuando otro está seleccionado): relleno al ~15%, sin etiqueta.

### 2.5 Colores del itinerario (días) `[MVP]`

Cada día del itinerario recibe un color de una **paleta predefinida ordenada**, asignado por orden
de creación. Distintos de los colores de barrios en tono/brillo para que los pins se lean sobre el mapa.

Paleta base (10 colores, en orden de asignación):

| Día | Token | Hex |
|---|---|---|
| 1 | `color-day-1` | `#F7C948` (amarillo taxi — firma) |
| 2 | `color-day-2` | `#58A6FF` (azul) |
| 3 | `color-day-3` | `#3FB950` (verde) |
| 4 | `color-day-4` | `#FF7B72` (coral) |
| 5 | `color-day-5` | `#BC8CFF` (violeta) |
| 6 | `color-day-6` | `#FF9F43` (naranja) |
| 7 | `color-day-7` | `#2DD4BF` (turquesa) |
| 8 | `color-day-8` | `#F472B6` (rosa) |
| 9 | `color-day-9` | `#A3E635` (lima) |
| 10 | `color-day-10` | `#38BDF8` (celeste) |

Regla de asignación: el día N recibe `color-day-((N-1) mod 10) + 1`. A partir del día 11 se repite el
ciclo. Para el caso raro de >10 días, la lógica de asignación (y una alternativa por rotación de matiz)
se detalla en [08_FEATURE_SPECS/ITINERARY.md](08_FEATURE_SPECS/ITINERARY.md). En el MVP el color lo asigna
la app automáticamente; elegirlo manualmente es `[v2]`.

---

## 3. Tipografía

**Familia:** `Inter` (variable), **self-hosted** (para funcionar offline y sin requests externos).
Fallback: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
Numerales tabulares (`tabular-nums`) para fechas y contadores.

### 3.1 Escala (mobile 390px)

| Nivel | Token | Tamaño / Interlineado | Peso | Uso |
|---|---|---|---|---|
| Display | `text-display` | 32px / 36px | 700 | Título de pantalla grande, empty states |
| Heading 1 | `text-h1` | 24px / 30px | 700 | Título de panel / sheet |
| Heading 2 | `text-h2` | 20px / 26px | 600 | Nombre de barrio, título de sección |
| Heading 3 | `text-h3` | 17px / 24px | 600 | Nombre de día, subtítulos |
| Body large | `text-body-lg` | 17px / 26px | 400 | Descripciones destacadas |
| Body | `text-body` | 15px / 23px | 400 | Texto general |
| Body small | `text-body-sm` | 13px / 19px | 400 | Notas, descripciones de spots |
| Caption | `text-caption` | 12px / 16px | 500 | Metadatos, etiquetas de mapa |
| Overline | `text-overline` | 11px / 14px | 600 | Etiquetas de categoría, MAYÚS + tracking 0.06em |

### 3.2 Ajustes por breakpoint

- **Tablet/Desktop (≥768px):** Display sube a 40px/44px; H1 a 28px/34px. El resto se mantiene:
  el texto de lectura no necesita crecer, gana en ancho de columna (máx. ~68ch).

---

## 4. Espaciado

Base de **4px**. Tokens (escala):

| Token | px |
|---|---|
| `space-0` | 0 |
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-5` | 20 |
| `space-6` | 24 |
| `space-8` | 32 |
| `space-10` | 40 |
| `space-12` | 48 |
| `space-16` | 64 |

Reglas: padding de contenido en mobile = `space-4` (16px). Separación entre items de lista =
`space-3`. Padding interno de sheets = `space-5` horizontal, `space-6` inferior (safe area).

---

## 5. Radios, elevación y borde

**Radios:**

| Token | px | Uso |
|---|---|---|
| `radius-sm` | 6 | Chips, badges, inputs pequeños |
| `radius-md` | 10 | Botones, inputs, cards |
| `radius-lg` | 16 | Paneles, cards grandes |
| `radius-xl` | 24 | Bottom sheet (esquinas superiores) |
| `radius-full` | 999 | Pills, FAB, avatares |

**Elevación (sombras para dark):** sombras sutiles + borde de 1px que hace el trabajo real de
separación en dark mode.

| Token | Definición conceptual | Uso |
|---|---|---|
| `elevation-0` | sin sombra, borde `color-border-muted` | Superficies planas |
| `elevation-1` | sombra suave baja + borde `color-border` | Cards, chips |
| `elevation-2` | sombra media | Bottom sheet, popovers |
| `elevation-3` | sombra amplia | FAB, modales de confirmación |

---

## 6. Breakpoints y layout

| Breakpoint | Ancho | Layout |
|---|---|---|
| **Mobile** (base) | 390px | Mapa a pantalla completa. Navegación **inferior** (bottom nav) con las 3 secciones. Paneles como **bottom sheets** que suben desde abajo. Controles (toggle de mapa, zoom) flotando sobre el mapa, alineados para el pulgar. FAB de "agregar" abajo a la derecha en Itinerario. |
| **Tablet** | 768px | Mapa sigue dominando. Los bottom sheets pueden convertirse en **panel lateral** (sidebar derecho, ~360px) que no tapa el mapa. Bottom nav puede pasar a nav lateral izquierda o mantenerse abajo. Más aire en paddings. |
| **Desktop** | 1280px | Layout de dos columnas: **sidebar de navegación/contenido** a la izquierda (~380px) + mapa ocupando el resto. Los paneles de barrio/itinerario viven en el sidebar, no como sheets. Controles del mapa arriba a la derecha. |

Regla general: **el mapa nunca baja de ~60% del viewport** en ningún breakpoint.
La página **nunca** hace scroll horizontal; el contenido ancho (tablas del panel educativo, listas)
scrollea dentro de su propio contenedor.

---

## 7. Estados de interacción

Aplican a todos los elementos interactivos salvo que se indique lo contrario.

| Estado | Tratamiento |
|---|---|
| **Default** | Según el componente |
| **Hover** (solo punteros) | +8% de luminosidad en el fondo o `color-surface-overlay`; cursor pointer. En touch no aplica. |
| **Active / Pressed** | Escala 0.97 + color más oscuro (`*-active`); feedback inmediato al tacto |
| **Focus (teclado)** | Anillo de foco visible: 2px `color-accent` con offset de 2px. Nunca se remueve sin reemplazo. |
| **Selected** | Borde/relleno con el color propio (barrio/día) + `color-accent` para selección de UI genérica |
| **Disabled** | Opacidad 45%, `color-text-muted`, sin pointer events, sin sombra |
| **Loading** | Spinner o skeleton; el control se deshabilita y muestra progreso |

Duraciones de transición: `duration-fast` 120ms (hover/press), `duration-base` 220ms (sheets,
cambios de estado), `duration-slow` 320ms (transición de modo de mapa). Easing estándar:
`cubic-bezier(0.2, 0, 0, 1)` (entradas), `cubic-bezier(0.4, 0, 1, 1)` (salidas).
Respetar `prefers-reduced-motion`: reducir a fades cortos o sin animación.

---

## 8. Componentes de UI base

Especificación visual. El detalle de props/comportamiento está en
[07_COMPONENT_SPEC.md](07_COMPONENT_SPEC.md).

### 8.1 Botones

| Variante | Apariencia | Uso |
|---|---|---|
| **Primary** | Fondo `color-accent`, texto `color-text-on-accent`, `radius-md`, peso 600, altura 48px (mobile) | Acción principal (Guardar, Agregar día) |
| **Secondary** | Fondo `color-surface-raised`, texto `color-text`, borde `color-border` | Acción secundaria (Cancelar) |
| **Ghost** | Sin fondo, texto `color-text-secondary`, hover a surface | Acciones terciarias |
| **Danger** | Texto/borde `color-danger`; en confirmación, fondo `color-danger` | Eliminar |
| **Icon** | Cuadrado 44×44, `radius-md`, ícono centrado | Cerrar, editar, controles del mapa |
| **FAB** | Círculo 56px, `color-accent`, sombra `elevation-3`, ícono "+" | Agregar día/pin (mobile) |

Altura mínima táctil siempre ≥44px. Texto de botón nunca en MAYÚS forzada salvo overline.

### 8.2 Bottom sheet

- Sube desde abajo, esquinas superiores `radius-xl`, fondo `color-surface`, `elevation-2`.
- **Handle** (barra de arrastre) de 36×4px, `color-border`, centrada arriba.
- **Snap points:** `peek` (~35% alto), `half` (~55%), `full` (~90%, deja ver el mapa arriba).
- Se cierra con: swipe down, tap en backdrop (backdrop `color-bg-elevated` al 60% opacidad), o botón X.
- Contenido scrolleable internamente cuando excede la altura del snap.
- Respeta safe-area inferior (notch/home indicator).

### 8.3 Inputs

- Altura 48px, fondo `color-surface-raised`, borde `color-border`, `radius-md`, texto `color-text`,
  placeholder `color-text-muted`, padding horizontal `space-4`.
- **Label** arriba (`text-caption`, `color-text-secondary`).
- **Focus:** borde `color-accent` + anillo sutil.
- **Error:** borde `color-danger` + mensaje `text-body-sm` en `color-danger` debajo.
- Tipos: texto, textarea (descripción/nota), date (fecha del día), select (zona/barrio).
- Teclado móvil: `inputmode` apropiado; el sheet se ajusta para no quedar tapado por el teclado.

### 8.4 Badges y chips

- **Badge:** pill chico `radius-full`, `text-caption`, para contadores/estado (ej.: "2 días acá").
  Variante `subtle` con `color-accent-subtle` + `color-accent`.
- **Chip:** seleccionable, `radius-full`, altura 32–36px. Para elegir zona/barrio o filtrar por día.
  Chip de día usa el `color-day-N` como punto/relleno. Estado `selected` con borde del color.

### 8.5 Segmented control (toggle de mapa)

- Contenedor pill `radius-full`, fondo `color-surface-raised`, dos segmentos: **Esquemático** / **Real**.
- Segmento activo: fondo `color-accent`, texto `color-text-on-accent`. Transición deslizante 220ms.
- Flota sobre el mapa; ancho cómodo para el pulgar; ≥44px de alto.

### 8.6 Bottom navigation (mobile)

- Barra inferior fija, fondo `color-surface` con borde superior `color-border`, safe-area.
- 3 ítems: **Barrios**, **Grid**, **Itinerario**, cada uno con ícono + label (`text-caption`).
- Activo: ícono y label en `color-accent`; inactivo en `color-text-secondary`.
- Altura 56px + safe area.

### 8.7 Diálogo de confirmación

- Modal centrado (mobile: casi ancho completo con márgenes `space-4`), `radius-lg`, `elevation-3`.
- Título `text-h3`, cuerpo `text-body`, dos botones: destructivo (`Danger`) + `Secondary` (Cancelar).
- Backdrop oscuro. Usado para eliminar día/pin.

---

## 9. Estilo del mapa esquemático

- **Fondo:** `color-bg` (no un mapa; un lienzo limpio).
- **Agua (ríos Hudson y East):** franjas `#12202E` (azul muy oscuro) a los lados de la isla, sutiles.
- **Zonas de barrio:** formas (rects redondeados / polígonos suaves) con el `color-hood-*` según §2.4.
  Bordes de 1.5px, esquinas `radius-md`. Separación visible entre zonas (gutter de fondo).
- **Etiquetas:** nombre del barrio en `text-caption`, `color-text`, con leve sombra para legibilidad.
  Aparecen/desaparecen según zoom (declutter).
- **Central Park:** tratado como zona verde distintiva (`color-hood-centralpark`) con textura sutil.
- **Selección:** la zona seleccionada sube opacidad + glow; las demás se atenúan (§2.4).
- **Sensación:** limpio, plano, tipo "mapa de transporte" / diagrama, no realista.

## 10. Estilo del mapa real (overlays sobre tiles)

- **Base:** estilo dark de MapLibre (tiles oscuros) elegido/ajustado para armonizar con `color-bg`.
  Si el estilo base viene muy claro, se aplica un **filtro/tinte** para bajarlo al mood de la app.
- **Barrios sobre el mapa real:** los mismos `color-hood-*` como **polígonos semitransparentes**
  (relleno ~25%, borde 100%) siguiendo los bounds geográficos del barrio. Al seleccionar, sube opacidad.
- **Grid sobre el mapa real:** líneas de calles/avenidas clave dibujadas como overlay vectorial
  (no se depende de las labels de los tiles); Broadway resaltada en diagonal. Ver
  [08_FEATURE_SPECS/GRID.md](08_FEATURE_SPECS/GRID.md).
- **Pins:** mismos marcadores con `color-day-N` que en el esquemático (misma forma), para coherencia
  visual al cambiar de modo.
- **Coherencia:** controles (toggle, zoom, FAB) y paneles son idénticos en ambos modos; solo cambia
  el "piso" del mapa.

---

## 11. Iconografía y misc

- **Set de íconos:** una sola familia lineal, consistente (ej.: Lucide), stroke ~1.75px, tamaño base 24px.
- **Radios de foto/avatar:** `radius-full`.
- **Safe areas:** respetar `env(safe-area-inset-*)` en top y bottom (notch / home indicator).
- **Estados de mapa vacío/carga:** skeleton oscuro o spinner `color-accent` centrado.

---

**Anterior:** [02_PRD.md](02_PRD.md) · **Siguiente:** [04_UX_FLOWS.md](04_UX_FLOWS.md)
