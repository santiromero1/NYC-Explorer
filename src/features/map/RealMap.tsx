// El mapa de NYC Explorer (MapLibre GL, lazy).
// Basemap VECTORIAL de CARTO re-estilizado en runtime con los design tokens de la app:
// el mapa ES el diseño (agua, calles, parques y labels con nuestra paleta), y los
// barrios/grid/labels son capas nativas del estilo — no un overlay sobre tiles ajenos.
import { useEffect, useRef, useState } from 'react';
import type maplibregl from 'maplibre-gl';
import { AppSection } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useItineraryStore } from '../../store/useItineraryStore';
import { NEIGHBORHOODS } from '../../data/neighborhoods';
import { GRID } from '../../data/grid';
import { HOOD_GEO, hoodGeoCentroid } from '../../data/neighborhoodsGeo';
import { STREET_GEO_LINES, AVENUE_GEO_LINES } from '../../data/gridGeo';
import { geoToSvg, GEO_BOUNDS } from './projection';

type ML = typeof import('maplibre-gl');

const BASE_STYLE_URL = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const GLYPHS_URL = 'https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf';

const FONT_MEDIUM = ['Montserrat Medium', 'Open Sans Bold', 'Noto Sans Regular'];
const FONT_REGULAR = ['Montserrat Regular', 'Open Sans Regular', 'Noto Sans Regular'];

