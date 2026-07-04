import { useMemo, useState, useEffect, useRef } from "react";
import SEO from "../../components/SEO";
import { assetUrl } from "../../utils/assetUrl";
import {
  CalendarDays, CheckCircle2, Copy, Heart,
  ImagePlus, MapPin, Phone, Sparkles
} from "lucide-react";

const COUPLE_IMG = assetUrl("wedding/couple.png");
const HOTEL_IMG = assetUrl("wedding/hotel.jpeg");
const COUPLE_VIDEO = assetUrl("wedding/couple-video.mp4");

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
  "Couple photos and venue photos",
  "Names, date, time, and venue",
  "Guest name personalization",
  "Countdown timer and map",
  "Colors, style, and wording",
  "RSVP phone number or WhatsApp link",
];

function getParam(params, key) {
  return params.get(key)?.trim() || defaultDetails[key];
}

function pad(n) { return String(n).padStart(2, "0"); }

function Countdown({ targetDate }) {
  const [t, setT] = useState({ d:"00",h:"00",m:"00",s:"00" });
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
    <div style={{ background: "linear-gradient(135deg,#1e3a1e,#2a4a2a)", padding: "24px 20px", textAlign: "center" }}>
      <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".52rem", letterSpacing:".45em", textTransform:"uppercase", color:"#d4c090", opacity:.8, marginBottom:14 }}>
        Counting down to forever
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
        {[["d","Days"],["h","Hours"],["m","Min"],["s","Sec"]].map(([k,lbl]) => (
          <div key={k} style={{ textAlign:"center" }}>
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.2rem", fontWeight:600, color:"#fdf8f0", lineHeight:1, display:"block" }}>{t[k]}</span>
            <span style={{ fontFamily:"'Jost',sans-serif", fontSize:".46rem", letterSpacing:".18em", textTransform:"uppercase", color:"#c9a84c", opacity:.8, marginTop:4, display:"block", fontWeight:300 }}>{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(22px)",
      transition: `opacity .8s ease ${delay}s, transform .8s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ── Floating petal dots ── */
function NatureParticles() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top:  `${20 + Math.random() * 75}%`,
        size: 2 + Math.random() * 3.5,
        color: ["#c9a84c","#e8d5a3","#6dac6d","#a8c8a8","#f0e8c8"][Math.floor(Math.random()*5)],
        dur:  `${5 + Math.random() * 7}s`,
        delay:`${Math.random() * 9}s`,
        tx:   (Math.random() - .5) * 100,
        ty:   (Math.random() - .5) * 100,
      })));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
      {items.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:p.left, top:p.top,
          width:p.size, height:p.size,
          background:p.color, borderRadius:"50%",
          boxShadow:`0 0 ${p.size*2}px ${p.color}88`,
          animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite`,
          opacity:0,
          ["--tx"]: `${p.tx}px`, ["--ty"]: `${p.ty}px`,
        }}/>
      ))}
      <style>{`
        @keyframes particleDrift {
          0%   { opacity:0; transform:translate(0,0) scale(1); }
          15%  { opacity:.9; }
          85%  { opacity:.5; }
          100% { opacity:0; transform:translate(var(--tx),var(--ty)) scale(.4); }
        }
        @keyframes waveMove {
          0%   { transform:translateX(0); }
          100% { transform:translateX(-50%); }
        }
        @keyframes heartPulse {
          0%,100% { transform:scale(1); }
          50%     { transform:scale(1.15); }
        }
      `}</style>
    </div>
  );
}

