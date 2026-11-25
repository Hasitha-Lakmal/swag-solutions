// Build-time only: used by scripts/prerender.mjs to render each route to HTML.
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import App from './App.jsx'

async function renderOnce(url, onError) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
    { onError, progressiveChunkSize: Number.MAX_SAFE_INTEGER },
  )
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}

// The first pass loads the React.lazy() pages; the second pass renders them
// inline, so the page content is plain HTML instead of a hidden block that
// needs JavaScript to reveal. Pages that need browser APIs (window,
// localStorage) can't render here and fall back to <PageLoader>, which still
// carries the page heading and description.
export async function render(url) {
  await renderOnce(url, () => {})
  const errors = []
  const html = await renderOnce(url, (err) => {
    errors.push(err && err.message ? err.message : String(err))
  })
  return { html, errors }
}
