import { useMemo, useState, useEffect } from "react";
import SEO from "../../components/SEO";
import {
  CalendarDays, CheckCircle2, Copy, Heart,
  MapPin, Phone, Sparkles, Music, Volume2, VolumeX,
  Clock, Gift, Compass
} from "lucide-react";

const COUPLE_IMG = "/wedding/couple.png";
const RINGS_IMG = "/wedding/rings.png";
const RECEPTION_IMG = "/wedding/reception.png";

const defaultDetails = {
  bride:    "Sachini",
  groom:    "Tharindu",
  guest:    "Dear Guest",
  date:     "15",
  month:    "November 2026",
  day:      "Sunday",
  time:     "9:00 AM – 4:00 PM",
  poruwa:   "10:00 AM",
  venue:    "Covanro Sigiriya",
  location: "Sigiriya, Sri Lanka",
  phone:    "076 541 1703",
};

const customOptions = [
  "Multi-image slideshow",
  "Love story timeline",
  "Music player wave preview",
  "Interactive RSVP form",
  "Elegant navy & gold theme",
  "Countdown timer and map",
];

function getParam(params, key) {
  return params.get(key)?.trim() || defaultDetails[key];
}

function pad(n) { return String(n).padStart(2, "0"); }

/* ── Floating Heart/Star Particles ── */
function LuxuryParticles() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${10 + Math.random() * 85}%`,
        size: 3 + Math.random() * 4,
        type: Math.random() > 0.45 ? "✦" : "♥",
        color: ["#dfb76c", "#f3e1b9", "#f43f5e", "#fda4af"][Math.floor(Math.random() * 4)],
        dur: `${6 + Math.random() * 6}s`,
        delay: `${Math.random() * 6}s`,
        tx: (Math.random() - 0.5) * 80,
        ty: (Math.random() - 0.5) * 100,
      })));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {items.map(p => (
        <span key={p.id} style={{
          position: "absolute", left: p.left, top: p.top,
          fontSize: p.size * 3,
          color: p.color,
          textShadow: `0 0 ${p.size * 2}px ${p.color}aa`,
          animation: `luxuryDrift ${p.dur} ${p.delay} ease-in-out infinite`,
          opacity: 0,
          ["--tx"]: `${p.tx}px`, ["--ty"]: `${p.ty}px`,
        }}>
          {p.type}
        </span>
      ))}
      <style>{`
        @keyframes luxuryDrift {
          0%   { opacity: 0; transform: translate(0,0) scale(1) rotate(0deg); }
          20%  { opacity: 0.8; }
          80%  { opacity: 0.5; }
          100% { opacity: 0; transform: translate(var(--tx),var(--ty)) scale(0.4) rotate(45deg); }
        }
      `}</style>
    </div>
  );
}

/* ── Ticking Countdown ── */
function Countdown({ targetDate }) {
  const [t, setT] = useState({ d: "00", h: "00", m: "00", s: "00" });
  useEffect(() => {
    const target = new Date(targetDate).getTime();
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
  }, [targetDate]);

  return (
    <div style={{ background: "linear-gradient(135deg,#0a192f,#0f2b48)", padding: "20px 18px", borderTop: "1px solid rgba(223,183,108,0.15)" }}>
      <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".54rem", letterSpacing: ".45em", textTransform: "uppercase", color: "#dfb76c", opacity: .8, marginBottom: 12, textAlign: "center" }}>
        Counting down to forever
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
        {[["d", "Days"], ["h", "Hours"], ["m", "Min"], ["s", "Sec"]].map(([k, lbl]) => (
          <div key={k} style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", fontWeight: 600, color: "#fffef9", lineHeight: 1, display: "block" }}>{t[k]}</span>
            <span style={{ fontFamily: "'Jost',sans-serif", fontSize: ".46rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#dfb76c", opacity: .8, marginTop: 4, display: "block", fontWeight: 300 }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Interactive Image Slideshow ── */
function ImageSlider({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
      {images.map((img, i) => (
        <div key={img} style={{
          position: "absolute", inset: 0,
          opacity: index === i ? 1 : 0,
          transition: "opacity 1.2s ease-in-out",
        }}>
          <img src={img} alt={`Wedding Slide ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: i === 0 ? "center 15%" : "center center" }} />
        </div>
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, #fffef9 100%)", pointerEvents: "none" }} />
      
      {/* Slider indicators */}
      <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6, zIndex: 5 }}>
        {images.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} style={{
            width: index === i ? 18 : 6, height: 6,
            borderRadius: 3,
            background: index === i ? "#dfb76c" : "rgba(255,255,255,0.4)",
            border: "none", cursor: "pointer",
            transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

export default function LuxuryWeddingPage() {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("ceremony");

  // RSVP Form States
  const [rsvpForm, setRsvpForm] = useState({ name: "", guests: "1", wishes: "" });
  const [rsvpSent, setRsvpSent] = useState(false);

  const details = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      bride:    getParam(params, "bride"),
      groom:    getParam(params, "groom"),
      guest:    getParam(params, "guest"),
      date:     getParam(params, "date"),
      month:    getParam(params, "month"),
      day:      getParam(params, "day"),
      time:     getParam(params, "time"),
      poruwa:   getParam(params, "poruwa"),
      venue:    getParam(params, "venue"),
      location: getParam(params, "location"),
      phone:    getParam(params, "phone"),
    };
  }, []);

  const sampleLink = `${window.location.origin}/wedding/navy?guest=Amali&bride=Sachini&groom=Tharindu`;

  const copyLink = async (textToCopy = sampleLink) => {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpForm.name.trim()) return;
    setRsvpSent(true);
    setTimeout(() => {
      setRsvpSent(false);
      setRsvpForm({ name: "", guests: "1", wishes: "" });
      alert("RSVP sent successfully! Thank you ❤️");
    }, 800);
  };

  /* Styles */
  const s = {
    card: {
      background: "#fffef9",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px #dfb76c, 0 0 0 5px #fffef9, 0 0 0 7px #dfb76c, 0 40px 100px rgba(0,0,0,0.3)",
      border: "none",
    },
    topBanner: {
      background: "linear-gradient(135deg, #091325 0%, #0e2444 60%, #091325 100%)",
      padding: "26px 20px 22px", textAlign: "center", position: "relative", overflow: "hidden",
      borderBottom: "2px solid #dfb76c",
    },
    tabBtn: (active) => ({
      flex: 1,
      padding: "12px 6px",
      fontSize: "12px",
      fontWeight: "700",
      fontFamily: "'Jost',sans-serif",
      textTransform: "uppercase",
      letterSpacing: "1px",
      border: "none",
      borderBottom: active ? "3px solid #dfb76c" : "3px solid transparent",
      background: active ? "rgba(223,183,108,0.06)" : "transparent",
      color: active ? "#dfb76c" : "#64748b",
      cursor: "pointer",
      transition: "all 0.3s",
    }),
  };

  return (
    <>
      <SEO 
        title="Navy & Gold Luxury Wedding Invitation Template" 
        description="Explore the Premium Navy & Gold wedding invitation template by Swag Solutions. Includes Slideshows, RSVP form, Registry details and background music." 
        keywords="navy wedding template, luxury digital invitation, luxury wedding card, rsvp portal online, love story timeline, wedding site mockup"
      />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,500&family=Jost:wght@200;300;400;500;600;700&display=swap" rel="stylesheet"/>
      <LuxuryParticles />

      {/* Floating Music Widget Mockup */}
      <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 100, display: "flex", alignItems: "center", gap: 10 }}>
        {isPlaying && (
          <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 18, background: "rgba(9,19,37,0.85)", backdropFilter: "blur(10px)", padding: "6px 10px", borderRadius: 12, border: "1px solid rgba(223,183,108,0.3)" }}>
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} style={{
                width: 3,
                height: "100%",
                background: "#dfb76c",
                borderRadius: 1,
                animation: `eqWave 1s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.15}s`,
                transformOrigin: "bottom",
              }} />
            ))}
          </div>
        )}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "linear-gradient(135deg,#0a192f,#dfb76c)",
            border: "1px solid #fffef9",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            display: "flex", alignItems: "center", justifyCenter: "center",
            cursor: "pointer", color: "#fff", transition: "all 0.3s",
            justifyContent: "center",
          }}
          title={isPlaying ? "Mute Background Music Mockup" : "Play Background Music Mockup"}
        >
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #090e17 0%, #0d1a2d 50%, #06090e 100%)", padding: "28px 14px 72px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 32, gridTemplateColumns: "min(480px,100%) 1fr", alignItems: "start" }}>

          {/* ══ INVITATION CARD ══ */}
          <div style={s.card}>

            {/* TOP LUXURY BANNER */}
            <div style={s.topBanner}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(223,183,108,0.18) 0%,transparent 65%)", pointerEvents: "none" }} />
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".52rem", letterSpacing: ".5em", textTransform: "uppercase", color: "#f3e1b9", opacity: .75, marginBottom: 6 }}>the honor of your presence is requested at</p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontStyle: "italic", color: "#dfb76c", letterSpacing: ".06em" }}>{details.venue}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <span style={{ flex: 1, height: 1, background: "rgba(223,183,108,0.25)" }} />
                <Sparkles size={12} color="#dfb76c" />
                <span style={{ flex: 1, height: 1, background: "rgba(223,183,108,0.25)" }} />
              </div>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".5rem", letterSpacing: ".4em", textTransform: "uppercase", color: "#f3e1b9", opacity: .65, marginTop: 8 }}>Royal Wedding Invitation</p>
            </div>

            {/* TOP LUXURY VIDEO */}
            <div style={{ position: "relative", height: 260, overflow: "hidden" }}>
              <video
                src="/wedding/couple-video.mp4"
                poster={COUPLE_IMG}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, #fffef9 100%)", pointerEvents: "none" }} />
            </div>

            {/* NAMES */}
            <div style={{ padding: "12px 24px 8px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".55rem", letterSpacing: ".5em", textTransform: "uppercase", color: "#dfb76c", marginBottom: 10 }}>The Wedding of</p>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.1rem,9.5vw,3.1rem)", fontStyle: "italic", color: "#0f2b48", display: "block", lineHeight: 1.05 }}>{details.bride}</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1.7rem", color: "#dfb76c", display: "block", margin: "4px 0", animation: "heartPulse 2.4s ease-in-out infinite" }}>&amp;</span>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2.1rem,9.5vw,3.1rem)", fontStyle: "italic", color: "#0f2b48", display: "block", lineHeight: 1.05 }}>{details.groom}</span>
            </div>

            {/* ELEGANT CENTER DECORATION */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 24px" }}>
              <span style={{ flex: 1, height: 1, background: "#dfb76c", opacity: 0.3 }} />
              <span style={{ color: "#dfb76c", fontSize: 14 }}>✦  ✦  ✦</span>
              <span style={{ flex: 1, height: 1, background: "#dfb76c", opacity: 0.3 }} />
            </div>

            {/* GUEST INVITATION CARD */}
            <div style={{ margin: "0 24px", background: "linear-gradient(135deg, #091325 0%, #152d50 100%)", border: "1px solid #dfb76c", borderRadius: 8, padding: "20px", textAlign: "center", boxShadow: "0 10px 25px rgba(9,19,37,0.15)" }}>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".54rem", letterSpacing: ".35em", textTransform: "uppercase", color: "#dfb76c", marginBottom: 8 }}>Cordially Invited</p>
              <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: "1.5rem", color: "#fffef9", marginBottom: 6 }}>{details.guest}</p>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".75rem", fontWeight: 300, color: "#f3e1b9", lineHeight: 1.8, opacity: 0.9 }}>
                Together with our families, we request the honor of your presence as we celebrate the start of our journey together.
              </p>
            </div>

            {/* DATE & COUNTDOWN BAND */}
            <div style={{ margin: "24px", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(223,183,108,0.2)" }}>
              <div style={{ background: "linear-gradient(135deg,#0a192f,#152d50)", padding: "24px", textCenter: "center", textAlign: "center", position: "relative" }}>
                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".54rem", letterSpacing: ".5em", textTransform: "uppercase", color: "#dfb76c", opacity: .8, marginBottom: 8 }}>Save the Date</p>
                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "4.8rem", fontWeight: 700, color: "#fffef9", lineHeight: 1 }}>{details.date}</p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1.4rem", color: "#dfb76c", marginTop: 2 }}>{details.month}</p>
                <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".58rem", letterSpacing: ".4em", textTransform: "uppercase", color: "#dfb76c", opacity: .7, marginTop: 4 }}>{details.day}</p>
              </div>
              <Countdown targetDate={`${details.month.replace(/\s+/, " ")} ${details.date} 09:00:00`} />
            </div>

            {/* GALLERY SLIDESHOW */}
            <div style={{ margin: "0 24px 24px", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(223,183,108,0.2)", position: "relative" }}>
              <ImageSlider images={[COUPLE_IMG, RINGS_IMG, RECEPTION_IMG]} />
            </div>

            {/* MULTI-TAB CARD SECTION */}
            <div style={{ margin: "0 24px 24px", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden", background: "#ffffff" }}>
              {/* Tab Selector */}
              <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <button onClick={() => setActiveTab("ceremony")} style={s.tabBtn(activeTab === "ceremony")}>Ceremony</button>
                <button onClick={() => setActiveTab("rsvp")} style={s.tabBtn(activeTab === "rsvp")}>RSVP</button>
              </div>

              {/* Tab Contents */}
              <div style={{ padding: "20px 18px" }}>
                {activeTab === "ceremony" && (
                  <div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0e2444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Clock size={16} color="#dfb76c" />
                        </div>
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#dfb76c" }}>Ceremony Times</p>
                          <p style={{ fontSize: "13.5px", color: "#334155", marginTop: 2, fontWeight: "600" }}>{details.time}</p>
                          <p style={{ fontSize: "12px", color: "#64748b", marginTop: 1 }}>Poruwa Ceremony starts at {details.poruwa}</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 14 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0e2444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <MapPin size={16} color="#dfb76c" />
                        </div>
                        <div>
                          <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#dfb76c" }}>Venue Location</p>
                          <p style={{ fontSize: "13.5px", color: "#334155", marginTop: 2, fontWeight: "600" }}>{details.venue}</p>
                          <p style={{ fontSize: "12px", color: "#64748b", marginTop: 1 }}>{details.location}</p>
                        </div>
                      </div>
                    </div>

                    <iframe
                      title="map"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(details.venue)}&output=embed`}
                      style={{ width: "100%", height: 160, border: "none", borderRadius: 6, display: "block", marginTop: 16, filter: "contrast(1.05) saturate(0.95)" }}
                      loading="lazy"
                    />
                  </div>
                )}

                {activeTab === "rsvp" && (
                  <form onSubmit={handleRsvpSubmit}>
                    <p style={{ fontSize: "12px", color: "#64748b", marginBottom: 12 }}>Please confirm your attendance below before October 15th.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#0f2b48", marginBottom: 4 }}>Your Name</label>
                        <input
                          type="text"
                          required
                          value={rsvpForm.name}
                          onChange={e => setRsvpForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="e.g. Amali Perera"
                          style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, outline: "none", fontSize: "13px" }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#0f2b48", marginBottom: 4 }}>Guests Count</label>
                          <select
                            value={rsvpForm.guests}
                            onChange={e => setRsvpForm(p => ({ ...p, guests: e.target.value }))}
                            style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 6, outline: "none", fontSize: "13px" }}
                          >
                            <option value="1">1 Member</option>
                            <option value="2">2 Members</option>
                            <option value="3">3 Members</option>
                            <option value="4">4 Members</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#0f2b48", marginBottom: 4 }}>Diet preference</label>
                          <select style={{ width: "100%", padding: "8px 10px", border: "1px solid #cbd5e1", borderRadius: 6, outline: "none", fontSize: "13px" }}>
                            <option>Standard / Non-Veg</option>
                            <option>Vegetarian</option>
                            <option>Halal</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "#0f2b48", marginBottom: 4 }}>Wishes (Optional)</label>
                        <textarea
                          rows="2"
                          value={rsvpForm.wishes}
                          onChange={e => setRsvpForm(p => ({ ...p, wishes: e.target.value }))}
                          placeholder="Send a warm message..."
                          style={{ width: "100%", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, outline: "none", fontSize: "13px", resize: "none" }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={rsvpSent}
                        style={{
                          marginTop: 6, width: "100%", padding: "10px",
                          background: "linear-gradient(135deg,#0a192f,#152d50)",
                          border: "none", borderRadius: 6, color: "#dfb76c",
                          fontWeight: "700", fontSize: "13px", textTransform: "uppercase",
                          cursor: "pointer", transition: "all 0.3s",
                        }}
                      >
                        {rsvpSent ? "Sending..." : "Confirm Attendance"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* ELEGANT BRAND FOOTER */}
            <div style={{ background: "#0a192f", padding: "16px 24px 22px", textAlign: "center", borderTop: "2px solid #dfb76c" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ flex: 1, height: 1, background: "rgba(223,183,108,0.2)" }} />
                <span style={{ color: "#dfb76c", fontSize: 10 }}>✦</span>
                <span style={{ flex: 1, height: 1, background: "rgba(223,183,108,0.2)" }} />
              </div>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: ".65rem", fontWeight: 300, color: "#f3e1b9", letterSpacing: ".05em" }}>crafted this royal invitation with ❤️</p>
              <a href="https://swagsolutions.lk" target="_blank" rel="noopener" style={{ fontFamily: "'Jost',sans-serif", fontSize: ".62rem", letterSpacing: ".22em", textTransform: "uppercase", color: "#dfb76c", fontWeight: 500, textDecoration: "none", display: "inline-block", marginTop: 4 }}>SWAG Solutions</a>
            </div>
          </div>

          {/* ══ SIDEBAR ══ */}
          <aside style={{ background: "#ffffff", borderRadius: 12, border: "1px solid #e2e8f0", padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", position: "sticky", top: 28 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 700, color: "#b45309", marginBottom: 20 }}>
              <Sparkles size={15} /> Navy Template
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", color: "#0f172a", lineHeight: 1.2, fontWeight: 800 }}>
              Navy Invitation
            </h1>
            <p style={{ marginTop: 16, fontSize: 14, lineHeight: 1.9, color: "#475569" }}>
              Our Pro tier template featuring a deep royal navy theme, multi-image slideshow, interactive timeline story, background music waves, and a dynamic RSVP tab.
            </p>

            {/* Journey Timeline */}
            <div style={{ marginTop: 28 }}>
              <p style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#dfb76c", marginBottom: 16 }}>Our Love Story</p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative", paddingLeft: 16, borderLeft: "2px solid #e2e8f0" }}>
                {[
                  { title: "First Met in 2021", desc: "A simple hello that turned into endless midnight calls." },
                  { title: "The Proposal in 2024", desc: "A cozy evening surprise under the stars at Sigiriya." },
                  { title: "The Big Day in 2026", desc: "Walking down the aisle to start our forever." }
                ].map((item, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    {/* Circle marker */}
                    <div style={{
                      position: "absolute", left: -25, top: 2,
                      width: 14, height: 14, borderRadius: "50%",
                      background: "#fffef9", border: "3px solid #dfb76c",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }} />
                    <h4 style={{ fontSize: "13.5px", fontWeight: "700", color: "#0f172a" }}>{item.title}</h4>
                    <p style={{ fontSize: "12px", color: "#475569", marginTop: 4, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
              {customOptions.map(opt => (
                <div key={opt} style={{ display: "flex", gap: 10, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13, fontWeight: 600, color: "#334155" }}>
                  <CheckCircle2 size={17} color="#16a34a" style={{ marginTop: 1, flexShrink: 0 }} />
                  {opt}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 18 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Shareable link preview</p>
              <p style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#475569", wordBreak: "break-all" }}>{sampleLink}</p>
              <button
                onClick={() => copyLink(sampleLink)}
                style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                <Compass size={15} /> {copied ? "Copied ✓" : "Copy preview link"}
              </button>
            </div>
          </aside>

        </div>
      </div>

      <style>{`
        @keyframes eqWave {
          0%   { transform: scaleY(0.2); }
          100% { transform: scaleY(1); }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.15); }
        }
      `}</style>
    </>
  );
}
