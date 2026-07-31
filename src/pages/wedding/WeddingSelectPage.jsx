import { Link } from "react-router-dom";
import SEO from "../../components/SEO";
import { assetUrl } from "../../utils/assetUrl";
import { cardsPrefix } from "../../utils/site";
import { ArrowRight, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";

const LOGO_IMG = assetUrl("logo.png");
const HOTEL_IMG = assetUrl("wedding/hotel.jpeg");
const RINGS_IMG = assetUrl("wedding/rings.png");

function ClassicPreview() {
  return (
    <div style={{ background: "#fffef7", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 0 4px #f0ead8, 0 1px 0 5px #d4c090, 0 18px 40px rgba(0,0,0,.16)", outline: "1px solid #d4c090" }}>
      <div style={{ background: "linear-gradient(160deg,#2a4a1e 0%,#3d6b2a 55%,#2a4a1e 100%)", padding: "14px 12px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".4rem", letterSpacing: ".42em", textTransform: "uppercase", color: "#e8d5a3" }}>presents a</p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: ".95rem", color: "#e8d5a3", marginTop: 2 }}>Covanro Sigiriya</p>
      </div>
      <div style={{ padding: "18px 14px 14px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".42rem", letterSpacing: ".38em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 8 }}>The Wedding of</p>
        <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "1.2rem", color: "#1a2e1a", lineHeight: 1.3 }}>Sachini<br/>&amp; Tharindu</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px auto 0", maxWidth: 150 }}>
          <span style={{ flex: 1, height: 1, background: "#d4c090" }} />
          <span style={{ color: "#c9a84c", fontSize: 8 }}>✦</span>
          <span style={{ flex: 1, height: 1, background: "#d4c090" }} />
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg,#2a4a1e,#3d6b2a)", padding: "14px 12px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.9rem", fontWeight: 700, color: "#fdf8f0", lineHeight: 1 }}>15</p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: ".85rem", color: "#d4c090", marginTop: 2 }}>November 2026</p>
      </div>
      <div className="wimgwrap" style={{ overflow: "hidden" }}>
        <img src={HOTEL_IMG} alt="Venue" className="wimg" style={{ width: "100%", height: 90, objectFit: "cover", display: "block", filter: "saturate(1.1) brightness(.95)" }} />
      </div>
    </div>
  );
}

function NavyPreview() {
  return (
    <div style={{ background: "#fffef9", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 0 4px #f3e1b9, 0 1px 0 5px #dfb76c, 0 18px 40px rgba(0,0,0,.25)", outline: "1px solid #dfb76c" }}>
      <div style={{ background: "linear-gradient(135deg,#091325 0%,#0e2444 60%,#091325 100%)", padding: "14px 12px", textAlign: "center", borderBottom: "1px solid rgba(223,183,108,.35)" }}>
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".4rem", letterSpacing: ".42em", textTransform: "uppercase", color: "#f3e1b9" }}>the honor of your presence</p>
      </div>
      <div style={{ padding: "18px 14px 14px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".42rem", letterSpacing: ".38em", textTransform: "uppercase", color: "#dfb76c", marginBottom: 8 }}>The Wedding of</p>
        <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "1.2rem", color: "#0f2b48", lineHeight: 1.3 }}>Sachini<br/>&amp; Tharindu</p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px auto 0", maxWidth: 150 }}>
          <span style={{ flex: 1, height: 1, background: "rgba(223,183,108,.4)" }} />
          <span style={{ color: "#dfb76c", fontSize: 8 }}>✦</span>
          <span style={{ flex: 1, height: 1, background: "rgba(223,183,108,.4)" }} />
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg,#0a192f,#152d50)", padding: "14px 12px", textAlign: "center", borderTop: "1px solid rgba(223,183,108,.35)" }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.9rem", fontWeight: 700, color: "#fffef9", lineHeight: 1 }}>15</p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: ".85rem", color: "#dfb76c", marginTop: 2 }}>November 2026</p>
      </div>
      <div className="wimgwrap" style={{ overflow: "hidden" }}>
        <img src={RINGS_IMG} alt="Rings" className="wimg" style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} />
      </div>
    </div>
  );
}

const templates = [
  {
    name: "classic",
    label: "Classic",
    tagline: "Traditional botanical elegance",
    features: ["Warm gold & green theme", "Couple video", "Countdown timer", "Google map"],
    accent: "#2a4a1e",
    accentSoft: "rgba(42,74,30,.12)",
    preview: <ClassicPreview />,
  },
  {
    name: "navy",
    label: "Navy",
    tagline: "Premium royal luxury",
    features: ["Deep navy & gold theme", "Slideshow gallery", "RSVP form", "Music player"],
    accent: "#0e2444",
    accentSoft: "rgba(14,36,68,.12)",
    preview: <NavyPreview />,
  },
];

export default function WeddingSelectPage() {
  return (
    <>
      <SEO
        title="Wedding Invitation Templates"
        description="Choose your wedding invitation template by Swag Solutions — Classic botanical or Premium Navy & Gold. Digital invitations with guest personalization."
        keywords="wedding invitation template, choose wedding card, digital invitation, wedding card sri lanka"
      />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,500&family=Jost:wght@200;300;400;500;600&display=swap" rel="stylesheet"/>

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#faf7f0 0%,#f1ede2 50%,#f6f2e8 100%)", padding: "36px 16px 60px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>

          {/* ══ BRAND BAR → MAIN SITE ══ */}
          <a href="https://swagsolutions.lk" target="_blank" rel="noopener" className="brandbar" style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: "#ffffff", border: "1px solid #e5dfcf", borderRadius: 999,
            padding: "8px 18px 8px 10px", boxShadow: "0 10px 30px rgba(0,0,0,.08)",
            textDecoration: "none", transition: "all .3s ease",
          }}>
            <img src={LOGO_IMG} alt="SWAG Solutions" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: "#1a2e1a", lineHeight: 1.1 }}>SWAG Solutions</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#b98a2f", marginTop: 2 }}>
                main website <ExternalLink size={11} />
              </span>
            </span>
          </a>

          <div className="heroin" style={{ marginTop: 34 }}>
            <p style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'Jost',sans-serif", fontSize: ".62rem", letterSpacing: ".5em", textTransform: "uppercase", color: "#b98a2f", marginBottom: 18 }}>
              <Sparkles size={14} /> Swag Solutions · Wedding
            </p>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,6vw,3.2rem)", fontWeight: 700, color: "#1a2e1a", lineHeight: 1.15 }}>
              Choose Your <em style={{ color: "#b98a2f", fontStyle: "italic" }}>Invitation</em>
            </h1>
            <p style={{ maxWidth: 520, margin: "14px auto 44px", fontSize: 15, color: "#5c5a50", lineHeight: 1.8 }}>
              Two timeless designs — pick the one that speaks to your love story.
            </p>
          </div>

          <div style={{ display: "grid", gap: 28, gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", textAlign: "left" }}>
            {templates.map((t, i) => (
              <Link
                key={t.name}
                to={`${cardsPrefix}/${t.name}`}
                className="wcard"
                style={{
                  ["--accent"]: t.accent, ["--soft"]: t.accentSoft,
                  textDecoration: "none", color: "inherit", display: "block",
                  background: "#ffffff", borderRadius: 14, border: "1px solid #e5dfcf",
                  boxShadow: "0 24px 60px rgba(0,0,0,.12)", overflow: "hidden",
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                <div style={{ padding: "20px 20px 0" }}>{t.preview}</div>
                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>{t.label}</h2>
                    <span style={{ fontFamily: "'Jost',sans-serif", fontSize: ".58rem", letterSpacing: ".3em", textTransform: "uppercase", color: "#b98a2f", textAlign: "right" }}>{t.tagline}</span>
                  </div>
                  <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr", marginTop: 14 }}>
                    {t.features.map((f) => (
                      <div key={f} style={{ display: "flex", gap: 8, fontSize: 12.5, fontWeight: 600, color: "#334155" }}>
                        <CheckCircle2 size={16} color="#16a34a" style={{ marginTop: 1, flexShrink: 0 }} />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="wopen" style={{
                    display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18,
                    background: t.accent, color: "#fff", borderRadius: 8, padding: "10px 18px",
                    fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em",
                    transition: "all .3s ease",
                  }}>
                    Open {t.label}
                    <ArrowRight className="warrow" size={15} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p style={{ marginTop: 44, fontFamily: "'Jost',sans-serif", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#9a947f" }}>
            crafted with <span style={{ color: "#e25555" }}>♥</span> by SWAG Solutions
          </p>
        </div>
      </div>

      <style>{`
        .brandbar:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(0,0,0,.12);
          border-color: #c9b57a;
        }
        .heroin { animation: cardIn .7s ease both; }
        .wcard {
          animation: cardIn .65s ease both;
          transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease, border-color .35s ease;
          will-change: transform;
        }
        .wcard:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 36px 80px rgba(0,0,0,.18), 0 0 0 1px var(--accent), 0 0 44px var(--soft);
          border-color: var(--accent);
        }
        .wcard:active { transform: translateY(-3px) scale(1.005); }
        .wimgwrap { overflow: hidden; }
        .wimg { transition: transform .55s ease; }
        .wcard:hover .wimg { transform: scale(1.08); }
        .wcard:hover .wopen {
          box-shadow: 0 12px 26px rgba(0,0,0,.28);
          gap: 12px;
        }
        .warrow { transition: transform .3s ease; }
        .wcard:hover .warrow { transform: translateX(4px); }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </>
  );
}
