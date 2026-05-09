// Exports store-assets HTML files as pixel-perfect PNGs using Puppeteer.
// Usage: node scripts/export-assets.js
const puppeteer = require('puppeteer')
const path = require('path')

const assets = [
  { file: 'screenshot-1280x800.html', out: 'screenshot-1280x800.png', width: 1280, height: 800  },
  { file: 'promo-440x280.html',       out: 'promo-440x280.png',       width: 440,  height: 280  },
  { file: 'promo-1400x560.html',      out: 'promo-1400x560.png',      width: 1400, height: 560  },
]

;(async () => {
  const browser = await puppeteer.launch({ headless: 'new' })

  for (const { file, out, width, height } of assets) {
    const page = await browser.newPage()
    await page.setViewport({ width, height, deviceScaleFactor: 1 })

    const filePath = path.resolve(__dirname, '../store-assets', file)
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0', timeout: 15000 })

    // Extra wait for web fonts and CSS animations to settle
    await new Promise(r => setTimeout(r, 1500))

    const outPath = path.resolve(__dirname, '../store-assets', out)
    await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width, height } })

    console.log(`✓  ${out}  (${width}×${height})`)
    await page.close()
  }

  await browser.close()
  console.log('\nAll assets exported to store-assets/')
})()
