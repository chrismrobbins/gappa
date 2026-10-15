// Dev tool: click through the app in headless Chrome (local mode) and save phone-size screenshots.
// Usage: node scripts/screens.mjs [outDir] [--dark]   (needs Google Chrome installed)

import { spawn } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import puppeteer from 'puppeteer-core'

const OUT = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'screens'
const DARK = process.argv.includes('--dark')
const PORT = 5199
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

/** Vite in local mode: blank Supabase vars override .env so no login is needed. */
function startServer() {
  const env = { ...process.env, VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' }
  return spawn('npx', ['vite', '--port', String(PORT), '--strictPort'], { env, stdio: 'ignore' })
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(`http://localhost:${PORT}`)).ok) return } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error('Dev server did not start')
}

const pause = (ms) => new Promise((r) => setTimeout(r, ms))

async function clickText(page, text) {
  const buttons = await page.$$('button:not([disabled])')
  for (const b of buttons) {
    if ((await b.evaluate((el) => el.textContent?.trim())) === text) { await b.click(); await pause(250); return true }
  }
  return false
}

async function shot(page, name) {
  await pause(350)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log(`${OUT}/${name}.png`)
}

/** Solve a match card by trying each right-hand tile against the first open left-hand tile. */
async function solveMatch(page) {
  for (let guard = 0; guard < 40 && (await page.$('.match')); guard++) {
    const lefts = await page.$$('.match-col:first-child button:not([disabled])')
    if (lefts.length === 0) return
    const before = lefts.length
    for (const right of await page.$$('.match-col:last-child button:not([disabled])')) {
      await lefts[0].click(); await pause(80)
      await right.click(); await pause(450)
      if ((await page.$$('.match-col:first-child button:not([disabled])')).length < before) break
    }
  }
}

/** One generic step through a lesson: continue, check, or make some answer. */
async function step(page) {
  if (await clickText(page, 'Continue')) return
  if (await clickText(page, 'Check')) return
  if (await clickText(page, "Can't speak now")) return
  if (await page.$('.match')) return solveMatch(page)
  const target = (await page.$('.option:not([disabled])')) ?? (await page.$('.tile-bank .tile:not([disabled])'))
  if (target) { await target.click(); await pause(200) }
}

async function playLesson(page, prefix, steps) {
  for (let i = 0; i < steps; i++) {
    await shot(page, `${prefix}-${String(i).padStart(2, '0')}`)
    await step(page)
    if (!(await page.$('.runner'))) break
  }
}

/** Tile phone shots into contact sheets (8 per image) so a whole flow can be reviewed at once. */
async function contactSheets(browser) {
  const files = readdirSync(OUT).filter((f) => /^0[1-6].*\.png$/.test(f) && !f.includes('full')).sort()
  const page = await browser.newPage()
  await page.setViewport({ width: 1600, height: 860 })
  for (let i = 0; i < files.length; i += 8) {
    const imgs = files.slice(i, i + 8).map((f) =>
      `<figure><img src="data:image/png;base64,${readFileSync(resolve(OUT, f)).toString('base64')}"><figcaption>${f}</figcaption></figure>`).join('')
    await page.setContent(`<style>body{margin:0;display:grid;grid-template-columns:repeat(8,1fr);gap:6px;background:#888;font:11px sans-serif}
      figure{margin:0}img{width:100%}</style>${imgs}`, { waitUntil: 'load' })
    await page.screenshot({ path: `${OUT}/sheet-${i / 8 + 1}.png`, fullPage: true })
  }
}

async function main() {
  mkdirSync(OUT, { recursive: true })
  const server = startServer()
  try {
    await waitForServer()
    const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
    const page = await browser.newPage()
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: DARK ? 'dark' : 'light' }])
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' })
    await shot(page, '01-learn')
    await clickText(page, 'Review'); await shot(page, '02-review')
    await clickText(page, 'Me'); await shot(page, '03-me')
    await page.setViewport({ width: 390, height: 2400, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
    await shot(page, '03-me-full')
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    await clickText(page, 'Learn')
    await page.click('.node:not([disabled])'); await shot(page, '04-sheet')
    await clickText(page, 'Start')
    await playLesson(page, '05-lesson', 140)
    await shot(page, '06-after')
    await page.setViewport({ width: 1024, height: 1366, deviceScaleFactor: 1 })
    await shot(page, '07-ipad')
    await contactSheets(browser)
    await browser.close()
  } finally {
    server.kill()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
