import { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload,
  Calendar,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  Film,
  FileVideo,
  ArrowRight,
  Globe,
} from "lucide-react";

/* ── helpers ── */

const TILE_SIZE = 256;
const OSM_SUBDOMAINS = ["a", "b", "c"];

function parseLatLng(str) {
  if (!str || typeof str !== "string") return null;
  const m = str.match(/(-?\d+\.?\d*)\D+(-?\d+\.?\d*)/);
  if (!m) return null;
  return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
}

function parseTimeline(json) {
  let data = json;
  if (Array.isArray(data)) data = { semanticSegments: data };
  const raw = [];
  let hasVisits = false;

  if (Array.isArray(data.locations)) {
    for (const loc of data.locations) {
      let lat = null,
        lng = null,
        t = null;
      if (typeof loc.latitudeE7 === "number") {
        lat = loc.latitudeE7 / 1e7;
        lng = loc.longitudeE7 / 1e7;
      } else if (loc.latLng) {
        const ll = parseLatLng(loc.latLng);
        if (ll) {
          lat = ll.lat;
          lng = ll.lng;
        }
      }
      t = loc.timestamp || loc.timestampMs;
      if (typeof t === "string" && /^\d+$/.test(t)) t = parseInt(t, 10);
      t = new Date(t).getTime();
      if (lat != null && lng != null && !isNaN(t))
        raw.push({ lat, lng, t, type: "path" });
    }
  }

  if (Array.isArray(data.semanticSegments)) {
    for (const seg of data.semanticSegments) {
      if (Array.isArray(seg.timelinePath)) {
        for (const p of seg.timelinePath) {
          const ll = parseLatLng(p.point);
          const t = new Date(p.time || seg.startTime).getTime();
          if (ll && !isNaN(t))
            raw.push({ lat: ll.lat, lng: ll.lng, t, type: "path" });
        }
      }
      if (
        seg.visit &&
        seg.visit.topCandidate &&
        seg.visit.topCandidate.placeLocation
      ) {
        const ll = parseLatLng(
          seg.visit.topCandidate.placeLocation.latLng
        );
        const t = new Date(seg.startTime).getTime();
        if (ll && !isNaN(t))
          raw.push({ lat: ll.lat, lng: ll.lng, t, type: "visit" });
        hasVisits = true;
      }
      if (seg.activity) {
        const s =
          seg.activity.start && parseLatLng(seg.activity.start.latLng);
        const e =
          seg.activity.end && parseLatLng(seg.activity.end.latLng);
        const t1 = new Date(seg.startTime).getTime();
        const t2 = new Date(seg.endTime).getTime();
        if (s && !isNaN(t1))
          raw.push({ lat: s.lat, lng: s.lng, t: t1, type: "path" });
        if (e && !isNaN(t2))
          raw.push({ lat: e.lat, lng: e.lng, t: t2, type: "path" });
        hasVisits = true;
      }
    }
  }

  const filtered = raw.filter(
    (p) =>
      typeof p.lat === "number" &&
      typeof p.lng === "number" &&
      !isNaN(p.lat) &&
      !isNaN(p.lng) &&
      !isNaN(p.t) &&
      Math.abs(p.lat) <= 90 &&
      Math.abs(p.lng) <= 180
  );
  filtered.sort((a, b) => a.t - b.t);
  return { points: filtered, hasVisits };
}

function haversine(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(Math.min(1, h)));
}

function clusterPlaces(points) {
  let clusters = 0,
    last = null;
  const sample = points.filter((_, i) => i % 4 === 0);
  for (const p of sample) {
    if (!last || haversine(last, p) > 1) {
      clusters++;
      last = p;
    }
  }
  return clusters;
}

function computeStats(points) {
  let totalKm = 0;
  for (let i = 1; i < points.length; i++) {
    const d = haversine(points[i - 1], points[i]);
    if (d < 300) totalKm += d;
  }
  const visits = points.filter((p) => p.type === "visit");
  const placeSet = new Set(
    visits.map((p) => `${p.lat.toFixed(2)},${p.lng.toFixed(2)}`)
  );
  let placesCount = placeSet.size;
  if (placesCount < 2) placesCount = clusterPlaces(points);
  const start = new Date(points[0].t);
  const end = new Date(points[points.length - 1].t);
  const days = Math.max(1, Math.round((end - start) / 86400000));
  return { totalKm: Math.round(totalKm), placesCount, start, end, days };
}

function samplePoints(points, max) {
  if (points.length <= max) return points.slice();
  const step = points.length / max;
  const out = [];
  for (let i = 0; i < max; i++)
    out.push(points[Math.floor(i * step)]);
  out.push(points[points.length - 1]);
  return out;
}

function getBounds(points) {
  let latMin = Infinity,
    latMax = -Infinity,
    lngMin = Infinity,
    lngMax = -Infinity;
  for (const p of points) {
    if (p.lat < latMin) latMin = p.lat;
    if (p.lat > latMax) latMax = p.lat;
    if (p.lng < lngMin) lngMin = p.lng;
    if (p.lng > lngMax) lngMax = p.lng;
  }
  return { latMin, latMax, lngMin, lngMax };
}

function fmtDate(d) {
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtInput(d) {
  return d.toISOString().slice(0, 10);
}

function lon2x(lon, z) {
  return ((lon + 180) / 360) * Math.pow(2, z) * TILE_SIZE;
}

function lat2y(lat, z) {
  const rad = (lat * Math.PI) / 180;
  return (
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) *
    Math.pow(2, z) *
    TILE_SIZE
  );
}

function chooseZoom(b, availW, availH) {
  for (let z = 17; z >= 2; z--) {
    const w = lon2x(b.lngMax, z) - lon2x(b.lngMin, z);
    const h = lat2y(b.latMin, z) - lat2y(b.latMax, z);
    if (w <= availW && h <= availH) return z;
  }
  return 2;
}

