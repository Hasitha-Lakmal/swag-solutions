// ImageCompressor.jsx
// No external dependencies needed — pure browser APIs (Canvas, FileReader, Blob)
// Just import and drop into any React project.

import { useState, useRef, useCallback, useEffect } from "react";

/* ─── helpers ─── */
const fmt = (b) => {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
};

const FORMATS = ["image/jpeg", "image/png", "image/webp"];
const FORMAT_LABELS = { "image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WebP" };
const ACCEPT = "image/png, image/jpeg, image/webp, image/gif, image/bmp";

/* ─── styles ─── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
.ic-root{background:#0d0d0f;background-image:radial-gradient(ellipse 90% 50% at 50% -10%,rgba(232,255,71,.06) 0%,transparent 65%);min-height:100vh;font-family:'DM Sans',sans-serif;color:#fff;box-sizing:border-box}
.ic-root *{box-sizing:border-box}
@keyframes ic-fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes ic-spin{to{transform:rotate(360deg)}}
.ic-au{animation:ic-fadeUp .5s cubic-bezier(.16,1,.3,1) both}
.ic-spinner{animation:ic-spin .85s linear infinite;display:inline-block}
.ic-drop{border:2px dashed #252528;border-radius:22px;padding:3rem 2rem;text-align:center;cursor:pointer;transition:all .2s}
.ic-drop:hover,.ic-drop.over{border-color:#e8ff47;background:rgba(232,255,71,.03)}
.ic-inp{background:#1a1a1e;border:1px solid #252528;border-radius:10px;padding:.52rem .85rem;font-size:.82rem;color:#fff;width:100%;outline:none;transition:border .15s;font-family:'DM Sans',sans-serif}
.ic-inp:focus{border-color:#e8ff47}
.ic-inp::placeholder{color:#454550}
select.ic-inp option{background:#1a1a1e}
.ic-glass{background:rgba(22,22,25,.95);border:1px solid #252528;border-radius:20px}
.ic-fmt-btn{background:#1a1a1e;border:1px solid #252528;border-radius:10px;padding:.45rem .9rem;font-size:.75rem;font-weight:700;cursor:pointer;transition:all .15s;color:#aaa;font-family:'Syne',sans-serif;text-transform:uppercase;letter-spacing:.04em;flex:1}
.ic-fmt-btn.active{background:rgba(232,255,71,.1);border-color:#e8ff47;color:#e8ff47;box-shadow:0 0 14px rgba(232,255,71,.1)}
.ic-thumb{border-radius:12px;overflow:hidden;background:#111113;display:flex;align-items:center;justify-content:center;min-height:180px;position:relative}
.ic-thumb img{max-width:100%;max-height:260px;display:block;border-radius:10px;object-fit:contain}
.ic-badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;letter-spacing:.05em;text-transform:uppercase}
.ic-progress-bar{height:4px;border-radius:2px;background:#e8ff47;transition:width .3s ease}
input[type=range].ic-range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;background:#252528;outline:none;cursor:pointer}
input[type=range].ic-range::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#e8ff47;cursor:pointer;border:none}
input[type=range].ic-range::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#e8ff47;cursor:pointer;border:none}
.ic-file-item{background:#1a1a1e;border:1px solid #252528;border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:10px;transition:border .15s}
.ic-file-item:hover{border-color:#333336}
.ic-file-item.done{border-color:rgba(232,255,71,.25)}
.ic-file-item.error{border-color:rgba(220,38,38,.35)}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:#0d0d0f}
::-webkit-scrollbar-thumb{background:#252528;border-radius:3px}
`;

/* ─── compress one image ─── */
async function compressImage(file, quality, maxW, maxH, outputFormat) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxW / width, maxH / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const fmt = outputFormat === "image/png" ? "image/png" : outputFormat;
        const q = fmt === "image/png" ? 1 : quality / 100;
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error("Compression failed")); return; }
          resolve({ blob, width, height, size: blob.size, url: URL.createObjectURL(blob) });
        }, fmt, q);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/* ─── main component ─── */
