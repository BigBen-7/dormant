// Generates solid-color PNG icons for the extension using only Node built-ins.
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

function makePNG(size, r, g, b) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)
  ihdrData.writeUInt32BE(size, 4)
  ihdrData.writeUInt8(8, 8)  // 8 bits per channel
  ihdrData.writeUInt8(2, 9)  // RGB color type

  const row = Buffer.alloc(1 + size * 3) // filter byte + RGB pixels per row
  for (let x = 0; x < size; x++) {
    row[1 + x * 3] = r
    row[2 + x * 3] = g
    row[3 + x * 3] = b
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => row))
  const compressed = zlib.deflateSync(raw)

  return Buffer.concat([
    sig,
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ])
}

const iconsDir = path.join(__dirname, '../icons')
fs.mkdirSync(iconsDir, { recursive: true })

// Dormant accent: #6c63ff
const [r, g, b] = [0x6c, 0x63, 0xff]

for (const size of [16, 48, 128]) {
  const out = path.join(iconsDir, `icon${size}.png`)
  fs.writeFileSync(out, makePNG(size, r, g, b))
  console.log(`created ${out}`)
}
