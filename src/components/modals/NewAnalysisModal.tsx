import React, { useState } from 'react';
import { X, Sparkles, FileSpreadsheet } from 'lucide-react';
import { ClientProfile } from '../../types';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: ClientProfile) => void;
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
  const [analyzing, setAnalyzing] = useState(false);

  const handleRunAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);

    setTimeout(() => {
      const newClient: ClientProfile = {
        id: `client-${Date.now()}`,
        name: companyName,
        industry: industry,
        clientSince: 2023,
        riskTier: 'Moderate',
        annualRevenue: annualRevenue,
        employees: 14,
        contactPerson: {
          name: 'Lucas Thorne',
          title: 'Founder & CEO',
          email: 'lucas@cascaderoast.in',
          phone: '+91 98450 12890',
        },
        relationshipManager: 'Marcus Vance, VP Commercial Banking',
        accountNumbers: {
          operatingChecking: '****-7719',
          treasuryMoneyMarket: '****-2204',
          activeCreditLine: '****-3310 (₹15 Lakhs limit, ₹0 drawn)',
        },
        tags: ['Specialty Coffee', 'Retail Cafes', 'Green Bean Commodities', 'B2B Wholesale'],
        businessDescription: 'Regional specialty coffee roaster operating 3 flagship cafes with a rapidly expanding wholesale distribution arm supplying boutique grocers.',
        financialKPIs: {
          quickRatio: parseFloat(quickRatio) || 1.25,
          quickRatioYoY: 0.1,
          quickRatioBenchmark: 1.15,
          monthlyBurnRate: parseInt(burnRate, 10) || 32,
          burnRateQoQ: 8,
          runwayMonths: 10,
          operatingMargin: 16,
          operatingMarginTrend: 'flat',
          operatingMarginBenchmark: 14,
          dscr: 1.45,
          dscrBenchmark: 1.25,
          cashBufferDays: 45,
          averageMonthlyRevenue: 1625000,
        },
        arAging: {
          current: 1100000,
          days31to60: 480000,
          days61to90: 190000,
          days90Plus: 50000,
          totalOutstanding: 1820000,
          invoices: [
            {
              id: 'INV-CAR-101',
              debtor: 'Marketplace Pantry Grocers',
              invoiceDate: '2026-06-25',
              dueDate: '2026-07-25',
              daysOverdue: 25,
              amount: 320000,
              status: 'Current',
              notes: 'Weekly wholesale roast deliveries.',
            },
          ],
        },
        vendorCostDrivers: [
          {
            vendor: 'Equatorial Green Coffee Importers',
            category: 'Raw Green Coffee Beans',
            q2Cost: 620000,
            q2CostPriorYear: 530000,
            pctChange: 17.0,
            impactLevel: 'High',
            notes: 'Arabica commodity futures volatility and freight surcharges.',
          },
        ],
      };

      setAnalyzing(false);
      onClientCreated(newClient);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg max-w-xl w-full border border-[#c4c6cf] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center bg-[#f7fafc] rounded-t-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1960a3]" />
            <div>
              <h2 className="text-lg font-bold text-[#002045]">
                New Small Business AI Advisory Intake (₹ INR)
              </h2>
              <p className="text-xs text-[#74777f]">
                Upload financial ledger or enter business profile parameters in Rupees
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleRunAnalysis} className="p-4 md:p-6 space-y-4 text-xs">
          {/* Quick Ledger Drag & Drop Box */}
          <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-slate-50/60 hover:bg-slate-50 cursor-pointer">
            <FileSpreadsheet className="w-8 h-8 text-[#1960a3] mx-auto mb-1 opacity-80" />
            <span className="font-semibold text-gray-800 block text-xs">
              Drag & Drop Bank Ledger CSV / Tally / Zoho / GST Export
            </span>
            <span className="text-[10px] text-gray-500">
              Auto-anonymizes PII, normalizes Indian MSME categories & detects cash flow stress points
            </span>
          </div>

          <div className="text-center font-mono text-[10px] text-gray-400 uppercase tracking-wider">
            — Or Enter Business Profile Details —
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">Company / DBA Name</label>
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
                <span>Generating Diagnostic Analysis...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Advisory Assessment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
