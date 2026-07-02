// Mapa real (MapLibre GL, lazy) — MAP_CORE §4-6, §8
// Tiles: CARTO dark (raster, gratis, sin API key). Overlays: capas GeoJSON + markers DOM
// que leen del mismo store que el esquemático (sincronización por estado compartido).
import { useEffect, useRef, useState } from 'react';
import type maplibregl from 'maplibre-gl';
import { AppSection, MapMode } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useItineraryStore } from '../../store/useItineraryStore';
import { NEIGHBORHOODS } from '../../data/neighborhoods';
import { GRID } from '../../data/grid';
import { HOOD_GEO, hoodGeoCentroid } from '../../data/neighborhoodsGeo';
import {
  STREET_GEO_LINES,
  AVENUE_GEO_LINES,
  lineAngleDeg,
  linePointAt,
} from '../../data/gridGeo';
import { geoToSvg, GEO_BOUNDS } from './projection';

type ML = typeof import('maplibre-gl');

const TILE_STYLE = {
  version: 8 as const,
  sources: {
    carto: {
      type: 'raster' as const,
      tiles: ['a', 'b', 'c', 'd'].map(
        (s) => `https://${s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png`,
      ),
      tileSize: 256,
      attribution: '© OpenStreetMap contributors © CARTO',
    },
  },
  layers: [{ id: 'carto', type: 'raster' as const, source: 'carto' }],
};

/** Anillo cerrado [lng,lat][] del polígono geográfico REAL del barrio (neighborhoodsGeo). */
function hoodGeoRing(n: (typeof NEIGHBORHOODS)[number]): [number, number][] {
  const pts = HOOD_GEO[n.id];
  const ring = pts.map((p) => [p.lng, p.lat] as [number, number]);
  ring.push(ring[0]); // cerrar el anillo
  return ring;
}

