import React from 'react';
import { CONFIG } from '../config';
import SEO from '../components/SEO';
import SchemaMarkup from '../components/SchemaMarkup';
import { assetUrl } from '../utils/assetUrl';
import {
  BarChart3,
  Banknote,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  Download,
  FileText,
  HardDriveDownload,
  KeyRound,
  Landmark,
  Mail,
  MessageCircle,
  MonitorSmartphone,
  ShieldCheck,
  Users,
  WalletCards,
} from 'lucide-react';

// keep in step with the latest release on github.com/Hasitha-Lakmal/zenta-releases
const ZENTA_VERSION = '1.0.2';
const DOWNLOAD_URL = `https://github.com/Hasitha-Lakmal/zenta-releases/releases/download/v${ZENTA_VERSION}/Zenta_${ZENTA_VERSION}_x64-setup.exe`;

const contactMessage = encodeURIComponent('Hi, I want to know more about Zenta accounts system.');
const whatsappLink = `https://wa.me/${CONFIG.contact.whatsappNumber}?text=${contactMessage}`;

const features = [
  {
    icon: <WalletCards size={24} />,
    title: 'Daily cash and bank',
    desc: 'Income, expenses and transfers for every outlet, cash count and day close, so the cash in the drawer always matches the books.',
  },
  {
    icon: <Banknote size={24} />,
    title: 'Cheques under control',
    desc: 'Issued and received cheques, realise and bounce, undated cheques, search and filters, and bank reconciliation.',
  },
  {
    icon: <Users size={24} />,
    title: 'Suppliers and customers',
    desc: 'Bill-wise payments and receipts, payment vouchers, advances, returns with debit and credit notes, statements and aging.',
  },
  {
    icon: <FileText size={24} />,
    title: 'Invoices and quotations',
    desc: 'Professional invoices, quotations and orders with your logo, outlet address and bank details.',
  },
  {
    icon: <BarChart3 size={24} />,
    title: 'True profit and reports',
    desc: 'Profit and loss with stock value, balance sheet, cash flow and daily summary. See the real gross profit, not just sales.',
  },
  {
    icon: <Landmark size={24} />,
    title: 'Loans and fixed assets',
    desc: 'Loan and leasing installments split into capital and interest, fixed assets with depreciation, and year-end closing.',
  },
  {
    icon: <MonitorSmartphone size={24} />,
    title: 'Several PCs and outlets',
    desc: 'One PC keeps the data and the other PCs connect to it, in the same shop or at a far outlet over the internet.',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Users and audit log',
    desc: 'Admin, manager, cashier or custom users with their own add, edit and delete rights. Every change is recorded.',
  },
  {
    icon: <HardDriveDownload size={24} />,
    title: 'Automatic backups',
    desc: 'Backups every few hours to any folder, including Google Drive or OneDrive, with one-click restore.',
  },
];

const suitable = ['Agro and hardware shops', 'Wholesale and distributors', 'Grocery and retail', 'Pharmacies', 'Service businesses', 'Businesses with several outlets'];

const steps = [
  'Download and install Zenta on the main PC',
  'Use it free for 14 days with every feature',
  'Send us the Machine ID shown in Settings',
  'Enter the activation key we send you',
  'Updates arrive inside the app automatically',
];

const zentaSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Zenta Accounts',
  operatingSystem: 'Windows 10, Windows 11',
  applicationCategory: 'BusinessApplication',
  softwareVersion: ZENTA_VERSION,
  downloadUrl: DOWNLOAD_URL,
  description:
    'Zenta is a complete account-control system for shops in Sri Lanka: cash and bank, cheques, suppliers and customers, invoices, profit and loss, loans, fixed assets and several outlets.',
  publisher: { '@type': 'Organization', name: 'Swag Solutions' },
};

export default function Zenta() {
  return (
    <div className="bg-white text-slate-950">
      <SEO
        title="Zenta Accounts – Account Control System for Shops"
        description="Zenta by Swag Solutions: cash, bank, cheques, suppliers, customers, invoices, true profit, loans, fixed assets and several outlets in one Windows app. 14-day free trial."
        keywords="zenta accounts, accounting software sri lanka, shop accounts system, cheque management software, supplier payment voucher, small business accounting sri lanka"
      />
      <SchemaMarkup schema={zentaSchema} />

      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-blue-400/20 bg-blue-400/10 px-3 py-2 text-sm font-bold uppercase tracking-wider text-blue-300">
              <BookOpenCheck size={16} />
              Zenta accounts system
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Every rupee of your shop, under control.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Zenta keeps cash, bank, cheques, suppliers, customers and profit in one place.
              Built by Swag Solutions with a real shop, for shops that want to know exactly
              where the money is, every day.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={DOWNLOAD_URL}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
              >
                <Download size={18} />
                Download free trial
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
              >
                <MessageCircle size={18} />
                WhatsApp for a key
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Version {ZENTA_VERSION} · Windows 10 / 11 · 14 days free, then lifetime or yearly licence
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/20 via-slate-900 to-emerald-500/10 p-10 shadow-2xl">
              <img src={assetUrl('zenta/zenta-icon.png')} alt="Zenta logo" className="h-40 w-40 md:h-56 md:w-56" />
              <div className="mt-6 text-center">
                <p className="text-3xl font-black tracking-tight">ZENTA</p>
                <p className="text-sm text-slate-400">by SWAG Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Features</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">
              Complete accounts, made simple for shop staff.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
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
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">Suitable for</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Made for real Sri Lankan businesses.</h2>
            <div className="mt-7 flex flex-wrap gap-3">
              {suitable.map((s) => (
                <span key={s} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  <CheckCircle2 size={16} className="text-blue-600" />
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-8 flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600">
              <Building2 size={20} className="mt-0.5 shrink-0 text-blue-600" />
              Your data stays on your own PC. Nothing is uploaded unless you choose a cloud folder for backups.
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">How to start</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Install today, activate when you are ready.</h2>
            <div className="mt-7 grid gap-3">
              {steps.map((step, index) => (
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

      <section className="border-b border-slate-200 px-6 py-16">
        <div className="mx-auto max-w-7xl rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-900">
          <p className="flex items-center gap-2 font-bold">
            <KeyRound size={18} /> Installing on Windows
          </p>
          <p className="mt-2">
            Windows may show “Windows protected your PC” because Zenta is new. Click <b>More info</b> and then <b>Run anyway</b>.
            Zenta installs for the current user and does not need admin rights.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-lg border border-slate-200 bg-slate-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-blue-300">Get Zenta</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Want Zenta for your business?</h2>
            <p className="mt-3 text-slate-300">
              Contact Swag Solutions for pricing, activation keys, setup and training.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400">
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