// Fallback raster por si el estilo vectorial no carga (red irregular)
const RASTER_FALLBACK = {
  version: 8 as const,
  glyphs: GLYPHS_URL,
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

// ---------------------------------------------------------------------------
// Re-estilizado del basemap con los tokens de la app (Design Spec §10)
// ---------------------------------------------------------------------------
const PALETTE = {
  bg: '#0D1117',
  land: '#10161E',
  landAlt: '#11181F',
  park: '#14211B',
  water: '#101D2B',
  waterLine: '#16283B',
  waterText: '#3D5A78',
  building: '#141B23',
  roadCasing: '#0E141B',
  roadMajor: '#2E3C4C',
  roadSec: '#25303D',
  roadMinor: '#1C2632',
  rail: '#1A2430',
  text: '#6E7681',
  textCity: '#8B949E',
  roadText: '#7D8894',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function patchBaseStyle(style: any): void {
  for (const layer of style.layers ?? []) {
    const id: string = layer.id ?? '';
    layer.paint = layer.paint ?? {};
    layer.layout = layer.layout ?? {};

    if (layer.type === 'background') {
      layer.paint['background-color'] = PALETTE.bg;
    } else if (id === 'water' || id === 'water_shadow') {
      layer.paint['fill-color'] = id === 'water' ? PALETTE.water : PALETTE.bg;
    } else if (id === 'waterway') {
      layer.paint['line-color'] = PALETTE.waterLine;
    } else if (/^park|landcover/.test(id)) {
      layer.paint['fill-color'] = PALETTE.park;
      layer.paint['fill-opacity'] = 0.9;
    } else if (/^landuse/.test(id)) {
      layer.paint['fill-color'] = PALETTE.landAlt;
    } else if (/^building/.test(id)) {
      layer.paint['fill-color'] = PALETTE.building;
      layer.paint['fill-opacity'] = 0.55;
    } else if (/^boundary/.test(id)) {
      layer.layout.visibility = 'none';
    } else if (/^aeroway/.test(id)) {
      layer.paint['line-color'] = PALETTE.roadMinor;
    } else if (layer.type === 'line' && /_case/.test(id)) {
      layer.paint['line-color'] = PALETTE.roadCasing;
    } else if (layer.type === 'line' && /(mot|trunk|pri)_fill/.test(id)) {
      layer.paint['line-color'] = PALETTE.roadMajor;
    } else if (layer.type === 'line' && /sec_fill/.test(id)) {
      layer.paint['line-color'] = PALETTE.roadSec;
    } else if (layer.type === 'line' && /(minor|service|path)_fill|_path$/.test(id)) {
      layer.paint['line-color'] = PALETTE.roadMinor;
    } else if (/^rail/.test(id)) {
      layer.paint['line-color'] = PALETTE.rail;
    } else if (layer.type === 'symbol') {
      if (/^poi_|^housenumber/.test(id)) {
        layer.layout.visibility = 'none';
        continue;
      }
      const isWater = /^watername|^waterway_label/.test(id);
      const isCity = /^place_/.test(id);
      const isRoad = /^roadname/.test(id);
      layer.paint['text-color'] = isWater
        ? PALETTE.waterText
        : isCity
          ? PALETTE.textCity
          : isRoad
            ? PALETTE.roadText
            : PALETTE.text;
      layer.paint['text-halo-color'] = PALETTE.bg;
      layer.paint['text-halo-width'] = 1.1;
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadBaseStyle(): Promise<any> {
  try {
    const res = await fetch(BASE_STYLE_URL);
    if (!res.ok) throw new Error(`style ${res.status}`);
    const style = await res.json();
    patchBaseStyle(style);
    return style;
  } catch {
    return RASTER_FALLBACK;
  }
}

/** Anillo cerrado [lng,lat][] del polígono geográfico real del barrio. */
function hoodGeoRing(n: (typeof NEIGHBORHOODS)[number]): [number, number][] {
  const ring = HOOD_GEO[n.id].map((p) => [p.lng, p.lat] as [number, number]);
  ring.push(ring[0]);
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [ml, style] = await Promise.all([
        import('maplibre-gl'),
        loadBaseStyle(),
        import('maplibre-gl/dist/maplibre-gl.css'),
      ]);
      if (cancelled || !containerRef.current) return;
      mlRef.current = ml;
      const { viewport } = useAppStore.getState();

      const map = new ml.Map({
        container: containerRef.current,
        style,
        center: [viewport.center.lng, viewport.center.lat],
        zoom: viewport.zoom,
        minZoom: 10,
        maxZoom: 17,
        attributionControl: { compact: true },
        maxBounds: [
          [GEO_BOUNDS.west - 0.14, GEO_BOUNDS.south - 0.08],
          [GEO_BOUNDS.east + 0.14, GEO_BOUNDS.north + 0.06],
        ],
      });
      mapRef.current = map;

      map.on('load', () => {
        if (cancelled) return;
        setLoading(false);
        addAppLayers(map);
        syncAll(map);
      });
      map.on('error', (e) => {
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
        if (state.activeSection === AppSection.Neighborhoods && map.getLayer('hoods-fill')) {
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

  // --- Capas propias de la app, insertadas DEBAJO de las labels del basemap ---
  function addAppLayers(map: maplibregl.Map) {
    // Primer symbol layer del basemap: nuestras formas van debajo, las labels encima
    const firstSymbol = map.getStyle().layers?.find((l) => l.type === 'symbol')?.id;

    // Barrios
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
    map.addLayer(
      {
        id: 'hoods-fill',
        type: 'fill',
        source: 'hoods',
        paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.2 },
      },
      firstSymbol,
    );
    map.addLayer(
      {
        id: 'hoods-line',
        type: 'line',
        source: 'hoods',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 1.2, 'line-opacity': 0.85 },
      },
      firstSymbol,
    );

    // Labels de barrios: capa nativa con colisión/halo, estilo "mapa de verdad"
    map.addSource('hood-labels', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: NEIGHBORHOODS.map((n) => {
          const c = hoodGeoCentroid(n.id);
          return {
            type: 'Feature' as const,
            properties: { id: n.id, name: n.name.toUpperCase() },
            geometry: { type: 'Point' as const, coordinates: [c.lng, c.lat] },
          };
        }),
      },
    });
    map.addLayer({
      id: 'hood-labels',
      type: 'symbol',
      source: 'hood-labels',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': FONT_MEDIUM,
        'text-size': ['interpolate', ['linear'], ['zoom'], 10.5, 10, 13, 13.5],
        'text-letter-spacing': 0.12,
        'text-max-width': 7,
      },
      paint: {
        'text-color': '#E6EDF3',
        'text-halo-color': PALETTE.bg,
        'text-halo-width': 1.6,
      },
    });

    // Grid: streets + avenues reales (inclinadas), labels a lo largo de la línea
    map.addSource('grid', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [...STREET_GEO_LINES, ...AVENUE_GEO_LINES].map((line) => ({
          type: 'Feature' as const,
          properties: { label: line.label, key: line.isKey },
          geometry: {
            type: 'LineString' as const,
            coordinates: line.path.map((p) => [p.lng, p.lat]),
          },
        })),
      },
    });
    map.addLayer(
      {
        id: 'grid-lines',
        type: 'line',
        source: 'grid',
        layout: { visibility: 'none' },
        paint: {
          'line-color': '#E6EDF3',
          'line-width': ['case', ['get', 'key'], 1.3, 0.6],
          'line-opacity': ['case', ['get', 'key'], 0.45, 0.22],
        },
      },
      firstSymbol,
    );
    map.addLayer({
      id: 'grid-labels',
      type: 'symbol',
      source: 'grid',
      layout: {
        visibility: 'none',
        'symbol-placement': 'line',
        'symbol-spacing': 420,
        'text-field': ['get', 'label'],
        'text-font': FONT_REGULAR,
        'text-size': ['case', ['get', 'key'], 11.5, 10],
      },
      paint: {
        'text-color': ['case', ['get', 'key'], '#B9C3CD', '#79838E'],
        'text-halo-color': PALETTE.bg,
        'text-halo-width': 1.4,
      },
    });

    // Broadway: la excepción diagonal, en amarillo taxi
    map.addSource('broadway', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: { label: 'BROADWAY' },
        geometry: {
          type: 'LineString',
          coordinates: GRID.broadway.geoPath.map((p) => [p.lng, p.lat]),
        },
      },
    });
    map.addLayer(
      {
        id: 'broadway-line',
        type: 'line',
        source: 'broadway',
        layout: { visibility: 'none', 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#F7C948', 'line-width': 2.5, 'line-opacity': 0.9 },
      },
      firstSymbol,
    );
    map.addLayer({
      id: 'broadway-label',
      type: 'symbol',
      source: 'broadway',
      layout: {
        visibility: 'none',
        'symbol-placement': 'line',
        'symbol-spacing': 520,
        'text-field': ['get', 'label'],
        'text-font': FONT_MEDIUM,
        'text-size': 11.5,
        'text-letter-spacing': 0.18,
      },
      paint: {
        'text-color': '#F7C948',
        'text-halo-color': PALETTE.bg,
        'text-halo-width': 1.4,
      },
    });
  }

  // --- Sincronización con el estado (sección, selección, pins) ---
  function syncAll(map: maplibregl.Map) {
    syncSectionLayers(map);
    syncMarkers(map);
  }

  function syncSectionLayers(map: maplibregl.Map) {
    if (!map.getLayer('hoods-fill')) return;
    const { activeSection, selectedNeighborhoodId: sel } = useAppStore.getState();
    const inBarrios = activeSection === AppSection.Neighborhoods;

    map.setPaintProperty(
      'hoods-fill',
      'fill-opacity',
      !inBarrios ? 0.05 : sel ? ['case', ['==', ['get', 'id'], sel], 0.4, 0.05] : 0.2,
    );
    map.setPaintProperty(
      'hoods-line',
      'line-opacity',
      !inBarrios ? 0.22 : sel ? ['case', ['==', ['get', 'id'], sel], 1, 0.25] : 0.85,
    );
    map.setPaintProperty(
      'hoods-line',
      'line-width',
      sel && inBarrios ? ['case', ['==', ['get', 'id'], sel], 2.2, 1] : 1.2,
    );

    map.setLayoutProperty('hood-labels', 'visibility', inBarrios ? 'visible' : 'none');
    map.setFilter('hood-labels', sel && inBarrios ? ['==', ['get', 'id'], sel] : null);

    const gridVis = activeSection === AppSection.Grid ? 'visible' : 'none';
    for (const id of ['grid-lines', 'grid-labels', 'broadway-line', 'broadway-label']) {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', gridVis);
    }
  }

  /** POIs del itinerario: markers DOM numerados con el color del día. */
  function syncMarkers(map: maplibregl.Map) {
    const ml = mlRef.current;
    if (!ml) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const app = useAppStore.getState();
    if (app.activeSection !== AppSection.Itinerary) return;
    const { days } = useItineraryStore.getState();

    const visibleDays = app.focusedDayId ? days.filter((d) => d.id === app.focusedDayId) : days;
    for (const day of visibleDays) {
      day.pins.forEach((pin, i) => {
        const el = document.createElement('div');
        el.className = `poi-marker${pin.id === app.selectedPinId ? ' selected' : ''}`;
        el.style.setProperty('--poi-color', day.color);
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', `Lugar ${pin.name}, ${day.name}`);
        el.innerHTML = `<div class="poi-dot">${i + 1}</div><div class="poi-tail"></div>`;
        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          useAppStore.getState().selectPin(pin.id);
        });
        markersRef.current.push(
          new ml.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([pin.geo.lng, pin.geo.lat])
            .addTo(map),
        );
      });
    }

    // Marcador provisional (modo colocar), arrastrable y pulsante
    if (app.placing && app.provisional) {
      const el = document.createElement('div');
      el.className = 'poi-marker placing';
      el.style.setProperty('--poi-color', '#F7C948');
      el.innerHTML = `<div class="poi-dot">+</div><div class="poi-tail"></div>`;
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

  useEffect(() => {
    const unsubApp = useAppStore.subscribe((state, prev) => {
      const map = mapRef.current;
      if (!map || !map.isStyleLoaded()) return;
      if (
        state.selectedNeighborhoodId !== prev.selectedNeighborhoodId ||
        state.activeSection !== prev.activeSection
      ) {
        syncSectionLayers(map);
        syncMarkers(map);
      } else if (
        state.focusedDayId !== prev.focusedDayId ||
        state.placing !== prev.placing ||
        state.provisional !== prev.provisional ||
        state.selectedPinId !== prev.selectedPinId
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
          <span>Sin conexión: el mapa no puede cargar. El itinerario sigue disponible.</span>
        </div>
      )}
    </div>
  );
}
