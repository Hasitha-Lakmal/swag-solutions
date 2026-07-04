import React, { useState, useMemo } from 'react';

// ── Finance Calculations ───────────────────────────────────────────────────────
function calcLease({ principal, annualRate, months, downPayment = 0, residual = 0 }) {
  const loanAmount = principal - downPayment - residual;
  const r = annualRate / 100 / 12;
  if (r === 0) {
    const emi = loanAmount / months;
    return { emi, totalPayment: emi * months, totalInterest: 0, loanAmount };
  }
  const emi = loanAmount * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
  const totalPayment = emi * months + residual;
  const totalInterest = totalPayment - loanAmount - residual;
  return { emi, totalPayment, totalInterest, loanAmount };
}

function buildSchedule({ principal, annualRate, months, downPayment = 0, residual = 0 }) {
  const loanAmount = principal - downPayment - residual;
  const r = annualRate / 100 / 12;
  const emi = r === 0
    ? loanAmount / months
    : loanAmount * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);

  let balance = loanAmount;
  const rows = [];
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principal_p = emi - interest;
    balance -= principal_p;
    rows.push({ month: i, emi, interest, principal: principal_p, balance: Math.max(0, balance) });
  }
  return rows;
}

// ── Component ──────────────────────────────────────────────────────────────────
const MODES = [
  { id: 'vehicle', label: '🚗 Vehicle', color: '#f59e0b' },
  { id: 'house',   label: '🏠 House',   color: '#10b981' },
];

const PRESETS = {
  vehicle: { principal: 3500000, rate: 14, months: 60,  down: 700000,  residual: 0 },
  house:   { principal: 15000000, rate: 11, months: 240, down: 3000000, residual: 0 },
};

