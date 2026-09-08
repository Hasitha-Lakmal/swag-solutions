import React, { Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

const Gpos = React.lazy(() => import('./pages/Gpos'));
const ClassicWeddingPage = React.lazy(() => import('./pages/wedding/ClassicWeddingPage'));
const LuxuryWeddingPage = React.lazy(() => import('./pages/wedding/LuxuryWeddingPage'));
const WeddingSelectPage = React.lazy(() => import('./pages/wedding/WeddingSelectPage'));
const ExcelPosSystem = React.lazy(() => import('./pages/tools/ExcelPosSystem'));
const LeasingCalculator = React.lazy(() => import('./pages/tools/LeasingCalculator'));
const ChequeWriter = React.lazy(() => import('./pages/tools/ChequeWriter'));
const NumbersToWords = React.lazy(() => import('./pages/tools/NumbersToWords'));
const LostAndFound = React.lazy(() => import('./pages/tools/LostAndFound'));
const RestoSystem = React.lazy(() => import('./pages/tools/RestoSystem'));
const QrCodeGenerator = React.lazy(() => import('./pages/tools/QrCodeGenerator'));
const ImageCompressor = React.lazy(() => import('./pages/tools/ImageCompressor'));
const PdfTools = React.lazy(() => import('./pages/tools/PdfTools'));
const TimelineVisualizer = React.lazy(() => import('./pages/tools/TimelineVisualizer'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] bg-slate-50 px-6 py-24 text-center text-slate-600">
      Loading...
    </div>
  );
}

const isCardsSite =
  typeof window !== 'undefined' && window.location.hostname === 'cards.swagsolutions.lk';

export default function App() {
  if (isCardsSite) {
    return (
      <HashRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<WeddingSelectPage />} />
            <Route path="/classic" element={<ClassicWeddingPage />} />
            <Route path="/navy" element={<LuxuryWeddingPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </HashRouter>
    );
  }

  return (
    <HashRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="gpos" element={<Gpos />} />
          <Route path="wedding" element={<WeddingSelectPage />} />
          <Route path="wedding/classic" element={<ClassicWeddingPage />} />
          <Route path="wedding/navy" element={<LuxuryWeddingPage />} />

          <Route path="tools/excel-pos" element={<ExcelPosSystem />} />
          <Route path="tools/leasing-calculator" element={<LeasingCalculator />} />
          <Route path="tools/cheque-writer" element={<ChequeWriter />} />
          <Route path="tools/numbers-to-words" element={<NumbersToWords />} />
          <Route path="tools/lost-and-found" element={<LostAndFound />} />
          <Route path="tools/resto" element={<RestoSystem />} />
          <Route path="tools/qr-generator" element={<QrCodeGenerator />} />
          <Route path="tools/image-compressor" element={<ImageCompressor />} />
          <Route path="tools/pdf-tools" element={<PdfTools />} />
          <Route path="tools/timeline-visualizer" element={<TimelineVisualizer />} />
        </Route>
      </Routes>
    </Suspense>
    </HashRouter>
  );
}
