import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLoader from './components/PageLoader';
import { isCardsSite } from './utils/site';
import Layout from './components/Layout';
import Home from './pages/Home';

const Gpos = React.lazy(() => import('./pages/Gpos'));
const Zenta = React.lazy(() => import('./pages/Zenta'));
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

// The router is provided by the caller: BrowserRouter / HashRouter in main.jsx,
// StaticRouter in entry-server.jsx (build-time prerender).
export default function App() {
  if (isCardsSite) {
    return (
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<WeddingSelectPage />} />
          <Route path="/classic" element={<ClassicWeddingPage />} />
          <Route path="/navy" element={<LuxuryWeddingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="gpos" element={<Gpos />} />
          <Route path="zenta" element={<Zenta />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