function buildTileProjection(points, cssW, cssH) {
  const b = getBounds(points);
  const padX = 50,
    padTop = 110,
    padBottom = 170;
  const availW = Math.max(cssW - padX * 2, 80);
  const availH = Math.max(cssH - padTop - padBottom, 80);
  const z = chooseZoom(b, availW, availH);
  const cx = (lon2x(b.lngMin, z) + lon2x(b.lngMax, z)) / 2;
  const cy = (lat2y(b.latMin, z) + lat2y(b.latMax, z)) / 2;
  const originX = cx - cssW / 2;
  const originY = cy - cssH / 2;
  return {
    z,
    originX,
    originY,
    project(p) {
      return {
        x: lon2x(p.lng, z) - originX,
        y: lat2y(p.lat, z) - originY,
      };
    },
  };
}

function neededTiles(proj, cssW, cssH) {
  const z = proj.z;
  const maxTile = Math.pow(2, z);
  const txMin = Math.floor(proj.originX / TILE_SIZE) - 1;
  const txMax = Math.floor((proj.originX + cssW) / TILE_SIZE) + 1;
  const tyMin = Math.floor(proj.originY / TILE_SIZE) - 1;
  const tyMax = Math.floor((proj.originY + cssH) / TILE_SIZE) + 1;
  const tiles = [];
  for (let tx = txMin; tx <= txMax; tx++) {
    for (let ty = tyMin; ty <= tyMax; ty++) {
      if (ty < 0 || ty >= maxTile) continue;
      const wrappedX = ((tx % maxTile) + maxTile) % maxTile;
      tiles.push({ tx, ty, wrappedX, z });
    }
  }
  return tiles;
}

const tileCache = new Map();

function loadTiles(tiles) {
  const promises = tiles.map((t, i) => {
    const key = `${t.z}_${t.wrappedX}_${t.ty}`;
    if (tileCache.has(key)) return Promise.resolve();
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve();
      img.onerror = () => resolve();
      const sd = OSM_SUBDOMAINS[i % OSM_SUBDOMAINS.length];
      img.src = `https://${sd}.tile.openstreetmap.org/${t.z}/${t.wrappedX}/${t.ty}.png`;
      tileCache.set(key, img);
    });
  });
  return Promise.all(promises);
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function computeStageSize(ratio, maxW, maxH) {
  if (ratio === "fill") return { w: maxW, h: maxH };
  const a = ratio === "portrait" ? 9 / 16 : 16 / 9;
  let w = maxW;
  let h = w / a;
  if (h > maxH) {
    h = maxH;
    w = h * a;
  }
  return { w: Math.round(w), h: Math.round(h) };
}

/* ── i18n ── */