export default function LeasingCalculator({ onBack }) {
  React.useEffect(() => {
    document.title = "Leasing Calculator - Finance Tool | Swag Solutions";
  }, []);

  const [mode, setMode]       = useState('vehicle');
  const [form, setForm]       = useState(PRESETS.vehicle);
  const [showSchedule, setShowSchedule] = useState(false);

  const switchMode = (m) => { setMode(m); setForm(PRESETS[m]); setShowSchedule(false); };
  const upd = (k, v) => setForm(p => ({ ...p, [k]: parseFloat(v) || 0 }));

  const result = useMemo(() => {
    if (!form.principal || !form.rate || !form.months) return null;
    return calcLease({ principal: form.principal, annualRate: form.rate, months: form.months, downPayment: form.down, residual: form.residual });
  }, [form]);

  const schedule = useMemo(() => {
    if (!showSchedule || !result) return [];
    return buildSchedule({ principal: form.principal, annualRate: form.rate, months: form.months, downPayment: form.down, residual: form.residual });
  }, [showSchedule, form, result]);

  const modeColor = MODES.find(m => m.id === mode)?.color || '#a78bfa';

  const fmt = (n) => 'Rs. ' + (n || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const S = {
    app: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f1a, #111827, #071a10)', color: '#e2e8f0', fontFamily: "'Segoe UI', system-ui, sans-serif", display: 'flex', flexDirection: 'column' },
    header: { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    body: { flex: 1, padding: '28px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' },
    glass: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px' },
    input: { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: '#e2e8f0', fontSize: '15px', fontWeight: '600', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
    btn: (v) => ({ padding: '10px 20px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s', ...(v === 'primary' ? { background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff' } : v === 'active' ? { background: `${modeColor}cc`, color: '#000', fontWeight: '700' } : { background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)' }) }),
    statBox: (c) => ({ background: `${c}18`, border: `1px solid ${c}44`, borderRadius: '14px', padding: '18px', textAlign: 'center' }),
    th: { padding: '10px 14px', textAlign: 'left', background: 'rgba(255,255,255,0.04)', fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.07)' },
    td: { padding: '9px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '12px', color: '#e2e8f0' },
  };

  const fields = [
    { key: 'principal', label: mode === 'house' ? '🏠 Property Value (Rs.)' : '🚗 Vehicle Value (Rs.)', placeholder: '3500000' },
    { key: 'down',      label: '💳 Down Payment (Rs.)',  placeholder: '700000' },
    { key: 'rate',      label: '📈 Annual Interest Rate (%)', placeholder: '14' },
    { key: 'months',    label: '📅 Lease Term (Months)', placeholder: '60' },
    ...(mode === 'house' ? [{ key: 'residual', label: '🏦 Balloon / Residual (Rs.)', placeholder: '0' }] : []),
  ];

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>📊</span>
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px' }}>Leasing Calculator</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>House & Vehicle • EMI Schedule</div>
          </div>
        </div>
        {onBack && <button style={S.btn()} onClick={onBack}>← Back</button>}
      </div>

      <div style={S.body}>
        {/* Mode switcher */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          {MODES.map(m => (
            <button key={m.id} onClick={() => switchMode(m.id)}
              style={{ ...S.btn(mode === m.id ? 'active' : ''), fontSize: '14px', padding: '12px 24px' }}>
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Inputs */}
          <div style={S.glass}>
            <h3 style={{ marginBottom: '20px', color: modeColor, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Loan Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>{f.label}</label>
                  <input type="number" value={form[f.key] || ''} onChange={e => upd(f.key, e.target.value)}
                    placeholder={f.placeholder} style={S.input} min="0" />
                </div>
              ))}
            </div>

            {/* Quick presets */}
            <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>QUICK PRESETS</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {mode === 'vehicle'
                  ? [
                      { label: '36M', months: 36 }, { label: '48M', months: 48 }, { label: '60M', months: 60 }, { label: '72M', months: 72 }
                    ].map(p => (
                      <button key={p.label} onClick={() => upd('months', p.months)}
                        style={{ ...S.btn(form.months === p.months ? 'active' : ''), padding: '6px 12px', fontSize: '12px' }}>
                        {p.label}
                      </button>
                    ))
                  : [
                      { label: '10yr', months: 120 }, { label: '15yr', months: 180 }, { label: '20yr', months: 240 }, { label: '25yr', months: 300 }
                    ].map(p => (
                      <button key={p.label} onClick={() => upd('months', p.months)}
                        style={{ ...S.btn(form.months === p.months ? 'active' : ''), padding: '6px 12px', fontSize: '12px' }}>
                        {p.label}
                      </button>
                    ))
                }
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {result ? (
              <>
                <div style={{ ...S.statBox(modeColor), border: `2px solid ${modeColor}88` }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', letterSpacing: '1px' }}>MONTHLY INSTALLMENT</div>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: modeColor }}>{fmt(result.emi)}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>per month for {form.months} months</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={S.statBox('#667eea')}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '4px' }}>LOAN AMOUNT</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#a78bfa' }}>{fmt(result.loanAmount)}</div>
                  </div>
                  <div style={S.statBox('#f59e0b')}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '4px' }}>TOTAL INTEREST</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fbbf24' }}>{fmt(result.totalInterest)}</div>
                  </div>
                  <div style={S.statBox('#10b981')}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '4px' }}>TOTAL PAYMENT</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#34d399' }}>{fmt(result.totalPayment)}</div>
                  </div>
                  <div style={S.statBox('#ec4899')}>
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginBottom: '4px' }}>INTEREST RATIO</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#f9a8d4' }}>
                      {((result.totalInterest / result.loanAmount) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Cost breakdown bar */}
                <div style={S.glass}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px', letterSpacing: '1px' }}>COST BREAKDOWN</div>
                  <div style={{ borderRadius: '6px', overflow: 'hidden', height: '14px', display: 'flex', marginBottom: '10px' }}>
                    <div style={{ width: `${(result.loanAmount / result.totalPayment) * 100}%`, background: '#667eea', transition: 'width 0.6s' }} />
                    <div style={{ flex: 1, background: '#f59e0b' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '11px' }}>
                    <span style={{ color: '#a78bfa' }}>■ Principal {((result.loanAmount / result.totalPayment) * 100).toFixed(0)}%</span>
                    <span style={{ color: '#fbbf24' }}>■ Interest {((result.totalInterest / result.totalPayment) * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <button style={{ ...S.btn('primary'), width: '100%', padding: '12px' }}
                  onClick={() => setShowSchedule(p => !p)}>
                  {showSchedule ? '▲ Hide' : '▼ View'} Full Amortization Schedule
                </button>
              </>
            ) : (
              <div style={{ ...S.glass, textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>
                Fill in the details to calculate
              </div>
            )}
          </div>
        </div>

        {/* Amortization Schedule */}
        {showSchedule && schedule.length > 0 && (
          <div style={{ ...S.glass, marginTop: '20px', overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '14px', color: modeColor, fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Amortization Schedule ({schedule.length} months)
            </h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead style={{ position: 'sticky', top: 0 }}>
                  <tr>
                    {['Month', 'EMI', 'Principal', 'Interest', 'Balance'].map(h => (
                      <th key={h} style={S.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={S.td}>{row.month}</td>
                      <td style={S.td}>{fmt(row.emi)}</td>
                      <td style={{ ...S.td, color: '#a78bfa' }}>{fmt(row.principal)}</td>
                      <td style={{ ...S.td, color: '#fbbf24' }}>{fmt(row.interest)}</td>
                      <td style={{ ...S.td, color: '#34d399' }}>{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
