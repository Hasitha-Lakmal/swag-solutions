import React from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../config';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { assetUrl } from '../utils/assetUrl';
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Calculator,
  CheckCircle2,
  Code,
  Download,
  FileText,
  Globe,
  Headset,
  Heart,
  Image as ImageIcon,
  Mail,
  MessageCircle,
  Phone,
  Printer,
  QrCode,
  ReceiptText,
  Search,
  ShieldCheck,
  // Smartphone,
  Sparkles,
  Table,
  Terminal,
  Type,
  Utensils,
} from 'lucide-react';

const coreServices = [
  {
    icon: <Globe size={24} />,
    title: 'Web Solutions',
    desc: 'Fast, responsive websites and web apps built around your workflow.',
  },
  {
    icon: <Code size={24} />,
    title: 'Custom Software',
    desc: 'Business systems, dashboards, and automations that reduce manual work.',
  },
  /*
  {
    icon: <Smartphone size={24} />,
    title: 'Mobile Apps',
    desc: 'Practical Android and iOS experiences for teams, clients, and operations.',
  },
  */
  {
    icon: <Headset size={24} />,
    title: 'IT Support',
    desc: 'Reliable setup, maintenance, and support for everyday business tech.',
  },
];

const businessTools = [
  {
    icon: <Table size={22} />,
    title: 'Mini Excel POS Tool',
    desc: 'A free lightweight POS utility. For a full sellable system, see GPoS.',
    link: '/tools/excel-pos',
  },
  {
    icon: <Calculator size={22} />,
    title: 'Leasing Calculator',
    desc: 'Calculate installments, rates, and repayment plans quickly.',
    link: '/tools/leasing-calculator',
  },
  {
    icon: <Printer size={22} />,
    title: 'Cheque Writer',
    desc: 'Format and print clean bank cheques from the browser.',
    link: '/tools/cheque-writer',
  },
  {
    icon: <Type size={22} />,
    title: 'Numbers to Words',
    desc: 'Convert amounts into written words for financial documents.',
    link: '/tools/numbers-to-words',
  },
];

const utilityTools = [
  {
    icon: <Search size={22} />,
    title: 'Lost & Found DB',
    desc: 'Track hotel lost-and-found items with a simple Excel workflow.',
    link: '/tools/lost-and-found',
  },
  {
    icon: <Utensils size={22} />,
    title: 'Resto Restaurant POS',
    desc: 'Restaurant billing, menu management, reports, and Excel import/export.',
    link: '/tools/resto',
  },
  {
    icon: <QrCode size={22} />,
    title: 'QR Code Generator',
    desc: 'Create clean QR codes for links, text, and contact details.',
    link: '/tools/qr-generator',
  },
  {
    icon: <ImageIcon size={22} />,
    title: 'Image Compressor',
    desc: 'Reduce image file sizes while keeping visible quality.',
    link: '/tools/image-compressor',
  },
  {
    icon: <FileText size={22} />,
    title: 'PDF Tools',
    desc: 'Merge, split, and work with PDF files in the browser.',
    link: '/tools/pdf-tools',
  },
];

const weddingSteps = [
  {
    title: 'Share the details',
    desc: 'Couple names, date, venue, photos, RSVP phone number, and any special message.',
  },
  {
    title: 'We build the page',
    desc: 'A custom invitation webpage with countdown, venue map, guest message, and styling.',
  },
  {
    title: 'Send one link',
    desc: 'Share the finished invitation link with family and friends through WhatsApp or SMS.',
  },
];

const weddingHighlights = ['Custom couple page', 'Countdown timer', 'Venue map', 'RSVP contact', 'Guest name option', 'Packages from LKR 2,000'];

const gposFeatures = [
  {
    icon: <ReceiptText size={22} />,
    title: 'Sales and billing',
    desc: 'Fast cashier workflow, receipts, discounts, returns, and daily sales tracking.',
  },
  {
    icon: <Boxes size={22} />,
    title: 'Inventory handling',
    desc: 'Stock control, GRN, item management, low-stock awareness, and product records.',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Accounting reports',
    desc: 'Revenue, profit, credit sales, customer savings, and business performance reports.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Web-based system',
    desc: 'Runs in the browser and can be customized for shops, groceries, pharmacies, and more.',
  },
];

const technologies = ['React', 'Laravel', 'PHP', 'Tailwind CSS', 'MySQL', 'REST APIs', 'AWS'];