const I18N = {
  en: {
    title: "Timeline Visualizer - Utility Tool | Swag Solutions",
    langName: "English",
    stepImport: "Import",
    stepDates: "Dates",
    stepPreview: "Preview",
    stepExport: "Export",
    importHead: "Import your Timeline",
    importSub:
      "Upload your Google Timeline JSON export. Everything is processed locally on your device — only map tile images are requested from the map provider.",
    dragText: "Drag your JSON file here",
    dragSub: "or click below to browse",
    chooseFile: "Choose Timeline file",
    processing: "Processing...",
    errNotJson: "This file is not valid JSON. Check if it's a Google Timeline export.",
    errNoPoints:
      "No location points found in this file. Is it a Google Timeline JSON export? (Records.json or Timeline.json)",
    errRead: "Error reading file. Please try again.",
    whereNote: "Where to get the file:",
    whereBody:
      "On your phone: Settings → Location → Location services → Timeline → Export Timeline data → Continue. Save the JSON file. From a computer, transfer the file from your phone first.",
    privacy: "No account, location permission, or Timeline upload required.",
    datesHead: "Choose date range",
    datesSub: "Data from {from} to {to} is available. Select the portion you want for the video.",
    pointsLoaded: "points loaded",
    daysCovered: "days covered",
    from: "From",
    to: "To",
    rawNote:
      "Only raw location data found. This file doesn't contain processed visits/trips, only raw GPS points. The route may be noisy and distance is an estimate. For best results, make sure Timeline is fully synced in the Google Maps app, then export again.",
    errRange:
      "Invalid date range. The From date must be before the To date.",
    errFewPoints:
      "Not enough points in this date range. Try a wider range.",
    back: "Back",
    continue: "Continue",
    journey: "Your Journey",
    distance: "Distance",
    places: "Places",
    km: "km",
    dates: "Dates",
    recIndicator: "Recording",
    goExport: "Continue to export →",
    exportHead: "Export video",
    exportMeta: "Full preview · screen size · 30 fps · .webm",
    days: "days",
    createVideo: "Create video",
    recMsg:
      "Recording... Stay on this page until the animation finishes.",
    preview: "Preview",
    placesTitle: "places, {days} days",
    ratioHead: "Video orientation",
    ratioHint: "Choose the orientation for your video. It applies to both the preview and the exported file.",
    portrait: "Portrait",
    landscape: "Landscape",
    screenFill: "Fill screen",
  },
  si: {
    title: "Timeline Visualizer - Utility Tool | Swag Solutions",
    langName: "සිංහල",
    stepImport: "ආනයනය",
    stepDates: "දින",
    stepPreview: "දර්ශනය",
    stepExport: "පිටපත්",
    importHead: "Timeline file එක උඩුගත කරන්න",
    importSub:
      "Google Timeline JSON export එක තෝරන්න. File එක ඔබේ device එකේම process වෙනවා — map tile images විතරයි map provider එකෙන් ඉල්ලන්නේ.",
    dragText: "JSON file එක මෙතනට drag කරන්න",
    dragSub: "නැත්නම් පහළින් තෝරන්න",
    chooseFile: "Timeline file එකක් තෝරන්න",
    processing: "Process වෙනවා...",
    errNotJson: "මේ file එක valid JSON එකක් නෙවෙයි. Google Timeline export file එකද කියලා බලන්න.",
    errNoPoints:
      "මේ file එකෙන් location points හම්බුනේ නෑ. Google Timeline JSON export එකක්ද? (Records.json හෝ Timeline.json)",
    errRead: "File එක කියවීමේදී වැරැද්දක් වුනා. නැවත try කරන්න.",
    whereNote: "කොහෙන් ගන්නද:",
    whereBody:
      "Phone එකේ Settings → Location → Location services → Timeline → Export Timeline data → Continue. JSON file එක save කරගන්න. Computer එකකින් නම්, කලින් phone එකෙන් file එක transfer කරගන්න ඕන.",
    privacy:
      "No account, location permission, or Timeline upload අවශ්‍ය නෑ.",
    datesHead: "දින පරාසය තෝරන්න",
    datesSub: "{from} සිට {to} දක්වා data තියෙනවා. Video එකට ඕන කොටස තෝරන්න.",
    pointsLoaded: "points load වුණා",
    daysCovered: "දින ගණන",
    from: "From",
    to: "To",
    rawNote:
      "මෙතන තියෙන්නේ raw location data විතරයි. මේ file එකේ processed visits/trips නෑ, raw GPS points විතරයි. Route එක noisy වෙන්නත් puluwan, distance එකත් estimate එකක් විතරයි වෙන්නේ. හොඳ result එකකට — Google Maps app එකේ Timeline එක සම්පූර්ණයෙන් sync වෙලා තියෙනවද බලලා, නැවත export කරන්න.",
    errRange:
      "දින පරාසය හරි නෑ. From date එක To date එකට කලින් තියෙන්න ඕන.",
    errFewPoints:
      "මේ දින පරාසයේ points ප්‍රමාණවත් නෑ. පරාසය පුළුල් කරන්න.",
    back: "↔ ආපසු",
    continue: "ඉදිරියට",
    journey: "ඔබේ ගමන",
    distance: "දුර ගෙවා ඇත",
    places: "ස්ථාන",
    km: "km",
    dates: "දින",
    recIndicator: "ගනිමින්",
    goExport: "Export කරන්න යන්න →",
    exportHead: "Video එක Export කරන්න",
    exportMeta: "Full preview · screen size · 30 fps · .webm",
    days: "දින",
    createVideo: "Video එක හදන්න",
    recMsg: "Recording... animation එක end වෙනකම් screen එකෙන් ඉවත් නොවී ඉන්න.",
    preview: "← Preview",
    placesTitle: "ස්ථාන {places}, දින {days}ක් පුරා",
    ratioHead: "Video orientation",
    ratioHint: "Video එකට ඕන orientation එක තෝරන්න. Preview එකටයි exported file එකටයි දෙකටම apply වෙනවා.",
    portrait: "Vertical",
    landscape: "Horizontal",
    screenFill: "Screen",
  },
};

/* ── component ── */

