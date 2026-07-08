# NY Explorer — Contexto de producto

**Registro**: product (app-herramienta; el diseño sirve al viaje, no es marketing).

## Qué es

App personal (PWA) para el viaje familiar a Nueva York del 16 al 24 de julio de 2026.
Una sola pantalla: el mapa siempre de fondo y un bottom sheet (mobile) o sidebar (desktop)
con 4 modos: **Barrios, Calles, Subway, Itinerario**. El itinerario real del viaje viene
cargado y es de solo lectura; lo único editable es "visitado" y las notas por parada
(localStorage).

## Usuarios

La familia de Santiago durante el viaje: celulares en la calle, con apuro, quizás con mala
señal. También planificación previa desde desktop. Todo en español rioplatense (vos).

## Principios

1. **Fidelidad al diseño de Claude Design** (`/Users/santiagoromero/Developer/Mapa interactivo de Nueva York`):
   esa carpeta es la fuente de verdad visual y de interacción.
2. **Funciona sin señal**: datos geo y fotos empaquetados; tiles cacheados por el service worker.
3. **El mapa es el protagonista**: el sheet nunca lo tapa del todo; siempre se puede bajar.
4. Sin fricción: nada de logins, sync ni configuración.

## Anti-referencias

- Nada de dashboard SaaS ni dark-mode-por-defecto: el look es iOS claro (Apple Maps).
- No agregar features de edición de itinerario: decisión cerrada (solo lectura).
