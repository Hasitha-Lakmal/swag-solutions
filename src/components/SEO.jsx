import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { isCardsSite } from '../utils/site';
import { SITE_NAME, canonicalUrl, getRouteMeta } from '../seo/routeMeta';
import { applyHeadMeta } from '../seo/applyHeadMeta';

/**
 * Applies the title / description / canonical for the current route from
 * src/seo/routeMeta.js. Rendered once in Layout so every page is covered.
 */
export function RouteSEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getRouteMeta(pathname);
    if (!meta) return;
    applyHeadMeta({ ...meta, url: canonicalUrl(pathname) });
  }, [pathname]);

  return null;
}

/**
 * Legacy per-page component. On the main site the route map is the source of
 * truth (so the prerendered HTML and the live page always match); props are
 * only used on cards.swagsolutions.lk, which has no route map.
 */
export default function SEO({ title, description }) {
  useEffect(() => {
    if (!isCardsSite) return;
    applyHeadMeta({
      title: title ? `${title} | ${SITE_NAME}` : undefined,
      description,
      url: window.location.href,
    });
  }, [title, description]);

  return null;
}
