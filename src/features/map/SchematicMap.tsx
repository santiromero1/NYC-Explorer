// Mapa esquemático de Manhattan (SVG propio) con pan/zoom táctil — MAP_CORE §1-3
// Los overlays (barrios, grid, pins) leen del store: misma verdad que el mapa real.
import { useEffect, useRef, useState } from 'react';
import { AppSection } from '../../types';
import type { SvgPoint } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { geoToSvg, svgToGeo, scaleToZoom, zoomToScale, VIEWBOX } from './projection';
import { ISLAND_OUTLINE, polygonToPath } from '../../data/manhattan';
import { NeighborhoodsSvg } from './overlays/NeighborhoodsSvg';
import { GridSvg } from './overlays/GridSvg';
import { PinsSvg } from './overlays/PinsSvg';
import { NEIGHBORHOODS } from '../../data/neighborhoods';

interface Transform {
  s: number;
  tx: number;
  ty: number;
}

const MIN_SCALE = 0.85;
const MAX_SCALE = 8;

function clampTransform(t: Transform): Transform {
  const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.s));
  const tx = Math.min(340, Math.max(60 - VIEWBOX.width * s, t.tx));
  const ty = Math.min(800, Math.max(100 - VIEWBOX.height * s, t.ty));
  return { s, tx, ty };
}

