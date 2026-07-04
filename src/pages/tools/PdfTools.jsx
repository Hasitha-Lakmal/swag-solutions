// PDFPro.jsx
// Dependencies needed in your project:
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script>
// Or install via npm: pdfjs-dist, pdf-lib
// Google Fonts link in your index.html:
//   https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&...

import { useState, useRef, useEffect, useCallback } from "react";
import SEO from "../../components/SEO";
import SchemaMarkup from "../../components/SchemaMarkup";

/* ─── helpers ─── */
const fmt = (b) => {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(2) + " MB";
};
const base64ToBytes = (b64) => {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
};
const hexToRgb = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});
const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
};
const escHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const qualityMap = { low: 0.75, medium: 0.45, high: 0.2 };
const scaleMap = { low: 1, medium: 0.85, high: 0.7 };

const PdfIcon = ({ cls = "h-7 w-7 text-[#e8ff47]" }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const Spinner = ({ cls = "pdfpro-spinner h-10 w-10 text-[#e8ff47]" }) => (
  <svg className={cls} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

/* ─── styles (injected once) ─── */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,700;1,400&family=Dancing+Script:wght@400;700&family=Oswald:wght@400;700&display=swap');

.pdfpro-root{background:#0d0d0f;background-image:radial-gradient(ellipse 90% 50% at 50% -10%,rgba(232,255,71,.06) 0%,transparent 65%);min-height:100vh;font-family:'DM Sans',sans-serif;color:#fff;box-sizing:border-box}
.pdfpro-root *{box-sizing:border-box}
@keyframes pdfpro-fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes pdfpro-spin{to{transform:rotate(360deg)}}
@keyframes pdfpro-prog{0%{width:0}35%{width:40%}75%{width:78%}100%{width:93%}}
@keyframes pdfpro-pulse{0%,100%{opacity:1}50%{opacity:.45}}
.pdfpro-au{animation:pdfpro-fadeUp .5s cubic-bezier(.16,1,.3,1) both}
.pdfpro-spinner{animation:pdfpro-spin .85s linear infinite}
.pdfpro-prog-anim{animation:pdfpro-prog 1.3s ease-out forwards}
.pdfpro-tab-btn{transition:all .18s;border-bottom:2px solid transparent;padding:.55rem 1.1rem;font-weight:600;font-size:.78rem;letter-spacing:.05em;text-transform:uppercase;color:#606068;white-space:nowrap;cursor:pointer;background:none;border-top:none;border-left:none;border-right:none}
.pdfpro-tab-btn.active{border-bottom-color:#e8ff47;color:#e8ff47}
.pdfpro-inp{background:#1a1a1e;border:1px solid #252528;border-radius:10px;padding:.52rem .85rem;font-size:.82rem;color:#fff;width:100%;outline:none;transition:border .15s;font-family:'DM Sans',sans-serif}
.pdfpro-inp:focus{border-color:#e8ff47}
.pdfpro-inp::placeholder{color:#454550}
select.pdfpro-inp option{background:#1a1a1e}
.pdfpro-level-btn{background:#1a1a1e;border:1px solid #252528;border-radius:12px;padding:.6rem 1rem;font-size:.78rem;font-weight:700;cursor:pointer;transition:all .15s;color:#aaa;font-family:'Syne',sans-serif;text-transform:uppercase;letter-spacing:.04em;width:100%}
.pdfpro-level-btn.active{background:rgba(232,255,71,.1);border-color:#e8ff47;color:#e8ff47;box-shadow:0 0 14px rgba(232,255,71,.12)}
.pdfpro-glass{background:rgba(22,22,25,.95);border:1px solid #252528;border-radius:20px}
.pdfpro-annot{position:absolute;pointer-events:all;cursor:move;box-sizing:border-box}
.pdfpro-annot-border{position:absolute;inset:-3px;border:2px dashed rgba(232,255,71,.45);border-radius:4px;pointer-events:none;opacity:0;transition:opacity .15s}
.pdfpro-annot:hover .pdfpro-annot-border,.pdfpro-annot.selected .pdfpro-annot-border{opacity:1}
.pdfpro-annot.selected .pdfpro-annot-border{border-color:#e8ff47}
.pdfpro-annot .pdfpro-del-x{position:absolute;top:-10px;right:-10px;width:20px;height:20px;background:#e8ff47;color:#000;border-radius:50%;font-size:11px;font-weight:900;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;transition:opacity .15s;z-index:20;border:none;line-height:1}
.pdfpro-annot:hover .pdfpro-del-x,.pdfpro-annot.selected .pdfpro-del-x{opacity:1}
.pdfpro-annot .pdfpro-resize-dot{position:absolute;bottom:-6px;right:-6px;width:13px;height:13px;background:#e8ff47;border-radius:3px;cursor:se-resize;z-index:15}
.pdfpro-annot-text-content{background:transparent;border:none;outline:none;font-family:'DM Sans',sans-serif;white-space:pre;line-height:1.3;pointer-events:none}
.pdfpro-annot.selected .pdfpro-annot-text-content{pointer-events:all}
.pdfpro-annot img{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;border-radius:2px}
.pdfpro-pg-thumb{border:2px solid #252528;border-radius:10px;cursor:pointer;transition:all .18s;background:#1a1a1e;overflow:hidden;position:relative}
.pdfpro-pg-thumb:hover{border-color:#404048}
.pdfpro-pg-thumb.selected{border-color:#e8ff47;box-shadow:0 0 0 2px rgba(232,255,71,.15)}
.pdfpro-pg-thumb .pdfpro-pg-del{position:absolute;top:3px;right:3px;background:rgba(220,38,38,.9);border:none;border-radius:5px;width:20px;height:20px;color:#fff;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s}
.pdfpro-pg-thumb:hover .pdfpro-pg-del{opacity:1}
.pdfpro-pg-thumb.drag-top{border-top:3px solid #e8ff47}
.pdfpro-pg-thumb.drag-bot{border-bottom:3px solid #e8ff47}
.pdfpro-merge-card{background:#1a1a1e;border:2px dashed #252528;border-radius:16px;transition:all .18s;cursor:pointer}
.pdfpro-merge-card:hover,.pdfpro-merge-card.over{border-color:#e8ff47;background:rgba(232,255,71,.03)}
.pdfpro-merge-item{background:#1e1e22;border:1px solid #252528;border-radius:12px;display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:grab;transition:border .15s}
.pdfpro-merge-item:hover{border-color:#404048}
.pdfpro-merge-item.dragging{opacity:.4}
.pdfpro-merge-item.drag-over{border-top:2px solid #e8ff47}
.pdfpro-style-toggle{background:#1a1a1e;border:1px solid #252528;border-radius:12px;padding:.5rem;font-size:.75rem;font-weight:700;cursor:pointer;transition:all .15s;color:#aaa;flex:1}
.pdfpro-style-toggle.active{background:rgba(232,255,71,.1);border-color:#e8ff47;color:#e8ff47}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:#0d0d0f}
::-webkit-scrollbar-thumb{background:#252528;border-radius:3px}
`;

/* ─── component ─── */
const pdfSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Free PDF Tools - Merge, Edit & Compress",
  "operatingSystem": "All (Web-based)",
  "applicationCategory": "BusinessApplication",
  "description": "Secure, browser-based PDF tools to merge, split, edit, watermark, and compress PDF documents without uploading files to any server.",
  "publisher": {
    "@type": "Organization",
    "name": "Swag Solutions"
  },
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD"
  }
};

export default function PDFPro() {

  /* state */
  const [phase, setPhase] = useState("upload"); // upload | workspace
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [fileName, setFileName] = useState("");
  const [fileInfo, setFileInfo] = useState("");
  const [err, setErr] = useState("");

  /* editor */
  const [editorPage, setEditorPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [edText, setEdText] = useState("Your Text");
  const [edFontSize, setEdFontSize] = useState(22);
  const [edColor, setEdColor] = useState("#000000");
  const [edWeight, setEdWeight] = useState("400");
  const [edFontFamily, setEdFontFamily] = useState("'DM Sans',sans-serif");
  const [styleItalic, setStyleItalic] = useState(false);
  const [styleUnderline, setStyleUnderline] = useState(false);
  const [edSuccess, setEdSuccess] = useState(false);
  const [imgLabelTxt, setImgLabelTxt] = useState("Drop or click — PNG / JPG");

  /* brush & draw states */
  const [isBrushMode, setIsBrushMode] = useState(false);
  const [brushColor, setBrushColor] = useState("#e8ff47");
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [isEyedropperActive, setIsEyedropperActive] = useState(false);

  /* compress */
  const [compLevel, setCompLevel] = useState("medium");
  const [compLoading, setCompLoading] = useState(false);
  const [compResult, setCompResult] = useState(null); // {orig,newSize,saved}
  const [compProgAnim, setCompProgAnim] = useState(false);

  /* watermark */
  const [wmText, setWmText] = useState("CONFIDENTIAL");
  const [wmSize, setWmSize] = useState(48);
  const [wmColor, setWmColor] = useState("#ff0000");
  const [wmOpacity, setWmOpacity] = useState(30);
  const [wmRotate, setWmRotate] = useState(-45);
  const [wmPages, setWmPages] = useState("all");
  const [wmOk, setWmOk] = useState(false);

  /* pages */
  const [pageOrder, setPageOrder] = useState([]);
  const [selPages, setSelPages] = useState(new Set());
  const [pgOk, setPgOk] = useState(false);

  /* merge */
  const [mergeFiles, setMergeFiles] = useState([]);
  const [mergeLoading, setMergeLoading] = useState(false);
  const [mergeResult, setMergeResult] = useState(null); // {info, bytes}
  const [mergeDragSrc, setMergeDragSrc] = useState(null);
  const [mergeOver, setMergeOver] = useState(false);

  /* refs — mutable data that must NOT trigger re-renders */
  const origBytesRef = useRef(null);
  const workBytesRef = useRef(null);
  const compressedBytesRef = useRef(null);
  const origFileRef = useRef(null);
  const pdfjsDocRef = useRef(null);
  const annotationsRef = useRef({}); // { [page]: [{type,el,data}] }
  const selectedAnnotRef = useRef(null);
  const dragSrcPgRef = useRef(null);
  const edImgFileRef = useRef(null);
  const pdfCanvasRef = useRef(null);
  const annotLayerRef = useRef(null);
  const wmCanvasRef = useRef(null);
  const pageThumbCanvasRefs = useRef({});
  const editorPageRef = useRef(1);
  const totalPagesRef = useRef(0);
  const workBytesStateRef = useRef(null); // mirrors workBytesRef for async closures
  const drawingCanvasRef = useRef(null);
  const drawingsRef = useRef({}); // { [page]: dataUrl }
  const isDrawingRef = useRef(false);

  /* inject styles once */
  useEffect(() => {
    if (!document.getElementById("pdfpro-styles")) {
      const s = document.createElement("style");
      s.id = "pdfpro-styles";
      s.textContent = STYLE;
      document.head.appendChild(s);
    }
    
    const checkScripts = () => {
      if (window.pdfjsLib && window.PDFLib) {
        setTimeout(() => setScriptsLoaded(true), 0);
      }
    };

    /* load external libs if not already present */
    if (window.pdfjsLib && window.PDFLib) {
      setTimeout(() => setScriptsLoaded(true), 0);
    } else {
      if (!window.pdfjsLib) {
        const s1 = document.createElement("script");
        s1.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        s1.onload = checkScripts;
        document.head.appendChild(s1);
      }
      if (!window.PDFLib) {
        const s2 = document.createElement("script");
        s2.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
        s2.onload = checkScripts;
        document.head.appendChild(s2);
      }
      const timer = setInterval(() => {
        if (window.pdfjsLib && window.PDFLib) {
          setScriptsLoaded(true);
          clearInterval(timer);
        }
      }, 200);
      return () => clearInterval(timer);
    }
  }, []);

  /* keep refs in sync */
  useEffect(() => { editorPageRef.current = editorPage; }, [editorPage]);
  useEffect(() => { totalPagesRef.current = totalPages; }, [totalPages]);

  /* ── load PDF ── */
  const loadPDF = async (file) => {
    setErr("");
    origFileRef.current = file;
    const ab = await file.arrayBuffer();
    origBytesRef.current = new Uint8Array(ab);
    workBytesRef.current = origBytesRef.current.slice(0);
    workBytesStateRef.current = workBytesRef.current;
    const pdfjsLib = window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    pdfjsDocRef.current = await pdfjsLib.getDocument({ data: workBytesRef.current.slice(0) }).promise;
    const tp = pdfjsDocRef.current.numPages;
    setTotalPages(tp);
    totalPagesRef.current = tp;
    const order = Array.from({ length: tp }, (_, i) => i + 1);
    setPageOrder(order);
    annotationsRef.current = {};
    setEditorPage(1);
    editorPageRef.current = 1;
    setFileName(file.name);
    setFileInfo(fmt(file.size) + " · " + tp + " page" + (tp > 1 ? "s" : ""));
    setMergeFiles([{ name: file.name, bytes: origBytesRef.current.slice(0) }]);
    setPhase("workspace");
    setActiveTab("edit");
  };

  /* render editor page */
  const renderEditorPage = useCallback(async (pageNum) => {
    const pg = pageNum ?? editorPageRef.current;
    const canvas = pdfCanvasRef.current;
    const layer = annotLayerRef.current;
    const dCanvas = drawingCanvasRef.current;
    if (!canvas || !layer || !workBytesRef.current) return;
    try {
      const pdfjsLib = window.pdfjsLib;
      const doc = await pdfjsLib.getDocument({ data: workBytesRef.current.slice(0) }).promise;
      const page = await doc.getPage(pg);
      const vp = page.getViewport({ scale: 1.5 });
      canvas.width = vp.width; canvas.height = vp.height;
      canvas.style.width = vp.width + "px"; canvas.style.height = vp.height + "px";
      layer.style.width = vp.width + "px"; layer.style.height = vp.height + "px";

      if (dCanvas) {
        dCanvas.width = vp.width;
        dCanvas.height = vp.height;
        dCanvas.style.width = vp.width + "px";
        dCanvas.style.height = vp.height + "px";
        const dCtx = dCanvas.getContext("2d");
        dCtx.clearRect(0, 0, dCanvas.width, dCanvas.height);
        const savedDrawing = drawingsRef.current[pg];
        if (savedDrawing) {
          const img = new Image();
          img.onload = () => {
            dCtx.drawImage(img, 0, 0);
          };
          img.src = savedDrawing;
        }
      }

      await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
    } catch (e) { console.error(e); }
    layer.innerHTML = "";
    const annots = annotationsRef.current[pg] || [];
    annots.forEach((a) => layer.appendChild(a.el));
  }, []);

  /* render editor page when tab switches to edit or page changes */
  useEffect(() => {
    if (phase === "workspace" && activeTab === "edit") {
      renderEditorPage(editorPage);
    }
  }, [phase, activeTab, editorPage, renderEditorPage]);

  /* render WM preview */
  const renderWMPreview = useCallback(async () => {
    const c = wmCanvasRef.current;
    if (!c || !workBytesRef.current) return;
    try {
      const pdfjsLib = window.pdfjsLib;
      const doc = await pdfjsLib.getDocument({ data: workBytesRef.current.slice(0) }).promise;
      const pg = await doc.getPage(1);
      const vp = pg.getViewport({ scale: 1.2 });
      c.width = vp.width; c.height = vp.height;
      await pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    } catch (error) {
      console.warn("Unable to render watermark preview", error);
    }
  }, []);

  useEffect(() => {
    if (phase === "workspace" && activeTab === "watermark") renderWMPreview();
  }, [phase, activeTab, renderWMPreview]);

  /* render pages grid thumbnails */
  const renderThumb = useCallback(async (idx, origPg, bytes) => {
    try {
      const pdfjsLib = window.pdfjsLib;
      const doc = await pdfjsLib.getDocument({ data: (bytes || workBytesRef.current).slice(0) }).promise;
      const pg = await doc.getPage(origPg);
      const vp = pg.getViewport({ scale: 0.3 });
      const c = pageThumbCanvasRefs.current[idx];
      if (!c) return;
      c.width = vp.width; c.height = vp.height;
      await pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise;
    } catch (error) {
      console.warn("Unable to render page thumbnail", error);
    }
  }, []);

  useEffect(() => {
    if (phase === "workspace" && activeTab === "pages") {
      pageOrder.forEach((origPg, idx) => {
        setTimeout(() => renderThumb(idx, origPg), 50 * idx);
      });
    }
  }, [phase, activeTab, pageOrder, renderThumb]);

  /* ── annotation helpers ── */
  const selectAnnot = (el) => {
    if (selectedAnnotRef.current) selectedAnnotRef.current.classList.remove("selected");
    selectedAnnotRef.current = el;
    el.classList.add("selected");
  };
  const deselectAnnot = () => {
    if (selectedAnnotRef.current) { selectedAnnotRef.current.classList.remove("selected"); selectedAnnotRef.current = null; }
  };
  const removeAnnot = (el) => {
    const pg = editorPageRef.current;
    annotationsRef.current[pg] = (annotationsRef.current[pg] || []).filter((a) => a.el !== el);
    el.remove();
    selectedAnnotRef.current = null;
  };

  const makeDraggable = (el) => {
    el.addEventListener("mousedown", (e) => {
      if (e.target.classList.contains("pdfpro-resize-dot") || e.target.classList.contains("pdfpro-del-x") || e.target.getAttribute("contenteditable") === "true") return;
      e.preventDefault();
      selectAnnot(el);
      let ox = parseInt(el.style.left) || 0, oy = parseInt(el.style.top) || 0, sx = e.clientX, sy = e.clientY;
      const mm = (ev) => { el.style.left = (ox + ev.clientX - sx) + "px"; el.style.top = (oy + ev.clientY - sy) + "px"; };
      const mu = () => { document.removeEventListener("mousemove", mm); document.removeEventListener("mouseup", mu); };
      document.addEventListener("mousemove", mm); document.addEventListener("mouseup", mu);
    });
  };

  const makeResizable = (el) => {
    const dot = el.querySelector(".pdfpro-resize-dot");
    if (!dot) return;
    dot.addEventListener("mousedown", (e) => {
      e.stopPropagation(); e.preventDefault();
      const sw = el.offsetWidth, sh = el.offsetHeight, sx = e.clientX, sy = e.clientY;
      const mm = (ev) => { el.style.width = Math.max(30, sw + ev.clientX - sx) + "px"; el.style.height = Math.max(16, sh + ev.clientY - sy) + "px"; };
      const mu = () => { document.removeEventListener("mousemove", mm); document.removeEventListener("mouseup", mu); };
      document.addEventListener("mousemove", mm); document.addEventListener("mouseup", mu);
    });
  };

  const addTextAnnot = () => {
    const text = edText || "Your Text";
    const size = edFontSize || 22;
    const color = edColor;
    const weight = edWeight;
    const fontFamily = edFontFamily;
    const italic = styleItalic;
    const underline = styleUnderline;
    const canvas = pdfCanvasRef.current;
    const layer = annotLayerRef.current;
    if (!canvas || !layer) return;
    const cx = Math.max(20, canvas.width / 2 - 80), cy = Math.max(20, canvas.height / 2 - size / 2);
    const el = document.createElement("div");
    el.className = "pdfpro-annot";
    el.style.cssText = `left:${cx}px;top:${cy}px;min-width:40px;min-height:${size + 10}px;padding:3px 5px`;
    const txtStyle = `font-size:${size}px;color:${color};font-weight:${weight};font-family:${fontFamily};font-style:${italic ? "italic" : "normal"};text-decoration:${underline ? "underline" : "none"}`;
    el.innerHTML = `<div class="pdfpro-annot-border"></div><button class="pdfpro-del-x">×</button><div contenteditable="false" class="pdfpro-annot-text-content" style="${txtStyle}">${escHtml(text)}</div><div class="pdfpro-resize-dot"></div>`;
    el.querySelector(".pdfpro-del-x").addEventListener("click", (e) => { e.stopPropagation(); removeAnnot(el); });
    makeDraggable(el); makeResizable(el);
    layer.appendChild(el);
    const pg = editorPageRef.current;
    if (!annotationsRef.current[pg]) annotationsRef.current[pg] = [];
    annotationsRef.current[pg].push({ type: "text", el, data: { text, size, color, weight, fontFamily, italic, underline } });
    selectAnnot(el);
  };

  const addImageAnnot = () => {
    const file = edImgFileRef.current?.files[0];
    if (!file) { alert("Please pick an image first."); return; }
    const iw = parseInt(document.getElementById("pdfpro-ed-imgw")?.value) || 160;
    const ih = parseInt(document.getElementById("pdfpro-ed-imgh")?.value) || 120;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target.result;
      const canvas = pdfCanvasRef.current;
      const layer = annotLayerRef.current;
      if (!canvas || !layer) return;
      const cx = Math.max(0, canvas.width / 2 - iw / 2), cy = Math.max(0, canvas.height / 2 - ih / 2);
      const el = document.createElement("div");
      el.className = "pdfpro-annot";
      el.style.cssText = `left:${cx}px;top:${cy}px;width:${iw}px;height:${ih}px`;
      el.innerHTML = `<div class="pdfpro-annot-border"></div><button class="pdfpro-del-x">×</button><img src="${src}" draggable="false"><div class="pdfpro-resize-dot"></div>`;
      el.querySelector(".pdfpro-del-x").addEventListener("click", (e) => { e.stopPropagation(); removeAnnot(el); });
      makeDraggable(el); makeResizable(el);
      layer.appendChild(el);
      const pg = editorPageRef.current;
      if (!annotationsRef.current[pg]) annotationsRef.current[pg] = [];
      annotationsRef.current[pg].push({ type: "image", el, data: { src, w: iw, h: ih } });
      selectAnnot(el);
    };
    reader.readAsDataURL(file);
  };

  const bakeAnnotations = async () => {
    const PDFLib = window.PDFLib;
    const pdfjsLib = window.pdfjsLib;
    try {
      const pdfDoc = await PDFLib.PDFDocument.load(workBytesRef.current.slice(0), { ignoreEncryption: true });
      const canvas = pdfCanvasRef.current;
      const cw = canvas.width, ch = canvas.height;

      // Find all page indices with either annotations or drawings
      const pageKeys = new Set([
        ...Object.keys(annotationsRef.current),
        ...Object.keys(drawingsRef.current)
      ]);

      for (const pgStr of pageKeys) {
        const pgNum = parseInt(pgStr);
        const page = pdfDoc.getPages()[pgNum - 1];
        const { width, height } = page.getSize();

        // 1. Bake drawing overlay if it exists
        const savedDrawing = drawingsRef.current[pgNum];
        if (savedDrawing) {
          const b64 = savedDrawing.split(",")[1];
          const imgBytes = base64ToBytes(b64);
          const emb = await pdfDoc.embedPng(imgBytes);
          page.drawImage(emb, { x: 0, y: 0, width, height });
        }

        // 2. Bake overlay annotations (text/images)
        const annots = annotationsRef.current[pgNum] || [];
        const rx = width / cw, ry = height / ch;
        for (const a of annots) {
          const x = parseInt(a.el.style.left) || 0;
          const y = parseInt(a.el.style.top) || 0;
          const pdfX = x * rx, pdfY = height - y * ry;
          if (a.type === "text") {
            const tc = a.el.querySelector(".pdfpro-annot-text-content");
            const txt = tc ? tc.innerText : a.data.text;
            const rgb = hexToRgb(a.data.color);
            const sz = Math.max(4, a.data.size * ry);
            page.drawText(txt, { x: pdfX, y: pdfY - sz, size: sz, color: PDFLib.rgb(rgb.r / 255, rgb.g / 255, rgb.b / 255), lineHeight: sz * 1.3 });
          } else if (a.type === "image") {
            const ew = a.el.offsetWidth, eh = a.el.offsetHeight;
            const b64 = a.data.src.split(",")[1];
            const imgBytes = base64ToBytes(b64);
            let emb;
            try { emb = await pdfDoc.embedPng(imgBytes); } catch { try { emb = await pdfDoc.embedJpg(imgBytes); } catch { continue; } }
            page.drawImage(emb, { x: pdfX, y: pdfY - eh * ry, width: ew * rx, height: eh * ry });
          }
        }
      }
      workBytesRef.current = await pdfDoc.save();
      workBytesStateRef.current = workBytesRef.current;
      annotationsRef.current = {};
      drawingsRef.current = {};
      pdfjsDocRef.current = await pdfjsLib.getDocument({ data: workBytesRef.current.slice(0) }).promise;
      renderEditorPage(editorPageRef.current);
      setEdSuccess(true);
      setTimeout(() => setEdSuccess(false), 3000);
    } catch (e) { console.error(e); alert("Bake error: " + e.message); }
  };

  const clearAnnotations = () => {
    annotationsRef.current[editorPageRef.current] = [];
    if (annotLayerRef.current) annotLayerRef.current.innerHTML = "";
  };

  /* ── compress ── */
  const doCompress = async () => {
    const PDFLib = window.PDFLib;
    const pdfjsLib = window.pdfjsLib;
    setCompLoading(true); setCompResult(null); setCompProgAnim(true);
    try {
      const pdfDoc = await PDFLib.PDFDocument.load(workBytesRef.current.slice(0), { ignoreEncryption: true });
      const q = qualityMap[compLevel], sc = scaleMap[compLevel];
      const pages = pdfDoc.getPages();
      const pdfjsD = await pdfjsLib.getDocument({ data: workBytesRef.current.slice(0) }).promise;
      for (let i = 0; i < pages.length; i++) {
        const pg = pages[i]; const { width, height } = pg.getSize();
        const pdfjsPg = await pdfjsD.getPage(i + 1);
        const vp = pdfjsPg.getViewport({ scale: sc });
        const cv = document.createElement("canvas"); cv.width = Math.floor(vp.width); cv.height = Math.floor(vp.height);
        await pdfjsPg.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise;
        const jpg = await pdfDoc.embedJpg(base64ToBytes(cv.toDataURL("image/jpeg", q).split(",")[1]));
        pg.drawImage(jpg, { x: 0, y: 0, width, height });
      }
      compressedBytesRef.current = await pdfDoc.save({ useObjectStreams: true });
      await sleep(300);
      const ns = compressedBytesRef.current.byteLength, os = origFileRef.current.size;
      setCompResult({ orig: fmt(os), newSize: fmt(ns), saved: Math.max(0, Math.round((1 - ns / os) * 100)) + "%" });
    } catch (e) { alert("Compress error: " + e.message); }
    setCompLoading(false); setCompProgAnim(false);
  };

  /* ── watermark ── */
  const applyWatermark = async () => {
    const PDFLib = window.PDFLib;
    const text = wmText.trim();
    if (!text) { alert("Enter text."); return; }
    try {
      const pdfDoc = await PDFLib.PDFDocument.load(workBytesRef.current.slice(0), { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      const rgb = hexToRgb(wmColor);
      const opacity = wmOpacity / 100;
      let targets = pages;
      if (wmPages === "first") targets = [pages[0]];
      if (wmPages === "last") targets = [pages[pages.length - 1]];
      for (const page of targets) {
        const { width, height } = page.getSize();
        page.drawText(text, { x: width / 2 - (text.length * wmSize * 0.28), y: height / 2, size: wmSize, color: PDFLib.rgb(rgb.r / 255, rgb.g / 255, rgb.b / 255), opacity, rotate: PDFLib.degrees(wmRotate) });
      }
      workBytesRef.current = await pdfDoc.save();
      workBytesStateRef.current = workBytesRef.current;
      setWmOk(true); setTimeout(() => setWmOk(false), 3000);
      renderWMPreview();
    } catch (e) { alert("Watermark error: " + e.message); }
  };

  /* ── pages ── */
  const savePagesEdit = async () => {
    const PDFLib = window.PDFLib;
    const pdfjsLib = window.pdfjsLib;
    try {
      const pdfDoc = await PDFLib.PDFDocument.load(origBytesRef.current.slice(0), { ignoreEncryption: true });
      const newDoc = await PDFLib.PDFDocument.create();
      const copied = await newDoc.copyPages(pdfDoc, pageOrder.map((p) => p - 1));
      copied.forEach((pg) => newDoc.addPage(pg));
      workBytesRef.current = await newDoc.save();
      workBytesStateRef.current = workBytesRef.current;
      pdfjsDocRef.current = await pdfjsLib.getDocument({ data: workBytesRef.current.slice(0) }).promise;
      const tp = pdfjsDocRef.current.numPages;
      setTotalPages(tp); totalPagesRef.current = tp;
      const newOrder = Array.from({ length: tp }, (_, i) => i + 1);
      setPageOrder(newOrder);
      setSelPages(new Set());
      if (editorPageRef.current > tp) { setEditorPage(tp); editorPageRef.current = tp; }
      setFileInfo(fmt(workBytesRef.current.byteLength) + " · " + tp + " pages");
      setPgOk(true); setTimeout(() => setPgOk(false), 3000);
    } catch (e) { alert("Pages error: " + e.message); }
  };

  const reorderPg = (from, to, above) => {
    const arr = [...pageOrder];
    const [item] = arr.splice(from, 1);
    let ins = to > from ? to - 1 : to;
    if (!above) ins++;
    arr.splice(ins, 0, item);
    setPageOrder(arr);
    setSelPages(new Set());
  };

  /* ── merge ── */
  const doMerge = async () => {
    const PDFLib = window.PDFLib;
    if (mergeFiles.length < 2) { alert("Add at least 2 PDFs."); return; }
    setMergeLoading(true); setMergeResult(null);
    try {
      const merged = await PDFLib.PDFDocument.create(); let total = 0;
      for (const mf of mergeFiles) {
        const doc = await PDFLib.PDFDocument.load(mf.bytes.slice(0), { ignoreEncryption: true });
        const copied = await merged.copyPages(doc, doc.getPageIndices());
        copied.forEach((pg) => merged.addPage(pg)); total += doc.getPageCount();
      }
      const mergedBytes = await merged.save();
      setMergeResult({ info: `${mergeFiles.length} files · ${total} pages · ${fmt(mergedBytes.byteLength)}`, bytes: mergedBytes });
    } catch (e) { alert("Merge error: " + e.message); }
    setMergeLoading(false);
  };

  const downloadMerged = () => {
    if (!mergeResult?.bytes) return;
    const blob = new Blob([mergeResult.bytes], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "merged.pdf"; a.click();
  };

  /* ── download ── */
  const downloadPDF = (type) => {
    const bytes = type === "compressed" ? compressedBytesRef.current : workBytesRef.current;
    if (!bytes) { alert("Nothing to download."); return; }
    const blob = new Blob([bytes], { type: "application/pdf" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = (origFileRef.current?.name || "document").replace(/\.pdf$/i, "") + "_" + type + ".pdf";
    a.click();
  };

  /* ── reset ── */
  const resetAll = () => {
    origBytesRef.current = workBytesRef.current = compressedBytesRef.current = null;
    origFileRef.current = null; pdfjsDocRef.current = null;
    annotationsRef.current = {}; selectedAnnotRef.current = null;
    drawingsRef.current = {};
    setIsBrushMode(false);
    setIsEyedropperActive(false);
    setIsEraser(false);
    setPhase("upload"); setActiveTab("edit");
    setFileName(""); setFileInfo(""); setErr("");
    setEditorPage(1); setTotalPages(0);
    setPageOrder([]); setSelPages(new Set());
    setMergeFiles([]); setMergeResult(null);
    setCompResult(null); setCompLoading(false);
  };

  /* ── drawing & color picking handlers ── */
  const saveCurrentPageDrawing = () => {
    const dCanvas = drawingCanvasRef.current;
    if (!dCanvas) return;
    const dataUrl = dCanvas.toDataURL("image/png");
    drawingsRef.current[editorPageRef.current] = dataUrl;
  };

  const clearDrawingsOnPage = () => {
    const dCanvas = drawingCanvasRef.current;
    if (!dCanvas) return;
    const ctx = dCanvas.getContext("2d");
    ctx.clearRect(0, 0, dCanvas.width, dCanvas.height);
    delete drawingsRef.current[editorPageRef.current];
  };

  const pickColorFromPdf = (e) => {
    const canvas = pdfCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    try {
      const px = Math.min(Math.max(0, Math.floor(x)), canvas.width - 1);
      const py = Math.min(Math.max(0, Math.floor(y)), canvas.height - 1);
      const pixel = ctx.getImageData(px, py, 1, 1).data;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      setBrushColor(hex);
      setEdColor(hex);
      setIsEyedropperActive(false);
    } catch (err) {
      console.error("Error picking color:", err);
    }
  };

  const handleDrawingMouseDown = (e) => {
    if (isEyedropperActive) {
      pickColorFromPdf(e);
      return;
    }
    if (!isBrushMode) return;
    isDrawingRef.current = true;
    const dCanvas = drawingCanvasRef.current;
    if (!dCanvas) return;
    const ctx = dCanvas.getContext("2d");
    const rect = dCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (dCanvas.width / rect.width);
    const y = (e.clientY - rect.top) * (dCanvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = brushColor;
    }
  };

  const handleDrawingMouseMove = (e) => {
    if (!isDrawingRef.current || !isBrushMode) return;
    const dCanvas = drawingCanvasRef.current;
    if (!dCanvas) return;
    const ctx = dCanvas.getContext("2d");
    const rect = dCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (dCanvas.width / rect.width);
    const y = (e.clientY - rect.top) * (dCanvas.height / rect.height);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleDrawingMouseUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    saveCurrentPageDrawing();
  };

  const handleDrawingMouseLeave = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    saveCurrentPageDrawing();
  };

  /* ── file upload handler ── */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) loadPDF(f);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") loadPDF(f);
  };

  /* ══════════════════════════════════════════ RENDER ══════════════════════════════════════════ */
  return (
    <div className="pdfpro-root">
      <SEO 
        title="Free PDF Tools - Merge, Edit & Compress PDF Online" 
        description="Edit, merge, split, watermark, and compress PDF documents securely in your browser. Swag Solutions free PDF tools run 100% locally on your device." 
        keywords="free pdf tools, edit pdf online, merge pdf online, compress pdf browser, digital pdf tools sri lanka, watermark pdf online"
      />
      <SchemaMarkup schema={pdfSchema} />
      {/* ── HEADER ── */}
      <header className="max-w-6xl mx-auto px-5 pt-10 pb-5 text-center pdfpro-au">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#252528] bg-[#161619] text-[#606068] text-xs font-semibold uppercase tracking-widest mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff47] inline-block" />PDF Pro
        </div>
        <h1 style={{ fontFamily: "Syne,sans-serif", fontSize: "clamp(2rem,6vw,3.2rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.02em" }} className="mb-2">
          Compress, Edit <span className="text-[#e8ff47]">&amp;</span> Merge
        </h1>
        <p className="text-[#606068] text-sm max-w-sm mx-auto">100% browser-based. Nothing leaves your device.</p>
      </header>

      <main className="max-w-6xl mx-auto px-5 pb-24 space-y-4">

        {/* ── UPLOAD ── */}
        {phase === "upload" && (
          <div className="pdfpro-au" style={{ animationDelay: ".1s" }}>
            {!scriptsLoaded ? (
              <div className="border-2 border-dashed border-[#252528] rounded-[22px] p-10 text-center bg-[#161619]/30">
                <div className="w-14 h-14 rounded-2xl bg-[#1a1a1e] border border-[#252528] flex items-center justify-center mx-auto mb-4">
                  <Spinner />
                </div>
                <p style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1.05rem" }} className="mb-1 text-[#e8ff47]">Loading PDF Editor Engine...</p>
                <p className="text-[#606068] text-sm">Please wait while we initialize the secure browser environment.</p>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("pdfpro-pdf-input").click()}
                className="border-2 border-dashed border-[#252528] rounded-[22px] p-10 text-center cursor-pointer transition-all hover:border-[#e8ff47]/40 hover:bg-[#e8ff47]/[.02]"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1a1a1e] border border-[#252528] flex items-center justify-center mx-auto mb-4">
                  <PdfIcon />
                </div>
                <p style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1.05rem" }} className="mb-1">Drop your PDF here or click to browse</p>
                <p className="text-[#606068] text-sm">Single PDF to edit/compress — use Merge tab for multiple PDFs</p>
                <input type="file" id="pdfpro-pdf-input" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
              </div>
            )}
            {err && <p className="text-red-400 text-xs text-center mt-3 font-medium">{err}</p>}
          </div>
        )}

        {/* ── WORKSPACE ── */}
        {phase === "workspace" && (
          <div className="pdfpro-au">
            {/* File bar */}
            <div className="flex items-center justify-between bg-[#161619] border border-[#252528] rounded-2xl px-5 py-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-red-950 border border-red-900/30 flex items-center justify-center flex-shrink-0">
                  <PdfIcon cls="h-4 w-4 text-red-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{fileName}</p>
                  <p className="text-xs text-[#606068]">{fileInfo}</p>
                </div>
              </div>
              <button onClick={resetAll} className="text-[#606068] hover:text-red-400 transition-colors text-xs font-semibold ml-4 flex-shrink-0">✕ Close</button>
            </div>

            {/* TABS */}
            <div className="flex gap-0 border-b border-[#252528] mb-4 overflow-x-auto">
              {[["edit", "✏️ Visual Editor"], ["compress", "⚡ Compress"], ["watermark", "💧 Watermark"], ["pages", "📄 Pages"], ["merge", "🔗 Merge PDFs"]].map(([key, label]) => (
                <button key={key} className={`pdfpro-tab-btn${activeTab === key ? " active" : ""}`} onClick={() => setActiveTab(key)}>{label}</button>
              ))}
            </div>

            {/* ── VISUAL EDITOR ── */}
            {activeTab === "edit" && (
              <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
                {/* Toolbar */}
                <div className="pdfpro-glass p-4 space-y-5 lg:overflow-y-auto" style={{ maxHeight: "80vh" }}>
                  {/* Page nav */}
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-widest text-[#606068] block mb-2">Page</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { if (editorPage > 1) setEditorPage(p => p - 1); }} className="w-8 h-8 rounded-lg bg-[#1a1a1e] border border-[#252528] text-white text-sm hover:border-[#e8ff47] transition flex items-center justify-center">‹</button>
                      <span className="text-sm font-semibold flex-1 text-center text-white">Page {editorPage} / {totalPages}</span>
                      <button onClick={() => { if (editorPage < totalPages) setEditorPage(p => p + 1); }} className="w-8 h-8 rounded-lg bg-[#1a1a1e] border border-[#252528] text-white text-sm hover:border-[#e8ff47] transition flex items-center justify-center">›</button>
                    </div>
                  </div>

                  {/* Add Text */}
                  <div className="border-t border-[#252528] pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068] mb-3">✏️ Add Text</p>
                    <div className="space-y-2">
                      <input value={edText} onChange={e => setEdText(e.target.value)} type="text" className="pdfpro-inp" placeholder="Type your text…" />
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="text-[10px] text-[#606068] block mb-1">Size</label><input value={edFontSize} onChange={e => setEdFontSize(parseInt(e.target.value) || 22)} type="number" className="pdfpro-inp" min="6" max="200" /></div>
                        <div>
                          <label className="text-[10px] text-[#606068] block mb-1">Color</label>
                          <div className="flex gap-1">
                            <input value={edColor} onChange={e => { setEdColor(e.target.value); setBrushColor(e.target.value); }} type="color" className="pdfpro-inp flex-1" style={{ height: 36, padding: "3px 5px", cursor: "pointer" }} />
                            <button
                              onClick={() => {
                                setIsEyedropperActive(v => !v);
                              }}
                              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition flex-shrink-0 ${
                                isEyedropperActive
                                  ? "bg-[#e8ff47] border-[#e8ff47] text-black"
                                  : "bg-[#1a1a1e] border-[#252528] text-white hover:border-[#e8ff47]"
                              }`}
                              title="Pick color from PDF"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m2 22 1-1c.5-.5.5-1.3 0-1.8L13.5 8.7a2.5 2.5 0 1 1 3.5 3.5L6.5 22.7c-.5.5-1.3.5-1.8 0L3.8 21.8c-.5-.5-.5-1.3 0-1.8L12 11.5" />
                                <path d="m15 6 3-3" />
                                <path d="M19 3a2 2 0 1 1-3 3 2 2 0 0 1 3-3z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      {isEyedropperActive && (
                        <p className="text-[9px] text-[#e8ff47] text-center" style={{ animation: "pdfpro-pulse 1.5s infinite" }}>
                          🎯 Click anywhere on the PDF page to pick a color!
                        </p>
                      )}
                      <div>
                        <label className="text-[10px] text-[#606068] block mb-1">Font Family</label>
                        <select value={edFontFamily} onChange={e => setEdFontFamily(e.target.value)} className="pdfpro-inp">
                          <option value="'DM Sans',sans-serif">DM Sans (Default)</option>
                          <option value="'Roboto',sans-serif">Roboto</option>
                          <option value="'Montserrat',sans-serif">Montserrat</option>
                          <option value="'Oswald',sans-serif">Oswald</option>
                          <option value="'Playfair Display',serif">Playfair Display</option>
                          <option value="'Dancing Script',cursive">Dancing Script</option>
                          <option value="'Courier Prime',monospace">Courier Prime</option>
                          <option value="Georgia,serif">Georgia</option>
                          <option value="Arial,sans-serif">Arial</option>
                          <option value="'Times New Roman',serif">Times New Roman</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-[#606068] block mb-1">Weight</label>
                        <select value={edWeight} onChange={e => setEdWeight(e.target.value)} className="pdfpro-inp">
                          <option value="400">Normal</option><option value="600">Semi-Bold</option><option value="700">Bold</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setStyleItalic(v => !v)} className={`pdfpro-style-toggle${styleItalic ? " active" : ""}`} style={{ fontStyle: "italic" }}>I  Italic</button>
                        <button onClick={() => setStyleUnderline(v => !v)} className={`pdfpro-style-toggle${styleUnderline ? " active" : ""}`} style={{ textDecoration: "underline" }}>U  Underline</button>
                      </div>
                      <button onClick={addTextAnnot} className="w-full bg-[#e8ff47] text-black rounded-xl py-2.5 font-bold text-xs uppercase tracking-widest hover:bg-yellow-300 transition" style={{ fontFamily: "Syne,sans-serif" }}>+ Place Text</button>
                      <p className="text-[#606068] text-[10px] text-center leading-snug">Drag to reposition • Drag corner to resize</p>
                    </div>
                  </div>

                  {/* Add Image */}
                  <div className="border-t border-[#252528] pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068] mb-3">🖼 Add Image</p>
                    <div className="space-y-2">
                      <label className="block border-2 border-dashed border-[#252528] rounded-xl p-4 text-center cursor-pointer hover:border-[#e8ff47]/50 transition">
                        <svg className="h-6 w-6 text-[#e8ff47] mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-[11px] text-[#606068]">{imgLabelTxt}</span>
                        <input ref={edImgFileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => { if (e.target.files[0]) setImgLabelTxt(e.target.files[0].name); }} />
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="text-[10px] text-[#606068] block mb-1">Width</label><input id="pdfpro-ed-imgw" type="number" defaultValue="160" className="pdfpro-inp" /></div>
                        <div><label className="text-[10px] text-[#606068] block mb-1">Height</label><input id="pdfpro-ed-imgh" type="number" defaultValue="120" className="pdfpro-inp" /></div>
                      </div>
                      <button onClick={addImageAnnot} className="w-full bg-[#1a1a1e] border border-[#252528] text-white rounded-xl py-2.5 font-bold text-xs uppercase tracking-widest hover:border-[#e8ff47] hover:text-[#e8ff47] transition" style={{ fontFamily: "Syne,sans-serif" }}>+ Place Image</button>
                    </div>
                  </div>

                  {/* Brush / Draw Tool */}
                  <div className="border-t border-[#252528] pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068]">🖌️ Brush &amp; Draw</p>
                      <button
                        onClick={() => {
                          setIsBrushMode(v => !v);
                          if (!isBrushMode) {
                            setIsEyedropperActive(false);
                          }
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-widest transition ${
                          isBrushMode ? "bg-[#e8ff47] text-black" : "bg-[#1a1a1e] border border-[#252528] text-white"
                        }`}
                      >
                        {isBrushMode ? "ON" : "OFF"}
                      </button>
                    </div>

                    {isBrushMode && (
                      <div className="space-y-3 pdfpro-au">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setIsEraser(false)}
                            className={`pdfpro-style-toggle ${!isEraser ? "active" : ""}`}
                          >
                            🖌️ Draw
                          </button>
                          <button
                            onClick={() => setIsEraser(true)}
                            className={`pdfpro-style-toggle ${isEraser ? "active" : ""}`}
                          >
                            🧹 Eraser
                          </button>
                        </div>

                        {!isEraser && (
                          <div className="space-y-2">
                            <div>
                              <label className="text-[10px] text-[#606068] block mb-1">Color</label>
                              <div className="flex gap-1">
                                <input
                                  value={brushColor}
                                  onChange={e => {
                                    setBrushColor(e.target.value);
                                    setEdColor(e.target.value);
                                  }}
                                  type="color"
                                  className="pdfpro-inp flex-1"
                                  style={{ height: 36, padding: "3px 5px", cursor: "pointer" }}
                                />
                                <button
                                  onClick={() => setIsEyedropperActive(v => !v)}
                                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition flex-shrink-0 ${
                                    isEyedropperActive
                                      ? "bg-[#e8ff47] border-[#e8ff47] text-black"
                                      : "bg-[#1a1a1e] border-[#252528] text-white hover:border-[#e8ff47]"
                                  }`}
                                  title="Pick color from PDF"
                                >
                                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m2 22 1-1c.5-.5.5-1.3 0-1.8L13.5 8.7a2.5 2.5 0 1 1 3.5 3.5L6.5 22.7c-.5.5-1.3.5-1.8 0L3.8 21.8c-.5-.5-.5-1.3 0-1.8L12 11.5" />
                                    <path d="m15 6 3-3" />
                                    <path d="M19 3a2 2 0 1 1-3 3 2 2 0 0 1 3-3z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] text-[#606068] block mb-1">
                            Size: {brushSize}px
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="50"
                            value={brushSize}
                            onChange={e => setBrushSize(parseInt(e.target.value))}
                            className="w-full accent-[#e8ff47]"
                          />
                        </div>

                        <button
                          onClick={clearDrawingsOnPage}
                          className="w-full text-red-400 border border-red-950/40 bg-[#1a1a1e] hover:border-red-500 hover:text-red-400 transition rounded-xl py-2 font-bold text-xs uppercase tracking-widest"
                          style={{ fontFamily: "Syne,sans-serif" }}
                        >
                          Clear Drawings
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Apply */}
                  <div className="border-t border-[#252528] pt-4 space-y-2">
                    <button onClick={bakeAnnotations} className="w-full bg-white text-black rounded-xl py-3 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition" style={{ fontFamily: "Syne,sans-serif" }}>✓ Apply Edits to PDF</button>
                    <button onClick={clearAnnotations} className="w-full text-[#606068] text-xs font-semibold hover:text-red-400 transition py-1">Clear all overlays</button>
                    {edSuccess && <div className="text-[#e8ff47] text-[11px] text-center font-semibold">✓ Edits baked in! Download below.</div>}
                  </div>
                </div>

                {/* Canvas */}
                <div className="pdfpro-glass p-4 flex flex-col">
                  <div className="overflow-auto rounded-xl bg-[#111113] flex items-start justify-center p-3" style={{ minHeight: 520 }}>
                    <div style={{ position: "relative", display: "inline-block", cursor: "default", userSelect: "none" }}>
                      <canvas ref={pdfCanvasRef} style={{ display: "block" }} />
                      <canvas
                        ref={drawingCanvasRef}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          pointerEvents: (isBrushMode || isEyedropperActive) ? "auto" : "none",
                          cursor: isEyedropperActive ? "cell" : (isBrushMode ? "crosshair" : "default"),
                          zIndex: (isBrushMode || isEyedropperActive) ? 30 : 10
                        }}
                        onMouseDown={handleDrawingMouseDown}
                        onMouseMove={handleDrawingMouseMove}
                        onMouseUp={handleDrawingMouseUp}
                        onMouseLeave={handleDrawingMouseLeave}
                      />
                      <div
                        ref={annotLayerRef}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}
                        onMouseDown={(e) => { const a = e.target.closest(".pdfpro-annot"); if (a) selectAnnot(a); else deselectAnnot(); }}
                      />
                    </div>
                  </div>
                  <p className="text-[#606068] text-[10px] mt-2 text-center">Click to select • Drag to move • Drag ▪ corner to resize • × to delete</p>
                </div>
              </div>
            )}

            {/* ── COMPRESS ── */}
            {activeTab === "compress" && (
              <div>
                <div className="pdfpro-glass p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068] mb-4">Compression Level</p>
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[["low", "Low", "~80% quality"], ["medium", "Medium", "~50% quality"], ["high", "High", "~25% quality"]].map(([key, label, sub]) => (
                      <button key={key} className={`pdfpro-level-btn${compLevel === key ? " active" : ""}`} onClick={() => setCompLevel(key)}>
                        {label}<br /><span style={{ fontSize: 10, opacity: .6, textTransform: "none", fontWeight: 400, letterSpacing: 0, fontFamily: "'DM Sans'" }}>{sub}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={doCompress} className="w-full bg-[#e8ff47] text-black rounded-xl py-4 font-bold text-sm uppercase tracking-widest hover:bg-yellow-300 transition" style={{ fontFamily: "Syne,sans-serif" }}>⚡ Compress PDF</button>
                </div>
                {compLoading && (
                  <div className="pdfpro-glass p-8 text-center mt-4">
                    <Spinner />
                    <p style={{ fontFamily: "Syne,sans-serif", fontWeight: 700 }} className="mb-2 mt-3">Compressing…</p>
                    <div className="w-full max-w-xs mx-auto bg-[#0d0d0f] rounded-full h-1.5 overflow-hidden">
                      <div className={`h-1.5 bg-[#e8ff47] rounded-full ${compProgAnim ? "pdfpro-prog-anim" : ""}`} style={{ width: compProgAnim ? undefined : 0 }} />
                    </div>
                  </div>
                )}
                {compResult && (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="pdfpro-glass p-4 text-center rounded-2xl"><p className="text-[#606068] text-[10px] uppercase tracking-widest mb-1">Original</p><p style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1.15rem" }}>{compResult.orig}</p></div>
                      <div className="p-4 text-center rounded-2xl" style={{ background: "rgba(232,255,71,.05)", border: "1px solid rgba(232,255,71,.2)" }}><p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(232,255,71,.7)" }}>Saved</p><p style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "#e8ff47" }}>{compResult.saved}</p></div>
                      <div className="pdfpro-glass p-4 text-center rounded-2xl"><p className="text-[#606068] text-[10px] uppercase tracking-widest mb-1">New Size</p><p style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1.15rem" }}>{compResult.newSize}</p></div>
                    </div>
                    <button onClick={() => downloadPDF("compressed")} className="w-full bg-white text-black rounded-xl py-4 font-bold text-sm uppercase tracking-widest hover:bg-gray-100 transition" style={{ fontFamily: "Syne,sans-serif" }}>⬇ Download Compressed PDF</button>
                  </div>
                )}
              </div>
            )}

            {/* ── WATERMARK ── */}
            {activeTab === "watermark" && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="pdfpro-glass p-5 space-y-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068]">Watermark Settings</p>
                  <div><label className="text-[10px] text-[#606068] block mb-1">Text</label><input value={wmText} onChange={e => setWmText(e.target.value)} type="text" className="pdfpro-inp" /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-[10px] text-[#606068] block mb-1">Size</label><input value={wmSize} onChange={e => setWmSize(parseInt(e.target.value) || 48)} type="number" className="pdfpro-inp" min="12" /></div>
                    <div><label className="text-[10px] text-[#606068] block mb-1">Color</label><input value={wmColor} onChange={e => setWmColor(e.target.value)} type="color" className="pdfpro-inp" style={{ height: 36, padding: "3px 5px", cursor: "pointer" }} /></div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#606068] block mb-1">Opacity: {wmOpacity}%</label>
                    <input value={wmOpacity} onChange={e => setWmOpacity(parseInt(e.target.value))} type="range" min="5" max="100" className="w-full accent-[#e8ff47]" />
                  </div>
                  <div><label className="text-[10px] text-[#606068] block mb-1">Rotation (°)</label><input value={wmRotate} onChange={e => setWmRotate(parseInt(e.target.value) || 0)} type="number" className="pdfpro-inp" min="-180" max="180" /></div>
                  <div><label className="text-[10px] text-[#606068] block mb-1">Apply to</label>
                    <select value={wmPages} onChange={e => setWmPages(e.target.value)} className="pdfpro-inp">
                      <option value="all">All Pages</option><option value="first">First Page Only</option><option value="last">Last Page Only</option>
                    </select>
                  </div>
                  <button onClick={applyWatermark} className="w-full bg-[#e8ff47] text-black rounded-xl py-3 font-bold text-xs uppercase tracking-widest hover:bg-yellow-300 transition" style={{ fontFamily: "Syne,sans-serif" }}>Apply Watermark</button>
                  {wmOk && <div className="text-[#e8ff47] text-[11px] text-center font-semibold">✓ Applied!</div>}
                </div>
                <div className="pdfpro-glass p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068] mb-3">Preview (Page 1)</p>
                  <div className="rounded-xl overflow-auto bg-[#111113]" style={{ maxHeight: 420 }}><canvas ref={wmCanvasRef} style={{ display: "block", width: "100%" }} /></div>
                </div>
              </div>
            )}

            {/* ── PAGES ── */}
            {activeTab === "pages" && (
              <div className="pdfpro-glass p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068]">Pages — {pageOrder.length} pages</p>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => { const arr = [...pageOrder]; [...selPages].sort((a, b) => b - a).forEach(i => arr.splice(i, 1)); setPageOrder(arr); setSelPages(new Set()); }} className="text-[11px] px-3 py-1.5 bg-red-950 border border-red-900/40 text-red-400 rounded-lg font-semibold hover:bg-red-900/30 transition">🗑 Delete Selected</button>
                    <button onClick={() => setSelPages(new Set(pageOrder.map((_, i) => i)))} className="text-[11px] px-3 py-1.5 bg-[#1a1a1e] border border-[#252528] text-[#aaa] rounded-lg font-semibold hover:border-[#e8ff47] hover:text-[#e8ff47] transition">Select All</button>
                    <button onClick={() => setSelPages(new Set())} className="text-[11px] px-3 py-1.5 bg-[#1a1a1e] border border-[#252528] text-[#aaa] rounded-lg font-semibold hover:border-[#e8ff47] hover:text-[#e8ff47] transition">Deselect</button>
                  </div>
                </div>
                <p className="text-[#606068] text-[10px] mb-4">Click to select • Drag to reorder</p>
                <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))" }}>
                  {pageOrder.map((origPg, idx) => (
                    <div
                      key={idx}
                      className={`pdfpro-pg-thumb${selPages.has(idx) ? " selected" : ""}`}
                      draggable
                      onClick={() => {
                        setSelPages(prev => {
                          const n = new Set(prev);
                          if (n.has(idx)) n.delete(idx); else n.add(idx);
                          return n;
                        });
                      }}
                      onDragStart={() => { dragSrcPgRef.current = idx; }}
                      onDragOver={(e) => { e.preventDefault(); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const from = dragSrcPgRef.current;
                        if (from !== idx) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const above = e.clientY < rect.top + rect.height / 2;
                          reorderPg(from, idx, above);
                        }
                      }}
                    >
                      <button className="pdfpro-pg-del" onClick={(e) => { e.stopPropagation(); setPageOrder(arr => { const n = [...arr]; n.splice(idx, 1); return n; }); setSelPages(new Set()); }}>×</button>
                      <canvas ref={el => { if (el) pageThumbCanvasRefs.current[idx] = el; }} style={{ width: "100%", display: "block", borderRadius: "8px 8px 0 0" }} />
                      <div style={{ textAlign: "center", padding: "5px 4px", fontSize: 11, color: "#606068", fontWeight: 600 }}>Page {idx + 1}</div>
                    </div>
                  ))}
                </div>
                <button onClick={savePagesEdit} className="mt-4 w-full bg-[#e8ff47] text-black rounded-xl py-3 font-bold text-sm uppercase tracking-widest hover:bg-yellow-300 transition" style={{ fontFamily: "Syne,sans-serif" }}>✓ Apply Page Changes</button>
                {pgOk && <div className="text-[#e8ff47] text-[11px] text-center mt-2 font-semibold">✓ Pages updated!</div>}
              </div>
            )}

            {/* ── MERGE ── */}
            {activeTab === "merge" && (
              <div className="pdfpro-glass p-5 space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#606068]">Merge Multiple PDFs into One</p>
                <div
                  className={`pdfpro-merge-card p-7 text-center${mergeOver ? " over" : ""}`}
                  onClick={() => document.getElementById("pdfpro-merge-input").click()}
                  onDragOver={(e) => { e.preventDefault(); setMergeOver(true); }}
                  onDragLeave={() => setMergeOver(false)}
                  onDrop={async (e) => {
                    e.preventDefault(); setMergeOver(false);
                    const files = [...e.dataTransfer.files].filter(f => f.type === "application/pdf");
                    const newFiles = await Promise.all(files.map(async f => { const ab = await f.arrayBuffer(); return { name: f.name, bytes: new Uint8Array(ab) }; }));
                    setMergeFiles(prev => [...prev, ...newFiles]);
                  }}
                >
                  <svg className="h-7 w-7 text-[#e8ff47] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <p className="font-semibold text-sm mb-0.5">Add more PDFs</p>
                  <p className="text-[#606068] text-xs">Click or drop PDF files here — current file already added</p>
                  <input
                    id="pdfpro-merge-input" type="file" accept=".pdf,application/pdf" multiple className="hidden"
                    onChange={async (e) => {
                      const files = [...e.target.files];
                      const newFiles = await Promise.all(files.map(async f => { const ab = await f.arrayBuffer(); return { name: f.name, bytes: new Uint8Array(ab) }; }));
                      setMergeFiles(prev => [...prev, ...newFiles]);
                      e.target.value = "";
                    }}
                  />
                </div>
                <div className="space-y-2">
                  {mergeFiles.map((mf, i) => (
                    <div key={i} className="pdfpro-merge-item" draggable
                      onDragStart={() => setMergeDragSrc(i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (mergeDragSrc !== i) {
                          setMergeFiles(prev => {
                            const arr = [...prev];
                            const [item] = arr.splice(mergeDragSrc, 1);
                            arr.splice(i, 0, item);
                            return arr;
                          });
                        }
                      }}
                    >
                      <span style={{ color: "#606068", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <PdfIcon cls="h-4 w-4 text-[#e8ff47] flex-shrink-0" />
                      <span style={{ fontSize: 13, fontWeight: 500, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mf.name}</span>
                      <span style={{ fontSize: 11, color: "#606068", flexShrink: 0 }}>{fmt(mf.bytes.byteLength)}</span>
                      {i === 0 && <span style={{ fontSize: 10, background: "rgba(232,255,71,.1)", border: "1px solid rgba(232,255,71,.25)", color: "#e8ff47", borderRadius: 6, padding: "1px 7px", fontWeight: 700, flexShrink: 0 }}>Current</span>}
                      <button onClick={() => setMergeFiles(prev => prev.filter((_, j) => j !== i))} style={{ color: "#606068", background: "none", border: "none", cursor: "pointer", fontSize: 16, flexShrink: 0, padding: "0 2px" }}>×</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={doMerge} className="flex-1 bg-[#e8ff47] text-black rounded-xl py-3.5 font-bold text-sm uppercase tracking-widest hover:bg-yellow-300 transition" style={{ fontFamily: "Syne,sans-serif" }}>🔗 Merge All PDFs</button>
                  <button onClick={() => { setMergeFiles(origFileRef.current ? [{ name: origFileRef.current.name, bytes: origBytesRef.current.slice(0) }] : []); setMergeResult(null); }} className="px-4 bg-[#1a1a1e] border border-[#252528] text-[#aaa] rounded-xl font-semibold text-sm hover:border-red-500 hover:text-red-400 transition">Clear</button>
                </div>
                {mergeLoading && (
                  <div className="text-center py-4">
                    <Spinner cls="pdfpro-spinner h-8 w-8 text-[#e8ff47] mx-auto mb-2" />
                    <p className="text-sm font-semibold">Merging PDFs…</p>
                  </div>
                )}
                {mergeResult && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(232,255,71,.05)", border: "1px solid rgba(232,255,71,.2)" }}>
                      <div className="w-7 h-7 rounded-full bg-[#e8ff47] flex items-center justify-center flex-shrink-0">
                        <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                      <p className="font-semibold text-sm" style={{ color: "#e8ff47" }}>Merged! <span style={{ fontWeight: "normal", color: "rgba(232,255,71,.7)" }}>{mergeResult.info}</span></p>
                    </div>
                    <button onClick={downloadMerged} className="w-full bg-white text-black rounded-xl py-4 font-bold text-sm uppercase tracking-widest hover:bg-gray-100 transition" style={{ fontFamily: "Syne,sans-serif" }}>⬇ Download Merged PDF</button>
                  </div>
                )}
              </div>
            )}

            {/* ── DOWNLOAD BAR ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161619] border border-[#252528] rounded-2xl px-5 py-4 mt-2">
              <p className="text-sm text-[#606068]">Save all edits</p>
              <button onClick={() => downloadPDF("edited")} className="bg-white text-black rounded-xl py-3 px-6 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition flex items-center gap-2 flex-shrink-0" style={{ fontFamily: "Syne,sans-serif" }}>⬇ Download Edited PDF</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
