/**
 * Prerenders the public routes of the built app to static HTML.
 *
 * FastBoot does not support the Embroider + Vite build pipeline (and is slated for deprecation
 * in favour of Vite SSR), so instead of server-rendering we drive the real built app in headless
 * Chrome and snapshot the resulting DOM. That keeps this step independent of whatever the Ember
 * build pipeline does next.
 *
 * For each route we write dist/<route>/index.html containing:
 *   - the fully rendered <head> (so ember-page-title's per-route <title> is in the HTML)
 *   - the rendered markup inside a #prerender div
 *   - an empty #app-root for the live app to boot into
 *
 * Admin routes are deliberately excluded: they are auth-gated CRUD pages with nothing to index.
 */

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer';

const DIST = resolve(process.cwd(), 'dist');
const PORT = Number(process.env.PRERENDER_PORT ?? 4399);
const SITE_URL = (process.env.SITE_URL ?? 'https://www.thebutchersmarket.com').replace(/\/$/, '');
const NAV_TIMEOUT = Number(process.env.PRERENDER_TIMEOUT ?? 45_000);

/**
 * Public routes worth prerendering. `/cafe` is omitted on purpose — its route immediately
 * transitions to `index`, so it is handled as a real redirect in render.yaml instead.
 */
const ROUTES = ['/', '/deli', '/grab-and-go', '/meat'];

const MIME_TYPES = {
  '.css': 'text/css',
  '.gif': 'image/gif',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.map': 'application/json',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

/**
 * Minimal static file server with SPA fallback, mirroring how Render serves the site.
 */
function startServer() {
  const server = createServer(async (request, response) => {
    const { pathname } = new URL(request.url, `http://localhost:${PORT}`);
    const candidate = join(DIST, decodeURIComponent(pathname));

    const filePath = (await isFile(candidate)) ? candidate : join(DIST, 'index.html');

    response.writeHead(200, {
      'Content-Type': MIME_TYPES[extname(filePath)] ?? 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  });

  return new Promise((resolvePromise, reject) => {
    server.once('error', reject);
    server.listen(PORT, '127.0.0.1', () => resolvePromise(server));
  });
}

/**
 * Restructures the live DOM into a prerendered document and serializes it.
 *
 * Runs inside the page, so it cannot close over anything from this module.
 */
function snapshot() {
  const appRoot = document.getElementById('app-root');

  if (!appRoot) {
    throw new Error('#app-root is missing — did index.html change?');
  }

  const prerender = document.createElement('div');
  prerender.id = 'prerender';
  prerender.innerHTML = appRoot.innerHTML;

  appRoot.innerHTML = '';
  appRoot.before(prerender);
  document.documentElement.classList.add('has-prerender');

  return `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
}

async function prerenderRoute(browser, route) {
  const page = await browser.newPage();
  const failures = [];

  page.on('pageerror', (error) => failures.push(error.message));

  try {
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`http://127.0.0.1:${PORT}${route}`, {
      timeout: NAV_TIMEOUT,
      waitUntil: 'networkidle0',
    });

    // Set by app/instance-initializers/prerender.js once the first route has rendered.
    await page.waitForFunction('window.__PRERENDER_READY__ === true', { timeout: NAV_TIMEOUT });

    if (failures.length > 0) {
      throw new Error(`page errors:\n  ${failures.join('\n  ')}`);
    }

    const html = await page.evaluate(snapshot);
    const outputDir = route === '/' ? DIST : join(DIST, route);

    await mkdir(outputDir, { recursive: true });
    await writeFile(join(outputDir, 'index.html'), html, 'utf8');

    console.log(`  ✓ ${route} → ${join(outputDir, 'index.html').replace(`${DIST}/`, 'dist/')}`);
  } finally {
    await page.close();
  }
}

async function writeSitemap() {
  const urls = ROUTES.map(
    (route) => `  <url>\n    <loc>${SITE_URL}${route === '/' ? '/' : route}</loc>\n  </url>`,
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  await writeFile(join(DIST, 'sitemap.xml'), xml, 'utf8');
  console.log('  ✓ dist/sitemap.xml');
}

async function main() {
  if (!(await isFile(join(DIST, 'index.html')))) {
    throw new Error('dist/index.html not found — run the build before prerendering.');
  }

  const server = await startServer();
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    headless: true,
  });

  console.log(`Prerendering ${ROUTES.length} routes...`);

  try {
    // Sequential on purpose: these builds are small and a shared API backend is easier on
    // rate limits this way, at the cost of a few seconds.
    for (const route of ROUTES) {
      await prerenderRoute(browser, route);
    }

    await writeSitemap();
  } finally {
    await browser.close();
    server.close();
  }

  console.log('Prerender complete.');
}

main().catch((error) => {
  console.error(`\nPrerender failed: ${error.message}`);
  process.exitCode = 1;
});
