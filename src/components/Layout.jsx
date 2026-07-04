import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Mail, MessageCircle, Phone } from 'lucide-react';
import { CONFIG } from '../config';
import { assetUrl } from '../utils/assetUrl';

function NavLink({ to, href, children, className, onClick }) {
  if (href) {
    return (
      <Link to={{ pathname: '/', hash: href }} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function FooterParticles() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        color: ["#c9a84c", "#e8d5a3", "#6dac6d", "#a8c8a8", "#f0e8c8"][Math.floor(Math.random() * 5)],
        dur: `${6 + Math.random() * 6}s`,
        delay: `${Math.random() * 6}s`,
        tx: (Math.random() - 0.5) * 80,
        ty: (Math.random() - 0.5) * 80,
      })));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {items.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: p.left, top: p.top,
          width: p.size, height: p.size,
          background: p.color, borderRadius: "50%",
          boxShadow: `0 0 ${p.size * 2}px ${p.color}aa`,
          animation: `footerParticleDrift ${p.dur} ${p.delay} ease-in-out infinite`,
          opacity: 0,
          ["--tx"]: `${p.tx}px`, ["--ty"]: `${p.ty}px`,
        }} />
      ))}
      <style>{`
        @keyframes footerParticleDrift {
          0%   { opacity: 0; transform: translate(0,0) scale(1); }
          20%  { opacity: 0.8; }
          80%  { opacity: 0.4; }
          100% { opacity: 0; transform: translate(var(--tx),var(--ty)) scale(0.3); }
        }
      `}</style>
    </div>
  );
}

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAppRoute = location.pathname === '/tools/resto';
  const isToolPage = location.pathname.startsWith('/tools');
  const whatsappMessage = encodeURIComponent('Hi, I want to know more about Swag Solutions.');

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    const sectionId = location.hash.slice(1);
    const timer = setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-500/30 selection:text-blue-900 flex flex-col">
      {!isAppRoute && <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 text-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link to="/" className="text-lg sm:text-2xl font-extrabold tracking-tight flex items-center gap-2.5">
                <img src={assetUrl('logo.png')} alt="Swag Solutions Logo" className="w-8 h-8 drop-shadow-sm hover:scale-105 transition-transform" />
                <span>SWAG <span className="text-blue-600 font-medium">SOLUTIONS</span></span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <NavLink href="#home" isHome={isHome} className="hover:text-blue-600 transition-colors">Home</NavLink>
              <NavLink href="#about" isHome={isHome} className="hover:text-blue-600 transition-colors">About</NavLink>
              <NavLink to="/gpos" className="hover:text-emerald-600 transition-colors">GPoS</NavLink>
              <NavLink href="#wedding" isHome={isHome} className="hover:text-rose-500 transition-colors flex items-center gap-1">
                <Heart size={14} className="text-rose-500 animate-heart-pulse" /> Wedding Cards
              </NavLink>
              <NavLink href="#tools" isHome={isHome} className="hover:text-blue-600 transition-colors">Free Tools</NavLink>
              <NavLink href="#contact" isHome={isHome} className="hover:text-blue-600 transition-colors">Contact</NavLink>
              <NavLink href="#contact" isHome={isHome} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-md transition-all">Let's Talk</NavLink>
            </div>
            <button className="md:hidden text-slate-600 hover:text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 shadow-lg absolute w-full">
            <div className="flex flex-col gap-4 text-center font-medium">
              <NavLink href="#home" isHome={isHome} className="text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Home</NavLink>
              <NavLink href="#about" isHome={isHome} className="text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>About</NavLink>
              <NavLink to="/gpos" className="text-emerald-600" onClick={() => setIsMenuOpen(false)}>GPoS</NavLink>
              <NavLink href="#wedding" isHome={isHome} className="text-rose-500 flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}><Heart size={16} className="animate-heart-pulse" /> Wedding Cards</NavLink>
              <NavLink href="#tools" isHome={isHome} className="text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Free Tools</NavLink>
              <NavLink href="#contact" isHome={isHome} className="text-slate-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
            </div>
          </div>
        )}
      </nav>}

      <main className={`flex-1 ${isAppRoute ? '' : 'pt-20'}`}>
        <Outlet />
      </main>

      {!isAppRoute && (
        isToolPage ? (
          /* ── Free Tools Footer (Utility-oriented & Dark Theme) ── */
          <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6 text-slate-300 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
                  <span className="text-blue-500">⚙️</span> SWAG <span className="text-blue-400 font-medium">Free Utilities</span>
                </h3>
                <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
                  Secure, private, and client-side calculators & tools for daily use. No tracking, no data storage. Everything runs inside your browser.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold">
                <Link to="/" className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg transition-colors">
                  Home Page
                </Link>
                <Link to="/gpos" className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-emerald-400 text-emerald-500 rounded-lg transition-colors">
                  GPoS System
                </Link>
                <Link to="/wedding/classic" className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-rose-400 text-rose-500 rounded-lg transition-colors">
                  Wedding Cards
                </Link>
                <a href={`https://wa.me/${CONFIG.contact.whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-md shadow-blue-500/10">
                  Let's Talk
                </a>
              </div>
            </div>
            
            <div className="text-center md:text-left text-[11px] text-slate-600 tracking-wider border-t border-slate-900/60 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                &copy; {new Date().getFullYear()} Swag Solutions. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <a href={`mailto:${CONFIG.contact.email}`} className="hover:text-slate-400 transition-colors">
                  {CONFIG.contact.email}
                </a>
                <span>•</span>
                <a href={`tel:${CONFIG.contact.phoneDial}`} className="hover:text-slate-400 transition-colors">
                  {CONFIG.contact.phoneDisplay}
                </a>
              </div>
            </div>
          </footer>
        ) : (
          /* ── Elegant Style Footer (Core Website & Wedding Sample Pages) ── */
          <footer className="bg-slate-950 border-t border-slate-900 py-10 px-6 text-white mt-auto relative overflow-hidden">
            <FooterParticles />
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                {/* Left Side: Brand and Subtitle */}
                <div className="text-center md:text-left">
                  <h2 className="text-base sm:text-lg font-extrabold tracking-wide uppercase text-white mb-1.5">
                    SWAG <span className="text-[#c9a84c] font-semibold">SOLUTIONS</span>
                  </h2>
                  <p className="font-sans text-xs font-light text-slate-400 tracking-wide">
                    Premium Digital Wedding Cards & Software Solutions
                  </p>
                </div>

                {/* Right Side: Contact Links */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-xs text-slate-300 font-medium tracking-wide">
                  <a href={`mailto:${CONFIG.contact.email}`} className="hover:text-[#c9a84c] transition-colors duration-300 flex items-center gap-2">
                    <Mail size={14} className="text-[#c9a84c]" /> {CONFIG.contact.email}
                  </a>
                  <a href={`tel:${CONFIG.contact.phoneDial}`} className="hover:text-[#c9a84c] transition-colors duration-300 flex items-center gap-2">
                    <Phone size={14} className="text-[#c9a84c]" /> {CONFIG.contact.phoneDisplay}
                  </a>
                  <a href={`https://wa.me/${CONFIG.contact.whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#c9a84c] transition-colors duration-300 flex items-center gap-2">
                    <MessageCircle size={14} className="text-[#c9a84c]" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="text-[11px] text-slate-600 font-light tracking-wide border-t border-slate-900/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span>&copy; {new Date().getFullYear()} Swag Solutions. All rights reserved.</span>
                <span className="text-slate-700 hidden sm:inline">Crafted with care.</span>
              </div>
            </div>
          </footer>
        )
      )}
    </div>
  );
}
