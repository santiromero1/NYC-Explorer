// Descarga y empaqueta los datos geo que usa la app (una sola vez, en build time):
//  - Barrios de Manhattan (NYC Open Data, NTAs 2020)  -> src/data/geo/neighborhoods.json
//  - Líneas de subway (data.ny.gov)                   -> src/data/geo/subway-lines.json
//  - Estaciones de subway (data.ny.gov)               -> src/data/geo/subway-stations.json
// La app NO hace fetch en runtime: funciona sin señal durante el viaje.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/data/geo');
mkdirSync(OUT, { recursive: true });

const NB_URL = 'https://data.cityofnewyork.us/resource/9nt8-h7nd.geojson?$limit=500';
const SUB_LINES_URL = 'https://data.ny.gov/resource/s692-irgq.geojson?$limit=2000';
const SUB_STATIONS_URL = 'https://data.ny.gov/resource/39hk-dx4f.geojson?$limit=2000';

// Metadata de barrios (color/desc/qué ver) — mismo contenido que el prototipo de diseño.
const NB_META = {
  'harlem':            { color:'#FF6B4A', desc:'El norte cultural de Manhattan: música, gospel y arquitectura brownstone.', see:['Apollo Theater','Misa gospel','Malcolm X Blvd'] },
  'east harlem':       { color:'#FF8A5B', desc:'“El Barrio”, corazón de la comunidad latina de la ciudad.', see:['Museo del Barrio','Comida latina'] },
  'morningside heights':{ color:'#F2B134', desc:'Barrio universitario alrededor de Columbia.', see:['Universidad de Columbia','St. John the Divine'] },
  'hamilton heights':  { color:'#E8A13B', desc:'Zona histórica al norte, tranquila y residencial.', see:['City College','Riverside Park'] },
  'upper west side':   { color:'#B6D94C', desc:'Residencial y elegante, entre Central Park y el Hudson.', see:['Museo de Historia Natural','Lincoln Center','Central Park'] },
  'lincoln square':    { color:'#9FCB4A', desc:'Cultura y música cerca de Columbus Circle.', see:['Lincoln Center','Columbus Circle'] },
  'central park':      { color:'#34C759', desc:'El gran pulmón verde en el centro de la isla.', see:['Bethesda Terrace','Bow Bridge','The Mall'] },
  'upper east side':   { color:'#E0A93B', desc:'Museos de primer nivel y avenidas señoriales.', see:['The Met','Museum Mile','Madison Ave'] },
  'lenox hill':        { color:'#E6B84E', desc:'Parte sur del Upper East Side, muy residencial.', see:['Park Ave','Boutiques'] },
  'yorkville':         { color:'#D9A441', desc:'Extremo este del UES, tranquilo y familiar.', see:['Carl Schurz Park','Gracie Mansion'] },
  'carnegie hill':     { color:'#E0B85A', desc:'Elegante y museístico, borde norte del UES.', see:['Guggenheim','Cooper Hewitt'] },
  'midtown':           { color:'#E86FB0', desc:'Los rascacielos y las grandes atracciones turísticas.', see:['Times Square','Empire State','Rockefeller','5th Ave'] },
  "hell's kitchen":    { color:'#EE7AA8', desc:'Midtown West: teatros, bares y gastronomía.', see:['Hudson Yards','Restaurantes','Broadway'] },
  'murray hill':       { color:'#D98CC0', desc:'Residencial y animado al este de Midtown.', see:['Grand Central cerca','Bares'] },
  'gramercy':          { color:'#C77DD6', desc:'Barrio señorial alrededor de su parque privado.', see:['Gramercy Park','Flatiron cerca'] },
  'flatiron district': { color:'#B98CE8', desc:'El edificio Flatiron, tiendas y buena comida.', see:['Flatiron Building','Eataly','Madison Sq Park'] },
  'chelsea':           { color:'#34C7C7', desc:'Galerías de arte, la High Line y Chelsea Market.', see:['High Line','Chelsea Market','Little Island'] },
  'greenwich village': { color:'#46C2A8', desc:'Calles arboladas, jazz y bohemia clásica.', see:['Washington Sq Park','Jazz clubs','NYU'] },
  'west village':      { color:'#4EC0B0', desc:'El rincón más pintoresco, ideal para caminar.', see:["Joe's Pizza",'Bares con jazz','Calles empedradas'] },
  'east village':      { color:'#6EA8FF', desc:'Vida nocturna, bares y contracultura.', see:['St. Marks Pl','Bares','Tompkins Sq'] },
  'noho':              { color:'#7FB0FF', desc:'Pequeño y elegante, entre Village y SoHo.', see:['Boutiques','Cafés'] },
  'soho':              { color:'#A78BFA', desc:'Compras y arquitectura de hierro fundido.', see:['Tiendas','Cast-iron buildings'] },
  'nolita':            { color:'#B49BFA', desc:'“North of Little Italy”, cool y gastronómico.', see:['Boutiques','Cafés','Iglesia St. Patrick Old'] },
  'little italy':      { color:'#C77DFF', desc:'Restaurantes italianos y ambiente de barrio.', see:['Mulberry St','Cannoli'] },
  'chinatown':         { color:'#CE8AF0', desc:'Uno de los Chinatown más grandes del país.', see:['Canal St','Dim sum','Columbus Park'] },
  'lower east side':   { color:'#8E9BFF', desc:'Historia inmigrante, arte y vida nocturna.', see:["Katz's Deli",'Tenement Museum','Bares'] },
  'tribeca':           { color:'#7C83FF', desc:'Lofts, restaurantes y calles empedradas.', see:['Festival de cine','Restaurantes'] },
  'civic center':      { color:'#6E9BEF', desc:'Edificios cívicos y el acceso al Brooklyn Bridge.', see:['City Hall','Brooklyn Bridge','Oculus'] },
  'financial district':{ color:'#5B8DEF', desc:'Wall Street, la Bolsa y el 9/11 Memorial.', see:['Wall St','9/11 Memorial','Charging Bull'] },
  'battery park city': { color:'#5FA0E0', desc:'Zona costera con parques y vistas a la bahía.', see:['Battery Park','Ferry a la Estatua','The Battery'] },
};
const DISPLAY = { 'soho':'SoHo', 'noho':'NoHo', "hell's kitchen":"Hell's Kitchen" };