export function SchematicMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [transform, setTransform] = useState<Transform>({ s: 1, tx: 0, ty: 0 });
  const transformRef = useRef(transform);
  transformRef.current = transform;

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const gesture = useRef<{
    startTransform: Transform;
    startVb: SvgPoint; // punto (o midpoint) inicial en coords viewBox
    startDist: number;
    moved: boolean;
    startTime: number;
  } | null>(null);

  const activeSection = useAppStore((s) => s.activeSection);
  const placing = useAppStore((s) => s.placing);
  const viewport = useAppStore((s) => s.viewport);
  const setViewport = useAppStore((s) => s.setViewport);
  const selectNeighborhood = useAppStore((s) => s.selectNeighborhood);
  const setProvisional = useAppStore((s) => s.setProvisional);
  const selectPin = useAppStore((s) => s.selectPin);

  /** px por unidad svg con el fit "meet" actual. */
  const basePxPerUnit = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return 1;
    return Math.min(rect.width / VIEWBOX.width, rect.height / VIEWBOX.height);
  };

  /** Cliente -> coords del viewBox (sin el transform interno). */
  const clientToViewBox = (clientX: number, clientY: number): SvgPoint => {
    const rect = svgRef.current!.getBoundingClientRect();
    const scale = basePxPerUnit();
    const ox = (rect.width - VIEWBOX.width * scale) / 2;
    const oy = (rect.height - VIEWBOX.height * scale) / 2;
    return { x: (clientX - rect.left - ox) / scale, y: (clientY - rect.top - oy) / scale };
  };

  /** viewBox -> coords de contenido (aplicando el inverso del transform). */
  const viewBoxToContent = (vb: SvgPoint, t: Transform): SvgPoint => ({
    x: (vb.x - t.tx) / t.s,
    y: (vb.y - t.ty) / t.s,
  });

  // Al montar: posicionarse según el viewport compartido (MAP_CORE §5)
  useEffect(() => {
    const base = basePxPerUnit();
    const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, zoomToScale(viewport.zoom, base)));
    const c = geoToSvg(viewport.center);
    setTransform(
      clampTransform({
        s,
        tx: VIEWBOX.width / 2 - c.x * s,
        ty: VIEWBOX.height / 2 - c.y * s,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const commitViewport = () => {
    const t = transformRef.current;
    const centerContent = viewBoxToContent({ x: VIEWBOX.width / 2, y: VIEWBOX.height / 2 }, t);
    setViewport({
      center: svgToGeo(centerContent),
      zoom: scaleToZoom(t.s, basePxPerUnit()),
    });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    svgRef.current?.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const mid =
      pts.length >= 2
        ? { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
        : { x: e.clientX, y: e.clientY };
    gesture.current = {
      startTransform: transformRef.current,
      startVb: clientToViewBox(mid.x, mid.y),
      startDist:
        pts.length >= 2 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0,
      moved: gesture.current?.moved ?? false,
      startTime: Date.now(),
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];
    const g = gesture.current;

    if (pts.length >= 2) {
      // Pinch: escala alrededor del midpoint
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const factor = g.startDist > 0 ? dist / g.startDist : 1;
      const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, g.startTransform.s * factor));
      const vbMid = clientToViewBox(mid.x, mid.y);
      const anchor = viewBoxToContent(g.startVb, g.startTransform);
      setTransform(
        clampTransform({ s, tx: vbMid.x - anchor.x * s, ty: vbMid.y - anchor.y * s }),
      );
      g.moved = true;
    } else {
      // Pan
      const vbNow = clientToViewBox(e.clientX, e.clientY);
      const dx = vbNow.x - g.startVb.x;
      const dy = vbNow.y - g.startVb.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) g.moved = true;
      setTransform(
        clampTransform({
          s: g.startTransform.s,
          tx: g.startTransform.tx + dx,
          ty: g.startTransform.ty + dy,
        }),
      );
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const wasTap =
      gesture.current && !gesture.current.moved && Date.now() - gesture.current.startTime < 600;
    pointers.current.delete(e.pointerId);

    if (pointers.current.size === 0) {
      const g = gesture.current;
      gesture.current = null;
      if (wasTap && g) {
        handleTap(e.clientX, e.clientY);
      } else {
        commitViewport();
      }
    } else {
      // quedó un dedo: reiniciar gesto de pan con ese dedo
      const [remaining] = [...pointers.current.values()];
      gesture.current = {
        startTransform: transformRef.current,
        startVb: clientToViewBox(remaining.x, remaining.y),
        startDist: 0,
        moved: true,
        startTime: Date.now(),
      };
    }
  };

  const handleTap = (clientX: number, clientY: number) => {
    const t = transformRef.current;
    const content = viewBoxToContent(clientToViewBox(clientX, clientY), t);

    // Modo colocar pin: cualquier tap posiciona el marcador provisional (UX_FLOWS §9)
    if (placing) {
      setProvisional({ svg: content, geo: svgToGeo(content) });
      return;
    }

    // Sección Barrios: hit-test de zonas (rects) — el más chico gana si se superponen
    if (activeSection === AppSection.Neighborhoods) {
      let best: { id: (typeof NEIGHBORHOODS)[number]['id']; area: number } | null = null;
      for (const n of NEIGHBORHOODS) {
        if (n.svgShape.kind !== 'rect') continue;
        const r = n.svgShape;
        if (
          content.x >= r.x &&
          content.x <= r.x + r.width &&
          content.y >= r.y &&
          content.y <= r.y + r.height
        ) {
          const area = r.width * r.height;
          if (!best || area < best.area) best = { id: n.id, area };
        }
      }
      selectNeighborhood(best ? best.id : null);
      return;
    }

    // Cualquier otra sección: tap en vacío cierra popovers
    selectPin(null);
  };

  const onWheel = (e: React.WheelEvent) => {
    const t = transformRef.current;
    const factor = Math.exp(-e.deltaY * 0.002);
    const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.s * factor));
    const vb = clientToViewBox(e.clientX, e.clientY);
    const anchor = viewBoxToContent(vb, t);
    setTransform(clampTransform({ s, tx: vb.x - anchor.x * s, ty: vb.y - anchor.y * s }));
    commitViewportDebounced();
  };

  const wheelTimer = useRef<number | undefined>(undefined);
  const commitViewportDebounced = () => {
    window.clearTimeout(wheelTimer.current);
    wheelTimer.current = window.setTimeout(commitViewport, 250);
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    const t = transformRef.current;
    const s = Math.min(MAX_SCALE, t.s * 1.6);
    const vb = clientToViewBox(e.clientX, e.clientY);
    const anchor = viewBoxToContent(vb, t);
    setTransform(clampTransform({ s, tx: vb.x - anchor.x * s, ty: vb.y - anchor.y * s }));
    commitViewportDebounced();
  };

  const { s, tx, ty } = transform;

  return (
    <svg
      ref={svgRef}
      className="schematic-map"
      viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa esquemático de Manhattan"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
      onDoubleClick={onDoubleClick}
    >
      <g transform={`translate(${tx},${ty}) scale(${s})`}>
        {/* Isla */}
        <path
          d={polygonToPath(ISLAND_OUTLINE)}
          fill="#141A22"
          stroke="#1f2833"
          strokeWidth={2}
        />
        {/* Etiquetas de los ríos */}
        <text className="grid-label" x={20} y={450} fontSize={11} transform="rotate(-90 20 450)" textAnchor="middle" opacity={0.6}>
          Hudson River
        </text>
        <text className="grid-label" x={385} y={450} fontSize={11} transform="rotate(90 385 450)" textAnchor="middle" opacity={0.6}>
          East River
        </text>

        <NeighborhoodsSvg />
        <GridSvg />
        <PinsSvg scale={s} />
      </g>
    </svg>
  );
}
