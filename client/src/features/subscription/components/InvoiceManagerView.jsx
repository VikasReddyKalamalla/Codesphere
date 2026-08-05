import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Receipt, Download, Eye, FileText, CheckCircle2, Printer, X } from 'lucide-react';
import { selectInvoices } from '../redux';

export const InvoiceManagerView = () => {
  const invoices = useSelector(selectInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const sampleInvoices = invoices.length > 0 ? invoices : [
    {
      invoiceNumber: 'INV-2026-009182',
      planName: 'Professional',
      billingCycle: 'yearly',
      amount: 6999,
      tax: 1259,
      total: 8258,
      status: 'paid',
      paymentMethod: 'UPI / Razorpay',
      invoiceDate: new Date().toISOString(),
    },
    {
      invoiceNumber: 'INV-2025-004112',
      planName: 'Student Pro',
      billingCycle: 'monthly',
      amount: 299,
      tax: 53,
      total: 352,
      status: 'paid',
      paymentMethod: 'Credit Card',
      invoiceDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" /> Invoices & Billing Receipts
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Download GST compliant tax invoices and payment receipts</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950/80 text-[#04AA6D] dark:text-emerald-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">GST (18%)</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {sampleInvoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</td>
                  <td className="p-4 capitalize">{inv.planName} ({inv.billingCycle})</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                  <td className="p-4 font-mono">₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 font-mono text-slate-500 dark:text-slate-400">₹{inv.tax.toLocaleString('en-IN')}</td>
                  <td className="p-4 font-mono font-bold text-[#04AA6D] dark:text-emerald-400">₹{inv.total.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-[#04AA6D] dark:text-emerald-300 border border-emerald-500/20 uppercase">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-[#04AA6D] text-slate-700 dark:text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="View Invoice Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice PDF Modal Viewer */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#04AA6D] dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Tax Invoice Preview</h3>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 font-mono text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <div className="text-slate-900 dark:text-white font-bold text-sm">CodeSphere Inc.</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">GSTIN: 29AAAAA0000A1Z5</div>
                </div>
                <div className="text-right">
                  <div className="text-[#04AA6D] dark:text-emerald-400 font-bold">{selectedInvoice.invoiceNumber}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between text-slate-900 dark:text-white font-bold">
                  <span>{selectedInvoice.planName} Plan ({selectedInvoice.billingCycle})</span>
                  <span>₹{selectedInvoice.amount}</span>
                </div>
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>CGST (9%) + SGST (9%)</span>
                  <span>₹{selectedInvoice.tax}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>Grand Total</span>
                <span className="text-[#04AA6D] dark:text-emerald-400">₹{selectedInvoice.total}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={() => {
                  const token = localStorage.getItem('codesphere_token');
                  if (selectedInvoice?._id) {
                    window.open(`/api/payments/invoices/${selectedInvoice._id}/download?token=${token}`, '_blank');
                  } else {
                    alert('Generating downloadable PDF tax invoice...');
                  }
                }}
                className="px-4 py-2 bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
