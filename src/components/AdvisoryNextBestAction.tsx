import React, { useState } from 'react';
import { Lightbulb, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp, Copy, Check, Send, Sparkles } from 'lucide-react';
import { AdvisoryRecommendation } from '../types';

interface AdvisoryNextBestActionProps {
  recommendations: AdvisoryRecommendation[];
  onDraftClientEmail: (rec: AdvisoryRecommendation) => void;
  onAskCopilotAboutRec: (rec: AdvisoryRecommendation) => void;
}

export const AdvisoryNextBestAction: React.FC<AdvisoryNextBestActionProps> = ({
  recommendations,
  onDraftClientEmail,
  onAskCopilotAboutRec,
}) => {
  const [expandedRecId, setExpandedRecId] = useState<string | null>(recommendations[0]?.id || null);
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedRecId(expandedRecId === id ? null : id);
  };

  const handleCopyPitch = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitchId(id);
    setTimeout(() => setCopiedPitchId(null), 2000);
  };

  return (
    <section id="advisory-next-best-actions" className="bg-white border border-[#c4c6cf]/60 rounded p-4 md:p-6 flex flex-col shadow-xs">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-emerald-50 text-emerald-700">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#002045]">
              Next-Best Advisory Actions
            </h2>
            <p className="text-xs text-[#74777f]">
              Consultative, needs-based financial solutions (Non-Predatory & Explainable)
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          Fair Lending & Suitability Compliant
        </span>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isExpanded = expandedRecId === rec.id;
          return (
            <div
              key={rec.id}
              className={`border rounded-lg transition-all ${
                isExpanded
                  ? 'border-[#1960a3] bg-[#7db6ff]/[0.04] shadow-xs'
                  : 'border-[#c4c6cf]/50 bg-white hover:border-[#1960a3]/60'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer" onClick={() => toggleExpand(rec.id)}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center min-w-[50px] bg-[#002045] text-white rounded p-1.5 text-center">
                    <span className="text-xs font-mono uppercase text-[#adc7f7]">Fit</span>
                    <span className="text-base font-bold leading-tight">{rec.suitabilityScore}%</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1960a3] bg-[#7db6ff]/15 px-2 py-0.5 rounded">
                        {rec.category}
                      </span>
                      <span className="text-xs text-[#74777f]">
                        Product: <strong>{rec.suggestedProduct.name}</strong>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#002045] mt-1">
                      {rec.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDraftClientEmail(rec);
                    }}
                    className="px-3 py-1.5 bg-[#1960a3] text-white text-xs font-semibold rounded hover:bg-[#002045] transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Draft Client Brief</span>
                  </button>
                  <button className="p-1 text-[#74777f] hover:text-[#002045]">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Collapsed summary */}
              {!isExpanded && (
                <div className="px-4 pb-3 text-xs text-[#43474e] flex justify-between items-center border-t border-gray-100 pt-2">
                  <span><strong>Core Benefit:</strong> {rec.keyBenefit}</span>
                  <span className="text-[11px] font-mono text-[#74777f]">Deploy: {rec.suggestedProduct.timeToDeploy}</span>
                </div>
              )}

              {/* Expanded Detailed View */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-[#c4c6cf]/40 pt-3 space-y-4 text-xs md:text-sm">
                  {/* Summary & Client Pitch Box */}
                  <div className="bg-white p-3.5 rounded border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#002045] uppercase tracking-wide flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-[#1960a3]" />
                        Suggested Client Conversation Script
                      </span>
                      <button
                        onClick={() => handleCopyPitch(rec.id, rec.clientPitch)}
                        className="text-xs text-[#1960a3] hover:underline flex items-center gap-1"
                      >
                        {copiedPitchId === rec.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs italic text-[#181c1e] bg-[#f7fafc] p-2.5 rounded border border-gray-100 leading-relaxed font-sans">
                      "{rec.clientPitch}"
                    </p>
                  </div>

                  {/* Why this recommendation? (Explainability section) */}
                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#002045] mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Algorithmic & Policy Explainability ("Why This Action?")
                    </h4>
                    
                    <ul className="space-y-1.5 text-xs text-[#43474e] mb-3 list-disc pl-4">
                      {rec.whyThisRecommendation.underlyingSignals.map((sig, i) => (
                        <li key={i}>{sig}</li>
                      ))}
                    </ul>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs border-t border-slate-200 pt-2 font-mono">
                      <div className="bg-white p-2 rounded border border-slate-100">
                        <span className="text-[10px] text-[#74777f] uppercase block font-semibold">Policy Alignment:</span>
                        <span className="text-[#002045] text-[11px]">{rec.whyThisRecommendation.policyMatch}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-100">
                        <span className="text-[10px] text-[#74777f] uppercase block font-semibold">Responsible Guardrail:</span>
                        <span className="text-emerald-800 text-[11px]">{rec.whyThisRecommendation.responsibleBankingCheck}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-3 text-xs text-[#74777f]">
                      <span>Rate: <strong className="text-[#002045]">{rec.suggestedProduct.rateOrFee}</strong></span>
                      <span>•</span>
                      <span>Capacity: <strong className="text-[#002045]">{rec.suggestedProduct.maxFacility}</strong></span>
                      <span>•</span>
                      <span>Timeline: <strong className="text-[#002045]">{rec.suggestedProduct.timeToDeploy}</strong></span>
                    </div>

                    <button
                      onClick={() => onAskCopilotAboutRec(rec)}
                      className="text-xs text-[#1960a3] hover:text-[#002045] font-semibold underline flex items-center gap-1"
                    >
                      <span>Ask Copilot to analyze terms</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
