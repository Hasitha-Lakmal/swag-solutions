import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { CONFIG } from '../../config';
import SEO from '../../components/SEO';

// ─── FIFO Stock Manager ────────────────────────────────────────────────────────
// Each item has a `batches` array: [{ qty, costPrice, date }]
const fifoDeduct = (batches = [], deductQty) => {
    let remaining = deductQty;
    const newBatches = [...batches.map(b => ({ ...b }))];
    let costOfGoodsSold = 0;

    for (let b of newBatches) {
        if (remaining <= 0) break;
        const take = Math.min(b.qty, remaining);
        costOfGoodsSold += take * b.costPrice;
        b.qty -= take;
        remaining -= take;
    }

    return {
        newBatches: newBatches.filter(b => b.qty > 0),
        costOfGoodsSold,
        fulfilled: remaining === 0
    };
};

const getTotalStock = (batches = []) => batches.reduce((s, b) => s + b.qty, 0);

// ─── Main Component ────────────────────────────────────────────────────────────
const ExcelPOS = ({ onBack }) => {

    const defaultData = {
        shop: { name: '', owner: '', phone: '', email: '', address: '' },
        items: [],
        sales: [],
        grn: [],
        currentGRN: [],
        returns: [],
        settings: { receiptLanguage: 'english', allowNoStock: false, stockMethod: 'fifo' }
    };

    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('posData');
        if (!saved) return defaultData;

        try {
            const parsed = JSON.parse(saved);
            if (parsed.items) {
                parsed.items = parsed.items.map(i => ({
                    ...i,
                    batches: i.batches || (i.stock > 0 ? [{ qty: i.stock, costPrice: i.costPrice || 0, date: new Date().toISOString() }] : [])
                }));
            }
            return { ...defaultData, ...parsed };
        } catch (e) {
            console.error(e);
            return defaultData;
        }
    });
    const [activeTab, setActiveTab] = useState('shop');
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [saleType, setSaleType] = useState('cash');
    const [customerName, setCustomerName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [currentSale, setCurrentSale] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showGposPromo, setShowGposPromo] = useState(true);
    const containerRef = useRef(null);

    // GRN
    const [grnForm, setGrnForm] = useState({ supplier: '', invoice: '', itemIndex: '', qty: '', cost: '' });

    // Returns
    const [returnSearch, setReturnSearch] = useState('');
    const [activeReturnSale, setActiveReturnSale] = useState(null);
    const [returnQuantities, setReturnQuantities] = useState({});
    const [returnReason, setReturnReason] = useState('');

    // Reports
    const [reportDates, setReportDates] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });
    const billCounterRef = useRef(0);

    // Item form
    const [itemForm, setItemForm] = useState({ code: '', name: '', category: '', costPrice: '', sellingPrice: '', stock: '' });

    useEffect(() => {
        localStorage.setItem('posData', JSON.stringify(data));
    }, [data]);

    // Fullscreen handler
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handler = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handler);
        return () => document.removeEventListener('fullscreenchange', handler);
    }, []);

    const filteredItems = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return data.items.filter(i =>
            i.name.toLowerCase().includes(q) || i.code.toLowerCase().includes(q)
        );
    }, [data.items, searchTerm]);

    // ── Item Management ──────────────────────────────────────────────────────────
    const addItem = () => {
        const { code, name, category, costPrice, sellingPrice, stock } = itemForm;
        if (!code || !name) return alert('Item code and name are required!');
        if (data.items.find(i => i.code === code)) return alert('Item code already exists!');

        const qty = parseInt(stock) || 0;
        const cp = parseFloat(costPrice) || 0;

        const newItem = {
            code, name, category,
            costPrice: cp,
            sellingPrice: parseFloat(sellingPrice) || 0,
            stock: qty,
            batches: qty > 0 ? [{ qty, costPrice: cp, date: new Date().toISOString() }] : []
        };

        setData(p => ({ ...p, items: [...p.items, newItem] }));
        setItemForm({ code: '', name: '', category: '', costPrice: '', sellingPrice: '', stock: '' });
    };

    const deleteItem = (code) => {
        if (!confirm('Delete this item?')) return;
        setData(p => ({ ...p, items: p.items.filter(i => i.code !== code) }));
    };

    // ── Cart / POS ───────────────────────────────────────────────────────────────
    const addToCart = (item) => {
        const stock = getTotalStock(item.batches);
        if (!data.settings.allowNoStock && stock <= 0) return alert('Out of stock!');

        setCart(prev => {
            const existing = prev.find(c => c.code === item.code);
            if (existing) {
                if (!data.settings.allowNoStock && existing.quantity >= stock) {
                    alert('Not enough stock!'); return prev;
                }
                return prev.map(c => c.code === item.code ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, { ...item, quantity: 1, discount: 0 }];
        });
    };

    const updateItemDiscount = (code, val) => {
        const discount = parseFloat(val) || 0;
        setCart(prev => prev.map(c => {
            if (c.code !== code) return c;
            const max = c.sellingPrice * c.quantity;
            return { ...c, discount: discount > max ? 0 : discount };
        }));
    };

    const removeFromCart = (code) => setCart(p => p.filter(c => c.code !== code));
    const clearCart = () => setCart([]);

    const cartSubtotal = cart.reduce((s, i) => s + i.sellingPrice * i.quantity, 0);
    const cartDiscounts = cart.reduce((s, i) => s + i.discount, 0);
    const cartTotal = cartSubtotal - cartDiscounts;

    const completeSale = () => {
        if (cart.length === 0) return alert('Cart is empty!');
        if (saleType === 'credit' && !customerName.trim()) return alert('Customer name required for credit sales!');

        // FIFO stock deduction
        const updatedItems = [...data.items.map(i => ({ ...i, batches: [...(i.batches || [])] }))];
        const cogsByItem = {};

        for (const cartItem of cart) {
            const idx = updatedItems.findIndex(i => i.code === cartItem.code);
            if (idx < 0) continue;
            const { newBatches, costOfGoodsSold, fulfilled } = fifoDeduct(updatedItems[idx].batches, cartItem.quantity);
            if (!fulfilled && !data.settings.allowNoStock) {
                return alert(`Not enough stock for ${cartItem.name}!`);
            }
            updatedItems[idx].batches = newBatches;
            updatedItems[idx].stock = getTotalStock(newBatches);
            cogsByItem[cartItem.code] = costOfGoodsSold;
        }

        const saleDate = new Date();
        billCounterRef.current += 1;

        const sale = {
            billNo: `BILL-${saleDate.getTime()}-${billCounterRef.current}`,
            date: saleDate.toISOString(),
            customer: customerName.trim() || 'Walk-in Customer',
            saleType,
            payment: paymentMethod,
            items: cart.map(i => ({ ...i, cogs: cogsByItem[i.code] || 0 })),
            subtotal: cartSubtotal,
            totalDiscounts: cartDiscounts,
            savings: cartDiscounts,
            total: cartTotal,
            returned: false
        };

        setData(p => ({ ...p, sales: [...p.sales, sale], items: updatedItems }));
        setCurrentSale(sale);
        setIsReceiptOpen(true);
        setCart([]);
        setCustomerName('');
    };

    // ── GRN ─────────────────────────────────────────────────────────────────────
    const addGrnItem = () => {
        const { itemIndex, qty, cost } = grnForm;
        if (itemIndex === '' || !qty || !cost) return alert('Fill all GRN fields');
        const item = data.items[itemIndex];
        setData(p => ({
            ...p,
            currentGRN: [...p.currentGRN, {
                name: item.name, code: item.code,
                quantity: parseInt(qty), cost: parseFloat(cost),
                total: parseInt(qty) * parseFloat(cost)
            }]
        }));
        setGrnForm(p => ({ ...p, qty: '', cost: '', itemIndex: '' }));
    };

    const saveGRN = () => {
        if (!grnForm.supplier || !grnForm.invoice) return alert('Enter supplier and invoice number');
        if (data.currentGRN.length === 0) return alert('No items in GRN!');

        const grnRecord = {
            date: new Date().toISOString(),
            supplier: grnForm.supplier,
            invoice: grnForm.invoice,
            items: [...data.currentGRN],
            total: data.currentGRN.reduce((s, i) => s + i.total, 0)
        };

        setData(p => ({
            ...p,
            grn: [...p.grn, grnRecord],
            currentGRN: [],
            items: p.items.map(item => {
                const grnItem = p.currentGRN.find(g => g.code === item.code);
                if (!grnItem) return item;
                const newBatch = { qty: grnItem.quantity, costPrice: grnItem.cost, date: new Date().toISOString() };
                const newBatches = [...(item.batches || []), newBatch];
                return { ...item, batches: newBatches, stock: getTotalStock(newBatches) };
            })
        }));

        setGrnForm({ supplier: '', invoice: '', itemIndex: '', qty: '', cost: '' });
        alert('GRN saved! Stock updated via FIFO.');
    };

    // ── Returns ──────────────────────────────────────────────────────────────────
    const searchBill = () => {
        const sale = data.sales.find(s => s.billNo === returnSearch.trim());
        if (!sale) return alert('Bill not found!');
        if (sale.returned) return alert('This bill has already been returned!');
        setActiveReturnSale(sale);
        const init = {};
        sale.items.forEach(i => init[i.code] = 0);
        setReturnQuantities(init);
    };

    const processReturn = () => {
        const itemsToReturn = activeReturnSale.items.filter(i => returnQuantities[i.code] > 0);
        if (itemsToReturn.length === 0) return alert('Select items to return!');
        if (!returnReason.trim()) return alert('Enter return reason!');

        let returnAmount = 0;
        itemsToReturn.forEach(i => {
            const q = returnQuantities[i.code];
            const avgDisc = i.discount / i.quantity;
            returnAmount += i.sellingPrice * q - avgDisc * q;
        });

        const returnRecord = {
            date: new Date().toISOString(),
            billNo: activeReturnSale.billNo,
            originalSale: { ...activeReturnSale },
            returnedItems: itemsToReturn.map(i => ({ ...i, returnQty: returnQuantities[i.code] })),
            returnAmount,
            reason: returnReason
        };

        setData(p => ({
            ...p,
            returns: [...p.returns, returnRecord],
            sales: p.sales.map(s => s.billNo === activeReturnSale.billNo ? { ...s, returned: true } : s),
            items: p.items.map(item => {
                const ret = itemsToReturn.find(r => r.code === item.code);
                if (!ret) return item;
                const retQty = returnQuantities[item.code];
                // Return stock as new batch (FIFO - returned items go to end)
                const newBatch = { qty: retQty, costPrice: ret.costPrice || item.costPrice, date: new Date().toISOString() };
                const newBatches = [...(item.batches || []), newBatch];
                return { ...item, batches: newBatches, stock: getTotalStock(newBatches) };
            })
        }));

        alert(`Return processed! Refund: Rs. ${returnAmount.toFixed(2)}`);
        setActiveReturnSale(null);
        setReturnSearch('');
        setReturnReason('');
    };

    // ── Reports ──────────────────────────────────────────────────────────────────
    const getReportData = useCallback(() => {
        const from = new Date(reportDates.from);
        const to = new Date(reportDates.to);
        to.setHours(23, 59, 59, 999);

        const periodSales = data.sales.filter(s => {
            const d = new Date(s.date);
            return d >= from && d <= to;
        });

        const cashSales = periodSales.filter(s => s.saleType === 'cash');
        const creditSales = periodSales.filter(s => s.saleType === 'credit');
        const totalRevenue = periodSales.reduce((s, i) => s + i.total, 0);
        const totalCash = cashSales.reduce((s, i) => s + i.total, 0);
        const totalCredit = creditSales.reduce((s, i) => s + i.total, 0);
        const totalSavings = periodSales.reduce((s, i) => s + (i.savings || 0), 0);
        const totalCOGS = periodSales.reduce((s, sale) =>
            s + sale.items.reduce((ss, i) => ss + (i.cogs || 0), 0), 0);
        const grossProfit = totalRevenue - totalCOGS;

        const itemsSold = {};
        periodSales.forEach(sale => sale.items.forEach(i => {
            if (!itemsSold[i.name]) itemsSold[i.name] = { qty: 0, revenue: 0, cogs: 0 };
            itemsSold[i.name].qty += i.quantity;
            itemsSold[i.name].revenue += i.sellingPrice * i.quantity - i.discount;
            itemsSold[i.name].cogs += i.cogs || 0;
        }));

        return { periodSales, cashSales, creditSales, totalRevenue, totalCash, totalCredit, totalSavings, totalCOGS, grossProfit, itemsSold };
    }, [data.sales, reportDates]);

    // ── Print Receipt ────────────────────────────────────────────────────────────
    const printReceipt = (sale) => {
        const lang = data.settings.receiptLanguage || 'english';
        const t = lang === 'sinhala' ? {
            billNo: 'බිල් අංකය', date: 'දිනය', customer: 'ගනුදෙනුකරු',
            payment: 'ගෙවීම', item: 'භාණ්ඩය', qty: 'ප්‍රමාණය',
            price: 'මිල', total: 'එකතුව', subtotal: 'උප එකතුව',
            discounts: 'වට්ටම්', youSave: 'ඉතිරි කිරීම', grandTotal: 'මුළු එකතුව',
            saleType: 'විකුණුම් වර්ගය', cash: 'මුදල් විකුණුම', credit: 'ණය විකුණුම',
            thank: 'ස්තූතියි!'
        } : {
            billNo: 'Bill No', date: 'Date', customer: 'Customer',
            payment: 'Payment', item: 'Item', qty: 'Qty',
            price: 'Price', total: 'Total', subtotal: 'Subtotal',
            discounts: 'Discounts', youSave: 'You Save', grandTotal: 'Grand Total',
            saleType: 'Sale Type', cash: 'Cash Sale', credit: 'Credit Sale',
            thank: 'Thank you!'
        };

        const w = window.open('', '_blank', 'width=400,height=700');
        w.document.write(`<html><head><style>
      body{font-family:'Courier New',monospace;font-size:12px;width:80mm;padding:10px;margin:0}
      .center{text-align:center}.bold{font-weight:bold}.dashed{border-top:1px dashed #000;margin:8px 0}
      .row{display:flex;justify-content:space-between;margin:3px 0}
      .small{font-size:10px}.total-row{font-size:14px;font-weight:bold}
    </style></head><body>
      <div class="center bold" style="font-size:16px">${data.shop.name || 'POS System'}</div>
      <div class="center small">${data.shop.address || ''}</div>
      <div class="center small">${data.shop.phone || ''}</div>
      <div class="dashed"></div>
      <div class="row"><span><b>${t.billNo}:</b></span><span>${sale.billNo}</span></div>
      <div class="row"><span><b>${t.date}:</b></span><span>${new Date(sale.date).toLocaleString()}</span></div>
      <div class="row"><span><b>${t.customer}:</b></span><span>${sale.customer}</span></div>
      <div class="row"><span><b>${t.saleType}:</b></span><span>${sale.saleType === 'credit' ? t.credit : t.cash}</span></div>
      <div class="row"><span><b>${t.payment}:</b></span><span>${sale.payment}</span></div>
      <div class="dashed"></div>
      <div class="row bold"><span>${t.item}</span><span>${t.qty} | ${t.price} | ${t.total}</span></div>
      <div class="dashed"></div>
      ${sale.items.map(i => `
        <div class="row"><span>${i.name}</span><span>${i.quantity} x ${i.sellingPrice.toFixed(2)} = ${(i.sellingPrice * i.quantity - i.discount).toFixed(2)}</span></div>
        ${i.discount > 0 ? `<div class="row small"><span style="padding-left:10px">Discount</span><span>-${i.discount.toFixed(2)}</span></div>` : ''}
      `).join('')}
      <div class="dashed"></div>
      <div class="row"><span>${t.subtotal}</span><span>Rs. ${sale.subtotal.toFixed(2)}</span></div>
      ${sale.totalDiscounts > 0 ? `
        <div class="row"><span>${t.discounts}</span><span>Rs. ${sale.totalDiscounts.toFixed(2)}</span></div>
        <div class="row bold"><span>${t.youSave}</span><span>Rs. ${sale.savings.toFixed(2)}</span></div>
      ` : ''}
      <div class="dashed"></div>
      <div class="row total-row"><span>${t.grandTotal}</span><span>Rs. ${sale.total.toFixed(2)}</span></div>
      <div class="dashed"></div>
      <div class="center" style="margin-top:20px">${t.thank}</div>
      <div class="center small" style="margin-top:10px;color:#666">Powered by SWAG Solutions</div>
    </body></html>`);
        w.document.close();
        w.print();
    };

    const printReport = () => {
        const rd = getReportData();
        const w = window.open('', '_blank', 'width=900,height=700');
        w.document.write(`<html><head><style>
      body{font-family:Arial,sans-serif;padding:30px;max-width:900px;margin:0 auto}
      h1{color:#667eea}table{width:100%;border-collapse:collapse;margin:20px 0}
      th,td{padding:10px;border:1px solid #ddd;text-align:left}th{background:#f5f5f5}
      .stat{display:inline-block;padding:20px;border-radius:8px;margin:10px;min-width:150px;text-align:center}
      .stat h4{font-size:14px;margin:0 0 5px}.stat p{font-size:24px;font-weight:bold;margin:0}
    </style></head><body>
      <div style="text-align:center;border-bottom:3px solid #667eea;padding-bottom:20px;margin-bottom:30px">
        <h1>${data.shop.name || 'POS System'}</h1>
        <p>${data.shop.address} | ${data.shop.phone}</p>
      </div>
      <h2>Sales Report: ${reportDates.from} to ${reportDates.to}</h2>
      <div>
        <div class="stat" style="background:#667eea;color:white"><h4>Total Revenue</h4><p>Rs. ${rd.totalRevenue.toFixed(2)}</p></div>
        <div class="stat" style="background:#10b981;color:white"><h4>Cash Sales</h4><p>Rs. ${rd.totalCash.toFixed(2)}</p></div>
        <div class="stat" style="background:#f59e0b;color:white"><h4>Credit Sales</h4><p>Rs. ${rd.totalCredit.toFixed(2)}</p></div>
        <div class="stat" style="background:#8b5cf6;color:white"><h4>Gross Profit</h4><p>Rs. ${rd.grossProfit.toFixed(2)}</p></div>
        <div class="stat" style="background:#ec4899;color:white"><h4>Customer Savings</h4><p>Rs. ${rd.totalSavings.toFixed(2)}</p></div>
        <div class="stat" style="background:#06b6d4;color:white"><h4>Transactions</h4><p>${rd.periodSales.length}</p></div>
      </div>
      <h3>Items Sold</h3>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Revenue</th><th>COGS (FIFO)</th><th>Profit</th></tr></thead><tbody>
        ${Object.entries(rd.itemsSold).map(([name, d]) => `
          <tr><td>${name}</td><td>${d.qty}</td><td>Rs. ${d.revenue.toFixed(2)}</td>
          <td>Rs. ${d.cogs.toFixed(2)}</td><td>Rs. ${(d.revenue - d.cogs).toFixed(2)}</td></tr>
        `).join('')}
      </tbody></table>
      ${rd.creditSales.length > 0 ? `
        <h3>Credit Sales</h3>
        <table><thead><tr><th>Date</th><th>Bill No</th><th>Customer</th><th>Amount</th></tr></thead><tbody>
          ${rd.creditSales.map(s => `<tr><td>${new Date(s.date).toLocaleDateString()}</td><td>${s.billNo}</td><td>${s.customer}</td><td>Rs. ${s.total.toFixed(2)}</td></tr>`).join('')}
        </tbody></table>
      ` : ''}
      <p style="text-align:center;color:#666;margin-top:50px">Generated: ${new Date().toLocaleString()} | Powered by SWAG Solutions</p>
    </body></html>`);
        w.document.close();
        w.print();
    };

    // ── Excel Export/Import ──────────────────────────────────────────────────────
    const downloadExcel = () => {
        const wb = XLSX.utils.book_new();

        // Shop
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
            ['Shop Name', 'Owner', 'Phone', 'Email', 'Address'],
            [data.shop.name, data.shop.owner, data.shop.phone, data.shop.email, data.shop.address]
        ]), 'Shop Details');

        // Items
        const itemsData = [['Code', 'Name', 'Category', 'Cost Price', 'Selling Price', 'Stock']];
        data.items.forEach(i => itemsData.push([i.code, i.name, i.category, i.costPrice, i.sellingPrice, getTotalStock(i.batches)]));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(itemsData), 'Items');

        // Sales
        const salesData = [['Date', 'Bill No', 'Customer', 'Sale Type', 'Payment', 'Subtotal', 'Discounts', 'Total']];
        data.sales.forEach(s => salesData.push([new Date(s.date).toLocaleString(), s.billNo, s.customer, s.saleType, s.payment, s.subtotal, s.totalDiscounts || 0, s.total]));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(salesData), 'Sales');

        // Credit Sales
        const credit = data.sales.filter(s => s.saleType === 'credit');
        const creditData = [['Date', 'Bill No', 'Customer', 'Amount', 'Status']];
        credit.forEach(s => creditData.push([new Date(s.date).toLocaleString(), s.billNo, s.customer, s.total, s.returned ? 'Returned' : 'Active']));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(creditData), 'Credit Sales');

        // GRN
        const grnData = [['Date', 'Supplier', 'Invoice', 'Total']];
        data.grn.forEach(g => grnData.push([new Date(g.date).toLocaleString(), g.supplier, g.invoice, g.total]));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(grnData), 'GRN');

        // Returns
        const retData = [['Date', 'Bill No', 'Customer', 'Return Amount', 'Reason']];
        data.returns.forEach(r => retData.push([new Date(r.date).toLocaleString(), r.billNo, r.originalSale.customer, r.returnAmount, r.reason]));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(retData), 'Returns');

        // Raw backup
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([[JSON.stringify(data)]]), 'RawData');

        XLSX.writeFile(wb, `POS_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const uploadExcel = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const wb = XLSX.read(ev.target.result, { type: 'binary' });
                if (wb.SheetNames.includes('RawData')) {
                    const raw = XLSX.utils.sheet_to_json(wb.Sheets['RawData'], { header: 1 });
                    if (raw[0]?.[0]) {
                        const parsed = JSON.parse(raw[0][0]);
                        if (parsed.items) {
                            parsed.items = parsed.items.map(i => ({
                                ...i,
                                batches: i.batches || (i.stock > 0 ? [{ qty: i.stock, costPrice: i.costPrice || 0, date: new Date().toISOString() }] : [])
                            }));
                        }
                        setData(parsed);
                        alert('Data imported successfully!');
                        return;
                    }
                }
                alert('Could not find valid data in file.');
            } catch (err) { alert('Error: ' + err.message); }
        };
        reader.readAsBinaryString(file);
    };

    const clearAllData = () => {
        if (!confirm('Delete ALL data? This cannot be undone!')) return;
        if (!confirm('Are you absolutely sure?')) return;
        localStorage.removeItem('posData');
        setData(defaultData);
        setCart([]);
        alert('All data cleared.');
    };

    // ── Styles ───────────────────────────────────────────────────────────────────
    const styles = {
        app: {
            minHeight: 'calc(100vh - 80px)',
            background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
            color: '#e2e8f0',
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            display: 'flex',
            flexDirection: 'column'
        },
        header: {
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100
        },
        layout: { display: 'flex', flex: 1 },
        sidebar: {
            width: '200px',
            background: 'rgba(0,0,0,0.3)',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            padding: '20px 12px',
            flexShrink: 0
        },
        content: { flex: 1, padding: '28px', overflowY: 'auto' },
        navBtn: (active) => ({
            width: '100%',
            padding: '11px 16px',
            marginBottom: '6px',
            background: active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
            color: active ? '#fff' : 'rgba(255,255,255,0.6)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            textAlign: 'left',
            fontWeight: active ? '600' : '400',
            fontSize: '13px',
            letterSpacing: '0.5px',
            transition: 'all 0.2s'
        }),
        glass: {
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '24px'
        },
        input: {
            width: '100%',
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            color: '#e2e8f0',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box'
        },
        label: { display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' },
        btn: (variant = 'default') => ({
            padding: '10px 20px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            transition: 'all 0.2s',
            ...(variant === 'primary' ? { background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff' } :
                variant === 'success' ? { background: '#10b981', color: '#fff' } :
                    variant === 'danger' ? { background: '#ef4444', color: '#fff' } :
                        variant === 'warning' ? { background: '#f59e0b', color: '#fff' } :
                            { background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.15)' })
        }),
        table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
        th: { padding: '12px', textAlign: 'left', background: 'rgba(255,255,255,0.05)', fontSize: '12px', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.08)' },
        td: { padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#e2e8f0' },
        card: (color = '#667eea') => ({
            background: `linear-gradient(135deg, ${color}22, ${color}11)`,
            border: `1px solid ${color}44`,
            borderRadius: '14px',
            padding: '20px',
            textAlign: 'center'
        })
    };

    const tabs = [
        { id: 'shop', label: '🏪 Shop' },
        { id: 'items', label: '📦 Items' },
        { id: 'pos', label: '🛒 POS' },
        { id: 'grn', label: '📥 GRN' },
        { id: 'returns', label: '↩️ Returns' },
        { id: 'reports', label: '📊 Reports' },
        { id: 'settings', label: '⚙️ Settings' },
        { id: 'data', label: '💾 Data' }
    ];

    // ── Render ───────────────────────────────────────────────────────────────────
    return (
        <div ref={containerRef} style={styles.app}>
            <SEO 
                title="Free Excel POS System & Stock Manager" 
                description="Free online web-based Excel POS system. Manage sales, inventory via FIFO method, billing, receipt printing, and GRN completely in your browser." 
                keywords="free pos system, excel pos online, free inventory manager, shop billing software, online cashier system, sri lanka pos"
            />
            {/* Header */}
            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>🏪</span>
                    <div>
                        <div style={{ fontWeight: '700', fontSize: '16px' }}>{data.shop.name || 'POS System'}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>SWAG Solutions • FIFO Inventory</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                    <button onClick={toggleFullscreen} style={{ ...styles.btn(), padding: '8px 14px', fontSize: '16px' }} title="Toggle Fullscreen">
                        {isFullscreen ? '⊡' : '⛶'}
                    </button>
                    {onBack && <button onClick={onBack} style={styles.btn()}>← Back</button>}
                </div>
            </div>

            {showGposPromo && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1000,
                    background: 'rgba(2,6,23,0.72)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        width: 'min(560px, 100%)',
                        borderRadius: '20px',
                        border: '1px solid rgba(16,185,129,0.35)',
                        background: 'linear-gradient(145deg, #07111f, #111827)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
                        padding: '28px',
                        color: '#e5e7eb'
                    }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid rgba(16,185,129,0.28)',
                            background: 'rgba(16,185,129,0.12)',
                            color: '#6ee7b7',
                            borderRadius: '10px',
                            padding: '7px 10px',
                            fontSize: '12px',
                            fontWeight: 800,
                            letterSpacing: '0.6px',
                            textTransform: 'uppercase',
                            marginBottom: '16px'
                        }}>
                            GPoS Pro available
                        </div>
                        <h2 style={{ fontSize: '28px', lineHeight: 1.15, margin: '0 0 12px', color: '#fff' }}>
                            Enjoying the free POS? Try our GPoS Pro version.
                        </h2>
                        <p style={{ margin: '0 0 18px', color: 'rgba(229,231,235,0.72)', lineHeight: 1.7, fontSize: '14px' }}>
                            This free POS is good for testing basic billing and Excel workflows.
                            GPoS Pro is the complete web-based system for shops with inventory,
                            accounting reports, setup, customization, training, and support.
                        </p>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '10px',
                            marginBottom: '22px'
                        }}>
                            {['Inventory', 'Reports', 'Support'].map(item => (
                                <div key={item} style={{
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    background: 'rgba(255,255,255,0.06)',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    textAlign: 'center',
                                    fontSize: '12px',
                                    fontWeight: 700
                                }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <a href="/gpos" style={{ ...styles.btn('success'), textDecoration: 'none', padding: '12px 16px' }}>
                                Try GPoS Pro
                            </a>
                            <a
                                href={`https://wa.me/${CONFIG.contact.whatsappNumber}?text=Hi%2C%20I%20tried%20the%20free%20POS%20tool%20and%20want%20to%20know%20about%20GPoS%20Pro.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ ...styles.btn('primary'), textDecoration: 'none', padding: '12px 16px' }}
                            >
                                WhatsApp us
                            </a>
                            <button onClick={() => setShowGposPromo(false)} style={{ ...styles.btn(), padding: '12px 16px' }}>
                                Continue free tool
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={styles.layout}>
                {/* Sidebar */}
                <div style={styles.sidebar}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} style={styles.navBtn(activeTab === t.id)}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div style={styles.content}>

                    {/* ── SHOP TAB ── */}
                    {activeTab === 'shop' && (
                        <div>
                            <h2 style={{ marginBottom: '24px', fontWeight: '700' }}>Shop Setup</h2>
                            <div style={styles.glass}>
                                <h3 style={{ marginBottom: '20px', color: '#a78bfa' }}>Shop Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <Field label="Shop Name" value={data.shop.name} onChange={v => setData(p => ({ ...p, shop: { ...p.shop, name: v } }))} styles={styles} />
                                    <Field label="Owner Name" value={data.shop.owner} onChange={v => setData(p => ({ ...p, shop: { ...p.shop, owner: v } }))} styles={styles} />
                                    <Field label="Phone" value={data.shop.phone} onChange={v => setData(p => ({ ...p, shop: { ...p.shop, phone: v } }))} styles={styles} />
                                    <Field label="Email" value={data.shop.email} onChange={v => setData(p => ({ ...p, shop: { ...p.shop, email: v } }))} styles={styles} />
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <Field label="Address" value={data.shop.address} onChange={v => setData(p => ({ ...p, shop: { ...p.shop, address: v } }))} styles={styles} area />
                                    </div>
                                </div>
                                <button style={{ ...styles.btn('primary'), marginTop: '16px' }}
                                    onClick={() => { localStorage.setItem('posData', JSON.stringify(data)); alert('Shop details saved!'); }}>
                                    Save Shop Details
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── ITEMS TAB ── */}
                    {activeTab === 'items' && (
                        <div>
                            <h2 style={{ marginBottom: '24px', fontWeight: '700' }}>Items Management</h2>
                            <div style={styles.glass}>
                                <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>Add New Item</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                                    <Field label="Item Code" value={itemForm.code} onChange={v => setItemForm(p => ({ ...p, code: v }))} styles={styles} />
                                    <Field label="Item Name" value={itemForm.name} onChange={v => setItemForm(p => ({ ...p, name: v }))} styles={styles} />
                                    <Field label="Category" value={itemForm.category} onChange={v => setItemForm(p => ({ ...p, category: v }))} styles={styles} />
                                    <Field label="Cost Price" type="number" value={itemForm.costPrice} onChange={v => setItemForm(p => ({ ...p, costPrice: v }))} styles={styles} />
                                    <Field label="Selling Price" type="number" value={itemForm.sellingPrice} onChange={v => setItemForm(p => ({ ...p, sellingPrice: v }))} styles={styles} />
                                    <Field label="Initial Stock" type="number" value={itemForm.stock} onChange={v => setItemForm(p => ({ ...p, stock: v }))} styles={styles} />
                                </div>
                                <button style={{ ...styles.btn('primary'), marginTop: '16px' }} onClick={addItem}>Add Item</button>
                            </div>

                            <div style={{ ...styles.glass, marginTop: '20px' }}>
                                <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>Item List ({data.items.length})</h3>
                                {data.items.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.4)' }}>No items yet.</p> : (
                                    <table style={styles.table}>
                                        <thead><tr>
                                            {['Code', 'Name', 'Category', 'Cost', 'Selling', 'Stock', 'Batches', 'Action'].map(h => (
                                                <th key={h} style={styles.th}>{h}</th>
                                            ))}
                                        </tr></thead>
                                        <tbody>
                                            {data.items.map(item => (
                                                <tr key={item.code}>
                                                    <td style={styles.td}>{item.code}</td>
                                                    <td style={styles.td}>{item.name}</td>
                                                    <td style={styles.td}>{item.category}</td>
                                                    <td style={styles.td}>Rs. {item.costPrice?.toFixed(2)}</td>
                                                    <td style={styles.td}>Rs. {item.sellingPrice?.toFixed(2)}</td>
                                                    <td style={{ ...styles.td, color: getTotalStock(item.batches) <= 0 ? '#ef4444' : '#10b981' }}>
                                                        {getTotalStock(item.batches)}
                                                    </td>
                                                    <td style={{ ...styles.td, fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                                                        {(item.batches || []).length} batch(es)
                                                    </td>
                                                    <td style={styles.td}>
                                                        <button style={{ ...styles.btn('danger'), padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteItem(item.code)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── POS TAB ── */}
                    {activeTab === 'pos' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', height: 'calc(100vh - 160px)' }}>
                            {/* Left: Items */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <input
                                        type="text" placeholder="🔍 Search by name or code..."
                                        style={{ ...styles.input, flex: 1, padding: '12px 16px', fontSize: '15px' }}
                                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>
                                        <input type="checkbox" id="nostock" checked={data.settings.allowNoStock}
                                            onChange={e => setData(p => ({ ...p, settings: { ...p.settings, allowNoStock: e.target.checked } }))}
                                            style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                                        <label htmlFor="nostock" style={{ fontSize: '12px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>Bill w/o Stock</label>
                                    </div>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
                                    {filteredItems.map(item => {
                                        const stock = getTotalStock(item.batches);
                                        const canAdd = data.settings.allowNoStock || stock > 0;
                                        return (
                                            <div key={item.code}
                                                onClick={() => canAdd && addToCart(item)}
                                                style={{
                                                    background: canAdd ? 'linear-gradient(135deg, rgba(102,126,234,0.2), rgba(118,75,162,0.2))' : 'rgba(255,255,255,0.03)',
                                                    border: `1px solid ${canAdd ? 'rgba(102,126,234,0.4)' : 'rgba(255,255,255,0.06)'}`,
                                                    borderRadius: '14px',
                                                    padding: '16px 12px',
                                                    textAlign: 'center',
                                                    cursor: canAdd ? 'pointer' : 'not-allowed',
                                                    opacity: canAdd ? 1 : 0.5,
                                                    transition: 'all 0.2s',
                                                    userSelect: 'none'
                                                }}>
                                                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>{item.name}</div>
                                                <div style={{ color: '#a78bfa', fontWeight: '700', fontSize: '15px' }}>Rs. {item.sellingPrice?.toFixed(2)}</div>
                                                <div style={{ fontSize: '11px', marginTop: '4px', color: stock <= 0 ? '#ef4444' : '#10b981' }}>
                                                    {stock <= 0 ? '⚠ Out of Stock' : `Stock: ${stock}`}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right: Cart */}
                            <div style={{ ...styles.glass, display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', overflowY: 'auto' }}>
                                <h3 style={{ color: '#a78bfa', margin: 0 }}>🛒 Cart ({cart.length})</h3>
                                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {cart.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '40px' }}>Cart is empty</p> :
                                        cart.map(item => (
                                            <div key={item.code} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                    <span style={{ fontWeight: '600', fontSize: '13px' }}>{item.name}</span>
                                                    <button onClick={() => removeFromCart(item.code)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>×</button>
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '6px' }}>
                                                    Rs. {item.sellingPrice?.toFixed(2)} × {item.quantity} = Rs. {(item.sellingPrice * item.quantity - item.discount).toFixed(2)}
                                                </div>
                                                <input type="number" placeholder="Discount" value={item.discount || ''}
                                                    onChange={e => updateItemDiscount(item.code, e.target.value)}
                                                    style={{ ...styles.input, padding: '6px 10px', fontSize: '12px', width: '120px' }} />
                                            </div>
                                        ))
                                    }
                                </div>

                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                                        <span>Subtotal</span><span>Rs. {cartSubtotal.toFixed(2)}</span>
                                    </div>
                                    {cartDiscounts > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#f59e0b', marginBottom: '4px' }}>
                                            <span>Discounts</span><span>-Rs. {cartDiscounts.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', marginTop: '8px' }}>
                                        <span>Total</span><span style={{ color: '#a78bfa' }}>Rs. {cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div>
                                    <label style={styles.label}>Sale Type</label>
                                    <select value={saleType} onChange={e => setSaleType(e.target.value)} style={{ ...styles.input }}>
                                        <option value="cash">Cash Sale</option>
                                        <option value="credit">Credit Sale</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={styles.label}>Customer Name {saleType === 'credit' && <span style={{ color: '#ef4444' }}>*</span>}</label>
                                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                                        placeholder="Enter customer name" style={styles.input} />
                                </div>
                                <div>
                                    <label style={styles.label}>Payment Method</label>
                                    <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ ...styles.input }}>
                                        <option>Cash</option>
                                        <option>Card</option>
                                        <option>Bank Transfer</option>
                                    </select>
                                </div>

                                <button style={{ ...styles.btn('success'), width: '100%', padding: '14px' }} onClick={completeSale}>
                                    ✓ Complete Sale
                                </button>
                                <button style={{ ...styles.btn('danger'), width: '100%' }} onClick={clearCart}>
                                    Clear Cart
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── GRN TAB ── */}
                    {activeTab === 'grn' && (
                        <div>
                            <h2 style={{ marginBottom: '24px', fontWeight: '700' }}>Goods Received Note (GRN)</h2>
                            <div style={{ ...styles.glass, marginBottom: '20px' }}>
                                <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>New GRN Entry</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '16px' }}>
                                    <Field label="Supplier Name" value={grnForm.supplier} onChange={v => setGrnForm(p => ({ ...p, supplier: v }))} styles={styles} />
                                    <Field label="Invoice Number" value={grnForm.invoice} onChange={v => setGrnForm(p => ({ ...p, invoice: v }))} styles={styles} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                                    <div>
                                        <label style={styles.label}>Select Item</label>
                                        <select value={grnForm.itemIndex} onChange={e => setGrnForm(p => ({ ...p, itemIndex: e.target.value }))} style={styles.input}>
                                            <option value="">Choose item...</option>
                                            {data.items.map((i, idx) => <option key={i.code} value={idx}>{i.name} ({i.code})</option>)}
                                        </select>
                                    </div>
                                    <Field label="Quantity" type="number" value={grnForm.qty} onChange={v => setGrnForm(p => ({ ...p, qty: v }))} styles={styles} />
                                    <Field label="Unit Cost (Rs.)" type="number" value={grnForm.cost} onChange={v => setGrnForm(p => ({ ...p, cost: v }))} styles={styles} />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                                    <button style={styles.btn('primary')} onClick={addGrnItem}>+ Add to GRN</button>
                                    <button style={styles.btn('success')} onClick={saveGRN}>Save GRN & Update Stock</button>
                                </div>
                            </div>

                            {data.currentGRN.length > 0 && (
                                <div style={{ ...styles.glass, marginBottom: '20px' }}>
                                    <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>Current GRN Items</h3>
                                    <table style={styles.table}>
                                        <thead><tr>{['Item', 'Code', 'Quantity', 'Unit Cost', 'Total'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                                        <tbody>
                                            {data.currentGRN.map((i, idx) => (
                                                <tr key={idx}>
                                                    <td style={styles.td}>{i.name}</td>
                                                    <td style={styles.td}>{i.code}</td>
                                                    <td style={styles.td}>{i.quantity}</td>
                                                    <td style={styles.td}>Rs. {i.cost?.toFixed(2)}</td>
                                                    <td style={styles.td}>Rs. {i.total?.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div style={styles.glass}>
                                <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>GRN History</h3>
                                {data.grn.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.4)' }}>No GRN records yet.</p> : (
                                    <table style={styles.table}>
                                        <thead><tr>{['Date', 'Supplier', 'Invoice', 'Items', 'Total'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                                        <tbody>
                                            {data.grn.map((g, i) => (
                                                <tr key={i}>
                                                    <td style={styles.td}>{new Date(g.date).toLocaleDateString()}</td>
                                                    <td style={styles.td}>{g.supplier}</td>
                                                    <td style={styles.td}>{g.invoice}</td>
                                                    <td style={styles.td}>{g.items.length}</td>
                                                    <td style={styles.td}>Rs. {g.total?.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── RETURNS TAB ── */}
                    {activeTab === 'returns' && (
                        <div>
                            <h2 style={{ marginBottom: '24px', fontWeight: '700' }}>Process Returns</h2>
                            <div style={{ ...styles.glass, marginBottom: '20px' }}>
                                <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>Search Bill</h3>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input type="text" placeholder="Enter Bill Number (e.g. BILL-123456)"
                                        value={returnSearch} onChange={e => setReturnSearch(e.target.value)}
                                        style={{ ...styles.input, flex: 1 }} />
                                    <button style={styles.btn('primary')} onClick={searchBill}>Search</button>
                                </div>
                            </div>

                            {activeReturnSale && (
                                <div style={styles.glass}>
                                    <h3 style={{ marginBottom: '12px', color: '#a78bfa' }}>Bill: {activeReturnSale.billNo}</h3>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                                        Customer: {activeReturnSale.customer} | Date: {new Date(activeReturnSale.date).toLocaleString()}
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>
                                        Sale Type: {activeReturnSale.saleType === 'credit' ? 'Credit Sale' : 'Cash Sale'} | Total: Rs. {activeReturnSale.total?.toFixed(2)}
                                    </p>
                                    <table style={{ ...styles.table, marginBottom: '20px' }}>
                                        <thead><tr>{['Item', 'Sold Qty', 'Price', 'Return Qty'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                                        <tbody>
                                            {activeReturnSale.items.map(item => (
                                                <tr key={item.code}>
                                                    <td style={styles.td}>{item.name}</td>
                                                    <td style={styles.td}>{item.quantity}</td>
                                                    <td style={styles.td}>Rs. {item.sellingPrice?.toFixed(2)}</td>
                                                    <td style={styles.td}>
                                                        <input type="number" min="0" max={item.quantity}
                                                            value={returnQuantities[item.code] || 0}
                                                            onChange={e => setReturnQuantities(p => ({ ...p, [item.code]: parseInt(e.target.value) || 0 }))}
                                                            style={{ ...styles.input, width: '80px', padding: '6px 10px' }} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={styles.label}>Return Reason</label>
                                        <textarea value={returnReason} onChange={e => setReturnReason(e.target.value)}
                                            rows="3" placeholder="Enter reason for return..."
                                            style={{ ...styles.input, resize: 'vertical' }} />
                                    </div>
                                    <button style={styles.btn('success')} onClick={processReturn}>Process Return</button>
                                </div>
                            )}

                            {data.returns.length > 0 && (
                                <div style={{ ...styles.glass, marginTop: '20px' }}>
                                    <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>Returns History</h3>
                                    <table style={styles.table}>
                                        <thead><tr>{['Date', 'Bill No', 'Customer', 'Amount', 'Reason'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                                        <tbody>
                                            {data.returns.map((r, i) => (
                                                <tr key={i}>
                                                    <td style={styles.td}>{new Date(r.date).toLocaleDateString()}</td>
                                                    <td style={styles.td}>{r.billNo}</td>
                                                    <td style={styles.td}>{r.originalSale?.customer}</td>
                                                    <td style={styles.td}>Rs. {r.returnAmount?.toFixed(2)}</td>
                                                    <td style={styles.td}>{r.reason}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── REPORTS TAB ── */}
                    {activeTab === 'reports' && (
                        <div>
                            <h2 style={{ marginBottom: '24px', fontWeight: '700' }}>Sales Reports</h2>
                            <div style={{ ...styles.glass, marginBottom: '20px' }}>
                                <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>Date Range</h3>
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={styles.label}>From Date</label>
                                        <input type="date" value={reportDates.from} onChange={e => setReportDates(p => ({ ...p, from: e.target.value }))} style={styles.input} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={styles.label}>To Date</label>
                                        <input type="date" value={reportDates.to} onChange={e => setReportDates(p => ({ ...p, to: e.target.value }))} style={styles.input} />
                                    </div>
                                    <button style={{ ...styles.btn('primary'), height: '40px' }} onClick={() => getReportData()}>Generate Report</button>
                                    <button style={{ ...styles.btn('success'), height: '40px' }} onClick={printReport}>Print Report</button>
                                </div>
                            </div>

                            {(() => {
                                const rd = getReportData();
                                return (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                                            <div style={styles.card('#667eea')}>
                                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Total Revenue</div>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#a78bfa' }}>Rs. {rd.totalRevenue.toFixed(2)}</div>
                                            </div>
                                            <div style={styles.card('#10b981')}>
                                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Cash Sales</div>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#34d399' }}>Rs. {rd.totalCash.toFixed(2)}</div>
                                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{rd.cashSales.length} transactions</div>
                                            </div>
                                            <div style={styles.card('#f59e0b')}>
                                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Credit Sales</div>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#fbbf24' }}>Rs. {rd.totalCredit.toFixed(2)}</div>
                                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{rd.creditSales.length} transactions</div>
                                            </div>
                                            <div style={styles.card('#8b5cf6')}>
                                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Transactions</div>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#c4b5fd' }}>{rd.periodSales.length}</div>
                                            </div>
                                            <div style={styles.card('#06b6d4')}>
                                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Gross Profit (FIFO)</div>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#67e8f9' }}>Rs. {rd.grossProfit.toFixed(2)}</div>
                                            </div>
                                            <div style={styles.card('#ec4899')}>
                                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>Customer Savings</div>
                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#f9a8d4' }}>Rs. {rd.totalSavings.toFixed(2)}</div>
                                            </div>
                                        </div>

                                        <div style={{ ...styles.glass, marginBottom: '20px' }}>
                                            <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>Items Sold</h3>
                                            {Object.keys(rd.itemsSold).length === 0 ? <p style={{ color: 'rgba(255,255,255,0.4)' }}>No data for selected period.</p> : (
                                                <table style={styles.table}>
                                                    <thead><tr>{['Item', 'Qty Sold', 'Revenue', 'COGS (FIFO)', 'Profit'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                                                    <tbody>
                                                        {Object.entries(rd.itemsSold).map(([name, d]) => (
                                                            <tr key={name}>
                                                                <td style={styles.td}>{name}</td>
                                                                <td style={styles.td}>{d.qty}</td>
                                                                <td style={styles.td}>Rs. {d.revenue.toFixed(2)}</td>
                                                                <td style={styles.td}>Rs. {d.cogs.toFixed(2)}</td>
                                                                <td style={{ ...styles.td, color: (d.revenue - d.cogs) >= 0 ? '#10b981' : '#ef4444' }}>
                                                                    Rs. {(d.revenue - d.cogs).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>

                                        {rd.creditSales.length > 0 && (
                                            <div style={styles.glass}>
                                                <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>Credit Sales Details</h3>
                                                <table style={styles.table}>
                                                    <thead><tr>{['Date', 'Bill No', 'Customer', 'Amount', 'Status'].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                                                    <tbody>
                                                        {rd.creditSales.map(s => (
                                                            <tr key={s.billNo}>
                                                                <td style={styles.td}>{new Date(s.date).toLocaleDateString()}</td>
                                                                <td style={styles.td}>{s.billNo}</td>
                                                                <td style={styles.td}>{s.customer}</td>
                                                                <td style={styles.td}>Rs. {s.total.toFixed(2)}</td>
                                                                <td style={{ ...styles.td, color: s.returned ? '#ef4444' : '#10b981' }}>
                                                                    {s.returned ? 'Returned' : 'Active'}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    )}

                    {/* ── SETTINGS TAB ── */}
                    {activeTab === 'settings' && (
                        <div>
                            <h2 style={{ marginBottom: '24px', fontWeight: '700' }}>Settings</h2>
                            <div style={styles.glass}>
                                <h3 style={{ marginBottom: '20px', color: '#a78bfa' }}>Receipt & Inventory Settings</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={styles.label}>Receipt Language</label>
                                        <select value={data.settings.receiptLanguage}
                                            onChange={e => setData(p => ({ ...p, settings: { ...p.settings, receiptLanguage: e.target.value } }))}
                                            style={styles.input}>
                                            <option value="english">English</option>
                                            <option value="sinhala">සිංහල (Sinhala)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={styles.label}>Stock Valuation Method</label>
                                        <select value={data.settings.stockMethod || 'fifo'}
                                            onChange={e => setData(p => ({ ...p, settings: { ...p.settings, stockMethod: e.target.value } }))}
                                            style={styles.input}>
                                            <option value="fifo">FIFO (First In, First Out)</option>
                                        </select>
                                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
                                            FIFO deducts oldest stock first, enabling accurate profit calculations.
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <input type="checkbox" id="allowNoStockSettings" checked={data.settings.allowNoStock}
                                            onChange={e => setData(p => ({ ...p, settings: { ...p.settings, allowNoStock: e.target.checked } }))}
                                            style={{ width: '18px', height: '18px' }} />
                                        <div>
                                            <label htmlFor="allowNoStockSettings" style={{ cursor: 'pointer', fontWeight: '600' }}>Allow Billing Without Stock</label>
                                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>Allow sales even when stock is 0</p>
                                        </div>
                                    </div>
                                </div>
                                <button style={{ ...styles.btn('primary'), marginTop: '20px' }}
                                    onClick={() => { localStorage.setItem('posData', JSON.stringify(data)); alert('Settings saved!'); }}>
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── DATA TAB ── */}
                    {activeTab === 'data' && (
                        <div>
                            <h2 style={{ marginBottom: '24px', fontWeight: '700' }}>Data Management</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                <div style={styles.glass}>
                                    <h3 style={{ marginBottom: '12px', color: '#10b981' }}>📥 Export</h3>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                                        Download all data as Excel file including shop, items, sales, GRN, returns and raw backup.
                                    </p>
                                    <button style={styles.btn('success')} onClick={downloadExcel}>Download Excel</button>
                                </div>
                                <div style={styles.glass}>
                                    <h3 style={{ marginBottom: '12px', color: '#667eea' }}>📤 Import</h3>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                                        Upload a previously exported Excel file to restore all data.
                                    </p>
                                    <label style={{ ...styles.btn('primary'), display: 'inline-block', cursor: 'pointer' }}>
                                        Upload Excel
                                        <input type="file" accept=".xlsx,.xls" onChange={uploadExcel} style={{ display: 'none' }} />
                                    </label>
                                </div>
                                <div style={styles.glass}>
                                    <h3 style={{ marginBottom: '12px', color: '#ef4444' }}>⚠️ Clear Data</h3>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                                        Permanently delete all data. This action cannot be undone!
                                    </p>
                                    <button style={styles.btn('danger')} onClick={clearAllData}>Clear All Data</button>
                                </div>
                            </div>

                            <div style={{ ...styles.glass, marginTop: '20px' }}>
                                <h3 style={{ marginBottom: '16px', color: '#a78bfa' }}>Database Summary</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                    {[
                                        { label: 'Items', value: data.items.length, color: '#667eea' },
                                        { label: 'Sales', value: data.sales.length, color: '#10b981' },
                                        { label: 'GRN Records', value: data.grn.length, color: '#f59e0b' },
                                        { label: 'Returns', value: data.returns.length, color: '#ef4444' }
                                    ].map(s => (
                                        <div key={s.label} style={{ background: `${s.color}22`, border: `1px solid ${s.color}44`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '28px', fontWeight: '700', color: s.color }}>{s.value}</div>
                                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ── Receipt Modal ── */}
            {isReceiptOpen && currentSale && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ ...styles.glass, width: '420px', textAlign: 'center', padding: '32px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                        <h2 style={{ marginBottom: '4px' }}>Sale Complete!</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>{currentSale.billNo}</p>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>Customer: {currentSale.customer}</p>
                        <p style={{ fontSize: '22px', fontWeight: '700', color: '#a78bfa', marginBottom: '24px' }}>Rs. {currentSale.total.toFixed(2)}</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{ ...styles.btn('primary'), flex: 1, padding: '12px' }} onClick={() => printReceipt(currentSale)}>🖨️ Print Receipt</button>
                            <button style={{ ...styles.btn(), flex: 1, padding: '12px' }} onClick={() => setIsReceiptOpen(false)}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Field Helper Component ────────────────────────────────────────────────────
const Field = ({ label, value, onChange, styles, area, type = 'text' }) => (
    <div>
        <label style={styles.label}>{label}</label>
        {area ? (
            <textarea value={value || ''} onChange={e => onChange(e.target.value)}
                style={{ ...styles.input, resize: 'vertical' }} rows="3" />
        ) : (
            <input type={type} value={value || ''} onChange={e => onChange(e.target.value)}
                style={styles.input} />
        )}
    </div>
);

export default ExcelPOS;