export default function TimelineVisualizer() {
  const [language, setLanguage] = useState("en");
  const t = I18N[language] || I18N.en;

  useEffect(() => {
    document.title = t.title;
  }, [t]);

  const [step, setStep] = useState(1);

  /* step 1 state */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  /* step 2 state */
  const [allPoints, setAllPoints] = useState([]);
  const [hasVisits, setHasVisits] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateRange, setDateRange] = useState({ min: "", max: "" });
  const [fullStats, setFullStats] = useState(null);
  const [dateError, setDateError] = useState("");

  /* step 3 state */
  const [filteredPoints, setFilteredPoints] = useState([]);
  const [stats, setStats] = useState(null);
  const [samples, setSamples] = useState([]);

  /* animation state */
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [recording, setRecording] = useState(false);
  const [ratio, setRatio] = useState("landscape");

  /* refs */
  const canvasRef = useRef(null);
  const bgLayerRef = useRef(null);
  const previewRef = useRef(null);
  const previewOuterRef = useRef(null);
  const projRef = useRef(null);
  const tilesRef = useRef([]);
  const progressRef = useRef(0);
  const playingRef = useRef(false);
  const speedRef = useRef(1);
  const lastTsRef = useRef(null);
  const rafRef = useRef(null);
  const recordingRef = useRef(false);
  const ratioRef = useRef("landscape");
  const pendingRecordRef = useRef(false);
  const tRef = useRef(t);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const samplesRef = useRef([]);

  /* keep refs synced */
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    recordingRef.current = recording;
  }, [recording]);
  useEffect(() => {
    samplesRef.current = samples;
  }, [samples]);
  useEffect(() => {
    ratioRef.current = ratio;
  }, [ratio]);
  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const dprRef = useRef(Math.min(window.devicePixelRatio || 1, 2));

  /* ── step 1 handlers ── */

  const handleFile = useCallback((file) => {
    setError("");
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      let json;
      try {
        json = JSON.parse(e.target.result);
      } catch {
        setError(t.errNotJson);
        setLoading(false);
        return;
      }
      const { points, hasVisits } = parseTimeline(json);
      if (points.length < 2) {
        setError(t.errNoPoints);
        setLoading(false);
        return;
      }
      setLoading(false);
      setAllPoints(points);
      setHasVisits(hasVisits);

      const full = computeStats(points);
      setFullStats(full);
      setFromDate(fmtInput(full.start));
      setToDate(fmtInput(full.end));
      setDateRange({ min: fmtInput(full.start), max: fmtInput(full.end) });
      setStep(2);
    };
    reader.onerror = () => {
      setError(t.errRead);
      setLoading(false);
    };
    reader.readAsText(file);
  }, [t]);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const onFileChange = useCallback(
    (e) => {
      const f = e.target.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  /* ── step 2 handler ── */

  const goToPreview = useCallback(() => {
    const from = new Date(fromDate + "T00:00:00");
    const to = new Date(toDate + "T23:59:59");
    if (
      isNaN(from.getTime()) ||
      isNaN(to.getTime()) ||
      from > to
    ) {
      setDateError(t.errRange);
      return;
    }
    const filtered = allPoints.filter(
      (p) => p.t >= from.getTime() && p.t <= to.getTime()
    );
    if (filtered.length < 2) {
      setDateError(t.errFewPoints);
      return;
    }
    setDateError("");
    setFilteredPoints(filtered);
    const s = computeStats(filtered);
    setStats(s);
    setSamples(samplePoints(filtered, 1400));
    setStep(3);
  }, [allPoints, fromDate, toDate, t]);

  /* ── canvas sizing ── */

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const bg = bgLayerRef.current;
    const preview = previewRef.current;
    const outer = previewOuterRef.current;
    if (!canvas || !bg || !preview || !outer) return;
    const { w, h } = computeStageSize(
      ratioRef.current,
      outer.clientWidth,
      outer.clientHeight
    );
    preview.style.width = w + "px";
    preview.style.height = h + "px";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bg.width = canvas.width;
    bg.height = canvas.height;
  }, []);

  const drawMapBackground = useCallback(
    (proj, tileList) => {
      const bg = bgLayerRef.current;
      if (!bg) return;
      const dpr = dprRef.current;
      const bgCtx = bg.getContext("2d");
      const w = bg.width / dpr;
      const h = bg.height / dpr;
      bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bgCtx.fillStyle = "#EFE7EA";
      bgCtx.fillRect(0, 0, w, h);
      for (const t of tileList) {
        const key = `${t.z}_${t.wrappedX}_${t.ty}`;
        const img = tileCache.get(key);
        if (img && img.complete && img.naturalWidth) {
          const sx = t.tx * TILE_SIZE - proj.originX;
          const sy = t.ty * TILE_SIZE - proj.originY;
          bgCtx.drawImage(img, sx, sy, TILE_SIZE, TILE_SIZE);
        }
      }
      bgCtx.fillStyle = "rgba(255,247,250,0.12)";
      bgCtx.fillRect(0, 0, w, h);
    },
    []
  );

  /* ── render frame ── */

  const renderFrame = useCallback(
    (t, samplePts, proj) => {
      const canvas = canvasRef.current;
      const bg = bgLayerRef.current;
      if (!canvas || !bg || !proj || !samplePts.length) return;
      const dpr = dprRef.current;
      const ctx = canvas.getContext("2d");
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const T = tRef.current;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(bg, 0, 0, bg.width, bg.height, 0, 0, w, h);

      const n = samplePts.length;
      const idx = Math.max(1, Math.floor(t * (n - 1)));
      const head = proj.project(samplePts[idx]);
      const startPt = proj.project(samplePts[0]);

      // trail gradient
      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const grad = ctx.createLinearGradient(
        startPt.x,
        startPt.y,
        head.x,
        head.y
      );
      grad.addColorStop(0, "#FFC08A");
      grad.addColorStop(0.55, "#FF7FB8");
      grad.addColorStop(1, "#FF2E96");
      ctx.shadowColor = "rgba(255,79,160,0.4)";
      ctx.shadowBlur = 7;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= idx; i++) {
        const pt = proj.project(samplePts[i]);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.restore();

      // visit markers
      ctx.save();
      for (let i = 0; i <= idx; i++) {
        if (samplePts[i].type === "visit") {
          const pt = proj.project(samplePts[i]);
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.4, 0, Math.PI * 2);
          ctx.fillStyle = "#D63A87";
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "#fff";
          ctx.stroke();
        }
      }
      ctx.restore();

      // comet tail
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const tailLen = Math.min(28, idx);
      for (let k = tailLen; k >= 0; k--) {
        const i = idx - k;
        if (i < 0) continue;
        const pt = proj.project(samplePts[i]);
        const frac = tailLen > 0 ? 1 - k / tailLen : 1;
        const r = 1 + frac * 4.2;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,120,180,${0.04 + frac * 0.4})`;
        ctx.fill();
      }
      ctx.restore();

      // marker
      const pulse = 4 + Math.sin(t * Math.PI * 18) * 1.3;
      ctx.save();
      ctx.beginPath();
      ctx.arc(head.x, head.y, pulse + 9, 0, Math.PI * 2);
      const haloGrad = ctx.createRadialGradient(
        head.x,
        head.y,
        0,
        head.x,
        head.y,
        pulse + 9
      );
      haloGrad.addColorStop(0, "rgba(255,79,160,0.28)");
      haloGrad.addColorStop(1, "rgba(255,79,160,0)");
      ctx.fillStyle = haloGrad;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(head.x, head.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#FF2E96";
      ctx.shadowColor = "rgba(255,46,150,0.9)";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#fff";
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(head.x - 1.2, head.y - 1.2, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fill();
      ctx.restore();

      // ── title card (canvas) ──
      const titleAlpha = t < 0.05 ? 1 : t < 0.09 ? Math.max(0, 1 - (t - 0.05) / 0.04) : 0;
      if (titleAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = titleAlpha;
        ctx.fillStyle = "rgba(10,15,26,0.6)";
        ctx.fillRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h * 0.44;
        const totalKm = stats ? stats.totalKm.toLocaleString() : "0";
        const sub = stats
          ? T.placesTitle.replace("{places}", stats.placesCount).replace("{days}", stats.days)
          : "";
        const range = stats
          ? `${fmtDate(stats.start)} — ${fmtDate(stats.end)}`
          : "";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#94a3b8";
        ctx.font = "600 14px Inter, system-ui, sans-serif";
        ctx.fillText(T.journey, cx, cy - h * 0.12);

        const big = Math.min(96, Math.max(28, w * 0.14));
        ctx.fillStyle = "#f472b6";
        ctx.font = `300 ${big}px Inter, system-ui, sans-serif`;
        ctx.fillText(totalKm, cx, cy);
        const kmW = ctx.measureText(totalKm).width;
        const sup = Math.max(14, big * 0.34);
        ctx.font = `400 ${sup}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(T.km, cx + kmW / 2 + sup * 0.7, cy - big * 0.42);

        const subSize = Math.min(26, Math.max(15, w * 0.055));
        ctx.fillStyle = "#ffffff";
        ctx.font = `300 ${subSize}px Inter, system-ui, sans-serif`;
        ctx.fillText(sub, cx, cy + h * 0.09);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "400 14px Inter, system-ui, sans-serif";
        ctx.fillText(range, cx, cy + h * 0.09 + subSize * 1.5 + 12);
        ctx.restore();
      }

      // ── HUD (canvas) ──
      const hudAlpha = t >= 0.05 ? Math.min(1, (t - 0.05) / 0.04) : 0;
      if (hudAlpha > 0.01) {
        let kmSoFar = 0;
        const placeSet = new Set();
        for (let i = 1; i <= idx; i++) {
          const d = haversine(samplePts[i - 1], samplePts[i]);
          if (d < 300) kmSoFar += d;
        }
        for (let i = 0; i <= idx; i++) {
          if (samplePts[i] && samplePts[i].type === "visit")
            placeSet.add(`${samplePts[i].lat.toFixed(2)},${samplePts[i].lng.toFixed(2)}`);
        }
        const hudKm = Math.round(kmSoFar);
        const hudPlacesVal = Math.max(
          placeSet.size,
          stats ? Math.round(stats.placesCount * t) : 0
        );
        const hudDateText = fmtDate(new Date(samplePts[idx].t));

        ctx.save();
        ctx.globalAlpha = hudAlpha;
        const boxW = Math.min(236, w - 48);
        const boxH = Math.min(140, Math.max(104, h * 0.26));
        const bottomClear = Math.min(112, Math.max(96, h * 0.28));
        const bx = 24;
        const by = Math.max(70, h - boxH - bottomClear);
        const midX = bx + boxW / 2;
        const pad = 16;

        ctx.fillStyle = "rgba(10,15,26,0.75)";
        roundRectPath(ctx, bx, by, boxW, boxH, 12);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const labelY = by + boxH * 0.22;
        const valY = by + boxH * 0.5;
        const divY = by + boxH * 0.75;
        const dateY = by + boxH * 0.9;

        ctx.fillStyle = "#94a3b8";
        ctx.font = "400 12px Inter, system-ui, sans-serif";
        ctx.fillText(T.distance, bx + pad, labelY);
        ctx.fillText(T.places, midX + pad, labelY);
        ctx.fillStyle = "#ffffff";
        ctx.font = "500 22px Inter, system-ui, sans-serif";
        ctx.fillText(`${hudKm.toLocaleString()} ${T.km}`, bx + pad, valY);
        ctx.fillText(String(hudPlacesVal), midX + pad, valY);

        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.moveTo(bx + pad, divY);
        ctx.lineTo(bx + boxW - pad, divY);
        ctx.stroke();

        ctx.fillStyle = "#64748b";
        ctx.font = "400 11px Inter, system-ui, sans-serif";
        ctx.fillText(hudDateText, bx + pad, dateY);
        ctx.restore();
      }
    },
    [stats]
  );

  /* ── recording ── */

  const beginRecording = useCallback(() => {
    if (recordingRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    let stream;
    try {
      stream = canvas.captureStream(30);
    } catch {
      alert(
        "Your browser doesn't support video recording. Try Chrome or Edge."
      );
      return;
    }
    let mr;
    const opts = [
      { mimeType: "video/webm;codecs=vp9" },
      { mimeType: "video/webm;codecs=vp8" },
      { mimeType: "video/webm" },
    ];
    for (const o of opts) {
      if (
        window.MediaRecorder &&
        MediaRecorder.isTypeSupported &&
        MediaRecorder.isTypeSupported(o.mimeType)
      ) {
        try {
          mr = new MediaRecorder(stream, o);
          break;
        } catch {
          /* skip */
        }
      }
    }
    if (!mr) {
      try {
        mr = new MediaRecorder(stream);
      } catch {
        alert("Could not start recording.");
        return;
      }
    }

    chunksRef.current = [];
    mr.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "timeline-journey.webm";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setRecording(false);
      recordingRef.current = false;
    };

    mediaRecorderRef.current = mr;
    mr.start();
    setRecording(true);
    recordingRef.current = true;
    setProgress(0);
    progressRef.current = 0;
    setPlaying(true);
  }, []);

  const requestRecording = () => {
    if (recordingRef.current) return;
    pendingRecordRef.current = true;
    setStep(3);
  };

  /* ── step 3 setup ── */

  useEffect(() => {
    if (step !== 3) return;

    let cancelled = false;

    async function setup() {
      sizeCanvas();
      const preview = previewRef.current;
      if (!preview) return;
      const s = samplePoints(filteredPoints, 1400);
      setSamples(s);
      samplesRef.current = s;

      const proj = buildTileProjection(s, preview.clientWidth, preview.clientHeight);
      projRef.current = proj;
      const tiles = neededTiles(proj, preview.clientWidth, preview.clientHeight);
      tilesRef.current = tiles;
      await loadTiles(tiles);
      if (cancelled) return;
      drawMapBackground(proj, tiles);
      renderFrame(0, s, proj);

      if (pendingRecordRef.current) {
        pendingRecordRef.current = false;
        beginRecording();
      }
    }

    setup();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [
    step,
    filteredPoints,
    sizeCanvas,
    drawMapBackground,
    renderFrame,
    beginRecording,
  ]);

  /* ── resize handler ── */

  useEffect(() => {
    if (step !== 3) return;

    function onResize() {
      if (recordingRef.current) return;
      sizeCanvas();
      const s = samplesRef.current;
      if (!s.length) return;
      const preview = previewRef.current;
      if (!preview) return;
      const proj = buildTileProjection(s, preview.clientWidth, preview.clientHeight);
      projRef.current = proj;
      const tiles = neededTiles(proj, preview.clientWidth, preview.clientHeight);
      tilesRef.current = tiles;
      loadTiles(tiles).then(() => {
        drawMapBackground(proj, tiles);
        renderFrame(progressRef.current, s, proj);
      });
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [step, sizeCanvas, drawMapBackground, renderFrame]);

  /* ── animation loop ── */

  const durationRef = useRef(18000);
  const loopRef = useRef(null);

  const loop = useCallback(
    (ts) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      if (playingRef.current) {
        const newProg =
          progressRef.current +
          (dt / durationRef.current) * speedRef.current;
        if (newProg >= 1) {
          setProgress(1);
          progressRef.current = 1;
          renderFrame(1, samplesRef.current, projRef.current);
          setPlaying(false);
          playingRef.current = false;
          if (recordingRef.current) {
            setTimeout(() => {
              if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state !== "inactive"
              )
                mediaRecorderRef.current.stop();
            }, 1600);
          }
          return;
        }
        setProgress(newProg);
        progressRef.current = newProg;
        renderFrame(newProg, samplesRef.current, projRef.current);
      }
      rafRef.current = requestAnimationFrame(loopRef.current);
    },
    [renderFrame]
  );

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    if (playing) {
      lastTsRef.current = null;
      rafRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, loop]);

  /* ── progress bar / export button ── */

  const progressFillRef = useRef(null);
  const goExportBtnRef = useRef(null);

  useEffect(() => {
    if (progressFillRef.current)
      progressFillRef.current.style.width = progress * 100 + "%";
  }, [progress]);

  useEffect(() => {
    if (goExportBtnRef.current) {
      if (progress >= 0.995 && !recordingRef.current)
        goExportBtnRef.current.classList.remove("opacity-0", "pointer-events-none");
      else
        goExportBtnRef.current.classList.add("opacity-0", "pointer-events-none");
    }
  }, [progress]);

  /* ── animation controls ── */

  const togglePlay = useCallback(() => {
    if (progressRef.current >= 1) {
      setProgress(0);
      progressRef.current = 0;
    }
    setPlaying((p) => !p);
  }, []);

  const restart = useCallback(() => {
    setProgress(0);
    progressRef.current = 0;
    setPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    renderFrame(0, samplesRef.current, projRef.current);
  }, [renderFrame]);

  const cycleSpeed = useCallback(() => {
    const speeds = [1, 2, 0.5];
    setSpeed((prev) => {
      const cur = speeds.indexOf(prev);
      return speeds[(cur + 1) % speeds.length];
    });
  }, []);

  const onProgressClick = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const t = Math.min(
        1,
        Math.max(0, (e.clientX - rect.left) / rect.width)
      );
      setProgress(t);
      progressRef.current = t;
      setPlaying(false);
      renderFrame(t, samplesRef.current, projRef.current);
    },
    [renderFrame]
  );

  /* ── render ── */

  return (
    <div className="min-h-screen text-slate-200"
      style={{
        background: "linear-gradient(135deg,#0a0f1a 0%,#111827 45%,#2a0f1e 100%)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* stepper */}
      <div
        className="sticky top-0 z-40 border-b px-4"
        style={{ background: "rgba(10,15,26,0.72)", borderColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-0 py-4 relative">
          {/* language toggle */}
          <button
            onClick={() => setLanguage((l) => (l === "en" ? "si" : "en"))}
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
            style={{
              color: language === "en" ? "#fff" : "#f9a8d4",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            title="Language / භාෂාව"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === "en" ? "සිංහල" : "EN"}
          </button>

          {[
            { n: 1, label: t.stepImport, icon: Upload },
            { n: 2, label: t.stepDates, icon: Calendar },
            { n: 3, label: t.stepPreview, icon: Play },
            { n: 4, label: t.stepExport, icon: Film },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 border
                    ${
                      step === s.n
                        ? "text-white"
                        : step > s.n
                        ? "text-pink-300"
                        : "text-slate-400"
                    }`}
                  style={{
                    borderColor: step === s.n ? "#f472b6" : step > s.n ? "rgba(244,114,182,0.5)" : "rgba(255,255,255,0.15)",
                    background: step === s.n ? "linear-gradient(135deg,#f472b6,#db2777)" : "rgba(255,255,255,0.05)",
                    boxShadow: step === s.n ? "0 0 18px rgba(244,114,182,0.45)" : "none",
                  }}
                >
                  {step > s.n ? "✓" : s.n}
                </div>
                <span
                  className={`text-sm hidden sm:block transition-colors duration-200
                    ${
                      step === s.n ? "text-white font-semibold" : step > s.n ? "text-pink-200" : "text-slate-400"
                    }`}
                >
                  {s.label}
                </span>
              </div>
              {i < 3 && (
                <div
                  className="w-6 sm:w-12 h-0.5 mx-1.5 sm:mx-3 rounded"
                  style={{ background: step > s.n ? "rgba(244,114,182,0.6)" : "rgba(255,255,255,0.12)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* step 1: import */}
      {step === 1 && (
        <div className="min-h-[calc(100vh-64px)] supports-[height:1dvh]:min-h-[calc(100dvh-64px)] flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <h2
              className="text-3xl sm:text-4xl font-medium mb-3 text-white"
              style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
            >
              {t.importHead}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              {t.importSub}
            </p>

            <div
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              className="relative rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200"
              style={{
                borderColor: dragOver ? "#f472b6" : "rgba(255,255,255,0.18)",
                background: dragOver ? "rgba(244,114,182,0.1)" : "rgba(255,255,255,0.04)",
                boxShadow: dragOver ? "0 0 30px rgba(244,114,182,0.2) inset" : "none",
              }}
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: "linear-gradient(135deg,rgba(244,114,182,0.25),rgba(219,39,119,0.15))",
                    border: "1px solid rgba(244,114,182,0.4)",
                  }}
                >
                  <Upload className="w-6 h-6 text-pink-400" />
                </div>
                <p className="text-white font-medium mb-1">
                  {t.dragText}
                </p>
                <p className="text-slate-400 text-sm mb-5">
                  {t.dragSub}
                </p>
                <label
                  className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold text-sm rounded-xl cursor-pointer transition-all duration-150"
                  style={{
                    background: "linear-gradient(135deg,#f472b6,#db2777)",
                    boxShadow: "0 6px 20px rgba(219,39,119,0.35)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <Upload className="w-4 h-4" />
                  {t.chooseFile}
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </label>
              </div>

              {loading && (
                <div className="mt-5 flex items-center justify-center gap-2 text-pink-400 text-sm">
                  <div className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{ borderColor: "rgba(244,114,182,0.3)", borderTopColor: "#f472b6" }}
                  />
                  {t.processing}
                </div>
              )}
              {error && (
                <div
                  className="mt-5 text-sm rounded-xl p-4 text-left"
                  style={{ color: "#fda4af", background: "rgba(190,18,60,0.15)", border: "1px solid rgba(244,63,94,0.3)" }}
                >
                  {error}
                </div>
              )}
            </div>

            <div
              className="mt-6 text-xs rounded-xl p-4 leading-relaxed"
              style={{ color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <strong className="text-slate-200 font-semibold">
                {t.whereNote}
              </strong>{" "}
              {t.whereBody}
            </div>
            <p className="text-center text-xs mt-4" style={{ color: "#64748b" }}>
              {t.privacy}
            </p>
          </div>
        </div>
      )}

      {/* step 2: dates */}
      {step === 2 && fullStats && (
        <div className="min-h-[calc(100vh-64px)] supports-[height:1dvh]:min-h-[calc(100dvh-64px)] flex items-center justify-center p-6">
          <div className="w-full max-w-lg">
            <h2 className="text-3xl sm:text-4xl font-medium mb-3 text-white">
              {t.datesHead}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {t.datesSub
                .replace("{from}", fmtDate(fullStats.start))
                .replace("{to}", fmtDate(fullStats.end))}
            </p>

            <div className="flex gap-8 mb-8">
              <div>
                <div className="text-2xl font-medium text-white">
                  {allPoints.length.toLocaleString()}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                  {t.pointsLoaded}
                </div>
              </div>
              <div>
                <div className="text-2xl font-medium text-white">
                  {fullStats.days}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                  {t.daysCovered}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xs mb-1.5" style={{ color: "#94a3b8" }}>
                  {t.from}
                </label>
                <input
                  type="date"
                  value={fromDate}
                  min={dateRange.min}
                  max={dateRange.max}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-100 focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    colorScheme: "dark",
                  }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs mb-1.5" style={{ color: "#94a3b8" }}>
                  {t.to}
                </label>
                <input
                  type="date"
                  value={toDate}
                  min={dateRange.min}
                  max={dateRange.max}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-slate-100 focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    colorScheme: "dark",
                  }}
                />
              </div>
            </div>

            {!hasVisits && (
              <div
                className="text-xs leading-relaxed rounded-xl p-4 mb-4"
                style={{ color: "#fbbf24", background: "rgba(180,83,9,0.12)", border: "1px solid rgba(251,191,36,0.25)" }}
              >
                <strong>{t.rawNote}</strong>
              </div>
            )}

            {dateError && (
              <div className="text-sm mb-4" style={{ color: "#fda4af" }}>
                {dateError}
              </div>
            )}

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  color: "#cbd5e1",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <ChevronLeft className="w-4 h-4 inline -mr-1" />
                {t.back}
              </button>
              <button
                onClick={goToPreview}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg,#f472b6,#db2777)",
                  boxShadow: "0 6px 20px rgba(219,39,119,0.35)",
                }}
              >
                {t.continue}
                <ArrowRight className="w-4 h-4 inline -mr-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* step 3: preview */}
      {step === 3 && (
        <div
          ref={previewOuterRef}
          className="relative flex items-center justify-center overflow-hidden h-[calc(100vh-64px)] supports-[height:1dvh]:h-[calc(100dvh-64px)]"
        >
          <div ref={previewRef} className="relative">
            <canvas ref={canvasRef} className="block" />
            <canvas ref={bgLayerRef} className="hidden" />

          {/* back button */}
          <button
            onClick={() => {
              if (rafRef.current) cancelAnimationFrame(rafRef.current);
              setPlaying(false);
              setStep(2);
            }}
            className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-2 rounded-xl text-sm transition-colors"
            style={{
              color: "#94a3b8",
              background: "rgba(10,15,26,0.7)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(6px)",
            }}
          >
            <ChevronLeft className="w-4 h-4" />
            {t.dates}
          </button>

          {/* controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{
                color: "#fff",
                background: "rgba(10,15,26,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
              }}
              title="Play / Pause"
            >
              {playing ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={restart}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{
                color: "#fff",
                background: "rgba(10,15,26,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
              }}
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={cycleSpeed}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold transition-colors"
              style={{
                color: "#fff",
                background: "rgba(10,15,26,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(6px)",
              }}
              title="Speed"
            >
              {speed}×
            </button>
          </div>

          {/* progress bar */}
          <div
            onClick={onProgressClick}
            className="absolute left-4 right-4 bottom-4 h-1 rounded-full cursor-pointer z-10"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <div
              ref={progressFillRef}
              className="h-full rounded-full"
              style={{ width: progress * 100 + "%", background: "linear-gradient(90deg,#f472b6,#ec4899)" }}
            />
          </div>

          {/* map attribution */}
          <div
            className="absolute right-3 bottom-14 text-[10.5px] px-1.5 py-0.5 rounded"
            style={{ color: "#94a3b8", background: "rgba(10,15,26,0.6)" }}
          >
            Map data © OpenStreetMap contributors
          </div>

          {/* recording indicator */}
          {recording && (
            <div
              className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-full shadow-lg"
              style={{ background: "rgba(225,29,72,0.9)", boxShadow: "0 6px 20px rgba(225,29,72,0.4)" }}
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {t.recIndicator}
            </div>
          )}

          {/* continue to export */}
          <button
            ref={goExportBtnRef}
            onClick={() => {
              setPlaying(false);
              setStep(4);
            }}
            className="absolute left-1/2 -translate-x-1/2 bottom-12 z-10 px-6 py-3 text-white text-sm font-semibold rounded-full transition-opacity duration-500 opacity-0 pointer-events-none"
            style={{
              background: "rgba(10,15,26,0.85)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              border: "1px solid rgba(244,114,182,0.4)",
            }}
          >
            {t.goExport}
          </button>
        </div>
        </div>
      )}

      {/* step 4: export */}
      {step === 4 && stats && (
        <div className="min-h-[calc(100vh-64px)] supports-[height:1dvh]:min-h-[calc(100dvh-64px)] flex items-center justify-center p-6">
          <div className="w-full max-w-lg text-center">
            <h2 className="text-3xl sm:text-4xl font-medium mb-3 text-white">
              {t.exportHead}
            </h2>
            <p className="text-sm mb-8" style={{ color: "#94a3b8" }}>
              {t.exportMeta}
            </p>

            <div className="flex justify-center gap-8 sm:gap-12 mb-8 flex-wrap">
              <div>
                <div className="text-3xl font-medium text-white">
                  {stats.totalKm.toLocaleString()}
                </div>
                <div className="text-xs mt-1" style={{ color: "#64748b" }}>{t.km}</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-white">
                  {stats.days}
                </div>
                <div className="text-xs mt-1" style={{ color: "#64748b" }}>{t.days}</div>
              </div>
              <div>
                <div className="text-3xl font-medium text-white">
                  {stats.placesCount}
                </div>
                <div className="text-xs mt-1" style={{ color: "#64748b" }}>
                  {t.places.toLowerCase()}
                </div>
              </div>
            </div>

            {/* aspect ratio selector */}
            <div className="mb-10">
              <div className="text-sm font-semibold text-white mb-2">
                {t.ratioHead}
              </div>
              <div className="flex justify-center gap-2 mb-2 flex-wrap">
                {[
                  { id: "portrait", label: t.portrait },
                  { id: "landscape", label: t.landscape },
                  { id: "fill", label: t.screenFill },
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setRatio(o.id);
                      ratioRef.current = o.id;
                    }}
                    className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                    style={{
                      color: ratio === o.id ? "#fff" : "#cbd5e1",
                      background:
                        ratio === o.id
                          ? "linear-gradient(135deg,#f472b6,#db2777)"
                          : "rgba(255,255,255,0.05)",
                      border:
                        ratio === o.id
                          ? "1px solid transparent"
                          : "1px solid rgba(255,255,255,0.15)",
                      boxShadow: ratio === o.id ? "0 6px 20px rgba(219,39,119,0.35)" : "none",
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded border flex items-center justify-center"
                      style={{
                        borderColor: ratio === o.id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                        display: "grid",
                        gridTemplateRows: o.id === "portrait" ? "1fr 1.6fr" : o.id === "landscape" ? "1.6fr 1fr" : "1fr 1fr",
                        padding: 2,
                      }}
                    >
                      <div
                        style={{
                          background: ratio === o.id ? "#fff" : "rgba(255,255,255,0.4)",
                          gridRow: o.id === "portrait" ? "2" : o.id === "landscape" ? "1" : "auto",
                        }}
                      />
                    </div>
                    {o.label}
                  </button>
                ))}
              </div>
              <p className="text-xs" style={{ color: "#64748b" }}>
                {t.ratioHint}
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setStep(3);
                  restart();
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  color: "#cbd5e1",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <ChevronLeft className="w-4 h-4 inline -mr-1" />
                {t.preview}
              </button>
              <button
                onClick={requestRecording}
                disabled={recording}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{
                  background: "linear-gradient(135deg,#f472b6,#db2777)",
                  boxShadow: "0 6px 20px rgba(219,39,119,0.35)",
                }}
              >
                <FileVideo className="w-4 h-4 inline -mr-1" />
                {t.createVideo}
              </button>
            </div>

            {recording && (
              <p className="mt-6 text-sm" style={{ color: "#94a3b8" }}>
                {t.recMsg}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
