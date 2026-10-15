/* Gappa service worker: hand-written, no dependencies. See docs/ARCHITECTURE.md ("Offline"). */
const VERSION = 'v1'
const SHELL_CACHE = `gappa-shell-${VERSION}`
const ASSET_CACHE = `gappa-assets-${VERSION}`
const AUDIO_CACHE = `gappa-audio-${VERSION}`
const FONT_CACHE = `gappa-fonts-${VERSION}`
const ALL_CACHES = [SHELL_CACHE, ASSET_CACHE, AUDIO_CACHE, FONT_CACHE]
const NAV_TIMEOUT_MS = 3000
const DOWNLOAD_BATCH = 6
// Keep in step with VOICES in src/config.ts (the service worker cannot import app code).
const VOICE_INDEXES = ['prajakta', 'vinayak'].map((v) => `/audio/mr/${v}/index.json`)
const PRECACHE = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg', '/icon-180.png', '/icon-512.png']
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com']

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()))
})
self.addEventListener('activate', (event) => {
  event.waitUntil(deleteOldCaches().then(() => self.clients.claim()))
})
self.addEventListener('fetch', (event) => {
  const handler = pickHandler(event.request)
  if (handler) event.respondWith(handler(event.request))
})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'DOWNLOAD_AUDIO') event.waitUntil(downloadClips(event.data.urls, event.source))
})

async function precache() {
  const cache = await caches.open(SHELL_CACHE)
  await cache.addAll(PRECACHE)
  await Promise.all(VOICE_INDEXES.map((url) => cache.add(url).catch(() => undefined)))
}

async function deleteOldCaches() {
  const names = await caches.keys()
  await Promise.all(names.filter((n) => !ALL_CACHES.includes(n)).map((n) => caches.delete(n)))
}

/** The strategy for a request, or null to leave it to the browser (API, writes, other origins). */
function pickHandler(request) {
  if (request.method !== 'GET') return null
  const url = new URL(request.url)
  if (FONT_HOSTS.includes(url.hostname)) return (r) => staleWhileRevalidate(r, FONT_CACHE)
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return null
  if (request.mode === 'navigate') return navigate
  if (url.pathname.startsWith('/assets/')) return (r) => cacheFirst(r, ASSET_CACHE)
  if (url.pathname.endsWith('.mp3')) return audioClip
  return (r) => staleWhileRevalidate(r, SHELL_CACHE)
}

async function put(cacheName, request, response) {
  if (response.ok || response.type === 'opaque') {
    const cache = await caches.open(cacheName)
    await cache.put(request, response.clone())
  }
  return response
}

async function cacheFirst(request, cacheName) {
  const hit = await caches.match(request, { cacheName })
  return hit || put(cacheName, request, await fetch(request))
}

async function staleWhileRevalidate(request, cacheName) {
  const hit = await caches.match(request, { cacheName })
  const network = fetch(request).then((res) => put(cacheName, request, res))
  if (hit) {
    network.catch(() => undefined)
    return hit
  }
  return network
}

/** Resolves to null after `ms`, so a race with it never leaves an unhandled rejection behind. */
function timeoutNull(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(null), ms))
}

/** Network first so a new deploy shows at once (and becomes the offline copy); the cached shell when offline or slow. */
async function navigate(request) {
  const network = fetch(request).catch(() => null)
  const res = await Promise.race([network, timeoutNull(NAV_TIMEOUT_MS)])
  if (res && res.ok) return put(SHELL_CACHE, '/index.html', res)
  const cached = await caches.match('/index.html', { cacheName: SHELL_CACHE })
  return cached || (await network) || Response.error()
}

/** Clips are cached whole; Safari asks for byte ranges, so slice a 206 out of the cached file. */
async function audioClip(request) {
  const url = new URL(request.url).pathname
  const hit = await caches.match(url, { cacheName: AUDIO_CACHE })
  const full = hit || (await put(AUDIO_CACHE, url, await fetch(url)))
  return request.headers.has('range') && full.ok ? sliceRange(full, request.headers.get('range')) : full
}

async function sliceRange(response, header) {
  const buf = await response.clone().arrayBuffer()
  const [start, end] = parseRange(header, buf.byteLength)
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`,
      'Content-Length': String(end - start + 1),
    },
  })
}

function parseRange(header, size) {
  const m = /bytes=(\d*)-(\d*)/.exec(header) || []
  const start = m[1] ? Number(m[1]) : 0
  const end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1
  return [Math.min(start, size - 1), end]
}

async function cacheClip(url) {
  if (await caches.match(url, { cacheName: AUDIO_CACHE })) return
  await put(AUDIO_CACHE, url, await fetch(url))
}

/** Fetches every url into the audio cache, reporting progress to the page that asked. */
async function downloadClips(urls, client) {
  const total = urls.length
  let done = 0
  let failed = 0
  for (let i = 0; i < total; i += DOWNLOAD_BATCH) {
    const results = await Promise.allSettled(urls.slice(i, i + DOWNLOAD_BATCH).map(cacheClip))
    failed += results.filter((r) => r.status === 'rejected').length
    done += results.length
    client.postMessage({ type: 'DOWNLOAD_PROGRESS', done, total, failed })
  }
}
