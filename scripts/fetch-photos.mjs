// Descarga una foto real por parada del itinerario (Wikipedia/Wikimedia Commons)
// y la deja optimizada en public/photos/<id>.jpg. Corre una sola vez en dev.
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public/photos');
mkdirSync(OUT, { recursive: true });

// id de parada -> título(s) candidatos de Wikipedia (en orden de preferencia)
const TITLES = {
  d1s1: ['Columbus Circle'],
  d1s2: ['Plaza Hotel'],
  d1s3: ['Rockefeller Center'],
  d1s4: ['Magnolia Bakery'],
  d1s5: ['Times Square'],
  d1s6: ['Deutsche Bank Center', 'Time Warner Center'],
  d2s1: ['Staten Island Ferry'],
  d2s2: ['The Battery (Manhattan)', 'Battery Park'],
  d2s3: ['Charging Bull'],
  d2s4: ['New York Stock Exchange'],
  d2s5: ['National September 11 Memorial & Museum'],
  d2s6: ['World Trade Center Transportation Hub', 'World Trade Center station (PATH)'],
  d2s7: ['One World Trade Center'],
  d2s8: ['South Street Seaport'],
  d3s1: ['Bethesda Terrace and Fountain', 'Central Park'],
  d3s2: ['Bow Bridge (Central Park)', 'Bow Bridge'],
  d3s3: ['Barney Greengrass', 'Upper West Side'],
  d3s4: ['Metropolitan Museum of Art'],
  d3s5: ['Abyssinian Baptist Church', 'Apollo Theater', 'Harlem'],
  d3s6: ['Marcus Garvey Park'],
  d4s1: ['Pennsylvania Station (New York City)', 'Moynihan Train Hall'],
  d4s2: ['MetLife Stadium'],
  d4s3: ['Times Square Ball', 'Times Square'],
  d5s1: ['Grand Central Terminal'],
  d5s2: ['Chrysler Building'],
  d5s3: ['New York Public Library Main Branch', 'Bryant Park'],
  d5s4: ['Empire State Building'],
  d5s5: ['One Vanderbilt', 'Summit One Vanderbilt'],
  d5s6: ["St. Patrick's Cathedral (Manhattan)"],
  d5s7: ['Nintendo New York'],
  d5s8: ['Broadway theatre', 'Theater District, Manhattan'],
  d6s1: ['Brooklyn Bridge'],
  d6s2: ['Dumbo, Brooklyn'],
  d6s3: ['Empire Stores', 'Dumbo, Brooklyn'],
  d6s4: ['Brooklyn Bridge Park'],
  d6s5: ['Domino Park'],
  d6s6: ['Brooklyn Heights Promenade'],
  d7s1: ['Edge (observation deck)', '30 Hudson Yards', 'Hudson Yards, Manhattan'],
  d7s2: ['Vessel (structure)', 'Vessel'],
  d7s3: ['High Line'],
  d7s4: ['Chelsea Market'],
  d7s5: ['Little Island at Pier 55', 'Little Island'],
  d7s6: ['SoHo, Manhattan'],
  d7s7: ['Little Italy, Manhattan', 'Chinatown, Manhattan'],
  d7s8: ["Joe's Pizza (Greenwich Village)", "Joe's Pizza", 'West Village'],
  d7s9: ['Village Vanguard'],
  d8s1: ['Museum of Modern Art'],
  d8s2: ['Top of the Rock', '30 Rockefeller Plaza'],
  d9s1: ['1717 Broadway', 'Broadway (Manhattan)'],
  d9s2: ['John F. Kennedy International Airport'],
};

const UA = 'NYC-Explorer-personal-trip-app/1.0 (contact: santiago@wakeful.com.ar)';

async function thumbUrl(title) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages&pithumbsize=1000&titles=${encodeURIComponent(title)}`;
  const res = await fetch(api, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages || {};
  for (const page of Object.values(pages)) {
    if (page?.thumbnail?.source) return page.thumbnail.source;
  }
  return null;
}

let ok = 0;
const missing = [];
for (const [id, titles] of Object.entries(TITLES)) {
  const dest = join(OUT, `${id}.jpg`);
  if (existsSync(dest)) { ok++; continue; }
  let url = null;
  for (const t of titles) {
    url = await thumbUrl(t);
    if (url) break;
  }
  if (!url) { missing.push(id); console.warn(`SIN FOTO: ${id} (${titles[0]})`); continue; }
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(String(res.status));
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    // normaliza a JPEG máx 720px de ancho, calidad 72
    execSync(`sips -s format jpeg -s formatOptions 72 -Z 720 "${dest}" --out "${dest}" >/dev/null 2>&1`);
    ok++;
    console.log(`ok ${id} <- ${url.slice(0, 90)}`);
  } catch (e) {
    missing.push(id);
    console.warn(`FALLO descarga: ${id} (${e.message})`);
  }
  await new Promise((r) => setTimeout(r, 250));
}
console.log(`\nListo: ${ok}/${Object.keys(TITLES).length} fotos. Faltan: ${missing.join(', ') || 'ninguna'}`);
