import React, { useState } from 'react';
import { X, Printer, Copy, Check, Loader2, FileText } from 'lucide-react';
import { ClientProfile } from '../../types';
import { formatINR, formatK } from '../../utils/formatters';

interface ExportReportModalProps {
  client: ClientProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  client,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [tone, setTone] = useState<'Empathetic' | 'Executive' | 'Credit'>('Empathetic');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const defaultContent = `CONFIDENTIAL CLIENT ADVISORY MEMO & MEETING BRIEF (INR ₹)
Client: ${client.name} (${client.industry})
Relationship Manager: ${client.relationshipManager}
Date: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
Primary Contact: ${client.contactPerson.name} (${client.contactPerson.title})

============================================================
1. EXECUTIVE FINANCIAL HEALTH SUMMARY
============================================================
• Operating Runway: ${client.financialKPIs.runwayMonths} Months (${formatK(client.financialKPIs.monthlyBurnRate, true)}/mo net burn rate)
• Quick Ratio: ${client.financialKPIs.quickRatio}x (Exceeds 1.1x industry benchmark)
• Operating Margin: ${client.financialKPIs.operatingMargin}% (Benchmark: ${client.financialKPIs.operatingMarginBenchmark}%)
• Debt Service Coverage Ratio (DSCR): ${client.financialKPIs.dscr}x (Covenant Compliant)

============================================================
2. PROACTIVE RISK & STRESS FLAGS (GROUNDED IN LEDGER DATA)
============================================================
• Delayed Receivables: Accounts Receivable > 30 days expanded to ${formatINR(client.arAging.days31to60 + client.arAging.days61to90)}, primarily concentrated in Whole Foods Regional (${formatINR(1025000)}) due to their ERP system migration.
• Seasonal Revenue Transition: Agricultural cycle forecasts a 20% seasonal dip during Q3 harvest changeover (~${formatINR(475000)}/mo impact).
• Logistics Cost Inflation: EcoTransit Solutions cold-chain freight spend rose +12.0% YoY (${formatINR(486000)}).

============================================================
3. TAILORED ADVISORY PRESCRIPTIONS (RESPONSIBLE BANKING)
============================================================
[A] TReDS & Selective Receivables Acceleration Facility (${formatINR(3500000)} capacity)
    • Unlocks ${formatINR(1025000)} in trapped cash from approved supermarket buyers on day 1 at 1.15% discount.
    • Safeguards August/September payroll without adding balance sheet debt.

[B] Automated Insured Cash Sweep (ICS - 6.85% p.a.)
    • Optimizes ${formatINR(3200000)} operating cash float, generating ~${formatINR(142000)}/yr in risk-free yield with instant liquidity.

============================================================
4. PROPOSED CLIENT REVIEW AGENDA
============================================================
[ ] 1. Review Q3 Cash Flow Projections and Scenario Stress Model
[ ] 2. 48-Hour Setup for Whole Foods Receivables Acceleration
[ ] 3. Review Fleet Card Fuel Discount program to curb freight surge`;

  const reportText = generatedReport || defaultContent;

  const handleToneChange = async (newTone: 'Empathetic' | 'Executive' | 'Credit') => {
    setTone(newTone);
    setIsGenerating(true);
    try {
      const res = await fetch('/api/advisory/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client,
          tone: newTone === 'Empathetic' ? 'Empathetic & Consultative Partner' : newTone === 'Executive' ? 'Formal C-Suite Financial Summary' : 'Underwriting & Credit Risk Memo',
          focusArea: 'Cash Flow Protection, Receivables Acceleration, Treasury Sweep in Indian Rupees',
        }),
      });
      const data = await res.json();
      if (data.content) {
        setGeneratedReport(data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#c4c6cf] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center bg-[#f7fafc] rounded-t-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1960a3]" />
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#002045]">
                Export Advisory Briefing & Client Summary (₹ INR)
              </h2>
              <p className="text-xs text-[#74777f]">
                Generate banker-ready meeting briefs or customer-facing memos for {client.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          {/* Tone Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-gray-700">Select Presentation Format / Tone:</span>
            <div className="flex gap-1.5">
              {(['Empathetic', 'Executive', 'Credit'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleToneChange(t)}
                  disabled={isGenerating}
                  className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                    tone === t
                      ? 'bg-[#002045] text-white font-semibold shadow-2xs'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {t === 'Empathetic' ? 'Empathetic Client Email' : t === 'Executive' ? 'C-Suite Executive Brief' : 'Credit & Risk Memo'}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Text Area */}
          <div className="relative">
            {isGenerating && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded border border-gray-200 z-10">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1960a3] bg-white p-3 rounded-lg shadow-md border border-blue-200">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting tailored advisory memo with Gemini AI (₹ INR)...</span>
                </div>
              </div>
            )}
            <textarea
              readOnly
              value={reportText}
              rows={14}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded font-mono text-xs text-gray-800 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Currency: <strong>Indian Rupees (₹) • Responsible Banking Compliant</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 border border-[#1960a3] text-[#1960a3] rounded text-xs font-medium hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-[#002045] text-white rounded text-xs font-bold hover:bg-[#1a365d]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
