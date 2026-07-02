// Genera los íconos PWA (PNG) sin dependencias: pin amarillo taxi sobre fondo dark.
// Uso: node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'icons');
mkdirSync(OUT, { recursive: true });

// --- PNG encoder mínimo (RGBA, sin filtros) ---
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePng(width, height, pixelAt) {
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const row = y * (1 + width * 4);
    raw[row] = 0; // filtro none
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelAt(x, y);
      const i = row + 1 + x * 4;
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b; raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- Dibujo: fondo #0D1117, pin #F7C948 con agujero oscuro ---
const BG = [13, 17, 23, 255];
const YELLOW = [247, 201, 72, 255];
function drawIcon(size, { padding = 0.18 } = {}) {
  const s = size;
  const cx = s / 2;
  const headR = s * (0.5 - padding) * 0.72; // radio de la cabeza del pin
  const cy = s * 0.42;
  const holeR = headR * 0.38;
  const tipY = s * (1 - padding) * 0.92; // punta del pin
  // Triángulo de la cola: desde tangentes de la cabeza hasta la punta
  const baseHalf = headR * 0.62;
  const baseY = cy + headR * 0.55;
  return encodePng(s, s, (x, y) => {
    const dx = x - cx;
    const dyHead = y - cy;
    const inHead = dx * dx + dyHead * dyHead <= headR * headR;
    // triángulo (cx-baseHalf,baseY) (cx+baseHalf,baseY) (cx,tipY)
    let inTail = false;
    if (y >= baseY && y <= tipY) {
      const t = (y - baseY) / (tipY - baseY);
      const half = baseHalf * (1 - t);
      inTail = Math.abs(dx) <= half;
    }
    const inHole = dx * dx + dyHead * dyHead <= holeR * holeR;
    if ((inHead || inTail) && !inHole) return YELLOW;
    return BG;
  });
}

writeFileSync(join(OUT, 'icon-192.png'), drawIcon(192));
writeFileSync(join(OUT, 'icon-512.png'), drawIcon(512));
writeFileSync(join(OUT, 'icon-maskable-512.png'), drawIcon(512, { padding: 0.26 }));
writeFileSync(join(OUT, 'apple-touch-icon.png'), drawIcon(180, { padding: 0.14 }));
console.log('Íconos generados en public/icons/');
