import { useState, useEffect, useRef } from "react";
import { Download, FileCode, Copy, Check, Wifi, Mail, Phone, Link, Type } from "lucide-react";

const TABS = [
  { id: "url",   label: "URL",    icon: Link },
  { id: "text",  label: "Text",   icon: Type },
  { id: "email", label: "Email",  icon: Mail },
  { id: "phone", label: "Phone",  icon: Phone },
  { id: "wifi",  label: "Wi-Fi",  icon: Wifi },
];

const SIZES = [200, 300, 400, 500];
const EC_LEVELS = [
  { value: "L", label: "L — 7%" },
  { value: "M", label: "M — 15%" },
  { value: "Q", label: "Q — 25%" },
  { value: "H", label: "H — 30%" },
];

export default function QRGenerator() {
  useEffect(() => {
    document.title = "QR Code Generator - Utility Tool | Swag Solutions";
  }, []);

  const [tab, setTab]         = useState("url");
  const [url, setUrl]         = useState("https://swagsolutions.lk/");
  const [text, setText]       = useState("");
  const [email, setEmail]     = useState("");
  const [subject, setSubject] = useState("");
  const [phone, setPhone]     = useState("");
  const [ssid, setSsid]       = useState("");
  const [pass, setPass]       = useState("");
  const [enc, setEnc]         = useState("WPA");
  const [size, setSize]       = useState(300);
  const [ec, setEc]           = useState("M");
  const [darkCol, setDarkCol] = useState("#1e1b4b");
  const [lightCol, setLightCol] = useState("#ffffff");
  const [hint, setHint]       = useState("");
  const [copied, setCopied]   = useState(false);

  const canvasRef = useRef(null);
  const lastSvgRef = useRef("");
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Capture all current values inside the effect to avoid stale closures
    const currentData = (() => {
      if (tab === "url")   return url.trim() || "https://swagsolutions.lk/";
      if (tab === "text")  return text.trim() || "Hello!";
      if (tab === "email") return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
      if (tab === "phone") return `tel:${phone.trim()}`;
      if (tab === "wifi")  return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
      return "";
    })();

    function render() {
      if (!window.QRCode || !canvasRef.current || !currentData) return;

      const ecMap = {
        L: window.QRCode.CorrectLevel.L,
        M: window.QRCode.CorrectLevel.M,
        Q: window.QRCode.CorrectLevel.Q,
        H: window.QRCode.CorrectLevel.H,
      };

      const canvas = canvasRef.current;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = lightCol;
      ctx.fillRect(0, 0, size, size);

      const tmp = document.createElement("div");
      tmp.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:0;height:0;overflow:hidden";
      document.body.appendChild(tmp);

      try {
        new window.QRCode(tmp, {
          text: currentData,
          width: size,
          height: size,
          colorDark: darkCol,
          colorLight: lightCol,
          correctLevel: ecMap[ec],
        });

        // QRCode lib renders async via img onload internally — poll briefly
        const check = (attempts) => {
          const img = tmp.querySelector("img");
          const cvs = tmp.querySelector("canvas");

          if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, 0, 0, size, size);
            lastSvgRef.current = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><image href="${img.src}" width="${size}" height="${size}"/></svg>`;
            document.body.removeChild(tmp);
            setHint("");
          } else if (cvs && cvs.width > 0) {
            ctx.drawImage(cvs, 0, 0, size, size);
            lastSvgRef.current = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><image href="${cvs.toDataURL()}" width="${size}" height="${size}"/></svg>`;
            document.body.removeChild(tmp);
            setHint("");
          } else if (img) {
            // img exists but not loaded yet — attach onload
            img.onload = () => {
              ctx.drawImage(img, 0, 0, size, size);
              lastSvgRef.current = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><image href="${img.src}" width="${size}" height="${size}"/></svg>`;
              if (document.body.contains(tmp)) document.body.removeChild(tmp);
              setHint("");
            };
          } else if (attempts > 0) {
            setTimeout(() => check(attempts - 1), 50);
          } else {
            if (document.body.contains(tmp)) document.body.removeChild(tmp);
          }
        };
        check(10);
      } catch {
        if (document.body.contains(tmp)) document.body.removeChild(tmp);
        setHint("Data too long — try shorter text or higher error correction.");
      }
    }

    if (window.QRCode) {
      render();
    } else if (!scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      script.onload = () => render();
      document.head.appendChild(script);
    }
  }, [tab, url, text, email, subject, phone, ssid, pass, enc, size, ec, darkCol, lightCol]);

  function dlPng() {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.href = canvasRef.current.toDataURL("image/png");
    a.download = "qrcode.png";
    a.click();
  }

  function dlSvg() {
    if (!lastSvgRef.current) { dlPng(); return; }
    const blob = new Blob([lastSvgRef.current], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qrcode.svg";
    a.click();
  }

  function copyDataUrl() {
    if (!canvasRef.current) return;
    navigator.clipboard.writeText(canvasRef.current.toDataURL("image/png")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mx-auto mb-4 border border-purple-500/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
              <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
              <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/>
              <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">QR Code Generator</h1>
          <p className="text-slate-500 mt-2">Generate scannable QR codes for URLs, text, Wi-Fi and more.</p>
        </div>

        <div className="space-y-6">

          {/* Tab selector */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
            <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
              {TABS.map((tabItem) => {
                const TabIcon = tabItem.icon;

                return (
                  <button
                    key={tabItem.id}
                    onClick={() => setTab(tabItem.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                      tab === tabItem.id
                        ? "bg-white text-purple-700 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <TabIcon size={13} />
                    <span className="hidden sm:inline">{tabItem.label}</span>
                    <span className="sm:hidden">{tabItem.label}</span>
                  </button>
                );
              })}
            </div>

            {/* URL */}
            {tab === "url" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">URL</label>
                <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
              </div>
            )}

            {/* Text */}
            {tab === "text" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Text</label>
                <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter any text…" rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-y" />
              </div>
            )}

            {/* Email */}
            {tab === "email" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Subject (optional)</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Hello"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
                </div>
              </div>
            )}

            {/* Phone */}
            {tab === "phone" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Phone number</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94711234567"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
              </div>
            )}

            {/* Wi-Fi */}
            {tab === "wifi" && (
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-sm font-medium text-slate-700">Network name (SSID)</label>
                  <input value={ssid} onChange={e => setSsid(e.target.value)} placeholder="MyWifi"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="password"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none" />
                </div>
                <div className="flex flex-col gap-1.5 col-span-1">
                  <label className="text-sm font-medium text-slate-700">Security</label>
                  <select value={enc} onChange={e => setEnc(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none">
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Settings + Output */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
            {/* Settings row */}
            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Size (px)</label>
                <select value={size} onChange={e => setSize(Number(e.target.value))}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                  {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Error correction</label>
                <select value={ec} onChange={e => setEc(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                  {EC_LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Dark colour</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={darkCol} onChange={e => setDarkCol(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-transparent" />
                  <span className="text-xs text-slate-400 font-mono">{darkCol}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Light colour</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={lightCol} onChange={e => setLightCol(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-transparent" />
                  <span className="text-xs text-slate-400 font-mono">{lightCol}</span>
                </div>
              </div>
            </div>

            {/* QR output */}
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <canvas ref={canvasRef} width={size} height={size}
                  style={{ display: "block", width: Math.min(size, 280), height: Math.min(size, 280), borderRadius: 8 }} />
              </div>
              <span className="text-xs text-slate-400">{size} × {size} px</span>

              {hint && <p className="text-xs text-red-500 text-center">{hint}</p>}

              <div className="flex gap-2 flex-wrap justify-center">
                <button onClick={dlPng}
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-purple-500/30">
                  <Download size={16} /> Download PNG
                </button>
                <button onClick={dlSvg}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition-all">
                  <FileCode size={16} /> Download SVG
                </button>
                <button onClick={copyDataUrl}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-medium transition-all">
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
