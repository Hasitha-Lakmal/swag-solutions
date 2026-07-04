import { useState, useEffect } from 'react';
import { Type, Copy, Check } from 'lucide-react';

function numberToWords(n) {
  if (!n || isNaN(n)) return '';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function chunk(num) {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? '-' + ones[num % 10] : '');
    return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' ' + chunk(num % 100) : '');
  }

  const parts = parseFloat(n).toFixed(2).split('.');
  let whole = parseInt(parts[0]);
  const cents = parseInt(parts[1]);
  let result = '';

  if (whole < 0) { result = 'Negative '; whole = Math.abs(whole); }
  if (whole === 0) { result += 'Zero'; }
  else {
    if (whole >= 1000000000) { result += chunk(Math.floor(whole / 1000000000)) + ' Billion '; whole %= 1000000000; }
    if (whole >= 1000000)    { result += chunk(Math.floor(whole / 1000000)) + ' Million '; whole %= 1000000; }
    if (whole >= 1000)       { result += chunk(Math.floor(whole / 1000)) + ' Thousand '; whole %= 1000; }
    if (whole > 0)             result += chunk(whole);
  }

  result = result.trim();
  if (cents > 0) result += ' and ' + chunk(cents) + ' Cents';
  return result;
}

export default function NumbersToWords() {
  useEffect(() => {
    document.title = "Numbers to Words - Utility Tool | Swag Solutions";
  }, []);

  const [number, setNumber] = useState('');
  const [copied, setCopied] = useState(false);

  const words = numberToWords(number);
  const displayText = words || 'Enter a number above to see the result.';
  const isEmpty = !words;

  function handleCopy() {
    if (!words) return;
    navigator.clipboard.writeText(words);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">

          {/* Header */}
          <div className="bg-amber-400 p-8 text-amber-950 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Type size={32} />
            </div>
            <h1 className="text-3xl font-bold">Numbers to Words</h1>
            <p className="mt-1 text-amber-800 text-sm">Supports up to Billions · Decimals as Cents</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Enter Number</label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="e.g. 1,234,567.89"
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none text-xl font-medium"
              />
            </div>

            {/* Result */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-2">Result</label>
              <div className={`w-full min-h-[120px] p-6 pr-14 bg-slate-900 rounded-xl text-lg font-serif leading-relaxed border border-slate-800 ${isEmpty ? 'text-slate-500 italic' : 'text-amber-100 italic'}`}>
                {displayText}
              </div>
              <button
                onClick={handleCopy}
                disabled={isEmpty}
                className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all"
                title="Copy to clipboard"
              >
                {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
              </button>
            </div>

            {/* Quick examples */}
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Quick examples</p>
              <div className="flex flex-wrap gap-2">
                {['100', '1000', '1000000', '1500000.50', '1000000000', '-250'].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setNumber(ex)}
                    className="px-3 py-1.5 text-sm bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 transition-all font-mono"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}