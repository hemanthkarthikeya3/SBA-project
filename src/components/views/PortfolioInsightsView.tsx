import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ClientProfile } from '../../types';

interface PortfolioInsightsViewProps {
  clients: ClientProfile[];
  onSelectClient: (client: ClientProfile) => void;
}

export const PortfolioInsightsView: React.FC<PortfolioInsightsViewProps> = ({
  clients,
  onSelectClient,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#c4c6cf]/60 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
          Portfolio Risk & Advisory Insights
        </h1>
        <p className="text-sm text-[#74777f] mt-1">
          Aggregate financial wellness radar across {clients.length} active small business commercial relationships in Indian Rupees (₹)
        </p>
      </div>

      {/* Aggregate KPI Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c4c6cf]/60 rounded p-4">
          <span className="text-xs font-mono uppercase text-[#74777f]">Total Managed Turnover</span>
          <div className="text-2xl font-bold text-[#002045] mt-1">₹12.35 Cr</div>
          <span className="text-xs text-emerald-700 font-medium">+14% YoY portfolio growth</span>
        </div>
        <div className="bg-white border border-[#c4c6cf]/60 rounded p-4">
          <span className="text-xs font-mono uppercase text-[#74777f]">Weighted Quick Ratio</span>
          <div className="text-2xl font-bold text-[#002045] mt-1">1.43x</div>
          <span className="text-xs text-gray-500 font-medium">Safe vs 1.15x regional benchmark</span>
        </div>
        <div className="bg-white border border-[#c4c6cf]/60 rounded p-4">
          <span className="text-xs font-mono uppercase text-[#74777f]">Active Risk Flags</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">5 Items</div>
          <span className="text-xs text-amber-700 font-medium">2 Delayed AR, 2 Seasonal Dips, 1 Cost Spike</span>
        </div>
      </div>

      {/* Client Portfolio Table with Risk Radar */}
      <div className="bg-white border border-[#c4c6cf]/60 rounded-lg p-5 shadow-xs">
        <h2 className="text-base font-bold text-[#002045] mb-3">
          Small Business Health Matrix (₹ INR)
        </h2>

        <div className="border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-mono">
              <tr>
                <th className="p-3">Client Name</th>
                <th className="p-3">Industry</th>
                <th className="p-3">Risk Tier</th>
                <th className="p-3">Quick Ratio</th>
                <th className="p-3">Runway</th>
                <th className="p-3">Primary Risk Flag</th>
                <th className="p-3 text-right">Advisory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-bold text-[#002045]">{c.name}</td>
                  <td className="p-3 text-gray-600">{c.industry}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] ${
                        c.riskTier === 'Low'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.riskTier === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.riskTier}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-semibold">{c.financialKPIs.quickRatio}x</td>
                  <td className="p-3 font-mono">{c.financialKPIs.runwayMonths} Months</td>
                  <td className="p-3 text-gray-600 max-w-[220px] truncate">
                    {c.id === 'client-gvo'
                      ? 'Whole Foods delayed AR (₹10.25L) + Q3 Dip'
                      : c.id === 'client-apex'
                      ? 'GC Retainage lag + 28d cash buffer'
                      : 'Excess float drag (₹68L idle checking)'}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectClient(c)}
                      className="px-2.5 py-1 bg-[#1960a3] text-white rounded text-[11px] font-semibold hover:bg-[#002045] inline-flex items-center gap-1"
                    >
                      <span>Open Workspace</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
