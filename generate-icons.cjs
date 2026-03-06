'use strict';
const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

// ── CRC32 ─────────────────────────────────────────────────────────────────
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c;
}
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const d = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const len = Buffer.alloc(4); len.writeUInt32BE(d.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, d])));
  return Buffer.concat([len, t, d, crc]);
}

// ── PNG builder ────────────────────────────────────────────────────────────
function makePNG(size, pixels) {
  const rowLen = 1 + size * 4;
  const raw = Buffer.alloc(size * rowLen);
  for (let y = 0; y < size; y++) {
    raw[y * rowLen] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const s = (y * size + x) * 4;
      const d = y * rowLen + 1 + x * 4;
      raw[d] = pixels[s]; raw[d+1] = pixels[s+1]; raw[d+2] = pixels[s+2]; raw[d+3] = pixels[s+3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit RGBA
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── Icon pixel drawing ─────────────────────────────────────────────────────
function clamp(v) { return Math.max(0, Math.min(255, Math.round(v))); }
function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }
function smoothstep(t) { return t * t * (3 - 2 * t); }

function drawIcon(size) {
  const pixels = new Uint8Array(size * size * 4);
  const cx = size / 2, cy = size / 2, maxR = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const dx = x - cx, dy = y - cy;
      const normDist = Math.sqrt(dx * dx + dy * dy) / maxR;

      // Background gradient: deep purple
      const bgT = (x / size * 0.4 + y / size * 0.6);
      let r = lerp(8, 21, bgT), g = 0, b = lerp(31, 55, bgT);

      // Inner purple glow
      if (normDist < 0.9) {
        const t = smoothstep(1 - normDist / 0.9) * 0.35;
        r = lerp(r, 40, t); g = lerp(g, 0, t); b = lerp(b, 80, t);
      }

      // Three concentric neon-green rings
      for (const [ringR, ringW, ringA] of [[0.78, 0.032, 0.45], [0.57, 0.048, 0.75], [0.33, 0.065, 1.0]]) {
        const d = Math.abs(normDist - ringR);
        if (d < ringW / 2) {
          const a = smoothstep(1 - d / (ringW / 2)) * ringA;
          r = lerp(r, 37, a); g = lerp(g, 211, a); b = lerp(b, 102, a);
        }
        // soft halo
        const halo = d - ringW / 2;
        if (halo > 0 && halo < ringW * 1.6) {
          const a = Math.pow(1 - halo / (ringW * 1.6), 2) * ringA * 0.28;
          r = lerp(r, 37, a); g = lerp(g, 211, a); b = lerp(b, 102, a);
        }
      }

      // Bright center dot
      if (normDist < 0.07) {
        const a = smoothstep(1 - normDist / 0.07);
        r = lerp(r, 37, a); g = lerp(g, 255, a); b = lerp(b, 120, a);
      }

      pixels[i] = clamp(r); pixels[i+1] = clamp(g); pixels[i+2] = clamp(b); pixels[i+3] = 255;
    }
  }
  return pixels;
}

// ── Generate ───────────────────────────────────────────────────────────────
const iconDir = path.join(__dirname, 'public', 'icons');
fs.mkdirSync(iconDir, { recursive: true });

for (const size of [192, 512]) {
  const png = makePNG(size, drawIcon(size));
  const out = path.join(iconDir, `icon-${size}.png`);
  fs.writeFileSync(out, png);
  console.log(`icon-${size}.png  ${(png.length / 1024).toFixed(1)} KB`);
}