/* ── Wavy divider ── */
function WaveDivider({ flip = false }) {
  return (
    <div style={{ position:"relative", height:60, overflow:"hidden", background:"transparent" }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none"
        style={{ position:"absolute", bottom:0, left:0, width:"200%", height:"100%",
                 animation:"waveMove 10s linear infinite",
                 transform: flip ? "scaleY(-1)" : "none" }}>
        <path d="M0 30 Q180 5 360 30 Q540 55 720 30 Q900 5 1080 30 Q1260 55 1440 30 Q1620 5 1800 30 Q1980 55 2160 30 L2160 60 L0 60 Z"
              fill="rgba(42,74,42,0.15)"/>
      </svg>
    </div>
  );
}

/* ── Botanical SVG ornament ── */
function BotanicalDivider() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"18px 24px" }}>
      <span style={{ flex:1, height:1, background:"#d4c090" }}/>
      <svg viewBox="0 0 60 24" width="60" height="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 12 Q22 4 14 8 Q18 12 30 12 Z" fill="#5a8c4e" opacity=".7"/>
        <path d="M30 12 Q38 4 46 8 Q42 12 30 12 Z" fill="#5a8c4e" opacity=".7"/>
        <circle cx="30" cy="12" r="3" fill="#c9a84c"/>
        <circle cx="30" cy="12" r="1.2" fill="#fdf8f0"/>
      </svg>
      <span style={{ flex:1, height:1, background:"#d4c090" }}/>
    </div>
  );
}

