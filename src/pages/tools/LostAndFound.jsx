import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const STATUS = { FOUND: 'Found', CLAIMED: 'Claimed', DISPOSED: 'Disposed' };

const STATUS_COLORS = {
  Found: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#fbbf24' },
  Claimed: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#34d399' },
  Disposed: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
};

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  time: new Date().toTimeString().slice(0, 5),
  description: '',
  location: '',
  roomNo: '',
  foundBy: '',
  guestName: '',
  status: STATUS.FOUND,
  claimedBy: '',
  claimDate: '',
  notes: '',
};

export default function LostAndFound({ onBack }) {
  React.useEffect(() => {
    document.title = "Lost & Found Database - Utility Tool | Swag Solutions";
  }, []);

  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('lostFoundData');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState(emptyForm);
  const [tab, setTab] = useState('log');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hotelName, setHotelName] = useState(() => localStorage.getItem('lostFoundHotel') || '');
  const [editingHotel, setEditingHotel] = useState(() => !localStorage.getItem('lostFoundHotel'));
  const [hotelInput, setHotelInput] = useState('');

  const saveRecords = (recs) => {
    setRecords(recs);
    localStorage.setItem('lostFoundData', JSON.stringify(recs));
  };

  const saveHotel = () => {
    if (!hotelInput.trim()) return alert('Please enter hotel name');
    setHotelName(hotelInput.trim());
    localStorage.setItem('lostFoundHotel', hotelInput.trim());
    setEditingHotel(false);
  };

  const handleSubmit = () => {
    if (!form.description || !form.location) return alert('Description and location are required!');
    if (editId) {
      saveRecords(records.map(r => r.id === editId ? { ...form, id: editId } : r));
      setEditId(null);
    } else {
      const id = 'LF-' + String(records.length + 1).padStart(4, '0');
      saveRecords([...records, { ...form, id }]);
    }
    setForm(emptyForm);
    setShowForm(false);
  };

  const startEdit = (rec) => {
    setForm({ ...rec });
    setEditId(rec.id);
    setShowForm(true);
    setTab('log');
  };

  const markClaimed = (id) => {
    const claimedBy = prompt('Claimed by (name):');
    if (!claimedBy) return;
    saveRecords(records.map(r => r.id === id
      ? { ...r, status: STATUS.CLAIMED, claimedBy, claimDate: new Date().toISOString().split('T')[0] }
      : r
    ));
  };

  // ── Print Handover Slip ──────────────────────────────────────────────────────
  const printSlip = (rec) => {
    const w = window.open('', '_blank', 'width=720,height=960');
    const isClaimed = rec.status === STATUS.CLAIMED;
    w.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Lost & Found - ${rec.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; font-size: 13px; color: #111; background: #fff; padding: 36px; max-width: 680px; margin: 0 auto; }
    .header { text-align: center; border-bottom: 3px double #333; padding-bottom: 18px; margin-bottom: 22px; }
    .hotel-name { font-size: 24px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 4px; }
    .doc-title { font-size: 14px; letter-spacing: 5px; color: #555; text-transform: uppercase; margin-top: 10px; font-style: italic; }
    .ref-bar { display: flex; justify-content: space-between; align-items: center; background: #f7f7f7; padding: 9px 16px; border-radius: 4px; margin-bottom: 22px; font-size: 12px; border: 1px solid #ddd; }
    .ref-bar strong { font-size: 14px; }
    .status-badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; border: 1.5px solid; ${isClaimed ? 'background:#d1fae5;color:#065f46;border-color:#10b981;' : rec.status === 'Disposed' ? 'background:#fee2e2;color:#991b1b;border-color:#ef4444;' : 'background:#fef3c7;color:#92400e;border-color:#f59e0b;'} }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: #666; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 13px; font-family: Arial, sans-serif; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    .field label { display: block; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; font-family: Arial, sans-serif; }
    .field .value { font-size: 14px; font-weight: 600; padding: 5px 0; border-bottom: 1px solid #ccc; min-height: 28px; }
    .desc-box { border: 1px solid #ccc; border-radius: 4px; padding: 12px; min-height: 54px; font-weight: 600; font-size: 15px; background: #fafafa; }
    .sig-section { margin-top: 38px; border-top: 2px solid #222; padding-top: 22px; }
    .sig-grid { display: grid; grid-template-columns: ${isClaimed ? '1fr 1fr 1fr' : '1fr 1fr'}; gap: 28px; margin-top: 18px; }
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
  <div class="watermark">${rec.status.toUpperCase()}</div>
  <div class="print-btn">
    <button onclick="window.print()" style="padding:10px 28px;background:#111;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px;letter-spacing:1px;font-family:Arial,sans-serif">🖨️&nbsp; Print Slip</button>
  </div>

  <div class="header">
    <div class="hotel-name">${hotelName || 'Hotel Name'}</div>
    <div style="font-size:12px;color:#777;margin-top:5px;font-family:Arial,sans-serif">Lost &amp; Found Department</div>
    <div class="doc-title">Property Handover Record</div>
  </div>

  <div class="ref-bar">
    <span><strong>Ref #: ${rec.id}</strong></span>
    <span style="font-family:Arial,sans-serif">Found: <strong>${rec.date}</strong> at <strong>${rec.time}</strong></span>
    <span class="status-badge">${rec.status}</span>
  </div>

  <div class="section">
    <div class="section-title">Item Description</div>
    <div class="desc-box">${rec.description}</div>
  </div>

  <div class="section">
    <div class="section-title">Found Details</div>
    <div class="grid-3">
      <div class="field"><label>Location Found</label><div class="value">${rec.location}</div></div>
      <div class="field"><label>Room Number</label><div class="value">${rec.roomNo || '—'}</div></div>
      <div class="field"><label>Found By (Staff)</label><div class="value">${rec.foundBy || '—'}</div></div>
    </div>
    ${rec.guestName ? `<div style="margin-top:13px"><div class="field"><label>Guest Name</label><div class="value">${rec.guestName}</div></div></div>` : ''}
  </div>

  ${rec.notes ? `<div class="section"><div class="section-title">Additional Notes</div><div class="desc-box" style="font-weight:normal;font-size:12px;font-family:Arial,sans-serif">${rec.notes}</div></div>` : ''}

  ${isClaimed ? `
  <div class="section">
    <div class="section-title">Claim Details</div>
    <div class="grid-2">
      <div class="field"><label>Claimed By</label><div class="value">${rec.claimedBy}</div></div>
      <div class="field"><label>Claim Date</label><div class="value">${rec.claimDate}</div></div>
    </div>
  </div>` : ''}

  <div class="sig-section">
    <div class="section-title">Acknowledgement &amp; Signatures</div>
    <div class="sig-grid">
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Found By / Staff Member</div>
        <div class="sig-name">${rec.foundBy || '................................'}</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Duty Manager / Supervisor</div>
        <div class="sig-name">................................</div>
      </div>
      ${isClaimed ? `
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Owner / Claimant Signature</div>
        <div class="sig-name">${rec.claimedBy || '................................'}</div>
      </div>` : ''}
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
    <p>This is an official Lost &amp; Found record of <strong>${hotelName || 'the hotel'}</strong>. Please retain a copy for your records.</p>
    <p style="margin-top:4px">Powered by SWAG Solutions &nbsp;•&nbsp; Generated: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>`);
    w.document.close();
  };

  // ── Excel Export ─────────────────────────────────────────────────────────────
  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const data = records.map(r => ({
      'ID': r.id, 'Date Found': r.date, 'Time': r.time,
      'Description': r.description, 'Location': r.location,
      'Room No': r.roomNo, 'Found By': r.foundBy, 'Guest Name': r.guestName,
      'Status': r.status, 'Claimed By': r.claimedBy, 'Claim Date': r.claimDate, 'Notes': r.notes,
    }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Lost & Found');
    XLSX.writeFile(wb, `${hotelName || 'Hotel'}_LostFound_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filtered = records.filter(r => {
    const matchSearch = !search || [r.description, r.location, r.roomNo, r.guestName, r.id]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => b.id.localeCompare(a.id));

  const stats = {
    total: records.length,
    pending: records.filter(r => r.status === STATUS.FOUND).length,
    claimed: records.filter(r => r.status === STATUS.CLAIMED).length,
  };

  const S = styles;

  // ── Hotel setup screen ───────────────────────────────────────────────────────
  if (editingHotel) {
    return (
      <div style={{ ...S.app, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...S.glass, maxWidth: '460px', width: '100%', margin: '40px', textAlign: 'center', padding: '48px 40px' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>🏨</div>
          <h2 style={{ marginBottom: '10px', fontSize: '22px' }}>Welcome to Lost & Found</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '28px', fontSize: '14px', lineHeight: 1.6 }}>
            Enter your hotel name — it will appear on all printed handover slips.
          </p>
          <input
            type="text"
            placeholder="e.g. The Grand Colombo Hotel"
            value={hotelInput}
            onChange={e => setHotelInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveHotel()}
            style={{ ...S.input, fontSize: '16px', padding: '14px', marginBottom: '16px', textAlign: 'center' }}
            autoFocus
          />
          <button style={{ ...S.btn('primary'), width: '100%', padding: '14px', fontSize: '15px' }} onClick={saveHotel}>
            Continue →
          </button>
          {onBack && (
            <button style={{ ...S.btn(), marginTop: '12px', width: '100%' }} onClick={onBack}>← Back to Site</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '22px' }}>🔍</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px' }}>{hotelName}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>Lost & Found System</div>
          </div>
          <button
            style={{ ...S.btn(), padding: '5px 10px', fontSize: '12px' }}
            onClick={() => { setHotelInput(hotelName); setEditingHotel(true); }}
            title="Change hotel name"
          >✏️</button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={S.btn('success')} onClick={downloadExcel}>📥 Excel</button>
          <button style={{ ...S.btn('primary'), fontSize: '20px', padding: '7px 16px' }}
            onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); setTab('log'); }}>
            +
          </button>
          {onBack && <button style={S.btn()} onClick={onBack}>← Back</button>}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', padding: '20px 24px 0' }}>
        {[
          { label: 'Total Items', value: stats.total, color: '#a78bfa' },
          { label: 'Pending', value: stats.pending, color: '#f59e0b' },
          { label: 'Claimed', value: stats.claimed, color: '#10b981' },
        ].map(s => (
          <div key={s.label} style={{ background: `${s.color}18`, border: `1px solid ${s.color}44`, borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', fontWeight: '800', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', padding: '18px 24px 0' }}>
        {[['log', '📋 Add / Edit'], ['history', '🗂 All Records']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...S.btn(tab === t ? 'primary' : ''), fontSize: '13px' }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: '16px 24px 32px', flex: 1, overflowY: 'auto' }}>

        {/* Add / Edit Form */}
        {tab === 'log' && showForm && (
          <div style={{ ...S.glass, marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '16px', color: '#a78bfa', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {editId ? '✏️ Edit Record' : '➕ New Found Item'}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              <F label="Date Found" value={form.date} type="date" onChange={v => setForm(p => ({ ...p, date: v }))} />
              <F label="Time" value={form.time} type="time" onChange={v => setForm(p => ({ ...p, time: v }))} />
              <F label="Status" value={form.status} select={Object.values(STATUS)} onChange={v => setForm(p => ({ ...p, status: v }))} />
              <div style={{ gridColumn: 'span 2' }}>
                <F label="Item Description *" value={form.description} onChange={v => setForm(p => ({ ...p, description: v }))} placeholder="e.g. Black leather wallet with cards" />
              </div>
              <F label="Location Found *" value={form.location} onChange={v => setForm(p => ({ ...p, location: v }))} placeholder="e.g. Restaurant, Pool" />
              <F label="Room No" value={form.roomNo} onChange={v => setForm(p => ({ ...p, roomNo: v }))} placeholder="101" />
              <F label="Found By (Staff)" value={form.foundBy} onChange={v => setForm(p => ({ ...p, foundBy: v }))} placeholder="Staff name" />
              <F label="Guest Name" value={form.guestName} onChange={v => setForm(p => ({ ...p, guestName: v }))} placeholder="If known" />
              {form.status === STATUS.CLAIMED && (
                <>
                  <F label="Claimed By" value={form.claimedBy} onChange={v => setForm(p => ({ ...p, claimedBy: v }))} />
                  <F label="Claim Date" value={form.claimDate} type="date" onChange={v => setForm(p => ({ ...p, claimDate: v }))} />
                </>
              )}
              <div style={{ gridColumn: 'span 3' }}>
                <F label="Notes" value={form.notes} onChange={v => setForm(p => ({ ...p, notes: v }))} placeholder="Additional details..." area />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button style={S.btn('success')} onClick={handleSubmit}>{editId ? 'Update Record' : 'Save Record'}</button>
              <button style={S.btn()} onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
            </div>
          </div>
        )}

        {tab === 'log' && !showForm && (
          <div
            style={{ ...S.glass, textAlign: 'center', padding: '48px', cursor: 'pointer', border: '2px dashed rgba(102,126,234,0.3)', borderRadius: '16px' }}
            onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}
          >
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>+</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Click to log a new found item</div>
          </div>
        )}

        {/* All Records */}
        {tab === 'history' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <input
                placeholder="🔍 Search by description, location, room, guest..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...S.input, flex: 1, minWidth: '220px' }}
              />
              {['All', ...Object.values(STATUS)].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  style={{ ...S.btn(filterStatus === s ? 'primary' : ''), fontSize: '12px', padding: '8px 14px' }}>
                  {s}
                </button>
              ))}
            </div>

            {filtered.length === 0
              ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '50px', fontSize: '14px' }}>No records found.</p>
              : filtered.map(r => {
                const sc = STATUS_COLORS[r.status];
                return (
                  <div key={r.id} style={{ ...S.glass, marginBottom: '12px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'start' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#a78bfa', fontFamily: 'monospace' }}>{r.id}</span>
                        <span style={{ fontSize: '11px', background: sc.bg, border: `1px solid ${sc.border}`, color: sc.text, padding: '2px 10px', borderRadius: '20px', fontWeight: '600' }}>{r.status}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{r.date} {r.time}</span>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '6px' }}>{r.description}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <span>📍 {r.location}</span>
                        {r.roomNo && <span>🚪 Room {r.roomNo}</span>}
                        {r.guestName && <span>👤 {r.guestName}</span>}
                        {r.foundBy && <span>👷 {r.foundBy}</span>}
                        {r.claimedBy && <span style={{ color: '#34d399' }}>✅ {r.claimedBy} ({r.claimDate})</span>}
                      </div>
                      {r.notes && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '5px' }}>📝 {r.notes}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '84px' }}>
                      <button style={{ ...S.btn(), fontSize: '11px', padding: '7px 10px' }} onClick={() => startEdit(r)}>✏️ Edit</button>
                      <button style={{ ...S.btn(), fontSize: '11px', padding: '7px 10px' }} onClick={() => printSlip(r)}>🖨️ Print</button>
                      {r.status === STATUS.FOUND && (
                        <button style={{ ...S.btn('success'), fontSize: '11px', padding: '7px 10px' }} onClick={() => markClaimed(r.id)}>✅ Claimed</button>
                      )}
                    </div>
                  </div>
                );
              })
            }
          </>
        )}
      </div>
    </div>
  );
}

// ── Field Helper ──
const F = ({ label, value, onChange, type = 'text', placeholder, select, area }) => (
  <div>
    <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '5px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</label>
    {select ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={styles.input}>
        {select.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : area ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        rows={2} style={{ ...styles.input, resize: 'vertical' }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={styles.input} />
    )}
  </div>
);

const styles = {
  app: { minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29,#1a1040,#0d1b2a)', color: '#e2e8f0', fontFamily: "'Segoe UI',system-ui,sans-serif", display: 'flex', flexDirection: 'column' },
  header: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  glass: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '18px' },
  input: { width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  btn: (v = '') => ({ padding: '9px 18px', border: 'none', borderRadius: '9px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s', ...(v === 'primary' ? { background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff' } : v === 'success' ? { background: '#10b981', color: '#fff' } : v === 'danger' ? { background: '#ef4444', color: '#fff' } : { background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)' }) }),
};
