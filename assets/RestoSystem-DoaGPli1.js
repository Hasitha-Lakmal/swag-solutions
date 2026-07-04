import{i as e,n as t,t as n}from"./jsx-runtime-CUBmso4R.js";var r=e(t(),1),i=n(),a=`
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
`,o={sc:10,vat:18,sscl:2.5,tdl:1,enableSC:!0,enableVAT:!0,enableSSCL:!0,enableTDL:!1,taxInclusive:!1,restName:`SWAG Solutions Restaurant`,hotelName:`SWAG Grand Hotel`,addr:`Colombo 03, Sri Lanka`,phone:`+94 11 234 5678`,footer:`Thank you for dining with us!`,staffNames:[`Kasun`,`Nimal`,`Amali`]},s=[{id:1,name:`Chicken Fried Rice`,cat:`Rice & Noodles`,price:950,active:!0},{id:2,name:`Prawn Fried Rice`,cat:`Rice & Noodles`,price:1250,active:!0},{id:3,name:`Veggie Noodles`,cat:`Rice & Noodles`,price:750,active:!0},{id:4,name:`Chicken 65`,cat:`Appetizers`,price:850,active:!0},{id:5,name:`Mushroom Soup`,cat:`Soups`,price:600,active:!0},{id:6,name:`Tom Yum Soup`,cat:`Soups`,price:750,active:!0},{id:7,name:`Grilled Chicken`,cat:`Grills`,price:1600,active:!0},{id:8,name:`Fish & Chips`,cat:`Seafood`,price:1450,active:!0},{id:9,name:`Chocolate Lava Cake`,cat:`Desserts`,price:650,active:!0},{id:10,name:`Fresh Lime Soda`,cat:`Beverages`,price:350,active:!0},{id:11,name:`Mango Juice`,cat:`Beverages`,price:400,active:!0},{id:12,name:`Lion Beer 330ml`,cat:`Alcohol`,price:600,active:!0}],c=[`Rice & Noodles`,`Appetizers`,`Soups`,`Grills`,`Seafood`,`Desserts`,`Beverages`,`Alcohol`];function l(e,t){try{let n=localStorage.getItem(e);return n?JSON.parse(n):t}catch{return t}}function u(e,t){try{localStorage.setItem(e,JSON.stringify(t))}catch(e){console.warn(`Unable to save Resto data`,e)}}function d(e){return`Rs. `+parseFloat(e).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,`,`)}function f(e){return parseFloat(e).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,`,`)}function p(e){return String(e).padStart(2,`0`)}function m(){let e=new Date;return`${e.getFullYear()}-${p(e.getMonth()+1)}-${p(e.getDate())} ${p(e.getHours())}:${p(e.getMinutes())}`}function h(e,t){let n=e.reduce((e,t)=>e+t.price*t.qty,0),r;if(t.taxInclusive){let e=t.enableSC?t.sc/100:0,i=t.enableSSCL?t.sscl/100:0,a=t.enableVAT===!1?0:t.vat/100,o=t.enableTDL?t.tdl/100:0;r=n/((1+e)*(1+i)*(1+a)+o)}else r=n;let i=t.enableSC?r*(t.sc/100):0,a=r+i,o=t.enableSSCL?a*(t.sscl/100):0,s=a+o,c=t.enableVAT===!1?0:s*(t.vat/100),l=t.enableTDL?r*(t.tdl/100):0,u=r+i+o+c+l;return{sub:r,sc:i,sscl:o,vat:c,tdl:l,total:u}}function g(e,t,n){let r=n===`hotel`,i=n===`kot`,a=i?null:h(e.items,t),o=e.servedBy?`<div class="info-row"><span>Served by:</span><span>${e.servedBy}</span></div>`:``,s=``;if(i)s=`
      <div class="center bold big">KITCHEN ORDER TICKET</div>
      <div class="divider"></div>
      <div class="info-row"><span>KOT #${String(e.id).padStart(4,`0`)}</span><span>${m()}</span></div>
      <div class="info-row"><span>${e.type===`room`?`Room`:`Table`}:</span><span>${e.ref}</span></div>
      ${o}
      <div class="divider"></div>
      <table class="items"><tbody>
        ${e.items.map(e=>`<tr><td class="qty">x${e.qty}</td><td class="iname">${e.name}</td></tr>`).join(``)}
      </tbody></table>
      <div class="divider"></div>
      <div class="info-row"><span>Total items:</span><span>${e.items.reduce((e,t)=>e+t.qty,0)}</span></div>`;else{let n=e.type===`room`?`Room Charge`:e.type===`takeaway`?`Takeaway`:`Dine In`;s=`
      <div class="center bold big">${t.restName}</div>
      ${t.hotelName?`<div class="center">${t.hotelName}</div>`:``}
      <div class="center">${t.addr}</div>
      <div class="center">Tel: ${t.phone}</div>
      ${r?`<div class="center bold">** HOTEL FOLIO COPY **</div>`:``}
      <div class="divider"></div>
      <div class="info-row"><span>Bill:</span><span>#${String(e.id).padStart(4,`0`)}</span></div>
      <div class="info-row"><span>Date:</span><span>${m()}</span></div>
      <div class="info-row"><span>${e.type===`room`?`Room`:`Table`}:</span><span>${e.ref}</span></div>
      <div class="info-row"><span>Type:</span><span>${n}</span></div>
      ${o}
      <div class="divider"></div>
      <table class="items">
        <thead><tr><th class="iname">Item</th><th class="qty">Qty</th><th class="amt">Amount</th></tr></thead>
        <tbody>${e.items.map(e=>`<tr><td class="iname">${e.name}</td><td class="qty">${e.qty}</td><td class="amt">${f(e.price*e.qty)}</td></tr>`).join(``)}</tbody>
      </table>
      <div class="divider"></div>
      <div class="tot-row"><span>Subtotal (F&amp;B)</span><span>${f(a.sub)}</span></div>
      ${t.enableSC?`<div class="tot-row"><span>Service Chg (${t.sc}%)</span><span>${f(a.sc)}</span></div>`:``}
      ${t.enableSSCL?`<div class="tot-row"><span>SSCL (${t.sscl??2.5}%)</span><span>${f(a.sscl)}</span></div>`:``}
      ${t.enableVAT===!1?``:`<div class="tot-row"><span>VAT (${t.vat}%)</span><span>${f(a.vat)}</span></div>`}
      ${t.enableTDL?`<div class="tot-row"><span>TDL (${t.tdl??1}%)</span><span>${f(a.tdl)}</span></div>`:``}
      <div class="divider"></div>
      <div class="tot-row grand"><span>TOTAL (LKR)</span><span>${f(a.total)}</span></div>
      <div class="divider"></div>
      <div class="center">${t.footer||``}</div>
      <div class="center small">Powered by SWAG Solutions</div>`}let c=`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${i?`KOT`:`Receipt`} #${String(e.id).padStart(4,`0`)}</title>
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
${s}
<script>window.onload=function(){window.print();setTimeout(function(){window.close();},1000);};<\/script>
</body></html>`,l=i?`KOT`:r?`Hotel Folio`:`Guest Receipt`,u=window.open(``,l,`width=360,height=640,menubar=no,toolbar=no,status=no`);if(!u){alert(`Popup blocked! Please allow popups for this page and try again.`);return}u.document.open(),u.document.write(c),u.document.close()}function _(e,t,n,r){let i=e.filter(e=>{let t=new Date(e.time).toISOString().split(`T`)[0];return t>=n&&t<=r}),a=i.filter(e=>!e.canceled),o=i.filter(e=>e.canceled),s=t,c=a.reduce((e,t)=>e+t.totals.total,0),l=a.reduce((e,t)=>e+t.totals.sub,0),u=a.reduce((e,t)=>e+t.totals.sc,0),d=a.reduce((e,t)=>e+t.totals.vat,0),p=a.reduce((e,t)=>e+(t.totals.sscl||0),0),h=a.reduce((e,t)=>e+(t.totals.tdl||0),0),g=a.filter(e=>e.type===`room`).reduce((e,t)=>e+t.totals.total,0),_=a.filter(e=>e.payment===`cash`).reduce((e,t)=>e+t.totals.total,0),v=a.filter(e=>e.payment===`card`).reduce((e,t)=>e+t.totals.total,0),y=o.reduce((e,t)=>e+t.totals.total,0),b={};a.forEach(e=>e.items.forEach(e=>{b[e.cat]=(b[e.cat]||0)+e.price*e.qty}));let x=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Sales Report</title>
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
<h1>${s.restName}</h1>
<div class="sub">${s.hotelName} | ${s.addr} | Sales Report: ${n} to ${r} | Printed: ${m()}</div>
<div class="metrics">
  <div class="met"><div class="ml">Total Revenue</div><div class="mv">Rs.${f(c)}</div><div style="font-size:8pt;color:#888">${a.length} paid orders</div></div>
  <div class="met"><div class="ml">F&B Net Sales</div><div class="mv">Rs.${f(l)}</div><div style="font-size:8pt;color:#888">before taxes</div></div>
  <div class="met"><div class="ml">Tax Collected</div><div class="mv">Rs.${f(d+p+h)}</div><div style="font-size:8pt;color:#888">Enabled taxes only</div></div>
  <div class="met" style="border-color:#fcc"><div class="ml" style="color:#c00">Canceled Bills</div><div class="mv" style="color:#c00">${o.length}</div><div style="font-size:8pt;color:#888">Rs.${f(y)} voided</div></div>
</div>
<h2>Tax Breakdown</h2>
<table>
  <tr><th>Component</th><th class="right">Rate</th><th class="right">Amount (LKR)</th></tr>
  <tr><td>F&B Net Sales (base)</td><td class="right">—</td><td class="right">Rs.${f(l)}</td></tr>
  <tr><td>Service Charge</td><td class="right">${s.sc}%</td><td class="right">Rs.${f(u)}</td></tr>
  <tr><td>SSCL (on base + SC)</td><td class="right">${s.sscl??2.5}%</td><td class="right">Rs.${f(p)}</td></tr>
  ${s.enableVAT===!1?``:`<tr><td>VAT (on base + SC + SSCL)</td><td class="right">${s.vat}%</td><td class="right">Rs.${f(d)}</td></tr>`}
  ${s.enableTDL??!1?`<tr><td>TDL (on base only)</td><td class="right">${s.tdl??1}%</td><td class="right">Rs.${f(h)}</td></tr>`:``}
  <tr class="grand"><td><strong>Total Collected</strong></td><td></td><td class="right"><strong>Rs.${f(c)}</strong></td></tr>
</table>
<h2>Payment Methods</h2>
<table>
  <tr><th>Method</th><th class="right">Amount</th><th class="right">Orders</th></tr>
  <tr><td>Cash</td><td class="right">Rs.${f(_)}</td><td class="right">${a.filter(e=>e.payment===`cash`).length}</td></tr>
  <tr><td>Card</td><td class="right">Rs.${f(v)}</td><td class="right">${a.filter(e=>e.payment===`card`).length}</td></tr>
  <tr><td>Room Charge</td><td class="right">Rs.${f(g)}</td><td class="right">${a.filter(e=>e.payment===`room`).length}</td></tr>
  ${o.length?`<tr style="color:#c00"><td>🚫 Canceled (voided)</td><td class="right">Rs.${f(y)}</td><td class="right">${o.length}</td></tr>`:``}
</table>
<h2>Sales by Category</h2>
<table>
  <tr><th>Category</th><th class="right">Revenue</th><th class="right">% of Net Sales</th></tr>
  ${Object.entries(b).sort((e,t)=>t[1]-e[1]).map(([e,t])=>`<tr><td>${e}</td><td class="right">Rs.${f(t)}</td><td class="right">${l>0?(t/l*100).toFixed(1):`0.0`}%</td></tr>`).join(``)}
</table>
${o.length?`<h2 style="color:#c00">Canceled Bills (${o.length})</h2>
<table>
  <tr><th>#</th><th>Ref</th><th>Amount</th><th>Reason</th><th>Notes</th><th>Time</th></tr>
  ${o.map(e=>`<tr style="color:#c00"><td>#${String(e.id).padStart(4,`0`)}</td><td>${e.ref}</td><td class="right">Rs.${f(e.totals.total)}</td><td>${e.cancelReason||`—`}</td><td>${e.cancelNote||`—`}</td><td>${new Date(e.cancelTime||e.time).toLocaleTimeString(`en-LK`,{hour:`2-digit`,minute:`2-digit`})}</td></tr>`).join(``)}
</table>`:``}
<script>window.onload=function(){window.print();setTimeout(function(){window.close();},800);};<\/script>
</body></html>`,S=window.open(``,`Sales Report`,`width=900,height=700,menubar=no,toolbar=no`);if(!S){alert(`Popup blocked!`);return}S.document.open(),S.document.write(x),S.document.close()}function v({items:e,settings:t,nextId:n,onOrderComplete:a}){let[s,c]=(0,r.useState)([]),[l,u]=(0,r.useState)(`All`),[f,p]=(0,r.useState)(`T1`),[m,_]=(0,r.useState)(`dine_in`),[v,b]=(0,r.useState)([]),[x,S]=(0,r.useState)(null),[C,w]=(0,r.useState)(!1),[T,E]=(0,r.useState)(`cash`),D=Array.isArray(t.staffNames)?t.staffNames.filter(Boolean):o.staffNames,[O,k]=(0,r.useState)(()=>D[0]||``),[A,j]=(0,r.useState)(!0),[M,N]=(0,r.useState)(!1),[P,F]=(0,r.useState)(!1),I=[`All`,...new Set(e.filter(e=>e.active).map(e=>e.cat))],L=e.filter(e=>e.active&&(l===`All`||e.cat===l)),R=s.length?h(s,t):null,z=(m===`room`?`🏨 Room `:`🍽 Table `)+f+(x===null?``:` 🟡`),B=`${s.length} items · ${s.reduce((e,t)=>e+t.qty,0)} qty`,V=t=>{let n=e.find(e=>e.id===t);c(e=>e.find(e=>e.id===t)?e.map(e=>e.id===t?{...e,qty:e.qty+1}:e):[...e,{...n,qty:1}])},H=(e,t)=>{c(n=>n.map(n=>n.id===e?{...n,qty:n.qty+t}:n).filter(e=>e.qty>0))},U=(0,r.useCallback)((e=s,t=f,n=m,r=x)=>{if(!e.length)return;let i=(n===`room`?`Rm`:`T`)+` `+t,a={id:Date.now(),ref:t,type:n,items:[...e],label:i};b(e=>{let t=[...e];return r===null?t.push(a):t[r]=a,t})},[s,f,m,x]),W=()=>{if(!s.length){alert(`No items to hold!`);return}U(),c([]),S(null)},G=e=>{s.length&&x!==e&&U();let t=v[e];p(t.ref),_(t.type),c([...t.items]),S(e)},K=(e,t)=>{e.stopPropagation(),b(e=>e.filter((e,n)=>n!==t)),x===t?(c([]),S(null)):x>t&&S(x-1)},q=()=>{s.length?W():(c([]),S(null))},J=()=>{if(!s.length){alert(`No items in order!`);return}E(m===`room`?`room`:`cash`),!O&&D.length&&k(D[0]),N(m===`room`),w(!0)},Y=()=>{let e={id:n,ref:f,type:m,items:[...s],time:Date.now(),payment:T,servedBy:O};e.totals=h(e.items,t),A&&setTimeout(()=>g(e,t,`guest`),100),M&&setTimeout(()=>g(e,t,`hotel`),700),P&&setTimeout(()=>g(e,t,`kot`),1300),a(e),x!==null&&(b(e=>e.filter((e,t)=>t!==x)),S(null)),c([]),w(!1)},X=C?y({id:n,ref:f,type:m,items:s,servedBy:O},t):``;return(0,i.jsxs)(`div`,{className:`pos-layout`,children:[(0,i.jsxs)(`div`,{className:`pos-left`,children:[(0,i.jsx)(`div`,{className:`held-tabs`,children:v.length>0&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`div`,{className:`held-tab new-tab`,onClick:q,children:`+ New`}),v.map((e,t)=>(0,i.jsxs)(`div`,{className:`held-tab${x===t?` active-held`:``}`,onClick:()=>G(t),children:[`🟡 `,e.label,(0,i.jsx)(`span`,{className:`del-x`,onClick:e=>K(e,t),children:`✕`})]},e.id))]})}),(0,i.jsxs)(`div`,{className:`ref-bar`,children:[(0,i.jsx)(`span`,{className:`rb-label`,children:`Table/Room:`}),(0,i.jsx)(`input`,{value:f,onChange:e=>p(e.target.value),placeholder:`T1 / R201`}),(0,i.jsxs)(`select`,{value:m,onChange:e=>_(e.target.value),children:[(0,i.jsx)(`option`,{value:`dine_in`,children:`Dine In`}),(0,i.jsx)(`option`,{value:`room`,children:`Bill to Room`}),(0,i.jsx)(`option`,{value:`takeaway`,children:`Takeaway`})]})]}),(0,i.jsx)(`div`,{className:`cat-tabs`,children:I.map(e=>(0,i.jsx)(`div`,{className:`cat-tab${l===e?` active`:``}`,onClick:()=>u(e),children:e},e))}),(0,i.jsx)(`div`,{className:`menu-grid`,children:L.length?L.map(e=>(0,i.jsxs)(`div`,{className:`menu-card`,onClick:()=>V(e.id),children:[(0,i.jsx)(`div`,{className:`mc-cat`,children:e.cat}),(0,i.jsx)(`div`,{className:`mc-name`,children:e.name}),(0,i.jsx)(`div`,{className:`mc-price`,children:d(e.price)})]},e.id)):(0,i.jsx)(`div`,{style:{gridColumn:`1/-1`,textAlign:`center`,padding:40,color:`#9ca3af`,fontSize:13},children:`No items`})})]}),(0,i.jsxs)(`div`,{className:`order-panel`,children:[(0,i.jsxs)(`div`,{className:`order-header`,children:[(0,i.jsx)(`div`,{className:`oh-title`,children:z}),(0,i.jsx)(`div`,{className:`oh-sub`,children:B})]}),(0,i.jsx)(`div`,{className:`order-items`,children:s.length?s.map(e=>(0,i.jsxs)(`div`,{className:`order-item`,children:[(0,i.jsx)(`button`,{className:`qty-btn`,onClick:()=>H(e.id,-1),children:`−`}),(0,i.jsx)(`span`,{className:`qty-num`,children:e.qty}),(0,i.jsx)(`button`,{className:`qty-btn`,onClick:()=>H(e.id,1),children:`+`}),(0,i.jsx)(`span`,{className:`oi-name`,children:e.name}),(0,i.jsx)(`span`,{className:`oi-price`,children:d(e.price*e.qty)}),(0,i.jsx)(`button`,{className:`qty-btn`,style:{fontSize:11,color:`#ef4444`},onClick:()=>H(e.id,-e.qty),children:`✕`})]},e.id)):(0,i.jsxs)(`div`,{className:`oi-empty`,children:[(0,i.jsx)(`span`,{className:`oi-icon`,children:`🛒`}),`Click menu items to add`]})}),R&&(0,i.jsxs)(`div`,{className:`order-totals`,children:[(0,i.jsxs)(`div`,{className:`tot-row`,children:[(0,i.jsx)(`span`,{children:`F&B Subtotal`}),(0,i.jsx)(`span`,{children:d(R.sub)})]}),t.enableSC&&(0,i.jsxs)(`div`,{className:`tot-row`,children:[(0,i.jsxs)(`span`,{children:[`Service Charge (`,t.sc,`%)`]}),(0,i.jsx)(`span`,{children:d(R.sc)})]}),t.enableVAT!==!1&&(0,i.jsxs)(`div`,{className:`tot-row`,children:[(0,i.jsxs)(`span`,{children:[`VAT (`,t.vat,`%)`]}),(0,i.jsx)(`span`,{children:d(R.vat)})]}),t.enableSSCL&&(0,i.jsxs)(`div`,{className:`tot-row`,children:[(0,i.jsxs)(`span`,{children:[`SSCL (`,t.sscl,`%)`]}),(0,i.jsx)(`span`,{children:d(R.sscl)})]}),t.enableTDL&&(0,i.jsxs)(`div`,{className:`tot-row`,children:[(0,i.jsxs)(`span`,{children:[`TDL (`,t.tdl,`%)`]}),(0,i.jsx)(`span`,{children:d(R.tdl)})]}),(0,i.jsxs)(`div`,{className:`tot-row grand`,children:[(0,i.jsx)(`span`,{children:`TOTAL`}),(0,i.jsx)(`span`,{children:d(R.total)})]})]}),(0,i.jsxs)(`div`,{className:`order-actions`,children:[(0,i.jsx)(`button`,{className:`btn danger sm`,onClick:()=>{c([]),S(null)},children:`🗑 Clear`}),(0,i.jsx)(`button`,{className:`btn warning sm`,onClick:W,children:`🟡 Hold`}),(0,i.jsx)(`button`,{className:`btn primary full`,onClick:J,children:`🧾 Bill`})]})]}),C&&(0,i.jsx)(`div`,{className:`modal-bg`,onClick:e=>{e.target===e.currentTarget&&w(!1)},children:(0,i.jsxs)(`div`,{className:`modal wide`,children:[(0,i.jsxs)(`div`,{className:`modal-hdr`,children:[(0,i.jsxs)(`span`,{children:[`Bill #`,String(n).padStart(4,`0`),` — `,m===`room`?`Room `:`Table `,f]}),(0,i.jsx)(`button`,{className:`btn ghost sm`,onClick:()=>w(!1),children:`✕`})]}),(0,i.jsxs)(`div`,{className:`modal-body`,children:[(0,i.jsx)(`div`,{className:`receipt-preview`,children:X}),m===`room`&&(0,i.jsxs)(`div`,{className:`notice notice-blue`,children:[`🏨 `,(0,i.jsx)(`strong`,{children:`Bill to Room`}),` — will be posted to hotel folio`]}),(0,i.jsxs)(`div`,{style:{marginBottom:12},children:[(0,i.jsx)(`div`,{style:{fontSize:13,fontWeight:600,color:`#1a1a2e`,marginBottom:8},children:`Payment Method`}),(0,i.jsx)(`div`,{style:{display:`flex`,gap:8},children:[`cash`,`card`,`room`].map(e=>(0,i.jsx)(`button`,{className:`btn full${T===e?` primary`:``}`,onClick:()=>E(e),children:e===`cash`?`💵 Cash`:e===`card`?`💳 Card`:`🏨 Room`},e))})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Served by`}),(0,i.jsxs)(`select`,{value:O,onChange:e=>k(e.target.value),children:[(0,i.jsx)(`option`,{value:``,children:`Not selected`}),D.map(e=>(0,i.jsx)(`option`,{value:e,children:e},e))]})]}),(0,i.jsxs)(`div`,{className:`print-option-box`,children:[(0,i.jsx)(`div`,{className:`po-title`,children:`🖨 Print Options`}),(0,i.jsxs)(`label`,{className:`checkbox-row`,children:[(0,i.jsx)(`input`,{type:`checkbox`,checked:A,onChange:e=>j(e.target.checked)}),` Guest Receipt Copy (80mm)`]}),(0,i.jsxs)(`label`,{className:`checkbox-row`,children:[(0,i.jsx)(`input`,{type:`checkbox`,checked:M,onChange:e=>N(e.target.checked)}),` Hotel Folio Copy (80mm)`]}),(0,i.jsxs)(`label`,{className:`checkbox-row`,children:[(0,i.jsx)(`input`,{type:`checkbox`,checked:P,onChange:e=>F(e.target.checked)}),` KOT — Kitchen Order Ticket`]})]})]}),(0,i.jsxs)(`div`,{className:`modal-ftr`,children:[(0,i.jsx)(`button`,{className:`btn`,onClick:()=>w(!1),children:`Cancel`}),(0,i.jsx)(`button`,{className:`btn success`,onClick:Y,children:`✅ Confirm & Print`})]})]})})]})}function y(e,t){let n=h(e.items,t),r=`─`.repeat(32),i=e=>e.padStart(Math.floor((32+e.length)/2)).padEnd(32),a=(e,t)=>e+t.padStart(32-e.length),o=``;return o+=i(t.restName)+`
`,t.hotelName&&(o+=i(t.hotelName)+`
`),o+=i(t.addr)+`
`,o+=i(`Tel: `+t.phone)+`
`,o+=r+`
`,o+=a(`Bill: #${String(e.id).padStart(4,`0`)}`,m())+`
`,o+=a(`${e.type===`room`?`Room`:`Table`}: ${e.ref}`,``)+`
`,e.servedBy&&(o+=a(`Served by:`,e.servedBy)+`
`),o+=r+`
`,e.items.forEach(e=>{o+=`${e.name}\n`,o+=a(`  x${e.qty} @ ${f(e.price)}`,f(e.price*e.qty))+`
`}),o+=r+`
`,o+=a(`F&B Subtotal`,f(n.sub))+`
`,t.enableSC&&(o+=a(`Service Chg (${t.sc}%)`,f(n.sc))+`
`),t.enableSSCL&&(o+=a(`SSCL (${t.sscl}%)`,f(n.sscl))+`
`),t.enableVAT!==!1&&(o+=a(`VAT (${t.vat}%)`,f(n.vat))+`
`),t.enableTDL&&(o+=a(`TDL (${t.tdl}%)`,f(n.tdl))+`
`),o+=r+`
`,o+=a(`TOTAL (LKR)`,f(n.total))+`
`,o+=r+`
`,o+=i(t.footer||``)+`
`,o}function b({orders:e,settings:t,onCancel:n}){let[a,o]=(0,r.useState)(null),[s,c]=(0,r.useState)(`Customer left`),[l,u]=(0,r.useState)(``),f={dine_in:`Dine In`,room:`Room Charge`,takeaway:`Takeaway`},p=()=>{let n={exportedAt:new Date().toISOString(),restaurant:t.restName,orders:e,settings:t},r=new Blob([JSON.stringify(n,null,2)],{type:`application/json`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=`pos_backup_${new Date().toISOString().split(`T`)[0]}.json`,a.click(),URL.revokeObjectURL(i)},m=()=>{n(a,s,l),o(null),u(``)},h=a?e.find(e=>e.id===a):null;return(0,i.jsxs)(`div`,{children:[(0,i.jsxs)(`div`,{className:`sec-hdr`,children:[(0,i.jsx)(`span`,{className:`sec-title`,children:`All Orders`}),(0,i.jsxs)(`div`,{style:{display:`flex`,gap:8,alignItems:`center`},children:[(0,i.jsxs)(`span`,{className:`sec-sub`,children:[e.length,` orders (`,e.filter(e=>e.canceled).length,` canceled)`]}),(0,i.jsx)(`button`,{className:`btn success sm`,onClick:p,children:`📥 Export JSON`})]})]}),(0,i.jsx)(`div`,{className:`tbl-wrap`,children:(0,i.jsxs)(`table`,{children:[(0,i.jsx)(`thead`,{children:(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`th`,{children:`#`}),(0,i.jsx)(`th`,{children:`Ref`}),(0,i.jsx)(`th`,{children:`Type`}),(0,i.jsx)(`th`,{children:`Items`}),(0,i.jsx)(`th`,{children:`Subtotal`}),(0,i.jsx)(`th`,{children:`SC`}),(0,i.jsx)(`th`,{children:`VAT`}),(0,i.jsx)(`th`,{children:`SSCL`}),(0,i.jsx)(`th`,{children:`TDL`}),(0,i.jsx)(`th`,{children:`Total`}),(0,i.jsx)(`th`,{children:`Payment`}),(0,i.jsx)(`th`,{children:`Served By`}),(0,i.jsx)(`th`,{children:`Status`}),(0,i.jsx)(`th`,{children:`Time`}),(0,i.jsx)(`th`,{})]})}),(0,i.jsx)(`tbody`,{children:e.length?e.slice().reverse().map(e=>(0,i.jsxs)(`tr`,{className:e.canceled?`order-canceled`:``,children:[(0,i.jsxs)(`td`,{children:[`#`,String(e.id).padStart(4,`0`)]}),(0,i.jsx)(`td`,{children:(0,i.jsx)(`strong`,{children:e.ref})}),(0,i.jsx)(`td`,{children:(0,i.jsx)(`span`,{className:`tag ${e.type===`room`?`tag-blue`:e.type===`takeaway`?`tag-amber`:`tag-green`}`,children:f[e.type]||e.type})}),(0,i.jsxs)(`td`,{children:[e.items.length,` items`]}),(0,i.jsx)(`td`,{children:d(e.totals.sub)}),(0,i.jsx)(`td`,{children:d(e.totals.sc)}),(0,i.jsx)(`td`,{children:d(e.totals.vat)}),(0,i.jsx)(`td`,{children:d(e.totals.sscl||0)}),(0,i.jsx)(`td`,{children:d(e.totals.tdl||0)}),(0,i.jsx)(`td`,{children:(0,i.jsx)(`strong`,{children:d(e.canceled?0:e.totals.total)})}),(0,i.jsx)(`td`,{children:(0,i.jsx)(`span`,{className:`tag tag-gray`,children:e.payment})}),(0,i.jsx)(`td`,{children:e.servedBy||`â€”`}),(0,i.jsx)(`td`,{children:e.canceled?(0,i.jsx)(`span`,{className:`tag tag-red`,title:`${e.cancelReason||``}${e.cancelNote?`: `+e.cancelNote:``}`,children:`🚫 Canceled`}):(0,i.jsx)(`span`,{className:`tag tag-green`,children:`✅ Paid`})}),(0,i.jsx)(`td`,{children:new Date(e.time).toLocaleTimeString(`en-LK`,{hour:`2-digit`,minute:`2-digit`})}),(0,i.jsxs)(`td`,{style:{display:`flex`,gap:4},children:[!e.canceled&&(0,i.jsx)(`button`,{className:`btn sm`,onClick:()=>g(e,t,`guest`),children:`🖨`}),!e.canceled&&(0,i.jsx)(`button`,{className:`btn sm danger`,onClick:()=>o(e.id),children:`🚫`})]})]},e.id)):(0,i.jsx)(`tr`,{children:(0,i.jsx)(`td`,{colSpan:`15`,style:{textAlign:`center`,padding:32,color:`#9ca3af`},children:`No orders yet`})})})]})}),a&&(0,i.jsx)(`div`,{className:`modal-bg`,onClick:e=>{e.target===e.currentTarget&&o(null)},children:(0,i.jsxs)(`div`,{className:`modal`,children:[(0,i.jsxs)(`div`,{className:`modal-hdr`,children:[(0,i.jsx)(`span`,{children:`🚫 Cancel Bill`}),(0,i.jsx)(`button`,{className:`btn ghost sm`,onClick:()=>o(null),children:`✕`})]}),(0,i.jsxs)(`div`,{className:`modal-body`,children:[(0,i.jsxs)(`div`,{className:`notice notice-amber`,children:[`⚠️ This will mark the bill as `,(0,i.jsx)(`strong`,{children:`CANCELLED`}),`. It will still appear in records with zero revenue impact.`]}),h&&(0,i.jsxs)(`div`,{style:{fontSize:12,color:`#6b7280`,margin:`8px 0`},children:[`Bill #`,String(h.id).padStart(4,`0`),` — `,h.ref,` — `,d(h.totals.total)]}),(0,i.jsxs)(`div`,{className:`field`,style:{marginTop:12},children:[(0,i.jsx)(`label`,{children:`Cancellation Reason *`}),(0,i.jsxs)(`select`,{value:s,onChange:e=>c(e.target.value),children:[(0,i.jsx)(`option`,{children:`Customer left`}),(0,i.jsx)(`option`,{children:`Wrong order`}),(0,i.jsx)(`option`,{children:`Duplicate bill`}),(0,i.jsx)(`option`,{children:`Manager void`}),(0,i.jsx)(`option`,{children:`Other`})]})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Notes (optional)`}),(0,i.jsx)(`input`,{type:`text`,value:l,onChange:e=>u(e.target.value),placeholder:`Add any extra details...`})]})]}),(0,i.jsxs)(`div`,{className:`modal-ftr`,children:[(0,i.jsx)(`button`,{className:`btn`,onClick:()=>o(null),children:`Keep Bill`}),(0,i.jsx)(`button`,{className:`btn danger`,onClick:m,children:`🚫 Cancel Bill`})]})]})})]})}function x({items:e,onItemsChange:t}){let[n,a]=(0,r.useState)(!1),[o,s]=(0,r.useState)(null),[l,u]=(0,r.useState)({name:``,cat:`Rice & Noodles`,price:``,active:!0}),f=e=>{e?(s(e),u({name:e.name,cat:e.cat,price:e.price,active:e.active})):(s(null),u({name:``,cat:`Rice & Noodles`,price:``,active:!0})),a(!0)},p=()=>{let n=l.name.trim(),r=parseFloat(l.price);if(!n){alert(`Please enter item name.`);return}if(isNaN(r)||r<=0){alert(`Please enter a valid price.`);return}let i;i=o?e.map(e=>e.id===o.id?{...e,name:n,cat:l.cat,price:r,active:l.active}:e):[...e,{id:Date.now(),name:n,cat:l.cat,price:r,active:l.active}],t(i),a(!1)},m=n=>t(e.map(e=>e.id===n?{...e,active:!e.active}:e)),h=n=>{confirm(`Delete this item?`)&&t(e.filter(e=>e.id!==n))};return(0,i.jsxs)(`div`,{children:[(0,i.jsxs)(`div`,{className:`sec-hdr`,children:[(0,i.jsxs)(`span`,{className:`sec-title`,children:[`Menu Items (`,e.length,`)`]}),(0,i.jsx)(`button`,{className:`btn primary`,onClick:()=>f(null),children:`+ Add Item`})]}),(0,i.jsx)(`div`,{className:`tbl-wrap`,children:(0,i.jsxs)(`table`,{children:[(0,i.jsx)(`thead`,{children:(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`th`,{children:`Name`}),(0,i.jsx)(`th`,{children:`Category`}),(0,i.jsx)(`th`,{children:`Price (LKR)`}),(0,i.jsx)(`th`,{children:`Status`}),(0,i.jsx)(`th`,{style:{textAlign:`right`},children:`Actions`})]})}),(0,i.jsx)(`tbody`,{children:e.map(e=>(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{children:(0,i.jsx)(`strong`,{children:e.name})}),(0,i.jsx)(`td`,{children:(0,i.jsx)(`span`,{className:`tag tag-blue`,children:e.cat})}),(0,i.jsx)(`td`,{children:d(e.price)}),(0,i.jsx)(`td`,{children:(0,i.jsx)(`span`,{className:`tag ${e.active?`tag-green`:`tag-red`}`,children:e.active?`Active`:`Inactive`})}),(0,i.jsxs)(`td`,{style:{textAlign:`right`},children:[(0,i.jsx)(`button`,{className:`btn sm`,onClick:()=>f(e),children:`✏ Edit`}),(0,i.jsx)(`button`,{className:`btn sm ${e.active?`warning`:`success`}`,onClick:()=>m(e.id),children:e.active?`Disable`:`Enable`}),(0,i.jsx)(`button`,{className:`btn sm danger`,onClick:()=>h(e.id),children:`🗑`})]})]},e.id))})]})}),n&&(0,i.jsx)(`div`,{className:`modal-bg`,onClick:e=>{e.target===e.currentTarget&&a(!1)},children:(0,i.jsxs)(`div`,{className:`modal`,children:[(0,i.jsxs)(`div`,{className:`modal-hdr`,children:[(0,i.jsx)(`span`,{children:o?`Edit Item`:`Add Menu Item`}),(0,i.jsx)(`button`,{className:`btn ghost sm`,onClick:()=>a(!1),children:`✕`})]}),(0,i.jsxs)(`div`,{className:`modal-body`,children:[(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Item Name *`}),(0,i.jsx)(`input`,{autoFocus:!0,type:`text`,value:l.name,onChange:e=>u(t=>({...t,name:e.target.value})),onKeyDown:e=>e.key===`Enter`&&document.getElementById(`im_price_jsx`)?.focus(),placeholder:`e.g. Grilled Salmon`})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Category`}),(0,i.jsx)(`select`,{value:l.cat,onChange:e=>u(t=>({...t,cat:e.target.value})),children:c.map(e=>(0,i.jsx)(`option`,{children:e},e))})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Price (LKR) *`}),(0,i.jsx)(`input`,{id:`im_price_jsx`,type:`number`,value:l.price,onChange:e=>u(t=>({...t,price:e.target.value})),onKeyDown:e=>e.key===`Enter`&&p(),placeholder:`0.00`,min:`0`,step:`0.50`})]}),(0,i.jsxs)(`label`,{className:`checkbox-row`,children:[(0,i.jsx)(`input`,{type:`checkbox`,checked:l.active,onChange:e=>u(t=>({...t,active:e.target.checked}))}),`Active — available for sale`]})]}),(0,i.jsxs)(`div`,{className:`modal-ftr`,children:[(0,i.jsx)(`button`,{className:`btn`,onClick:()=>a(!1),children:`Cancel`}),(0,i.jsx)(`button`,{className:`btn primary`,onClick:p,children:`✅ Save Item`})]})]})})]})}function S({settings:e,onSave:t}){let[n,a]=(0,r.useState)({...e}),o=e=>t=>a(n=>({...n,[e]:t})),s=()=>{let e={...n,sc:parseFloat(n.sc)||10,vat:parseFloat(n.vat)||18,sscl:parseFloat(n.sscl)||2.5,tdl:parseFloat(n.tdl)||1,staffNames:String(n.staffNamesText??(n.staffNames||[]).join(`
`)).split(`
`).map(e=>e.trim()).filter(Boolean)};delete e.staffNamesText,t(e),alert(`✅ Settings saved!`)},c=(e,t=`text`)=>({value:n[e]??``,onChange:t=>o(e)(t.target.value),type:t}),l=e=>({checked:!!n[e],onChange:t=>o(e)(t.target.checked)});return(0,i.jsxs)(`div`,{children:[(0,i.jsxs)(`div`,{className:`g2`,children:[(0,i.jsxs)(`div`,{className:`card`,children:[(0,i.jsx)(`div`,{className:`card-title`,children:`Tax & Charges`}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Service Charge (%)`}),(0,i.jsx)(`input`,{...c(`sc`,`number`),min:`0`,max:`100`,step:`0.5`})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`VAT (%)`}),(0,i.jsx)(`input`,{...c(`vat`,`number`),min:`0`,max:`100`,step:`0.5`})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`SSCL - Social Security Contribution Levy (%)`}),(0,i.jsx)(`input`,{...c(`sscl`,`number`),min:`0`,max:`100`,step:`0.1`})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`TDL - Tourism Development Levy (%) — SLTDA only`}),(0,i.jsx)(`input`,{...c(`tdl`,`number`),min:`0`,max:`100`,step:`0.1`})]}),(0,i.jsxs)(`label`,{className:`checkbox-row`,children:[(0,i.jsx)(`input`,{type:`checkbox`,...l(`enableSC`)}),` Apply Service Charge`]}),(0,i.jsxs)(`label`,{className:`checkbox-row`,children:[(0,i.jsx)(`input`,{type:`checkbox`,...l(`enableVAT`)}),` Apply VAT`]}),(0,i.jsxs)(`label`,{className:`checkbox-row`,children:[(0,i.jsx)(`input`,{type:`checkbox`,...l(`enableSSCL`)}),` Apply SSCL`]}),(0,i.jsxs)(`label`,{className:`checkbox-row`,children:[(0,i.jsx)(`input`,{type:`checkbox`,...l(`enableTDL`)}),` Apply TDL (SLTDA registered)`]}),(0,i.jsxs)(`label`,{className:`checkbox-row`,children:[(0,i.jsx)(`input`,{type:`checkbox`,...l(`taxInclusive`)}),` Menu prices are tax-inclusive (reverse-calculate)`]}),(0,i.jsxs)(`div`,{className:`notice notice-amber`,style:{marginTop:10},children:[(0,i.jsx)(`strong`,{children:`SL Hotel Tax Cascade:`}),(0,i.jsx)(`br`,{}),`Base → +SC(10%) → +SSCL(2.5% on base+SC) → +VAT(18% on base+SC+SSCL) → +TDL(1% on base only)`]})]}),(0,i.jsxs)(`div`,{className:`card`,children:[(0,i.jsx)(`div`,{className:`card-title`,children:`Restaurant Info`}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Restaurant Name`}),(0,i.jsx)(`input`,{...c(`restName`)})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Hotel Name`}),(0,i.jsx)(`input`,{...c(`hotelName`)})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Address`}),(0,i.jsx)(`input`,{...c(`addr`)})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Phone`}),(0,i.jsx)(`input`,{...c(`phone`)})]}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Receipt Footer Message`}),(0,i.jsx)(`input`,{...c(`footer`)})]})]}),(0,i.jsxs)(`div`,{className:`card`,children:[(0,i.jsx)(`div`,{className:`card-title`,children:`Staff / Servers`}),(0,i.jsxs)(`div`,{className:`field`,children:[(0,i.jsx)(`label`,{children:`Server Names`}),(0,i.jsx)(`textarea`,{rows:`8`,value:n.staffNamesText??(n.staffNames||[]).join(`
`),onChange:e=>a(t=>({...t,staffNamesText:e.target.value})),placeholder:`Kasun
Nimal
Amali`})]}),(0,i.jsx)(`div`,{className:`notice notice-blue`,children:`Add one staff member per line. These names will appear in the Bill screen under Served by.`})]})]}),(0,i.jsx)(`div`,{style:{display:`flex`,justifyContent:`flex-end`,marginTop:4},children:(0,i.jsx)(`button`,{className:`btn primary lg`,onClick:s,children:`✅ Save Settings`})})]})}function C({orders:e,settings:t}){let n=new Date().toISOString().split(`T`)[0],[a,o]=(0,r.useState)(n),[s,c]=(0,r.useState)(n),l=e.filter(e=>{let t=new Date(e.time).toISOString().split(`T`)[0];return t>=a&&t<=s}),u=l.filter(e=>!e.canceled),f=l.filter(e=>e.canceled),p=u.reduce((e,t)=>e+t.totals.total,0),m=u.reduce((e,t)=>e+t.totals.sub,0),h=u.reduce((e,t)=>e+t.totals.sc,0),g=u.reduce((e,t)=>e+t.totals.vat,0),v=u.reduce((e,t)=>e+(t.totals.sscl||0),0),y=u.reduce((e,t)=>e+(t.totals.tdl||0),0),b=u.filter(e=>e.type===`room`).reduce((e,t)=>e+t.totals.total,0),x=u.filter(e=>e.payment===`cash`).reduce((e,t)=>e+t.totals.total,0),S=u.filter(e=>e.payment===`card`).reduce((e,t)=>e+t.totals.total,0),C=f.reduce((e,t)=>e+t.totals.total,0),w={};return u.forEach(e=>e.items.forEach(e=>{w[e.cat]=(w[e.cat]||0)+e.price*e.qty})),(0,i.jsxs)(`div`,{children:[(0,i.jsxs)(`div`,{className:`report-controls`,children:[(0,i.jsx)(`label`,{children:`From:`}),(0,i.jsx)(`input`,{type:`date`,value:a,onChange:e=>o(e.target.value)}),(0,i.jsx)(`label`,{children:`To:`}),(0,i.jsx)(`input`,{type:`date`,value:s,onChange:e=>c(e.target.value)}),(0,i.jsx)(`button`,{className:`btn`,onClick:()=>_(e,t,a,s),children:`🖨 Print Report`})]}),l.length?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(`div`,{className:`metrics`,children:[(0,i.jsxs)(`div`,{className:`metric`,children:[(0,i.jsx)(`div`,{className:`m-label`,children:`Total Revenue`}),(0,i.jsx)(`div`,{className:`m-val`,children:d(p)}),(0,i.jsxs)(`div`,{className:`m-sub`,children:[u.length,` paid orders`]})]}),(0,i.jsxs)(`div`,{className:`metric`,children:[(0,i.jsx)(`div`,{className:`m-label`,children:`F&B Net Sales`}),(0,i.jsx)(`div`,{className:`m-val`,children:d(m)}),(0,i.jsx)(`div`,{className:`m-sub`,children:`before taxes`})]}),(0,i.jsxs)(`div`,{className:`metric`,children:[(0,i.jsx)(`div`,{className:`m-label`,children:`Tax Collected`}),(0,i.jsx)(`div`,{className:`m-val`,children:d(g+v+y)}),(0,i.jsx)(`div`,{className:`m-sub`,children:`Enabled taxes only`})]}),(0,i.jsxs)(`div`,{className:`metric`,style:{borderColor:`#fee2e2`},children:[(0,i.jsx)(`div`,{className:`m-label`,style:{color:`#b91c1c`},children:`Canceled`}),(0,i.jsx)(`div`,{className:`m-val`,style:{color:`#b91c1c`},children:f.length}),(0,i.jsxs)(`div`,{className:`m-sub`,children:[`voided `,d(C)]})]})]}),(0,i.jsxs)(`div`,{className:`g2`,style:{marginBottom:12},children:[(0,i.jsxs)(`div`,{className:`card`,children:[(0,i.jsx)(`div`,{className:`card-title`,children:`Tax Breakdown (Cascade)`}),(0,i.jsx)(`table`,{children:(0,i.jsxs)(`tbody`,{children:[(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{children:`F&B Net Sales (base)`}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:`—`}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(m)})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{children:`Service Charge`}),(0,i.jsxs)(`td`,{style:{textAlign:`right`},children:[t.sc,`%`]}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(h)})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsxs)(`td`,{children:[`SSCL `,(0,i.jsx)(`small`,{children:`(on base+SC)`})]}),(0,i.jsxs)(`td`,{style:{textAlign:`right`},children:[t.sscl??2.5,`%`]}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(v)})]}),t.enableVAT!==!1&&(0,i.jsxs)(`tr`,{children:[(0,i.jsxs)(`td`,{children:[`VAT `,(0,i.jsx)(`small`,{children:`(on base+SC+SSCL)`})]}),(0,i.jsxs)(`td`,{style:{textAlign:`right`},children:[t.vat,`%`]}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(g)})]}),(t.enableTDL??!1)&&(0,i.jsxs)(`tr`,{children:[(0,i.jsxs)(`td`,{children:[`TDL `,(0,i.jsx)(`small`,{children:`(on base only)`})]}),(0,i.jsxs)(`td`,{style:{textAlign:`right`},children:[t.tdl??1,`%`]}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(y)})]}),(0,i.jsxs)(`tr`,{style:{fontWeight:700,background:`#f8f9fa`},children:[(0,i.jsx)(`td`,{children:`Total Collected`}),(0,i.jsx)(`td`,{}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(p)})]})]})})]}),(0,i.jsxs)(`div`,{className:`card`,children:[(0,i.jsx)(`div`,{className:`card-title`,children:`Payment Methods`}),(0,i.jsx)(`table`,{children:(0,i.jsxs)(`tbody`,{children:[(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{children:`💵 Cash`}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(x)}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:u.filter(e=>e.payment===`cash`).length})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{children:`💳 Card`}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(S)}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:u.filter(e=>e.payment===`card`).length})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{children:`🏨 Room`}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(b)}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:u.filter(e=>e.payment===`room`).length})]}),(0,i.jsxs)(`tr`,{style:{color:`#b91c1c`},children:[(0,i.jsx)(`td`,{children:`🚫 Canceled`}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(C)}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:f.length})]})]})})]})]}),(0,i.jsxs)(`div`,{className:`card`,style:{marginBottom:12},children:[(0,i.jsx)(`div`,{className:`card-title`,children:`Sales by Category`}),(0,i.jsx)(`table`,{children:(0,i.jsx)(`tbody`,{children:Object.entries(w).sort((e,t)=>t[1]-e[1]).map(([e,t])=>(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{children:e}),(0,i.jsx)(`td`,{style:{textAlign:`right`},children:d(t)}),(0,i.jsxs)(`td`,{style:{textAlign:`right`},children:[m>0?(t/m*100).toFixed(1):`0.0`,`%`]})]},e))})})]}),f.length>0&&(0,i.jsxs)(`div`,{className:`card`,style:{borderColor:`#fee2e2`},children:[(0,i.jsxs)(`div`,{className:`card-title`,style:{color:`#b91c1c`},children:[`🚫 Canceled Bills (`,f.length,`)`]}),(0,i.jsxs)(`table`,{children:[(0,i.jsx)(`thead`,{children:(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`th`,{children:`#`}),(0,i.jsx)(`th`,{children:`Ref`}),(0,i.jsx)(`th`,{children:`Amount`}),(0,i.jsx)(`th`,{children:`Reason`}),(0,i.jsx)(`th`,{children:`Notes`}),(0,i.jsx)(`th`,{children:`Time`})]})}),(0,i.jsx)(`tbody`,{children:f.map(e=>(0,i.jsxs)(`tr`,{style:{color:`#b91c1c`},children:[(0,i.jsxs)(`td`,{children:[`#`,String(e.id).padStart(4,`0`)]}),(0,i.jsx)(`td`,{children:e.ref}),(0,i.jsx)(`td`,{children:d(e.totals.total)}),(0,i.jsx)(`td`,{children:e.cancelReason||`—`}),(0,i.jsx)(`td`,{children:e.cancelNote||`—`}),(0,i.jsx)(`td`,{children:new Date(e.cancelTime||e.time).toLocaleTimeString(`en-LK`,{hour:`2-digit`,minute:`2-digit`})})]},e.id))})]})]})]}):(0,i.jsx)(`div`,{style:{textAlign:`center`,padding:48,color:`#9ca3af`,fontSize:13},children:`No orders for this period`})]})}function w(){(0,r.useEffect)(()=>{document.title=`Resto Restaurant POS - Utility Tool | Swag Solutions`},[]);let[e,t]=(0,r.useState)(`pos`),[n,c]=(0,r.useState)(()=>l(`pos_items`,s)),[d,f]=(0,r.useState)(()=>l(`pos_orders`,[])),[m,h]=(0,r.useState)(()=>l(`pos_settings`,o)),[g,_]=(0,r.useState)(()=>l(`pos_nextId`,1001)),[y,w]=(0,r.useState)(()=>new Date),[T,E]=(0,r.useState)(!1);(0,r.useEffect)(()=>{let e=setInterval(()=>w(new Date),1e3);return()=>clearInterval(e)},[]),(0,r.useEffect)(()=>{let e=()=>E(!!document.fullscreenElement);return document.addEventListener(`fullscreenchange`,e),()=>document.removeEventListener(`fullscreenchange`,e)},[]);let D=async()=>{try{if(document.fullscreenElement){await document.exitFullscreen();return}await document.documentElement.requestFullscreen()}catch(e){console.warn(`Fullscreen request failed`,e)}},O=e=>{c(e),u(`pos_items`,e)},k=e=>{h(e),u(`pos_settings`,e)},A=e=>{let t=[...d,e],n=g+1;f(t),u(`pos_orders`,t),_(n),u(`pos_nextId`,n)},j=(e,t,n)=>{let r=d.map(r=>r.id===e?{...r,canceled:!0,cancelReason:t,cancelNote:n,cancelTime:Date.now()}:r);f(r),u(`pos_orders`,r)},M={pos:`New Order`,orders:`Orders`,menu:`Menu Management`,settings:`Settings`,reports:`Sales Report`},N=[{id:`pos`,icon:`🛒`,label:`New Order`},{id:`orders`,icon:`🧾`,label:`Orders`,badge:d.length||null},{id:`menu`,icon:`🍽`,label:`Menu Items`},{id:`settings`,icon:`⚙️`,label:`Settings`},{id:`reports`,icon:`📊`,label:`Sales Report`}];return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`style`,{children:a}),(0,i.jsxs)(`div`,{className:`resto-page app`,children:[(0,i.jsxs)(`div`,{className:`sidebar`,children:[(0,i.jsxs)(`div`,{className:`sidebar-logo`,children:[(0,i.jsx)(`div`,{className:`name`,children:`🍽 SWAG Restaurant`}),(0,i.jsx)(`div`,{className:`sub`,children:`Hotel POS System`})]}),(0,i.jsx)(`div`,{style:{padding:`6px 0`,flex:1},children:N.map(n=>(0,i.jsxs)(`div`,{className:`nav-item${e===n.id?` active`:``}`,onClick:()=>t(n.id),children:[(0,i.jsx)(`span`,{className:`icon`,children:n.icon}),n.label,n.badge?(0,i.jsx)(`span`,{className:`nav-badge`,children:n.badge}):null]},n.id))}),(0,i.jsxs)(`div`,{className:`sidebar-clock`,children:[(0,i.jsxs)(`div`,{children:[p(y.getHours()),`:`,p(y.getMinutes()),`:`,p(y.getSeconds())]}),(0,i.jsx)(`div`,{style:{marginTop:2},children:y.toLocaleDateString(`en-LK`,{weekday:`short`,day:`numeric`,month:`short`,year:`numeric`})})]})]}),(0,i.jsxs)(`div`,{className:`main`,children:[(0,i.jsxs)(`div`,{className:`topbar`,children:[(0,i.jsx)(`span`,{className:`topbar-title`,children:M[e]}),(0,i.jsx)(`button`,{className:`btn sm`,onClick:D,children:T?`Exit Fullscreen`:`Fullscreen`})]}),(0,i.jsxs)(`div`,{className:`content`,children:[e===`pos`&&(0,i.jsx)(v,{items:n,settings:m,nextId:g,onOrderComplete:A}),e===`orders`&&(0,i.jsx)(b,{orders:d,settings:m,onCancel:j}),e===`menu`&&(0,i.jsx)(x,{items:n,onItemsChange:O}),e===`settings`&&(0,i.jsx)(S,{settings:m,onSave:k}),e===`reports`&&(0,i.jsx)(C,{orders:d,settings:m})]})]})]})]})}export{w as default};