export function RealMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mlRef = useRef<ML | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [tilesError, setTilesError] = useState(false);

  const setViewport = useAppStore((s) => s.setViewport);
  const setMapMode = useAppStore((s) => s.setMapMode);

  // --- Inicialización (una vez) ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [ml] = await Promise.all([
        import('maplibre-gl'),
        import('maplibre-gl/dist/maplibre-gl.css'),
      ]);
      if (cancelled || !containerRef.current) return;
      mlRef.current = ml;
      const { viewport } = useAppStore.getState();

      const map = new ml.Map({
        container: containerRef.current,
        style: import.meta.env.VITE_MAP_STYLE_URL || (TILE_STYLE as never),
        center: [viewport.center.lng, viewport.center.lat],
        zoom: viewport.zoom,
        minZoom: 10,
        maxZoom: 17,
        attributionControl: { compact: true },
        maxBounds: [
          [GEO_BOUNDS.west - 0.12, GEO_BOUNDS.south - 0.06],
          [GEO_BOUNDS.east + 0.12, GEO_BOUNDS.north + 0.06],
        ],
      });
      mapRef.current = map;

      map.on('load', () => {
        if (cancelled) return;
        setLoading(false);
        addStaticLayers(map);
        syncAll(map);
      });
      map.on('error', (e) => {
        // tiles no disponibles (offline) — aviso sin romper (UX_FLOWS §3)
        if (String(e.error?.message ?? '').includes('Failed to fetch') || !navigator.onLine) {
          setTilesError(true);
        }
      });
      map.on('moveend', () => {
        const c = map.getCenter();
        setViewport({ center: { lng: c.lng, lat: c.lat }, zoom: map.getZoom() });
      });
      map.on('click', (e) => {
        const state = useAppStore.getState();
        if (state.placing) {
          const geo = { lng: e.lngLat.lng, lat: e.lngLat.lat };
          state.setProvisional({ geo, svg: geoToSvg(geo) });
          return;
        }
        if (state.activeSection === AppSection.Neighborhoods) {
          const hits = map.queryRenderedFeatures(e.point, { layers: ['hoods-fill'] });
          const id = hits[0]?.properties?.id as string | undefined;
          state.selectNeighborhood((id as never) ?? null);
          return;
        }
        state.selectPin(null);
      });
    })();
    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Capas estáticas: barrios + grid ---
  function addStaticLayers(map: maplibregl.Map) {
    map.addSource('hoods', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: NEIGHBORHOODS.map((n) => ({
          type: 'Feature' as const,
          properties: { id: n.id, color: n.color },
          geometry: { type: 'Polygon' as const, coordinates: [hoodGeoRing(n)] },
        })),
      },
    });
    map.addLayer({
      id: 'hoods-fill',
      type: 'fill',
      source: 'hoods',
      paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.25 },
    });
    map.addLayer({
      id: 'hoods-line',
      type: 'line',
      source: 'hoods',
      paint: { 'line-color': ['get', 'color'], 'line-width': 1.5, 'line-opacity': 0.9 },
    });

    // Grid REAL: streets y avenues siguen la inclinación (~29°) de la grilla de Manhattan
    const gridFeatures = [...STREET_GEO_LINES, ...AVENUE_GEO_LINES].map((line) => ({
      type: 'Feature' as const,
      properties: { key: line.isKey },
      geometry: {
        type: 'LineString' as const,
        coordinates: line.path.map((p) => [p.lng, p.lat]),
      },
    }));
    map.addSource('grid', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: gridFeatures },
    });
    map.addLayer({
      id: 'grid-lines',
      type: 'line',
      source: 'grid',
      layout: { visibility: 'none' },
      paint: {
        'line-color': '#E6EDF3',
        'line-width': ['case', ['get', 'key'], 1.4, 0.7],
        'line-opacity': ['case', ['get', 'key'], 0.5, 0.25],
      },
    });
    map.addSource('broadway', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: GRID.broadway.geoPath.map((p) => [p.lng, p.lat]),
        },
      },
    });
    map.addLayer({
      id: 'broadway-line',
      type: 'line',
      source: 'broadway',
      layout: { visibility: 'none', 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#F7C948', 'line-width': 3, 'line-opacity': 0.9 },
    });
  }

  // --- Sincronización con el store (selección, sección, pins) ---
  function syncAll(map: maplibregl.Map) {
    syncSelection(map);
    syncSectionLayers(map);
    syncMarkers(map);
  }

  function syncSelection(map: maplibregl.Map) {
    const { selectedNeighborhoodId, activeSection } = useAppStore.getState();
    if (!map.getLayer('hoods-fill')) return;
    const inBarrios = activeSection === AppSection.Neighborhoods;
    map.setPaintProperty(
      'hoods-fill',
      'fill-opacity',
      !inBarrios
        ? 0.08
        : selectedNeighborhoodId
          ? ['case', ['==', ['get', 'id'], selectedNeighborhoodId], 0.45, 0.08]
          : 0.25,
    );
    map.setPaintProperty(
      'hoods-line',
      'line-opacity',
      !inBarrios
        ? 0.3
        : selectedNeighborhoodId
          ? ['case', ['==', ['get', 'id'], selectedNeighborhoodId], 1, 0.3]
          : 0.9,
    );
  }

  function syncSectionLayers(map: maplibregl.Map) {
    const { activeSection } = useAppStore.getState();
    const gridVisible = activeSection === AppSection.Grid ? 'visible' : 'none';
    if (map.getLayer('grid-lines')) map.setLayoutProperty('grid-lines', 'visibility', gridVisible);
    if (map.getLayer('broadway-line'))
      map.setLayoutProperty('broadway-line', 'visibility', gridVisible);
  }

  /** Markers DOM: pins del itinerario + provisional + labels de barrios/grid. */
  function syncMarkers(map: maplibregl.Map) {
    const ml = mlRef.current;
    if (!ml) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const app = useAppStore.getState();
    const { days } = useItineraryStore.getState();

    // Labels de barrios en su centroide geográfico real (solo sección Barrios)
    if (app.activeSection === AppSection.Neighborhoods) {
      for (const n of NEIGHBORHOODS) {
        if (app.selectedNeighborhoodId && app.selectedNeighborhoodId !== n.id) continue;
        const el = document.createElement('div');
        el.className = 'real-label hood-name';
        el.textContent = n.name;
        const center = hoodGeoCentroid(n.id);
        markersRef.current.push(
          new ml.Marker({ element: el }).setLngLat([center.lng, center.lat]).addTo(map),
        );
      }
    }

    // Labels del grid, rotadas para seguir sus líneas (solo sección Grid)
    if (app.activeSection === AppSection.Grid) {
      const gridLabel = (text: string, angle: number) => {
        const el = document.createElement('div');
        el.className = 'real-label';
        const span = document.createElement('span');
        span.textContent = text;
        span.style.display = 'inline-block';
        span.style.transform = `rotate(${angle.toFixed(1)}deg)`;
        el.appendChild(span);
        return el;
      };
      // Streets: etiqueta en el extremo oeste (Hudson), alineada con la calle
      for (const line of STREET_GEO_LINES) {
        const p = linePointAt(line.path, 0.02);
        markersRef.current.push(
          new ml.Marker({ element: gridLabel(line.label, lineAngleDeg(line.path)), anchor: 'left' })
            .setLngLat([p.lng, p.lat])
            .addTo(map),
        );
      }
      // Avenues: solo las clave, con stagger a lo largo de la avenida para no superponerse
      const keyAvenues = AVENUE_GEO_LINES.filter((a) => a.isKey);
      keyAvenues.forEach((line, i) => {
        const t = 0.3 + (i % 3) * 0.22; // stagger
        const p = linePointAt(line.path, t);
        markersRef.current.push(
          new ml.Marker({ element: gridLabel(line.label, lineAngleDeg(line.path)) })
            .setLngLat([p.lng, p.lat])
            .addTo(map),
        );
      });
      // Broadway: etiqueta sobre la diagonal, a la altura del Upper West Side
      const bwayPts = GRID.broadway.geoPath;
      const bwayAnchor = bwayPts[3]; // ~72nd St
      const bwayAngle = lineAngleDeg([bwayPts[2], bwayPts[4]]);
      const bwayEl = gridLabel('BROADWAY', bwayAngle);
      bwayEl.style.color = '#F7C948';
      markersRef.current.push(
        new ml.Marker({ element: bwayEl }).setLngLat([bwayAnchor.lng, bwayAnchor.lat]).addTo(map),
      );
    }

    // Pins del itinerario (solo sección Itinerario)
    if (app.activeSection === AppSection.Itinerary) {
      const visibleDays = app.focusedDayId
        ? days.filter((d) => d.id === app.focusedDayId)
        : days;
      for (const day of visibleDays) {
        for (const pin of day.pins) {
          const el = document.createElement('div');
          el.className = 'pin-marker';
          el.setAttribute('role', 'button');
          el.setAttribute('aria-label', `Lugar ${pin.name}, ${day.name}`);
          el.innerHTML = pinSvgHtml(day.color, 32);
          el.addEventListener('click', (ev) => {
            ev.stopPropagation();
            useAppStore.getState().selectPin(pin.id);
          });
          markersRef.current.push(
            new ml.Marker({ element: el, anchor: 'bottom' })
              .setLngLat([pin.geo.lng, pin.geo.lat])
              .addTo(map),
          );
        }
      }

      // Marcador provisional (arrastrable)
      if (app.placing && app.provisional) {
        const el = document.createElement('div');
        el.className = 'pin-marker';
        el.innerHTML = pinSvgHtml('#F7C948', 38);
        const marker = new ml.Marker({ element: el, anchor: 'bottom', draggable: true })
          .setLngLat([app.provisional.geo.lng, app.provisional.geo.lat])
          .addTo(map);
        marker.on('dragend', () => {
          const p = marker.getLngLat();
          const geo = { lng: p.lng, lat: p.lat };
          useAppStore.getState().setProvisional({ geo, svg: geoToSvg(geo) });
        });
        markersRef.current.push(marker);
      }
    }
  }

  // Suscripciones: re-sincronizar cuando cambia el estado relevante
  useEffect(() => {
    const unsubApp = useAppStore.subscribe((state, prev) => {
      const map = mapRef.current;
      if (!map || !map.isStyleLoaded()) return;
      if (
        state.selectedNeighborhoodId !== prev.selectedNeighborhoodId ||
        state.activeSection !== prev.activeSection
      ) {
        syncSelection(map);
        syncSectionLayers(map);
        syncMarkers(map);
      } else if (
        state.focusedDayId !== prev.focusedDayId ||
        state.placing !== prev.placing ||
        state.provisional !== prev.provisional
      ) {
        syncMarkers(map);
      }
    });
    const unsubIt = useItineraryStore.subscribe(() => {
      const map = mapRef.current;
      if (map && map.isStyleLoaded()) syncMarkers(map);
    });
    return () => {
      unsubApp();
      unsubIt();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="real-map" ref={containerRef}>
      {loading && (
        <div className="map-loading">
          <div className="spinner" aria-label="Cargando mapa" />
        </div>
      )}
      {tilesError && (
        <div className="map-offline-note">
          <span>Mapa real no disponible sin conexión</span>
          <button onClick={() => setMapMode(MapMode.Schematic)}>Usar esquemático</button>
        </div>
      )}
    </div>
  );
}

function pinSvgHtml(color: string, size: number): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24">
    <path d="M12 0C6.5 0 2 4.5 2 10c0 7 10 12 10 12s10-5 10-12C22 4.5 17.5 0 12 0z"
      fill="${color}" stroke="rgba(255,255,255,0.7)" stroke-width="1.2"/>
    <circle cx="12" cy="9.5" r="3.4" fill="rgba(13,17,23,0.85)"/>
  </svg>`;
}