export default function ImageCompressor() {
  useEffect(() => {
    document.title = "Image Compressor - Utility Tool | Swag Solutions";
  }, []);

  const [files, setFiles] = useState([]);       // [{file, status:'idle'|'processing'|'done'|'error', result, error}]
  const [quality, setQuality] = useState(75);
  const [maxW, setMaxW] = useState(1920);
  const [maxH, setMaxH] = useState(1080);
  const [outputFmt, setOutputFmt] = useState("image/jpeg");
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState(null);  // {original, compressed}
  const inputRef = useRef(null);

  // inject styles
  useState(() => {
    if (!document.getElementById("ic-styles")) {
      const s = document.createElement("style");
      s.id = "ic-styles"; s.textContent = STYLE;
      document.head.appendChild(s);
    }
  });

  const addFiles = useCallback((incoming) => {
    const valid = [...incoming].filter(f => f.type.startsWith("image/"));
    if (!valid.length) return;
    setFiles(prev => [
      ...prev,
      ...valid.map(f => ({ id: Math.random().toString(36).slice(2), file: f, status: "idle", result: null, error: null, originalUrl: URL.createObjectURL(f) }))
    ]);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (preview?.id === id) setPreview(null);
  };

  const compressAll = async () => {
    setProcessing(true);
    const updated = [...files];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === "done") continue;
      updated[i] = { ...updated[i], status: "processing" };
      setFiles([...updated]);
      try {
        const result = await compressImage(updated[i].file, quality, maxW, maxH, outputFmt);
        updated[i] = { ...updated[i], status: "done", result };
      } catch (err) {
        updated[i] = { ...updated[i], status: "error", error: err.message };
      }
      setFiles([...updated]);
    }
    setProcessing(false);
  };

  const downloadOne = (item) => {
    if (!item.result) return;
    const ext = outputFmt === "image/jpeg" ? "jpg" : outputFmt === "image/webp" ? "webp" : "png";
    const base = item.file.name.replace(/\.[^.]+$/, "");
    const a = document.createElement("a");
    a.href = item.result.url; a.download = `${base}_compressed.${ext}`; a.click();
  };

  const downloadAll = () => {
    files.filter(f => f.status === "done").forEach(downloadOne);
  };

  const doneCount = files.filter(f => f.status === "done").length;
  const totalSavedBytes = files.filter(f => f.status === "done").reduce((acc, f) => acc + (f.file.size - f.result.size), 0);
  const avgSaving = doneCount > 0
    ? Math.round(files.filter(f => f.status === "done").reduce((acc, f) => acc + (1 - f.result.size / f.file.size) * 100, 0) / doneCount)
    : 0;

  return (
    <div className="ic-root">
      {/* ── HEADER ── */}
      <header className="max-w-5xl mx-auto px-5 pt-10 pb-5 text-center ic-au">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#252528] bg-[#161619] text-[#606068] text-xs font-semibold uppercase tracking-widest mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] inline-block" />Image Compressor
        </div>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-.02em" }} className="mb-2">
          Compress <span className="text-[#e8ff47]">&amp;</span> Resize Images
        </h1>
        <p className="text-[#606068] text-sm max-w-sm mx-auto">100% browser-based. Nothing leaves your device.</p>
      </header>

      <main className="max-w-5xl mx-auto px-5 pb-24 space-y-4">

        {/* ── DROP ZONE ── */}
        <div
          className={`ic-drop ic-au${dragOver ? " over" : ""}`}
          style={{ animationDelay: ".08s" }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#1a1a1e] border border-[#252528] flex items-center justify-center mx-auto mb-4">
            <svg className="h-7 w-7 text-[#e8ff47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1.05rem" }} className="mb-1">
            Drop images here or click to browse
          </p>
          <p className="text-[#606068] text-sm">PNG, JPEG, WebP, GIF, BMP supported • Batch upload OK</p>
          <input ref={inputRef} type="file" accept={ACCEPT} multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        </div>

        {/* ── SETTINGS ── */}
        <div className="ic-glass p-5 ic-au" style={{ animationDelay: ".15s" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068] mb-4">Compression Settings</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Quality */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-semibold text-[#aaa]">Quality</label>
                  <span className="text-xs font-bold text-[#e8ff47]">{quality}%</span>
                </div>
                <input type="range" className="ic-range" min="10" max="100" value={quality} onChange={e => setQuality(parseInt(e.target.value))} />
                <div className="flex justify-between text-[10px] text-[#606068] mt-1">
                  <span>Smallest</span><span>Balanced</span><span>Best quality</span>
                </div>
              </div>

              {/* Max dimensions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#606068] block mb-1">Max Width (px)</label>
                  <input type="number" value={maxW} onChange={e => setMaxW(parseInt(e.target.value) || 1920)} className="ic-inp" min="64" max="8000" />
                </div>
                <div>
                  <label className="text-[10px] text-[#606068] block mb-1">Max Height (px)</label>
                  <input type="number" value={maxH} onChange={e => setMaxH(parseInt(e.target.value) || 1080)} className="ic-inp" min="64" max="8000" />
                </div>
              </div>
            </div>

            {/* Output format */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#aaa] block mb-2">Output Format</label>
                <div className="flex gap-2">
                  {FORMATS.map(fmt => (
                    <button key={fmt} className={`ic-fmt-btn${outputFmt === fmt ? " active" : ""}`} onClick={() => setOutputFmt(fmt)}>
                      {FORMAT_LABELS[fmt]}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-[#606068] mt-2 leading-snug">
                  {outputFmt === "image/jpeg" && "Best for photos. Smallest size. Lossy — no transparency."}
                  {outputFmt === "image/png" && "Best for graphics/logos. Lossless. Supports transparency."}
                  {outputFmt === "image/webp" && "Modern format. Small size + transparency. Great all-rounder."}
                </p>
              </div>
              {/* Quick presets */}
              <div>
                <label className="text-[10px] text-[#606068] block mb-2">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Web", q: 75, w: 1280, h: 720 },
                    { label: "Thumbnail", q: 65, w: 400, h: 400 },
                    { label: "HD", q: 85, w: 1920, h: 1080 },
                    { label: "Max quality", q: 95, w: 4096, h: 4096 },
                  ].map(p => (
                    <button key={p.label} onClick={() => { setQuality(p.q); setMaxW(p.w); setMaxH(p.h); }}
                      className="text-[11px] px-3 py-1.5 bg-[#1a1a1e] border border-[#252528] text-[#aaa] rounded-lg font-semibold hover:border-[#e8ff47] hover:text-[#e8ff47] transition">
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FILE LIST ── */}
        {files.length > 0 && (
          <div className="ic-glass p-5 space-y-3 ic-au">
            {/* Header row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068]">{files.length} image{files.length > 1 ? "s" : ""}</p>
                {doneCount > 0 && (
                  <span className="ic-badge" style={{ background: "rgba(232,255,71,.1)", border: "1px solid rgba(232,255,71,.25)", color: "#e8ff47" }}>
                    {doneCount} compressed · avg {avgSaving}% saved
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setFiles([]); setPreview(null); }} className="text-[11px] px-3 py-1.5 bg-[#1a1a1e] border border-[#252528] text-[#606068] rounded-lg font-semibold hover:text-red-400 hover:border-red-900 transition">
                  Clear all
                </button>
                {doneCount > 1 && (
                  <button onClick={downloadAll} className="text-[11px] px-3 py-1.5 bg-[#1a1a1e] border border-[#252528] text-[#aaa] rounded-lg font-semibold hover:border-[#e8ff47] hover:text-[#e8ff47] transition">
                    ⬇ Download all
                  </button>
                )}
                <button
                  onClick={compressAll}
                  disabled={processing || files.every(f => f.status === "done")}
                  className="text-[11px] px-4 py-1.5 rounded-lg font-bold uppercase tracking-wider transition"
                  style={{
                    fontFamily: "Syne,sans-serif",
                    background: processing || files.every(f => f.status === "done") ? "#1a1a1e" : "#e8ff47",
                    color: processing || files.every(f => f.status === "done") ? "#606068" : "#000",
                    border: "1px solid transparent",
                    cursor: processing || files.every(f => f.status === "done") ? "not-allowed" : "pointer",
                  }}
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <svg className="ic-spinner h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing…
                    </span>
                  ) : files.every(f => f.status === "done") ? "✓ All done" : "⚡ Compress"}
                </button>
              </div>
            </div>

            {/* File items */}
            <div className="space-y-2">
              {files.map((item) => (
                <div key={item.id} className={`ic-file-item${item.status === "done" ? " done" : item.status === "error" ? " error" : ""}`}>
                  {/* Thumbnail */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#111113] flex-shrink-0">
                    <img src={item.originalUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  {/* Name + info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate">{item.file.name}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] text-[#606068]">{fmt(item.file.size)}</span>
                      {item.status === "done" && (
                        <>
                          <span className="text-[#606068] text-[11px]">→</span>
                          <span className="text-[11px] text-[#e8ff47] font-semibold">{fmt(item.result.size)}</span>
                          <span className="ic-badge" style={{ background: "rgba(232,255,71,.08)", color: "#b3cc30", border: "none", fontSize: 10 }}>
                            -{Math.max(0, Math.round((1 - item.result.size / item.file.size) * 100))}%
                          </span>
                          <span className="text-[11px] text-[#606068]">{item.result.width}×{item.result.height}px</span>
                        </>
                      )}
                      {item.status === "processing" && <span className="text-[11px] text-[#e8ff47]">Compressing…</span>}
                      {item.status === "error" && <span className="text-[11px] text-red-400">{item.error}</span>}
                    </div>
                    {item.status === "processing" && (
                      <div className="mt-1.5 h-1 rounded bg-[#252528] overflow-hidden">
                        <div className="ic-progress-bar" style={{ width: "70%", animation: "ic-fadeUp 1s ease infinite alternate" }} />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status === "done" && (
                      <>
                        <button
                          onClick={() => setPreview(preview?.id === item.id ? null : { id: item.id, original: item.originalUrl, compressed: item.result.url, origSize: item.file.size, newSize: item.result.size, w: item.result.width, h: item.result.height })}
                          className="text-[11px] px-2.5 py-1 bg-[#1a1a1e] border border-[#252528] text-[#aaa] rounded-lg font-semibold hover:border-[#e8ff47] hover:text-[#e8ff47] transition"
                        >
                          {preview?.id === item.id ? "Hide" : "Preview"}
                        </button>
                        <button onClick={() => downloadOne(item)} className="text-[11px] px-2.5 py-1 bg-[#e8ff47] text-black rounded-lg font-bold hover:bg-yellow-300 transition" style={{ fontFamily: "Syne,sans-serif" }}>
                          ⬇
                        </button>
                      </>
                    )}
                    <button onClick={() => removeFile(item.id)} className="text-[#606068] hover:text-red-400 transition text-base font-semibold px-1">×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PREVIEW ── */}
        {preview && (
          <div className="ic-glass p-5 ic-au">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068]">Before / After</p>
              <div className="flex gap-3 text-[11px] text-[#606068]">
                <span>Original: <span className="text-white font-semibold">{fmt(preview.origSize)}</span></span>
                <span>Compressed: <span className="text-[#e8ff47] font-semibold">{fmt(preview.newSize)}</span></span>
                <span>Saved: <span className="text-[#e8ff47] font-semibold">{Math.max(0, Math.round((1 - preview.newSize / preview.origSize) * 100))}%</span></span>
                <span className="text-[#606068]">{preview.w}×{preview.h}px</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068] mb-2">Original</p>
                <div className="ic-thumb">
                  <img src={preview.original} alt="Original" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#e8ff47] mb-2">Compressed</p>
                <div className="ic-thumb" style={{ border: "1px solid rgba(232,255,71,.2)" }}>
                  <img src={preview.compressed} alt="Compressed" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SUMMARY ── */}
        {doneCount > 0 && (
          <div className="ic-au" style={{ animationDelay: ".05s" }}>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Images compressed", value: `${doneCount} / ${files.length}` },
                { label: "Avg size reduction", value: `${avgSaving}%` },
                { label: "Total space saved", value: fmt(Math.max(0, totalSavedBytes)) },
              ].map(({ label, value }) => (
                <div key={label} className="ic-glass p-4 text-center rounded-2xl">
                  <p className="text-[#606068] text-[10px] uppercase tracking-widest mb-1">{label}</p>
                  <p style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#e8ff47" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