export default function ClassicWeddingPage() {
  const [copied, setCopied] = useState(false);

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

  const sampleLink = `${window.location.origin}/wedding/classic?guest=Amali&bride=Sachini&groom=Tharindu`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(sampleLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  /* shared text styles */
  const s = {
    card: {
      background:"#fffef7",
      borderRadius:8,
      overflow:"hidden",
      boxShadow:"0 2px 0 6px #f0ead8, 0 2px 0 7px #d4c090, 0 40px 100px rgba(0,0,0,.25)",
      outline:"1px solid #d4c090",
    },
    topBanner: {
      background:"linear-gradient(160deg,#2a4a1e 0%,#3d6b2a 55%,#2a4a1e 100%)",
      padding:"22px 20px 18px", textAlign:"center", position:"relative", overflow:"hidden",
    },
    sectionTag: {
      fontFamily:"'Jost',sans-serif", fontSize:".54rem", letterSpacing:".45em",
      textTransform:"uppercase", color:"#c9a84c", textAlign:"center", marginBottom:16,
    },
  };

  return (
    <>
      <SEO 
        title="Classic Wedding Invitation Card Template" 
        description="View the Classic wedding invitation template by Swag Solutions. Custom botanical theme, guest personalization, location maps, and countdowns." 
        keywords="classic wedding card, digital invitation card, online wedding invitation, wedding invitation website sri lanka, customized rsvp card"
      />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,500&family=Jost:wght@200;300;400;500&display=swap" rel="stylesheet"/>
      <NatureParticles />

      <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#f5f0e8 0%,#eae8dc 50%,#f0ece0 100%)", padding:"28px 14px 72px", position:"relative", zIndex:1 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gap:28, gridTemplateColumns:"min(480px,100%) 1fr", alignItems:"start" }}>

          {/* ══ INVITATION CARD ══ */}
          <div style={s.card}>

            {/* TOP GREEN BANNER */}
            <div style={s.topBanner}>
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 0%,rgba(201,168,76,.18) 0%,transparent 65%)", pointerEvents:"none" }}/>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".52rem", letterSpacing:".5em", textTransform:"uppercase", color:"#e8d5a3", opacity:.75, position:"relative", zIndex:1, marginBottom:6 }}>presents a</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1.5rem", fontStyle:"italic", color:"#e8d5a3", position:"relative", zIndex:1, letterSpacing:".06em" }}>{details.venue}</p>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:10, position:"relative", zIndex:1 }}>
                <span style={{ flex:1, height:1, background:"rgba(232,213,163,.25)" }}/>
                <Sparkles size={12} color="#c9a84c"/>
                <span style={{ flex:1, height:1, background:"rgba(232,213,163,.25)" }}/>
              </div>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".5rem", letterSpacing:".4em", textTransform:"uppercase", color:"#e8d5a3", opacity:.65, marginTop:8, position:"relative", zIndex:1 }}>Wedding Invitation</p>
            </div>

            {/* COUPLE VIDEO */}
            <div style={{ position:"relative", overflow:"hidden", maxHeight:480 }}>
              <video
                src={COUPLE_VIDEO}
                poster={COUPLE_IMG}
                autoPlay
                muted
                loop
                playsInline
                style={{ width:"100%", display:"block", objectFit:"cover", objectPosition:"center 30%", maxHeight:480 }}
              />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:110, background:"linear-gradient(to bottom,transparent,#fffef7)", pointerEvents:"none" }}/>
            </div>

            {/* NAMES */}
            <div style={{ padding:"18px 24px 4px", textAlign:"center" }}>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".55rem", letterSpacing:".5em", textTransform:"uppercase", color:"#c9a84c", marginBottom:10 }}>The Wedding of</p>
              <FadeIn delay={0.1}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,9vw,3rem)", fontStyle:"italic", color:"#1a2e1a", display:"block", lineHeight:1.05 }}>{details.bride}</span>
              </FadeIn>
              <FadeIn delay={0.3}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"1.7rem", color:"#c9a84c", display:"block", margin:"4px 0", animation:"heartPulse 2.4s ease-in-out infinite" }}>&amp;</span>
              </FadeIn>
              <FadeIn delay={0.5}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,9vw,3rem)", fontStyle:"italic", color:"#1a2e1a", display:"block", lineHeight:1.05 }}>{details.groom}</span>
              </FadeIn>
            </div>

            <BotanicalDivider/>

            {/* GUEST */}
            <div style={{ margin:"0 24px", background:"linear-gradient(135deg,#fdf8ec,#f5edcc)", border:"1px solid #d4c090", borderTop:"2px solid #c9a84c", padding:"18px 20px", textAlign:"center" }}>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".54rem", letterSpacing:".35em", textTransform:"uppercase", color:"#8b6914", marginBottom:6 }}>You are cordially invited</p>
              <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:"1.5rem", color:"#1a2e1a", marginBottom:6 }}>{details.guest}</p>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".78rem", fontWeight:300, color:"#3d4a2a", lineHeight:1.8 }}>
                We joyfully request the honour of your presence<br/>as we celebrate the joy of our marriage
              </p>
            </div>

            <WaveDivider/>

            {/* DATE BAND */}
            <div style={{ background:"linear-gradient(135deg,#2a4a1e,#3d6b2a)", padding:"28px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%,rgba(201,168,76,.1) 0%,transparent 70%)", pointerEvents:"none" }}/>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".54rem", letterSpacing:".5em", textTransform:"uppercase", color:"#d4c090", opacity:.8, marginBottom:10, position:"relative" }}>Save the Date</p>
              <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"5.5rem", fontWeight:700, color:"#fdf8f0", lineHeight:1, position:"relative" }}>{details.date}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"1.4rem", color:"#d4c090", marginTop:4, position:"relative" }}>{details.month}</p>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".58rem", letterSpacing:".4em", textTransform:"uppercase", color:"#d4c090", opacity:.7, marginTop:6, position:"relative" }}>{details.day}</p>
            </div>

            {/* COUNTDOWN */}
            <Countdown targetDate={`${details.month.replace(/\s+/," ")} ${details.date} 09:00:00`}/>

            <WaveDivider flip/>

            {/* DETAILS */}
            <div style={{ padding:"22px 24px 18px" }}>
              <p style={s.sectionTag}>Event Details</p>
              {[
                { icon:<CalendarDays size={18} color="#c9a84c"/>, title:"Time", val:details.time, sub:`Poruwa Ceremony at ${details.poruwa}` },
                { icon:<MapPin size={18} color="#c9a84c"/>, title:"Venue", val:details.venue, sub:details.location },
              ].map((r,i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"13px 0", borderBottom: i===0 ? "1px solid #e8d5a3" : "none" }}>
                  <div style={{ width:38, height:38, borderRadius:"50%", background:"#2a4a1e", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{r.icon}</div>
                  <div>
                    <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".58rem", letterSpacing:".2em", textTransform:"uppercase", color:"#c9a84c", marginBottom:3, fontWeight:500 }}>{r.title}</p>
                    <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"1rem", color:"#1a2e1a", lineHeight:1.4 }}>{r.val}</p>
                    <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".72rem", fontWeight:300, color:"#3d4a2a", marginTop:2 }}>{r.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* HOTEL PHOTO */}
            <div style={{ position:"relative", overflow:"hidden" }}>
              <img src={HOTEL_IMG} alt={details.venue} style={{ width:"100%", height:220, objectFit:"cover", display:"block", filter:"saturate(1.1) brightness(.95)" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 45%,rgba(26,46,26,.75) 100%)" }}/>
              <div style={{ position:"absolute", bottom:16, left:0, right:0, textAlign:"center" }}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"1.4rem", color:"#fdf8f0", textShadow:"0 2px 12px rgba(0,0,0,.5)" }}>{details.venue}</p>
                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".58rem", letterSpacing:".3em", textTransform:"uppercase", color:"#d4c090", marginTop:2 }}>{details.location}</p>
              </div>
            </div>

            {/* MAP */}
            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(details.venue)}&output=embed`}
              style={{ width:"100%", height:180, border:"none", display:"block", filter:"saturate(.85) sepia(.1)" }}
              loading="lazy"
            />

            {/* RSVP */}
            <div style={{ background:"linear-gradient(135deg,#2a4a1e,#3d6b2a)", padding:"22px 24px" }}>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".52rem", letterSpacing:".4em", textTransform:"uppercase", color:"#d4c090", textAlign:"center", marginBottom:14, opacity:.8 }}>Kindly RSVP</p>
              <a href={`tel:${details.phone.replace(/\s/g,"")}`} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, textDecoration:"none" }}>
                <div style={{ width:38, height:38, borderRadius:"50%", border:"1px solid #c9a84c", background:"rgba(255,255,255,.08)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Phone size={18} color="#d4c090"/>
                </div>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", color:"#fdf8f0" }}>{details.phone}</span>
              </a>
            </div>

            {/* FOOTER */}
            <div style={{ background:"#fffef7", padding:"16px 24px 22px", textAlign:"center", borderTop:"1px solid #e8d5a3" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <span style={{ flex:1, height:1, background:"#e8d5a3" }}/>
                <span style={{ color:"#c9a84c", fontSize:10 }}>✦</span>
                <span style={{ flex:1, height:1, background:"#e8d5a3" }}/>
              </div>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:".65rem", fontWeight:300, color:"#3d4a2a", letterSpacing:".05em" }}>crafted this invitation with ❤️</p>
              <a href="https://swagsolutions.lk" target="_blank" rel="noopener" style={{ fontFamily:"'Jost',sans-serif", fontSize:".62rem", letterSpacing:".22em", textTransform:"uppercase", color:"#c9a84c", fontWeight:500, textDecoration:"none", display:"inline-block", marginTop:4 }}>SWAG Solutions</a>
            </div>
          </div>

          {/* ══ SIDEBAR ══ */}
          <aside style={{ background:"#ffffff", borderRadius:12, border:"1px solid #e2e8f0", padding:28, boxShadow:"0 20px 60px rgba(0,0,0,.1)", position:"sticky", top:28 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#fff1f2", borderRadius:8, padding:"8px 12px", fontSize:13, fontWeight:700, color:"#e11d48", marginBottom:20 }}>
              <Heart size={15}/> Classic Template
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.6rem,3vw,2.4rem)", color:"#0f172a", lineHeight:1.2, fontWeight:800 }}>
              Classic Invitation
            </h1>
            <p style={{ marginTop:16, fontSize:14, lineHeight:1.9, color:"#475569" }}>
              A traditional, elegant botanical theme with warm gold details and classic typography. Photos, colors, map, venue, and wording can be customized.
            </p>

            <div style={{ marginTop:24, display:"grid", gap:10, gridTemplateColumns:"1fr 1fr" }}>
              {customOptions.map(opt => (
                <div key={opt} style={{ display:"flex", gap:10, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:8, padding:"10px 12px", fontSize:13, fontWeight:600, color:"#334155" }}>
                  <CheckCircle2 size={17} color="#16a34a" style={{ marginTop:1, flexShrink:0 }}/>
                  {opt}
                </div>
              ))}
            </div>

            <div style={{ marginTop:28, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:10, padding:18 }}>
              <p style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:8 }}>Shareable link preview</p>
              <p style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"10px 12px", fontSize:13, color:"#475569", wordBreak:"break-all" }}>{sampleLink}</p>
              <button
                onClick={copyLink}
                style={{ marginTop:12, display:"inline-flex", alignItems:"center", gap:8, background:"#0f172a", color:"#fff", border:"none", borderRadius:8, padding:"9px 16px", fontSize:13, fontWeight:600, cursor:"pointer" }}
              >
                <Copy size={15}/> {copied ? "Copied ✓" : "Copy preview link"}
              </button>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}