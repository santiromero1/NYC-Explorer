# 10 · Deployment — NYC Explorer

> Plataforma de deploy y por qué, preview deployments, pipeline de CI, configuración PWA (manifest +
> service worker), variables de entorno, checklist de go-live y estrategia de dominio. Se puede leer solo.
>
> Recordatorio de alcance: **app personal**. El pipeline es simple y de bajo mantenimiento; nada de
> infra pesada. Lo importante: que deploye fácil, tenga previews y sea instalable como PWA.

---

## 1. Plataforma de deploy: Vercel

**Elección: Vercel** (requisito explícito del usuario). Encaja perfecto porque:
- La app es un **build estático** (Vite → carpeta `dist/`); Vercel sirve estáticos con CDN global sin
  configuración.
- **Preview deployments automáticos** por cada push/PR (URL única por commit) — ideal para revisar en el
  celular antes de mergear.
- **Deploy en git push** a `main` → producción; cero pasos manuales.
- **Gratis** en el plan Hobby, más que suficiente para uso personal.
- Buen soporte para PWA (headers, HTTPS por defecto, que el service worker necesita).

**Configuración Vercel:**
- Framework preset: **Vite**.
- Build command: el build de producción del proyecto (definido en `package.json`).
- Output directory: `dist`.
- Node version: LTS.
- SPA fallback: rewrites de todas las rutas a `index.html` (si se usa React Router; ver
  [ARCHITECTURE §11](05_TECHNICAL_ARCHITECTURE.md)) — vía `vercel.json` con un rewrite `/(.*) → /index.html`.
- Headers: asegurar que el service worker (`sw.js`) se sirva con `Cache-Control` que permita
  actualización (no cachear el SW agresivamente); el resto de assets con hash → cache largo.

---

## 2. Preview deployments para PRs
- Cada **PR** genera un **Preview Deployment** con URL propia; Vercel la comenta en el PR.
- Uso previsto: abrir esa URL en el celular para validar el look & feel real (mobile-first) y la
  instalación PWA antes de mergear a `main`.
- Los previews no comparten `localStorage` con producción (dominio distinto), así que se prueban con
  datos limpios sin tocar el itinerario "real".

---

## 3. Pipeline de CI

CI mínimo pero efectivo (GitHub Actions o los checks de Vercel), corriendo en cada PR y en push a `main`.

**En cada PR:**
1. Instalar dependencias (con cache).
2. **Typecheck** — `tsc` en modo strict (sin emitir).
3. **Lint** — ESLint.
4. **Tests unitarios + integración** — Vitest.
5. **Tests E2E** — Playwright sobre el build (o el preview), viewport mobile.
6. **Build** — verifica que compila y genera `dist/` (Vercel lo hace igual para el preview).
7. (Opcional) **axe** en los estados clave.

Regla: **no se mergea a `main` si algún check falla.** Los casos críticos del
[Testing Spec §7](09_TESTING_SPEC.md) son el gate.

**En merge a `main`:**
- Vercel construye y despliega a **producción** automáticamente.
- (Opcional) volver a correr el smoke E2E contra la URL de producción.

> Dado el alcance personal, es aceptable arrancar con un CI liviano (typecheck + unit + build) y sumar
> E2E/axe cuando el proyecto lo amerite. La estructura queda documentada para no improvisar después.

---

## 4. Configuración PWA

Usando **vite-plugin-pwa** (Workbox) — ver [ARCHITECTURE §1](05_TECHNICAL_ARCHITECTURE.md).

### 4.1 `manifest.webmanifest`
- `name`: "NYC Explorer"
- `short_name`: "NYC Explorer"
- `description`: "Explorá Nueva York y armá tu itinerario de viaje."
- `lang`: "es"
- `start_url`: "/"
- `scope`: "/"
- `display`: **"standalone"** (abre sin barra de navegador)
- `orientation`: "portrait" (mobile-first; permitir rotación no es prioritario)
- `background_color`: `#0D1117` (splash acorde al dark mode)
- `theme_color`: `#0D1117` (o `#F7C948` para la barra; a validar visualmente)
- `icons`: 192×192, 512×512 y una **maskable** 512×512 (para Android adaptativo). Ícono de la app:
  motivo amarillo taxi sobre fondo oscuro, coherente con la marca (Design Spec).

### 4.2 Service worker — estrategia de cache
- **App shell (precache):** HTML, JS, CSS con hash y los datos estáticos empaquetados (barrios, grid,
  silueta del mapa, fuente Inter self-hosted, íconos). Estrategia **precache** en el build → disponible
  offline desde la primera visita instalada.
