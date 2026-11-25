import { useLocation } from 'react-router-dom';
import { getRouteMeta } from '../seo/routeMeta';

// Shown while a lazy page loads. It also carries the page heading and summary,
// so the prerendered HTML of browser-only tools still has real content.
export default function PageLoader() {
  const { pathname } = useLocation();
  const meta = getRouteMeta(pathname);
  return (
    <div className="min-h-[50vh] bg-slate-50 px-6 py-24 text-center text-slate-600">
      {meta && (
        <>
          <h1 className="mx-auto max-w-3xl text-3xl font-black tracking-tight text-slate-950">
            {meta.title.split(' | ')[0]}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7">{meta.description}</p>
        </>
      )}
      <p className="mt-6">Loading...</p>
    </div>
  );
}