const toolUpgradeOptions = [
  {
    title: 'Customize a free tool',
    desc: 'Need one of these tools changed for your business workflow, reports, branding, or Sinhala/English documents? We can turn it into a tailored system.',
  },
  {
    title: 'Move from simple POS to GPoS',
    desc: 'The free POS is useful for trying the workflow. GPoS Pro is the complete version for real shops with setup, support, inventory, and reports.',
  },
  {
    title: 'Build a new business tool',
    desc: 'If your team still uses paper, Excel, or repeated manual work, we can build a clean browser-based tool around that process.',
  },
];

const aboutPoints = [
  'Built around Sri Lankan business workflows',
  'Clear communication through WhatsApp, calls, and email',
  'Simple interfaces that staff can learn quickly',
  'Custom support after launch when the business grows',
];

function ToolCard({ tool }) {
  return (
    <Link
      to={tool.link}
      className="group flex min-h-40 flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-white transition group-hover:bg-blue-600">
        {tool.icon}
      </div>
      <h4 className="text-base font-bold text-slate-950">{tool.title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-600">{tool.desc}</p>
    </Link>
  );
}

function PreviewCountdown({ bgClass = "bg-slate-950" }) {
  const [t, setT] = React.useState({ d: "00", h: "00", m: "00", s: "00" });

  React.useEffect(() => {
    const pad = (n) => String(n).padStart(2, "0");
    const target = new Date("2026-11-15T09:00:00").getTime();
    const tick = () => {
      const dist = target - Date.now();
      if (dist < 0) return;
      setT({
        d: pad(Math.floor(dist / 86400000)),
        h: pad(Math.floor((dist / 3600000) % 24)),
        m: pad(Math.floor((dist / 60000) % 60)),
        s: pad(Math.floor((dist / 1000) % 60)),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`grid grid-cols-4 gap-1 ${bgClass} px-4 py-4 text-[#fffef7] border-t border-[#d4c090]/15`}>
      {[['d', 'Days'], ['h', 'Hours'], ['m', 'Min'], ['s', 'Sec']].map(([k, label]) => (
        <div key={label}>
          <span className="block font-serif text-xl font-bold text-white leading-none">{t[k]}</span>
          <span className="text-[8px] uppercase tracking-wider text-[#e8d5a3] mt-1 block">{label}</span>
        </div>
      ))}
    </div>
  );
}

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://swagsolutions.lk/#website",
      "url": "https://swagsolutions.lk/",
      "name": "Swag Solutions",
      "description": "Practical websites, custom software, GPoS POS systems, free tools, and custom wedding invitations in Sri Lanka.",
      "potentialAction": [{
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://swagsolutions.lk/?s={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://swagsolutions.lk/#organization",
      "name": "Swag Solutions",
      "image": "https://swagsolutions.lk/logo.png",
      "url": "https://swagsolutions.lk/",
      "telephone": "+94706702048",
      "email": "info@swagsolutions.lk",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "LK",
        "addressLocality": "Colombo"
      },
      "sameAs": [
        "https://wa.me/94706702048"
      ]
    }
  ]
};

export default function Home() {
  const [previewTemplate, setPreviewTemplate] = React.useState('classic');

  const projectMessage = encodeURIComponent('Hi, I want to start a project with Swag Solutions.');
  const weddingMessage = encodeURIComponent('Hi, I want to request a custom wedding invitation webpage.');
  const generalWhatsappMessage = encodeURIComponent('Hi, I want to know more about Swag Solutions.');

  return (
    <div className="bg-white text-slate-950">
      <SEO 
        title="Websites, GPoS POS and Custom Software Sri Lanka" 
        description="Swag Solutions builds premium websites, custom software, GPoS web-based POS systems, digital wedding invitations, and free tools for Sri Lankan businesses." 
        keywords="Swag Solutions, free tools, wedding card sri lanka, pos system sri lanka, gpos, web solution colombo, software development sri lanka"
      />
      <SchemaMarkup schema={homeSchema} />
      <style>{`
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(18px); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        @keyframes heroShine {
          from { background-position: 120% center; }
          to { background-position: -120% center; }
        }

        @keyframes serviceRise {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-title-line {
          animation: heroReveal .8s cubic-bezier(.2,.8,.2,1) both;
        }

        .hero-copy-reveal {
          animation: heroReveal .78s cubic-bezier(.2,.8,.2,1) both;
        }

        .hero-title-swag {
          animation:
            heroReveal .8s cubic-bezier(.2,.8,.2,1) .28s both,
            heroShine 4.5s ease-in-out 1.1s infinite;
          background-image: linear-gradient(90deg, #93c5fd 0%, #67e8f9 32%, #ffffff 50%, #67e8f9 68%, #93c5fd 100%);
          background-size: 220% auto;
        }

        .service-reveal {
          opacity: 0;
          animation: serviceRise .72s cubic-bezier(.2,.8,.2,1) both;
        }

        .service-scroll-reveal {
          animation-timeline: view();
          animation-range: entry 8% cover 32%;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-title-line,
          .hero-copy-reveal,
          .hero-title-swag,
          .service-reveal {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>

      <section id="home" className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-35"
          src={assetUrl('hero-video.mp4')}
          autoPlay
          muted
          loop
          playsInline
          poster={assetUrl('logo.png')}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,.94),rgba(2,6,23,.78),rgba(2,6,23,.38))]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-2xl">
            <div className="hero-copy-reveal mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 backdrop-blur">
              <CheckCircle2 size={16} className="text-emerald-300" />
              Web, software, tools, and digital invitations
            </div>

            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
              <span className="hero-title-line block">Stop overthinking.</span>
              <span className="hero-title-swag block bg-clip-text text-transparent">Just Swag It.</span>
            </h1>

            <p className="hero-copy-reveal mt-6 max-w-xl text-lg leading-8 text-slate-200" style={{ animationDelay: '520ms' }}>
              Swag Solutions builds practical digital products for Sri Lankan businesses:
              websites, custom systems, free tools, and polished event experiences.
            </p>

            <div className="hero-copy-reveal mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '680ms' }}>
              <a
                href={`https://wa.me/${CONFIG.contact.whatsappNumber}?text=${projectMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
              >
                Start a Project
                <ArrowRight size={18} />
              </a>
              <a
                href="#tools"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/15"
              >
                Explore Tools
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {coreServices.map((service, index) => (
              <a
                key={service.title}
                href="#services"
                className="service-reveal rounded-lg border border-white/12 bg-white/10 p-5 text-white backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/15"
                style={{ animationDelay: `${780 + index * 120}ms` }}
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-950">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200">{service.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="border-b border-slate-200 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">What we do</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                Build the useful parts of your digital business.
              </h2>
            </div>
            <p className="text-lg leading-8 text-slate-600">
              We focus on clean implementation, maintainable systems, and interfaces your
              team can actually use every day.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {coreServices.map((service, index) => (
              <div
                key={service.title}
                className="service-reveal service-scroll-reveal rounded-lg border border-slate-200 bg-slate-50 p-6"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-950">{service.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gpos" className="border-b border-slate-200 bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-bold uppercase tracking-wider text-emerald-300">
                <Table size={16} />
                GPoS web-based POS system
              </div>
              <h2 className="text-3xl font-black tracking-tight md:text-5xl">
                A complete POS system for shops that need more than simple billing.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                GPoS is our full business management system built for sales, inventory,
                accounting reports, stock handling, and day-to-day shop operations. It is
                user friendly, easy to learn, and built without unnecessary complexity.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/gpos"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  View GPoS page
                  <ArrowRight size={18} />
                </Link>
                <a
                  href={`https://wa.me/${CONFIG.contact.whatsappNumber}?text=Hi%2C%20I%20want%20to%20know%20more%20about%20GPoS%20POS%20system.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
                >
                  WhatsApp GPoS
                  <MessageCircle size={18} />
                </a>
                <a
                  href={assetUrl('gpos-brochure.pdf')}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
                >
                  Download PDF brochure
                  <Download size={18} />
                </a>
                <a
                  href="#tools"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
                >
                  View free tools
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {gposFeatures.map((feature) => (
                <div key={feature.title} className="rounded-lg border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-white/10 bg-white/5 p-5">
            <p className="text-sm leading-7 text-slate-300">
              Suitable for retail shops, grocery stores, pharmacies, hardware stores,
              mini marts, and small businesses that need a reliable web-based POS system.
              Features and workflow can be customized according to the customer&apos;s business.
            </p>
          </div>
        </div>
      </section>

      <section id="wedding" className="border-b border-slate-200 bg-slate-50 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-rose-600">
              <Heart size={16} className="animate-heart-pulse" />
              Custom wedding webpages
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              Not just a card. A private wedding page with one shareable link.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              When someone requests an invitation, we create a dedicated webpage for that
              couple. They can share the link with guests through WhatsApp, SMS, or social media.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              {weddingHighlights.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  <CheckCircle2 size={15} className="text-rose-500" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 lg:flex-row">
              <Link
                to="/wedding/classic"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 px-5 py-3 text-sm font-bold text-white transition shadow-sm"
              >
                View Classic
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/wedding/navy"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 px-5 py-3 text-sm font-bold text-white transition shadow-md shadow-indigo-500/10"
              >
                View Navy
                <Sparkles size={15} className="text-[#dfb76c]" />
              </Link>
              <a
                href={`https://wa.me/${CONFIG.contact.whatsappNumber}?text=${weddingMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-rose-200"
              >
                Request wedding page
              </a>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[.9fr_1.1fr] md:items-center">
            <div className="space-y-4">
              {weddingSteps.map((step, index) => (
                <div key={step.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-rose-600 text-sm font-black text-white">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {/* Interactive Card Template Selector */}
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewTemplate('classic')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                    previewTemplate === 'classic'
                      ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Classic
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate('luxury')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all flex items-center gap-1.5 ${
                    previewTemplate === 'luxury'
                      ? 'bg-gradient-to-r from-blue-700 to-indigo-700 border-indigo-700 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Navy
                  <Sparkles size={12} className="text-[#dfb76c]" />
                </button>
              </div>

              {previewTemplate === 'classic' ? (
                /* ── Classic Preview ── */
                <div className="rounded-lg border border-[#d4c090]/30 bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 p-5 shadow-2xl relative overflow-hidden flex justify-center items-center">
                  <div className="overflow-hidden rounded-lg bg-[#fffef7] text-center shadow-2xl border border-[#d4c090] outline outline-1 outline-offset-[-4px] outline-[#d4c090] max-w-sm w-full hover:scale-[1.02] transition-transform duration-500 ease-out">
                    {/* Couple Image Preview */}
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={assetUrl('wedding/couple.png')}
                        alt="Couple Preview" 
                        className="w-full h-full object-cover" 
                        style={{ objectPosition: 'center 15%' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#fffef7] via-transparent to-transparent" />
                    </div>

                    <div className="px-6 py-5">
                      <p className="text-[9px] font-bold uppercase tracking-[.4em] text-[#c9a84c]">
                        The wedding of
                      </p>
                      <p className="mt-2 font-serif text-3xl italic text-[#1a2e1a]">Sachini</p>
                      
                      {/* Botanical / Sparkle Divider style */}
                      <div className="flex items-center gap-2 px-6 my-2.5 justify-center">
                        <span className="h-[1px] w-8 bg-[#d4c090]/40" />
                        <span className="text-[#c9a84c] text-[10px]">✦</span>
                        <span className="h-[1px] w-8 bg-[#d4c090]/40" />
                      </div>
                      
                      <p className="font-serif text-3xl italic text-[#1a2e1a]">Tharindu</p>
                    </div>

                    {/* Save the Date block (Emerald Green Theme) */}
                    <div className="bg-[#2a4a1e] px-6 py-5 text-[#fffef7]">
                      <p className="text-[9px] font-bold uppercase tracking-[.4em] text-[#e8d5a3]">Save the date</p>
                      <p className="mt-1 font-serif text-4xl font-bold">15</p>
                      <p className="font-serif text-base italic text-[#e8d5a3] mt-0.5">November, 2026</p>
                    </div>

                    {/* Real-time Ticking Countdown */}
                    <PreviewCountdown bgClass="bg-[#1a2e1a]" />
                  </div>
                </div>
              ) : (
                /* ── Navy Preview ── */
                <div className="rounded-lg border border-indigo-900/30 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-5 shadow-2xl relative overflow-hidden flex justify-center items-center">
                  {/* Floating sparkles background effect */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#dfb76c_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  <div className="overflow-hidden rounded-lg bg-[#fffef9] text-center shadow-2xl border border-[#dfb76c] outline outline-1 outline-offset-[-4px] outline-[#dfb76c] max-w-sm w-full hover:scale-[1.02] transition-transform duration-500 ease-out relative z-10">
                    {/* Rings Image Preview */}
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={assetUrl('wedding/rings.png')}
                        alt="Rings Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#fffef9] via-transparent to-transparent" />
                    </div>

                    <div className="px-6 py-5">
                      <p className="text-[9px] font-bold uppercase tracking-[.4em] text-[#dfb76c]">
                        The wedding of
                      </p>
                      <p className="mt-2 font-serif text-3xl italic text-[#0f2b48]">Sachini</p>
                      
                      {/* Botanical / Sparkle Divider style */}
                      <div className="flex items-center gap-2 px-6 my-2.5 justify-center">
                        <span className="h-[1px] w-8 bg-[#dfb76c]/40" />
                        <span className="text-[#dfb76c] text-[10px]">✦ ✦ ✦</span>
                        <span className="h-[1px] w-8 bg-[#dfb76c]/40" />
                      </div>
                      
                      <p className="font-serif text-3xl italic text-[#0f2b48]">Tharindu</p>
                    </div>

                    {/* Save the Date block (Royal Navy Theme) */}
                    <div className="bg-[#0e2444] px-6 py-5 text-[#fffef9] border-t border-[#dfb76c]/20">
                      <p className="text-[9px] font-bold uppercase tracking-[.4em] text-[#dfb76c]">Save the date</p>
                      <p className="mt-1 font-serif text-4xl font-bold">15</p>
                      <p className="font-serif text-base italic text-[#dfb76c] mt-0.5">November, 2026</p>
                    </div>

                    {/* Real-time Ticking Countdown */}
                    <PreviewCountdown bgClass="bg-[#091325]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="border-b border-slate-200 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Free tools</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                Useful browser tools, ready to use.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Small utilities for business, finance, hospitality, files, and everyday admin work.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-950">
              <Calculator size={22} className="text-blue-600" />
              Business and finance
            </h3>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {businessTools.map((tool) => (
                <ToolCard key={tool.title} tool={tool} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 flex items-center gap-2 text-xl font-bold text-slate-950">
              <Terminal size={22} className="text-blue-600" />
              Utilities
            </h3>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {utilityTools.map((tool) => (
                <ToolCard key={tool.title} tool={tool} />
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-5 rounded-lg border border-slate-200 bg-slate-950 p-6 text-white lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:p-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-300">Need a business version?</p>
              <h3 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
                Free tools are a starting point. We can build the full workflow.
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Try the tools, then contact us when you need branded screens, user accounts,
                reports, backups, or a custom system for your shop, hotel, office, or event.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/${CONFIG.contact.whatsappNumber}?text=${encodeURIComponent('Hi, I tried a free tool and want a customized business version.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400"
                >
                  Customize a tool
                  <MessageCircle size={18} />
                </a>
                <Link
                  to="/gpos"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15"
                >
                  See GPoS Pro
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {toolUpgradeOptions.map((item) => (
                <div key={item.title} className="rounded-lg border border-white/10 bg-white/10 p-5">
                  <h4 className="text-base font-bold">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-300">About Swag Solutions</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              We build practical systems for local businesses that need work to feel simpler.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Swag Solutions focuses on websites, custom software, POS systems, and browser
              tools that fit real day-to-day work. The goal is not to make a system look
              complicated. The goal is to make the business easier to run, easier to explain,
              and easier to grow.
            </p>
            <div className="mt-7 grid gap-3">
              {aboutPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                  <CheckCircle2 size={17} className="shrink-0 text-emerald-300" />
                  {point}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/10 p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-300">Technology we use</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-semibold text-slate-100"
                >
                  <Terminal size={16} className="text-blue-300" />
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
                <p className="text-2xl font-black text-white">Custom</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">Every build can be adjusted to the customer&apos;s workflow.</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-slate-950/60 p-4">
                <p className="text-2xl font-black text-white">Support</p>
                <p className="mt-1 text-sm leading-6 text-slate-300">Setup, training, and improvements can continue after launch.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-white px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-lg border border-slate-200 bg-slate-50 p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Contact</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Ready to build something?</h2>
            <p className="mt-3 text-slate-600">Send the idea. We will help turn it into a clean, usable product.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${CONFIG.contact.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:border-blue-300"
            >
              <Mail size={18} />
              {CONFIG.contact.email}
            </a>
            <a
              href={`tel:${CONFIG.contact.phoneDial}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              <Phone size={18} />
              {CONFIG.contact.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${CONFIG.contact.whatsappNumber}?text=${generalWhatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
