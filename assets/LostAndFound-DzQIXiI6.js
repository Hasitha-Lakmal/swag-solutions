import{i as e,n as t,t as n}from"./jsx-runtime-CUBmso4R.js";import{n as r,r as i}from"./xlsx-BjvHs-jZ.js";var a=e(t(),1),o=n(),s={FOUND:`Found`,CLAIMED:`Claimed`,DISPOSED:`Disposed`},c={Found:{bg:`rgba(245,158,11,0.15)`,border:`rgba(245,158,11,0.4)`,text:`#fbbf24`},Claimed:{bg:`rgba(16,185,129,0.15)`,border:`rgba(16,185,129,0.4)`,text:`#34d399`},Disposed:{bg:`rgba(239,68,68,0.12)`,border:`rgba(239,68,68,0.3)`,text:`#f87171`}},l={date:new Date().toISOString().split(`T`)[0],time:new Date().toTimeString().slice(0,5),description:``,location:``,roomNo:``,foundBy:``,guestName:``,status:s.FOUND,claimedBy:``,claimDate:``,notes:``};function u({onBack:e}){a.useEffect(()=>{document.title=`Lost & Found Database - Utility Tool | Swag Solutions`},[]);let[t,n]=(0,a.useState)(()=>{let e=localStorage.getItem(`lostFoundData`);return e?JSON.parse(e):[]}),[u,p]=(0,a.useState)(l),[m,h]=(0,a.useState)(`log`),[g,_]=(0,a.useState)(``),[v,y]=(0,a.useState)(`All`),[b,x]=(0,a.useState)(null),[S,C]=(0,a.useState)(!1),[w,T]=(0,a.useState)(()=>localStorage.getItem(`lostFoundHotel`)||``),[E,D]=(0,a.useState)(()=>!localStorage.getItem(`lostFoundHotel`)),[O,k]=(0,a.useState)(``),A=e=>{n(e),localStorage.setItem(`lostFoundData`,JSON.stringify(e))},j=()=>{if(!O.trim())return alert(`Please enter hotel name`);T(O.trim()),localStorage.setItem(`lostFoundHotel`,O.trim()),D(!1)},M=()=>{if(!u.description||!u.location)return alert(`Description and location are required!`);if(b)A(t.map(e=>e.id===b?{...u,id:b}:e)),x(null);else{let e=`LF-`+String(t.length+1).padStart(4,`0`);A([...t,{...u,id:e}])}p(l),C(!1)},N=e=>{p({...e}),x(e.id),C(!0),h(`log`)},P=e=>{let n=prompt(`Claimed by (name):`);n&&A(t.map(t=>t.id===e?{...t,status:s.CLAIMED,claimedBy:n,claimDate:new Date().toISOString().split(`T`)[0]}:t))},F=e=>{let t=window.open(``,`_blank`,`width=720,height=960`),n=e.status===s.CLAIMED;t.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Lost & Found - ${e.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; font-size: 13px; color: #111; background: #fff; padding: 36px; max-width: 680px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 18px; margin-bottom: 22px; }
    .hotel-name { font-size: 24px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 4px; }
    .doc-title { font-size: 14px; letter-spacing: 5px; color: #555; text-transform: uppercase; margin-top: 10px; font-style: italic; }
    .ref-bar { display: flex; justify-content: space-between; align-items: center; background: #f7f7f7; padding: 9px 16px; border-radius: 4px; margin-bottom: 22px; font-size: 12px; border: 1px solid #ddd; }
    .ref-bar strong { font-size: 14px; }
    .status-badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border: 1.5px solid; ${n?`background:#d1fae5;color:#065f46;border-color:#10b981;`:e.status===`Disposed`?`background:#fee2e2;color:#991b1b;border-color:#ef4444;`:`background:#fef3c7;color:#92400e;border-color:#f59e0b;`} }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #666; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 13px; font-family: Arial, sans-serif; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    .field label { display: block; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; font-family: Arial, sans-serif; }
    .field .value { font-size: 14px; font-weight: 600; padding: 5px 0; border-bottom: 1px solid #ccc; min-height: 28px; }
    .desc-box { border: 1px solid #ccc; border-radius: 4px; padding: 12px; min-height: 54px; font-weight: 600; font-size: 15px; background: #fafafa; }
    .sig-section { margin-top: 38px; border-top: 2px solid #222; padding-top: 22px; }
    .sig-grid { display: grid; grid-template-columns: ${n?`1fr 1fr 1fr`:`1fr 1fr`}; gap: 28px; margin-top: 18px; }
    .sig-box { text-align: center; }
    .sig-line { border-bottom: 1.5px solid #333; height: 64px; margin-bottom: 8px; }
    .sig-label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; font-family: Arial, sans-serif; }
    .sig-name { font-size: 12px; font-weight: 700; margin-top: 3px; }
    .id-row { margin-top: 22px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 12px; color: #555; font-family: Arial, sans-serif; }
    .id-row div { line-height: 2.2; }
    .footer { margin-top: 26px; text-align: center; font-size: 10px; color: #bbb; border-top: 1px dashed #ccc; padding-top: 12px; font-family: Arial, sans-serif; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-28deg); font-size: 90px; color: rgba(0,0,0,0.035); font-weight: 900; pointer-events: none; white-space: nowrap; letter-spacing: 10px; font-family: Arial, sans-serif; }
    .print-btn { text-align: right; margin-bottom: 18px; }
    @media print {
      .print-btn { display: none; }
      body { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="watermark">${e.status.toUpperCase()}</div>
  <div class="print-btn">
    <button onclick="window.print()" style="padding:10px 28px;background:#111;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;letter-spacing:1px;font-family:Arial,sans-serif">🖨️&nbsp; Print Slip</button>
  </div>

  <div class="header">
    <div class="hotel-name">${w||`Hotel Name`}</div>
    <div style="font-size:12px;color:#777;margin-top:5px;font-family:Arial,sans-serif">Lost &amp; Found Department</div>
    <div class="doc-title">Property Handover Record</div>
  </div>

  <div class="ref-bar">
    <span><strong>Ref #: ${e.id}</strong></span>
    <span style="font-family:Arial,sans-serif">Found: <strong>${e.date}</strong> at <strong>${e.time}</strong></span>
    <span class="status-badge">${e.status}</span>
  </div>

  <div class="section">
    <div class="section-title">Item Description</div>
    <div class="desc-box">${e.description}</div>
  </div>

  <div class="section">
    <div class="section-title">Found Details</div>
    <div class="grid-3">
      <div class="field"><label>Location Found</label><div class="value">${e.location}</div></div>
      <div class="field"><label>Room Number</label><div class="value">${e.roomNo||`—`}</div></div>
      <div class="field"><label>Found By (Staff)</label><div class="value">${e.foundBy||`—`}</div></div>
    </div>
    ${e.guestName?`<div style="margin-top:13px"><div class="field"><label>Guest Name</label><div class="value">${e.guestName}</div></div></div>`:``}
  </div>

  ${e.notes?`<div class="section"><div class="section-title">Additional Notes</div><div class="desc-box" style="font-weight:normal;font-size:12px;font-family:Arial,sans-serif">${e.notes}</div></div>`:``}

  ${n?`
  <div class="section">
    <div class="section-title">Claim Details</div>
    <div class="grid-2">
      <div class="field"><label>Claimed By</label><div class="value">${e.claimedBy}</div></div>
      <div class="field"><label>Claim Date</label><div class="value">${e.claimDate}</div></div>
    </div>
  </div>`:``}

  <div class="sig-section">
    <div class="section-title">Acknowledgement &amp; Signatures</div>
    <div class="sig-grid">
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Found By / Staff Member</div>
        <div class="sig-name">${e.foundBy||`................................`}</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Duty Manager / Supervisor</div>
        <div class="sig-name">................................</div>
      </div>
      ${n?`
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Owner / Claimant Signature</div>
        <div class="sig-name">${e.claimedBy||`................................`}</div>
      </div>`:``}
    </div>
    <div class="id-row">
      <div>
        ID / Passport No: ______________________________<br>
        Contact Number: ________________________________
      </div>
      <div style="text-align:right">
        Date: ______________________________<br>
        Time: ________________________________
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This is an official Lost &amp; Found record of <strong>${w||`the hotel`}</strong>. Please retain a copy for your records.</p>
    <p style="margin-top:4px">Powered by SWAG Solutions &nbsp;•&nbsp; Generated: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`),t.document.close()},I=()=>{let e=r.book_new(),n=t.map(e=>({ID:e.id,"Date Found":e.date,Time:e.time,Description:e.description,Location:e.location,"Room No":e.roomNo,"Found By":e.foundBy,"Guest Name":e.guestName,Status:e.status,"Claimed By":e.claimedBy,"Claim Date":e.claimDate,Notes:e.notes}));r.book_append_sheet(e,r.json_to_sheet(n),`Lost & Found`),i(e,`${w||`Hotel`}_LostFound_${new Date().toISOString().split(`T`)[0]}.xlsx`)},L=t.filter(e=>{let t=!g||[e.description,e.location,e.roomNo,e.guestName,e.id].some(e=>e?.toLowerCase().includes(g.toLowerCase())),n=v===`All`||e.status===v;return t&&n}).sort((e,t)=>t.id.localeCompare(e.id)),R={total:t.length,pending:t.filter(e=>e.status===s.FOUND).length,claimed:t.filter(e=>e.status===s.CLAIMED).length},z=f;return E?(0,o.jsx)(`div`,{style:{...z.app,alignItems:`center`,justifyContent:`center`},children:(0,o.jsxs)(`div`,{style:{...z.glass,maxWidth:`460px`,width:`100%`,margin:`40px`,textAlign:`center`,padding:`48px 40px`},children:[(0,o.jsx)(`div`,{style:{fontSize:`52px`,marginBottom:`16px`},children:`🏨`}),(0,o.jsx)(`h2`,{style:{marginBottom:`10px`,fontSize:`22px`},children:`Welcome to Lost & Found`}),(0,o.jsx)(`p`,{style:{color:`rgba(255,255,255,0.45)`,marginBottom:`28px`,fontSize:`14px`,lineHeight:1.6},children:`Enter your hotel name — it will appear on all printed handover slips.`}),(0,o.jsx)(`input`,{type:`text`,placeholder:`e.g. The Grand Colombo Hotel`,value:O,onChange:e=>k(e.target.value),onKeyDown:e=>e.key===`Enter`&&j(),style:{...z.input,fontSize:`16px`,padding:`14px`,marginBottom:`16px`,textAlign:`center`},autoFocus:!0}),(0,o.jsx)(`button`,{style:{...z.btn(`primary`),width:`100%`,padding:`14px`,fontSize:`15px`},onClick:j,children:`Continue →`}),e&&(0,o.jsx)(`button`,{style:{...z.btn(),marginTop:`12px`,width:`100%`},onClick:e,children:`← Back to Site`})]})}):(0,o.jsxs)(`div`,{style:z.app,children:[(0,o.jsxs)(`div`,{style:z.header,children:[(0,o.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`12px`},children:[(0,o.jsx)(`span`,{style:{fontSize:`22px`},children:`🔍`}),(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`div`,{style:{fontWeight:`700`,fontSize:`16px`},children:w}),(0,o.jsx)(`div`,{style:{fontSize:`11px`,color:`rgba(255,255,255,0.45)`},children:`Lost & Found System`})]}),(0,o.jsx)(`button`,{style:{...z.btn(),padding:`5px 10px`,fontSize:`12px`},onClick:()=>{k(w),D(!0)},title:`Change hotel name`,children:`✏️`})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,gap:`10px`},children:[(0,o.jsx)(`button`,{style:z.btn(`success`),onClick:I,children:`📥 Excel`}),(0,o.jsx)(`button`,{style:{...z.btn(`primary`),fontSize:`20px`,padding:`7px 16px`},onClick:()=>{p(l),x(null),C(!0),h(`log`)},children:`+`}),e&&(0,o.jsx)(`button`,{style:z.btn(),onClick:e,children:`← Back`})]})]}),(0,o.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3,1fr)`,gap:`12px`,padding:`20px 24px 0`},children:[{label:`Total Items`,value:R.total,color:`#a78bfa`},{label:`Pending`,value:R.pending,color:`#f59e0b`},{label:`Claimed`,value:R.claimed,color:`#10b981`}].map(e=>(0,o.jsxs)(`div`,{style:{background:`${e.color}18`,border:`1px solid ${e.color}44`,borderRadius:`12px`,padding:`14px`,textAlign:`center`},children:[(0,o.jsx)(`div`,{style:{fontSize:`26px`,fontWeight:`800`,color:e.color},children:e.value}),(0,o.jsx)(`div`,{style:{fontSize:`11px`,color:`rgba(255,255,255,0.45)`,marginTop:`2px`},children:e.label})]},e.label))}),(0,o.jsx)(`div`,{style:{display:`flex`,gap:`8px`,padding:`18px 24px 0`},children:[[`log`,`📋 Add / Edit`],[`history`,`🗂 All Records`]].map(([e,t])=>(0,o.jsx)(`button`,{onClick:()=>h(e),style:{...z.btn(m===e?`primary`:``),fontSize:`13px`},children:t},e))}),(0,o.jsxs)(`div`,{style:{padding:`16px 24px 32px`,flex:1,overflowY:`auto`},children:[m===`log`&&S&&(0,o.jsxs)(`div`,{style:{...z.glass,marginBottom:`20px`},children:[(0,o.jsx)(`h3`,{style:{marginBottom:`16px`,color:`#a78bfa`,fontSize:`13px`,letterSpacing:`1px`,textTransform:`uppercase`},children:b?`✏️ Edit Record`:`➕ New Found Item`}),(0,o.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(3,1fr)`,gap:`12px`},children:[(0,o.jsx)(d,{label:`Date Found`,value:u.date,type:`date`,onChange:e=>p(t=>({...t,date:e}))}),(0,o.jsx)(d,{label:`Time`,value:u.time,type:`time`,onChange:e=>p(t=>({...t,time:e}))}),(0,o.jsx)(d,{label:`Status`,value:u.status,select:Object.values(s),onChange:e=>p(t=>({...t,status:e}))}),(0,o.jsx)(`div`,{style:{gridColumn:`span 2`},children:(0,o.jsx)(d,{label:`Item Description *`,value:u.description,onChange:e=>p(t=>({...t,description:e})),placeholder:`e.g. Black leather wallet with cards`})}),(0,o.jsx)(d,{label:`Location Found *`,value:u.location,onChange:e=>p(t=>({...t,location:e})),placeholder:`e.g. Restaurant, Pool`}),(0,o.jsx)(d,{label:`Room No`,value:u.roomNo,onChange:e=>p(t=>({...t,roomNo:e})),placeholder:`101`}),(0,o.jsx)(d,{label:`Found By (Staff)`,value:u.foundBy,onChange:e=>p(t=>({...t,foundBy:e})),placeholder:`Staff name`}),(0,o.jsx)(d,{label:`Guest Name`,value:u.guestName,onChange:e=>p(t=>({...t,guestName:e})),placeholder:`If known`}),u.status===s.CLAIMED&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(d,{label:`Claimed By`,value:u.claimedBy,onChange:e=>p(t=>({...t,claimedBy:e}))}),(0,o.jsx)(d,{label:`Claim Date`,value:u.claimDate,type:`date`,onChange:e=>p(t=>({...t,claimDate:e}))})]}),(0,o.jsx)(`div`,{style:{gridColumn:`span 3`},children:(0,o.jsx)(d,{label:`Notes`,value:u.notes,onChange:e=>p(t=>({...t,notes:e})),placeholder:`Additional details...`,area:!0})})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,marginTop:`16px`},children:[(0,o.jsx)(`button`,{style:z.btn(`success`),onClick:M,children:b?`Update Record`:`Save Record`}),(0,o.jsx)(`button`,{style:z.btn(),onClick:()=>{C(!1),x(null)},children:`Cancel`})]})]}),m===`log`&&!S&&(0,o.jsxs)(`div`,{style:{...z.glass,textAlign:`center`,padding:`48px`,cursor:`pointer`,border:`2px dashed rgba(102,126,234,0.3)`,borderRadius:`16px`},onClick:()=>{p(l),x(null),C(!0)},children:[(0,o.jsx)(`div`,{style:{fontSize:`40px`,marginBottom:`10px`},children:`+`}),(0,o.jsx)(`div`,{style:{color:`rgba(255,255,255,0.4)`,fontSize:`14px`},children:`Click to log a new found item`})]}),m===`history`&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(`div`,{style:{display:`flex`,gap:`10px`,marginBottom:`16px`,flexWrap:`wrap`},children:[(0,o.jsx)(`input`,{placeholder:`🔍 Search by description, location, room, guest...`,value:g,onChange:e=>_(e.target.value),style:{...z.input,flex:1,minWidth:`220px`}}),[`All`,...Object.values(s)].map(e=>(0,o.jsx)(`button`,{onClick:()=>y(e),style:{...z.btn(v===e?`primary`:``),fontSize:`12px`,padding:`8px 14px`},children:e},e))]}),L.length===0?(0,o.jsx)(`p`,{style:{color:`rgba(255,255,255,0.3)`,textAlign:`center`,marginTop:`50px`,fontSize:`14px`},children:`No records found.`}):L.map(e=>{let t=c[e.status];return(0,o.jsxs)(`div`,{style:{...z.glass,marginBottom:`12px`,display:`grid`,gridTemplateColumns:`1fr auto`,gap:`14px`,alignItems:`start`},children:[(0,o.jsxs)(`div`,{children:[(0,o.jsxs)(`div`,{style:{display:`flex`,gap:`8px`,alignItems:`center`,marginBottom:`8px`,flexWrap:`wrap`},children:[(0,o.jsx)(`span`,{style:{fontSize:`12px`,fontWeight:`700`,color:`#a78bfa`,fontFamily:`monospace`},children:e.id}),(0,o.jsx)(`span`,{style:{fontSize:`11px`,background:t.bg,border:`1px solid ${t.border}`,color:t.text,padding:`2px 10px`,borderRadius:`20px`,fontWeight:`600`},children:e.status}),(0,o.jsxs)(`span`,{style:{fontSize:`11px`,color:`rgba(255,255,255,0.35)`},children:[e.date,` `,e.time]})]}),(0,o.jsx)(`div`,{style:{fontWeight:`700`,fontSize:`15px`,marginBottom:`6px`},children:e.description}),(0,o.jsxs)(`div`,{style:{fontSize:`12px`,color:`rgba(255,255,255,0.5)`,display:`flex`,gap:`16px`,flexWrap:`wrap`},children:[(0,o.jsxs)(`span`,{children:[`📍 `,e.location]}),e.roomNo&&(0,o.jsxs)(`span`,{children:[`🚪 Room `,e.roomNo]}),e.guestName&&(0,o.jsxs)(`span`,{children:[`👤 `,e.guestName]}),e.foundBy&&(0,o.jsxs)(`span`,{children:[`👷 `,e.foundBy]}),e.claimedBy&&(0,o.jsxs)(`span`,{style:{color:`#34d399`},children:[`✅ `,e.claimedBy,` (`,e.claimDate,`)`]})]}),e.notes&&(0,o.jsxs)(`div`,{style:{fontSize:`11px`,color:`rgba(255,255,255,0.3)`,marginTop:`5px`},children:[`📝 `,e.notes]})]}),(0,o.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`,minWidth:`84px`},children:[(0,o.jsx)(`button`,{style:{...z.btn(),fontSize:`11px`,padding:`7px 10px`},onClick:()=>N(e),children:`✏️ Edit`}),(0,o.jsx)(`button`,{style:{...z.btn(),fontSize:`11px`,padding:`7px 10px`},onClick:()=>F(e),children:`🖨️ Print`}),e.status===s.FOUND&&(0,o.jsx)(`button`,{style:{...z.btn(`success`),fontSize:`11px`,padding:`7px 10px`},onClick:()=>P(e.id),children:`✅ Claimed`})]})]},e.id)})]})]})]})}var d=({label:e,value:t,onChange:n,type:r=`text`,placeholder:i,select:a,area:s})=>(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`label`,{style:{display:`block`,fontSize:`11px`,color:`rgba(255,255,255,0.45)`,marginBottom:`5px`,letterSpacing:`0.5px`,textTransform:`uppercase`},children:e}),a?(0,o.jsx)(`select`,{value:t,onChange:e=>n(e.target.value),style:f.input,children:a.map(e=>(0,o.jsx)(`option`,{value:e,children:e},e))}):s?(0,o.jsx)(`textarea`,{value:t,onChange:e=>n(e.target.value),placeholder:i,rows:2,style:{...f.input,resize:`vertical`}}):(0,o.jsx)(`input`,{type:r,value:t,onChange:e=>n(e.target.value),placeholder:i,style:f.input})]}),f={app:{minHeight:`100vh`,background:`linear-gradient(135deg,#0f0c29,#1a1040,#0d1b2a)`,color:`#e2e8f0`,fontFamily:`'Segoe UI',system-ui,sans-serif`,display:`flex`,flexDirection:`column`},header:{background:`rgba(255,255,255,0.05)`,backdropFilter:`blur(20px)`,borderBottom:`1px solid rgba(255,255,255,0.08)`,padding:`16px 24px`,display:`flex`,justifyContent:`space-between`,alignItems:`center`},glass:{background:`rgba(255,255,255,0.05)`,border:`1px solid rgba(255,255,255,0.1)`,borderRadius:`14px`,padding:`18px`},input:{width:`100%`,padding:`9px 12px`,background:`rgba(255,255,255,0.07)`,border:`1px solid rgba(255,255,255,0.12)`,borderRadius:`8px`,color:`#e2e8f0`,fontSize:`13px`,outline:`none`,boxSizing:`border-box`,fontFamily:`inherit`},btn:(e=``)=>({padding:`9px 18px`,border:`none`,borderRadius:`9px`,cursor:`pointer`,fontWeight:`600`,fontSize:`13px`,transition:`all 0.2s`,...e===`primary`?{background:`linear-gradient(135deg,#667eea,#764ba2)`,color:`#fff`}:e===`success`?{background:`#10b981`,color:`#fff`}:e===`danger`?{background:`#ef4444`,color:`#fff`}:{background:`rgba(255,255,255,0.08)`,color:`#e2e8f0`,border:`1px solid rgba(255,255,255,0.12)`}})};export{u as default};