import React, { useState } from 'react';
import { X, Sparkles, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';
import { ClientProfile, RiskAlert, AdvisoryRecommendation, CashFlowPoint } from '../../types';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (
    client: ClientProfile,
    alerts?: RiskAlert[],
    recs?: AdvisoryRecommendation[],
    cashFlow?: CashFlowPoint[]
  ) => void;
}

export const NewAnalysisModal: React.FC<NewAnalysisModalProps> = ({
  isOpen,
  onClose,
  onClientCreated,
}) => {
  if (!isOpen) return null;

  const [companyName, setCompanyName] = useState('Cascade Artisan Roasters');
  const [industry, setIndustry] = useState('Specialty Coffee & Cafe Roastery');
  const [annualRevenue, setAnnualRevenue] = useState('₹1,95,00,000 (₹1.95 Cr)');
  const [quickRatio, setQuickRatio] = useState('1.25');
  const [burnRate, setBurnRate] = useState('32');
  const [notes, setNotes] = useState('Wholesale grocery expansion causing 45-day payment cycles with major buyers.');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/advisory/analyze-new-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          industry,
          annualRevenue,
          quickRatio,
          burnRate,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('AI analysis failed. Please try again.');
      }

      const data = await response.json();

      const newClient: ClientProfile = {
        id: `client-${Date.now()}`,
        name: companyName,
        industry: industry,
        clientSince: new Date().getFullYear(),
        riskTier: data.riskTier || 'Moderate',
        annualRevenue: annualRevenue,
        employees: data.employees || 15,
        contactPerson: data.contactPerson || {
          name: 'Executive Contact',
          title: 'Founder & CEO',
          email: `contact@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
          phone: '+91 98450 12890',
        },
        relationshipManager: 'Marcus Vance, VP Commercial Banking',
        accountNumbers: {
          operatingChecking: `****-${Math.floor(1000 + Math.random() * 9000)}`,
          treasuryMoneyMarket: `****-${Math.floor(1000 + Math.random() * 9000)}`,
          activeCreditLine: `****-${Math.floor(1000 + Math.random() * 9000)} (₹15 Lakhs limit, ₹0 drawn)`,
        },
        tags: data.tags || [industry, 'MSME Growth'],
        businessDescription: data.businessDescription,
        financialKPIs: data.financialKPIs,
        arAging: data.arAging,
        vendorCostDrivers: data.vendorCostDrivers,
        cashFlowTrajectory: data.cashFlowTrajectory,
      };

      onClientCreated(newClient, data.riskAlerts, data.recommendations, data.cashFlowTrajectory);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error generating diagnostic analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg max-w-xl w-full border border-[#c4c6cf] shadow-xl flex flex-col">
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center bg-[#f7fafc] rounded-t-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1960a3]" />
            <div>
              <h2 className="text-lg font-bold text-[#002045]">
                AI Client Financial Intake & Diagnosis (₹ INR)
              </h2>
              <p className="text-xs text-[#74777f]">
                Gemini analyzes business parameters and generates an underwriting profile
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRunAnalysis} className="p-4 md:p-6 space-y-4 text-xs">
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-slate-50/60 hover:bg-slate-50 cursor-pointer">
            <FileSpreadsheet className="w-8 h-8 text-[#1960a3] mx-auto mb-1 opacity-80" />
            <span className="font-semibold text-gray-800 block text-xs">
              Upload Tally / Zoho / GST Return / Bank Statement CSV
            </span>
            <span className="text-[10px] text-gray-500">
              AI automatically extracts financials, maps AR aging, and forecasts seasonal cash flow
            </span>
          </div>

          <div className="text-center font-mono text-[10px] text-gray-400 uppercase tracking-wider">
            Or Provide Business Parameters
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Company / Entity Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1960a3] outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Industry Sector</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1960a3] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Annual Turnover (₹)</label>
              <input
                type="text"
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1960a3] outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Quick Ratio</label>
              <input
                type="number"
                step="0.05"
                value={quickRatio}
                onChange={(e) => setQuickRatio(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1960a3] outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Monthly Burn (₹k)</label>
              <input
                type="number"
                value={burnRate}
                onChange={(e) => setBurnRate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1960a3] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">Operational Observations / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Major buyer payment cycle delays, raw material inflation, upcoming equipment capex..."
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1960a3] outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={analyzing}
              className="px-4 py-1.5 bg-[#002045] text-white rounded font-bold hover:bg-[#1a365d] flex items-center gap-1.5 shadow-2xs disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Gemini Diagnosis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Full AI Assessment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
