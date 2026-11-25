// Runs after `vite build`. Renders every route in src/seo/routeMeta.js to a
// static HTML file (dist/<route>/index.html) with its own title, description,
// canonical URL and social tags, then writes sitemap.xml and 404.html.
//
// Why: GitHub Pages only serves real files. Without this, /gpos etc. return
// 404 and search engines see an empty <div id="root">.
import { build } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  routeMeta,
  canonicalUrl,
  SITE_URL,
  DEFAULT_IMAGE,
} from '../src/seo/routeMeta.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrOut = path.join(root, 'node_modules', '.prerender')

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

function headFor(route, meta) {
  const url = canonicalUrl(route)
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${DEFAULT_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${DEFAULT_IMAGE}" />`,
  ].join('\n    ')
}

const HEAD_RE = /<!--app-head:start-->[\s\S]*?<!--app-head:end-->/

async function main() {
  const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')
  if (!HEAD_RE.test(template) || !template.includes('<!--app-html-->')) {
    throw new Error('dist/index.html is missing the app-head / app-html markers')
  }

  // 1. SSR bundle of the app
  await build({
    root,
    logLevel: 'warn',
    build: { ssr: 'src/entry-server.jsx', outDir: ssrOut, emptyOutDir: true },
  })
  const { render } = await import(pathToFileURL(path.join(ssrOut, 'entry-server.js')).href)

  // 2. 404.html = plain app shell (lets unknown links still load the app)
  const shell = template
    .replace(HEAD_RE, `<title>Page not found | Swag Solutions</title>\n    <meta name="robots" content="noindex" />`)
    .replace('<!--app-html-->', '')
  await fs.writeFile(path.join(dist, '404.html'), shell)

  // 3. One HTML file per route
  for (const [route, meta] of Object.entries(routeMeta)) {
    const { html, errors } = await render(route)
    const page = template
      .replace(HEAD_RE, headFor(route, meta))
      .replace('<!--app-html-->', html)
    const file =
      route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html')
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, page)
    const note = errors.length ? ` (browser-only page, heading + summary only)` : ''
    console.log(`  prerendered ${route}${note}`)
  }

  // 4. sitemap.xml from the same route list
  const today = new Date().toISOString().slice(0, 10)
  const urls = Object.entries(routeMeta)
    .map(
      ([route, m]) =>
        `  <url>\n    <loc>${canonicalUrl(route)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${m.changefreq}</changefreq>\n    <priority>${m.priority}</priority>\n  </url>`,
    )
    .join('\n')
  await fs.writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )
  await fs.writeFile(
    path.join(dist, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  )

  await fs.rm(ssrOut, { recursive: true, force: true })
  console.log(`Prerendered ${Object.keys(routeMeta).length} pages + sitemap.xml`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
