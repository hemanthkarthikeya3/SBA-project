import React, { useState } from 'react';
import { X, Sliders, AlertOctagon, RefreshCw, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';
import { ClientProfile } from '../../types';
import { formatK, formatINR } from '../../utils/formatters';

interface StressTestModalProps {
  client: ClientProfile;
  isOpen: boolean;
  onClose: () => void;
  onApplyStress: (stressParams: { revDrop: number; cogsSurge: number; arDelay: number }) => void;
}

export const StressTestModal: React.FC<StressTestModalProps> = ({
  client,
  isOpen,
  onClose,
  onApplyStress,
}) => {
  if (!isOpen) return null;

  const [revDrop, setRevDrop] = useState(20); // 20% seasonal dip
  const [cogsSurge, setCogsSurge] = useState(12); // 12% freight surge
  const [arDelay, setArDelay] = useState(30); // 30 day delay

  const baseBurn = client.financialKPIs.monthlyBurnRate;
  const baseRunway = client.financialKPIs.runwayMonths;
  const baseBuffer = client.financialKPIs.cashBufferDays;

  // Real-time recalculation
  const monthlyRevenueImpact = (client.financialKPIs.averageMonthlyRevenue * (revDrop / 100)) / 1000;
  const monthlyCostImpact = (baseBurn * (cogsSurge / 100));
  const stressedMonthlyBurn = Math.round(baseBurn + monthlyRevenueImpact + monthlyCostImpact);
  const stressedRunway = Math.max(2, Math.round((baseRunway * baseBurn) / Math.max(1, stressedMonthlyBurn)));
  const stressedBuffer = Math.max(10, Math.round(baseBuffer * (1 - arDelay / 90)));

  const handleApply = () => {
    onApplyStress({ revDrop, cogsSurge, arDelay });
    onClose();
  };

  const handleReset = () => {
    setRevDrop(0);
    setCogsSurge(0);
    setArDelay(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#c4c6cf] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center bg-[#f7fafc] rounded-t-lg">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#1960a3]" />
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#002045]">
                What-If Cash Flow Stress Test Simulator (₹ INR)
              </h2>
              <p className="text-xs text-[#74777f]">
                Simulate macroeconomic and operational shocks on {client.name}'s liquidity in Rupees
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Sliders Area */}
          <div className="space-y-5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            {/* Slider 1: Seasonal Revenue Shock */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1.5">
                <span>Seasonal Revenue Contraction:</span>
                <span className="font-mono text-red-600 font-bold">-{revDrop}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={revDrop}
                onChange={(e) => setRevDrop(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1960a3]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                <span>0% (Normal)</span>
                <span>-20% (Typical Harvest Dip)</span>
                <span>-40% (Severe Trough)</span>
              </div>
            </div>

            {/* Slider 2: Supply Chain / Freight Surge */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1.5">
                <span>COGS & Freight Cost Surge:</span>
                <span className="font-mono text-amber-700 font-bold">+{cogsSurge}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="2"
                value={cogsSurge}
                onChange={(e) => setCogsSurge(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1960a3]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                <span>+0%</span>
                <span>+12% (Current EcoTransit Driver)</span>
                <span>+30% (Fuel Spike)</span>
              </div>
            </div>

            {/* Slider 3: AR Collection Lag */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-800 mb-1.5">
                <span>Debtor AR Collection Delay:</span>
                <span className="font-mono text-orange-700 font-bold">+{arDelay} Days</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={arDelay}
                onChange={(e) => setArDelay(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1960a3]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                <span>+0 Days</span>
                <span>+30 Days (Current Whole Foods Lag)</span>
                <span>+60 Days (Extended Gridlock)</span>
              </div>
            </div>
          </div>

          {/* Stressed Outcome Impact Bento */}
          <div>
            <h3 className="text-xs font-mono font-bold text-[#74777f] uppercase tracking-wider mb-2">
              Stressed Financial Trajectory
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white border border-gray-200 rounded shadow-2xs">
                <span className="text-[10px] text-gray-500 block uppercase font-mono">Monthly Burn</span>
                <span className="text-xl font-bold text-red-600 font-sans">{formatK(stressedMonthlyBurn, true)}</span>
                <span className="text-[10px] text-red-600 block mt-0.5">+{formatK(stressedMonthlyBurn - baseBurn, true)}/mo drag</span>
              </div>

              <div className="p-3 bg-white border border-gray-200 rounded shadow-2xs">
                <span className="text-[10px] text-gray-500 block uppercase font-mono">Cash Runway</span>
                <span className="text-xl font-bold text-[#002045] font-sans">{stressedRunway} Months</span>
                <span className="text-[10px] text-amber-700 block mt-0.5">
                  -{baseRunway - stressedRunway} mos vs baseline
                </span>
              </div>

              <div className="p-3 bg-white border border-gray-200 rounded shadow-2xs">
                <span className="text-[10px] text-gray-500 block uppercase font-mono">Cash Buffer</span>
                <span className="text-xl font-bold text-[#002045] font-sans">{stressedBuffer} Days</span>
                <span className="text-[10px] text-red-600 block mt-0.5">
                  -{baseBuffer - stressedBuffer} days
                </span>
              </div>
            </div>
          </div>

          {/* AI Advisory Prescription */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg text-xs text-emerald-900 leading-relaxed">
            <div className="font-bold mb-1 flex items-center gap-1.5 text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Proactive Banker Mitigation Plan
            </div>
            Under this scenario ({revDrop}% rev dip + {cogsSurge}% cost surge + {arDelay}d AR delay), activating the <strong>₹35 Lakhs TReDS / Receivables Acceleration Line</strong> injects immediate liquidity, neutralizing the {revDrop}% seasonal drop and keeping runway securely above 12 months without covenant breaches.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Parameters</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-2 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-[#002045] text-white rounded text-xs font-bold hover:bg-[#1a365d] transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>Apply Stress to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
