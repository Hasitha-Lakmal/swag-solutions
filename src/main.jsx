import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { isCardsSite } from './utils/site'

// Old links used hash routing (swagsolutions.lk/#/gpos, /#/wedding/classic, /#/#contact).
// Turn them into clean URLs so shared links keep working.
if (!isCardsSite && window.location.hash.startsWith('#/')) {
  const target = window.location.hash.slice(1) || '/'
  window.history.replaceState(null, '', target)
}

// createRoot (not hydrateRoot): the prerendered HTML is for search engines and
// first paint; React simply re-renders over it on load.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isCardsSite ? (
      <HashRouter>
        <App />
      </HashRouter>
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </StrictMode>,
)
