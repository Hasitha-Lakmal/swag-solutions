import React from 'react';
import { CONFIG } from '../config';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  Download,
  Mail,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
  Store,
  Users,
} from 'lucide-react';

const contactMessage = encodeURIComponent('Hi, I want to know more about GPoS web-based POS system.');
const whatsappLink = `https://wa.me/${CONFIG.contact.whatsappNumber}?text=${contactMessage}`;

const features = [
  {
    icon: <ReceiptText size={24} />,
    title: 'Sales and billing',
    desc: 'Fast item search, cart workflow, discounts, payment tracking, returns, and printable receipts.',
  },
  {
    icon: <Boxes size={24} />,
    title: 'Inventory handling',
    desc: 'Item records, stock updates, GRN entries, stock movement, and low-stock aware workflows.',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'Accounting reports',
    desc: 'Daily sales, cash and credit sales, revenue, cost, gross profit, and item performance reports.',
  },
  {
    icon: <Users size={24} />,
    title: 'Customer workflows',
    desc: 'Credit sale handling, customer names, bill references, and business-friendly records.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Simple and user friendly',
    desc: 'Designed to be easy for staff to learn and use without a complicated workflow.',
  },
  {
    icon: <Store size={24} />,
    title: 'Business customization',
    desc: 'Can be adjusted for groceries, pharmacies, hardware shops, mini marts, and retail stores.',
  },
];

const industries = ['Retail shops', 'Grocery stores', 'Pharmacies', 'Hardware stores', 'Mini marts', 'Small businesses'];
const process = ['Discuss business workflow', 'Customize GPoS setup', 'Add products and settings', 'Train the team', 'Go live and support'];

const gposSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "GPoS POS System",
  "operatingSystem": "All (Web-based)",
  "applicationCategory": "BusinessApplication",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "34"
  },
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "LKR"
  },
  "description": "GPoS is a complete web-based POS, inventory, and accounting system for shops, grocery stores, pharmacies, hardware shops, and small businesses in Sri Lanka.",
  "publisher": {
    "@type": "Organization",
    "name": "Swag Solutions"
  }
};

export default function Gpos() {
  return (
    <div className="bg-white text-slate-950">
      <SEO 
        title="GPoS Web-Based POS & Inventory System" 
        description="GPoS by Swag Solutions is a complete web-based POS, inventory management, and business accounting system for Sri Lankan retail shops, groceries, pharmacies, and hardware stores." 
        keywords="gpos pos, web based pos system sri lanka, inventory management software, retail shop billing software, shop billing system, small business pos"
      />
      <SchemaMarkup schema={gposSchema} />
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-bold uppercase tracking-wider text-emerald-300">
              <Store size={16} />
              GPoS web-based POS system
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Complete POS, inventory, and accounting system for growing shops.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              GPoS is a full web-based business system built by Swag Solutions for shops
              that need reliable billing, stock control, reports, and daily operation handling.
              It is user friendly, simple to operate, and built without unnecessary complexity.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                WhatsApp for GPoS
                <MessageCircle size={18} />
              </a>
              <a
                href="/gpos-brochure.pdf"
                download
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
              >
                Download PDF
                <Download size={18} />
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <div className="overflow-hidden rounded-lg bg-slate-900">
              <img
                src="/gpos-dashboard.png"
                alt="GPoS dashboard screenshot"
                className="h-auto min-h-64 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Features</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              Everything needed for daily shop operations, without making it hard to use.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Suitable for</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Built for real local businesses.</h2>
            <div className="mt-7 flex flex-wrap gap-3">
              {industries.map((industry) => (
                <span key={industry} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  {industry}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">How we deliver</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Customized to the customer&apos;s workflow.</h2>
            <div className="mt-7 grid gap-3">
              {process.map((step, index) => (
                <div key={step} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-slate-800">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-lg border border-slate-200 bg-slate-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-300">Get GPoS</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Want to sell this to your business?</h2>
            <p className="mt-3 text-slate-300">
              Contact Swag Solutions for pricing, setup, customization, and demo details.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400">
              <MessageCircle size={18} />
              WhatsApp
            </a>
             <a href={`mailto:${CONFIG.contact.email}`} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/15">
              <Mail size={18} />
              Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
