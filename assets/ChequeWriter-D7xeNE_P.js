import{i as e,n as t,t as n}from"./jsx-runtime-CUBmso4R.js";import{t as r}from"./createLucideIcon-C28SNd-i.js";import{t as i}from"./printer-CkH9SZCc.js";var a=r(`pen-line`,[[`path`,{d:`M13 21h8`,key:`1jsn5i`}],[`path`,{d:`M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z`,key:`1a8usu`}]]),o=e(t(),1),s=n(),c=[`Kamal Perera`,`Nimal Fernando`,`Sunil Bandara`,`Dilrukshi Silva`,`ABC Lanka (Pvt) Ltd`,`Sunil Stores`,`City Hardware`,`Swag Solutions`];function l(e){return String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}function u(e){let t=[``,`One`,`Two`,`Three`,`Four`,`Five`,`Six`,`Seven`,`Eight`,`Nine`,`Ten`,`Eleven`,`Twelve`,`Thirteen`,`Fourteen`,`Fifteen`,`Sixteen`,`Seventeen`,`Eighteen`,`Nineteen`],n=[``,``,`Twenty`,`Thirty`,`Forty`,`Fifty`,`Sixty`,`Seventy`,`Eighty`,`Ninety`];function r(e){return e<20?t[e]:e<100?n[Math.floor(e/10)]+(e%10?` `+t[e%10]:``):t[Math.floor(e/100)]+` Hundred`+(e%100?` `+r(e%100):``)}if(e===0)return`Zero`;let i=e,a=``;return i>=1e9&&(a+=r(Math.floor(i/1e9))+` Billion `,i%=1e9),i>=1e6&&(a+=r(Math.floor(i/1e6))+` Million `,i%=1e6),i>=1e3&&(a+=r(Math.floor(i/1e3))+` Thousand `,i%=1e3),i>0&&(a+=r(i)),a.trim()}function d(e){if(!e||isNaN(e))return``;let t=parseFloat(e).toFixed(2).split(`.`),n=parseInt(t[0],10),r=parseInt(t[1],10),i=`Rupees ${u(n)}`;return r>0?`${i} and Cents ${u(r)} Only`:`${i} Only`}function f(e){if(!e)return`DD / MM / YYYY`;let[t,n,r]=e.split(`-`);return`${r} / ${n} / ${t}`}function p(e){return!e||isNaN(e)?null:parseFloat(e).toLocaleString(`en-LK`,{minimumFractionDigits:2,maximumFractionDigits:2})}function m(){(0,o.useEffect)(()=>{document.title=`Cheque Writer - Business Tool | Swag Solutions`},[]);let[e,t]=(0,o.useState)(``),[n,r]=(0,o.useState)(``),[u,m]=(0,o.useState)(``),[g,_]=(0,o.useState)(``),[v,y]=(0,o.useState)(!0),[b,x]=(0,o.useState)([]),[S,C]=(0,o.useState)(!1),w=(0,o.useRef)(null);(0,o.useEffect)(()=>{function e(e){w.current&&!w.current.contains(e.target)&&C(!1)}return document.addEventListener(`mousedown`,e),()=>document.removeEventListener(`mousedown`,e)},[]);function T(e){if(t(e),!e){x([]),C(!1);return}let n=c.filter(t=>t.toLowerCase().includes(e.toLowerCase()));x(n),C(n.length>0)}function E(e){t(e),x([]),C(!1)}function D(){let t=l(e),n=l(g),r=l(O),i=`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Cheque</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            @page {
              size: 215mm 95mm;
              margin: 0;
            }
            body {
              width: 215mm;
              height: 95mm;
              font-family: Georgia, serif;
              position: relative;
              overflow: hidden;
              background: transparent;
            }
            /* Only user-filled fields are printed — everything is absolutely positioned
               to match where those fields appear on a standard cheque. */

            .field-date {
              position: absolute;
              top: 14mm;
              right: 12mm;
              font-size: 11pt;
              color: #000;
              font-family: monospace;
              letter-spacing: 1px;
            }
            .field-ac-payee {
              position: absolute;
              top: 12mm;
              left: 20mm;
              width: 48mm;
              padding: 2mm 0;
              border-top: 1px solid #000;
              border-bottom: 1px solid #000;
              text-align: center;
              font-size: 9pt;
              font-weight: bold;
              letter-spacing: 0.5px;
              transform: rotate(-6deg);
              color: #000;
            }
            .field-payee {
              position: absolute;
              top: 32mm;
              left: 68mm;
              right: 62mm;
              font-size: 13pt;
              color: #000;
            }
            .field-amount {
              position: absolute;
              top: 30mm;
              right: 12mm;
              font-size: 12pt;
              font-weight: bold;
              color: #000;
              font-family: monospace;
            }
            .field-words {
              position: absolute;
              top: 44mm;
              left: 20mm;
              right: 20mm;
              font-size: 10pt;
              font-weight: bold;
              color: #000;
            }
            .field-memo {
              position: absolute;
              top: 58mm;
              left: 28mm;
              right: 100mm;
              font-size: 9pt;
              color: #000;
            }
          </style>
        </head>
        <body>
          ${v?`<div class="field-ac-payee">A/C PAYEE ONLY</div>`:``}
          ${u?`<div class="field-date">${f(u)}</div>`:``}
          ${e?`<div class="field-payee">${t}</div>`:``}
          ${k?`<div class="field-amount">Rs. ${k}</div>`:``}
          ${O?`<div class="field-words">${r}</div>`:``}
          ${g?`<div class="field-memo">${n}</div>`:``}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          <\/script>
        </body>
      </html>
    `,a=document.createElement(`iframe`);a.style.position=`fixed`,a.style.width=`0`,a.style.height=`0`,a.style.border=`none`,a.style.left=`-9999px`,document.body.appendChild(a);let o=a.contentWindow.document;o.open(),o.write(i),o.close(),a.contentWindow.focus(),setTimeout(()=>{document.body.removeChild(a)},3e3)}let O=n?d(n):null,k=p(n);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(`style`,{children:`
        .cheque-stripe {
          height: 5px;
          background: repeating-linear-gradient(90deg, #b0963a 0px, #b0963a 8px, #d4b85a 8px, #d4b85a 16px);
          border-radius: 2px;
          margin-bottom: 12px;
        }
      `}),(0,s.jsx)(`div`,{className:`min-h-screen bg-slate-50 py-12 px-6`,children:(0,s.jsxs)(`div`,{className:`max-w-5xl mx-auto`,children:[(0,s.jsxs)(`div`,{className:`text-center mb-10`,children:[(0,s.jsx)(`div`,{className:`w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mx-auto mb-4 border border-purple-500/20`,children:(0,s.jsx)(i,{size:32})}),(0,s.jsx)(`h1`,{className:`text-3xl font-bold text-slate-900`,children:`Cheque Writer`}),(0,s.jsx)(`p`,{className:`text-slate-500 mt-2`,children:`Write Sri Lankan bank cheques with Rupees, Cents, and A/C Payee formatting.`})]}),(0,s.jsxs)(`div`,{className:`grid lg:grid-cols-2 gap-8`,children:[(0,s.jsxs)(`div`,{className:`bg-white p-8 rounded-3xl shadow-lg border border-slate-200`,children:[(0,s.jsxs)(`h3`,{className:`text-xl font-bold text-slate-800 mb-6 flex items-center gap-2`,children:[(0,s.jsx)(a,{size:20,className:`text-purple-500`}),` Cheque Details`]}),(0,s.jsxs)(`div`,{className:`space-y-5`,children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`label`,{className:`block text-sm font-medium text-slate-700 mb-2`,children:`Date`}),(0,s.jsx)(`input`,{type:`date`,value:u,onChange:e=>m(e.target.value),className:`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none`})]}),(0,s.jsxs)(`div`,{className:`relative`,ref:w,children:[(0,s.jsx)(`label`,{className:`block text-sm font-medium text-slate-700 mb-2`,children:`Payee Name`}),(0,s.jsx)(`input`,{type:`text`,placeholder:`John Doe`,value:e,onChange:e=>T(e.target.value),onFocus:()=>e&&C(b.length>0),className:`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none`,autoComplete:`off`}),S&&(0,s.jsx)(`div`,{className:`absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden`,children:b.map(e=>(0,s.jsx)(`div`,{onClick:()=>E(e),className:`px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer`,children:e},e))})]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`label`,{className:`block text-sm font-medium text-slate-700 mb-2`,children:`Amount (Rs.)`}),(0,s.jsx)(`input`,{type:`number`,placeholder:`0.00`,value:n,min:`0`,step:`0.01`,onChange:e=>r(e.target.value),className:`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none`}),O&&(0,s.jsx)(`p`,{className:`text-xs text-purple-600 mt-2 italic`,children:O})]}),(0,s.jsxs)(`label`,{className:`flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700`,children:[(0,s.jsx)(`input`,{type:`checkbox`,checked:v,onChange:e=>y(e.target.checked),className:`h-4 w-4 accent-purple-600`}),`Mark as A/C Payee Only`]}),(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`label`,{className:`block text-sm font-medium text-slate-700 mb-2`,children:`Memo (optional)`}),(0,s.jsx)(`input`,{type:`text`,placeholder:`e.g. Invoice #001`,value:g,onChange:e=>_(e.target.value),className:`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none`})]})]}),(0,s.jsxs)(`button`,{onClick:D,className:`w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-purple-500/30 flex justify-center items-center gap-2`,children:[(0,s.jsx)(i,{size:20}),` Print Cheque`]})]}),(0,s.jsx)(`div`,{className:`flex items-center justify-center bg-slate-200/50 p-8 rounded-3xl border border-slate-200`,children:(0,s.jsx)(h,{date:u,payee:e,amount:k,words:O,memo:g,accountPayee:v})})]})]})})]})}function h({date:e,payee:t,amount:n,words:r,memo:i,accountPayee:a}){return(0,s.jsxs)(`div`,{style:{background:`#fffef5`,border:`1px solid #c8b97a`,borderRadius:6,width:`100%`,maxWidth:520,padding:`1rem 1.25rem`,fontFamily:`Georgia, serif`,position:`relative`},children:[(0,s.jsx)(`div`,{className:`cheque-stripe`}),a&&(0,s.jsx)(`div`,{style:{position:`absolute`,top:34,left:26,width:118,padding:`4px 0`,borderTop:`1px solid #5a3e00`,borderBottom:`1px solid #5a3e00`,textAlign:`center`,fontSize:10,fontWeight:700,color:`#5a3e00`,letterSpacing:.5,transform:`rotate(-6deg)`},children:`A/C PAYEE ONLY`}),(0,s.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:8},children:[(0,s.jsxs)(`div`,{children:[(0,s.jsx)(`div`,{style:{fontSize:13,fontWeight:700,color:`#5a3e00`,letterSpacing:1},children:`PEOPLES BANK`}),(0,s.jsx)(`div`,{style:{fontSize:10,color:`#888`},children:`Main Branch — Colombo 00100`})]}),(0,s.jsxs)(`div`,{style:{textAlign:`right`},children:[(0,s.jsx)(`div`,{style:{fontSize:11,color:`#888`,fontFamily:`monospace`},children:`No. 000001`}),(0,s.jsx)(`div`,{style:{border:`1px solid #b0963a`,padding:`3px 8px`,fontSize:12,color:`#5a3e00`,fontFamily:`monospace`,minWidth:110,textAlign:`center`},children:e?f(e):`DD / MM / YYYY`})]})]}),(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-end`,gap:8,margin:`12px 0 6px`,borderBottom:`1px solid #b0963a`,paddingBottom:4},children:[(0,s.jsx)(`span`,{style:{fontSize:10,color:`#888`,whiteSpace:`nowrap`,textTransform:`uppercase`,letterSpacing:.5},children:`Pay to the order of`}),(0,s.jsx)(`span`,{style:{fontSize:15,color:`#222`,flex:1,minHeight:20},children:t||`____________________________`}),(0,s.jsxs)(`div`,{style:{border:`1.5px solid #b0963a`,background:`#fff8e1`,padding:`3px 10px`,fontSize:13,fontWeight:700,color:`#5a3e00`,display:`flex`,alignItems:`center`,gap:4,whiteSpace:`nowrap`},children:[`Rs. `,n||`__________`]})]}),(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-end`,gap:8,margin:`6px 0`,borderBottom:`1px solid #b0963a`,paddingBottom:4},children:[(0,s.jsx)(`span`,{style:{fontSize:10,color:`#888`,whiteSpace:`nowrap`,textTransform:`uppercase`,letterSpacing:.5},children:`Amount in words`}),(0,s.jsx)(`span`,{style:{fontSize:12,color:`#333`,fontStyle:`italic`,flex:1,minHeight:16},children:r||`____________________________`})]}),(0,s.jsxs)(`div`,{style:{display:`flex`,alignItems:`flex-end`,gap:8,marginTop:6},children:[(0,s.jsx)(`span`,{style:{fontSize:10,color:`#888`,whiteSpace:`nowrap`},children:`Memo:`}),(0,s.jsx)(`span`,{style:{fontSize:11,color:`#555`,borderBottom:`1px dashed #b0963a`,flex:1,minHeight:14},children:i})]}),(0,s.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-end`,marginTop:16},children:[(0,s.jsx)(`div`,{style:{fontFamily:`monospace`,fontSize:11,color:`#666`,letterSpacing:2},children:`⑆000000⑆ ⑈00000000000⑈ 000001`}),(0,s.jsx)(`div`,{style:{borderTop:`1px solid #b0963a`,width:120,textAlign:`center`,fontSize:10,color:`#888`,paddingTop:2},children:`Authorised signature`})]})]})}export{m as default};