const MTA_COLORS = {
  '1':'#EE352E','2':'#EE352E','3':'#EE352E','4':'#00933C','5':'#00933C','6':'#00933C','7':'#B933AD',
  'A':'#2850AD','C':'#2850AD','E':'#2850AD','B':'#FF6319','D':'#FF6319','F':'#FF6319','M':'#FF6319',
  'N':'#FCCC0A','Q':'#FCCC0A','R':'#FCCC0A','W':'#FCCC0A','G':'#6CBE45','J':'#996633','Z':'#996633',
  'L':'#A7A9AC','S':'#808183',
};
const lineColor = (name) => MTA_COLORS[(name || '').trim().charAt(0).toUpperCase()] || '#8E8E93';

const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
const r5 = (n) => Math.round(n * 1e5) / 1e5;

// Simplificación Douglas-Peucker sobre [lng,lat]
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const sqTol = tol * tol;
  const sqSegDist = (p, a, b) => {
    let x = a[0], y = a[1], dx = b[0] - x, dy = b[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
    }
    dx = p[0] - x; dy = p[1] - y;
    return dx * dx + dy * dy;
  };
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    let maxD = 0, idx = 0;
    for (let i = first + 1; i < last; i++) {
      const d = sqSegDist(pts[i], pts[first], pts[last]);
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > sqTol) { keep[idx] = true; stack.push([first, idx], [idx, last]); }
  }
  return pts.filter((_, i) => keep[i]);
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json();
}

