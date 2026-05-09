// Generates crescent moon + "z" PNG icons using only Node built-ins (SSAA anti-aliasing).
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBytes = Buffer.from(type, 'ascii')
  const crcBytes = Buffer.alloc(4)
  crcBytes.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])))
  return Buffer.concat([len, typeBytes, data, crcBytes])
}

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(px - ax, py - ay)
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}

// Returns true if (x, y) is inside the "z" glyph defined over a [0, S) grid.
function inZ(x, y, S) {
  const x0 = S * 0.60, x1 = S * 0.88
  const y0 = S * 0.08, y1 = S * 0.37
  const th = S * 0.09
  if (x < x0 || x > x1 || y < y0 || y > y1) return false
  if (y <= y0 + th) return true                                           // top bar
  if (y >= y1 - th) return true                                           // bottom bar
  return distToSegment(x, y, x1, y0 + th * 0.5, x0, y1 - th * 0.5) <= th * 0.55  // diagonal
}

function makeCrescentPNG(size) {
  const SSAA = 4
  const S = size * SSAA

  const bg = [0x0a, 0x0a, 0x0a]
  const fg = [0x7c, 0x6a, 0xf7]

  // Outer circle = full moon body
  const ocx = S * 0.42, ocy = S * 0.54, oR = S * 0.40
  // Inner circle = bite taken out of the right side
  const icx = S * 0.61, icy = S * 0.48, iR = S * 0.33

  const rowBytes = 1 + size * 3   // filter byte + RGB per row
  const raw = Buffer.alloc(size * rowBytes)

  for (let py = 0; py < size; py++) {
    raw[py * rowBytes] = 0  // PNG filter byte (None)
    for (let px = 0; px < size; px++) {
      let filled = 0
      for (let sy = 0; sy < SSAA; sy++) {
        for (let sx = 0; sx < SSAA; sx++) {
          const x = px * SSAA + sx + 0.5
          const y = py * SSAA + sy + 0.5
          const inOuter = (x - ocx) ** 2 + (y - ocy) ** 2 <= oR * oR
          const inBite  = (x - icx) ** 2 + (y - icy) ** 2 <= iR * iR
          if ((inOuter && !inBite) || inZ(x, y, S)) filled++
        }
      }
      const alpha = filled / (SSAA * SSAA)
      const off = py * rowBytes + 1 + px * 3
      raw[off]     = Math.round(bg[0] * (1 - alpha) + fg[0] * alpha)
      raw[off + 1] = Math.round(bg[1] * (1 - alpha) + fg[1] * alpha)
      raw[off + 2] = Math.round(bg[2] * (1 - alpha) + fg[2] * alpha)
    }
  }

  const compressed = zlib.deflateSync(raw)

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr.writeUInt8(8, 8)  // 8 bits per channel
  ihdr.writeUInt8(2, 9)  // RGB color type

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ])
}

const iconsDir = path.join(__dirname, '../icons')
fs.mkdirSync(iconsDir, { recursive: true })

for (const size of [16, 48, 128]) {
  const out = path.join(iconsDir, `icon${size}.png`)
  fs.writeFileSync(out, makeCrescentPNG(size))
  console.log(`created ${out}`)
}
