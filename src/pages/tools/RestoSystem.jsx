import { useState, useEffect, useCallback } from "react";

// ─── CSS (injected as a style tag) ───────────────────────────────────────────
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
.resto-page{font-family:'Segoe UI',system-ui,sans-serif;background:#f0f2f5;color:#1a1a2e}
button{font-family:inherit;cursor:pointer}
input,select,textarea{font-family:inherit}
.app{display:flex;height:100vh;min-height:640px}
.sidebar{width:200px;min-width:200px;background:#1a1a2e;display:flex;flex-direction:column;color:#fff}
.sidebar-logo{padding:16px 14px;border-bottom:1px solid rgba(255,255,255,0.1)}
.sidebar-logo .name{font-size:14px;font-weight:600;color:#fff}
.sidebar-logo .sub{font-size:11px;color:rgba(255,255,255,0.5);margin-top:2px}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;font-size:13px;color:rgba(255,255,255,0.6);border-left:3px solid transparent;transition:all 0.15s;user-select:none}
.nav-item:hover{background:rgba(255,255,255,0.07);color:#fff}
.nav-item.active{background:rgba(74,144,226,0.2);color:#4a90e2;border-left-color:#4a90e2}
.nav-item .icon{font-size:16px;width:20px;text-align:center}
.nav-badge{margin-left:auto;background:#4a90e2;color:#fff;border-radius:99px;font-size:10px;padding:1px 7px;font-weight:600}
.sidebar-clock{margin-top:auto;padding:12px 14px;border-top:1px solid rgba(255,255,255,0.1);font-size:11px;color:rgba(255,255,255,0.4)}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.topbar{background:#fff;border-bottom:1px solid #e8eaed;padding:10px 18px;display:flex;align-items:center;gap:12px}
.topbar-title{font-size:14px;font-weight:600;color:#1a1a2e;flex:1}
.content{flex:1;overflow-y:auto;padding:14px}
.page{display:none}
.page.active{display:block}
.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:7px;border:1px solid #d1d5db;background:#fff;color:#374151;font-size:12px;cursor:pointer;transition:all 0.12s;white-space:nowrap}
.btn:hover{background:#f9fafb;border-color:#9ca3af}
.btn:active{transform:scale(0.97)}
.btn.primary{background:#4a90e2;border-color:#4a90e2;color:#fff}
.btn.primary:hover{background:#3a7bd5}
.btn.success{background:#22c55e;border-color:#22c55e;color:#fff}
.btn.success:hover{background:#16a34a}
.btn.danger{background:#ef4444;border-color:#ef4444;color:#fff}
.btn.danger:hover{background:#dc2626}
.btn.warning{background:#f59e0b;border-color:#f59e0b;color:#fff}
.btn.warning:hover{background:#d97706}
.btn.ghost{background:transparent;border:none;color:#6b7280}
.btn.ghost:hover{background:#f3f4f6}
.btn.sm{padding:5px 10px;font-size:11px}
.btn.lg{padding:9px 18px;font-size:13px}
.btn.full{width:100%;justify-content:center}
.field{margin-bottom:12px}
.field label{display:block;font-size:11px;font-weight:500;color:#6b7280;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.4px}
.field input,.field select,.field textarea{width:100%;padding:8px 10px;border:1px solid #d1d5db;border-radius:7px;font-size:13px;color:#1a1a2e;background:#fff;outline:none;transition:border-color 0.15s}
.field input:focus,.field select:focus,.field textarea:focus{border-color:#4a90e2;box-shadow:0 0 0 3px rgba(74,144,226,0.1)}
.checkbox-row{display:flex;align-items:center;gap:8px;font-size:13px;color:#374151;cursor:pointer;margin:6px 0}
.checkbox-row input[type=checkbox]{width:15px;height:15px;cursor:pointer;accent-color:#4a90e2}
.card{background:#fff;border:1px solid #e8eaed;border-radius:10px;padding:14px}
.card-title{font-size:13px;font-weight:600;color:#1a1a2e;margin-bottom:12px}
.tbl-wrap{background:#fff;border:1px solid #e8eaed;border-radius:10px;overflow:hidden}
table{width:100%;border-collapse:collapse;font-size:13px}
thead tr{background:#f8f9fa}
th{padding:9px 12px;text-align:left;font-size:11px;font-weight:600;color:#6b7280;border-bottom:1px solid #e8eaed;white-space:nowrap;text-transform:uppercase;letter-spacing:0.4px}
td{padding:9px 12px;border-bottom:1px solid #f3f4f6;color:#374151;vertical-align:middle}
tr:last-child td{border-bottom:none}
tbody tr:hover td{background:#fafbfc}
.tag{display:inline-block;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:500}
.tag-blue{background:#dbeafe;color:#1d4ed8}
.tag-green{background:#dcfce7;color:#15803d}
.tag-amber{background:#fef9c3;color:#854d0e}
.tag-red{background:#fee2e2;color:#b91c1c}
.tag-gray{background:#f3f4f6;color:#6b7280}
.tag-canceled{background:#fee2e2;color:#b91c1c;text-decoration:line-through}
.order-canceled td{opacity:0.55}
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px}
.metric{background:#fff;border:1px solid #e8eaed;border-radius:10px;padding:13px 15px}
.metric .m-label{font-size:11px;color:#6b7280;margin-bottom:5px;font-weight:500;text-transform:uppercase;letter-spacing:0.4px}
.metric .m-val{font-size:20px;font-weight:700;color:#1a1a2e}
.metric .m-sub{font-size:11px;color:#9ca3af;margin-top:3px}
.pos-layout{display:grid;grid-template-columns:1fr 310px;gap:12px;height:calc(100vh - 108px);min-height:520px}
.pos-left{display:flex;flex-direction:column;overflow:hidden;min-height:0}
.cat-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.cat-tab{padding:5px 12px;border-radius:99px;border:1px solid #d1d5db;background:#fff;font-size:12px;cursor:pointer;color:#6b7280;transition:all 0.12s;white-space:nowrap}
.cat-tab:hover{border-color:#4a90e2;color:#4a90e2}
.cat-tab.active{background:#4a90e2;border-color:#4a90e2;color:#fff;font-weight:500}
.held-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.held-tab{display:flex;align-items:center;gap:5px;padding:4px 10px;border-radius:99px;border:1px solid #d1d5db;background:#fff;font-size:12px;cursor:pointer;color:#6b7280;transition:all 0.12s}
.held-tab.new-tab{background:#4a90e2;border-color:#4a90e2;color:#fff}
.held-tab.active-held{background:#f59e0b;border-color:#f59e0b;color:#fff}
.held-tab .del-x{opacity:0.7;font-size:11px;margin-left:2px}
.held-tab .del-x:hover{opacity:1}
.menu-grid{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(115px,1fr));gap:8px;align-content:start;padding-right:2px}
.menu-card{background:#fff;border:1px solid #e8eaed;border-radius:9px;padding:10px;cursor:pointer;text-align:center;transition:all 0.12s;user-select:none}
.menu-card:hover{border-color:#4a90e2;background:#eff6ff;transform:translateY(-1px)}
.menu-card:active{transform:scale(0.97)}
.menu-card .mc-cat{font-size:10px;color:#9ca3af;margin-bottom:2px}
.menu-card .mc-name{font-size:12px;font-weight:600;color:#1a1a2e;line-height:1.3;margin-bottom:5px}
.menu-card .mc-price{font-size:13px;color:#4a90e2;font-weight:700}
.order-panel{background:#fff;border:1px solid #e8eaed;border-radius:10px;display:flex;flex-direction:column;overflow:hidden}
.order-header{padding:11px 13px;border-bottom:1px solid #f3f4f6}
.order-header .oh-title{font-size:13px;font-weight:600;color:#1a1a2e}
.order-header .oh-sub{font-size:11px;color:#9ca3af;margin-top:2px}
.order-items{flex:1;overflow-y:auto;padding:8px}
.oi-empty{text-align:center;padding:36px 16px;color:#9ca3af;font-size:13px}
.oi-empty .oi-icon{font-size:28px;display:block;margin-bottom:8px}
.order-item{display:flex;align-items:center;gap:6px;padding:6px 7px;border-radius:7px;margin-bottom:4px;background:#f8f9fa;transition:background 0.1s}
.order-item:hover{background:#f0f2f5}
.oi-name{flex:1;font-size:12px;color:#374151;line-height:1.3}
.oi-price{font-size:12px;color:#6b7280;min-width:62px;text-align:right;white-space:nowrap}
.qty-btn{width:22px;height:22px;border-radius:5px;border:1px solid #d1d5db;background:#fff;cursor:pointer;font-size:14px;font-weight:600;color:#374151;display:flex;align-items:center;justify-content:center;transition:all 0.1s;flex-shrink:0}
.qty-btn:hover{background:#f3f4f6}
.qty-num{font-size:12px;font-weight:600;min-width:18px;text-align:center;color:#1a1a2e}
.order-totals{padding:10px 13px;border-top:1px solid #f3f4f6;font-size:12px}
.tot-row{display:flex;justify-content:space-between;padding:2px 0;color:#6b7280}
.tot-row.grand{font-size:15px;font-weight:700;color:#1a1a2e;border-top:1px solid #e8eaed;margin-top:5px;padding-top:7px}
.order-actions{padding:10px 13px;border-top:1px solid #f3f4f6;display:flex;gap:7px}
.ref-bar{display:flex;gap:8px;margin-bottom:8px;align-items:center}
.ref-bar .rb-label{font-size:12px;color:#6b7280;white-space:nowrap}
.ref-bar input,.ref-bar select{padding:6px 9px;border:1px solid #d1d5db;border-radius:7px;font-size:12px;color:#1a1a2e;background:#fff;outline:none}
.ref-bar input{width:90px}
.ref-bar input:focus,.ref-bar select:focus{border-color:#4a90e2}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(2px)}
.modal{background:#fff;border-radius:12px;width:460px;max-height:92vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.2)}
.modal.wide{width:560px}
.modal-hdr{padding:14px 18px;border-bottom:1px solid #f3f4f6;display:flex;align-items:center;justify-content:space-between}
.modal-hdr span{font-size:14px;font-weight:600;color:#1a1a2e}
.modal-body{padding:18px;overflow-y:auto;flex:1}
.modal-ftr{padding:12px 18px;border-top:1px solid #f3f4f6;display:flex;justify-content:flex-end;gap:8px}
.receipt-preview{font-family:'Courier New',monospace;font-size:11px;line-height:1.65;padding:14px;background:#fafafa;border:1px solid #e8eaed;border-radius:8px;white-space:pre;overflow-x:auto;color:#1a1a2e;margin-bottom:12px}
.print-option-box{background:#f8f9fa;border-radius:8px;padding:12px}
.print-option-box .po-title{font-size:13px;font-weight:600;color:#1a1a2e;margin-bottom:8px}
.notice{border-radius:8px;padding:10px 12px;font-size:12px;margin-bottom:10px}
.notice-blue{background:#dbeafe;color:#1d4ed8}
.notice-amber{background:#fef9c3;color:#854d0e}
.notice-green{background:#dcfce7;color:#15803d}
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.sec-title{font-size:14px;font-weight:600;color:#1a1a2e}
.sec-sub{font-size:12px;color:#9ca3af}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.report-controls{display:flex;gap:8px;margin-bottom:14px;align-items:center;flex-wrap:wrap}
.report-controls label{font-size:12px;color:#6b7280;font-weight:500}
.report-controls input[type=date]{padding:6px 10px;border:1px solid #d1d5db;border-radius:7px;font-size:13px;color:#1a1a2e;background:#fff;outline:none}
.report-controls input[type=date]:focus{border-color:#4a90e2}
@media print{
  body *{visibility:hidden}
  #printArea,#printArea *{visibility:visible}
  #printArea{position:fixed;top:0;left:0;width:76mm;font-family:'Courier New',monospace;font-size:9pt;line-height:1.5;color:#000;background:#fff;margin:0;padding:0;}
}
`;

// ─── Constants ───────────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  sc: 10, vat: 18, sscl: 2.5, tdl: 1,
  enableSC: true, enableVAT: true, enableSSCL: true, enableTDL: false,
  taxInclusive: false,
  restName: "SWAG Solutions Restaurant",
  hotelName: "SWAG Grand Hotel",
  addr: "Colombo 03, Sri Lanka",
  phone: "+94 11 234 5678",
  footer: "Thank you for dining with us!",
  staffNames: ["Kasun", "Nimal", "Amali"],
};

const DEFAULT_ITEMS = [
  { id: 1, name: "Chicken Fried Rice", cat: "Rice & Noodles", price: 950, active: true },
  { id: 2, name: "Prawn Fried Rice", cat: "Rice & Noodles", price: 1250, active: true },
  { id: 3, name: "Veggie Noodles", cat: "Rice & Noodles", price: 750, active: true },
  { id: 4, name: "Chicken 65", cat: "Appetizers", price: 850, active: true },
  { id: 5, name: "Mushroom Soup", cat: "Soups", price: 600, active: true },
  { id: 6, name: "Tom Yum Soup", cat: "Soups", price: 750, active: true },
  { id: 7, name: "Grilled Chicken", cat: "Grills", price: 1600, active: true },
  { id: 8, name: "Fish & Chips", cat: "Seafood", price: 1450, active: true },
  { id: 9, name: "Chocolate Lava Cake", cat: "Desserts", price: 650, active: true },
  { id: 10, name: "Fresh Lime Soda", cat: "Beverages", price: 350, active: true },
  { id: 11, name: "Mango Juice", cat: "Beverages", price: 400, active: true },
  { id: 12, name: "Lion Beer 330ml", cat: "Alcohol", price: 600, active: true },
];

const ITEM_CATEGORIES = [
  "Rice & Noodles", "Appetizers", "Soups", "Grills",
  "Seafood", "Desserts", "Beverages", "Alcohol",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function lsGet(k, def) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; }
}
function lsSet(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (error) { console.warn("Unable to save Resto data", error); }
}
function fmtLKR(n) { return "Rs. " + parseFloat(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function fmtN(n) { return parseFloat(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function pad2(n) { return String(n).padStart(2, "0"); }
function nowStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function calcTotals(items, cfg) {
  const menuTotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  let sub;
  if (cfg.taxInclusive) {
    const scR = cfg.enableSC ? cfg.sc / 100 : 0;
    const ssclR = cfg.enableSSCL ? cfg.sscl / 100 : 0;
    const vatR = cfg.enableVAT === false ? 0 : cfg.vat / 100;
    const tdlR = cfg.enableTDL ? cfg.tdl / 100 : 0;
    const multiplier = (1 + scR) * (1 + ssclR) * (1 + vatR) + tdlR;
    sub = menuTotal / multiplier;
  } else {
    sub = menuTotal;
  }
  const sc = cfg.enableSC ? sub * (cfg.sc / 100) : 0;
  const afterSC = sub + sc;
  const sscl = cfg.enableSSCL ? afterSC * (cfg.sscl / 100) : 0;
  const afterSSCL = afterSC + sscl;
  const vat = cfg.enableVAT === false ? 0 : afterSSCL * (cfg.vat / 100);
  const tdl = cfg.enableTDL ? sub * (cfg.tdl / 100) : 0;
  const total = sub + sc + sscl + vat + tdl;
  return { sub, sc, sscl, vat, tdl, total };
}

// ─── Print Functions ──────────────────────────────────────────────────────────
function doPrint(order, cfg, mode) {
  const isHotel = mode === "hotel";
  const isKOT = mode === "kot";
  const t = isKOT ? null : calcTotals(order.items, cfg);
  const servedBy = order.servedBy
    ? `<div class="info-row"><span>Served by:</span><span>${order.servedBy}</span></div>` : "";

  let bodyHTML = "";
  if (isKOT) {
    bodyHTML = `
      <div class="center bold big">KITCHEN ORDER TICKET</div>
      <div class="divider"></div>
      <div class="info-row"><span>KOT #${String(order.id).padStart(4, "0")}</span><span>${nowStr()}</span></div>
      <div class="info-row"><span>${order.type === "room" ? "Room" : "Table"}:</span><span>${order.ref}</span></div>
      ${servedBy}
      <div class="divider"></div>
      <table class="items"><tbody>
        ${order.items.map(i => `<tr><td class="qty">x${i.qty}</td><td class="iname">${i.name}</td></tr>`).join("")}
      </tbody></table>
      <div class="divider"></div>
      <div class="info-row"><span>Total items:</span><span>${order.items.reduce((a, i) => a + i.qty, 0)}</span></div>`;
  } else {
    const typeLabel = order.type === "room" ? "Room Charge" : order.type === "takeaway" ? "Takeaway" : "Dine In";
    bodyHTML = `
      <div class="center bold big">${cfg.restName}</div>
      ${cfg.hotelName ? `<div class="center">${cfg.hotelName}</div>` : ""}
      <div class="center">${cfg.addr}</div>
      <div class="center">Tel: ${cfg.phone}</div>
      ${isHotel ? '<div class="center bold">** HOTEL FOLIO COPY **</div>' : ""}
      <div class="divider"></div>
      <div class="info-row"><span>Bill:</span><span>#${String(order.id).padStart(4, "0")}</span></div>
      <div class="info-row"><span>Date:</span><span>${nowStr()}</span></div>
      <div class="info-row"><span>${order.type === "room" ? "Room" : "Table"}:</span><span>${order.ref}</span></div>
      <div class="info-row"><span>Type:</span><span>${typeLabel}</span></div>
      ${servedBy}
      <div class="divider"></div>
      <table class="items">
        <thead><tr><th class="iname">Item</th><th class="qty">Qty</th><th class="amt">Amount</th></tr></thead>
        <tbody>${order.items.map(i => `<tr><td class="iname">${i.name}</td><td class="qty">${i.qty}</td><td class="amt">${fmtN(i.price * i.qty)}</td></tr>`).join("")}</tbody>
      </table>
      <div class="divider"></div>
      <div class="tot-row"><span>Subtotal (F&amp;B)</span><span>${fmtN(t.sub)}</span></div>
      ${cfg.enableSC ? `<div class="tot-row"><span>Service Chg (${cfg.sc}%)</span><span>${fmtN(t.sc)}</span></div>` : ""}
      ${cfg.enableSSCL ? `<div class="tot-row"><span>SSCL (${cfg.sscl ?? 2.5}%)</span><span>${fmtN(t.sscl)}</span></div>` : ""}
      ${cfg.enableVAT !== false ? `<div class="tot-row"><span>VAT (${cfg.vat}%)</span><span>${fmtN(t.vat)}</span></div>` : ""}
      ${cfg.enableTDL ? `<div class="tot-row"><span>TDL (${cfg.tdl ?? 1}%)</span><span>${fmtN(t.tdl)}</span></div>` : ""}
      <div class="divider"></div>
      <div class="tot-row grand"><span>TOTAL (LKR)</span><span>${fmtN(t.total)}</span></div>
      <div class="divider"></div>
      <div class="center">${cfg.footer || ""}</div>
      <div class="center small">Powered by SWAG Solutions</div>`;
  }

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${isKOT ? "KOT" : "Receipt"} #${String(order.id).padStart(4, "0")}</title>
<style>
@page{size:80mm auto;margin:4mm 3mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Courier New',Courier,monospace;font-size:10pt;color:#000;background:#fff;width:74mm}
.center{text-align:center;margin:1mm 0}.bold{font-weight:700}.big{font-size:12pt}.small{font-size:8pt}
.divider{border-top:1px dashed #000;margin:3mm 0}
.info-row{display:flex;justify-content:space-between;margin:1mm 0;font-size:9pt}
table.items{width:100%;border-collapse:collapse;margin:1mm 0;font-size:9pt}
table.items th{text-align:left;border-bottom:1px solid #000;padding-bottom:1mm;font-weight:700}
table.items td{padding:0.5mm 0;vertical-align:top}
table.items .iname{width:55%}table.items .qty{width:15%;text-align:center}table.items .amt{width:30%;text-align:right}
.tot-row{display:flex;justify-content:space-between;font-size:9pt;margin:0.8mm 0}
.tot-row.grand{font-size:12pt;font-weight:700;margin:1mm 0}
</style></head><body>
${bodyHTML}
<script>window.onload=function(){window.print();setTimeout(function(){window.close();},1000);};</script>
</body></html>`;

  const title = isKOT ? "KOT" : isHotel ? "Hotel Folio" : "Guest Receipt";
  const pw = window.open("", title, "width=360,height=640,menubar=no,toolbar=no,status=no");
  if (!pw) { alert("Popup blocked! Please allow popups for this page and try again."); return; }
  pw.document.open(); pw.document.write(html); pw.document.close();
}

function printSalesReport(orders, settings, from, to) {
  const filtered = orders.filter(o => {
    const d = new Date(o.time).toISOString().split("T")[0];
    return d >= from && d <= to;
  });
  const active = filtered.filter(o => !o.canceled);
  const canceled = filtered.filter(o => o.canceled);
  const cfg = settings;

  const totalRev = active.reduce((a, o) => a + o.totals.total, 0);
  const totalSub = active.reduce((a, o) => a + o.totals.sub, 0);
  const totalSC = active.reduce((a, o) => a + o.totals.sc, 0);
  const totalVAT = active.reduce((a, o) => a + o.totals.vat, 0);
  const totalSSCL = active.reduce((a, o) => a + (o.totals.sscl || 0), 0);
  const totalTDL = active.reduce((a, o) => a + (o.totals.tdl || 0), 0);
  const roomAmt = active.filter(o => o.type === "room").reduce((a, o) => a + o.totals.total, 0);
  const cashAmt = active.filter(o => o.payment === "cash").reduce((a, o) => a + o.totals.total, 0);
  const cardAmt = active.filter(o => o.payment === "card").reduce((a, o) => a + o.totals.total, 0);
  const canceledAmt = canceled.reduce((a, o) => a + o.totals.total, 0);
  const catSales = {};
  active.forEach(o => o.items.forEach(i => { catSales[i.cat] = (catSales[i.cat] || 0) + i.price * i.qty; }));

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Sales Report</title>
<style>
@page{margin:12mm;size:A4}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:10pt;color:#000;background:#fff}
h1{font-size:16pt;margin:0 0 2px}h2{font-size:11pt;margin:16px 0 6px;border-bottom:1px solid #ccc;padding-bottom:3px}
.sub{font-size:9pt;color:#555;margin-bottom:16px}
table{width:100%;border-collapse:collapse;font-size:9.5pt;margin-bottom:12px}
th{background:#f0f0f0;padding:5px 8px;text-align:left;border:1px solid #ddd;font-weight:600}
td{padding:5px 8px;border:1px solid #ddd}
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}
.met{border:1px solid #ddd;border-radius:5px;padding:8px 10px}
.met .ml{font-size:8pt;color:#666;margin-bottom:3px}.met .mv{font-size:13pt;font-weight:700}
.right{text-align:right}.grand{font-weight:700;background:#f5f5f5}
</style></head><body>
<h1>${cfg.restName}</h1>
<div class="sub">${cfg.hotelName} | ${cfg.addr} | Sales Report: ${from} to ${to} | Printed: ${nowStr()}</div>
<div class="metrics">
  <div class="met"><div class="ml">Total Revenue</div><div class="mv">Rs.${fmtN(totalRev)}</div><div style="font-size:8pt;color:#888">${active.length} paid orders</div></div>
  <div class="met"><div class="ml">F&B Net Sales</div><div class="mv">Rs.${fmtN(totalSub)}</div><div style="font-size:8pt;color:#888">before taxes</div></div>
  <div class="met"><div class="ml">Tax Collected</div><div class="mv">Rs.${fmtN(totalVAT + totalSSCL + totalTDL)}</div><div style="font-size:8pt;color:#888">Enabled taxes only</div></div>
  <div class="met" style="border-color:#fcc"><div class="ml" style="color:#c00">Canceled Bills</div><div class="mv" style="color:#c00">${canceled.length}</div><div style="font-size:8pt;color:#888">Rs.${fmtN(canceledAmt)} voided</div></div>
</div>
<h2>Tax Breakdown</h2>
<table>
  <tr><th>Component</th><th class="right">Rate</th><th class="right">Amount (LKR)</th></tr>
  <tr><td>F&B Net Sales (base)</td><td class="right">—</td><td class="right">Rs.${fmtN(totalSub)}</td></tr>
  <tr><td>Service Charge</td><td class="right">${cfg.sc}%</td><td class="right">Rs.${fmtN(totalSC)}</td></tr>
  <tr><td>SSCL (on base + SC)</td><td class="right">${cfg.sscl ?? 2.5}%</td><td class="right">Rs.${fmtN(totalSSCL)}</td></tr>
  ${cfg.enableVAT !== false ? `<tr><td>VAT (on base + SC + SSCL)</td><td class="right">${cfg.vat}%</td><td class="right">Rs.${fmtN(totalVAT)}</td></tr>` : ""}
  ${(cfg.enableTDL ?? false) ? `<tr><td>TDL (on base only)</td><td class="right">${cfg.tdl ?? 1}%</td><td class="right">Rs.${fmtN(totalTDL)}</td></tr>` : ""}
  <tr class="grand"><td><strong>Total Collected</strong></td><td></td><td class="right"><strong>Rs.${fmtN(totalRev)}</strong></td></tr>
</table>
<h2>Payment Methods</h2>
<table>
  <tr><th>Method</th><th class="right">Amount</th><th class="right">Orders</th></tr>
  <tr><td>Cash</td><td class="right">Rs.${fmtN(cashAmt)}</td><td class="right">${active.filter(o => o.payment === "cash").length}</td></tr>
  <tr><td>Card</td><td class="right">Rs.${fmtN(cardAmt)}</td><td class="right">${active.filter(o => o.payment === "card").length}</td></tr>
  <tr><td>Room Charge</td><td class="right">Rs.${fmtN(roomAmt)}</td><td class="right">${active.filter(o => o.payment === "room").length}</td></tr>
  ${canceled.length ? `<tr style="color:#c00"><td>🚫 Canceled (voided)</td><td class="right">Rs.${fmtN(canceledAmt)}</td><td class="right">${canceled.length}</td></tr>` : ""}
</table>
<h2>Sales by Category</h2>
<table>
  <tr><th>Category</th><th class="right">Revenue</th><th class="right">% of Net Sales</th></tr>
  ${Object.entries(catSales).sort((a, b) => b[1] - a[1]).map(([cat, amt]) =>
    `<tr><td>${cat}</td><td class="right">Rs.${fmtN(amt)}</td><td class="right">${totalSub > 0 ? ((amt / totalSub) * 100).toFixed(1) : "0.0"}%</td></tr>`).join("")}
</table>
${canceled.length ? `<h2 style="color:#c00">Canceled Bills (${canceled.length})</h2>
<table>
  <tr><th>#</th><th>Ref</th><th>Amount</th><th>Reason</th><th>Notes</th><th>Time</th></tr>
  ${canceled.map(o => `<tr style="color:#c00"><td>#${String(o.id).padStart(4, "0")}</td><td>${o.ref}</td><td class="right">Rs.${fmtN(o.totals.total)}</td><td>${o.cancelReason || "—"}</td><td>${o.cancelNote || "—"}</td><td>${new Date(o.cancelTime || o.time).toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" })}</td></tr>`).join("")}
</table>` : ""}
<script>window.onload=function(){window.print();setTimeout(function(){window.close();},800);};</script>
</body></html>`;

  const pw = window.open("", "Sales Report", "width=900,height=700,menubar=no,toolbar=no");
  if (!pw) { alert("Popup blocked!"); return; }
  pw.document.open(); pw.document.write(html); pw.document.close();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function POSPage({ items, settings, nextId, onOrderComplete }) {
  const [curItems, setCurItems] = useState([]);
  const [curCat, setCurCat] = useState("All");
  const [curRef, setCurRef] = useState("T1");
  const [curType, setCurType] = useState("dine_in");
  const [heldOrders, setHeldOrders] = useState([]);
  const [activeHeld, setActiveHeld] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [billPayment, setBillPayment] = useState("cash");
  const staffNames = Array.isArray(settings.staffNames) ? settings.staffNames.filter(Boolean) : DEFAULT_SETTINGS.staffNames;
  const [servedBy, setServedBy] = useState(() => staffNames[0] || "");
  const [printGuest, setPrintGuest] = useState(true);
  const [printHotel, setPrintHotel] = useState(false);
  const [printKOT, setPrintKOT] = useState(false);

  const cats = ["All", ...new Set(items.filter(i => i.active).map(i => i.cat))];
  const visible = items.filter(i => i.active && (curCat === "All" || i.cat === curCat));
  const totals = curItems.length ? calcTotals(curItems, settings) : null;

  const opTitle = (curType === "room" ? "🏨 Room " : "🍽 Table ") + curRef + (activeHeld !== null ? " 🟡" : "");
  const opSub = `${curItems.length} items · ${curItems.reduce((a, i) => a + i.qty, 0)} qty`;

  const addToOrder = (id) => {
    const item = items.find(i => i.id === id);
    setCurItems(prev => {
      const ex = prev.find(x => x.id === id);
      if (ex) return prev.map(x => x.id === id ? { ...x, qty: x.qty + 1 } : x);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const changeQty = (id, d) => {
    setCurItems(prev => {
      const updated = prev.map(x => x.id === id ? { ...x, qty: x.qty + d } : x).filter(x => x.qty > 0);
      return updated;
    });
  };

  const holdOrder = useCallback((items_to_hold = curItems, ref = curRef, type = curType, heldIdx = activeHeld) => {
    if (!items_to_hold.length) return;
    const label = (type === "room" ? "Rm" : "T") + " " + ref;
    const held = { id: Date.now(), ref, type, items: [...items_to_hold], label };
    setHeldOrders(prev => {
      const next = [...prev];
      if (heldIdx !== null) next[heldIdx] = held;
      else next.push(held);
      return next;
    });
  }, [curItems, curRef, curType, activeHeld]);

  const doHold = () => {
    if (!curItems.length) { alert("No items to hold!"); return; }
    holdOrder();
    setCurItems([]); setActiveHeld(null);
  };

  const loadHeld = (i) => {
    if (curItems.length && activeHeld !== i) holdOrder();
    const h = heldOrders[i];
    setCurRef(h.ref); setCurType(h.type);
    setCurItems([...h.items]); setActiveHeld(i);
  };

  const delHeld = (e, i) => {
    e.stopPropagation();
    setHeldOrders(prev => prev.filter((_, idx) => idx !== i));
    if (activeHeld === i) { setCurItems([]); setActiveHeld(null); }
    else if (activeHeld > i) setActiveHeld(activeHeld - 1);
  };

  const newOrder = () => {
    if (curItems.length) doHold();
    else { setCurItems([]); setActiveHeld(null); }
  };

  const openBill = () => {
    if (!curItems.length) { alert("No items in order!"); return; }
    setBillPayment(curType === "room" ? "room" : "cash");
    if (!servedBy && staffNames.length) setServedBy(staffNames[0]);
    setPrintHotel(curType === "room");
    setShowBill(true);
  };

  const confirmBill = () => {
    const order = {
      id: nextId, ref: curRef, type: curType,
      items: [...curItems], time: Date.now(), payment: billPayment, servedBy,
    };
    order.totals = calcTotals(order.items, settings);
    if (printGuest) setTimeout(() => doPrint(order, settings, "guest"), 100);
    if (printHotel) setTimeout(() => doPrint(order, settings, "hotel"), 700);
    if (printKOT) setTimeout(() => doPrint(order, settings, "kot"), 1300);
    onOrderComplete(order);
    if (activeHeld !== null) {
      setHeldOrders(prev => prev.filter((_, i) => i !== activeHeld));
      setActiveHeld(null);
    }
    setCurItems([]); setShowBill(false);
  };

  const receiptPreview = showBill ? buildReceiptText(
    { id: nextId, ref: curRef, type: curType, items: curItems, servedBy },
    settings
  ) : "";

  return (
    <div className="pos-layout">
      {/* Left: Menu */}
      <div className="pos-left">
        {/* Held tabs */}
        <div className="held-tabs">
          {heldOrders.length > 0 && <>
            <div className="held-tab new-tab" onClick={newOrder}>+ New</div>
            {heldOrders.map((h, i) => (
              <div key={h.id} className={`held-tab${activeHeld === i ? " active-held" : ""}`} onClick={() => loadHeld(i)}>
                🟡 {h.label}
                <span className="del-x" onClick={(e) => delHeld(e, i)}>✕</span>
              </div>
            ))}
          </>}
        </div>
        {/* Ref bar */}
        <div className="ref-bar">
          <span className="rb-label">Table/Room:</span>
          <input value={curRef} onChange={e => setCurRef(e.target.value)} placeholder="T1 / R201" />
          <select value={curType} onChange={e => setCurType(e.target.value)}>
            <option value="dine_in">Dine In</option>
            <option value="room">Bill to Room</option>
            <option value="takeaway">Takeaway</option>
          </select>
        </div>
        {/* Category tabs */}
        <div className="cat-tabs">
          {cats.map(c => (
            <div key={c} className={`cat-tab${curCat === c ? " active" : ""}`} onClick={() => setCurCat(c)}>{c}</div>
          ))}
        </div>
        {/* Menu grid */}
        <div className="menu-grid">
          {visible.length ? visible.map(i => (
            <div key={i.id} className="menu-card" onClick={() => addToOrder(i.id)}>
              <div className="mc-cat">{i.cat}</div>
              <div className="mc-name">{i.name}</div>
              <div className="mc-price">{fmtLKR(i.price)}</div>
            </div>
          )) : <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 13 }}>No items</div>}
        </div>
      </div>

      {/* Right: Order panel */}
      <div className="order-panel">
        <div className="order-header">
          <div className="oh-title">{opTitle}</div>
          <div className="oh-sub">{opSub}</div>
        </div>
        <div className="order-items">
          {!curItems.length
            ? <div className="oi-empty"><span className="oi-icon">🛒</span>Click menu items to add</div>
            : curItems.map(i => (
              <div key={i.id} className="order-item">
                <button className="qty-btn" onClick={() => changeQty(i.id, -1)}>−</button>
                <span className="qty-num">{i.qty}</span>
                <button className="qty-btn" onClick={() => changeQty(i.id, 1)}>+</button>
                <span className="oi-name">{i.name}</span>
                <span className="oi-price">{fmtLKR(i.price * i.qty)}</span>
                <button className="qty-btn" style={{ fontSize: 11, color: "#ef4444" }} onClick={() => changeQty(i.id, -i.qty)}>✕</button>
              </div>
            ))
          }
        </div>
        {totals && (
          <div className="order-totals">
            <div className="tot-row"><span>F&B Subtotal</span><span>{fmtLKR(totals.sub)}</span></div>
            {settings.enableSC && <div className="tot-row"><span>Service Charge ({settings.sc}%)</span><span>{fmtLKR(totals.sc)}</span></div>}
            {settings.enableVAT !== false && <div className="tot-row"><span>VAT ({settings.vat}%)</span><span>{fmtLKR(totals.vat)}</span></div>}
            {settings.enableSSCL && <div className="tot-row"><span>SSCL ({settings.sscl}%)</span><span>{fmtLKR(totals.sscl)}</span></div>}
            {settings.enableTDL && <div className="tot-row"><span>TDL ({settings.tdl}%)</span><span>{fmtLKR(totals.tdl)}</span></div>}
            <div className="tot-row grand"><span>TOTAL</span><span>{fmtLKR(totals.total)}</span></div>
          </div>
        )}
        <div className="order-actions">
          <button className="btn danger sm" onClick={() => { setCurItems([]); setActiveHeld(null); }}>🗑 Clear</button>
          <button className="btn warning sm" onClick={doHold}>🟡 Hold</button>
          <button className="btn primary full" onClick={openBill}>🧾 Bill</button>
        </div>
      </div>

      {/* Bill Modal */}
      {showBill && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setShowBill(false); }}>
          <div className="modal wide">
            <div className="modal-hdr">
              <span>Bill #{String(nextId).padStart(4, "0")} — {curType === "room" ? "Room " : "Table "}{curRef}</span>
              <button className="btn ghost sm" onClick={() => setShowBill(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="receipt-preview">{receiptPreview}</div>
              {curType === "room" && (
                <div className="notice notice-blue">🏨 <strong>Bill to Room</strong> — will be posted to hotel folio</div>
              )}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 8 }}>Payment Method</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["cash", "card", "room"].map(p => (
                    <button key={p} className={`btn full${billPayment === p ? " primary" : ""}`} onClick={() => setBillPayment(p)}>
                      {p === "cash" ? "💵 Cash" : p === "card" ? "💳 Card" : "🏨 Room"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Served by</label>
                <select value={servedBy} onChange={e => setServedBy(e.target.value)}>
                  <option value="">Not selected</option>
                  {staffNames.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
              </div>
              <div className="print-option-box">
                <div className="po-title">🖨 Print Options</div>
                <label className="checkbox-row"><input type="checkbox" checked={printGuest} onChange={e => setPrintGuest(e.target.checked)} /> Guest Receipt Copy (80mm)</label>
                <label className="checkbox-row"><input type="checkbox" checked={printHotel} onChange={e => setPrintHotel(e.target.checked)} /> Hotel Folio Copy (80mm)</label>
                <label className="checkbox-row"><input type="checkbox" checked={printKOT} onChange={e => setPrintKOT(e.target.checked)} /> KOT — Kitchen Order Ticket</label>
              </div>
            </div>
            <div className="modal-ftr">
              <button className="btn" onClick={() => setShowBill(false)}>Cancel</button>
              <button className="btn success" onClick={confirmBill}>✅ Confirm & Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function buildReceiptText(order, cfg) {
  const t = calcTotals(order.items, cfg);
  const w = 32;
  const line = "─".repeat(w);
  const center = (s) => s.padStart(Math.floor((w + s.length) / 2)).padEnd(w);
  const row = (l, r) => l + r.padStart(w - l.length);
  let out = "";
  out += center(cfg.restName) + "\n";
  if (cfg.hotelName) out += center(cfg.hotelName) + "\n";
  out += center(cfg.addr) + "\n";
  out += center("Tel: " + cfg.phone) + "\n";
  out += line + "\n";
  out += row(`Bill: #${String(order.id).padStart(4, "0")}`, nowStr()) + "\n";
  out += row(`${order.type === "room" ? "Room" : "Table"}: ${order.ref}`, "") + "\n";
  if (order.servedBy) out += row("Served by:", order.servedBy) + "\n";
  out += line + "\n";
  order.items.forEach(i => {
    out += `${i.name}\n`;
    out += row(`  x${i.qty} @ ${fmtN(i.price)}`, fmtN(i.price * i.qty)) + "\n";
  });
  out += line + "\n";
  out += row("F&B Subtotal", fmtN(t.sub)) + "\n";
  if (cfg.enableSC) out += row(`Service Chg (${cfg.sc}%)`, fmtN(t.sc)) + "\n";
  if (cfg.enableSSCL) out += row(`SSCL (${cfg.sscl}%)`, fmtN(t.sscl)) + "\n";
  if (cfg.enableVAT !== false) out += row(`VAT (${cfg.vat}%)`, fmtN(t.vat)) + "\n";
  if (cfg.enableTDL) out += row(`TDL (${cfg.tdl}%)`, fmtN(t.tdl)) + "\n";
  out += line + "\n";
  out += row("TOTAL (LKR)", fmtN(t.total)) + "\n";
  out += line + "\n";
  out += center(cfg.footer || "") + "\n";
  return out;
}

function OrdersPage({ orders, settings, onCancel }) {
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelReason, setCancelReason] = useState("Customer left");
  const [cancelNote, setCancelNote] = useState("");
  const typeLabel = { dine_in: "Dine In", room: "Room Charge", takeaway: "Takeaway" };

  const exportData = () => {
    const data = { exportedAt: new Date().toISOString(), restaurant: settings.restName, orders, settings };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `pos_backup_${new Date().toISOString().split("T")[0]}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const doCancel = () => {
    onCancel(cancelTarget, cancelReason, cancelNote);
    setCancelTarget(null); setCancelNote("");
  };

  const targetOrder = cancelTarget ? orders.find(o => o.id === cancelTarget) : null;

  return (
    <div>
      <div className="sec-hdr">
        <span className="sec-title">All Orders</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="sec-sub">{orders.length} orders ({orders.filter(o => o.canceled).length} canceled)</span>
          <button className="btn success sm" onClick={exportData}>📥 Export JSON</button>
        </div>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Ref</th><th>Type</th><th>Items</th>
              <th>Subtotal</th><th>SC</th><th>VAT</th><th>SSCL</th><th>TDL</th><th>Total</th>
              <th>Payment</th><th>Served By</th><th>Status</th><th>Time</th><th></th>
            </tr>
          </thead>
          <tbody>
            {orders.length
              ? orders.slice().reverse().map(o => (
                <tr key={o.id} className={o.canceled ? "order-canceled" : ""}>
                  <td>#{String(o.id).padStart(4, "0")}</td>
                  <td><strong>{o.ref}</strong></td>
                  <td><span className={`tag ${o.type === "room" ? "tag-blue" : o.type === "takeaway" ? "tag-amber" : "tag-green"}`}>{typeLabel[o.type] || o.type}</span></td>
                  <td>{o.items.length} items</td>
                  <td>{fmtLKR(o.totals.sub)}</td>
                  <td>{fmtLKR(o.totals.sc)}</td>
                  <td>{fmtLKR(o.totals.vat)}</td>
                  <td>{fmtLKR(o.totals.sscl || 0)}</td>
                  <td>{fmtLKR(o.totals.tdl || 0)}</td>
                  <td><strong>{fmtLKR(o.canceled ? 0 : o.totals.total)}</strong></td>
                  <td><span className="tag tag-gray">{o.payment}</span></td>
                  <td>{o.servedBy || "â€”"}</td>
                  <td>{o.canceled
                    ? <span className="tag tag-red" title={`${o.cancelReason || ""}${o.cancelNote ? ": " + o.cancelNote : ""}`}>🚫 Canceled</span>
                    : <span className="tag tag-green">✅ Paid</span>}
                  </td>
                  <td>{new Date(o.time).toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td style={{ display: "flex", gap: 4 }}>
                    {!o.canceled && <button className="btn sm" onClick={() => doPrint(o, settings, "guest")}>🖨</button>}
                    {!o.canceled && <button className="btn sm danger" onClick={() => setCancelTarget(o.id)}>🚫</button>}
                  </td>
                </tr>
              ))
              : <tr><td colSpan="15" style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>No orders yet</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setCancelTarget(null); }}>
          <div className="modal">
            <div className="modal-hdr">
              <span>🚫 Cancel Bill</span>
              <button className="btn ghost sm" onClick={() => setCancelTarget(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="notice notice-amber">⚠️ This will mark the bill as <strong>CANCELLED</strong>. It will still appear in records with zero revenue impact.</div>
              {targetOrder && <div style={{ fontSize: 12, color: "#6b7280", margin: "8px 0" }}>
                Bill #{String(targetOrder.id).padStart(4, "0")} — {targetOrder.ref} — {fmtLKR(targetOrder.totals.total)}
              </div>}
              <div className="field" style={{ marginTop: 12 }}>
                <label>Cancellation Reason *</label>
                <select value={cancelReason} onChange={e => setCancelReason(e.target.value)}>
                  <option>Customer left</option><option>Wrong order</option>
                  <option>Duplicate bill</option><option>Manager void</option><option>Other</option>
                </select>
              </div>
              <div className="field">
                <label>Notes (optional)</label>
                <input type="text" value={cancelNote} onChange={e => setCancelNote(e.target.value)} placeholder="Add any extra details..." />
              </div>
            </div>
            <div className="modal-ftr">
              <button className="btn" onClick={() => setCancelTarget(null)}>Keep Bill</button>
              <button className="btn danger" onClick={doCancel}>🚫 Cancel Bill</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuPage({ items, onItemsChange }) {
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", cat: "Rice & Noodles", price: "", active: true });

  const openModal = (item) => {
    if (item) { setEditItem(item); setForm({ name: item.name, cat: item.cat, price: item.price, active: item.active }); }
    else { setEditItem(null); setForm({ name: "", cat: "Rice & Noodles", price: "", active: true }); }
    setShowModal(true);
  };

  const saveItem = () => {
    const name = form.name.trim();
    const price = parseFloat(form.price);
    if (!name) { alert("Please enter item name."); return; }
    if (isNaN(price) || price <= 0) { alert("Please enter a valid price."); return; }
    let updated;
    if (editItem) {
      updated = items.map(i => i.id === editItem.id ? { ...i, name, cat: form.cat, price, active: form.active } : i);
    } else {
      updated = [...items, { id: Date.now(), name, cat: form.cat, price, active: form.active }];
    }
    onItemsChange(updated); setShowModal(false);
  };

  const toggleItem = (id) => onItemsChange(items.map(i => i.id === id ? { ...i, active: !i.active } : i));
  const deleteItem = (id) => { if (confirm("Delete this item?")) onItemsChange(items.filter(i => i.id !== id)); };

  return (
    <div>
      <div className="sec-hdr">
        <span className="sec-title">Menu Items ({items.length})</span>
        <button className="btn primary" onClick={() => openModal(null)}>+ Add Item</button>
      </div>
      <div className="tbl-wrap">
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Price (LKR)</th><th>Status</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id}>
                <td><strong>{i.name}</strong></td>
                <td><span className="tag tag-blue">{i.cat}</span></td>
                <td>{fmtLKR(i.price)}</td>
                <td><span className={`tag ${i.active ? "tag-green" : "tag-red"}`}>{i.active ? "Active" : "Inactive"}</span></td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn sm" onClick={() => openModal(i)}>✏ Edit</button>
                  <button className={`btn sm ${i.active ? "warning" : "success"}`} onClick={() => toggleItem(i.id)}>{i.active ? "Disable" : "Enable"}</button>
                  <button className="btn sm danger" onClick={() => deleteItem(i.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-hdr">
              <span>{editItem ? "Edit Item" : "Add Menu Item"}</span>
              <button className="btn ghost sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="field"><label>Item Name *</label>
                <input autoFocus type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && document.getElementById("im_price_jsx")?.focus()} placeholder="e.g. Grilled Salmon" />
              </div>
              <div className="field"><label>Category</label>
                <select value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
                  {ITEM_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field"><label>Price (LKR) *</label>
                <input id="im_price_jsx" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && saveItem()} placeholder="0.00" min="0" step="0.50" />
              </div>
              <label className="checkbox-row">
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                Active — available for sale
              </label>
            </div>
            <div className="modal-ftr">
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn primary" onClick={saveItem}>✅ Save Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPage({ settings, onSave }) {
  const [form, setForm] = useState({ ...settings });
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const save = () => {
    const s = {
      ...form,
      sc: parseFloat(form.sc) || 10,
      vat: parseFloat(form.vat) || 18,
      sscl: parseFloat(form.sscl) || 2.5,
      tdl: parseFloat(form.tdl) || 1,
      staffNames: String(form.staffNamesText ?? (form.staffNames || []).join("\n"))
        .split("\n")
        .map(name => name.trim())
        .filter(Boolean),
    };
    delete s.staffNamesText;
    onSave(s); alert("✅ Settings saved!");
  };

  const inp = (k, type = "text") => ({
    value: form[k] ?? "",
    onChange: e => f(k)(type === "number" ? e.target.value : e.target.value),
    type,
  });
  const chk = (k) => ({ checked: !!form[k], onChange: e => f(k)(e.target.checked) });

  return (
    <div>
      <div className="g2">
        <div className="card">
          <div className="card-title">Tax & Charges</div>
          <div className="field"><label>Service Charge (%)</label><input {...inp("sc", "number")} min="0" max="100" step="0.5" /></div>
          <div className="field"><label>VAT (%)</label><input {...inp("vat", "number")} min="0" max="100" step="0.5" /></div>
          <div className="field"><label>SSCL - Social Security Contribution Levy (%)</label><input {...inp("sscl", "number")} min="0" max="100" step="0.1" /></div>
          <div className="field"><label>TDL - Tourism Development Levy (%) — SLTDA only</label><input {...inp("tdl", "number")} min="0" max="100" step="0.1" /></div>
          <label className="checkbox-row"><input type="checkbox" {...chk("enableSC")} /> Apply Service Charge</label>
          <label className="checkbox-row"><input type="checkbox" {...chk("enableVAT")} /> Apply VAT</label>
          <label className="checkbox-row"><input type="checkbox" {...chk("enableSSCL")} /> Apply SSCL</label>
          <label className="checkbox-row"><input type="checkbox" {...chk("enableTDL")} /> Apply TDL (SLTDA registered)</label>
          <label className="checkbox-row"><input type="checkbox" {...chk("taxInclusive")} /> Menu prices are tax-inclusive (reverse-calculate)</label>
          <div className="notice notice-amber" style={{ marginTop: 10 }}>
            <strong>SL Hotel Tax Cascade:</strong><br />
            Base → +SC(10%) → +SSCL(2.5% on base+SC) → +VAT(18% on base+SC+SSCL) → +TDL(1% on base only)
          </div>
        </div>
        <div className="card">
          <div className="card-title">Restaurant Info</div>
          <div className="field"><label>Restaurant Name</label><input {...inp("restName")} /></div>
          <div className="field"><label>Hotel Name</label><input {...inp("hotelName")} /></div>
          <div className="field"><label>Address</label><input {...inp("addr")} /></div>
          <div className="field"><label>Phone</label><input {...inp("phone")} /></div>
          <div className="field"><label>Receipt Footer Message</label><input {...inp("footer")} /></div>
        </div>
        <div className="card">
          <div className="card-title">Staff / Servers</div>
          <div className="field">
            <label>Server Names</label>
            <textarea
              rows="8"
              value={form.staffNamesText ?? (form.staffNames || []).join("\n")}
              onChange={e => setForm(p => ({ ...p, staffNamesText: e.target.value }))}
              placeholder={"Kasun\nNimal\nAmali"}
            />
          </div>
          <div className="notice notice-blue">
            Add one staff member per line. These names will appear in the Bill screen under Served by.
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
        <button className="btn primary lg" onClick={save}>✅ Save Settings</button>
      </div>
    </div>
  );
}

function ReportsPage({ orders, settings }) {
  const today = new Date().toISOString().split("T")[0];
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  const filtered = orders.filter(o => {
    const d = new Date(o.time).toISOString().split("T")[0];
    return d >= from && d <= to;
  });
  const active = filtered.filter(o => !o.canceled);
  const canceled = filtered.filter(o => o.canceled);

  const totalRev = active.reduce((a, o) => a + o.totals.total, 0);
  const totalSub = active.reduce((a, o) => a + o.totals.sub, 0);
  const totalSC = active.reduce((a, o) => a + o.totals.sc, 0);
  const totalVAT = active.reduce((a, o) => a + o.totals.vat, 0);
  const totalSSCL = active.reduce((a, o) => a + (o.totals.sscl || 0), 0);
  const totalTDL = active.reduce((a, o) => a + (o.totals.tdl || 0), 0);
  const roomAmt = active.filter(o => o.type === "room").reduce((a, o) => a + o.totals.total, 0);
  const cashAmt = active.filter(o => o.payment === "cash").reduce((a, o) => a + o.totals.total, 0);
  const cardAmt = active.filter(o => o.payment === "card").reduce((a, o) => a + o.totals.total, 0);
  const canceledAmt = canceled.reduce((a, o) => a + o.totals.total, 0);
  const catSales = {};
  active.forEach(o => o.items.forEach(i => { catSales[i.cat] = (catSales[i.cat] || 0) + i.price * i.qty; }));

  return (
    <div>
      <div className="report-controls">
        <label>From:</label>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <label>To:</label>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} />
        <button className="btn" onClick={() => printSalesReport(orders, settings, from, to)}>🖨 Print Report</button>
      </div>
      {!filtered.length
        ? <div style={{ textAlign: "center", padding: 48, color: "#9ca3af", fontSize: 13 }}>No orders for this period</div>
        : <>
          <div className="metrics">
            <div className="metric"><div className="m-label">Total Revenue</div><div className="m-val">{fmtLKR(totalRev)}</div><div className="m-sub">{active.length} paid orders</div></div>
            <div className="metric"><div className="m-label">F&B Net Sales</div><div className="m-val">{fmtLKR(totalSub)}</div><div className="m-sub">before taxes</div></div>
            <div className="metric"><div className="m-label">Tax Collected</div><div className="m-val">{fmtLKR(totalVAT + totalSSCL + totalTDL)}</div><div className="m-sub">Enabled taxes only</div></div>
            <div className="metric" style={{ borderColor: "#fee2e2" }}><div className="m-label" style={{ color: "#b91c1c" }}>Canceled</div><div className="m-val" style={{ color: "#b91c1c" }}>{canceled.length}</div><div className="m-sub">voided {fmtLKR(canceledAmt)}</div></div>
          </div>
          <div className="g2" style={{ marginBottom: 12 }}>
            <div className="card">
              <div className="card-title">Tax Breakdown (Cascade)</div>
              <table>
                <tbody>
                  <tr><td>F&B Net Sales (base)</td><td style={{ textAlign: "right" }}>—</td><td style={{ textAlign: "right" }}>{fmtLKR(totalSub)}</td></tr>
                  <tr><td>Service Charge</td><td style={{ textAlign: "right" }}>{settings.sc}%</td><td style={{ textAlign: "right" }}>{fmtLKR(totalSC)}</td></tr>
                  <tr><td>SSCL <small>(on base+SC)</small></td><td style={{ textAlign: "right" }}>{settings.sscl ?? 2.5}%</td><td style={{ textAlign: "right" }}>{fmtLKR(totalSSCL)}</td></tr>
                  {settings.enableVAT !== false && <tr><td>VAT <small>(on base+SC+SSCL)</small></td><td style={{ textAlign: "right" }}>{settings.vat}%</td><td style={{ textAlign: "right" }}>{fmtLKR(totalVAT)}</td></tr>}
                  {(settings.enableTDL ?? false) && <tr><td>TDL <small>(on base only)</small></td><td style={{ textAlign: "right" }}>{settings.tdl ?? 1}%</td><td style={{ textAlign: "right" }}>{fmtLKR(totalTDL)}</td></tr>}
                  <tr style={{ fontWeight: 700, background: "#f8f9fa" }}><td>Total Collected</td><td></td><td style={{ textAlign: "right" }}>{fmtLKR(totalRev)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="card">
              <div className="card-title">Payment Methods</div>
              <table>
                <tbody>
                  <tr><td>💵 Cash</td><td style={{ textAlign: "right" }}>{fmtLKR(cashAmt)}</td><td style={{ textAlign: "right" }}>{active.filter(o => o.payment === "cash").length}</td></tr>
                  <tr><td>💳 Card</td><td style={{ textAlign: "right" }}>{fmtLKR(cardAmt)}</td><td style={{ textAlign: "right" }}>{active.filter(o => o.payment === "card").length}</td></tr>
                  <tr><td>🏨 Room</td><td style={{ textAlign: "right" }}>{fmtLKR(roomAmt)}</td><td style={{ textAlign: "right" }}>{active.filter(o => o.payment === "room").length}</td></tr>
                  <tr style={{ color: "#b91c1c" }}><td>🚫 Canceled</td><td style={{ textAlign: "right" }}>{fmtLKR(canceledAmt)}</td><td style={{ textAlign: "right" }}>{canceled.length}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">Sales by Category</div>
            <table>
              <tbody>
                {Object.entries(catSales).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
                  <tr key={cat}>
                    <td>{cat}</td>
                    <td style={{ textAlign: "right" }}>{fmtLKR(amt)}</td>
                    <td style={{ textAlign: "right" }}>{totalSub > 0 ? ((amt / totalSub) * 100).toFixed(1) : "0.0"}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {canceled.length > 0 && (
            <div className="card" style={{ borderColor: "#fee2e2" }}>
              <div className="card-title" style={{ color: "#b91c1c" }}>🚫 Canceled Bills ({canceled.length})</div>
              <table>
                <thead><tr><th>#</th><th>Ref</th><th>Amount</th><th>Reason</th><th>Notes</th><th>Time</th></tr></thead>
                <tbody>
                  {canceled.map(o => (
                    <tr key={o.id} style={{ color: "#b91c1c" }}>
                      <td>#{String(o.id).padStart(4, "0")}</td>
                      <td>{o.ref}</td>
                      <td>{fmtLKR(o.totals.total)}</td>
                      <td>{o.cancelReason || "—"}</td>
                      <td>{o.cancelNote || "—"}</td>
                      <td>{new Date(o.cancelTime || o.time).toLocaleTimeString("en-LK", { hour: "2-digit", minute: "2-digit" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function RestaurantPOS() {
  useEffect(() => {
    document.title = "Resto Restaurant POS - Utility Tool | Swag Solutions";
  }, []);

  const [page, setPage] = useState("pos");
  const [items, setItems] = useState(() => lsGet("pos_items", DEFAULT_ITEMS));
  const [orders, setOrders] = useState(() => lsGet("pos_orders", []));
  const [settings, setSettings] = useState(() => lsGet("pos_settings", DEFAULT_SETTINGS));
  const [nextId, setNextId] = useState(() => lsGet("pos_nextId", 1001));
  const [clock, setClock] = useState(() => new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.warn("Fullscreen request failed", error);
    }
  };

  const saveItems = (updated) => { setItems(updated); lsSet("pos_items", updated); };
  const saveSettings = (s) => { setSettings(s); lsSet("pos_settings", s); };

  const handleOrderComplete = (order) => {
    const newOrders = [...orders, order];
    const newNextId = nextId + 1;
    setOrders(newOrders); lsSet("pos_orders", newOrders);
    setNextId(newNextId); lsSet("pos_nextId", newNextId);
  };

  const handleCancel = (id, reason, note) => {
    const updated = orders.map(o => o.id === id
      ? { ...o, canceled: true, cancelReason: reason, cancelNote: note, cancelTime: Date.now() }
      : o);
    setOrders(updated); lsSet("pos_orders", updated);
  };

  const pageTitles = { pos: "New Order", orders: "Orders", menu: "Menu Management", settings: "Settings", reports: "Sales Report" };
  const navItems = [
    { id: "pos", icon: "🛒", label: "New Order" },
    { id: "orders", icon: "🧾", label: "Orders", badge: orders.length || null },
    { id: "menu", icon: "🍽", label: "Menu Items" },
    { id: "settings", icon: "⚙️", label: "Settings" },
    { id: "reports", icon: "📊", label: "Sales Report" },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="resto-page app">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="name">🍽 SWAG Restaurant</div>
            <div className="sub">Hotel POS System</div>
          </div>
          <div style={{ padding: "6px 0", flex: 1 }}>
            {navItems.map(n => (
              <div key={n.id} className={`nav-item${page === n.id ? " active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="icon">{n.icon}</span>
                {n.label}
                {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
              </div>
            ))}
          </div>
          <div className="sidebar-clock">
            <div>{pad2(clock.getHours())}:{pad2(clock.getMinutes())}:{pad2(clock.getSeconds())}</div>
            <div style={{ marginTop: 2 }}>{clock.toLocaleDateString("en-LK", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          <div className="topbar">
            <span className="topbar-title">{pageTitles[page]}</span>
            <button className="btn sm" onClick={toggleFullscreen}>
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </button>
          </div>
          <div className="content">
            {page === "pos" && (
              <POSPage
                items={items} settings={settings}
                nextId={nextId}
                onOrderComplete={handleOrderComplete}
              />
            )}
            {page === "orders" && <OrdersPage orders={orders} settings={settings} onCancel={handleCancel} />}
            {page === "menu" && <MenuPage items={items} onItemsChange={saveItems} />}
            {page === "settings" && <SettingsPage settings={settings} onSave={saveSettings} />}
            {page === "reports" && <ReportsPage orders={orders} settings={settings} />}
          </div>
        </div>
      </div>
    </>
  );
}