function polys(geom) {
  if (!geom) return [];
  if (geom.type === 'Polygon') return [geom.coordinates];
  if (geom.type === 'MultiPolygon') return geom.coordinates;
  return [];
}
function lines(geom) {
  if (!geom) return [];
  if (geom.type === 'LineString') return [geom.coordinates];
  if (geom.type === 'MultiLineString') return geom.coordinates;
  return [];
}

// ---- Barrios
const nbRaw = await getJson(NB_URL);
const keys = Object.keys(NB_META).sort((a, b) => b.length - a.length);
const nbFeatures = [];
for (const f of nbRaw.features || []) {
  const p = f.properties || {};
  if ((p.boroname || '').toLowerCase() !== 'manhattan') continue;
  const nta = p.ntaname || 'Barrio';
  const lname = nta.toLowerCase();
  const key = keys.find((k) => lname.includes(k));
  const meta = key ? NB_META[key] : null;
  const coords = polys(f.geometry).map((poly) =>
    poly.map((ring) => simplify(ring, 0.00012).map(([x, y]) => [r5(x), r5(y)])),
  );
  if (!coords.length) continue;
  // centro: promedio del anillo exterior más grande
  let big = coords[0][0];
  for (const poly of coords) if (poly[0].length > big.length) big = poly[0];
  const cx = big.reduce((s, p2) => s + p2[0], 0) / big.length;
  const cy = big.reduce((s, p2) => s + p2[1], 0) / big.length;
  nbFeatures.push({
    type: 'Feature',
    properties: {
      name: meta ? (DISPLAY[key] || titleCase(key)) : nta,
      color: meta ? meta.color : null,
      desc: meta ? meta.desc : null,
      see: meta ? meta.see : null,
      major: !!meta,
      center: [r5(cx), r5(cy)],
    },
    geometry: { type: 'MultiPolygon', coordinates: coords },
  });
}
writeFileSync(join(OUT, 'neighborhoods.json'), JSON.stringify({ type: 'FeatureCollection', features: nbFeatures }));
console.log(`neighborhoods.json: ${nbFeatures.length} features`);

// ---- Líneas de subway
const linesRaw = await getJson(SUB_LINES_URL);
const lineFeatures = [];
for (const f of linesRaw.features || []) {
  const p = f.properties || {};
  const route = String(p.service || p.name || '');
  for (const coords of lines(f.geometry)) {
    const simplified = simplify(coords, 0.0004).map(([x, y]) => [r5(x), r5(y)]);
    if (simplified.length < 2) continue;
    lineFeatures.push({
      type: 'Feature',
      properties: { route, color: lineColor(route) },
      geometry: { type: 'LineString', coordinates: simplified },
    });
  }
}
writeFileSync(join(OUT, 'subway-lines.json'), JSON.stringify({ type: 'FeatureCollection', features: lineFeatures }));
console.log(`subway-lines.json: ${lineFeatures.length} features`);

// ---- Estaciones de subway
const stRaw = await getJson(SUB_STATIONS_URL);
const seen = new Set();
const stFeatures = [];
for (const f of stRaw.features || []) {
  const p = f.properties || {};
  const g = f.geometry;
  let ll = null;
  if (g && g.type === 'Point') ll = [g.coordinates[0], g.coordinates[1]];
  else if (p.gtfs_longitude && p.gtfs_latitude) ll = [parseFloat(p.gtfs_longitude), parseFloat(p.gtfs_latitude)];
  if (!ll || Number.isNaN(ll[0])) continue;
  const k = `${ll[0].toFixed(4)},${ll[1].toFixed(4)}`;
  if (seen.has(k)) continue;
  seen.add(k);
  stFeatures.push({
    type: 'Feature',
    properties: { name: p.stop_name || p.name || 'Estación', lines: p.daytime_routes || p.line || '' },
    geometry: { type: 'Point', coordinates: [r5(ll[0]), r5(ll[1])] },
  });
}
writeFileSync(join(OUT, 'subway-stations.json'), JSON.stringify({ type: 'FeatureCollection', features: stFeatures }));
console.log(`subway-stations.json: ${stFeatures.length} stations`);
