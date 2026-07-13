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
  d1s3: ['Apple Fifth Avenue'],
  d1s4: ['590 Madison Avenue'],
  d1s5: ['Rockefeller Center'],
  d1s6: ['Nintendo New York'],
  d1s7: ['Times Square'],
  d1s8: ['Deutsche Bank Center', 'Time Warner Center'],
  d1f1: ['Magnolia Bakery'],
  d1f2: ['Smith & Wollensky'],
  d1f3: ['Burger Joint (restaurant)', 'Parker New York'],
  d1f4: ['Harry Cipriani', 'Sherry-Netherland'],
  d1f5: ['The Halal Guys'],
  d1f6: ["Gray's Papaya"],
  d2s1: ['Staten Island Ferry'],
  d2s2: ['The Battery (Manhattan)', 'Battery Park'],
  d2s3: ['Charging Bull'],
  d2s4: ['New York Stock Exchange'],
  d2s5: ['Trinity Church (Manhattan)'],
  d2s6: ["St. Paul's Chapel"],
  d2s7: ['New York City Hall'],
  d2s8: ['National September 11 Memorial & Museum'],
  d2s9: ['World Trade Center Transportation Hub', 'World Trade Center station (PATH)'],
  d2s10: ['Brookfield Place (New York City)'],
  d2s11: ['One World Trade Center'],
  d2s12: ['South Street Seaport'],
  d2f1: ['Los Tacos No. 1'],
  d2f2: ['Eataly'],
  d2f3: ['Tribeca'],
  d3s1: ['Gapstow Bridge', 'The Pond (Central Park)'],
  d3s2: ['The Mall and Literary Walk', 'The Mall (Central Park)', 'Central Park'],
  d3s3: ['Bethesda Terrace and Fountain'],
  d3s4: ['Cherry Hill Fountain', 'Cherry Hill (Central Park)'],
  d3s5: ['Bow Bridge (Central Park)', 'Bow Bridge'],
  d3s6: ['Strawberry Fields (memorial)'],
  d3s7: ['The Dakota'],
  d3s8: ['Belvedere Castle'],
  d3s9: ['Turtle Pond', 'Shakespeare Garden (Central Park)'],
  d3s10: ['Loeb Boathouse'],
  d3s11: ['Metropolitan Museum of Art'],
  d3s12: ['Solomon R. Guggenheim Museum'],
  d3s13: ['American Museum of Natural History'],
  d3f1: ['Barney Greengrass'],
  d3f2: ['Pastrami Queen', 'Pastrami on rye'],
  d3f3: ['Le Pain Quotidien'],
  d3f4: ['Tavern on the Green'],
  d4s1: ['Pennsylvania Station (New York City)', 'Moynihan Train Hall'],
  d4s2: ['MetLife Stadium'],
  d4s3: ['Times Square Ball', 'Times Square'],
  d5s1: ['Grand Central Terminal'],
  d5s2: ['Chrysler Building'],
  d5s3: ['New York Public Library Main Branch'],
  d5s4: ['Bryant Park'],
  d5s5: ['Empire State Building'],
  d5s6: ["Macy's Herald Square"],
  d5s7: ['Buffalo Exchange', 'East Village, Manhattan'],
  d5s8: ['One Vanderbilt', 'Summit One Vanderbilt'],
  d5s9: ["St. Patrick's Cathedral (Manhattan)"],
  d5s10: ['Gershwin Theatre', 'Wicked (musical)'],
  d5f1: ["Joe's Pizza (Greenwich Village)", "Joe's Pizza"],
  d6s1: ['Brooklyn Bridge'],
  d6s2: ['Dumbo, Brooklyn'],
  d6s3: ["Jane's Carousel", 'Brooklyn Bridge Park'],
  d6s4: ['Empire Stores', 'Dumbo, Brooklyn'],
  d6s5: ['Brooklyn Bridge Park'],
  d6s6: ['Brooklyn Heights Promenade'],
  d6s7: ['Domino Park'],
  d6f1: ["Grimaldi's Pizzeria"],
  d6f2: ['The River Café (New York City)', 'The River Café (Brooklyn)'],
  d6f3: ['Brooklyn Flea', 'Manhattan Bridge'],
  d6f4: ['Greenpoint, Brooklyn'],
  d7s1: ['Edge (observation deck)', '30 Hudson Yards', 'Hudson Yards, Manhattan'],
  d7s2: ['Vessel (structure)', 'Vessel'],
  d7s3: ['B&H Photo'],
  d7s4: ['High Line'],
  d7s5: ['Meatpacking District, Manhattan'],
  d7s6: ['Little Island at Pier 55', 'Little Island'],
  d7s7: ['Pier 57 (Manhattan)', 'Pier 57'],
  d7s8: ['Starbucks Reserve'],
  d7s9: ['Chelsea Market'],
  d7s10: ['Washington Square Park'],
  d7s11: ['SoHo, Manhattan'],
  d7s12: ['Abyssinian Baptist Church', 'Apollo Theater', 'Harlem'],
  d7s13: ['Marcus Garvey Park'],
  d7s14: ['Birdland (jazz club)', 'Village Vanguard'],
  d7f1: ['Mercado Little Spain', '10 Hudson Yards'],
  d7f2: ['Pastis (restaurant)', 'Gansevoort Street'],
  d7f3: ['Russ & Daughters'],
  d7f4: ['PopUp Bagels', 'Bagel'],
  d8s1: ['New York Earth Room', 'The New York Earth Room', 'SoHo, Manhattan'],
  d8s2: ['NoHo, Manhattan'],
  d8s3: ['Nolita'],
  d8s4: ['Little Italy, Manhattan'],
  d8s5: ['Clics Modernos', 'Cortlandt Alley'],
  d8s6: ['Chinatown, Manhattan'],
  d8s7: ['Columbus Park (Manhattan)'],
  d8s8: ['Museum of Modern Art'],
  d8s9: ['Top of the Rock', '30 Rockefeller Plaza'],
  d8f1: ["Katz's Delicatessen"],
  d8f2: ['Hop Kee', 'Mott Street'],
  d8f3: ["Jack's Wife Freda", 'Lafayette Street'],
  d8f4: ["Eileen's Special Cheesecake", 'Cheesecake'],
  d8f5: ['Hamburger America', 'Hamburger'],
  d8f6: ['Levain Bakery'],
  d8f7: ['Carbone (restaurant)'],
  d8f8: ['Torrisi Italian Specialties', 'Mulberry Street (Manhattan)'],
  d8f9: ['Balthazar (restaurant)'],
  d8f10: ['Estela (restaurant)', 'Houston Street'],
  d8f11: ['Wildair', 'Orchard Street (Manhattan)'],
  d8f12: ['Orchard Street (Manhattan)'],
  d8f13: ['230 Fifth Avenue', 'Flatiron District'],
  d8f14: ['The Ritz-Carlton New York, NoMad', 'NoMad, Manhattan'],
  d8f15: ['Double Chicken Please', 'Allen Street'],
  d8f16: ['Back Room (bar)', 'Lower East Side'],
  d9s1: ['1717 Broadway', 'Broadway (Manhattan)'],
  d9s2: ['John F. Kennedy International Airport'],
  d10s1: ['Woodbury Common', 'Woodbury Common Premium Outlets'],
  d10s2: ['The Hamptons', 'Southampton (village), New York'],
};

const UA = 'NYC-Explorer-personal-trip-app/1.0 (contact: santiago@wakeful.com.ar)';

async function thumbUrl(title) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages&pithumbsize=1000&titles=${encodeURIComponent(title)}`;
  let res = await fetch(api, { headers: { 'User-Agent': UA } });
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 15000));
    res = await fetch(api, { headers: { 'User-Agent': UA } });
  }
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data?.query?.pages || {};
  for (const page of Object.values(pages)) {
    if (page?.thumbnail?.source) return page.thumbnail.source;
  }
  // fallback: el endpoint REST devuelve imagen aun cuando pageimages no (p.ej. imágenes non-free)
  const rest = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replaceAll(' ', '_'))}`, { headers: { 'User-Agent': UA } });
  if (rest.ok) {
    const js = await rest.json();
    return js?.originalimage?.source || js?.thumbnail?.source || null;
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
  await new Promise((r) => setTimeout(r, 1500));
}
console.log(`\nListo: ${ok}/${Object.keys(TITLES).length} fotos. Faltan: ${missing.join(', ') || 'ninguna'}`);
