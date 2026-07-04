import { useState, useRef, useEffect } from "react";
import { Printer, Edit3 } from "lucide-react";

const SAVED_PAYEES = [
  "Kamal Perera",
  "Nimal Fernando",
  "Sunil Bandara",
  "Dilrukshi Silva",
  "ABC Lanka (Pvt) Ltd",
  "Sunil Stores",
  "City Hardware",
  "Swag Solutions",
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function integerToWords(num) {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function chunk(num) {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + chunk(num % 100) : "");
  }

  if (num === 0) return "Zero";
  let whole = num;
  let result = "";

  if (whole >= 1000000000) { result += chunk(Math.floor(whole / 1000000000)) + " Billion "; whole %= 1000000000; }
  if (whole >= 1000000) { result += chunk(Math.floor(whole / 1000000)) + " Million "; whole %= 1000000; }
  if (whole >= 1000) { result += chunk(Math.floor(whole / 1000)) + " Thousand "; whole %= 1000; }
  if (whole > 0) result += chunk(whole);
  return result.trim();
}

function amountToSriLankanChequeWords(n) {
  if (!n || isNaN(n)) return "";
  const parts = parseFloat(n).toFixed(2).split(".");
  const rupees = parseInt(parts[0], 10);
  const cents = parseInt(parts[1], 10);
  const rupeeText = `Rupees ${integerToWords(rupees)}`;

  if (cents > 0) {
    return `${rupeeText} and Cents ${integerToWords(cents)} Only`;
  }

  return `${rupeeText} Only`;
}

function formatDate(val) {
  if (!val) return "DD / MM / YYYY";
  const [y, m, d] = val.split("-");
  return `${d} / ${m} / ${y}`;
}

