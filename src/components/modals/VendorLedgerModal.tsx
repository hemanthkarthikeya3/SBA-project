import React from 'react';
import { X, Truck, CheckCircle2 } from 'lucide-react';
import { ClientProfile } from '../../types';
import { formatINR } from '../../utils/formatters';

interface VendorLedgerModalProps {
  client: ClientProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const VendorLedgerModal: React.FC<VendorLedgerModalProps> = ({
  client,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#c4c6cf] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center bg-[#f7fafc] rounded-t-lg">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#1960a3]" />
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#002045]">
                Supplier & Vendor Cost Driver Analysis (₹ INR)
              </h2>
              <p className="text-xs text-[#74777f]">
                Quarterly expense inflation breakdown for {client.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-5">
          <div className="border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-mono">
                <tr>
                  <th className="p-2.5">Vendor / Supplier</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Q2 Spend (₹)</th>
                  <th className="p-2.5">YoY Variance</th>
                  <th className="p-2.5">Driver Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {client.vendorCostDrivers.map((driver, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-[#002045]">{driver.vendor}</td>
                    <td className="p-2.5 text-gray-600">{driver.category}</td>
                    <td className="p-2.5 font-mono font-bold">{formatINR(driver.q2Cost)}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold ${
                          driver.pctChange > 10
                            ? 'bg-red-100 text-red-800'
                            : driver.pctChange > 3
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        +{driver.pctChange}%
                      </span>
                    </td>
                    <td className="p-2.5 text-gray-500 max-w-[220px]">{driver.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#7db6ff]/10 border border-[#1960a3]/30 p-4 rounded-lg space-y-2 text-xs text-[#181c1e]">
            <div className="font-bold text-xs text-[#002045] uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Proactive Banking Advisory Strategy
            </div>
            <p className="leading-relaxed">
              1. <strong>Fuel Surcharge Hedging</strong>: Introduce Green Valley to our Commercial Fleet Card Program with automated 3% rebate on bulk diesel and negotiated logistics carrier rates.
            </p>
            <p className="leading-relaxed">
              2. <strong>Supplier Early-Pay Term Negotiation</strong>: Leverage cash sweep liquidity to take advantage of 2/10 Net 30 vendor prompt-payment discounts on packaging supplies, yielding an annualized 24% effective return.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#002045] text-white rounded text-xs font-semibold hover:bg-[#1a365d]"
            >
              Close Ledger
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