- **Mapa esquemático:** es parte del bundle → cubierto por el precache → **funciona offline**.
- **Tiles del mapa real:** **NetworkOnly** (o NetworkFirst con cache chico y expiración). No se precachea
  (son muchos y externos); sin red, el mapa real muestra el aviso de "no disponible offline"
  ([UX_FLOWS §13](04_UX_FLOWS.md)). El itinerario nunca depende de esto.
- **localStorage** (el itinerario) es independiente del SW: siempre disponible offline.
- **Actualización del SW:** estrategia `autoUpdate` (o prompt "hay una versión nueva"); el SW se
  versiona con cada build para no servir assets viejos. El SW **no** se cachea agresivamente (§1 headers).
- **registerType:** `autoUpdate` recomendado para uso personal (menos fricción); alternativa `prompt`
  si se quiere control.

### 4.3 Cómo se testea la instalación
- **Manual (principal):** abrir el preview/producción en Chrome Android e iOS Safari → verificar prompt
  "Agregar a inicio" → instalar → abrir desde el ícono → confirma standalone (sin barra) y splash con
  `background_color`.
- **Lighthouse PWA audit:** pasar la auditoría PWA (installable, manifest válido, SW registrado, HTTPS).
- **Offline (automatizado):** E2E con red cortada ([TESTING §5](09_TESTING_SPEC.md), caso C6/C7).

---

## 5. Variables de entorno

En el MVP casi no hay secrets (por diseño: sin backend ni API keys obligatorias). Se deja `.env.example`
documentado para no improvisar.

| Variable | MVP | Descripción |
|---|---|---|
| `VITE_MAP_STYLE_URL` | (opcional) | URL del estilo/tiles dark de MapLibre. Si el proveedor elegido no requiere key, puede ir hardcodeada o vacía. `[DECISIÓN PENDIENTE]` proveedor — ver [ARCHITECTURE §10](05_TECHNICAL_ARCHITECTURE.md). |
| `VITE_MAP_TILES_KEY` | vacío en MVP | Solo si el proveedor de tiles requiere key (se evita elegir uno así). |
| `VITE_SUPABASE_URL` | `[v2]` | URL del proyecto Supabase (sync en la nube). |
| `VITE_SUPABASE_ANON_KEY` | `[v2]` | Anon key pública de Supabase. |

Notas:
- Las `VITE_*` se embeben en el build del cliente → **nunca** poner secrets reales ahí (la anon key de
  Supabase es pública por diseño y está bien).
- En Vercel se configuran en Project Settings → Environment Variables (por entorno: Production/Preview).

---

## 6. Checklist de go-live

**Antes del primer deploy a producción:**
- [ ] Casos críticos del [Testing Spec §7](09_TESTING_SPEC.md) (C1–C10) en verde.
- [ ] `tsc` strict y ESLint sin errores.
- [ ] Build de producción OK (`dist/` generado).
- [ ] Manifest válido + íconos (192, 512, maskable) presentes.
- [ ] Lighthouse PWA: installable, offline básico OK.
- [ ] Instalación probada en un celular real (Android y/o iOS).
- [ ] Offline probado: itinerario + mapa esquemático funcionan sin red.
- [ ] Mapa real: aviso correcto sin conexión (no crashea).
- [ ] `theme_color`/`background_color` se ven bien (splash + barra).
- [ ] Persistencia: crear datos, cerrar, reabrir → siguen ahí.
- [ ] Variables de entorno configuradas en Vercel (aunque estén vacías).
- [ ] SPA rewrites configurados (si hay React Router) — no 404 al recargar en una ruta.
- [ ] Revisado en 390px (mobile) y en desktop.

**Post go-live (nice to have):**
- [ ] Probarla en el viaje real (la métrica de éxito, ver [OVERVIEW §6](00_PROJECT_OVERVIEW.md)).
- [ ] Recordatorio/plan de respaldo del itinerario (export manual) — relevante hasta tener sync v2.

---

## 7. Estrategia de dominio

- **MVP:** usar el dominio gratuito de Vercel (`nyc-explorer-*.vercel.app`). Alcanza para uso personal y
  es HTTPS por defecto (requisito de PWA).
- **Opcional (nice to have):** un dominio propio corto y memorable (ej. `nycexplorer.app` o un subdominio
  de un dominio ya existente del usuario) conectado en Vercel, para que sea fácil de tipear/instalar en
  los celulares de la familia. No es bloqueante.
- HTTPS: automático en Vercel (necesario para service worker / PWA). Sin configuración extra.

---

**Anterior:** [09_TESTING_SPEC.md](09_TESTING_SPEC.md) · **Volver al índice:** [00_PROJECT_OVERVIEW.md](00_PROJECT_OVERVIEW.md)