function formatAmount(val) {
  if (!val || isNaN(val)) return null;
  return parseFloat(val).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ChequeWriter() {
  useEffect(() => {
    document.title = "Cheque Writer - Business Tool | Swag Solutions";
  }, []);

  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [memo, setMemo] = useState("");
  const [accountPayee, setAccountPayee] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const sugRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (sugRef.current && !sugRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handlePayeeInput(val) {
    setPayee(val);
    if (!val) { setSuggestions([]); setShowSuggestions(false); return; }
    const matches = SAVED_PAYEES.filter((p) =>
      p.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  }

  function selectPayee(name) {
    setPayee(name);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function printCheque() {
    // Only the fields the user filled in are printed.
    // Pre-printed parts of the cheque (bank name, labels, MICR) are already on the physical cheque.
    const safePayee = escapeHtml(payee);
    const safeMemo = escapeHtml(memo);
    const safeWords = escapeHtml(chequeWords);
    const chequeHTML = `
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
          ${accountPayee ? `<div class="field-ac-payee">A/C PAYEE ONLY</div>` : ""}
          ${date ? `<div class="field-date">${formatDate(date)}</div>` : ""}
          ${payee ? `<div class="field-payee">${safePayee}</div>` : ""}
          ${formattedAmount ? `<div class="field-amount">Rs. ${formattedAmount}</div>` : ""}
          ${chequeWords ? `<div class="field-words">${safeWords}</div>` : ""}
          ${memo ? `<div class="field-memo">${safeMemo}</div>` : ""}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.style.left = "-9999px";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(chequeHTML);
    doc.close();
    iframe.contentWindow.focus();
    setTimeout(() => { document.body.removeChild(iframe); }, 3000);
  }

  const chequeWords = amount ? amountToSriLankanChequeWords(amount) : null;
  const formattedAmount = formatAmount(amount);

  return (
    <>
      <style>{`
        .cheque-stripe {
          height: 5px;
          background: repeating-linear-gradient(90deg, #b0963a 0px, #b0963a 8px, #d4b85a 8px, #d4b85a 16px);
          border-radius: 2px;
          margin-bottom: 12px;
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mx-auto mb-4 border border-purple-500/20">
              <Printer size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Cheque Writer</h1>
            <p className="text-slate-500 mt-2">Write Sri Lankan bank cheques with Rupees, Cents, and A/C Payee formatting.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            {/* Form */}
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Edit3 size={20} className="text-purple-500" /> Cheque Details
              </h3>

              <div className="space-y-5">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>

                {/* Payee */}
                <div className="relative" ref={sugRef}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Payee Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={payee}
                    onChange={(e) => handlePayeeInput(e.target.value)}
                    onFocus={() => payee && setShowSuggestions(suggestions.length > 0)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    autoComplete="off"
                  />
                  {showSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                      {suggestions.map((s) => (
                        <div
                          key={s}
                          onClick={() => selectPayee(s)}
                          className="px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer"
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Amount (Rs.)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    min="0"
                    step="0.01"
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                  {chequeWords && (
                    <p className="text-xs text-purple-600 mt-2 italic">{chequeWords}</p>
                  )}
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={accountPayee}
                    onChange={(e) => setAccountPayee(e.target.checked)}
                    className="h-4 w-4 accent-purple-600"
                  />
                  Mark as A/C Payee Only
                </label>

                {/* Memo */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Memo (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Invoice #001"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={printCheque}
                className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-purple-500/30 flex justify-center items-center gap-2"
              >
                <Printer size={20} /> Print Cheque
              </button>
            </div>

            {/* Preview */}
            <div className="flex items-center justify-center bg-slate-200/50 p-8 rounded-3xl border border-slate-200">
              <ChequePreview
                date={date}
                payee={payee}
                amount={formattedAmount}
                words={chequeWords}
                memo={memo}
                accountPayee={accountPayee}
              />
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

function ChequePreview({ date, payee, amount, words, memo, accountPayee }) {
  return (
    <div
      style={{
        background: "#fffef5",
        border: "1px solid #c8b97a",
        borderRadius: 6,
        width: "100%",
        maxWidth: 520,
        padding: "1rem 1.25rem",
        fontFamily: "Georgia, serif",
        position: "relative",
      }}
    >
      {/* Gold stripe */}
      <div className="cheque-stripe" />

      {accountPayee && (
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 26,
            width: 118,
            padding: "4px 0",
            borderTop: "1px solid #5a3e00",
            borderBottom: "1px solid #5a3e00",
            textAlign: "center",
            fontSize: 10,
            fontWeight: 700,
            color: "#5a3e00",
            letterSpacing: 0.5,
            transform: "rotate(-6deg)",
          }}
        >
          A/C PAYEE ONLY
        </div>
      )}

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#5a3e00", letterSpacing: 1 }}>PEOPLES BANK</div>
          <div style={{ fontSize: 10, color: "#888" }}>Main Branch — Colombo 00100</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>No. 000001</div>
          <div style={{ border: "1px solid #b0963a", padding: "3px 8px", fontSize: 12, color: "#5a3e00", fontFamily: "monospace", minWidth: 110, textAlign: "center" }}>
            {date ? formatDate(date) : "DD / MM / YYYY"}
          </div>
        </div>
      </div>

      {/* Payee row */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, margin: "12px 0 6px", borderBottom: "1px solid #b0963a", paddingBottom: 4 }}>
        <span style={{ fontSize: 10, color: "#888", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.5 }}>Pay to the order of</span>
        <span style={{ fontSize: 15, color: "#222", flex: 1, minHeight: 20 }}>{payee || "____________________________"}</span>
        <div style={{ border: "1.5px solid #b0963a", background: "#fff8e1", padding: "3px 10px", fontSize: 13, fontWeight: 700, color: "#5a3e00", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
          Rs. {amount || "__________"}
        </div>
      </div>

      {/* Words row */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, margin: "6px 0", borderBottom: "1px solid #b0963a", paddingBottom: 4 }}>
        <span style={{ fontSize: 10, color: "#888", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.5 }}>Amount in words</span>
        <span style={{ fontSize: 12, color: "#333", fontStyle: "italic", flex: 1, minHeight: 16 }}>
          {words || "____________________________"}
        </span>
      </div>

      {/* Memo row */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginTop: 6 }}>
        <span style={{ fontSize: 10, color: "#888", whiteSpace: "nowrap" }}>Memo:</span>
        <span style={{ fontSize: 11, color: "#555", borderBottom: "1px dashed #b0963a", flex: 1, minHeight: 14 }}>{memo}</span>
      </div>

      {/* Bottom row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16 }}>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#666", letterSpacing: 2 }}>
          ⑆000000⑆ ⑈00000000000⑈ 000001
        </div>
        <div style={{ borderTop: "1px solid #b0963a", width: 120, textAlign: "center", fontSize: 10, color: "#888", paddingTop: 2 }}>
          Authorised signature
        </div>
      </div>
    </div>
  );
}
