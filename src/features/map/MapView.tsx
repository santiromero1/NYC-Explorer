// El mapa (MapLibre GL + basemap CARTO Positron, el mismo look del diseño).
// Capas: barrios reales, grid de calles/avenidas, subway y pines del itinerario.
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTripStore, type Mode } from '../../store/useTripStore';
import { allStops, type Stop } from '../../data/itinerary';
import { NB_FC, nbColor, neighborhoods, neighborhoodByName, CALLES, SUBWAY_LINES_FC, SUBWAY_STATIONS_FC } from '../../data/geo';

const STYLE_URL = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const GLYPHS_URL = 'https://tiles.basemaps.cartocdn.com/fonts/{fontstack}/{range}.pbf';
const FONT_BOLD = ['Montserrat Bold', 'Montserrat Medium', 'Open Sans Bold', 'Noto Sans Regular'];

// Fallback raster (mismas tiles que el prototipo) por si el estilo vectorial no carga
const RASTER_FALLBACK: maplibregl.StyleSpecification = {
  version: 8,
  glyphs: GLYPHS_URL,
  sources: {
    carto: {
      type: 'raster',
      tiles: ['a', 'b', 'c', 'd'].map((s) => `https://${s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png`),
      tileSize: 256,
    },
  },
  layers: [{ id: 'carto', type: 'raster', source: 'carto' }],
};

const MANHATTAN_BOUNDS: [[number, number], [number, number]] = [
  [-74.02, 40.7],
  [-73.928, 40.822],
];

interface LayerFlags {
  nb: boolean;
  calles: boolean;
  subway: boolean;
  pins: boolean;
}
function layerFlags(s: { mode: Mode; ovBarrios: boolean; ovCalles: boolean; ovSubway: boolean }): LayerFlags {
  return {
    nb: s.mode === 'barrios' || (s.mode === 'itinerario' && s.ovBarrios),
    calles: s.mode === 'calles' || (s.mode === 'itinerario' && s.ovCalles),
    subway: s.mode === 'subway' || (s.mode === 'itinerario' && s.ovSubway),
    pins: s.mode === 'itinerario',
  };
}

/** GeoJSON de barrios con color resuelto + nombre para etiqueta. */
function nbSourceData() {
  return {
    type: 'FeatureCollection' as const,
    features: NB_FC.features.map((f) => ({
      ...f,
      properties: { ...f.properties, color: nbColor(f.properties), label: f.properties.name.toUpperCase() },
    })),
  };
}
function nbLabelData() {
  // una etiqueta por barrio (los NTAs traen polígonos repetidos por nombre)
  return {
    type: 'FeatureCollection' as const,
    features: neighborhoods()
      .filter((n) => n.major)
      .map((n) => ({
        type: 'Feature' as const,
        properties: { label: n.name.toUpperCase() },
        geometry: { type: 'Point' as const, coordinates: n.center },
      })),
  };
}
function callesSourceData() {
  const toLngLat = (line: [number, number][]) => line.map(([lat, lng]) => [lng, lat]);
  return {
    lines: {
      type: 'FeatureCollection' as const,
      features: [
        ...CALLES.avenues.map((av) => ({
          type: 'Feature' as const,
          properties: { kind: 'av', diag: !!av.diag },
          geometry: { type: 'LineString' as const, coordinates: toLngLat(av.line) },
        })),
        ...CALLES.streets.map((st) => ({
          type: 'Feature' as const,
          properties: { kind: 'st', diag: false },
          geometry: { type: 'LineString' as const, coordinates: toLngLat(st.line) },
        })),
      ],
    },
    labels: {
      type: 'FeatureCollection' as const,
      features: [
        ...CALLES.avenues.map((av) => {
          const [lat, lng] = av.line[av.line.length - 1];
          return {
            type: 'Feature' as const,
            properties: { label: av.name, color: '#0060d0' },
            geometry: { type: 'Point' as const, coordinates: [lng, lat] },
          };
        }),
        ...CALLES.streets.map((st) => {
          const [lat, lng] = st.line[0];
          return {
            type: 'Feature' as const,
            properties: { label: st.name, color: '#C86A00' },
            geometry: { type: 'Point' as const, coordinates: [lng, lat] },
          };
        }),
      ],
    },
  };
}

