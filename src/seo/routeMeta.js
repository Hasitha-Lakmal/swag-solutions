// Single source of truth for per-page SEO.
// Used at runtime (RouteSEO in Layout) and at build time (scripts/prerender.mjs).
// Paths have no trailing slash here; canonical URLs add one (GitHub Pages serves /path/index.html).

export const SITE_URL = 'https://swagsolutions.lk';
export const SITE_NAME = 'Swag Solutions';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export const routeMeta = {
  '/': {
    title: 'Swag Solutions | Websites, GPoS POS & Custom Software in Sri Lanka',
    description:
      'Swag Solutions builds websites, custom business software, the GPoS web-based POS system, Zenta accounts software, digital wedding invitations and free business tools for Sri Lankan shops and SMEs.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  '/gpos': {
    title: 'GPoS – Web-Based POS & Inventory System for Sri Lankan Shops | Swag Solutions',
    description:
      'GPoS is a complete web-based POS, inventory and business reporting system for Sri Lankan retail shops, groceries, pharmacies and hardware stores. Billing, GRN, stock, credit sales and profit reports.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  '/zenta': {
    title: 'Zenta Accounts – Accounting & Payroll Software for Sri Lankan Shops | Swag Solutions',
    description:
      'Zenta Accounts: cash, bank, cheques, suppliers, customers, invoices, true profit, HR and payroll with EPF/ETF, loans and fixed assets in one Windows app. 14-day free trial.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  '/wedding': {
    title: 'Digital Wedding Invitation Websites Sri Lanka | Swag Solutions',
    description:
      'Custom digital wedding invitation webpages for Sri Lankan couples. Choose a Classic botanical or Navy & Gold template with countdown, venue map, RSVP and one shareable link.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  '/wedding/classic': {
    title: 'Classic Wedding Invitation Webpage Template | Swag Solutions',
    description:
      'Preview the Classic botanical digital wedding invitation by Swag Solutions: guest personalization, venue map, countdown and RSVP in one shareable link.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/wedding/navy': {
    title: 'Navy & Gold Luxury Wedding Invitation Template | Swag Solutions',
    description:
      'Preview the Navy & Gold luxury digital wedding invitation: slideshow, love story timeline, RSVP form, registry details and background music.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/tools/excel-pos': {
    title: 'Free Excel POS System & Stock Manager Online | Swag Solutions',
    description:
      'Free browser-based POS for small shops: billing, receipt printing, GRN and FIFO stock management with Excel import and export. No signup needed.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/tools/leasing-calculator': {
    title: 'Leasing Calculator Sri Lanka – Monthly Installment Calculator | Swag Solutions',
    description:
      'Free vehicle and housing leasing calculator for Sri Lanka. Work out monthly installments, interest and the full repayment schedule in seconds.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/tools/cheque-writer': {
    title: 'Cheque Writer – Print Bank Cheques Online Free | Swag Solutions',
    description:
      'Free online cheque writer for Sri Lankan banks. Fill in payee, date and amount in words and print neatly aligned cheques from your browser.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/tools/numbers-to-words': {
    title: 'Numbers to Words Converter – Amount in Words for Cheques | Swag Solutions',
    description:
      'Convert numbers and rupee amounts into words for cheques, invoices and financial documents. Free and runs in your browser.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/tools/lost-and-found': {
    title: 'Hotel Lost & Found Register – Free Online Tool | Swag Solutions',
    description:
      'Track hotel and guest lost-and-found items with a simple browser register and Excel import/export. Free tool for hotels and guest houses.',
    priority: '0.6',
    changefreq: 'monthly',
  },
  '/tools/resto': {
    title: 'Resto – Free Restaurant POS & Billing System | Swag Solutions',
    description:
      'Free restaurant POS in your browser: table billing, menu management, sales reports and Excel import/export for small restaurants and cafés.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/tools/qr-generator': {
    title: 'Free QR Code Generator – Links, Text & Contacts | Swag Solutions',
    description:
      'Create clean QR codes for website links, text and contact details and download them instantly. Free, no signup, runs in your browser.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/tools/image-compressor': {
    title: 'Free Image Compressor – Reduce JPG & PNG Size Online | Swag Solutions',
    description:
      'Compress JPG and PNG images in your browser while keeping visible quality. Files never leave your device.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/tools/pdf-tools': {
    title: 'Free PDF Tools – Merge, Split, Watermark & Compress PDF | Swag Solutions',
    description:
      'Merge, split, watermark and compress PDF files securely in your browser. Swag Solutions PDF tools run 100% on your device.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/tools/timeline-visualizer': {
    title: 'Google Timeline Visualizer – Turn Your Location History into a Route Video | Swag Solutions',
    description:
      'Upload your Google Maps Timeline export and turn your trips into an animated route map and video. Processed locally on your device, no account needed.',
    priority: '0.6',
    changefreq: 'monthly',
  },
};

export function normalizePath(pathname = '/') {
  const p = pathname.replace(/\/+$/, '');
  return p === '' ? '/' : p;
}

export function canonicalUrl(pathname) {
  const p = normalizePath(pathname);
  return p === '/' ? `${SITE_URL}/` : `${SITE_URL}${p}/`;
}

export function getRouteMeta(pathname) {
  return routeMeta[normalizePath(pathname)] || null;
}
