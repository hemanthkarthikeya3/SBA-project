import React from 'react';
import { X, AlertTriangle, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { ClientProfile } from '../../types';
import { formatINR } from '../../utils/formatters';

interface ARAgingModalProps {
  client: ClientProfile;
  isOpen: boolean;
  onClose: () => void;
  onSelectSolution: () => void;
}

export const ARAgingModal: React.FC<ARAgingModalProps> = ({
  client,
  isOpen,
  onClose,
  onSelectSolution,
}) => {
  if (!isOpen) return null;

  const ar = client.arAging;
  const total = ar.totalOutstanding || 1;
  const pctCurrent = Math.round((ar.current / total) * 100);
  const pct31to60 = Math.round((ar.days31to60 / total) * 100);
  const pct61to90 = Math.round((ar.days61to90 / total) * 100);
  const pct90Plus = Math.round((ar.days90Plus / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#c4c6cf] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center bg-[#f7fafc] rounded-t-lg">
          <div>
            <span className="text-xs font-mono uppercase text-[#74777f]">
              Ledger Deep-Dive
            </span>
            <h2 className="text-lg md:text-xl font-bold text-[#002045]">
              Accounts Receivable Aging Schedule — {client.name}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Aging Distribution Bar */}
          <div>
            <div className="flex justify-between items-center text-xs font-medium text-gray-600 mb-2">
              <span>Total Outstanding AR: <strong>{formatINR(ar.totalOutstanding)}</strong></span>
              <span>Overdue (&gt;30 Days): <strong className="text-red-600">{formatINR(ar.days31to60 + ar.days61to90 + ar.days90Plus)} ({(pct31to60 + pct61to90 + pct90Plus)}%)</strong></span>
            </div>

            <div className="w-full h-5 rounded-full overflow-hidden flex bg-gray-100 border border-gray-200">
              <div style={{ width: `${pctCurrent}%` }} className="bg-emerald-500" title={`Current: ${formatINR(ar.current)}`} />
              <div style={{ width: `${pct31to60}%` }} className="bg-amber-400" title={`31-60 Days: ${formatINR(ar.days31to60)}`} />
              <div style={{ width: `${pct61to90}%` }} className="bg-orange-500" title={`61-90 Days: ${formatINR(ar.days61to90)}`} />
              <div style={{ width: `${pct90Plus}%` }} className="bg-red-600" title={`90+ Days: ${formatINR(ar.days90Plus)}`} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
              <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-mono block">0-30 Days (Current)</span>
                <span className="font-bold text-emerald-950">{formatINR(ar.current)}</span>
                <span className="text-[10px] text-emerald-700 block">({pctCurrent}%)</span>
              </div>
              <div className="p-2 bg-amber-50 rounded border border-amber-200">
                <span className="text-[10px] text-amber-800 font-mono block">31-60 Days Overdue</span>
                <span className="font-bold text-amber-950">{formatINR(ar.days31to60)}</span>
                <span className="text-[10px] text-amber-700 block">({pct31to60}%)</span>
              </div>
              <div className="p-2 bg-orange-50 rounded border border-orange-200">
                <span className="text-[10px] text-orange-800 font-mono block">61-90 Days Overdue</span>
                <span className="font-bold text-orange-950">{formatINR(ar.days61to90)}</span>
                <span className="text-[10px] text-orange-700 block">({pct61to90}%)</span>
              </div>
              <div className="p-2 bg-red-50 rounded border border-red-200">
                <span className="text-[10px] text-red-800 font-mono block">90+ Days Critical</span>
                <span className="font-bold text-red-950">{formatINR(ar.days90Plus)}</span>
                <span className="text-[10px] text-red-700 block">({pct90Plus}%)</span>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div>
            <h3 className="text-sm font-bold text-[#002045] mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#1960a3]" />
              Major Outstanding Invoices & Buyer Concentration (INR)
            </h3>

            <div className="border border-gray-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-mono">
                  <tr>
                    <th className="p-2.5">Invoice #</th>
                    <th className="p-2.5">Debtor / Buyer</th>
                    <th className="p-2.5">Amount (₹)</th>
                    <th className="p-2.5">Due Date</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Ledger Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ar.invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-semibold text-[#002045]">{inv.id}</td>
                      <td className="p-2.5 font-medium">{inv.debtor}</td>
                      <td className="p-2.5 font-bold">{formatINR(inv.amount)}</td>
                      <td className="p-2.5 text-gray-600">{inv.dueDate}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            inv.status === 'Current'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status.includes('Critical')
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-gray-500 max-w-[220px] truncate" title={inv.notes}>
                        {inv.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Advisory Action Box */}
          <div className="bg-[#7db6ff]/10 border border-[#1960a3]/30 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs text-[#002045] uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Recommended Non-Recourse TReDS / Factoring Solution
              </div>
              <p className="text-xs text-[#43474e] mt-1">
                Advance 90% ({formatINR(922500)}) on Whole Foods invoices at 1.15% discount. Eliminates seasonal cash drag without debt covenants.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onSelectSolution();
              }}
              className="px-3.5 py-2 bg-[#1960a3] text-white rounded text-xs font-semibold hover:bg-[#002045] transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>View Product Terms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