export function MapView({ isDesktop }: { isDesktop: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, { marker: maplibregl.Marker; el: HTMLDivElement; stop: Stop }>>(new Map());
  const zoomCtrlRef = useRef<maplibregl.NavigationControl | null>(null);
  const isDesktopRef = useRef(isDesktop);
  isDesktopRef.current = isDesktop;

  // ---- encuadres -----------------------------------------------------------
  function fitPadding() {
    const map = mapRef.current!;
    const w = map.getContainer().clientWidth || window.innerWidth;
    const h = map.getContainer().clientHeight || window.innerHeight;
    return isDesktopRef.current
      ? { left: Math.min(410, Math.round(w * 0.5)), top: 50, right: 50, bottom: 50 }
      : { left: 40, right: 40, top: Math.min(150, Math.round(h * 0.2)), bottom: Math.min(Math.round(h * 0.42), Math.round(h * 0.5)) };
  }
  function safeFit(bounds: maplibregl.LngLatBoundsLike, maxZoom = 16) {
    const map = mapRef.current;
    if (!map) return;
    try {
      map.fitBounds(bounds, { padding: fitPadding(), maxZoom, duration: 550, essential: true });
    } catch {
      map.fitBounds(bounds, { maxZoom, duration: 0 });
    }
  }
  function fitDay(day: number | 'all') {
    const pts = allStops().filter((p) => day === 'all' || p.day === day);
    if (!pts.length) return;
    const b = new maplibregl.LngLatBounds();
    pts.forEach((p) => b.extend([p.lng, p.lat]));
    safeFit(b, day === 'all' ? 12 : 15);
  }
  function fitForMode() {
    const s = useTripStore.getState();
    if (s.mode === 'itinerario') fitDay(s.activeDay);
    else safeFit(MANHATTAN_BOUNDS, 13);
  }

  // ---- capas ---------------------------------------------------------------
  function addLayers(map: maplibregl.Map) {
    const firstSymbol = map.getStyle().layers?.find((l) => l.type === 'symbol')?.id;

    // Barrios
    map.addSource('nb', { type: 'geojson', data: nbSourceData() });
    map.addLayer(
      { id: 'nb-fill', type: 'fill', source: 'nb', layout: { visibility: 'none' }, paint: { 'fill-color': ['get', 'color'], 'fill-opacity': 0.26 } },
      firstSymbol,
    );
    map.addLayer(
      {
        id: 'nb-line',
        type: 'line',
        source: 'nb',
        layout: { visibility: 'none', 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 1.5, 'line-opacity': 0.85 },
      },
      firstSymbol,
    );
    map.addSource('nb-labels', { type: 'geojson', data: nbLabelData() });
    map.addLayer({
      id: 'nb-labels',
      type: 'symbol',
      source: 'nb-labels',
      layout: {
        visibility: 'none',
        'text-field': ['get', 'label'],
        'text-font': FONT_BOLD,
        'text-size': 11,
        'text-letter-spacing': 0.02,
        'text-line-height': 1.05,
        'text-max-width': 8,
      },
      paint: { 'text-color': '#1c1c1e', 'text-halo-color': '#ffffff', 'text-halo-width': 1.8 },
    });
    map.on('click', 'nb-fill', (e) => {
      const state = useTripStore.getState();
      if (state.mode !== 'barrios') return;
      const name = e.features?.[0]?.properties?.name as string | undefined;
      if (name) state.selectNb(name);
    });
    map.on('mouseenter', 'nb-fill', () => {
      if (useTripStore.getState().mode === 'barrios') map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'nb-fill', () => (map.getCanvas().style.cursor = ''));

    // Calles (grid)
    const calles = callesSourceData();
    map.addSource('calles', { type: 'geojson', data: calles.lines });
    map.addLayer(
      {
        id: 'calles-av',
        type: 'line',
        source: 'calles',
        filter: ['==', ['get', 'kind'], 'av'],
        layout: { visibility: 'none', 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#0A84FF', 'line-width': ['case', ['get', 'diag'], 4, 3.2], 'line-opacity': 0.5 },
      },
      firstSymbol,
    );
    map.addLayer(
      {
        id: 'calles-st',
        type: 'line',
        source: 'calles',
        filter: ['==', ['get', 'kind'], 'st'],
        layout: { visibility: 'none' },
        paint: { 'line-color': '#FF9500', 'line-width': 1.6, 'line-opacity': 0.65, 'line-dasharray': [2.5, 2.5] },
      },
      firstSymbol,
    );
    map.addSource('calles-labels', { type: 'geojson', data: calles.labels });
    map.addLayer({
      id: 'calles-labels',
      type: 'symbol',
      source: 'calles-labels',
      layout: {
        visibility: 'none',
        'text-field': ['get', 'label'],
        'text-font': FONT_BOLD,
        'text-size': 10,
        'text-allow-overlap': true,
      },
      paint: { 'text-color': ['get', 'color'], 'text-halo-color': '#ffffff', 'text-halo-width': 1.6 },
    });

    // Subway
    map.addSource('subway-lines', { type: 'geojson', data: SUBWAY_LINES_FC as never });
    map.addLayer(
      {
        id: 'subway-lines',
        type: 'line',
        source: 'subway-lines',
        layout: { visibility: 'none', 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 3.4, 'line-opacity': 0.85 },
      },
      firstSymbol,
    );
    map.addSource('subway-stations', { type: 'geojson', data: SUBWAY_STATIONS_FC as never });
    map.addLayer({
      id: 'subway-stations',
      type: 'circle',
      source: 'subway-stations',
      layout: { visibility: 'none' },
      paint: {
        'circle-radius': 4,
        'circle-color': '#333333',
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 1.5,
      },
    });
    const stationPopup = new maplibregl.Popup({ closeButton: false, offset: 10, className: 'station-popup' });
    map.on('click', 'subway-stations', (e) => {
      const f = e.features?.[0];
      if (!f) return;
      const { name, lines } = f.properties as { name: string; lines: string };
      stationPopup
        .setLngLat((f.geometry as unknown as { coordinates: [number, number] }).coordinates)
        .setText(lines ? `${name} · ${lines}` : name)
        .addTo(map);
    });
    map.on('mouseenter', 'subway-stations', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'subway-stations', () => (map.getCanvas().style.cursor = ''));
  }

  // ---- pines del itinerario (markers DOM) ----------------------------------
  const addedPins = useRef<Set<string>>(new Set());
  function buildMarkers() {
    for (const stop of allStops()) {
      const el = document.createElement('div');
      el.className = 'pin';
      el.style.setProperty('--pin-color', stop.color);
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', `Parada ${stop.stop}: ${stop.name}`);
      el.innerHTML = `<div class="pin-body"><span class="pin-label">${stop.stop}</span></div>`;
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        useTripStore.getState().selectPlace(stop.id);
      });
      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' }).setLngLat([stop.lng, stop.lat]);
      markersRef.current.set(stop.id, { marker, el, stop });
    }
  }
  function syncMarkers(map: maplibregl.Map) {
    const s = useTripStore.getState();
    const flags = layerFlags(s);
    const q = s.query.trim().toLowerCase();
    for (const { marker, el, stop } of markersRef.current.values()) {
      const dayOk = s.activeDay === 'all' || stop.day === s.activeDay;
      const qOk = !q || stop.name.toLowerCase().includes(q) || stop.type.toLowerCase().includes(q);
      const show = flags.pins && dayOk && qOk;
      const added = addedPins.current.has(stop.id);
      if (show && !added) {
        marker.addTo(map);
        addedPins.current.add(stop.id);
      }
      if (!show && added) {
        marker.remove();
        addedPins.current.delete(stop.id);
      }
      const visited = !!s.visited[stop.id];
      const selected = s.selId === stop.id;
      el.classList.toggle('visited', visited);
      el.classList.toggle('selected', selected);
      const label = el.querySelector('.pin-label');
      if (label) label.textContent = visited ? '✓' : String(stop.stop);
    }
  }

  function syncLayers(map: maplibregl.Map) {
    const flags = layerFlags(useTripStore.getState());
    const vis = (ids: string[], on: boolean) => {
      for (const id of ids) if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none');
    };
    vis(['nb-fill', 'nb-line', 'nb-labels'], flags.nb);
    vis(['calles-av', 'calles-st', 'calles-labels'], flags.calles);
    vis(['subway-lines', 'subway-stations'], flags.subway);
    syncMarkers(map);
  }

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [-73.97, 40.75],
      zoom: 12,
      minZoom: 9,
      maxZoom: 18,
      attributionControl: false,
    });
    mapRef.current = map;
    map.on('error', () => {
      // estilo vectorial caído -> raster tiles del prototipo
      if (!map.isStyleLoaded() && !cancelled) map.setStyle(RASTER_FALLBACK);
    });

    map.on('load', () => {
      if (cancelled) return;
      addLayers(map);
      buildMarkers();
      syncLayers(map);
      fitForMode();
    });

    const onResize = () => map.resize();
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(containerRef.current);

    const unsub = useTripStore.subscribe((state, prev) => {
      if (!map.isStyleLoaded()) return;
      if (state.mode !== prev.mode) {
        syncLayers(map);
        fitForMode();
        return;
      }
      if (state.ovBarrios !== prev.ovBarrios || state.ovCalles !== prev.ovCalles || state.ovSubway !== prev.ovSubway) {
        syncLayers(map);
      }
      if (state.activeDay !== prev.activeDay) {
        syncMarkers(map);
        fitDay(state.activeDay);
      }
      if (state.query !== prev.query) syncMarkers(map);
      if (state.visited !== prev.visited) syncMarkers(map);
      if (state.selId !== prev.selId) {
        syncMarkers(map);
        if (state.selId) {
          const stop = markersRef.current.get(state.selId)?.stop;
          if (stop) {
            const offLat = isDesktopRef.current ? 0 : 0.008;
            map.easeTo({
              center: [stop.lng, stop.lat - offLat],
              zoom: Math.max(map.getZoom(), 15),
              duration: 600,
              essential: true,
            });
          }
        }
      }
      if (state.selNb !== prev.selNb && state.selNb) {
        const nb = neighborhoodByName(state.selNb);
        if (nb) safeFit(nb.bounds, 15);
      }
      if (state.recenterTick !== prev.recenterTick) fitForMode();
    });

    return () => {
      cancelled = true;
      unsub();
      ro.disconnect();
      window.removeEventListener('resize', onResize);
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // control de zoom solo en desktop (abajo a la derecha, como el diseño)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (isDesktop && !zoomCtrlRef.current) {
      zoomCtrlRef.current = new maplibregl.NavigationControl({ showCompass: false });
      map.addControl(zoomCtrlRef.current, 'bottom-right');
    } else if (!isDesktop && zoomCtrlRef.current) {
      map.removeControl(zoomCtrlRef.current);
      zoomCtrlRef.current = null;
    }
    map.resize();
  }, [isDesktop]);

  return <div className="map" ref={containerRef} />;
}
